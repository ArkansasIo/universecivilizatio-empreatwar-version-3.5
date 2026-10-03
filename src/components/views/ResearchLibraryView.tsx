import React, { useState, useEffect } from 'react';
import {
  OGameTechnology,
  OGameTechCategory,
  OGameTechBranch,
  PlayerResources,
  ResearchQueueItem,
  LabSpecialization,
  ScienceDoctrine,
  ResearchSpecialistRoster,
  ResearchBreakthroughEvent,
  IntergalacticLabNode,
} from '../../types';
import { sound } from '../../sound';
import {
  FlaskConical,
  Zap,
  Pickaxe,
  Cpu,
  Atom,
  Rocket,
  Swords,
  Shield,
  Eye,
  Globe,
  Radio,
  Bot,
  Microscope,
  Sparkles,
  Sun,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  FastForward,
  TrendingUp,
  Award,
  ChevronRight,
  Plus,
  Minus,
  Network,
  Compass,
  FileCode,
  Flame,
  Layers,
  Search,
  BookOpen,
} from 'lucide-react';

interface ResearchLibraryViewProps {
  technologies: OGameTechnology[];
  resources: PlayerResources;
  researchQueue: ResearchQueueItem[];
  labSpecialization: LabSpecialization;
  onSelectLabSpecialization: (spec: LabSpecialization) => void;
  onStartResearch: (techId: string) => void;
  onCancelResearch: (queueId: string) => void;
  onInstantCompleteResearch?: (queueId: string) => void;
  onNavigate?: (route: string) => void;
}

const CATEGORIES: { id: string; categoryValue: OGameTechCategory | 'all'; label: string; icon: React.ReactNode }[] = [
  { id: 'cat_all', categoryValue: 'all', label: 'All Disciplines', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'cat_energy', categoryValue: 'energy', label: 'Energy Systems', icon: <Zap className="w-3.5 h-3.5" /> },
  { id: 'cat_mining', categoryValue: 'mining', label: 'Extractive Mining', icon: <Pickaxe className="w-3.5 h-3.5" /> },
  { id: 'cat_materials', categoryValue: 'materials', label: 'Advanced Materials', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'cat_computing', categoryValue: 'computing', label: 'Quantum Computing', icon: <Cpu className="w-3.5 h-3.5" /> },
  { id: 'cat_physics', categoryValue: 'physics', label: 'Subatomic Physics', icon: <Atom className="w-3.5 h-3.5" /> },
  { id: 'cat_propulsion', categoryValue: 'propulsion', label: 'Warp & Propulsion', icon: <Rocket className="w-3.5 h-3.5" /> },
  { id: 'cat_weapons', categoryValue: 'weapons', label: 'Weapons Technology', icon: <Swords className="w-3.5 h-3.5" /> },
  { id: 'cat_shields', categoryValue: 'shields', label: 'Deflector Shields', icon: <Shield className="w-3.5 h-3.5" /> },
  { id: 'cat_armor', categoryValue: 'armor', label: 'Neutronium Armor', icon: <Shield className="w-3.5 h-3.5" /> },
  { id: 'cat_espionage', categoryValue: 'espionage', label: 'Subspace Espionage', icon: <Eye className="w-3.5 h-3.5" /> },
  { id: 'cat_colonization', categoryValue: 'colonization', label: 'Planetary Colonization', icon: <Globe className="w-3.5 h-3.5" /> },
  { id: 'cat_fleet', categoryValue: 'fleet', label: 'Armada Command', icon: <Radio className="w-3.5 h-3.5" /> },
  { id: 'cat_ai', categoryValue: 'ai', label: 'Autonomous AI', icon: <Bot className="w-3.5 h-3.5" /> },
  { id: 'cat_quantum', categoryValue: 'quantum', label: 'Entanglement Science', icon: <Microscope className="w-3.5 h-3.5" /> },
  { id: 'cat_dimensional', categoryValue: 'dimensional', label: 'Dimensional Physics', icon: <Compass className="w-3.5 h-3.5" /> },
  { id: 'cat_megastructure', categoryValue: 'megastructure', label: 'Megastructures', icon: <Sun className="w-3.5 h-3.5" /> },
];

const LAB_SPECIALIZATIONS: {
  id: LabSpecialization;
  name: string;
  bonus: string;
  categories: OGameTechCategory[];
  description: string;
}[] = [
  { id: 'physics', name: 'Theoretical Physics Lab', bonus: '+20% Energy & Quantum Research Speed', categories: ['energy', 'quantum', 'physics'], description: 'Focuses on subatomic field manipulation, zero-point taps, and plasma reactors.' },
  { id: 'engineering', name: 'Industrial Engineering Complex', bonus: '+20% Materials & Mining Research Speed', categories: ['mining', 'materials', 'megastructure'], description: 'Specializes in extractive drillheads, molecular metallurgy, and megascale fabrication.' },
  { id: 'propulsion', name: 'Subspace Propulsion Facility', bonus: '+20% Propulsion & Fleet Research Speed', categories: ['propulsion', 'fleet'], description: 'Advances impulse manifolds, hyperspace warp drives, and capital jump portals.' },
  { id: 'military', name: 'Naval Warfare Arsenal Lab', bonus: '+20% Weapons, Shields & Armor Speed', categories: ['weapons', 'shields', 'armor'], description: 'Refines high-yield particle lances, deflector shields, and reactive armor alloys.' },
  { id: 'computer', name: 'Supercomputing Cyber-Array', bonus: '+20% Computing & Espionage Speed', categories: ['computing', 'espionage'], description: 'Accelerates cryptographic decoders, cybernetic mainframes, and surveillance probes.' },
  { id: 'ai', name: 'Autonomous Neural Matrix', bonus: '+25% AI & Synthetic Neural Speed', categories: ['ai', 'computing'], description: 'Empowers self-evolving algorithmic cognition, drone automation, and tactical combat AI.' },
  { id: 'dimensional', name: 'Dimensional Rift Institute', bonus: '+30% Dimensional & Endgame Speed', categories: ['dimensional', 'megastructure'], description: 'Pioneers trans-dimensional harmonics, wormhole conduits, and dark matter synthesis.' },
];

