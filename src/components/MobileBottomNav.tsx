import React from 'react';
import { Home, Flame, PlusCircle, Wallet, User as UserIcon, Trophy, Sparkles } from 'lucide-react';
import { User } from '../types';

interface MobileBottomNavProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  user: User | null;
  unreadCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onNavigate,
  user,
  unreadCount,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-3 pb-3 pt-1 pointer-events-none">
      <div className="pointer-events-auto flex items-center justify-around rounded-2xl border border-slate-800/90 bg-slate-950/95 backdrop-blur-2xl px-2 py-1.5 shadow-2xl shadow-black/80">
        {/* 1. Home */}
        <button
          id="mobile-tab-home"
          onClick={() => onNavigate('dashboard')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
            activeTab === 'dashboard'
              ? 'text-emerald-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
          {activeTab === 'dashboard' && (
            <span className="absolute -bottom-1 h-1 w-4 rounded-full bg-emerald-400" />
          )}
        </button>

        {/* 2. Tasks / Earn */}
        <button
          id="mobile-tab-earn"
          onClick={() => onNavigate('earn')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
            activeTab === 'earn'
              ? 'text-pink-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="h-5 w-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Tasks</span>
          {activeTab === 'earn' && (
            <span className="absolute -bottom-1 h-1 w-4 rounded-full bg-pink-400" />
          )}
        </button>

        {/* 3. Center Glow Action: Upload Video Task */}
        <button
          id="mobile-tab-upload-action"
          onClick={() => onNavigate('earn')}
          className="relative -top-3 flex flex-col items-center group focus:outline-none"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-[2px] shadow-lg shadow-emerald-500/40 transition-transform active:scale-95 group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950">
              <PlusCircle className="h-6 w-6 text-emerald-400 group-hover:text-white transition-colors" />
            </div>
          </div>
          <span className="text-[9px] font-black text-emerald-400 mt-0.5">Upload</span>
        </button>

        {/* 4. Withdraw */}
        <button
          id="mobile-tab-withdraw"
          onClick={() => onNavigate('withdraw')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
            activeTab === 'withdraw'
              ? 'text-amber-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wallet className="h-5 w-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Payout</span>
          {activeTab === 'withdraw' && (
            <span className="absolute -bottom-1 h-1 w-4 rounded-full bg-amber-400" />
          )}
        </button>

        {/* 5. Profile / More */}
        <button
          id="mobile-tab-profile"
          onClick={() => onNavigate('profile')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
            activeTab === 'profile' || activeTab === 'vip' || activeTab === 'leaderboard' || activeTab === 'admin'
              ? 'text-purple-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserIcon className="h-5 w-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Profile</span>
          {user?.vipTier && user.vipTier > 0 ? (
            <span className="absolute -top-1 right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-[8px] font-black text-slate-950">
              {user.vipTier}
            </span>
          ) : null}
          {(activeTab === 'profile' || activeTab === 'vip' || activeTab === 'leaderboard' || activeTab === 'admin') && (
            <span className="absolute -bottom-1 h-1 w-4 rounded-full bg-purple-400" />
          )}
        </button>
      </div>
    </nav>
  );
};
