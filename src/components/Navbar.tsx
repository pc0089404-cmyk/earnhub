import React from 'react';
import { Menu, Bell, Sparkles, Wallet, Flame, ArrowUpRight, Crown, ShieldAlert } from 'lucide-react';
import { User } from '../types';
import { formatNaira } from '../utils/storage';

interface NavbarProps {
  user: User | null;
  onOpenDrawer: () => void;
  onOpenMessages: () => void;
  onNavigate: (tab: string) => void;
  unreadCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenDrawer,
  onOpenMessages,
  onNavigate,
  unreadCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-14 max-w-md items-center justify-between px-3">
        {/* Left: Hamburger & Logo */}
        <div className="flex items-center gap-2.5">
          <button
            id="nav-drawer-toggle-btn"
            onClick={onOpenDrawer}
            aria-label="Toggle navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/90 text-slate-300 transition-colors hover:border-emerald-500/50 hover:bg-slate-800 hover:text-emerald-400 focus:outline-none"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Animated EarnHub Brand Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => onNavigate('dashboard')}
            className="group flex items-center gap-2 text-left focus:outline-none"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-[1.5px] shadow-md shadow-emerald-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <Sparkles className="h-4 w-4 text-emerald-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-['Outfit',sans-serif] text-lg font-black tracking-tight text-white">
                  Earn<span className="text-emerald-400">Hub</span>
                </span>
                <span className="rounded-full bg-emerald-400/10 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400 border border-emerald-400/20">
                  NGN
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Right: Notifications & Quick Balance */}
        <div className="flex items-center gap-2">
          {user && (
            <>
              {/* Balance Capsule */}
              <button
                id="navbar-balance-pill"
                onClick={() => onNavigate('withdraw')}
                className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-slate-900/90 px-2.5 py-1 text-left active:scale-95"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-400">
                  <Wallet className="h-3 w-3" />
                </div>
                <div className="text-xs font-black text-emerald-400 leading-tight">
                  {formatNaira(user.totalBalance || 0)}
                </div>
              </button>

              {/* Admin Quick Flag if eligible */}
              {user.isAdminEligible && (
                <button
                  id="navbar-admin-quick-btn"
                  onClick={() => onNavigate('admin')}
                  title="Admin Portal Access"
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                </button>
              )}
            </>
          )}

          {/* Messages / Notifications Bell */}
          <button
            id="navbar-messages-btn"
            onClick={onOpenMessages}
            aria-label="View notifications & messages"
            className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/90 text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-[9px] font-bold text-white ring-2 ring-slate-950 animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
