import React, { useState } from 'react';
import { Trophy, Shield, Mail, Send, CheckCircle2 } from 'lucide-react';
import { sound } from '../../sound';
import { Alliance, GameMessage, RankingEntry } from '../../types';

interface RankingsViewProps {
  rankings: RankingEntry[];
  alliances: Alliance[];
  messages: GameMessage[];
  defaultTab?: 'rankings' | 'alliances' | 'messages';
  onSendMessage: (recipient: string, subject: string, body: string) => void;
  onMarkMessageRead: (messageId: string) => void;
}

export const RankingsView: React.FC<RankingsViewProps> = ({
  rankings,
  alliances,
  messages,
  defaultTab = 'rankings',
  onSendMessage,
  onMarkMessageRead,
}) => {
  const [activeTab, setActiveTab] = useState<'rankings' | 'alliances' | 'messages'>(defaultTab);
  const [composeTo, setComposeTo] = useState('Supreme Commander Thor');
  const [composeSubj, setComposeSubj] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [sentNotice, setSentNotice] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeSubj || !composeBody) return;
    onSendMessage(composeTo, composeSubj, composeBody);
    sound.play('confirm');
    setComposeSubj('');
    setComposeBody('');
    setSentNotice(true);
    setTimeout(() => setSentNotice(false), 3000);
  };

  return (
    <div id="rankings-view" className="space-y-6">
      <div className="border border-[#dedede] bg-white p-6">
        <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase mb-1">
          GALACTIC CONCORDAT · DIPLOMACY & LEADERBOARDS
        </div>
        <h2 className="text-2xl font-bold text-[#111111]">Galactic Council & Standings</h2>
        <p className="text-sm text-[#666666] mt-1 max-w-2xl leading-relaxed">
          The sovereign ledger of all registered empires, verified combat rankings, formal treaty
          alliances, and subspace comm channels across the cosmos.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#dedede] bg-white px-4">
        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setActiveTab('rankings');
          }}
          className={`py-3 px-4 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'rankings'
              ? 'border-[#111111] text-[#111111]'
              : 'border-transparent text-[#666666] hover:text-[#111111]'
          }`}
        >
          Galactic Rankings
        </button>
        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setActiveTab('alliances');
          }}
          className={`py-3 px-4 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'alliances'
              ? 'border-[#111111] text-[#111111]'
              : 'border-transparent text-[#666666] hover:text-[#111111]'
          }`}
        >
          Alliances & Coalitions
        </button>
        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setActiveTab('messages');
          }}
          className={`py-3 px-4 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'messages'
              ? 'border-[#111111] text-[#111111]'
              : 'border-transparent text-[#666666] hover:text-[#111111]'
          }`}
        >
          Communications ({messages.filter((m) => !m.read).length})
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'rankings' && (
        <div className="border border-[#dedede] bg-white p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#dedede] text-[#777777] font-bold uppercase text-[10px]">
                  <th className="py-3 px-2">Rank</th>
                  <th className="py-3 px-2">Commander</th>
                  <th className="py-3 px-2">Race</th>
                  <th className="py-3 px-2">Overall Score</th>
                  <th className="py-3 px-2">Strike Power</th>
                  <th className="py-3 px-2">Defense Rating</th>
                  <th className="py-3 px-2">Covert Index</th>
                  <th className="py-3 px-2 text-right">Glory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eeeeee]">
                {rankings.map((r) => {
                  const isYou = r.commanderName.includes('(You)');
                  return (
                    <tr
                      key={r.rank}
                      className={`hover:bg-[#fafafa] transition-colors ${
                        isYou ? 'bg-[#f5f5f5] font-semibold border-l-4 border-[#111111]' : ''
                      }`}
                    >
                      <td className="py-3 px-2 font-mono font-bold text-[#111111]">#{r.rank}</td>
                      <td className="py-3 px-2">
                        <strong className="text-[#111111]">{r.commanderName}</strong>
                      </td>
                      <td className="py-3 px-2 text-[#666666]">{r.race}</td>
                      <td className="py-3 px-2 font-mono font-bold text-[#111111]">
                        {r.overallScore.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 font-mono text-[#555555]">
                        {r.attackScore.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 font-mono text-[#555555]">
                        {r.defenseScore.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 font-mono text-[#555555]">
                        {r.covertScore.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 font-mono font-bold text-right text-[#111111]">
                        {r.glory.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'alliances' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {alliances.map((a) => (
            <div key={a.id} className="border border-[#dedede] bg-white p-6 space-y-4">
              <div className="border-b border-[#eeeeee] pb-3">
                <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider block">
                  {a.tag}
                </span>
                <h3 className="text-base font-bold text-[#111111] mt-0.5">{a.name}</h3>
              </div>

              <div className="text-xs space-y-1.5 text-[#666666]">
                <div className="flex justify-between">
                  <span>Founder:</span>
                  <b className="text-[#111111]">{a.leader}</b>
                </div>
                <div className="flex justify-between">
                  <span>Members:</span>
                  <b className="font-mono text-[#111111]">{a.membersCount} realms</b>
                </div>
                <div className="flex justify-between">
                  <span>Treasury:</span>
                  <b className="font-mono text-[#111111]">{a.treasury.toLocaleString()} NQ</b>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-2 bg-white border border-[#111111] text-[#111111] text-xs font-bold uppercase hover:bg-[#111111] hover:text-white transition-colors"
              >
                {a.isOpen ? 'Apply for Membership →' : 'Closed Treaty'}
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 border border-[#dedede] bg-white p-6 space-y-4">
            <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider border-b border-[#eeeeee] pb-3">
              Subspace Inbox
            </h3>

            <div className="divide-y divide-[#eeeeee]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  onClick={() => onMarkMessageRead(m.id)}
                  className={`py-3.5 px-2 cursor-pointer transition-colors ${
                    !m.read ? 'bg-[#fcfcfc] border-l-2 border-[#111111]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-xs font-bold text-[#111111]">{m.sender}</strong>
                    <span className="text-[10px] text-[#888888]">{m.timestamp}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-[#333333]">{m.subject}</h4>
                  <p className="text-xs text-[#666666] mt-1 leading-relaxed">{m.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 border border-[#dedede] bg-white p-6 space-y-4">
            <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider border-b border-[#eeeeee] pb-3">
              Transmit Subspace Dispatch
            </h3>

            {sentNotice && (
              <div className="p-3 bg-[#fafafa] border border-[#111111] text-xs font-semibold text-[#111111]">
                Transmission broadcast sent across subspace network.
              </div>
            )}

            <form onSubmit={handleSend} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#555555] mb-1">Recipient</label>
                <input
                  type="text"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  className="w-full border border-[#cccccc] px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#555555] mb-1">Subject</label>
                <input
                  type="text"
                  value={composeSubj}
                  onChange={(e) => setComposeSubj(e.target.value)}
                  placeholder="e.g. Non-Aggression Pact Inquiry"
                  className="w-full border border-[#cccccc] px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#555555] mb-1">Message Body</label>
                <textarea
                  rows={4}
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  placeholder="Compose your diplomatic transmission..."
                  className="w-full border border-[#cccccc] px-3 py-2"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#111111] text-white font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors flex items-center justify-center gap-2"
              >
                <Send size={13} />
                <span>Transmit Signal →</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
