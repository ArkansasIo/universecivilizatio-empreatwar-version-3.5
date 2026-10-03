import React, { useState } from 'react';
import {
  Users,
  Shield,
  MessageSquare,
  Scale,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Send,
  UserCheck,
  UserPlus,
  UserX,
  Clock,
  DollarSign,
  Gift,
  MapPin,
  Flame,
  Atom,
  Swords,
  Crown,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Building,
  Pin,
  ChevronRight,
  X,
  Package,
  FileText,
  Mail,
  Filter,
} from 'lucide-react';
import { sound } from '../../sound';
import {
  Guild,
  GuildMember,
  GuildPerk,
  GuildRank,
  PlayerFriend,
  DirectMessage,
  PlayerTradeOffer,
  PlayerResources,
  PlayerProfile,
} from '../../types';
import {
  INITIAL_GUILDS,
  INITIAL_FRIENDS,
  INITIAL_DIRECT_MESSAGES,
  INITIAL_PLAYER_TRADES,
  INITIAL_GUILD_PERKS,
} from '../../data/socialGuildData';

interface SocialGuildsViewProps {
  resources: PlayerResources;
  onUpdateResources: (res: Partial<PlayerResources>) => void;
  profile?: PlayerProfile;
  defaultSubTab?: 'guilds' | 'friends' | 'messages' | 'trade';
  onNavigate?: (route: string) => void;
}

