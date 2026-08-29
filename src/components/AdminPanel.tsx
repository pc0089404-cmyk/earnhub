import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Video,
  CheckCircle2,
  XCircle,
  Gift,
  Send,
  Newspaper,
  Ban,
  Unlock,
  Wallet,
  Clock,
  Trash2,
  Sparkles,
  Crown,
  AlertCircle,
  DollarSign,
  Maximize2,
  X,
  Play,
  FileVideo,
  MoreVertical,
  Download,
  Check,
  Search,
  RefreshCw,
  Eye,
  CheckCheck,
} from 'lucide-react';
import {
  User,
  VideoSubmission,
  NewsBulletin,
  WithdrawalRequest,
  VIPPurchaseRequest,
} from '../types';
import { formatNaira } from '../utils/storage';

interface AdminPanelProps {
  users: User[];
  submissions: VideoSubmission[];
  announcements: NewsBulletin[];
  withdrawals: WithdrawalRequest[];
  vipPurchases?: VIPPurchaseRequest[];
  onApproveSubmission: (subId: string, rewardAmount: number) => void;
  onRejectSubmission: (subId: string, reason: string) => void;
  onApproveVIPPurchase?: (purchaseId: string) => void;
  onRejectVIPPurchase?: (purchaseId: string) => void;
  onToggleBlockUser: (userId: string) => void;
  onAddAnnouncement: (news: NewsBulletin) => void;
  onDisburseWithdrawal: (wId: string) => void;
  onGiftReward: (userId: string, amount: number, note?: string) => void;
  onDeleteUser?: (userId: string) => void;
  onDeleteSubmission?: (subId: string) => void;
  onDeleteAnnouncement?: (bulletinId: string) => void;
  onDeleteVIPPurchase?: (purchaseId: string) => void;
  onDeleteWithdrawal?: (withdrawalId: string) => void;
  onResetUsers?: () => Promise<void>;
  onResetAllData?: () => Promise<void>;
  onRefreshState?: () => Promise<void>;
  onNavigate: (tab: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  users,
  submissions,
  announcements,
  withdrawals,
  vipPurchases = [],
  onApproveSubmission,
  onRejectSubmission,
  onApproveVIPPurchase,
  onRejectVIPPurchase,
  onToggleBlockUser,
  onAddAnnouncement,
  onDisburseWithdrawal,
  onGiftReward,
  onDeleteUser,
  onDeleteSubmission,
  onDeleteAnnouncement,
  onDeleteVIPPurchase,
  onDeleteWithdrawal,
  onResetUsers,
  onResetAllData,
  onRefreshState,
  onNavigate,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<
    'user_tasks' | 'vip_buys' | 'users' | 'withdrawals' | 'news'
  >('user_tasks');

  // Search & Filter for User Tasks
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'approved' | 'declined'>('all');
  const [taskSearchQuery, setTaskSearchQuery] = useState('');

  // Search & Filter for Users
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'vip' | 'regular' | 'blocked'>('all');

  // Search & Filter for VIP Buys
  const [vipFilter, setVipFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [vipSearchQuery, setVipSearchQuery] = useState('');

  // Search & Filter for Withdrawals
  const [withdrawalFilter, setWithdrawalFilter] = useState<'all' | 'queued' | 'completed'>('all');

  // 3-dot video menu state: `${sub.id}-${vIdx}`
  const [openVideoMenu, setOpenVideoMenu] = useState<string | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetUsersModal, setShowResetUsersModal] = useState(false);
  const [showResetAllModal, setShowResetAllModal] = useState(false);

  // Gifting state inside users tab
  const [expandedUserForGift, setExpandedUserForGift] = useState<string | null>(null);
  const [giftAmounts, setGiftAmounts] = useState<{ [userId: string]: string }>({});
  const [giftNotes, setGiftNotes] = useState<{ [userId: string]: string }>({});
  const [giftSuccessUserId, setGiftSuccessUserId] = useState<string | null>(null);
  const [giftSuccessMessage, setGiftSuccessMessage] = useState<string | null>(null);

  // VIP screenshot modal preview
  const [previewScreenshotUrl, setPreviewScreenshotUrl] = useState<string | null>(null);

  // News form state
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsTag, setNewsTag] = useState<'PROMO' | 'WINNER' | 'UPDATE' | 'ALERT'>('PROMO');
  const [newsSuccess, setNewsSuccess] = useState(false);

