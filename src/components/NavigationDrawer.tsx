import React from 'react';
import {
  X,
  LayoutDashboard,
  Video,
  Wallet,
  Trophy,
  Newspaper,
  Crown,
  UserCheck,
  ShieldAlert,
  LogOut,
  Sparkles,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { User } from '../types';
import { formatNaira } from '../utils/storage';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
  user: User | null;
  onLogout: () => void;
  onOpenPinModal: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onNavigate,
  user,
  onLogout,
  onOpenPinModal,
}) => {
  if (!isOpen) return null;

  const handleItemClick = (tabKey: string) => {
    onNavigate(tabKey);
    onClose();
  };

  const navItems = [
    { id: 'dashboard', label: 'Home Dashboard', icon: LayoutDashboard, badge: null, color: 'text-emerald-400' },
    { id: 'earn_view', label: 'Earn View (Live & Analytics)', icon: Sparkles, badge: 'Live Feed', color: 'text-amber-400' },
    { id: 'earn', label: 'Earn Video Tasks', icon: Flame, badge: 'Tasks Live', color: 'text-pink-400' },
    { id: 'withdraw', label: 'Withdraw (Nigeria Banks)', icon: Wallet, badge: 'Sunday Only', color: 'text-emerald-400' },
    { id: 'vip', label: 'VIP Boosters (1-10)', icon: Crown, badge: '5x Boost', color: 'text-purple-400' },
    { id: 'profile', label: 'Creator Profile', icon: UserCheck, badge: null, color: 'text-cyan-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative flex w-full max-w-xs flex-1 flex-col bg-slate-950 border-r border-slate-800/80 shadow-2xl p-4 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-[1.5px]">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <Sparkles className="h-4 w-4 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="font-['Outfit',sans-serif] text-lg font-black text-white">EarnHub</span>
              <p className="text-[10px] text-emerald-400 font-bold">Mobile Monetization Hub</p>
            </div>
          </div>
          <button
            id="drawer-close-btn"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* User Card */}
        {user && (
          <div className="my-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 font-bold text-slate-950 text-base">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                {user.vipTier > 0 && (
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[8px] font-black text-slate-950">
                    V{user.vipTier}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-white truncate">{user.fullName}</h4>
                <p className="text-[10px] text-slate-400 truncate">{user.emailOrPhone}</p>
                <div className="mt-1 flex items-center justify-between text-[10px]">
                  <span className="text-amber-400 font-extrabold">{formatNaira(user.totalBalance)}</span>
                  <span className="text-slate-400 font-medium">{user.totalPosts} videos</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex-1 space-y-1 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`drawer-link-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : item.color}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/20">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Admin Command Access - Only visible to users who entered MBKBLOODLINE */}
          {(user?.inviteCode === 'MBKBLOODLINE' || user?.isAdminEligible) && (
            <div className="pt-3 mt-3 border-t border-slate-800/80">
              <button
                id="drawer-admin-access-btn"
                onClick={() => {
                  onClose();
                  onNavigate('admin');
                }}
                className="w-full flex items-center justify-between rounded-xl bg-gradient-to-r from-amber-500/15 to-yellow-500/15 border border-amber-500/30 px-3 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/25 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="h-4 w-4 text-amber-400" />
                  <span>Admin Panel</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-amber-400" />
              </button>
            </div>
          )}
        </div>

        {/* Footer with Logout */}
        {user && (
          <div className="pt-3 border-t border-slate-800/80">
            <button
              id="drawer-logout-btn"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/20 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-950/40"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out Account</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