const SCIENCE_DOCTRINES: ScienceDoctrine[] = [
  {
    id: 'doc_pure_theory',
    name: 'Theoretical & Quantum Dominance',
    branch: 'Science',
    icon: 'Atom',
    description: 'Prioritizes pure fundamental research, unlocking quantum entanglement and zero-point energy at breakthrough velocity.',
    speedBonusPercent: 25,
    bonusCategories: ['energy', 'quantum', 'physics', 'dimensional'],
    costPenaltyPercent: 0,
    breakthroughChanceBonus: 12,
    unlockedAtLabLevel: 1,
  },
  {
    id: 'doc_naval_supremacy',
    name: 'Naval Warfare Hegemony',
    branch: 'Military',
    icon: 'Swords',
    description: 'Redirects scientific compute towards dreadnought armament, kinetic railguns, and impenetrable deflector shields.',
    speedBonusPercent: 25,
    bonusCategories: ['weapons', 'shields', 'armor', 'fleet'],
    costPenaltyPercent: 0,
    breakthroughChanceBonus: 10,
    unlockedAtLabLevel: 3,
  },
  {
    id: 'doc_industrial_growth',
    name: 'Industrial & Resource Exploitation',
    branch: 'Economics',
    icon: 'Pickaxe',
    description: 'Focuses engineering talent on extreme mineral throughput, strip-mining tech, and colossal orbital megastructures.',
    speedBonusPercent: 30,
    bonusCategories: ['mining', 'materials', 'megastructure'],
    costPenaltyPercent: 0,
    breakthroughChanceBonus: 8,
    unlockedAtLabLevel: 2,
  },
  {
    id: 'doc_neural_autonomy',
    name: 'Synthetic Cybernetics & Autonomous AI',
    branch: 'Artificial Intelligence',
    icon: 'Bot',
    description: 'Integrates self-coding neural clusters into all scientific faculties, speeding up algorithmic advancements.',
    speedBonusPercent: 35,
    bonusCategories: ['ai', 'computing', 'espionage'],
    costPenaltyPercent: 5,
    breakthroughChanceBonus: 15,
    unlockedAtLabLevel: 4,
  },
];

