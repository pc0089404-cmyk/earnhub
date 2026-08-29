import React from 'react';
import { ShieldAlert, Ban, LogOut, MessageSquare, AlertTriangle } from 'lucide-react';
import { User } from '../types';

interface BlockedScreenProps {
  user: User;
  onLogout: () => void;
}

export const BlockedScreen: React.FC<BlockedScreenProps> = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-rose-500/40 bg-slate-900 p-6 sm:p-8 text-center shadow-2xl shadow-rose-500/20">
        
        {/* Glow */}
        <div className="absolute -top-20 -left-20 h-48 w-48 rounded-full bg-rose-600/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/20 text-rose-500 border border-rose-500/30 animate-pulse">
            <Ban className="h-10 w-10" />
          </div>

          <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-black text-rose-300 uppercase tracking-widest">
            Account Suspended
          </span>

          <h2 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-black text-white mt-3">
            Access to EarnHub is Blocked
          </h2>

          <div className="my-6 rounded-2xl border border-rose-500/30 bg-rose-950/30 p-4 text-xs text-slate-300 text-left space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Violation of Single-Creator Face Policy</span>
            </div>
            <p>
              Your account (<strong className="text-white">{user.emailOrPhone}</strong>) has been restricted by platform administration.
            </p>
            <p className="text-[11px] text-slate-400">
              Reason: Detected mismatched face identity, non-compliant third party clips, or automated upload activity.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => alert('Support appeal reference #TR-' + Date.now() + ' created. Our compliance desk will review within 24 hours.')}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-3 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <MessageSquare className="h-4 w-4 text-pink-400" />
              <span>Submit Verification Appeal Ticket</span>
            </button>

            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 py-3 text-xs font-black text-white shadow-lg shadow-rose-600/30 hover:from-rose-500 hover:to-pink-500 transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out & Switch Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