export const SocialGuildsView: React.FC<SocialGuildsViewProps> = ({
  resources,
  onUpdateResources,
  profile,
  defaultSubTab = 'guilds',
  onNavigate,
}) => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'guilds' | 'friends' | 'messages' | 'trade'>(defaultSubTab);
  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'warning' | 'info' } | null>(null);

  // Guilds State
  const [guilds, setGuilds] = useState<Guild[]>(() => {
    try {
      const saved = localStorage.getItem('uc_state_guilds');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_GUILDS;
  });

  const [activeGuildId, setActiveGuildId] = useState<string>(() => {
    return localStorage.getItem('uc_player_guild_id') || 'guild-tdc';
  });

  // Friends State
  const [friends, setFriends] = useState<PlayerFriend[]>(() => {
    try {
      const saved = localStorage.getItem('uc_state_friends');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_FRIENDS;
  });

  // Messages State
  const [messages, setMessages] = useState<DirectMessage[]>(() => {
    try {
      const saved = localStorage.getItem('uc_state_direct_messages');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_DIRECT_MESSAGES;
  });
  const [selectedMessageId, setSelectedMessageId] = useState<string>(INITIAL_DIRECT_MESSAGES[0]?.id || '');
  const [messageFilter, setMessageFilter] = useState<'all' | 'direct' | 'guild' | 'distress'>('all');

  // Player Trades State
  const [tradeOffers, setTradeOffers] = useState<PlayerTradeOffer[]>(() => {
    try {
      const saved = localStorage.getItem('uc_state_player_trades');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PLAYER_TRADES;
  });

  // Modals
  const [isCreateGuildOpen, setIsCreateGuildOpen] = useState(false);
  const [isDepositVaultOpen, setIsDepositVaultOpen] = useState(false);
  const [isComposeMsgOpen, setIsComposeMsgOpen] = useState(false);
  const [isCreateTradeOpen, setIsCreateTradeOpen] = useState(false);

  // Forms: Create Guild
  const [newGuildName, setNewGuildName] = useState('');
  const [newGuildTag, setNewGuildTag] = useState('');
  const [newGuildDesc, setNewGuildDesc] = useState('');
  const [newGuildPolicy, setNewGuildPolicy] = useState<'open' | 'approval' | 'invite_only'>('open');

  // Forms: Vault Deposit
  const [depositNaq, setDepositNaq] = useState(100000);
  const [depositMetal, setDepositMetal] = useState(50000);
  const [depositCrystal, setDepositCrystal] = useState(25000);
  const [depositDeut, setDepositDeut] = useState(10000);

  // Forms: Compose Message
  const [msgRecipient, setMsgRecipient] = useState('');
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [msgUrgent, setMsgUrgent] = useState(false);
  const [msgAttachCoords, setMsgAttachCoords] = useState('');
  const [msgGiftNaq, setMsgGiftNaq] = useState(0);

  // Forms: Create Trade
  const [tradeOfferType, setTradeOfferType] = useState<'metal' | 'crystal' | 'deuterium' | 'naquadah'>('metal');
  const [tradeOfferAmount, setTradeOfferAmount] = useState(100000);
  const [tradeRequestType, setTradeRequestType] = useState<'metal' | 'crystal' | 'deuterium' | 'naquadah'>('crystal');
  const [tradeRequestAmount, setTradeRequestAmount] = useState(60000);
  const [tradeTargetPlayer, setTradeTargetPlayer] = useState('');
  const [tradeNote, setTradeNote] = useState('');

  // Searches
  const [guildSearch, setGuildSearch] = useState('');
  const [friendSearch, setFriendSearch] = useState('');
  const [tradeSearch, setTradeSearch] = useState('');

  const triggerNotice = (text: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setNotice({ text, type });
    setTimeout(() => setNotice(null), 4000);
  };

  const saveGuilds = (updated: Guild[]) => {
    setGuilds(updated);
    try {
      localStorage.setItem('uc_state_guilds', JSON.stringify(updated));
    } catch {}
  };

  const saveFriends = (updated: PlayerFriend[]) => {
    setFriends(updated);
    try {
      localStorage.setItem('uc_state_friends', JSON.stringify(updated));
    } catch {}
  };

  const saveMessages = (updated: DirectMessage[]) => {
    setMessages(updated);
    try {
      localStorage.setItem('uc_state_direct_messages', JSON.stringify(updated));
    } catch {}
  };

  const saveTrades = (updated: PlayerTradeOffer[]) => {
    setTradeOffers(updated);
    try {
      localStorage.setItem('uc_state_player_trades', JSON.stringify(updated));
    } catch {}
  };

  // Active player guild
  const playerGuild = guilds.find((g) => g.id === activeGuildId) || null;

  // =========================================================
  // GUILD HANDLERS
  // =========================================================
  const handleCreateGuild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuildName.trim() || !newGuildTag.trim()) return;

    const creationFee = 250000;
    if ((resources.naquadah || 0) < creationFee) {
      sound.play('warning');
      triggerNotice(`Guild charter requires ${creationFee.toLocaleString()} Naquadah in administrative fees.`, 'warning');
      return;
    }

    onUpdateResources({ naquadah: (resources.naquadah || 0) - creationFee });

    const newGuild: Guild = {
      id: `guild-${Date.now()}`,
      name: newGuildName.trim(),
      tag: newGuildTag.startsWith('[') ? newGuildTag.trim() : `[${newGuildTag.trim()}]`,
      leader: profile?.username || 'Commander Tanang',
      crestIcon: 'Shield',
      description: newGuildDesc.trim() || 'A sovereign alliance of star systems.',
      motd: 'Welcome all officers to our new guild alliance.',
      membersCount: 1,
      maxMembers: 30,
      treasury: 100000,
      isOpen: newGuildPolicy === 'open',
      joinPolicy: newGuildPolicy,
      minScoreRequired: 10000,
      createdAt: 'Just now',
      vault: {
        naquadah: 100000,
        metal: 50000,
        crystal: 25000,
        deuterium: 10000,
        darkMatter: 50,
      },
      perks: INITIAL_GUILD_PERKS,
      treaties: [],
      members: [
        {
          id: `m-${Date.now()}`,
          name: profile?.username || 'Commander Tanang',
          rank: 'master',
          roleLabel: 'Supreme Grand Admiral',
          score: 350000,
          fleetPower: 190000,
          joinedDate: 'Founding Member',
          status: 'online',
          donations: { naquadah: 100000, metal: 50000, crystal: 25000, deuterium: 10000 },
        },
      ],
    };

    const nextGuilds = [newGuild, ...guilds];
    saveGuilds(nextGuilds);
    setActiveGuildId(newGuild.id);
    localStorage.setItem('uc_player_guild_id', newGuild.id);
    setIsCreateGuildOpen(false);
    sound.play('confirm');
    triggerNotice(`Sovereign Guild "${newGuild.name}" ${newGuild.tag} chartered successfully!`, 'success');
  };

  const handleDepositToVault = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerGuild) return;

    if (
      (resources.naquadah || 0) < depositNaq ||
      (resources.metal || 0) < depositMetal ||
      (resources.crystal || 0) < depositCrystal ||
      (resources.deuterium || 0) < depositDeut
    ) {
      sound.play('warning');
      triggerNotice('Insufficient resources in your personal reserves to complete this vault deposit.', 'warning');
      return;
    }

    onUpdateResources({
      naquadah: (resources.naquadah || 0) - depositNaq,
      metal: (resources.metal || 0) - depositMetal,
      crystal: (resources.crystal || 0) - depositCrystal,
      deuterium: (resources.deuterium || 0) - depositDeut,
    });

    const updatedGuilds = guilds.map((g) => {
      if (g.id === playerGuild.id) {
        const curVault = g.vault || { naquadah: 0, metal: 0, crystal: 0, deuterium: 0, darkMatter: 0 };
        return {
          ...g,
          treasury: g.treasury + depositNaq,
          vault: {
            ...curVault,
            naquadah: curVault.naquadah + depositNaq,
            metal: curVault.metal + depositMetal,
            crystal: curVault.crystal + depositCrystal,
            deuterium: curVault.deuterium + depositDeut,
          },
        };
      }
      return g;
    });

    saveGuilds(updatedGuilds);
    setIsDepositVaultOpen(false);
    sound.play('confirm');
    triggerNotice('Resources deposited to Guild Vault. Fealty contribution recorded.', 'success');
  };

  const handleUpgradePerk = (perkId: string) => {
    if (!playerGuild) return;
    sound.play('click');

    const perk = playerGuild.perks?.find((p) => p.id === perkId);
    if (!perk || perk.level >= perk.maxLevel) return;

    const vault = playerGuild.vault || { naquadah: 0, metal: 0, crystal: 0, deuterium: 0, darkMatter: 0 };
    const cost = perk.upgradeCost;

    if (
      vault.naquadah < cost.naquadah ||
      vault.metal < cost.metal ||
      vault.crystal < cost.crystal ||
      vault.deuterium < cost.deuterium
    ) {
      sound.play('warning');
      triggerNotice('Guild Vault does not have sufficient funds for this perk upgrade. Request donations from members.', 'warning');
      return;
    }

    const updatedGuilds = guilds.map((g) => {
      if (g.id === playerGuild.id) {
        return {
          ...g,
          vault: {
            ...vault,
            naquadah: vault.naquadah - cost.naquadah,
            metal: vault.metal - cost.metal,
            crystal: vault.crystal - cost.crystal,
            deuterium: vault.deuterium - cost.deuterium,
          },
          perks: g.perks?.map((p) =>
            p.id === perkId
              ? {
                  ...p,
                  level: p.level + 1,
                  bonusPercent: p.bonusPercent + 5,
                  upgradeCost: {
                    naquadah: Math.round(cost.naquadah * 1.5),
                    metal: Math.round(cost.metal * 1.5),
                    crystal: Math.round(cost.crystal * 1.5),
                    deuterium: Math.round(cost.deuterium * 1.5),
                  },
                }
              : p
          ),
        };
      }
      return g;
    });

    saveGuilds(updatedGuilds);
    sound.play('confirm');
    triggerNotice(`Guild Tech Upgraded: "${perk.name}" elevated to Level ${perk.level + 1}!`, 'success');
  };

  // =========================================================
  // FRIENDS HANDLERS
  // =========================================================
  const handleAddFriend = (name: string) => {
    if (!name.trim()) return;
    sound.play('click');

    const existing = friends.find((f) => f.commanderName.toLowerCase() === name.trim().toLowerCase());
    if (existing) {
      triggerNotice(`Commander ${name} is already in your friends registry.`, 'info');
      return;
    }

    const newFriend: PlayerFriend = {
      id: `fr-${Date.now()}`,
      commanderName: name.trim(),
      avatar: 'cadet',
      score: 125000,
      fleetPower: 75000,
      homeworldCoordinate: `${Math.floor(Math.random() * 5) + 1}:${Math.floor(Math.random() * 300) + 1}:${Math.floor(Math.random() * 15) + 1}`,
      status: 'online',
      relationshipStatus: 'friend',
      lastActive: 'Active now',
      notes: 'Allied commander added via subspace frequency.',
    };

    const nextFriends = [newFriend, ...friends];
    saveFriends(nextFriends);
    sound.play('confirm');
    triggerNotice(`Commander ${newFriend.commanderName} added to Friends List!`, 'success');
  };

  const handleTogglePinFriend = (friendId: string) => {
    sound.play('click');
    const updated = friends.map((f) => (f.id === friendId ? { ...f, isPinned: !f.isPinned } : f));
    saveFriends(updated);
  };

  const handleRemoveFriend = (friendId: string) => {
    sound.play('click');
    const updated = friends.filter((f) => f.id !== friendId);
    saveFriends(updated);
    triggerNotice('Friend removed from your registry.', 'info');
  };

  // =========================================================
  // DIRECT MESSAGING HANDLERS
  // =========================================================
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgRecipient.trim() || !msgSubject.trim() || !msgBody.trim()) return;

    if (msgGiftNaq > 0 && (resources.naquadah || 0) < msgGiftNaq) {
      sound.play('warning');
      triggerNotice(`Insufficient Naquadah to attach gift of ${msgGiftNaq.toLocaleString()} Naquadah.`, 'warning');
      return;
    }

    if (msgGiftNaq > 0) {
      onUpdateResources({ naquadah: (resources.naquadah || 0) - msgGiftNaq });
    }

    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      sender: profile?.username || 'Commander Tanang',
      recipient: msgRecipient.trim(),
      subject: msgSubject.trim(),
      body: msgBody.trim(),
      timestamp: 'Just now',
      read: true,
      isUrgent: msgUrgent,
      attachedCoordinates: msgAttachCoords.trim() || undefined,
      attachedResources: msgGiftNaq > 0 ? { naquadah: msgGiftNaq } : undefined,
      category: 'direct',
    };

    const nextMessages = [newMsg, ...messages];
    saveMessages(nextMessages);
    setSelectedMessageId(newMsg.id);
    setIsComposeMsgOpen(false);
    setMsgSubject('');
    setMsgBody('');
    setMsgGiftNaq(0);
    setMsgAttachCoords('');
    sound.play('confirm');
    triggerNotice(`Subspace message dispatched to ${newMsg.recipient}!`, 'success');
  };

  const handleClaimAttachedResources = (msg: DirectMessage) => {
    if (!msg.attachedResources) return;
    sound.play('confirm');

    const res = msg.attachedResources;
    onUpdateResources({
      naquadah: (resources.naquadah || 0) + (res.naquadah || 0),
      metal: (resources.metal || 0) + (res.metal || 0),
      crystal: (resources.crystal || 0) + (res.crystal || 0),
      deuterium: (resources.deuterium || 0) + (res.deuterium || 0),
    });

    const updated = messages.map((m) =>
      m.id === msg.id ? { ...m, attachedResources: undefined } : m
    );
    saveMessages(updated);
    triggerNotice('Attached gift resources claimed and credited to your empire reserves!', 'success');
  };

  const handleMarkAsRead = (id: string) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, read: true } : m));
    saveMessages(updated);
  };

  // =========================================================
  // PLAYER TRADE HANDLERS
  // =========================================================
  const handleCreateTrade = (e: React.FormEvent) => {
    e.preventDefault();

    if (tradeOfferAmount <= 0 || tradeRequestAmount <= 0) return;

    if ((resources[tradeOfferType] || 0) < tradeOfferAmount) {
      sound.play('warning');
      triggerNotice(`Insufficient ${tradeOfferType} to put into escrow for this trade.`, 'warning');
      return;
    }

    // Move to escrow
    onUpdateResources({
      [tradeOfferType]: (resources[tradeOfferType] || 0) - tradeOfferAmount,
    });

    const newTrade: PlayerTradeOffer = {
      id: `tr-${Date.now()}`,
      sellerId: profile?.id || 'commander-tanang',
      sellerName: profile?.username || 'Commander Tanang',
      targetPlayerName: tradeTargetPlayer.trim() || undefined,
      offering: {
        [tradeOfferType]: tradeOfferAmount,
        itemName: `${(tradeOfferAmount / 1000).toFixed(0)}k ${tradeOfferType.toUpperCase()}`,
        itemCategory: 'Empire Mineral',
      },
      requesting: {
        [tradeRequestType]: tradeRequestAmount,
        itemName: `${(tradeRequestAmount / 1000).toFixed(0)}k ${tradeRequestType.toUpperCase()}`,
        itemCategory: 'Empire Mineral',
      },
      status: 'open',
      createdAt: 'Just now',
      expiresInHours: 48,
      taxRatePercent: 2,
      escrowSecured: true,
      note: tradeNote.trim() || undefined,
    };

    const nextTrades = [newTrade, ...tradeOffers];
    saveTrades(nextTrades);
    setIsCreateTradeOpen(false);
    sound.play('confirm');
    triggerNotice('Trade contract created! Offered goods secured in escrow on the Galactic Exchange.', 'success');
  };

  const handleAcceptTrade = (trade: PlayerTradeOffer) => {
    sound.play('click');

    // Check if buyer has the requested items
    const req = trade.requesting;
    const reqMetal = req.metal || 0;
    const reqCrystal = req.crystal || 0;
    const reqDeut = req.deuterium || 0;
    const reqNaq = req.naquadah || 0;

    if (
      (resources.metal || 0) < reqMetal ||
      (resources.crystal || 0) < reqCrystal ||
      (resources.deuterium || 0) < reqDeut ||
      (resources.naquadah || 0) < reqNaq
    ) {
      sound.play('warning');
      triggerNotice('Insufficient resources to fulfill this contract request.', 'warning');
      return;
    }

    // Atomic exchange: deduct requested resources, credit offered goods
    const off = trade.offering;
    onUpdateResources({
      metal: (resources.metal || 0) - reqMetal + (off.metal || 0),
      crystal: (resources.crystal || 0) - reqCrystal + (off.crystal || 0),
      deuterium: (resources.deuterium || 0) - reqDeut + (off.deuterium || 0),
      naquadah: (resources.naquadah || 0) - reqNaq + (off.naquadah || 0),
    });

    const updated = tradeOffers.map((t) => (t.id === trade.id ? { ...t, status: 'completed' as const } : t));
    saveTrades(updated);
    sound.play('confirm');
    triggerNotice(`Trade completed successfully! Exchanged for ${off.itemName || 'resources'}.`, 'success');
  };

  const handleCancelTrade = (trade: PlayerTradeOffer) => {
    sound.play('click');
    const off = trade.offering;
    // Refund escrow
    onUpdateResources({
      metal: (resources.metal || 0) + (off.metal || 0),
      crystal: (resources.crystal || 0) + (off.crystal || 0),
      deuterium: (resources.deuterium || 0) + (off.deuterium || 0),
      naquadah: (resources.naquadah || 0) + (off.naquadah || 0),
    });

    const updated = tradeOffers.filter((t) => t.id !== trade.id);
    saveTrades(updated);
    triggerNotice('Trade contract cancelled. Escrowed materials returned to your reserves.', 'info');
  };

  const activeMessage = messages.find((m) => m.id === selectedMessageId) || messages[0];

  return (
    <div className="space-y-6">
      {/* ========================================================
          1. HEADER & SOCIAL HUD STRIP
         ======================================================== */}
      <div className="border border-[#111111] bg-white p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-[#111111]" />
              <span className="text-xl font-bold tracking-tight">GALACTIC ALLIANCE, FRIENDS & DIPLOMACY NETWORK</span>
              <span className="px-2 py-0.5 text-[10px] font-mono border border-[#111111] bg-[#f8fafc] font-bold">
                CONCORDAT v5.2
              </span>
            </div>
            <p className="text-xs text-[#666666] mt-1 max-w-3xl">
              Sovereign multiplayer social systems. Manage your imperial guild, coordinate mutual defense treaties, maintain communication with allied commanders, and exchange strategic mineral contracts on the Galactic Trade Exchange.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsCreateGuildOpen(true)}
              className="px-3 py-1.5 border border-[#111111] bg-[#111111] text-white hover:bg-[#333333] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#666666]"
            >
              <Building className="w-3.5 h-3.5" />
              Charter New Guild
            </button>
            <button
              onClick={() => setIsComposeMsgOpen(true)}
              className="px-3 py-1.5 border border-[#111111] bg-[#f8fafc] hover:bg-[#111111] hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Compose Subspace PM
            </button>
            <button
              onClick={() => setIsCreateTradeOpen(true)}
              className="px-3 py-1.5 border border-[#111111] bg-[#f8fafc] hover:bg-[#111111] hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              Post Trade Offer
            </button>
          </div>
        </div>

        {/* HUD Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-4 pt-4 border-t border-[#e2e8f0]">
          <div className="bg-[#f8fafc] p-2.5 border border-[#e2e8f0]">
            <div className="text-[10px] text-[#666666] uppercase font-bold">Active Guild</div>
            <div className="text-xs font-bold text-[#111111] truncate">
              {playerGuild ? `${playerGuild.name} ${playerGuild.tag}` : 'No Guild'}
            </div>
          </div>
          <div className="bg-[#f8fafc] p-2.5 border border-[#e2e8f0]">
            <div className="text-[10px] text-[#666666] uppercase font-bold">Guild Treasury</div>
            <div className="text-base font-bold font-mono text-[#111111]">
              {playerGuild ? `${(playerGuild.treasury / 1000).toFixed(0)}k Naq` : '0 Naq'}
            </div>
          </div>
          <div className="bg-[#f8fafc] p-2.5 border border-[#e2e8f0]">
            <div className="text-[10px] text-[#666666] uppercase font-bold">Allied Friends</div>
            <div className="text-base font-bold font-mono text-[#111111]">
              {friends.filter((f) => f.status === 'online').length} / {friends.length} Online
            </div>
          </div>
          <div className="bg-[#f8fafc] p-2.5 border border-[#e2e8f0]">
            <div className="text-[10px] text-[#666666] uppercase font-bold">Subspace Inquiries</div>
            <div className="text-base font-bold font-mono text-emerald-600">
              {messages.filter((m) => !m.read).length} Unread
            </div>
          </div>
          <div className="bg-[#f8fafc] p-2.5 border border-[#e2e8f0]">
            <div className="text-[10px] text-[#666666] uppercase font-bold">Open Exchange Offers</div>
            <div className="text-base font-bold font-mono text-[#111111]">
              {tradeOffers.filter((t) => t.status === 'open').length} Active
            </div>
          </div>
          <div className="bg-[#f8fafc] p-2.5 border border-[#e2e8f0]">
            <div className="text-[10px] text-[#666666] uppercase font-bold">Fealty Status</div>
            <div className="text-xs font-bold text-emerald-700">Protected Signatory</div>
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div
          className={`p-3 border text-xs font-bold flex items-center justify-between transition-all ${
            notice.type === 'success'
              ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
              : notice.type === 'warning'
              ? 'bg-amber-50 border-amber-400 text-amber-800'
              : 'bg-blue-50 border-blue-400 text-blue-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{notice.text}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-xs underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* ========================================================
          2. PRIMARY TABS NAVIGATION
         ======================================================== */}
      <div className="flex flex-wrap gap-1 border-b border-[#111111] bg-white p-1">
        <button
          onClick={() => {
            sound.play('click');
            setActiveTab('guilds');
          }}
          className={`px-4 py-2 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'guilds' ? 'bg-[#111111] text-white' : 'text-[#666666] hover:bg-[#f1f5f9]'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          Guilds & Alliances ({guilds.length})
        </button>
        <button
          onClick={() => {
            sound.play('click');
            setActiveTab('friends');
          }}
          className={`px-4 py-2 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'friends' ? 'bg-[#111111] text-white' : 'text-[#666666] hover:bg-[#f1f5f9]'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          Friends List ({friends.length})
        </button>
        <button
          onClick={() => {
            sound.play('click');
            setActiveTab('messages');
          }}
          className={`px-4 py-2 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'messages' ? 'bg-[#111111] text-white' : 'text-[#666666] hover:bg-[#f1f5f9]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Subspace Personal Messages ({messages.filter((m) => !m.read).length})
        </button>
        <button
          onClick={() => {
            sound.play('click');
            setActiveTab('trade');
          }}
          className={`px-4 py-2 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'trade' ? 'bg-[#111111] text-white' : 'text-[#666666] hover:bg-[#f1f5f9]'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          Player Trade System & Exchange ({tradeOffers.filter((t) => t.status === 'open').length})
        </button>
      </div>

      {/* ========================================================
          TAB 1: GUILDS & ALLIANCES SYSTEM
         ======================================================== */}
      {activeTab === 'guilds' && (
        <div className="space-y-6">
          {playerGuild ? (
            /* Player is in a Guild */
            <div className="space-y-6">
              {/* Guild Banner Card */}
              <div className="border border-[#111111] bg-white p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-xs font-bold bg-[#111111] text-white font-mono">
                        {playerGuild.tag}
                      </span>
                      <h3 className="text-xl font-bold text-[#111111]">{playerGuild.name}</h3>
                      <span className="px-1.5 py-0.5 text-[10px] font-mono border border-emerald-400 bg-emerald-50 text-emerald-800 font-bold">
                        ACTIVE MEMBER
                      </span>
                    </div>
                    <p className="text-xs text-[#475569] max-w-2xl">{playerGuild.description}</p>
                    <div className="p-2.5 bg-[#f8fafc] border border-[#e2e8f0] text-xs font-mono text-[#111111] flex items-center gap-2 mt-2">
                      <Flame className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>MotD: {playerGuild.motd}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <button
                      onClick={() => setIsDepositVaultOpen(true)}
                      className="px-4 py-2 bg-[#111111] text-white text-xs font-bold hover:bg-[#333333] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#666666]"
                    >
                      <DollarSign className="w-4 h-4" /> Deposit to Vault
                    </button>
                  </div>
                </div>

                {/* Vault Balances */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 pt-4 border-t border-[#e2e8f0] text-xs font-mono">
                  <div className="p-2.5 bg-[#f8fafc] border border-[#cbd5e1]">
                    <div className="text-[10px] text-[#64748b]">Vault Naquadah</div>
                    <div className="font-bold text-[#111111]">{playerGuild.vault?.naquadah.toLocaleString()}</div>
                  </div>
                  <div className="p-2.5 bg-[#f8fafc] border border-[#cbd5e1]">
                    <div className="text-[10px] text-[#64748b]">Vault Metal Ore</div>
                    <div className="font-bold text-[#111111]">{playerGuild.vault?.metal.toLocaleString()}</div>
                  </div>
                  <div className="p-2.5 bg-[#f8fafc] border border-[#cbd5e1]">
                    <div className="text-[10px] text-[#64748b]">Vault Crystal Silicon</div>
                    <div className="font-bold text-[#111111]">{playerGuild.vault?.crystal.toLocaleString()}</div>
                  </div>
                  <div className="p-2.5 bg-[#f8fafc] border border-[#cbd5e1]">
                    <div className="text-[10px] text-[#64748b]">Vault Deuterium</div>
                    <div className="font-bold text-[#111111]">{playerGuild.vault?.deuterium.toLocaleString()}</div>
                  </div>
                  <div className="p-2.5 bg-[#f8fafc] border border-[#cbd5e1]">
                    <div className="text-[10px] text-[#64748b]">Dark Matter Reserve</div>
                    <div className="font-bold text-purple-700">{playerGuild.vault?.darkMatter || 0} DM</div>
                  </div>
                </div>
              </div>

              {/* Guild Upgrades & Perks */}
              <div className="border border-[#111111] bg-white p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#111111] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      GUILD ALLIANCE RESEARCH PERKS & BUFFS
                    </h4>
                    <p className="text-xs text-[#64748b]">
                      Perks upgrade automatically using assets stored in the Guild Vault, benefiting every guild member.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-[#64748b]">5 / 5 Research Modules Active</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {playerGuild.perks?.map((perk) => (
                    <div key={perk.id} className="p-3.5 border border-[#e2e8f0] bg-[#f8fafc] space-y-2 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#111111]">{perk.name}</span>
                          <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-[#111111] text-white">
                            Lvl {perk.level} / {perk.maxLevel}
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-700 font-bold">{perk.effectDescription}</p>
                      </div>

                      <div className="pt-2 border-t border-[#e2e8f0]">
                        <div className="text-[10px] font-mono text-[#64748b] mb-1.5">
                          Upgrade: {perk.upgradeCost.naquadah.toLocaleString()} Naq • {perk.upgradeCost.metal.toLocaleString()} Metal
                        </div>
                        <button
                          disabled={perk.level >= perk.maxLevel}
                          onClick={() => handleUpgradePerk(perk.id)}
                          className={`w-full py-1 text-xs font-bold transition-colors cursor-pointer ${
                            perk.level >= perk.maxLevel
                              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                              : 'bg-[#111111] text-white hover:bg-[#333333]'
                          }`}
                        >
                          {perk.level >= perk.maxLevel ? 'Maxed Level' : 'Upgrade via Vault Funds'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guild Member Roster Table */}
              <div className="border border-[#111111] bg-white p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#111111] flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    GUILD ROSTER & COMBAT RANKINGS ({playerGuild.members?.length || 0} / {playerGuild.maxMembers || 30})
                  </h4>
                  <span className="text-xs text-[#64748b] font-mono">Grand Admiral Sovereign Access</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#111111] text-[#64748b] uppercase font-mono text-[10px]">
                        <th className="py-2 px-3">Commander</th>
                        <th className="py-2 px-3">Rank & Role</th>
                        <th className="py-2 px-3">Imperial Score</th>
                        <th className="py-2 px-3">Fleet Power</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3">Vault Donations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9]">
                      {playerGuild.members?.map((member) => (
                        <tr key={member.id} className="hover:bg-[#f8fafc]">
                          <td className="py-2.5 px-3 font-bold text-[#111111] flex items-center gap-1.5">
                            {member.rank === 'master' && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                            {member.name}
                          </td>
                          <td className="py-2.5 px-3 font-mono">
                            <span className="px-1.5 py-0.5 bg-[#f1f5f9] border border-[#cbd5e1] font-bold text-[10px]">
                              {member.roleLabel}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold">{member.score.toLocaleString()}</td>
                          <td className="py-2.5 px-3 font-mono text-blue-700 font-bold">{member.fleetPower.toLocaleString()}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-xs ${
                                member.status === 'online'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : member.status === 'in_combat'
                                  ? 'bg-rose-100 text-rose-800'
                                  : member.status === 'in_hyperspace'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {member.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[#64748b]">
                            {member.donations.naquadah.toLocaleString()} Naq
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* Player Not in a Guild: Directory & Charter */
            <div className="border border-[#111111] bg-white p-6 text-center space-y-3">
              <Building className="w-8 h-8 mx-auto text-[#64748b]" />
              <h3 className="text-base font-bold text-[#111111]">You are currently an unaligned commander</h3>
              <p className="text-xs text-[#64748b] max-w-md mx-auto">
                Join an established imperial alliance below to share technological research perks and mutual defense, or charter your own sovereign guild.
              </p>
              <button
                onClick={() => setIsCreateGuildOpen(true)}
                className="px-4 py-2 bg-[#111111] text-white text-xs font-bold hover:bg-[#333333] transition-colors cursor-pointer"
              >
                Charter Sovereign Guild (-250k Naquadah)
              </button>
            </div>
          )}

          {/* Directory of Other Guilds */}
          <div className="border border-[#111111] bg-white p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-[#111111]">REGISTERED INTERGALACTIC GUILD DIRECTORY</h4>
                <p className="text-xs text-[#64748b]">Browse active sovereign alliances across the cosmos.</p>
              </div>

              <div className="relative w-full md:w-64">
                <Search className="w-3.5 h-3.5 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search guilds or tags..."
                  value={guildSearch}
                  onChange={(e) => setGuildSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#cbd5e1] focus:border-[#111111] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {guilds
                .filter(
                  (g) =>
                    !guildSearch.trim() ||
                    g.name.toLowerCase().includes(guildSearch.toLowerCase()) ||
                    g.tag.toLowerCase().includes(guildSearch.toLowerCase())
                )
                .map((g) => (
                  <div key={g.id} className="p-4 border border-[#e2e8f0] bg-[#f8fafc] space-y-2 flex flex-col justify-between hover:border-[#111111] transition-all">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="px-1.5 py-0.5 bg-[#111111] text-white text-[10px] font-mono font-bold">
                          {g.tag}
                        </span>
                        <span className="text-[10px] text-[#64748b] font-mono">
                          {g.membersCount} Members
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-[#111111]">{g.name}</h5>
                      <p className="text-[11px] text-[#64748b] line-clamp-2">{g.description}</p>
                    </div>

                    <div className="pt-2 border-t border-[#e2e8f0] flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#64748b]">
                        Treasury: {(g.treasury / 1000).toFixed(0)}k Naq
                      </span>
                      {activeGuildId === g.id ? (
                        <span className="text-xs font-bold text-emerald-700">Joined Guild</span>
                      ) : (
                        <button
                          onClick={() => {
                            sound.play('confirm');
                            setActiveGuildId(g.id);
                            localStorage.setItem('uc_player_guild_id', g.id);
                            triggerNotice(`You have joined ${g.name} ${g.tag}!`, 'success');
                          }}
                          className="px-2.5 py-1 text-xs font-bold border border-[#111111] bg-white hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                        >
                          Join Guild
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: FRIENDS LIST & ALLIES
         ======================================================== */}
      {activeTab === 'friends' && (
        <div className="space-y-6">
          <div className="border border-[#111111] bg-white p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  ALLIED COMMANDERS & FRIENDS NETWORK
                </h3>
                <p className="text-xs text-[#666666] mt-0.5">
                  Maintain close tactical communication with allied commanders. Track active combat deployments, initiate instant private trades, and exchange coordinate links.
                </p>
              </div>

              {/* Add Friend Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter commander name..."
                  value={friendSearch}
                  onChange={(e) => setFriendSearch(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-[#cbd5e1] focus:border-[#111111] focus:outline-none w-52"
                />
                <button
                  onClick={() => {
                    handleAddFriend(friendSearch);
                    setFriendSearch('');
                  }}
                  className="px-3 py-1.5 bg-[#111111] text-white text-xs font-bold hover:bg-[#333333] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Add Friend
                </button>
              </div>
            </div>

            {/* Friends Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className={`p-4 border bg-white space-y-3 flex flex-col justify-between transition-all ${
                    friend.isPinned ? 'border-[#111111] shadow-[2px_2px_0px_#111111]' : 'border-[#e2e8f0]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#111111]">{friend.commanderName}</span>
                          {friend.guildTag && (
                            <span className="text-[10px] font-mono font-bold text-blue-700">{friend.guildTag}</span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-[#64748b]">
                          Coords: {friend.homeworldCoordinate}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            friend.status === 'online'
                              ? 'bg-emerald-500'
                              : friend.status === 'in_combat'
                              ? 'bg-rose-500'
                              : friend.status === 'in_hyperspace'
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                          }`}
                        />
                        <button
                          onClick={() => handleTogglePinFriend(friend.id)}
                          className={`p-1 cursor-pointer ${friend.isPinned ? 'text-[#111111]' : 'text-slate-300 hover:text-slate-600'}`}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono p-2 bg-[#f8fafc] border border-[#e2e8f0]">
                      <div>
                        <span className="text-[9px] text-[#64748b] block">Score:</span>
                        <span className="font-bold">{friend.score.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-[#64748b] block">Fleet Power:</span>
                        <span className="font-bold text-blue-700">{friend.fleetPower.toLocaleString()}</span>
                      </div>
                    </div>

                    {friend.notes && <p className="text-[11px] text-[#64748b] italic">{friend.notes}</p>}
                  </div>

                  <div className="pt-2 border-t border-[#e2e8f0] flex items-center justify-between gap-1.5">
                    <button
                      onClick={() => {
                        setMsgRecipient(friend.commanderName);
                        setIsComposeMsgOpen(true);
                      }}
                      className="px-2.5 py-1 text-[11px] bg-[#111111] text-white font-bold hover:bg-[#333333] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" /> PM
                    </button>
                    <button
                      onClick={() => {
                        setTradeTargetPlayer(friend.commanderName);
                        setIsCreateTradeOpen(true);
                      }}
                      className="px-2.5 py-1 text-[11px] border border-[#cbd5e1] font-bold hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Scale className="w-3 h-3" /> Trade
                    </button>
                    <button
                      onClick={() => handleRemoveFriend(friend.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <UserX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: SUBSPACE PERSONAL MESSAGES (PM)
         ======================================================== */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <div className="border border-[#111111] bg-white p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  SUBSPACE COMMUNICATIONS & DIRECT MESSAGING
                </h3>
                <p className="text-xs text-[#666666] mt-0.5">
                  Secure subspace transmission array. Read incoming intelligence transmissions, claim attached mineral gifts, and dispatch direct encrypted messages to allied commanders.
                </p>
              </div>

              <button
                onClick={() => setIsComposeMsgOpen(true)}
                className="px-3.5 py-1.5 bg-[#111111] text-white text-xs font-bold hover:bg-[#333333] transition-colors cursor-pointer flex items-center gap-1.5 shadow-[2px_2px_0px_#666666]"
              >
                <Send className="w-3.5 h-3.5" /> Compose Transmission
              </button>
            </div>

            {/* Split Screen: Inbox list on left, Message Reader on right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-3 border-t border-[#e2e8f0]">
              {/* Inbox List */}
              <div className="lg:col-span-5 space-y-2">
                <div className="flex items-center gap-1 pb-2 border-b border-[#e2e8f0]">
                  {(['all', 'direct', 'guild', 'distress'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setMessageFilter(cat)}
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                        messageFilter === cat
                          ? 'bg-[#111111] text-white'
                          : 'border border-[#cbd5e1] text-[#64748b] hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {messages
                    .filter((m) => messageFilter === 'all' || m.category === messageFilter)
                    .map((msg) => {
                      const isSelected = selectedMessageId === msg.id;
                      return (
                        <div
                          key={msg.id}
                          onClick={() => {
                            sound.play('click');
                            setSelectedMessageId(msg.id);
                            handleMarkAsRead(msg.id);
                          }}
                          className={`p-3 border text-xs cursor-pointer transition-all space-y-1 ${
                            isSelected
                              ? 'border-[#111111] bg-[#f8fafc] shadow-[2px_2px_0px_#111111]'
                              : msg.read
                              ? 'border-[#e2e8f0] bg-white opacity-85'
                              : 'border-blue-400 bg-blue-50/40 font-bold'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#111111]">{msg.sender}</span>
                            <span className="text-[10px] font-mono text-[#94a3b8]">{msg.timestamp}</span>
                          </div>
                          <div className="text-xs text-[#334155] truncate">{msg.subject}</div>
                          {msg.isUrgent && (
                            <span className="inline-block px-1 py-0.2 text-[9px] font-bold bg-rose-600 text-white">
                              URGENT
                            </span>
                          )}
                          {msg.attachedResources && (
                            <span className="inline-block px-1 py-0.2 text-[9px] font-bold bg-emerald-600 text-white ml-1">
                              GIFT ATTACHED
                            </span>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Message Inspector */}
              <div className="lg:col-span-7 border border-[#111111] bg-white p-5 space-y-4">
                {activeMessage ? (
                  <div className="space-y-4">
                    <div className="border-b border-[#e2e8f0] pb-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#64748b]">From: {activeMessage.sender}</span>
                        <span className="text-xs font-mono text-[#94a3b8]">{activeMessage.timestamp}</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#111111]">{activeMessage.subject}</h4>
                    </div>

                    <p className="text-xs text-[#334155] leading-relaxed whitespace-pre-line">
                      {activeMessage.body}
                    </p>

                    {/* Attached Resources Gift */}
                    {activeMessage.attachedResources && (
                      <div className="p-3 bg-emerald-50 border border-emerald-400 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                          <Gift className="w-4 h-4" /> Attached Mineral Gift
                        </div>
                        <div className="text-xs font-mono text-emerald-900">
                          {Object.entries(activeMessage.attachedResources).map(([k, v]) => (
                            <span key={k} className="mr-3">
                              +{v.toLocaleString()} {k.toUpperCase()}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => handleClaimAttachedResources(activeMessage)}
                          className="px-3 py-1 bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
                        >
                          Claim Gift to Empire Wallet
                        </button>
                      </div>
                    )}

                    {/* Attached Coordinates */}
                    {activeMessage.attachedCoordinates && (
                      <div className="p-3 bg-blue-50 border border-blue-300 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-blue-900 font-mono">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span>Coordinates: {activeMessage.attachedCoordinates}</span>
                        </div>
                        <button
                          onClick={() => {
                            sound.play('confirm');
                            triggerNotice(`Stargate route plotted to coordinate ${activeMessage.attachedCoordinates}.`, 'info');
                          }}
                          className="px-2.5 py-1 bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          Dial Coordinate
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-xs text-[#94a3b8] py-16">
                    Select a transmission from the left to read.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: PLAYER TRADE SYSTEM & GALACTIC EXCHANGE
         ======================================================== */}
      {activeTab === 'trade' && (
        <div className="space-y-6">
          <div className="border border-[#111111] bg-white p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
                  <Scale className="w-5 h-5 text-emerald-600" />
                  GALACTIC PLAYER TRADE EXCHANGE & CONTRACTS
                </h3>
                <p className="text-xs text-[#666666] mt-0.5">
                  Direct player-to-player trade market. Post multi-resource contracts backed by automated escrow, swap surplus raw materials, or fulfill contracts posted by other commanders.
                </p>
              </div>

              <button
                onClick={() => setIsCreateTradeOpen(true)}
                className="px-4 py-2 bg-[#111111] text-white text-xs font-bold hover:bg-[#333333] transition-colors cursor-pointer flex items-center gap-1.5 shadow-[2px_2px_0px_#666666]"
              >
                <Plus className="w-3.5 h-3.5" /> Post Trade Offer
              </button>
            </div>

            {/* Trade Contracts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {tradeOffers
                .filter((t) => t.status === 'open')
                .map((trade) => {
                  const isMine = trade.sellerName === (profile?.username || 'Commander Tanang');

                  return (
                    <div
                      key={trade.id}
                      className="p-4 border border-[#e2e8f0] bg-[#f8fafc] space-y-3 flex flex-col justify-between hover:border-[#111111] transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#111111]">Seller: {trade.sellerName}</span>
                          <span className="text-[10px] font-mono text-[#64748b]">
                            Expires in {trade.expiresInHours}h
                          </span>
                        </div>

                        {/* Trade Swap Box */}
                        <div className="grid grid-cols-2 gap-3 p-3 bg-white border border-[#cbd5e1] text-xs font-mono">
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-bold text-emerald-700 block">
                              YOU RECEIVE:
                            </span>
                            <div className="font-bold text-emerald-800 text-sm">
                              {trade.offering.itemName || 'Offered Goods'}
                            </div>
                          </div>

                          <div className="space-y-1 border-l border-[#e2e8f0] pl-3">
                            <span className="text-[9px] uppercase font-bold text-rose-700 block">
                              YOU PAY:
                            </span>
                            <div className="font-bold text-rose-800 text-sm">
                              {trade.requesting.itemName || 'Requested Payment'}
                            </div>
                          </div>
                        </div>

                        {trade.note && <p className="text-[11px] text-[#64748b] italic">{trade.note}</p>}
                      </div>

                      <div className="pt-2 border-t border-[#e2e8f0] flex items-center justify-between">
                        <span className="text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Escrow Secured
                        </span>

                        {isMine ? (
                          <button
                            onClick={() => handleCancelTrade(trade)}
                            className="px-3 py-1 border border-rose-300 text-rose-700 text-xs font-bold hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            Cancel & Refund Escrow
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAcceptTrade(trade)}
                            className="px-3 py-1 bg-[#111111] text-white text-xs font-bold hover:bg-[#333333] transition-colors cursor-pointer"
                          >
                            Accept & Fulfill Trade
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CHARTER GUILD
         ======================================================== */}
      {isCreateGuildOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="border border-[#111111] bg-white w-full max-w-md p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
              <h4 className="text-sm font-bold text-[#111111]">CHARTER SOVEREIGN GUILD</h4>
              <button onClick={() => setIsCreateGuildOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGuild} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block text-[#111111] mb-1">Guild Alliance Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free Worlds Coalition"
                  value={newGuildName}
                  onChange={(e) => setNewGuildName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#cbd5e1] focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold block text-[#111111] mb-1">Guild Tag (2-5 Characters)</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. [FWC]"
                  value={newGuildTag}
                  onChange={(e) => setNewGuildTag(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#cbd5e1] focus:border-[#111111] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-bold block text-[#111111] mb-1">Guild Charter Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe your guild's strategic goals..."
                  value={newGuildDesc}
                  onChange={(e) => setNewGuildDesc(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#cbd5e1] focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div className="p-2.5 bg-[#f8fafc] border border-[#e2e8f0] text-[11px] font-mono text-[#64748b]">
                Charter Fee: 250,000 Naquadah (Transferred from personal reserves)
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#111111] text-white font-bold hover:bg-[#333333] transition-colors cursor-pointer"
              >
                Ratify & Register Guild
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: DEPOSIT TO GUILD VAULT
         ======================================================== */}
      {isDepositVaultOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="border border-[#111111] bg-white w-full max-w-md p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
              <h4 className="text-sm font-bold text-[#111111]">DEPOSIT RESOURCES TO GUILD VAULT</h4>
              <button onClick={() => setIsDepositVaultOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDepositToVault} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-[#64748b] block mb-1">Naquadah (Owned: {resources.naquadah?.toLocaleString()})</label>
                <input
                  type="number"
                  min={0}
                  value={depositNaq}
                  onChange={(e) => setDepositNaq(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1 border border-[#cbd5e1] focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#64748b] block mb-1">Metal Ore (Owned: {resources.metal?.toLocaleString()})</label>
                <input
                  type="number"
                  min={0}
                  value={depositMetal}
                  onChange={(e) => setDepositMetal(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1 border border-[#cbd5e1] focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#64748b] block mb-1">Crystal Silicon (Owned: {resources.crystal?.toLocaleString()})</label>
                <input
                  type="number"
                  min={0}
                  value={depositCrystal}
                  onChange={(e) => setDepositCrystal(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1 border border-[#cbd5e1] focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#64748b] block mb-1">Deuterium (Owned: {resources.deuterium?.toLocaleString()})</label>
                <input
                  type="number"
                  min={0}
                  value={depositDeut}
                  onChange={(e) => setDepositDeut(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1 border border-[#cbd5e1] focus:border-[#111111] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#111111] text-white font-bold hover:bg-[#333333] transition-colors cursor-pointer mt-2"
              >
                Transfer Funds to Vault
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: COMPOSE SUBSPACE MESSAGE
         ======================================================== */}
      {isComposeMsgOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="border border-[#111111] bg-white w-full max-w-lg p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
              <h4 className="text-sm font-bold text-[#111111]">COMPOSE SUBSPACE TRANSMISSION</h4>
              <button onClick={() => setIsComposeMsgOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block text-[#111111] mb-1">Recipient Commander</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Col. Samantha Carter"
                  value={msgRecipient}
                  onChange={(e) => setMsgRecipient(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#cbd5e1] focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold block text-[#111111] mb-1">Transmission Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Joint Fleet Maneuvers"
                  value={msgSubject}
                  onChange={(e) => setMsgSubject(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#cbd5e1] focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold block text-[#111111] mb-1">Message Body</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter encrypted transmission contents..."
                  value={msgBody}
                  onChange={(e) => setMsgBody(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#cbd5e1] focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[#64748b] block mb-1">Attach Coordinates (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 1:204:8"
                    value={msgAttachCoords}
                    onChange={(e) => setMsgAttachCoords(e.target.value)}
                    className="w-full px-3 py-1.5 border border-[#cbd5e1] focus:border-[#111111] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[#64748b] block mb-1">Attach Naquadah Gift (Optional)</label>
                  <input
                    type="number"
                    min={0}
                    value={msgGiftNaq}
                    onChange={(e) => setMsgGiftNaq(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 border border-[#cbd5e1] focus:border-[#111111] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#111111] text-white font-bold hover:bg-[#333333] transition-colors cursor-pointer mt-2"
              >
                Dispatch Encrypted Transmission
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CREATE TRADE CONTRACT
         ======================================================== */}
      {isCreateTradeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="border border-[#111111] bg-white w-full max-w-lg p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
              <h4 className="text-sm font-bold text-[#111111]">POST ESCROW TRADE CONTRACT</h4>
              <button onClick={() => setIsCreateTradeOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTrade} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                {/* Offering */}
                <div className="p-3 bg-[#f8fafc] border border-[#cbd5e1] space-y-2">
                  <span className="font-bold text-[#111111] block">You Offer (Escrowed):</span>
                  <select
                    value={tradeOfferType}
                    onChange={(e) => setTradeOfferType(e.target.value as any)}
                    className="w-full px-2 py-1 border border-[#cbd5e1] bg-white"
                  >
                    <option value="metal">Metal Ore</option>
                    <option value="crystal">Crystal Silicon</option>
                    <option value="deuterium">Deuterium</option>
                    <option value="naquadah">Naquadah</option>
                  </select>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    value={tradeOfferAmount}
                    onChange={(e) => setTradeOfferAmount(parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 border border-[#cbd5e1] font-mono"
                  />
                </div>

                {/* Requesting */}
                <div className="p-3 bg-[#f8fafc] border border-[#cbd5e1] space-y-2">
                  <span className="font-bold text-[#111111] block">You Request:</span>
                  <select
                    value={tradeRequestType}
                    onChange={(e) => setTradeRequestType(e.target.value as any)}
                    className="w-full px-2 py-1 border border-[#cbd5e1] bg-white"
                  >
                    <option value="crystal">Crystal Silicon</option>
                    <option value="metal">Metal Ore</option>
                    <option value="deuterium">Deuterium</option>
                    <option value="naquadah">Naquadah</option>
                  </select>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    value={tradeRequestAmount}
                    onChange={(e) => setTradeRequestAmount(parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 border border-[#cbd5e1] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block text-[#111111] mb-1">Target Player (Leave blank for Open Exchange)</label>
                <input
                  type="text"
                  placeholder="Optional: Direct to specific friend..."
                  value={tradeTargetPlayer}
                  onChange={(e) => setTradeTargetPlayer(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#cbd5e1]"
                />
              </div>

              <div>
                <label className="font-bold block text-[#111111] mb-1">Contract Note</label>
                <input
                  type="text"
                  placeholder="e.g. Standard shipyard material swap..."
                  value={tradeNote}
                  onChange={(e) => setTradeNote(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#cbd5e1]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#111111] text-white font-bold hover:bg-[#333333] transition-colors cursor-pointer mt-2"
              >
                Secure Goods in Escrow & Post Contract
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