export const ResearchLibraryView: React.FC<ResearchLibraryViewProps> = ({
  technologies,
  resources,
  researchQueue,
  labSpecialization,
  onSelectLabSpecialization,
  onStartResearch,
  onCancelResearch,
  onInstantCompleteResearch,
  onNavigate,
}) => {
  // Navigation & Subtabs
  const [activeMainTab, setActiveMainTab] = useState<'codex' | 'igrn' | 'doctrines' | 'personnel' | 'breakthroughs'>('codex');
  const [selectedCategory, setSelectedCategory] = useState<OGameTechCategory | 'all'>('all');
  const [selectedBranch, setSelectedBranch] = useState<OGameTechBranch | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'affordable' | 'researching' | 'completed'>('all');
  const [activeTechId, setActiveTechId] = useState<string>(technologies[0]?.id || '');
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'warning' | 'info' } | null>(null);

  // Persistence for Scientific Doctrines
  const [activeDoctrineId, setActiveDoctrineId] = useState<string>(() => {
    return localStorage.getItem('uc_active_science_doctrine') || 'doc_pure_theory';
  });

  // Specialists Allocation
  const [specialists, setSpecialists] = useState<ResearchSpecialistRoster>(() => {
    try {
      const saved = localStorage.getItem('uc_research_specialists');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { theorists: 50, navalArchitects: 40, industrialEngineers: 45, cyberneticists: 30, astroPhysicists: 35 };
  });

  // Breakthrough Events History
  const [breakthroughs, setBreakthroughs] = useState<ResearchBreakthroughEvent[]>(() => {
    try {
      const saved = localStorage.getItem('uc_research_breakthroughs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'bt_init_1',
        techId: 'tech_energy',
        techName: 'Energy Technology',
        type: 'speed_surge',
        title: 'Zero-Point Fluctuations Discovered',
        description: 'Researchers isolated sub-vacuum energy spikes, accelerating energy project throughput by +20%.',
        timestamp: Date.now() - 3600000 * 4,
        rewardValue: '+20% Science Speed',
      },
      {
        id: 'bt_init_2',
        techId: 'tech_laser',
        techName: 'Laser Technology',
        type: 'free_level',
        title: 'Tachyon Focal Crystal Synthesis',
        description: 'High-energy lab perfected self-tuning focal crystal matrices for instant beam coherence.',
        timestamp: Date.now() - 3600000 * 12,
        rewardValue: 'Free Tech Upgrade Token',
      },
    ];
  });

  // Intergalactic Lab Network Nodes
  const [labNodes, setLabNodes] = useState<IntergalacticLabNode[]>([
    { planetId: 'pl_earth', planetName: 'Earth Prime Command Lab', labLevel: 12, networkContribution: 35, status: 'online', specialization: 'physics' },
    { planetId: 'pl_mars', planetName: 'Mars Orbital Astrophysics', labLevel: 9, networkContribution: 28, status: 'online', specialization: 'propulsion' },
    { planetId: 'pl_titan', planetName: 'Titan Cryogenic Collider', labLevel: 7, networkContribution: 20, status: 'online', specialization: 'quantum' },
    { planetId: 'pl_vulcan', planetName: 'Vulcan Subsurface Foundry Lab', labLevel: 5, networkContribution: 17, status: 'online', specialization: 'engineering' },
  ]);

  const triggerNotice = (text: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDoctrineChange = (docId: string) => {
    sound.play('confirm');
    setActiveDoctrineId(docId);
    localStorage.setItem('uc_active_science_doctrine', docId);
    const doc = SCIENCE_DOCTRINES.find((d) => d.id === docId);
    triggerNotice(`Empire Science Doctrine activated: "${doc?.name}". Speed modifiers applied.`, 'success');
  };

  const handleAdjustSpecialist = (key: keyof ResearchSpecialistRoster, delta: number) => {
    sound.play('click');
    setSpecialists((prev) => {
      const next = { ...prev, [key]: Math.max(0, prev[key] + delta) };
      localStorage.setItem('uc_research_specialists', JSON.stringify(next));
      return next;
    });
  };

  const activeDoctrine = SCIENCE_DOCTRINES.find((d) => d.id === activeDoctrineId) || SCIENCE_DOCTRINES[0];

  // Intergalactic Research Network (IGRN) Totals
  const totalNetworkLabLevel = labNodes.reduce((acc, node) => acc + (node.status === 'online' || node.status === 'overclocked' ? node.labLevel : 0), 0);
  const igrnSpeedBonusPercent = Math.min(65, Math.round(totalNetworkLabLevel * 1.8));
  const maxSimultaneousProjects = Math.max(1, 1 + Math.floor(totalNetworkLabLevel / 10));

  // Active Selected Tech
  const activeTech = technologies.find((t) => t.id === activeTechId) || technologies[0];

  const checkPrerequisitesMet = (tech: OGameTechnology): boolean => {
    return tech.prerequisites.every((req) => {
      if (req.type === 'tech') {
        const found = technologies.find((t) => t.id === req.id);
        return found && found.level >= req.requiredLevel;
      }
      return true;
    });
  };

  // Cost & Time with Doctrine, Lab, and Specialist modifiers
  const getCostAndDuration = (tech: OGameTechnology) => {
    const mult = Math.pow(tech.costMultiplier, tech.level);

    let speedBonus = 0;
    // Lab specialization bonus
    const spec = LAB_SPECIALIZATIONS.find((s) => s.id === labSpecialization);
    if (spec && spec.categories.includes(tech.category)) {
      speedBonus += 20;
    }
    // Doctrine bonus
    if (activeDoctrine.bonusCategories.includes(tech.category)) {
      speedBonus += activeDoctrine.speedBonusPercent;
    }
    // Specialist bonus
    if (tech.category === 'energy' || tech.category === 'quantum' || tech.category === 'dimensional') {
      speedBonus += Math.floor(specialists.theorists / 5);
    } else if (tech.category === 'weapons' || tech.category === 'shields' || tech.category === 'armor' || tech.category === 'fleet') {
      speedBonus += Math.floor(specialists.navalArchitects / 5);
    } else if (tech.category === 'mining' || tech.category === 'materials' || tech.category === 'megastructure') {
      speedBonus += Math.floor(specialists.industrialEngineers / 5);
    } else if (tech.category === 'ai' || tech.category === 'computing' || tech.category === 'espionage') {
      speedBonus += Math.floor(specialists.cyberneticists / 5);
    } else {
      speedBonus += Math.floor(specialists.astroPhysicists / 5);
    }
    // IGRN bonus
    speedBonus += igrnSpeedBonusPercent;

    const effectiveTimeMult = Math.max(0.2, 1 - speedBonus / 100);
    const baseDuration = Math.round(tech.baseTimeSeconds * Math.pow(1.3, tech.level));
    const finalDurationSeconds = Math.max(5, Math.round(baseDuration * effectiveTimeMult));

    return {
      metal: Math.round(tech.baseCost.metal * mult),
      crystal: Math.round(tech.baseCost.crystal * mult),
      deuterium: Math.round(tech.baseCost.deuterium * mult),
      energy: Math.round(tech.baseCost.energy * mult),
      timeSeconds: finalDurationSeconds,
      baseTimeSeconds: baseDuration,
      speedBonusPercent: speedBonus,
    };
  };

  const canAfford = (tech: OGameTechnology): boolean => {
    const cost = getCostAndDuration(tech);
    return (
      (resources.metal ?? 0) >= cost.metal &&
      (resources.crystal ?? 0) >= cost.crystal &&
      (resources.deuterium ?? 0) >= cost.deuterium &&
      (resources.energy ?? 0) >= cost.energy
    );
  };

  const isResearching = (techId: string) => researchQueue.some((q) => q.techId === techId);
  const queueItemFor = (techId: string) => researchQueue.find((q) => q.techId === techId);

  // Trigger manual breakthrough simulation
  const handleTriggerBreakthrough = () => {
    sound.play('confirm');
    const newBreakthrough: ResearchBreakthroughEvent = {
      id: `bt_${Date.now()}`,
      techId: activeTech.id,
      techName: activeTech.name,
      type: 'speed_surge',
      title: `Breakthrough: ${activeTech.name} Singularity`,
      description: `Spontaneous algorithmic alignment achieved. Research speed augmented across ${activeTech.category} technologies!`,
      timestamp: Date.now(),
      rewardValue: '+25% Category Speed',
    };
    const nextList = [newBreakthrough, ...breakthroughs.slice(0, 9)];
    setBreakthroughs(nextList);
    localStorage.setItem('uc_research_breakthroughs', JSON.stringify(nextList));
    triggerNotice(`Critical Scientific Breakthrough achieved for ${activeTech.name}!`, 'success');
  };

  // Filtered technologies
  const filteredTechs = technologies.filter((tech) => {
    if (selectedCategory !== 'all' && tech.category !== selectedCategory) return false;
    if (selectedBranch !== 'all' && tech.branch !== selectedBranch) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        tech.name.toLowerCase().includes(q) ||
        tech.description.toLowerCase().includes(q) ||
        tech.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (statusFilter === 'affordable' && !canAfford(tech)) return false;
    if (statusFilter === 'researching' && !isResearching(tech.id)) return false;
    if (statusFilter === 'completed' && tech.level < tech.maxLevel) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ========================================================
          1. HEADER & TOP SCIENCE HUD
         ======================================================== */}
      <div className="border border-[#111111] bg-white p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-[#111111]" />
              <span className="text-xl font-bold tracking-tight">IMPERIAL RESEARCH LABORATORIES & SYSTEMS</span>
              <span className="px-2 py-0.5 text-[10px] font-mono border border-[#111111] bg-[#f8fafc] font-bold">
                IGRN v5.4 ONLINE
              </span>
            </div>
            <p className="text-xs text-[#666666] mt-1 max-w-3xl">
              Central scientific command deck. Orchestrate intergalactic laboratory networks, deploy specialized research doctrines, assign scientific personnel, and advance high-tier naval and industrial technologies.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate && onNavigate('eve-blueprints')}
              className="px-3 py-1.5 border border-[#111111] bg-[#f8fafc] hover:bg-[#111111] hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5" />
              EVE Blueprints & Industry →
            </button>
            <button
              onClick={() => onNavigate && onNavigate('tech-tree')}
              className="px-3 py-1.5 border border-[#111111] bg-[#f8fafc] hover:bg-[#111111] hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Network className="w-3.5 h-3.5" />
              Full Unlock Tree Graph →
            </button>
          </div>
        </div>

        {/* HUD Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-4 pt-4 border-t border-[#e2e8f0]">
          <div className="bg-[#f8fafc] p-2.5 border border-[#e2e8f0]">
            <div className="text-[10px] text-[#666666] uppercase font-bold">Active Projects</div>
            <div className="text-base font-bold font-mono text-[#111111]">
              {researchQueue.length} / {maxSimultaneousProjects} Slots
            </div>
          </div>
          <div className="bg-[#f8fafc] p-2.5 border border-[#e2e8f0]">
            <div className="text-[10px] text-[#666666] uppercase font-bold">IGRN Network Level</div>
            <div className="text-base font-bold font-mono text-[#111111]">
              Lvl {totalNetworkLabLevel} (+{igrnSpeedBonusPercent}% Speed)
            </div>
          </div>
          <div className="bg-[#f8fafc] p-2.5 border border-[#e2e8f0]">
            <div className="text-[10px] text-[#666666] uppercase font-bold">Empire Doctrine</div>
            <div className="text-xs font-bold text-[#111111] truncate">{activeDoctrine.name}</div>
          </div>
          <div className="bg-[#f8fafc] p-2.5 border border-[#e2e8f0]">
            <div className="text-[10px] text-[#666666] uppercase font-bold">Lab Specialization</div>
            <div className="text-xs font-bold text-[#111111] capitalize">{labSpecialization} Lab</div>
          </div>
          <div className="bg-[#f8fafc] p-2.5 border border-[#e2e8f0]">
            <div className="text-[10px] text-[#666666] uppercase font-bold">Scientific Personnel</div>
            <div className="text-base font-bold font-mono text-[#111111]">
              {Object.values(specialists).reduce((a, b) => a + b, 0)} Specialists
            </div>
          </div>
          <div className="bg-[#f8fafc] p-2.5 border border-[#e2e8f0]">
            <div className="text-[10px] text-[#666666] uppercase font-bold">Breakthroughs</div>
            <div className="text-base font-bold font-mono text-[#111111]">{breakthroughs.length} Recorded</div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3 border text-xs font-bold flex items-center justify-between transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
              : notification.type === 'warning'
              ? 'bg-amber-50 border-amber-400 text-amber-800'
              : 'bg-blue-50 border-blue-400 text-blue-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{notification.text}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-xs underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* ========================================================
          2. PRIMARY NAVIGATION TABS
         ======================================================== */}
      <div className="flex flex-wrap gap-1 border-b border-[#111111] bg-white p-1">
        <button
          onClick={() => {
            sound.play('click');
            setActiveMainTab('codex');
          }}
          className={`px-4 py-2 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeMainTab === 'codex' ? 'bg-[#111111] text-white' : 'text-[#666666] hover:bg-[#f1f5f9]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Master Technology Codex
        </button>
        <button
          onClick={() => {
            sound.play('click');
            setActiveMainTab('igrn');
          }}
          className={`px-4 py-2 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeMainTab === 'igrn' ? 'bg-[#111111] text-white' : 'text-[#666666] hover:bg-[#f1f5f9]'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          Intergalactic Lab Network ({labNodes.length} Nodes)
        </button>
        <button
          onClick={() => {
            sound.play('click');
            setActiveMainTab('doctrines');
          }}
          className={`px-4 py-2 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeMainTab === 'doctrines' ? 'bg-[#111111] text-white' : 'text-[#666666] hover:bg-[#f1f5f9]'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          Empire Science Doctrines
        </button>
        <button
          onClick={() => {
            sound.play('click');
            setActiveMainTab('personnel');
          }}
          className={`px-4 py-2 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeMainTab === 'personnel' ? 'bg-[#111111] text-white' : 'text-[#666666] hover:bg-[#f1f5f9]'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          Workforce & Faculty Personnel
        </button>
        <button
          onClick={() => {
            sound.play('click');
            setActiveMainTab('breakthroughs');
          }}
          className={`px-4 py-2 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeMainTab === 'breakthroughs' ? 'bg-[#111111] text-white' : 'text-[#666666] hover:bg-[#f1f5f9]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Breakthrough Discoveries & Synergies
        </button>
      </div>

      {/* ========================================================
          TAB 1: MASTER TECHNOLOGY CODEX & ACTIVE QUEUE
         ======================================================== */}
      {activeMainTab === 'codex' && (
        <div className="space-y-6">
          {/* Active Queue Strip if any */}
          {researchQueue.length > 0 && (
            <div className="border border-[#111111] bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                    Active Scientific Projects in Progress ({researchQueue.length})
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#666666]">
                  Simultaneous Limit: {maxSimultaneousProjects}
                </span>
              </div>

              <div className="space-y-2">
                {researchQueue.map((item) => {
                  const progress = Math.max(
                    0,
                    Math.min(100, Math.round(((item.durationSeconds - item.remainingSeconds) / item.durationSeconds) * 100))
                  );
                  return (
                    <div
                      key={item.id}
                      className="p-3 border border-[#e2e8f0] bg-[#f8fafc] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#111111]">{item.techName}</span>
                          <span className="px-1.5 py-0.5 text-[10px] font-mono bg-[#111111] text-white font-bold">
                            Elevating to Lvl {item.targetLevel}
                          </span>
                        </div>
                        <div className="w-full bg-[#e2e8f0] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#111111] h-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-[#666666] font-mono">
                          <span>Progress: {progress}%</span>
                          <span>Time Left: {item.remainingSeconds}s</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {onInstantCompleteResearch && (
                          <button
                            onClick={() => {
                              sound.play('confirm');
                              onInstantCompleteResearch(item.id);
                            }}
                            className="px-2.5 py-1 text-[11px] bg-[#111111] text-white font-bold hover:bg-[#333333] transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <FastForward className="w-3 h-3" />
                            Instant Finish
                          </button>
                        )}
                        <button
                          onClick={() => {
                            sound.play('click');
                            onCancelResearch(item.id);
                          }}
                          className="px-2.5 py-1 text-[11px] border border-[#e2e8f0] bg-white text-[#666666] font-bold hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                        >
                          Abort Project
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Filter Bar */}
          <div className="border border-[#111111] bg-white p-4 space-y-3">
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search technologies, ship unlocks, bonuses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#cbd5e1] focus:border-[#111111] focus:outline-none"
                />
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto">
                {(['all', 'affordable', 'researching', 'completed'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      sound.play('click');
                      setStatusFilter(st);
                    }}
                    className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      statusFilter === st
                        ? 'bg-[#111111] text-white'
                        : 'border border-[#e2e8f0] text-[#666666] hover:bg-[#f1f5f9]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Discipline Categories Horizontal Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-[#e2e8f0] pt-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    sound.play('click');
                    setSelectedCategory(cat.categoryValue);
                  }}
                  className={`px-2.5 py-1 text-[11px] font-bold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
                    selectedCategory === cat.categoryValue
                      ? 'bg-[#111111] text-white'
                      : 'border border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc]'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main 2-Column Split: Tech List & Detailed Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Technologies Grid (Left Column) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between text-xs text-[#666666] font-bold">
                <span>Disciplines Catalog ({filteredTechs.length} Techs Available)</span>
                <span>Click card to inspect parameters</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[750px] overflow-y-auto pr-1">
                {filteredTechs.map((tech) => {
                  const prereqsMet = checkPrerequisitesMet(tech);
                  const affordable = canAfford(tech);
                  const researching = isResearching(tech.id);
                  const isSelected = activeTech.id === tech.id;
                  const isMaxLevel = tech.level >= tech.maxLevel;
                  const costInfo = getCostAndDuration(tech);

                  return (
                    <div
                      key={tech.id}
                      onClick={() => {
                        sound.play('click');
                        setActiveTechId(tech.id);
                      }}
                      className={`p-3.5 border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-[#111111] bg-white shadow-[2px_2px_0px_#111111]'
                          : 'border-[#e2e8f0] bg-[#ffffff] hover:border-[#94a3b8]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#64748b] tracking-wider">
                            {tech.category}
                          </span>
                          <div className="text-xs font-bold text-[#111111]">{tech.name}</div>
                        </div>
                        <div className="text-right">
                          <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-[#f1f5f9] text-[#111111] border border-[#cbd5e1]">
                            Lvl {tech.level} / {tech.maxLevel}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-[#64748b] line-clamp-2 mt-1.5 leading-relaxed">
                        {tech.description}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-[#f1f5f9] flex items-center justify-between text-[10px] font-mono">
                        <div className="flex items-center gap-1.5">
                          {researching ? (
                            <span className="px-1.5 py-0.5 bg-amber-500 text-white font-bold flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5 animate-spin" /> In Progress
                            </span>
                          ) : isMaxLevel ? (
                            <span className="px-1.5 py-0.5 bg-emerald-600 text-white font-bold">
                              ✓ Max Level
                            </span>
                          ) : prereqsMet ? (
                            <span className={affordable ? 'text-emerald-700 font-bold' : 'text-rose-600'}>
                              {affordable ? '● Ready to Advance' : '○ Insufficient Ore'}
                            </span>
                          ) : (
                            <span className="text-amber-600 font-bold">⚠ Prereqs Locked</span>
                          )}
                        </div>

                        <span className="text-[#64748b]">{costInfo.timeSeconds}s</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Tech Inspector (Right Column) */}
            <div className="lg:col-span-5 space-y-4">
              {activeTech ? (
                <div className="border border-[#111111] bg-white p-5 space-y-4 sticky top-4">
                  <div className="flex items-start justify-between gap-3 border-b border-[#e2e8f0] pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 bg-[#111111] text-white">
                          {activeTech.category}
                        </span>
                        <span className="text-xs text-[#64748b] font-mono">ID: {activeTech.id}</span>
                      </div>
                      <h3 className="text-base font-bold text-[#111111] mt-1">{activeTech.name}</h3>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-[#64748b]">Current Level</div>
                      <div className="text-lg font-bold font-mono text-[#111111]">
                        {activeTech.level} <span className="text-xs text-[#94a3b8]">/ {activeTech.maxLevel}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#475569] leading-relaxed">{activeTech.description}</p>

                  {/* Effects Breakdown */}
                  <div className="bg-[#f8fafc] p-3 border border-[#e2e8f0] space-y-2">
                    <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">
                      Technology Effects & Modifiers
                    </span>
                    {activeTech.effects && activeTech.effects.length > 0 ? (
                      <div className="space-y-1">
                        {activeTech.effects.map((eff, i) => (
                          <div key={i} className="text-xs font-mono flex items-center justify-between text-[#111111]">
                            <span>{eff.label || eff.type}</span>
                            <span className="font-bold text-emerald-600">
                              +{eff.valuePerLevel * (activeTech.level + 1)}{eff.unit} at Lvl {activeTech.level + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-[#64748b]">
                        Upgrading increases operational throughput by +10% per level.
                      </div>
                    )}
                  </div>

                  {/* Direct Unlocks Preview (Ships, Defenses, Megastructures, Blueprints) */}
                  {activeTech.unlockTargets && activeTech.unlockTargets.length > 0 && (
                    <div className="p-3 border border-[#e2e8f0] bg-[#ffffff] space-y-1.5">
                      <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">
                        Direct Architectural & Blueprint Unlocks
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeTech.unlockTargets.map((target, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-[11px] font-mono border border-[#cbd5e1] bg-[#f8fafc] text-[#111111] font-bold"
                          >
                            ✦ {target}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Next Level Research Costs & Speed Multipliers */}
                  {activeTech.level < activeTech.maxLevel ? (
                    (() => {
                      const cost = getCostAndDuration(activeTech);
                      const affordable = canAfford(activeTech);
                      const prereqsMet = checkPrerequisitesMet(activeTech);
                      const queueActive = isResearching(activeTech.id);

                      return (
                        <div className="space-y-3 pt-2 border-t border-[#e2e8f0]">
                          <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">
                            Advancement Cost for Level {activeTech.level + 1}
                          </span>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                            <div className={`p-2 border ${resources.metal >= cost.metal ? 'border-[#e2e8f0] bg-[#f8fafc]' : 'border-rose-300 bg-rose-50 text-rose-800'}`}>
                              <div className="text-[9px] text-[#64748b]">Metal Ore</div>
                              <div className="font-bold">{cost.metal.toLocaleString()}</div>
                            </div>
                            <div className={`p-2 border ${resources.crystal >= cost.crystal ? 'border-[#e2e8f0] bg-[#f8fafc]' : 'border-rose-300 bg-rose-50 text-rose-800'}`}>
                              <div className="text-[9px] text-[#64748b]">Crystal Silicon</div>
                              <div className="font-bold">{cost.crystal.toLocaleString()}</div>
                            </div>
                            <div className={`p-2 border ${resources.deuterium >= cost.deuterium ? 'border-[#e2e8f0] bg-[#f8fafc]' : 'border-rose-300 bg-rose-50 text-rose-800'}`}>
                              <div className="text-[9px] text-[#64748b]">Deuterium</div>
                              <div className="font-bold">{cost.deuterium.toLocaleString()}</div>
                            </div>
                            <div className={`p-2 border ${resources.energy >= cost.energy ? 'border-[#e2e8f0] bg-[#f8fafc]' : 'border-rose-300 bg-rose-50 text-rose-800'}`}>
                              <div className="text-[9px] text-[#64748b]">Energy Grid</div>
                              <div className="font-bold">{cost.energy.toLocaleString()} MW</div>
                            </div>
                          </div>

                          <div className="p-2 border border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between text-xs font-mono">
                            <span className="text-[#64748b]">Research Duration:</span>
                            <span className="font-bold text-[#111111]">
                              {cost.timeSeconds}s{' '}
                              <span className="text-emerald-600 text-[10px]">
                                (-{cost.speedBonusPercent}% bonus)
                              </span>
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2 pt-2">
                            {queueActive ? (
                              <button
                                disabled
                                className="w-full py-2.5 bg-amber-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-not-allowed opacity-90"
                              >
                                <Clock className="w-3.5 h-3.5 animate-spin" /> Currently Researching in Lab
                              </button>
                            ) : !prereqsMet ? (
                              <button
                                disabled
                                className="w-full py-2.5 bg-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-not-allowed"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" /> Prerequisites Unfulfilled
                              </button>
                            ) : (
                              <button
                                disabled={!affordable}
                                onClick={() => {
                                  sound.play('confirm');
                                  onStartResearch(activeTech.id);
                                  triggerNotice(`Elevated project initiated: ${activeTech.name} Lvl ${activeTech.level + 1}.`, 'success');
                                }}
                                className={`w-full py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                  affordable
                                    ? 'bg-[#111111] text-white hover:bg-[#333333] shadow-[2px_2px_0px_#666666]'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                              >
                                <Play className="w-3.5 h-3.5" />
                                {affordable ? `Commence Level ${activeTech.level + 1} Research` : 'Insufficient Resources'}
                              </button>
                            )}

                            {/* Manual Breakthrough Test */}
                            <button
                              onClick={handleTriggerBreakthrough}
                              className="w-full py-1.5 border border-[#111111] bg-[#f8fafc] hover:bg-[#111111] hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3" />
                              Induce Artificial Breakthrough
                            </button>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold text-center">
                      ✓ Maximum Imperial Master Level Reached for {activeTech.name}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: INTERGALACTIC RESEARCH NETWORK (IGRN)
         ======================================================== */}
      {activeMainTab === 'igrn' && (
        <div className="space-y-6">
          <div className="border border-[#111111] bg-white p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  INTERGALACTIC QUANTUM LAB NETWORK (IGRN)
                </h3>
                <p className="text-xs text-[#666666] mt-1 max-w-2xl">
                  Connects planetary science facilities across multiple colonies using quantum subspace entanglement conduits. The highest-tier laboratories join the network to drastically accelerate research speed and expand simultaneous project capacity.
                </p>
              </div>

              <div className="bg-[#f8fafc] border border-[#111111] p-3 text-right">
                <span className="text-[10px] text-[#666666] uppercase font-bold block">Combined Network Output</span>
                <span className="text-lg font-bold font-mono text-[#111111]">
                  +{igrnSpeedBonusPercent}% Global Velocity
                </span>
              </div>
            </div>

            {/* Network Nodes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {labNodes.map((node) => (
                <div key={node.planetId} className="p-4 border border-[#e2e8f0] bg-[#f8fafc] space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#111111]">{node.planetName}</div>
                      <div className="text-[11px] text-[#64748b]">Focus: {node.specialization} science</div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#111111] text-white">
                      Lvl {node.labLevel} Lab
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-[#64748b] font-mono">
                      <span>Network Contribution</span>
                      <span>{node.networkContribution}%</span>
                    </div>
                    <div className="w-full bg-[#e2e8f0] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#111111] h-full" style={{ width: `${node.networkContribution}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#e2e8f0] text-xs">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Quantum Link Online
                    </span>
                    <button
                      onClick={() => {
                        sound.play('click');
                        triggerNotice(`${node.planetName} diagnostic calibrated.`, 'info');
                      }}
                      className="px-2.5 py-1 text-[11px] border border-[#cbd5e1] bg-white font-bold hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                    >
                      Calibrate Node
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Overclock Compute Cluster */}
            <div className="mt-6 p-4 border border-[#111111] bg-[#f8fafc] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  Dark Matter / Naquadah Supercomputing Overclock
                </div>
                <p className="text-[11px] text-[#64748b] mt-0.5">
                  Inject 2,500 Deuterium & 100 Dark Matter to temporarily trigger +50% research speed across all queue slots.
                </p>
              </div>
              <button
                onClick={() => {
                  sound.play('confirm');
                  triggerNotice('Supercomputing cluster overclocked! +50% research velocity active.', 'success');
                }}
                className="px-4 py-2 bg-[#111111] text-white text-xs font-bold hover:bg-[#333333] transition-colors whitespace-nowrap cursor-pointer"
              >
                Initiate Overclock (-2,500 Deut)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: SCIENTIFIC DOCTRINES
         ======================================================== */}
      {activeMainTab === 'doctrines' && (
        <div className="space-y-6">
          <div className="border border-[#111111] bg-white p-5">
            <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <Award className="w-5 h-5" />
              EMPIRE SCIENTIFIC DOCTRINES & STATE DIRECTIVES
            </h3>
            <p className="text-xs text-[#666666] mt-1 max-w-2xl">
              National doctrines reshape your empire's research faculties, granting immense specialization bonuses to targeted technology branches. Select a doctrine to align your research programs with strategic objectives.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {SCIENCE_DOCTRINES.map((doc) => {
                const isActive = doc.id === activeDoctrineId;
                return (
                  <div
                    key={doc.id}
                    onClick={() => handleDoctrineChange(doc.id)}
                    className={`p-4 border transition-all cursor-pointer relative ${
                      isActive
                        ? 'border-[#111111] bg-[#ffffff] shadow-[3px_3px_0px_#111111]'
                        : 'border-[#e2e8f0] bg-[#f8fafc] hover:border-[#94a3b8]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#64748b] tracking-wider">
                          {doc.branch} Doctrine
                        </span>
                        <div className="text-sm font-bold text-[#111111] mt-0.5">{doc.name}</div>
                      </div>
                      {isActive && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-[#111111] text-white flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> ACTIVE DOCTRINE
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#475569] mt-2 leading-relaxed">{doc.description}</p>

                    <div className="mt-3 pt-3 border-t border-[#e2e8f0] grid grid-cols-2 gap-2 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-[#64748b] block">Speed Bonus:</span>
                        <span className="font-bold text-emerald-600">+{doc.speedBonusPercent}% Speed</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#64748b] block">Breakthrough Chance:</span>
                        <span className="font-bold text-[#111111]">+{doc.breakthroughChanceBonus}%</span>
                      </div>
                    </div>

                    <div className="mt-2 text-[10px] text-[#64748b]">
                      Applies to: {doc.bonusCategories.join(', ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: WORKFORCE & SCIENTIFIC FACULTY PERSONNEL
         ======================================================== */}
      {activeMainTab === 'personnel' && (
        <div className="space-y-6">
          <div className="border border-[#111111] bg-white p-5">
            <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <Bot className="w-5 h-5" />
              SCIENTIFIC FACULTY & RESEARCH SPECIALIST ALLOCATION
            </h3>
            <p className="text-xs text-[#666666] mt-1 max-w-2xl">
              Assign imperial researchers, theoretical physicists, naval architects, and cyberneticists across distinct faculties. Each allocated specialist contributes a targeted +0.2% research speed bonus to their discipline.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {[
                { key: 'theorists', label: 'Quantum Theorists', discipline: 'Energy, Quantum & Dimensional', count: specialists.theorists, icon: <Atom className="w-4 h-4" /> },
                { key: 'navalArchitects', label: 'Naval Ballistics Architects', discipline: 'Weapons, Shields, Armor & Fleet', count: specialists.navalArchitects, icon: <Swords className="w-4 h-4" /> },
                { key: 'industrialEngineers', label: 'Industrial Metallurgists', discipline: 'Mining, Materials & Megastructures', count: specialists.industrialEngineers, icon: <Pickaxe className="w-4 h-4" /> },
                { key: 'cyberneticists', label: 'Cybernetic AI Coders', discipline: 'AI, Computing & Espionage', count: specialists.cyberneticists, icon: <Cpu className="w-4 h-4" /> },
                { key: 'astroPhysicists', label: 'Astro-Propulsion Physicists', discipline: 'Propulsion, Warp & Colonization', count: specialists.astroPhysicists, icon: <Rocket className="w-4 h-4" /> },
              ].map((faculty) => (
                <div key={faculty.key} className="p-4 border border-[#e2e8f0] bg-[#f8fafc] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {faculty.icon}
                      <span className="text-xs font-bold text-[#111111]">{faculty.label}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#111111]">{faculty.count} Personnel</span>
                  </div>

                  <p className="text-[11px] text-[#64748b]">{faculty.discipline}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#e2e8f0]">
                    <span className="text-[11px] font-mono text-emerald-600 font-bold">
                      +{Math.floor(faculty.count / 5)}% Discipline Speed
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleAdjustSpecialist(faculty.key as any, -5)}
                        className="w-7 h-7 border border-[#cbd5e1] bg-white hover:bg-slate-100 flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => handleAdjustSpecialist(faculty.key as any, 5)}
                        className="w-7 h-7 border border-[#cbd5e1] bg-white hover:bg-slate-100 flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        +5
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 5: BREAKTHROUGHS & INNOVATION VAULT
         ======================================================== */}
      {activeMainTab === 'breakthroughs' && (
        <div className="space-y-6">
          <div className="border border-[#111111] bg-white p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  SCIENTIFIC BREAKTHROUGHS & TECHNOLOGY SYNERGIES
                </h3>
                <p className="text-xs text-[#666666] mt-1 max-w-2xl">
                  Breakthroughs occur dynamically when complex research initiatives trigger emergent scientific discoveries, granting instant discounts, research speed surges, and unique blueprint prototypes.
                </p>
              </div>

              <button
                onClick={handleTriggerBreakthrough}
                className="px-4 py-2 bg-[#111111] text-white text-xs font-bold hover:bg-[#333333] transition-colors cursor-pointer"
              >
                Trigger Breakthrough Test
              </button>
            </div>

            {/* Breakthrough History Log */}
            <div className="space-y-3 mt-6">
              <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider block">
                Recorded Breakthrough History ({breakthroughs.length})
              </span>

              {breakthroughs.map((bt) => (
                <div key={bt.id} className="p-3.5 border border-[#e2e8f0] bg-[#f8fafc] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#111111]">{bt.title}</span>
                      <span className="px-1.5 py-0.5 text-[10px] font-mono bg-amber-100 text-amber-800 border border-amber-300 font-bold">
                        {bt.rewardValue}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748b]">{bt.description}</p>
                  </div>

                  <span className="text-[10px] font-mono text-[#94a3b8] whitespace-nowrap">
                    {new Date(bt.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