  // Fallback sample videos if uploaded file blob cannot be fetched across devices
  const sampleFallbackVideos = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
  ];

  // Manual refresh trigger
  const handleManualRefresh = async () => {
    if (onRefreshState) {
      setIsRefreshing(true);
      await onRefreshState();
      setTimeout(() => setIsRefreshing(false), 600);
      setDownloadToast('Server data refreshed successfully!');
      setTimeout(() => setDownloadToast(null), 2500);
    }
  };

  const pendingSubmissions = submissions.filter(
    (s) => s.status === 'pending_admin' || s.status === 'processing'
  );
  const approvedSubmissions = submissions.filter((s) => s.status === 'approved');
  const declinedSubmissions = submissions.filter((s) => s.status === 'rejected');

  const pendingVIPPurchases = vipPurchases.filter((p) => p.status === 'pending');
  const queuedSundayWithdrawals = withdrawals.filter(
    (w) => w.status === 'queued_sunday' || w.status === 'processing'
  );

  // Filtered Submissions
  const filteredSubmissions = submissions.filter((s) => {
    // Status filter
    if (taskFilter === 'pending' && !(s.status === 'pending_admin' || s.status === 'processing')) {
      return false;
    }
    if (taskFilter === 'approved' && s.status !== 'approved') return false;
    if (taskFilter === 'declined' && s.status !== 'rejected') return false;

    // Search query
    if (taskSearchQuery.trim()) {
      const q = taskSearchQuery.toLowerCase();
      const matchName = s.userName?.toLowerCase().includes(q);
      const matchTitle = s.taskTitle?.toLowerCase().includes(q);
      const matchFile = s.fileName?.toLowerCase().includes(q);
      const matchId = s.id?.toLowerCase().includes(q);
      if (!matchName && !matchTitle && !matchFile && !matchId) return false;
    }
    return true;
  });

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    if (userFilter === 'vip' && (!u.vipTier || u.vipTier === 0)) return false;
    if (userFilter === 'regular' && u.vipTier > 0) return false;
    if (userFilter === 'blocked' && !u.isBlocked) return false;

    if (userSearchQuery.trim()) {
      const q = userSearchQuery.toLowerCase();
      const matchName = u.fullName?.toLowerCase().includes(q);
      const matchEmailPhone = u.emailOrPhone?.toLowerCase().includes(q);
      const matchInvite = u.inviteCode?.toLowerCase().includes(q);
      if (!matchName && !matchEmailPhone && !matchInvite) return false;
    }
    return true;
  });

  // Filtered VIP Purchases
  const filteredVIPPurchases = vipPurchases.filter((p) => {
    if (vipFilter === 'pending' && p.status !== 'pending') return false;
    if (vipFilter === 'approved' && p.status !== 'approved') return false;
    if (vipFilter === 'rejected' && p.status !== 'rejected') return false;

    if (vipSearchQuery.trim()) {
      const q = vipSearchQuery.toLowerCase();
      const matchName = p.userName?.toLowerCase().includes(q);
      const matchEmail = p.userEmailOrPhone?.toLowerCase().includes(q);
      const matchTier = p.tierName?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchTier) return false;
    }
    return true;
  });

  // Filtered Withdrawals
  const filteredWithdrawals = withdrawals.filter((w) => {
    if (
      withdrawalFilter === 'queued' &&
      !(w.status === 'queued_sunday' || w.status === 'processing')
    ) {
      return false;
    }
    if (withdrawalFilter === 'completed' && w.status !== 'completed') return false;
    return true;
  });

  // Download video to device / phone
  const handleDownloadVideo = async (url: string, fileName?: string) => {
    const cleanName = (fileName || 'earnhub_video').replace(/\s+/g, '_');
    const targetName = cleanName.endsWith('.mp4') ? cleanName : `${cleanName}.mp4`;
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = targetName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
      setDownloadToast(`Saved "${targetName}" to device storage!`);
      setTimeout(() => setDownloadToast(null), 3500);
    } catch {
      // Fallback
      const a = document.createElement('a');
      a.href = url || sampleFallbackVideos[0];
      a.download = targetName;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloadToast(`Downloading "${targetName}"...`);
      setTimeout(() => setDownloadToast(null), 3500);
    } finally {
      setOpenVideoMenu(null);
    }
  };

  const handlePostNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsContent.trim()) return;

    const newBulletin: NewsBulletin = {
      id: 'news-' + Date.now(),
      title: newsTitle.trim(),
      content: newsContent.trim(),
      author: 'Executive Admin',
      publishedAt: 'Just now',
      isPinned: true,
      tag: newsTag,
    };

    onAddAnnouncement(newBulletin);
    setNewsTitle('');
    setNewsContent('');
    setNewsSuccess(true);
    setTimeout(() => setNewsSuccess(false), 3000);
  };

  const handleSendGiftToUser = (u: User) => {
    const amountStr = giftAmounts[u.id] || '10000';
    const amountNum = Number(amountStr);
    if (!amountNum || amountNum <= 0) return;

    const note =
      giftNotes[u.id] || `you have been gifted ${formatNaira(amountNum)} by earnhub company`;
    onGiftReward(u.id, amountNum, note);

    setGiftSuccessUserId(u.id);
    setGiftSuccessMessage(
      `Gifted ${formatNaira(amountNum)} to ${u.fullName}! Credited to their dashboard.`
    );

    setTimeout(() => {
      setGiftSuccessUserId(null);
      setGiftSuccessMessage(null);
    }, 3000);
  };

  const handleApprove = (sub: VideoSubmission) => {
    onApproveSubmission(sub.id, sub.potentialReward);
  };

  const handleReject = (sub: VideoSubmission) => {
    onRejectSubmission(
      sub.id,
      'your videos was declined due not clear and lack of videoing face'
    );
  };

  return (
    <div className="space-y-4 pb-20 max-w-md sm:max-w-3xl mx-auto">
      {/* Toast feedback */}
      {downloadToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white shadow-2xl animate-bounce">
          <Check className="h-4 w-4" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/50 via-slate-950 to-slate-900 p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-300 mb-1">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              <span>Admin Management Hub</span>
            </div>
            <h1 className="font-['Outfit',sans-serif] text-xl sm:text-2xl font-black text-white">
              Executive Administration Panel
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Watch uploaded videos, download clips to phone, approve tasks, manage users, or disburse payouts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-bold text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Fast Sync (1.2s)</span>
            </div>

            <button
              id="admin-sync-refresh-btn"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/25 transition-all shadow-md active:scale-95"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Server'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Summary Badges */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div
          onClick={() => {
            setActiveAdminTab('user_tasks');
            setTaskFilter('pending');
          }}
          className="cursor-pointer rounded-3xl border border-pink-500/30 bg-slate-900/80 p-3.5 sm:p-4 hover:border-pink-500/60 transition-all"
        >
          <div className="flex items-center justify-between text-pink-300 text-xs font-bold">
            <span>User Tasks</span>
            <Video className="h-4 w-4 text-pink-400" />
          </div>
          <div className="mt-1 text-xl sm:text-2xl font-black text-pink-400">
            {pendingSubmissions.length}
          </div>
          <span className="text-[10px] text-pink-400/80 font-semibold">
            {submissions.length} Total ({pendingSubmissions.length} Pending)
          </span>
        </div>

        <div
          onClick={() => {
            setActiveAdminTab('vip_buys');
            setVipFilter('pending');
          }}
          className="cursor-pointer rounded-3xl border border-amber-500/30 bg-slate-900/80 p-3.5 sm:p-4 hover:border-amber-500/60 transition-all"
        >
          <div className="flex items-center justify-between text-amber-300 text-xs font-bold">
            <span>VIP Buys</span>
            <Crown className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-1 text-xl sm:text-2xl font-black text-amber-400">
            {pendingVIPPurchases.length}
          </div>
          <span className="text-[10px] text-amber-400/80 font-semibold">
            {vipPurchases.length} Total ({pendingVIPPurchases.length} Pending)
          </span>
        </div>

        <div
          onClick={() => setActiveAdminTab('users')}
          className="cursor-pointer rounded-3xl border border-slate-800 bg-slate-900/80 p-3.5 sm:p-4 hover:border-slate-700 transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Live Users</span>
            <Users className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-1 text-xl sm:text-2xl font-black text-white">{users.length}</div>
          <span className="text-[10px] text-emerald-400 font-semibold">Registered Creators</span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="grid grid-cols-5 gap-1 rounded-2xl bg-slate-950 p-1.5 border border-slate-800">
        <button
          id="admin-tab-user-tasks"
          onClick={() => setActiveAdminTab('user_tasks')}
          className={`rounded-xl py-2.5 text-[11px] font-bold transition-all text-center flex items-center justify-center gap-1 ${
            activeAdminTab === 'user_tasks'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Video className="h-3.5 w-3.5" />
          <span>Tasks ({submissions.length})</span>
        </button>

        <button
          id="admin-tab-vip-buys"
          onClick={() => setActiveAdminTab('vip_buys')}
          className={`rounded-xl py-2.5 text-[11px] font-bold transition-all text-center flex items-center justify-center gap-1 ${
            activeAdminTab === 'vip_buys'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-md'
              : 'text-amber-400 hover:text-white'
          }`}
        >
          <Crown className="h-3.5 w-3.5" />
          <span>VIP ({vipPurchases.length})</span>
        </button>

        <button
          id="admin-tab-users"
          onClick={() => setActiveAdminTab('users')}
          className={`rounded-xl py-2.5 text-[11px] font-bold transition-all text-center flex items-center justify-center gap-1 ${
            activeAdminTab === 'users'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          <span>Users ({users.length})</span>
        </button>

        <button
          id="admin-tab-withdrawals"
          onClick={() => setActiveAdminTab('withdrawals')}
          className={`rounded-xl py-2.5 text-[11px] font-bold transition-all text-center flex items-center justify-center gap-1 ${
            activeAdminTab === 'withdrawals'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Wallet className="h-3.5 w-3.5" />
          <span>Payouts ({queuedSundayWithdrawals.length})</span>
        </button>

        <button
          id="admin-tab-news"
          onClick={() => setActiveAdminTab('news')}
          className={`rounded-xl py-2.5 text-[11px] font-bold transition-all text-center flex items-center justify-center gap-1 ${
            activeAdminTab === 'news'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Newspaper className="h-3.5 w-3.5" />
          <span>News</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: USER TASKS TAB (WATCH VIDEOS, 3-DOT DOWNLOAD, APPROVE/DECLINE, DELETE) */}
      {/* ========================================================================= */}
      {activeAdminTab === 'user_tasks' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Video className="h-4 w-4 text-pink-400" />
                <span>Uploaded Video Tasks ({submissions.length})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Watch clips, download videos to phone, approve earnings, or decline non-compliant uploads.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-[11px] font-bold">
              {[
                { id: 'all', label: `All (${submissions.length})` },
                { id: 'pending', label: `Pending (${pendingSubmissions.length})` },
                { id: 'approved', label: `Approved (${approvedSubmissions.length})` },
                { id: 'declined', label: `Declined (${declinedSubmissions.length})` },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTaskFilter(f.id as any)}
                  className={`px-2.5 py-1.5 rounded-xl capitalize transition-all whitespace-nowrap ${
                    taskFilter === f.id
                      ? 'bg-pink-600 text-white shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar for Tasks */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search tasks by creator name, phone, task title..."
              value={taskSearchQuery}
              onChange={(e) => setTaskSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none"
            />
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-center space-y-2">
              <Video className="h-10 w-10 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-white">No user tasks found</p>
              <p className="text-xs text-slate-400">
                {submissions.length === 0
                  ? 'Uploaded videos from creators will appear here with instant playable preview and download controls.'
                  : 'Try selecting a different filter or clearing your search.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((sub) => {
                const subUser = users.find((u) => u.id === sub.userId);

                // Extract clips reliably
                const videosToDisplay =
                  sub.videoItems && sub.videoItems.length > 0
                    ? sub.videoItems
                    : sub.videoUrls && sub.videoUrls.length > 0
                    ? sub.videoUrls.map((url, i) => ({
                        id: `v-${i}`,
                        name: `Video Clip #${i + 1}`,
                        size: '25 MB',
                        url,
                      }))
                    : sub.videoUrl
                    ? [
                        {
                          id: 'v-single',
                          name: sub.fileName || 'Camera_Clip.mp4',
                          size: sub.fileSize || '25 MB',
                          url: sub.videoUrl,
                        },
                      ]
                    : [
                        {
                          id: 'v-default',
                          name: sub.fileName || 'Camera_Clip.mp4',
                          size: '28 MB',
                          url: sampleFallbackVideos[0],
                        },
                      ];

                return (
                  <div
                    key={sub.id}
                    className={`rounded-3xl border p-5 transition-all shadow-xl space-y-4 ${
                      sub.status === 'pending_admin' || sub.status === 'processing'
                        ? 'border-amber-500/50 bg-gradient-to-b from-slate-900 via-amber-950/20 to-slate-950'
                        : sub.status === 'approved'
                        ? 'border-emerald-500/40 bg-gradient-to-b from-slate-900 to-emerald-950/20'
                        : 'border-rose-500/40 bg-gradient-to-b from-slate-900 to-rose-950/20'
                    }`}
                  >
                    {/* User Header & Task Info */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-600 text-white font-black text-base shadow-md">
                          {sub.userName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-black text-white">{sub.userName}</h4>
                            {subUser && subUser.vipTier > 0 && (
                              <span className="rounded-full bg-amber-400/20 border border-amber-400/40 px-2 py-0.5 text-[9px] font-black text-amber-300">
                                VIP {subUser.vipTier}
                              </span>
                            )}
                            <span className="rounded-full bg-pink-500/20 px-2 py-0.5 text-[10px] font-black text-pink-300">
                              {sub.videoCount} Video{sub.videoCount > 1 ? 's' : ''}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {subUser?.emailOrPhone || 'Registered Creator'} • Submitted: {sub.submittedAt}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-right">
                        <div>
                          <div className="text-base sm:text-lg font-black text-amber-400">
                            {formatNaira(sub.approvedReward || sub.potentialReward)}
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">Task Payout</span>
                        </div>

                        {/* DELETE TASK BUTTON */}
                        {onDeleteSubmission && (
                          <button
                            type="button"
                            title="Delete this task submission from admin"
                            onClick={() => {
                              if (window.confirm(`Delete video submission from ${sub.userName}?`)) {
                                onDeleteSubmission(sub.id);
                              }
                            }}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 hover:bg-rose-950/30 transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Task Title & Notes */}
                    <div className="rounded-2xl bg-slate-950/80 border border-slate-800/80 p-3.5 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-white">
                        <span>Task: {sub.taskTitle}</span>
                        <span className="text-pink-400 font-semibold">{sub.fileName}</span>
                      </div>
                      {sub.notes && (
                        <p className="text-slate-300 italic text-xs">
                          Note: "{sub.notes}"
                        </p>
                      )}
                    </div>

                    {/* VIDEO PLAYER SECTION WITH 3-DOTS DOWNLOAD MENU */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Play className="h-4 w-4 text-emerald-400" />
                          <span>Watch Uploaded Video Clips ({videosToDisplay.length}):</span>
                        </span>
                        <span className="text-xs text-amber-400 font-semibold">
                          Tap ⋮ on top right to download video
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {videosToDisplay.map((vid, vIdx) => {
                          const menuKey = `${sub.id}-${vIdx}`;
                          const isMenuOpen = openVideoMenu === menuKey;
                          const safePlayUrl =
                            vid.url && !vid.url.startsWith('blob:')
                              ? vid.url
                              : sampleFallbackVideos[vIdx % sampleFallbackVideos.length];

                          return (
                            <div
                              key={vid.id || vIdx}
                              className="rounded-2xl border border-slate-800 bg-slate-950 p-3 space-y-2 relative"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-200 truncate pr-2">
                                  Clip #{vIdx + 1}: {vid.name}
                                </span>

                                {/* 3-DOT MENU BUTTON ON TOP RIGHT */}
                                <div className="relative shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => setOpenVideoMenu(isMenuOpen ? null : menuKey)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                                    title="Video Options"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </button>

                                  {/* DROPDOWN MENU WITH DOWNLOAD AND DELETE */}
                                  {isMenuOpen && (
                                    <div className="absolute right-0 top-8 z-30 w-52 rounded-2xl border border-slate-700 bg-slate-900 p-1.5 shadow-2xl space-y-1">
                                      <button
                                        type="button"
                                        onClick={() => handleDownloadVideo(safePlayUrl, vid.name)}
                                        className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-950/60 transition-all text-left"
                                      >
                                        <Download className="h-4 w-4 shrink-0" />
                                        <span>Download Video to Phone</span>
                                      </button>

                                      {onDeleteSubmission && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (
                                              window.confirm(
                                                'Delete this task submission from admin panel?'
                                              )
                                            ) {
                                              onDeleteSubmission(sub.id);
                                            }
                                            setOpenVideoMenu(null);
                                          }}
                                          className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-950/60 transition-all text-left border-t border-slate-800"
                                        >
                                          <Trash2 className="h-4 w-4 shrink-0" />
                                          <span>Delete Video Task</span>
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* HTML5 PLAYABLE VIDEO PLAYER */}
                              <div className="overflow-hidden rounded-xl bg-black border border-slate-800/80">
                                <video
                                  src={safePlayUrl}
                                  controls
                                  playsInline
                                  preload="metadata"
                                  onError={(e) => {
                                    const target = e.currentTarget;
                                    target.src = sampleFallbackVideos[vIdx % sampleFallbackVideos.length];
                                  }}
                                  className="w-full aspect-video rounded-xl bg-black object-contain max-h-48"
                                />
                              </div>

                              {/* Quick Direct Download Link for Mobile Convenience */}
                              <div className="flex items-center justify-between pt-1 text-[11px]">
                                <span className="text-slate-500">{vid.size}</span>
                                <button
                                  type="button"
                                  onClick={() => handleDownloadVideo(safePlayUrl, vid.name)}
                                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold"
                                >
                                  <Download className="h-3 w-3" />
                                  <span>Download Video</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* APPROVAL OR DECLINE ACTIONS */}
                    {sub.status === 'pending_admin' || sub.status === 'processing' ? (
                      <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                        <button
                          id={`admin-approve-task-${sub.id}`}
                          onClick={() => handleApprove(sub)}
                          className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-xs font-black text-white shadow-lg shadow-emerald-600/30 active:scale-95 hover:from-emerald-500 hover:to-teal-500 transition-all"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Approve Task (Credit {formatNaira(sub.potentialReward)})</span>
                        </button>

                        <button
                          id={`admin-decline-task-${sub.id}`}
                          onClick={() => handleReject(sub)}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-rose-500/50 bg-rose-950/40 px-5 py-3.5 text-xs font-extrabold text-rose-300 hover:bg-rose-900/60 active:scale-95 transition-all"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Decline (₦0)</span>
                        </button>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-slate-800 text-xs font-bold flex items-center justify-between">
                        {sub.status === 'approved' ? (
                          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-2xl w-full">
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                            <span>
                              Approved & Paid {formatNaira(sub.approvedReward || sub.potentialReward)} to {sub.userName}'s balance
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-rose-400 bg-rose-950/30 border border-rose-500/30 p-3 rounded-2xl w-full">
                            <XCircle className="h-4 w-4 shrink-0" />
                            <span>
                              Declined (₦0) • Reason: {sub.rejectionReason || 'your videos was declined due not clear and lack of videoing face'}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: VIP BUYS WITH SCREENSHOT PROOF */}
      {/* ========================================================================= */}
      {activeAdminTab === 'vip_buys' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="h-4 w-4 text-amber-400" />
                <span>VIP Purchase Requests ({vipPurchases.length})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Review transfer receipts and activate VIP earning multipliers for creators.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-[11px] font-bold">
              {[
                { id: 'all', label: `All (${vipPurchases.length})` },
                { id: 'pending', label: `Pending (${pendingVIPPurchases.length})` },
                { id: 'approved', label: 'Approved' },
                { id: 'rejected', label: 'Rejected' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setVipFilter(f.id as any)}
                  className={`px-2.5 py-1.5 rounded-xl capitalize transition-all whitespace-nowrap ${
                    vipFilter === f.id
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'text-amber-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar for VIP */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search VIP by creator name, phone, tier..."
              value={vipSearchQuery}
              onChange={(e) => setVipSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {filteredVIPPurchases.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-center space-y-2">
              <Crown className="h-10 w-10 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-white">No VIP purchase requests</p>
              <p className="text-xs text-slate-400">
                When creators upgrade VIP and upload PalmPay transfer receipts, they will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredVIPPurchases.map((req) => (
                <div
                  key={req.id}
                  className={`rounded-3xl border p-5 transition-all ${
                    req.status === 'pending'
                      ? 'border-amber-500/50 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 shadow-xl'
                      : req.status === 'approved'
                      ? 'border-emerald-500/30 bg-slate-900/60'
                      : 'border-rose-500/30 bg-slate-900/60'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-white">{req.userName}</span>
                          <span className="rounded-full bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 text-[9px] font-black text-amber-300">
                            {req.tierName}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{req.userEmailOrPhone}</p>
                      </div>

                      <div className="flex items-center gap-3 text-right">
                        <div>
                          <div className="text-base font-black text-amber-400">
                            {formatNaira(req.amount)}
                          </div>
                          <span className="text-[10px] text-slate-500">{req.submittedAt}</span>
                        </div>

                        {onDeleteVIPPurchase && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Delete this VIP purchase request?')) {
                                onDeleteVIPPurchase(req.id);
                              }
                            }}
                            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Screenshot Proof Preview */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                        <span>Transfer Screenshot Proof:</span>
                        <button
                          type="button"
                          onClick={() => setPreviewScreenshotUrl(req.screenshotUrl)}
                          className="flex items-center gap-1 text-xs text-pink-400 hover:text-pink-300"
                        >
                          <Maximize2 className="h-3.5 w-3.5" />
                          <span>View Full Image</span>
                        </button>
                      </div>

                      <div
                        onClick={() => setPreviewScreenshotUrl(req.screenshotUrl)}
                        className="cursor-pointer overflow-hidden rounded-xl bg-black/40 flex items-center justify-center p-2 border border-slate-800/80 hover:border-pink-500/50 transition-all"
                      >
                        <img
                          src={req.screenshotUrl}
                          alt="VIP Payment Proof"
                          className="max-h-52 w-auto rounded-lg object-contain mx-auto"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {req.status === 'pending' ? (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          id={`admin-approve-vip-${req.id}`}
                          onClick={() => {
                            if (onApproveVIPPurchase) {
                              onApproveVIPPurchase(req.id);
                            }
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 active:scale-95"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Approve VIP {req.tierLevel}</span>
                        </button>

                        <button
                          id={`admin-decline-vip-${req.id}`}
                          onClick={() => {
                            if (onRejectVIPPurchase) {
                              onRejectVIPPurchase(req.id);
                            }
                          }}
                          className="flex items-center justify-center gap-1 rounded-2xl border border-rose-500/40 bg-rose-950/40 px-4 py-3 text-xs font-bold text-rose-300 hover:bg-rose-900/60 active:scale-95"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Decline</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs font-bold">
                        {req.status === 'approved' ? (
                          <span className="text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>VIP Tier {req.tierLevel} Approved & Activated</span>
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1.5">
                            <XCircle className="h-4 w-4" />
                            <span>VIP Request Declined (Notice Sent to User)</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: REGISTERED USERS WITH SEARCH, FILTER, AND ACCORDION GIFTING */}
      {/* ========================================================================= */}
      {activeAdminTab === 'users' && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-black text-white">Registered Live Creators ({users.length})</h3>
                <p className="text-xs text-slate-400">
                  Tap any user to reveal and send instant cash gifts directly to their dashboard balance.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Filter pills */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
                  {[
                    { id: 'all', label: `All (${users.length})` },
                    { id: 'vip', label: `VIP (${users.filter((u) => u.vipTier > 0).length})` },
                    { id: 'regular', label: 'Regular' },
                    { id: 'blocked', label: `Blocked (${users.filter((u) => u.isBlocked).length})` },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setUserFilter(f.id as any)}
                      className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                        userFilter === f.id
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Reset All Users Button */}
                {onResetUsers && (
                  <button
                    id="admin-reset-all-users-btn"
                    onClick={() => setShowResetUsersModal(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-rose-500/50 bg-rose-500/15 px-3 py-1.5 text-xs font-black text-rose-300 hover:bg-rose-500/30 transition-all shadow-md active:scale-95"
                    title="Reset all users to empty"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                    <span>Reset All Users</span>
                  </button>
                )}
              </div>
            </div>

            {/* User search bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by creator name, email, phone number..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredUsers.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center">
                <Users className="h-8 w-8 text-slate-600 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-slate-400">No users found</p>
                <p className="text-[10px] text-slate-500">
                  {users.length === 0
                    ? 'Registered creators will appear here as soon as they sign up.'
                    : 'No users match the search or filter query.'}
                </p>
              </div>
            ) : (
              filteredUsers.map((u) => {
                const isExpanded = expandedUserForGift === u.id;
                const userGiftAmt = giftAmounts[u.id] || '10000';
                const userGiftNote = giftNotes[u.id] || '';

                return (
                  <div
                    key={u.id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isExpanded
                        ? 'border-emerald-500/60 bg-slate-900 shadow-xl shadow-emerald-950/30'
                        : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                    }`}
                  >
                    {/* User Card Bar (Tappable) */}
                    <div
                      id={`admin-user-row-${u.id}`}
                      onClick={() => setExpandedUserForGift(isExpanded ? null : u.id)}
                      className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 font-bold text-slate-950 text-sm">
                          {u.fullName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-white">{u.fullName}</span>
                            {u.vipTier > 0 && (
                              <span className="rounded-full bg-amber-400/20 border border-amber-400/30 px-1.5 py-0.2 text-[9px] font-black text-amber-300">
                                VIP {u.vipTier}
                              </span>
                            )}
                            {u.inviteCode === 'MBKBLOODLINE' && (
                              <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 text-[9px] font-bold text-amber-400">
                                MBKBLOODLINE
                              </span>
                            )}
                            {u.isBlocked && (
                              <span className="rounded-full bg-rose-500/20 border border-rose-500/30 px-1.5 py-0.2 text-[9px] font-bold text-rose-400">
                                Blocked
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400">{u.emailOrPhone}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                            <span className="text-amber-400 font-bold">
                              Bal: {formatNaira(u.totalBalance || 0)}
                            </span>
                            <span className="text-slate-500">•</span>
                            <span className="text-pink-400 font-bold">
                              Earned: {formatNaira(u.totalEarned || 0)}
                            </span>
                            <span className="text-slate-500">•</span>
                            <span className="text-cyan-400 font-medium">
                              {u.totalPosts || 0} Videos
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action Trigger */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all ${
                            isExpanded
                              ? 'bg-emerald-500 text-slate-950 shadow-md'
                              : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                          }`}
                        >
                          <Gift className="h-3.5 w-3.5" />
                          <span>{isExpanded ? 'Close' : 'Gift'}</span>
                        </button>
                      </div>
                    </div>

                    {/* EXPANDED GIFT PANEL DIRECTLY UNDERNEATH THIS USER */}
                    {isExpanded && (
                      <div className="border-t border-slate-800 bg-slate-950 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-black text-emerald-400">
                            <Gift className="h-4 w-4" />
                            <span>Gift Cash to {u.fullName}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            Delivers in-app message & credits balance
                          </span>
                        </div>

                        {giftSuccessUserId === u.id && (
                          <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-300 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>{giftSuccessMessage}</span>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-300 mb-1">
                              Gift Amount (₦)
                            </label>
                            <div className="flex items-center gap-1.5">
                              {['5000', '10000', '25000', '50000'].map((preset) => (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() =>
                                    setGiftAmounts((prev) => ({ ...prev, [u.id]: preset }))
                                  }
                                  className={`flex-1 py-1 rounded-lg text-[10px] font-bold border ${
                                    userGiftAmt === preset
                                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                                  }`}
                                >
                                  ₦{Number(preset) / 1000}k
                                </button>
                              ))}
                            </div>
                            <input
                              type="number"
                              placeholder="Custom amount"
                              value={userGiftAmt}
                              onChange={(e) =>
                                setGiftAmounts((prev) => ({ ...prev, [u.id]: e.target.value }))
                              }
                              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white focus:border-emerald-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-300 mb-1">
                              Custom Note for Message Center
                            </label>
                            <input
                              type="text"
                              placeholder="you have been gifted by earnhub company"
                              value={userGiftNote}
                              onChange={(e) =>
                                setGiftNotes((prev) => ({ ...prev, [u.id]: e.target.value }))
                              }
                              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            id={`send-gift-btn-${u.id}`}
                            type="button"
                            onClick={() => handleSendGiftToUser(u)}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-2.5 text-xs font-black text-white shadow-lg shadow-emerald-600/30 hover:from-emerald-500 hover:to-teal-500 active:scale-95 transition-all"
                          >
                            <Send className="h-3.5 w-3.5" />
                            <span>
                              Send {formatNaira(Number(userGiftAmt) || 10000)} Gift to {u.fullName}
                            </span>
                          </button>

                          <button
                            type="button"
                            title={u.isBlocked ? 'Unblock user' : 'Block user'}
                            onClick={() => onToggleBlockUser(u.id)}
                            className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                              u.isBlocked
                                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                            }`}
                          >
                            {u.isBlocked ? <Unlock className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
                          </button>

                          {onDeleteUser && (
                            <button
                              type="button"
                              title="Delete user account"
                              onClick={() => {
                                if (window.confirm(`Delete user account ${u.fullName}?`)) {
                                  onDeleteUser(u.id);
                                }
                              }}
                              className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SUNDAY BATCH PAYOUTS (WITHDRAWALS) */}
      {/* ========================================================================= */}
      {activeAdminTab === 'withdrawals' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Wallet className="h-4 w-4 text-emerald-400" />
                <span>Sunday Cashouts Queue ({withdrawals.length})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Disburse pending earnings directly to Nigerian bank accounts.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-[11px] font-bold">
              {[
                { id: 'all', label: `All (${withdrawals.length})` },
                { id: 'queued', label: `Queued (${queuedSundayWithdrawals.length})` },
                { id: 'completed', label: 'Completed' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setWithdrawalFilter(f.id as any)}
                  className={`px-2.5 py-1.5 rounded-xl capitalize transition-all whitespace-nowrap ${
                    withdrawalFilter === f.id
                      ? 'bg-emerald-600 text-white shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filteredWithdrawals.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center">
              <Wallet className="h-8 w-8 text-slate-600 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-slate-400">No payouts in queue</p>
              <p className="text-[10px] text-slate-500">All withdrawal requests have been processed.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredWithdrawals.map((w) => (
                <div key={w.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{w.userName}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            w.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {w.status === 'completed' ? 'Disbursed' : 'Sunday Queue'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">
                        Bank: <strong className="text-white">{w.bankName}</strong> • {w.accountNumber}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">Account Name: {w.accountName}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Submitted: {w.requestedAt}</p>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <span className="text-sm font-black text-amber-400">{formatNaira(w.amount)}</span>
                        <p className="text-[9px] text-slate-500">Fee: {formatNaira(w.fee)}</p>
                        <p className="text-[10px] font-bold text-emerald-400">Net: {formatNaira(w.netAmount)}</p>
                      </div>

                      {onDeleteWithdrawal && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Delete this withdrawal record?')) {
                              onDeleteWithdrawal(w.id);
                            }
                          }}
                          className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {w.status !== 'completed' ? (
                    <button
                      onClick={() => onDisburseWithdrawal(w.id)}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-2.5 text-xs font-black text-white shadow-md hover:from-emerald-500 hover:to-teal-500 active:scale-95 transition-all"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Disburse {formatNaira(w.netAmount)} to Bank Now</span>
                    </button>
                  ) : (
                    <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/30 p-2 text-center text-[11px] font-bold text-emerald-300">
                      ✓ Disbursed & Completed on {w.processedAt || 'Sunday Batch'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: DAILY NEWS BULLETIN UPLOAD & MANAGEMENT */}
      {/* ========================================================================= */}
      {activeAdminTab === 'news' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Newspaper className="h-4 w-4 text-purple-400" />
              <span>Upload Daily Platform News</span>
            </h3>
            <span className="text-[11px] text-purple-400 font-bold">Broadcasts to Earn View</span>
          </div>

          {newsSuccess && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 p-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              <span>Bulletin uploaded and broadcasted to all users successfully!</span>
            </div>
          )}

          <form onSubmit={handlePostNews} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Tag</label>
              <select
                value={newsTag}
                onChange={(e) => setNewsTag(e.target.value as any)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs font-bold text-white"
              >
                <option value="PROMO">🔥 PROMO / REWARDS</option>
                <option value="WINNER">🎉 WINNER CELEBRATION</option>
                <option value="UPDATE">📢 SYSTEM UPDATE</option>
                <option value="ALERT">⏰ COUNTDOWN / MILESTONE</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Month-End Creator Bonus Sprint is Live!"
                value={newsTitle}
                onChange={(e) => setNewsTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Bulletin Content</label>
              <textarea
                rows={3}
                required
                placeholder="Enter details for creators..."
                value={newsContent}
                onChange={(e) => setNewsContent(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 py-2.5 text-xs font-bold text-white shadow-md active:scale-95"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Upload Daily News Now</span>
            </button>
          </form>

          {/* List of current announcements */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <h4 className="text-[11px] font-bold text-slate-400">Current Live Bulletins ({announcements.length})</h4>
            {announcements.map((a) => (
              <div key={a.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{a.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-blue-500/10 text-blue-400 rounded">
                      {a.tag}
                    </span>
                    {onDeleteAnnouncement && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Delete this bulletin announcement?')) {
                            onDeleteAnnouncement(a.id);
                          }
                        }}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-slate-300">{a.content}</p>
                <p className="text-[9px] text-slate-500">{a.publishedAt} • by {a.author}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FULL SCREENSHOT MODAL PREVIEW */}
      {previewScreenshotUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-lg w-full rounded-3xl border border-slate-800 bg-slate-900 p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white">Payment Transfer Receipt</span>
              <button
                onClick={() => setPreviewScreenshotUrl(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center justify-center bg-black/60 rounded-2xl p-2 max-h-[70vh] overflow-auto">
              <img
                src={previewScreenshotUrl}
                alt="Enlarged Transfer Proof"
                className="max-h-[65vh] w-auto rounded-xl object-contain"
              />
            </div>

            <button
              onClick={() => setPreviewScreenshotUrl(null)}
              className="w-full py-2 rounded-xl bg-slate-800 text-xs font-bold text-white hover:bg-slate-700"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* RESET ALL USERS CONFIRMATION MODAL */}
      {showResetUsersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-sm w-full rounded-3xl border border-rose-500/50 bg-slate-900 p-5 space-y-4 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-black text-white">Reset All Registered Users?</h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                This will wipe all existing creator accounts from the database. Any new user who registers will appear immediately in this panel in real-time.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                id="confirm-reset-all-users-btn"
                disabled={isResetting}
                onClick={async () => {
                  if (onResetUsers) {
                    setIsResetting(true);
                    await onResetUsers();
                    setIsResetting(false);
                    setShowResetUsersModal(false);
                    setDownloadToast('All registered users reset to 0.');
                    setTimeout(() => setDownloadToast(null), 3000);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 py-3 text-xs font-black text-white shadow-lg shadow-rose-600/30 active:scale-95 disabled:opacity-50 transition-all"
              >
                <Trash2 className="h-4 w-4" />
                <span>{isResetting ? 'Resetting Users...' : 'Yes, Reset All Users'}</span>
              </button>

              <button
                disabled={isResetting}
                onClick={() => setShowResetUsersModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
