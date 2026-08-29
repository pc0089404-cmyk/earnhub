import React from 'react';
import { Newspaper, Bell, Sparkles, Flame, Trophy, AlertCircle, Share2, Clock, CheckCircle } from 'lucide-react';
import { NewsBulletin } from '../types';

interface NewsAnnouncementsProps {
  announcements: NewsBulletin[];
  onNavigate: (tab: string) => void;
}

export const NewsAnnouncements: React.FC<NewsAnnouncementsProps> = ({
  announcements,
  onNavigate,
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-pink-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/40 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs font-bold text-pink-400 mb-2">
              <Newspaper className="h-3.5 w-3.5" />
              <span>Official Platform Bulletins</span>
            </div>
            <h1 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-black text-white">
              Platform News, Winners & Sprint Updates
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Stay up-to-date with reward pool updates, winner announcements, bonus campaigns, and Sunday withdrawal reminders.
            </p>
          </div>

          <button
            onClick={() => onNavigate('earn')}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 px-5 py-3 text-xs font-black text-white shadow-lg shadow-pink-600/30 hover:scale-105 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>Join Active Sprint</span>
          </button>
        </div>
      </div>

      {/* Bulletins Feed */}
      <div className="grid grid-cols-1 gap-4">
        {announcements.map((item) => {
          let badgeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
          let icon = <Bell className="h-4 w-4" />;

          if (item.tag === 'PROMO') {
            badgeColor = 'bg-pink-500/20 text-pink-300 border-pink-500/30';
            icon = <Flame className="h-4 w-4 text-pink-400" />;
          } else if (item.tag === 'WINNER') {
            badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
            icon = <Trophy className="h-4 w-4 text-amber-400" />;
          } else if (item.tag === 'ALERT') {
            badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
            icon = <AlertCircle className="h-4 w-4 text-rose-400" />;
          }

          return (
            <div
              key={item.id}
              className={`rounded-3xl border p-6 backdrop-blur-md transition-all ${
                item.isPinned
                  ? 'border-pink-500/40 bg-gradient-to-r from-slate-900 to-pink-950/20 shadow-lg shadow-pink-500/5'
                  : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-[10px] font-black uppercase tracking-wider ${badgeColor}`}>
                    {icon}
                    <span>{item.tag}</span>
                  </span>
                  {item.isPinned && (
                    <span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-400/30">
                      Pinned
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{item.publishedAt}</span>
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-slate-300">By {item.author}</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {item.content}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> Verified Platform Broadcast
                </span>

                <button
                  onClick={() => onNavigate('earn')}
                  className="text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors"
                >
                  Start Task Now →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
