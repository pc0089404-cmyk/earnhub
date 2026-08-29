import React from 'react';
import { X, Bell, CheckCircle2, XCircle, Wallet, Crown, Sparkles, CheckCheck } from 'lucide-react';
import { UserMessage } from '../types';
import { formatNaira } from '../utils/storage';

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: UserMessage[];
  onMarkAllRead: () => void;
}

export const MessagesModal: React.FC<MessagesModalProps> = ({
  isOpen,
  onClose,
  messages,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-pink-500/10">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500/15 text-pink-400">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-white">
                Creator Notifications & Messages
              </h3>
              <p className="text-xs text-slate-400">Task approvals, bonuses, and payout updates</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-white p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Message List */}
        <div className="max-h-[60vh] overflow-y-auto p-5 space-y-3">
          {messages.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="h-10 w-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-400">No new notifications</p>
              <p className="text-xs text-slate-500 mt-1">Upload verified creator tasks to receive approval notices.</p>
            </div>
          ) : (
            messages.map((m) => {
              let Icon = Bell;
              let iconColor = 'text-pink-400 bg-pink-500/10';

              if (m.type === 'approval') {
                Icon = CheckCircle2;
                iconColor = 'text-emerald-400 bg-emerald-500/10';
              } else if (m.type === 'rejection') {
                Icon = XCircle;
                iconColor = 'text-rose-400 bg-rose-500/10';
              } else if (m.type === 'payout') {
                Icon = Wallet;
                iconColor = 'text-amber-400 bg-amber-500/10';
              } else if (m.type === 'vip') {
                Icon = Crown;
                iconColor = 'text-yellow-400 bg-yellow-500/10';
              }

              return (
                <div
                  key={m.id}
                  className={`rounded-2xl border p-4 transition-all ${
                    !m.read
                      ? 'border-pink-500/30 bg-gradient-to-r from-slate-950 to-pink-950/20'
                      : 'border-slate-800 bg-slate-950/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconColor}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-white truncate">{m.title}</h4>
                        <span className="text-[10px] text-slate-500 shrink-0">{m.date}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{m.content}</p>
                      {m.amount && (
                        <div className="mt-2 text-xs font-black text-amber-400">
                          Amount Credited: {formatNaira(m.amount)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
