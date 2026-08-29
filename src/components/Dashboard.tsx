import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  Video,
  Sparkles,
  ArrowUpRight,
  Crown,
  Eye,
  EyeOff,
  ChevronRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  Flame,
  PlusCircle,
  Award,
} from 'lucide-react';
import { User, VideoSubmission, NewsBulletin } from '../types';
import { formatNaira, REWARD_MILESTONES } from '../utils/storage';

interface DashboardProps {
  user: User;
  submissions: VideoSubmission[];
  announcements: NewsBulletin[];
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  submissions,
  announcements,
  onNavigate,
}) => {
  const [showBalance, setShowBalance] = useState(true);
  const userSubmissions = submissions.filter((s) => s.userId === user.id);
  const approvedCount = userSubmissions.filter((s) => s.status === 'approved').length;
  const pendingCount = userSubmissions.filter(
    (s) => s.status === 'pending_admin' || s.status === 'processing'
  ).length;

  // Next milestone calculation
  const nextMilestone =
    REWARD_MILESTONES.find((m) => m.count > user.totalPosts) ||
    REWARD_MILESTONES[REWARD_MILESTONES.length - 1];

  const milestoneProgressPercent = Math.min(
    100,
    Math.round((user.totalPosts / (nextMilestone?.count || 5)) * 100)
  );

  return (
    <div className="space-y-4 pb-20 max-w-md mx-auto">
      {/* Mobile Top Welcome Header */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 font-black text-slate-950 text-base shadow-md shadow-emerald-500/20">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            {user.vipTier > 0 && (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[8px] font-black text-slate-950 ring-2 ring-slate-950">
                V{user.vipTier}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-white leading-tight">
                {user.fullName || 'Creator'}
              </h2>
              {user.vipTier > 0 ? (
                <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 text-[9px] font-bold text-amber-400">
                  VIP {user.vipTier}
                </span>
              ) : (
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400">
                  Creator
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">EarnHub Verified ID: #{user.id.slice(-6)}</p>
          </div>
        </div>

        <button
          id="dash-vip-quick-badge"
          onClick={() => onNavigate('vip')}
          className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-300 active:scale-95 transition-all"
        >
          <Crown className="h-3 w-3 text-amber-400" />
          <span>{user.vipTier > 0 ? `${user.vipTier}x Boost` : 'Get VIP'}</span>
        </button>
      </div>

      {/* 🌟 THE CORE BALANCE DASHBOARD BOX (Total Balance 0, Total Earn 0, Total Upload Videos 0) */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/30 p-5 shadow-2xl shadow-emerald-950/30">
        {/* Glow backdrop circles */}
        <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-emerald-500/15 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-amber-500/10 blur-2xl" />

        {/* Card Header: Label + Hide Balance Toggle */}
        <div className="relative z-10 flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <Wallet className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Total Balance
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBalance(!showBalance)}
              aria-label={showBalance ? 'Hide balance' : 'Show balance'}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
            >
              {showBalance ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
            <button
              id="dash-box-withdraw-btn"
              onClick={() => onNavigate('withdraw')}
              className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-600/30 active:scale-95"
            >
              <span>Withdraw</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* 1. Big Main Total Balance Value */}
        <div className="relative z-10 mt-1 mb-4">
          <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-baseline gap-1 font-['Outfit',sans-serif]">
            {showBalance ? formatNaira(user.totalBalance || 0) : '₦••••••'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ready for Sunday 7:00 PM bank disbursement</span>
          </p>
        </div>

        {/* Divider */}
        <div className="relative z-10 my-3.5 border-t border-slate-800/80" />

        {/* 2 & 3: Total Earn (0) & Total Upload Videos (0) Sub-Stats */}
        <div className="relative z-10 grid grid-cols-2 gap-3 pt-1">
          {/* Total Earn */}
          <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-3.5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                Total Earn
              </span>
              <TrendingUp className="h-3.5 w-3.5 text-pink-400" />
            </div>
            <div className="text-lg font-extrabold text-pink-400 font-['Outfit',sans-serif]">
              {showBalance ? formatNaira(user.totalEarned || 0) : '₦••••••'}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Verified task income</p>
          </div>

          {/* Total Upload Videos */}
          <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-3.5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                Upload Videos
              </span>
              <Video className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div className="text-lg font-extrabold text-white font-['Outfit',sans-serif]">
              {user.totalPosts || 0}{' '}
              <span className="text-xs font-normal text-slate-400">clips</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              <span className="text-emerald-400 font-semibold">{approvedCount} approved</span>
            </p>
          </div>
        </div>
      </div>

      {/* Primary Mobile Action Banner: Upload Video Task */}
      <div className="rounded-2xl border border-pink-500/30 bg-gradient-to-r from-pink-950/40 via-slate-900 to-rose-950/30 p-4 flex items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/30">
            <PlusCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-white">Daily Video Tasks Live</h3>
            <p className="text-[11px] text-pink-300">Upload 1-min verified clip to earn ₦4,000+</p>
          </div>
        </div>
        <button
          id="dash-upload-primary-btn"
          onClick={() => onNavigate('earn')}
          className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-3.5 py-2 text-xs font-black text-white shadow-md shadow-pink-600/30 active:scale-95 shrink-0"
        >
          <span>Upload</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Active Milestone Progress (5 to 30 videos = ₦20,000 to ₦101,000) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold text-white">Milestone Cash Reward</span>
          </div>
          <span className="text-[11px] font-extrabold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
            {nextMilestone?.badge || '5 Videos = ₦20,000'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800 mb-2">
          <div
            className="bg-gradient-to-r from-amber-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${milestoneProgressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>
            {user.totalPosts} / {nextMilestone?.count || 5} Videos Uploaded
          </span>
          <span className="text-emerald-400 font-semibold">
            {nextMilestone?.count ? Math.max(0, nextMilestone.count - user.totalPosts) : 0} more for cash bonus
          </span>
        </div>
      </div>

      {/* Quick Creator Services (4 touch tiles) */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          id="dash-tile-earn-view"
          onClick={() => onNavigate('earn_view')}
          className="flex items-center gap-3 p-3 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/30 to-slate-900 active:scale-95 transition-all text-left hover:border-amber-400"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Earn View</span>
            <span className="text-[10px] text-amber-400 font-semibold">Live Payouts & Stats</span>
          </div>
        </button>

        <button
          id="dash-tile-withdraw"
          onClick={() => onNavigate('withdraw')}
          className="flex items-center gap-3 p-3 rounded-2xl border border-slate-800 bg-slate-900/60 active:scale-95 transition-all text-left hover:border-emerald-500/40"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Bank Payout</span>
            <span className="text-[10px] text-slate-400">Sunday 6-12PM</span>
          </div>
        </button>

        <button
          id="dash-tile-leaderboard"
          onClick={() => onNavigate('leaderboard')}
          className="flex items-center gap-3 p-3 rounded-2xl border border-slate-800 bg-slate-900/60 active:scale-95 transition-all text-left hover:border-pink-500/40"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/15 text-pink-400">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Top Stars</span>
            <span className="text-[10px] text-slate-400">₦150k Won</span>
          </div>
        </button>

        <button
          id="dash-tile-vip"
          onClick={() => onNavigate('vip')}
          className="flex items-center gap-3 p-3 rounded-2xl border border-slate-800 bg-slate-900/60 active:scale-95 transition-all text-left hover:border-purple-500/40"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">VIP Boost</span>
            <span className="text-[10px] text-slate-400">Up to 5x Cash</span>
          </div>
        </button>
      </div>

      {/* Official Security Guarantee */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-3.5 flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" />
        <div className="text-[11px] text-slate-400">
          <span className="font-bold text-slate-200">Nigeria Creator Protection: </span>
          Original face verification secures instant weekend payouts to your bank.
        </div>
      </div>
    </div>
  );
};
