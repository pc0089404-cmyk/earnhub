import React, { useState } from 'react';
import { Trophy, Medal, Crown, Sparkles, Flame, Search, MapPin, Video, CheckCircle2 } from 'lucide-react';
import { INITIAL_LEADERBOARD, formatNaira } from '../utils/storage';

export const Leaderboard: React.FC = () => {
  const [filterTimeframe, setFilterTimeframe] = useState<'month' | 'week' | 'all'>('month');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCreators = INITIAL_LEADERBOARD.filter((creator) =>
    creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -top-10 -right-10 h-52 w-52 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-52 w-52 rounded-full bg-pink-600/20 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400">
              <Trophy className="h-3.5 w-3.5" />
              <span>Official Creator Leaderboard</span>
            </div>
            <h1 className="font-['Outfit',sans-serif] text-2xl sm:text-4xl font-black text-white">
              Top 30 Creator Earners in Nigeria
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Celebrating our highest earning video creators this month. Complete your daily verified tasks to climb the rankings and win up to ₦150k monthly bonuses.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-slate-950/80 p-4 text-center">
            <span className="text-[10px] uppercase font-bold text-amber-400">Total Pool Disbursed This Month</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">₦4,250,000+</div>
            <span className="text-[11px] text-slate-400">Directly deposited to bank accounts</span>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 2nd Place */}
        {INITIAL_LEADERBOARD[1] && (
          <div className="relative order-2 md:order-1 overflow-hidden rounded-3xl border border-slate-700 bg-slate-900/80 p-6 text-center shadow-lg">
            <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-slate-300 font-black text-sm">
              #2
            </div>
            <div className="mx-auto relative mb-4 h-20 w-20">
              <img
                src={INITIAL_LEADERBOARD[1].avatar}
                alt={INITIAL_LEADERBOARD[1].name}
                className="h-full w-full rounded-2xl object-cover ring-2 ring-slate-400 shadow-md"
              />
              <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-xl bg-slate-400 text-slate-950 font-bold shadow-md">
                <Medal className="h-4 w-4" />
              </div>
            </div>
            <h3 className="font-bold text-white text-base truncate">{INITIAL_LEADERBOARD[1].name}</h3>
            <span className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3 text-slate-500" /> {INITIAL_LEADERBOARD[1].city}
            </span>
            <div className="my-3 text-xl font-black text-amber-400">
              {formatNaira(INITIAL_LEADERBOARD[1].totalEarned)}
            </div>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] font-bold text-slate-300">
              {INITIAL_LEADERBOARD[1].videosUploaded} Verified Videos
            </span>
          </div>
        )}

        {/* 1st Place Champion */}
        {INITIAL_LEADERBOARD[0] && (
          <div className="relative order-1 md:order-2 overflow-hidden rounded-3xl border-2 border-amber-400/80 bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 p-6 text-center shadow-2xl shadow-amber-500/20 scale-105">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-3 py-0.5 text-[10px] font-black text-slate-950 uppercase tracking-widest shadow-md">
              👑 #1 Overall Champion
            </div>
            <div className="mx-auto relative my-4 h-24 w-24">
              <img
                src={INITIAL_LEADERBOARD[0].avatar}
                alt={INITIAL_LEADERBOARD[0].name}
                className="h-full w-full rounded-3xl object-cover ring-4 ring-amber-400 shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 font-black shadow-lg animate-bounce">
                <Crown className="h-5 w-5" />
              </div>
            </div>
            <h3 className="font-extrabold text-white text-lg truncate">{INITIAL_LEADERBOARD[0].name}</h3>
            <span className="text-xs text-amber-300 flex items-center justify-center gap-1 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-amber-400" /> {INITIAL_LEADERBOARD[0].city}
            </span>
            <div className="my-3 text-2xl font-black text-amber-400 tracking-tight">
              {formatNaira(INITIAL_LEADERBOARD[0].totalEarned)}
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="rounded-full bg-pink-600/30 px-3 py-1 text-[11px] font-bold text-pink-300 border border-pink-500/40">
                {INITIAL_LEADERBOARD[0].videosUploaded} Videos (30 Milestone Won)
              </span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {INITIAL_LEADERBOARD[2] && (
          <div className="relative order-3 overflow-hidden rounded-3xl border border-amber-700/60 bg-slate-900/80 p-6 text-center shadow-lg">
            <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-xl bg-amber-900/40 text-amber-500 font-black text-sm">
              #3
            </div>
            <div className="mx-auto relative mb-4 h-20 w-20">
              <img
                src={INITIAL_LEADERBOARD[2].avatar}
                alt={INITIAL_LEADERBOARD[2].name}
                className="h-full w-full rounded-2xl object-cover ring-2 ring-amber-700 shadow-md"
              />
              <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-xl bg-amber-700 text-slate-950 font-bold shadow-md">
                <Medal className="h-4 w-4" />
              </div>
            </div>
            <h3 className="font-bold text-white text-base truncate">{INITIAL_LEADERBOARD[2].name}</h3>
            <span className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3 text-slate-500" /> {INITIAL_LEADERBOARD[2].city}
            </span>
            <div className="my-3 text-xl font-black text-amber-400">
              {formatNaira(INITIAL_LEADERBOARD[2].totalEarned)}
            </div>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] font-bold text-slate-300">
              {INITIAL_LEADERBOARD[2].videosUploaded} Verified Videos
            </span>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search creator name or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterTimeframe('month')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              filterTimeframe === 'month'
                ? 'bg-pink-600 text-white'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setFilterTimeframe('week')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              filterTimeframe === 'week'
                ? 'bg-pink-600 text-white'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setFilterTimeframe('all')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              filterTimeframe === 'all'
                ? 'bg-pink-600 text-white'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            All-Time
          </button>
        </div>
      </div>

      {/* 30 Creators Full Ranking List Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-16">Rank</th>
                <th className="py-3 px-4">Creator</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Videos Submitted</th>
                <th className="py-3 px-4">VIP Level</th>
                <th className="py-3 px-4 text-right">Total Earnings (NGN)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCreators.map((creator) => {
                const isTop3 = creator.rank <= 3;
                return (
                  <tr
                    key={creator.id}
                    className={`hover:bg-slate-950/60 transition-colors ${
                      creator.rank === 1 ? 'bg-amber-950/10' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-black">
                      {creator.rank === 1 && (
                        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-400 text-slate-950 font-black">
                          1
                        </span>
                      )}
                      {creator.rank === 2 && (
                        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-300 text-slate-950 font-black">
                          2
                        </span>
                      )}
                      {creator.rank === 3 && (
                        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-700 text-white font-black">
                          3
                        </span>
                      )}
                      {creator.rank > 3 && <span className="text-slate-400 pl-2">#{creator.rank}</span>}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="h-9 w-9 rounded-xl object-cover ring-1 ring-slate-700"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{creator.name}</span>
                            {creator.badge && (
                              <span className="rounded-full bg-pink-500/20 px-1.5 py-0.2 text-[9px] font-extrabold text-pink-400">
                                {creator.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">Verified Creator ID #{creator.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-500" />
                      <span>{creator.city}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-200">{creator.videosUploaded}</span>{' '}
                      <span className="text-slate-500">videos</span>
                    </td>

                    <td className="py-3.5 px-4">
                      {creator.vipLevel > 0 ? (
                        <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-400/20">
                          VIP {creator.vipLevel}
                        </span>
                      ) : (
                        <span className="text-slate-500">Free Tier</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="font-black text-amber-400 text-sm">
                        {formatNaira(creator.totalEarned)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
