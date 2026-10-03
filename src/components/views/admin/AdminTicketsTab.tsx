import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  Send,
  User,
  Shield,
  Tag,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { sound } from '../../../sound';
import { AdminSupportTicket } from '../../../types';

interface AdminTicketsTabProps {
  tickets: AdminSupportTicket[];
  currentAdminName: string;
  onReplyTicket: (ticketId: string, message: string) => void;
  onUpdateTicketStatus: (
    ticketId: string,
    status: AdminSupportTicket['status']
  ) => void;
}

export const AdminTicketsTab: React.FC<AdminTicketsTabProps> = ({
  tickets,
  currentAdminName,
  onReplyTicket,
  onUpdateTicketStatus,
}) => {
  const [selectedTicket, setSelectedTicket] = useState<AdminSupportTicket | null>(
    tickets[0] || null
  );
  const [replyText, setReplyText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    onReplyTicket(selectedTicket.id, replyText.trim());
    sound.play('confirm');

    const updatedMessages = [
      ...selectedTicket.messages,
      {
        id: `msg-${Date.now()}`,
        sender: currentAdminName || 'SuperAdmin_Archon',
        senderRole: 'admin' as const,
        message: replyText.trim(),
        timestamp: new Date().toISOString(),
      },
    ];

    setSelectedTicket({
      ...selectedTicket,
      status: 'awaiting_user',
      messages: updatedMessages,
      updatedAt: new Date().toISOString(),
    });

    setReplyText('');
  };

  const insertCannedReply = (template: string) => {
    sound.play('click');
    setReplyText(template);
  };

  const getPriorityBadge = (priority: AdminSupportTicket['priority']) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-1.5 py-0.2 bg-red-600 text-white text-[9px] font-mono font-bold uppercase">Urgent</span>;
      case 'high':
        return <span className="px-1.5 py-0.2 bg-amber-600 text-white text-[9px] font-mono font-bold uppercase">High</span>;
      case 'normal':
        return <span className="px-1.5 py-0.2 bg-sky-600 text-white text-[9px] font-mono font-bold uppercase">Normal</span>;
      default:
        return <span className="px-1.5 py-0.2 bg-zinc-600 text-white text-[9px] font-mono font-bold uppercase">Low</span>;
    }
  };

  const getStatusBadge = (status: AdminSupportTicket['status']) => {
    switch (status) {
      case 'open':
        return <span className="px-2 py-0.5 bg-red-100 text-red-800 border border-red-300 text-[10px] font-mono font-bold uppercase">Open</span>;
      case 'in_progress':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono font-bold uppercase">In Progress</span>;
      case 'awaiting_user':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-900 border border-blue-300 text-[10px] font-mono font-bold uppercase">Awaiting Player</span>;
      case 'resolved':
      case 'closed':
        return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-mono font-bold uppercase">Resolved</span>;
      default:
        return null;
    }
  };

  return (
    <div id="admin-tickets-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="border border-[#111111] bg-[#111111] text-white p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-sky-400 text-[#111111] text-[10px] font-mono font-extrabold uppercase">
              OGame Operator Helpdesk
            </span>
            <span className="text-xs font-mono text-[#aaaaaa]">
              {tickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length} Active Support Inquiries
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight">Support Ticket Desk & Player Appeals</h3>
          <p className="text-xs text-[#cccccc] max-w-2xl mt-1">
            Process player bug reports, battle loss audits, Dark Matter payment confirmations,
            and rule infraction appeals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="border border-[#dedede] bg-white p-3 space-y-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-3 text-[#888888]" />
              <input
                type="text"
                placeholder="Search ticket #, player, or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs font-mono border border-[#dedede] bg-[#fafafa] focus:border-[#111111] outline-hidden"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto">
              {['all', 'open', 'in_progress', 'resolved'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 text-xs font-mono uppercase transition-colors cursor-pointer border ${
                    statusFilter === st
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-[#fafafa] text-[#555555] border-[#dedede] hover:bg-[#eeeeee]'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-[#dedede] bg-white divide-y divide-[#eeeeee] max-h-[600px] overflow-y-auto">
            {filteredTickets.map((t) => {
              const isSelected = selectedTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    sound.play('click');
                    setSelectedTicket(t);
                  }}
                  className={`p-4 cursor-pointer transition-colors space-y-1.5 ${
                    isSelected
                      ? 'bg-[#111111] text-white'
                      : 'hover:bg-[#f8f8f8] text-[#222222]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold">{t.ticketNumber}</span>
                      {getPriorityBadge(t.priority)}
                    </div>
                    {getStatusBadge(t.status)}
                  </div>

                  <div className="font-bold text-xs font-mono truncate">{t.subject}</div>

                  <div className="text-[10px] font-mono opacity-75 flex items-center justify-between">
                    <span>Player: {t.username}</span>
                    <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ticket Conversation View (7 cols) */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="border border-[#dedede] bg-white p-5 space-y-5 flex flex-col h-full">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#eeeeee] gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-indigo-700">
                      {selectedTicket.ticketNumber}
                    </span>
                    <h4 className="font-bold text-base text-[#111111]">
                      {selectedTicket.subject}
                    </h4>
                  </div>
                  <div className="text-xs font-mono text-[#777777] mt-0.5">
                    Category: <strong className="uppercase">{selectedTicket.category.replace('_', ' ')}</strong> • From: {selectedTicket.username}
                  </div>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as AdminSupportTicket['status'];
                      onUpdateTicketStatus(selectedTicket.id, newStatus);
                      setSelectedTicket({ ...selectedTicket, status: newStatus });
                      sound.play('confirm');
                    }}
                    className="p-1.5 text-xs font-mono border border-[#cccccc] bg-[#fafafa]"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="awaiting_user">Awaiting Player</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Message History */}
              <div className="space-y-3 max-h-[350px] overflow-y-auto p-2 bg-[#fafafa] border border-[#eeeeee]">
                {selectedTicket.messages.map((msg) => {
                  const isAdmin = msg.senderRole === 'admin';
                  return (
                    <div
                      key={msg.id}
                      className={`p-3 text-xs font-mono rounded-xs ${
                        isAdmin
                          ? 'bg-[#111111] text-white ml-6'
                          : 'bg-white text-[#222222] border border-[#dedede] mr-6'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1 pb-1 border-b border-white/10 opacity-80 text-[10px]">
                        <span className="font-bold flex items-center gap-1">
                          {isAdmin ? <Shield size={11} className="text-amber-400" /> : <User size={11} />}
                          <span>{msg.sender} ({isAdmin ? 'Game Operator' : 'Player'})</span>
                        </span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.message}</div>
                    </div>
                  );
                })}
              </div>

              {/* Canned Quick Replies */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#888888] uppercase block">
                  Quick Canned Macros:
                </span>
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      insertCannedReply(
                        'Thank you for contacting Game Operations. We have reviewed your combat log and verified the outcome is fully compliant with game mechanics.'
                      )
                    }
                    className="px-2 py-1 bg-[#f0f0f0] hover:bg-[#e0e0e0] text-[11px] font-mono"
                  >
                    Battle Audit OK
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      insertCannedReply(
                        'Your Dark Matter account credit has been manually re-synchronized and credited to your empire vault. Enjoy your game!'
                      )
                    }
                    className="px-2 py-1 bg-[#f0f0f0] hover:bg-[#e0e0e0] text-[11px] font-mono"
                  >
                    Dark Matter Credited
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      insertCannedReply(
                        'Under Rule 4.2 (Anti-Pushing & Multi-Accounting), unmetered one-way fleet transports between matching IPs are strictly prohibited. Ban upheld.'
                      )
                    }
                    className="px-2 py-1 bg-[#f0f0f0] hover:bg-[#e0e0e0] text-[11px] font-mono"
                  >
                    Ban Upheld Rule 4.2
                  </button>
                </div>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="space-y-2 mt-auto">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type official operator response..."
                  className="w-full p-2.5 border border-[#cccccc] text-xs font-mono focus:border-[#111111] outline-hidden bg-[#fdfdfd]"
                  required
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#111111] hover:bg-sky-600 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send size={13} />
                    <span>Dispatch Operator Response</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="border border-[#dedede] bg-white p-12 text-center text-xs text-[#888888] font-mono">
              Select a ticket to view conversation thread.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
