import React, { useState } from 'react';
import {
  Trophy,
  Crown,
  Sparkles,
  Flame,
  Search,
  MapPin,
  CheckCircle2,
  Newspaper,
  TrendingUp,
  Wallet,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  DollarSign,
  PieChart,
} from 'lucide-react';
import { NewsBulletin, User } from '../types';
import {
  INITIAL_LEADERBOARD,
  LIVE_CREATOR_ACTIVITY,
  formatNaira,
  getSubmissions,
  getWithdrawals,
} from '../utils/storage';

interface EarnViewProps {
  user: User | null;
  announcements: NewsBulletin[];
  onNavigate: (tab: string) => void;
}

export const EarnView: React.FC<EarnViewProps> = ({
  user,
  announcements,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'vip' | 'top10'>('all');

  // Real user data analysis (strictly real data, no demo numbers)
  const allSubmissions = getSubmissions();
  const allWithdrawals = getWithdrawals();

  const userSubmissions = allSubmissions.filter((s) => s.userId === user?.id);
  const userWithdrawals = allWithdrawals.filter((w) => w.userId === user?.id);

  const realTotalEarned = user?.totalEarned || 0;
  const realTotalBalance = user?.totalBalance || 0;

  const approvedSubs = userSubmissions.filter((s) => s.status === 'approved');
  const approvedProfit = approvedSubs.reduce(
    (sum, s) => sum + (s.approvedReward ?? s.potentialReward ?? 0),
    0
  );

  const pendingSubs = userSubmissions.filter(
    (s) => s.status === 'pending_admin' || s.status === 'processing'
  );
  const pendingProfit = pendingSubs.reduce(
    (sum, s) => sum + (s.potentialReward || 0),
    0
  );

  const completedWithdrawals = userWithdrawals.filter(
    (w) => w.status === 'completed'
  );
  const withdrawnTotal = completedWithdrawals.reduce((sum, w) => sum + w.amount, 0);

  const queuedWithdrawals = userWithdrawals.filter(
    (w) => w.status === 'queued_sunday' || w.status === 'processing'
  );
  const pendingWithdrawalTotal = queuedWithdrawals.reduce(
    (sum, w) => sum + w.amount,
    0
  );

  // Calculate circle progress percentage
  // If user has earned money or has balance/pending, compute completion/efficiency
  const totalCombinedPotential = Math.max(
    realTotalEarned + pendingProfit,
    realTotalBalance,
    50000 // reference benchmark scale
  );
  const earnedPercentage = Math.min(
    100,
    Math.round((realTotalEarned / totalCombinedPotential) * 100)
  );
  const availablePercentage = Math.min(
    100,
    Math.round((realTotalBalance / (realTotalEarned || 1)) * 100)
  );

  // SVG circular gauge math
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (Math.max(earnedPercentage, 5) / 100) * circumference;

  // Filter creator rankings
  const filteredCreators = INITIAL_LEADERBOARD.filter((creator) => {
    const matchesSearch =
      creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.city.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === 'vip') return creator.vipLevel > 0;
    if (activeFilter === 'top10') return creator.rank <= 10;
    return true;
  });

  const top1 = INITIAL_LEADERBOARD[0];
  const top2 = INITIAL_LEADERBOARD[1];
  const top3 = INITIAL_LEADERBOARD[2];

  return (
    <div className="space-y-5 pb-24 max-w-md mx-auto">
      {/* REAL PROFIT CIRCLE ANALYZER (NO DEMO - 100% REAL USER ACCOUNT PROFIT) */}
      <div className="relative overflow-hidden rounded-3xl border border-pink-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-5 shadow-2xl space-y-4">
        {/* Glow backdrop */}
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-pink-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Header Title */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-600/20 border border-pink-500/40 text-pink-400">
              <PieChart className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xs font-black text-white uppercase tracking-wider">
                Real Profit Circle Analysis
              </h2>
              <p className="text-[10px] text-slate-400">Live Account Metrics (No Demo)</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[9px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Real Profit
          </span>
        </div>

        {/* Circular Progress & Profit Metric Center */}
        <div className="relative flex flex-col items-center justify-center py-3">
          <div className="relative flex items-center justify-center">
            <svg className="h-48 w-48 -rotate-90 transform" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-800/80"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Secondary Track for Pending/Buffer */}
              {pendingProfit > 0 && (
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="url(#pendingGradient)"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={
                    circumference -
                    (Math.min(
                      100,
                      ((realTotalEarned + pendingProfit) / totalCombinedPotential) * 100
                    ) /
                      100) *
                      circumference
                  }
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out opacity-40"
                />
              )}
              {/* Main Real Earned Profit Circle Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="url(#profitGradient)"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]"
              />
              <defs>
                <linearGradient id="profitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="50%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
                <linearGradient id="pendingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Circle Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <span className="rounded-full bg-pink-500/20 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-pink-300 border border-pink-500/30">
                Verified Profit
              </span>
              <div className="font-['Outfit',sans-serif] text-xl font-black text-white mt-1">
                {formatNaira(realTotalEarned)}
              </div>
              <span className="text-[10px] text-emerald-400 font-bold mt-0.5">
                {realTotalBalance > 0 ? `${formatNaira(realTotalBalance)} Ready` : '₦0 Available'}
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5">
                {approvedSubs.length} Verified Tasks
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-300 text-center max-w-xs mt-2 leading-relaxed">
            {realTotalEarned > 0
              ? `You have earned ${formatNaira(realTotalEarned)} in real creator profit. ${realTotalBalance > 0 ? `${formatNaira(realTotalBalance)} is ready for Sunday withdrawal.` : ''}`
              : 'Submit your daily video tasks to generate real creator profit directly to your wallet.'}
          </p>
        </div>

        {/* 4 REAL PROFIT ANALYTIC TILES */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-800">
          {/* Available Withdrawable Balance */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-3 space-y-1">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-[10px] font-bold uppercase">Available Balance</span>
              <Wallet className="h-3.5 w-3.5" />
            </div>
            <div className="text-sm font-black text-emerald-400">
              {formatNaira(realTotalBalance)}
            </div>
            <p className="text-[9px] text-slate-400">Real Cash Ready</p>
          </div>

          {/* Pending Under Review */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-3 space-y-1">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-[10px] font-bold uppercase">Pending Profit</span>
              <Clock className="h-3.5 w-3.5" />
            </div>
            <div className="text-sm font-black text-amber-400">
              {formatNaira(pendingProfit)}
            </div>
            <p className="text-[9px] text-slate-400">{pendingSubs.length} Videos in Review</p>
          </div>

          {/* Real Withdrawn Payouts */}
          <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-3 space-y-1">
            <div className="flex items-center justify-between text-blue-400">
              <span className="text-[10px] font-bold uppercase">Total Withdrawn</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
            <div className="text-sm font-black text-blue-400">
              {formatNaira(withdrawnTotal)}
            </div>
            <p className="text-[9px] text-slate-400">{completedWithdrawals.length} Paid Out</p>
          </div>

          {/* Real Approved Videos */}
          <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-3 space-y-1">
            <div className="flex items-center justify-between text-purple-400">
              <span className="text-[10px] font-bold uppercase">Approved Payout</span>
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <div className="text-sm font-black text-purple-400">
              {formatNaira(approvedProfit)}
            </div>
            <p className="text-[9px] text-slate-400">{approvedSubs.length} Passed Audit</p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            id="circle-action-start-tasks"
            onClick={() => onNavigate('earn')}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 py-2.5 text-xs font-black text-white shadow-md hover:brightness-110 active:scale-95 transition-all"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Earn More Profit</span>
          </button>
          <button
            id="circle-action-withdraw"
            onClick={() => onNavigate('withdraw')}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 py-2.5 text-xs font-black text-white active:scale-95 transition-all"
          >
            <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
            <span>Cash Out Balance</span>
          </button>
        </div>
      </div>

      {/* TOP 3 PODIUM (Top Earners Across Nigeria) */}
      <div className="rounded-3xl border border-amber-500/30 bg-slate-900/90 p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-amber-400" />
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              Top 3 Champions
            </h3>
          </div>
          <span className="text-[10px] font-bold text-amber-400">Highest Earners</span>
        </div>

        {/* 1st Place Champion Highlight Card */}
        {top1 && (
          <div className="relative overflow-hidden rounded-2xl border-2 border-amber-400/70 bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-900 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[9px] font-black text-slate-950 uppercase tracking-wide shadow-sm">
                👑 #1 Top Champion
              </span>
              <span className="text-[10px] font-bold text-amber-300">
                VIP Level {top1.vipLevel}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <div className="relative">
                <img
                  src={top1.avatar}
                  alt={top1.name}
                  className="h-14 w-14 rounded-2xl object-cover ring-2 ring-amber-400 shadow-md"
                />
                <div className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-md">
                  1
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-extrabold text-white truncate">{top1.name}</h4>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <MapPin className="h-3 w-3 text-amber-400 shrink-0" />
                  <span className="truncate">{top1.city}</span>
                </div>
                <div className="text-lg font-black text-amber-400 mt-1">
                  {formatNaira(top1.totalEarned)}
                </div>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-300">
              <span>{top1.videosUploaded} Verified Videos</span>
              <span className="text-emerald-400 font-bold">100% Payout Verified</span>
            </div>
          </div>
        )}

        {/* 2nd and 3rd Places Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* #2 */}
          {top2 && (
            <div className="rounded-2xl border border-slate-700 bg-slate-950/80 p-3 space-y-1.5 relative">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[8px] font-bold text-slate-300">
                  🥈 #2 Rank
                </span>
                <span className="text-[9px] text-amber-400 font-bold">VIP {top2.vipLevel}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <img
                  src={top2.avatar}
                  alt={top2.name}
                  className="h-9 w-9 rounded-xl object-cover ring-1 ring-slate-400 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-bold text-white truncate">{top2.name}</h5>
                  <p className="text-[9px] text-slate-400 truncate">{top2.city}</p>
                </div>
              </div>
              <div className="text-xs font-black text-amber-400 pt-0.5">
                {formatNaira(top2.totalEarned)}
              </div>
              <p className="text-[9px] text-slate-400">{top2.videosUploaded} videos</p>
            </div>
          )}

          {/* #3 */}
          {top3 && (
            <div className="rounded-2xl border border-amber-800/40 bg-slate-950/80 p-3 space-y-1.5 relative">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-amber-900/40 px-2 py-0.5 text-[8px] font-bold text-amber-400">
                  🥉 #3 Rank
                </span>
                <span className="text-[9px] text-amber-400 font-bold">VIP {top3.vipLevel}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <img
                  src={top3.avatar}
                  alt={top3.name}
                  className="h-9 w-9 rounded-xl object-cover ring-1 ring-amber-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-bold text-white truncate">{top3.name}</h5>
                  <p className="text-[9px] text-slate-400 truncate">{top3.city}</p>
                </div>
              </div>
              <div className="text-xs font-black text-amber-400 pt-0.5">
                {formatNaira(top3.totalEarned)}
              </div>
              <p className="text-[9px] text-slate-400">{top3.videosUploaded} videos</p>
            </div>
          )}
        </div>
      </div>

      {/* SEARCH & FILTER CONTROLS */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 space-y-2.5">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search creator name or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex-1 rounded-xl py-1.5 text-[11px] font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-pink-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Top 30
          </button>
          <button
            onClick={() => setActiveFilter('top10')}
            className={`flex-1 rounded-xl py-1.5 text-[11px] font-bold transition-all ${
              activeFilter === 'top10'
                ? 'bg-pink-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Top 10 High
          </button>
          <button
            onClick={() => setActiveFilter('vip')}
            className={`flex-1 rounded-xl py-1.5 text-[11px] font-bold transition-all ${
              activeFilter === 'vip'
                ? 'bg-pink-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            VIP Stars
          </button>
        </div>
      </div>

      {/* FULL RANKINGS LIST TABLE */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Creator Standings ({filteredCreators.length})
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">Nigeria Leaderboard</span>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {filteredCreators.map((creator) => {
            const isTop3 = creator.rank <= 3;
            return (
              <div
                key={creator.id}
                className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                  creator.rank === 1
                    ? 'border-amber-500/40 bg-amber-950/20'
                    : isTop3
                    ? 'border-slate-700 bg-slate-950/80'
                    : 'border-slate-800/80 bg-slate-950/50 hover:bg-slate-950'
                }`}
              >
                {/* Rank Badge + Avatar + Name */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 shrink-0 text-center font-black">
                    {creator.rank === 1 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-amber-400 text-slate-950 text-[10px] mx-auto">
                        1
                      </span>
                    )}
                    {creator.rank === 2 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-slate-300 text-slate-950 text-[10px] mx-auto">
                        2
                      </span>
                    )}
                    {creator.rank === 3 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-amber-700 text-white text-[10px] mx-auto">
                        3
                      </span>
                    )}
                    {creator.rank > 3 && (
                      <span className="text-[11px] text-slate-500">#{creator.rank}</span>
                    )}
                  </div>

                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="h-8 w-8 rounded-xl object-cover ring-1 ring-slate-800 shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white truncate">{creator.name}</span>
                      {creator.vipLevel > 0 && (
                        <span className="rounded-md bg-amber-500/10 px-1 py-0.2 text-[8px] font-black text-amber-400 shrink-0">
                          V{creator.vipLevel}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-slate-400">
                      <MapPin className="h-2.5 w-2.5 text-slate-500" />
                      <span className="truncate">{creator.city}</span>
                      <span>•</span>
                      <span>{creator.videosUploaded} vids</span>
                    </div>
                  </div>
                </div>

                {/* Earnings */}
                <div className="text-right shrink-0 pl-2">
                  <div className="text-xs font-black text-amber-400">
                    {formatNaira(creator.totalEarned)}
                  </div>
                  <span className="text-[8px] text-emerald-400 font-semibold">Earned</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LIVE CREATOR EARNINGS FEED */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-pink-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Live Creator Earnings Feed
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">Real-time disbursements</span>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {LIVE_CREATOR_ACTIVITY.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 rounded-2xl border border-slate-800/80 bg-slate-950/60"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500/20 to-amber-500/20 border border-pink-500/30 font-bold text-white text-[10px]">
                  {item.avatar}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-white truncate">{item.name}</span>
                    <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                  </div>
                  <p className="text-[9px] text-slate-400 truncate">
                    {item.type} • <span className="text-slate-300 font-semibold">{item.bankOrMethod}</span>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 pl-2">
                <span className="text-xs font-black text-emerald-400">
                  +{formatNaira(item.amount)}
                </span>
                <p className="text-[8px] text-slate-500">{item.timeAgo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PLATFORM NEWS BULLETINS */}
      <div className="rounded-3xl border border-blue-500/30 bg-slate-900/90 p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-blue-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Platform Bulletins & News
            </h3>
          </div>
          <span className="text-[10px] text-blue-400 font-bold">Official</span>
        </div>

        <div className="space-y-2">
          {announcements.slice(0, 2).map((news) => (
            <div
              key={news.id}
              className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 space-y-1"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white">{news.title}</span>
                <span className="rounded-full px-2 py-0.5 text-[8px] font-bold shrink-0 bg-pink-500/10 text-pink-400 border border-pink-500/20">
                  {news.tag}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">{news.content}</p>
              <div className="flex items-center justify-between text-[9px] text-slate-500 pt-0.5">
                <span>By {news.author}</span>
                <span>{news.publishedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
