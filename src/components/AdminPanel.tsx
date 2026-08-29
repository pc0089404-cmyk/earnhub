import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Video,
  CheckCircle2,
  XCircle,
  Gift,
  Send,
  Ban,
  Unlock,
  Trash2,
  Sparkles,
  Crown,
  X,
  FileVideo,
  MoreVertical,
  Download,
  Search,
  RefreshCw,
  Eye,
  Lock,
  UserCheck,
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
  onAddAnnouncement?: (news: NewsBulletin) => void;
  onDisburseWithdrawal?: (wId: string) => void;
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
  vipPurchases = [],
  onApproveSubmission,
  onRejectSubmission,
  onApproveVIPPurchase,
  onRejectVIPPurchase,
  onToggleBlockUser,
  onGiftReward,
  onDeleteUser,
  onDeleteSubmission,
  onRefreshState,
}) => {
  // Navigation Tabs: 'users' | 'tasks' | 'vip' | 'blocked'
  const [activeTab, setActiveTab] = useState<'users' | 'tasks' | 'vip' | 'blocked'>('users');

  // Search & Filtering
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [taskSearchQuery, setTaskSearchQuery] = useState('');
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [vipFilter, setVipFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Interactive Menus & Alerts
  const [openVideoMenu, setOpenVideoMenu] = useState<string | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Gifting Modal State
  const [giftTargetUser, setGiftTargetUser] = useState<User | null>(null);
  const [giftAmount, setGiftAmount] = useState<string>('5000');
  const [giftNote, setGiftNote] = useState<string>('Creator Performance Award');
  const [giftSuccessToast, setGiftSuccessToast] = useState<string | null>(null);

  // Block User Confirmation with PIN 0913
  const [blockTargetUser, setBlockTargetUser] = useState<User | null>(null);
  const [blockPinInput, setBlockPinInput] = useState('');
  const [blockPinError, setBlockPinError] = useState('');

  // Decline Task Modal
  const [rejectSubId, setRejectSubId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('your videos was declined due not clear and lack of videoing face');

  // Zoom Payment Screenshot Modal
  const [zoomProofUrl, setZoomProofUrl] = useState<string | null>(null);

  // Manual Server Sync Handler
  const handleManualRefresh = async () => {
    if (onRefreshState) {
      setIsRefreshing(true);
      await onRefreshState();
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  // Video Download Handler (saves directly to phone / device storage)
  const handleDownloadVideo = async (videoUrl: string, fileName?: string) => {
    const targetName = fileName || `creator-task-${Date.now()}.mp4`;
    setDownloadToast(`Preparing download: ${targetName}...`);
    try {
      if (videoUrl.startsWith('data:') || videoUrl.startsWith('blob:')) {
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = targetName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const response = await fetch(videoUrl);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = targetName;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(link);
      }
      setDownloadToast(`✓ Video saved to device successfully!`);
      setTimeout(() => setDownloadToast(null), 3500);
    } catch {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = targetName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadToast(`✓ Video download started!`);
      setTimeout(() => setDownloadToast(null), 3500);
    }
  };

  // Execute Gift Cash
  const handleConfirmGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftTargetUser) return;
    const num = parseFloat(giftAmount);
    if (isNaN(num) || num <= 0) return;

    onGiftReward(giftTargetUser.id, num, giftNote.trim() || 'Admin Creator Reward');
    setGiftSuccessToast(`Successfully gifted ${formatNaira(num)} to ${giftTargetUser.fullName}!`);
    setGiftTargetUser(null);
    setGiftAmount('5000');
    setGiftNote('Creator Performance Award');
    setTimeout(() => setGiftSuccessToast(null), 4000);
  };

  // Execute Block with Security PIN 0913
  const handleConfirmBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockTargetUser) return;

    if (blockPinInput.trim() !== '0913') {
      setBlockPinError('Incorrect PIN! Enter master PIN (0913) to block user.');
      return;
    }

    onToggleBlockUser(blockTargetUser.id);
    setDownloadToast(`User ${blockTargetUser.fullName} has been blocked and revoked from website access.`);
    setTimeout(() => setDownloadToast(null), 4000);
    setBlockTargetUser(null);
    setBlockPinInput('');
    setBlockPinError('');
  };

  // Stats Calculations
  const liveUsers = users.filter((u) => !u.isBlocked);
  const blockedUsers = users.filter((u) => u.isBlocked);
  const pendingTasksCount = submissions.filter(
    (s) => s.status === 'pending_admin' || s.status === 'processing'
  ).length;
  const vipUsersCount =
    users.filter((u) => u.vipTier > 0).length +
    vipPurchases.filter((v) => v.status === 'approved').length;

  // Filtered Users
  const filteredUsers = liveUsers.filter((u) => {
    const q = userSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (u.fullName && u.fullName.toLowerCase().includes(q)) ||
      (u.emailOrPhone && u.emailOrPhone.toLowerCase().includes(q)) ||
      (u.id && u.id.toLowerCase().includes(q))
    );
  });

  // Filtered Tasks
  const filteredTasks = submissions.filter((s) => {
    const isPending = s.status === 'pending_admin' || s.status === 'processing';
    if (taskFilter === 'pending' && !isPending) return false;
    if (taskFilter === 'approved' && s.status !== 'approved') return false;
    if (taskFilter === 'rejected' && s.status !== 'rejected') return false;

    const q = taskSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (s.userName && s.userName.toLowerCase().includes(q)) ||
      (s.taskTitle && s.taskTitle.toLowerCase().includes(q))
    );
  });

  // Filtered VIPs
  const filteredVIPs = vipPurchases.filter((v) => {
    if (vipFilter === 'pending' && v.status !== 'pending') return false;
    if (vipFilter === 'approved' && v.status !== 'approved') return false;
    if (vipFilter === 'rejected' && v.status !== 'rejected') return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-20 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notifications */}
      {downloadToast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-2xl border border-emerald-500/50 bg-slate-900/95 px-4 py-3 text-xs font-bold text-emerald-300 shadow-2xl backdrop-blur-md animate-slide-down">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{downloadToast}</span>
        </div>
      )}

      {giftSuccessToast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-2xl border border-amber-500/50 bg-slate-900/95 px-4 py-3 text-xs font-bold text-amber-300 shadow-2xl backdrop-blur-md animate-slide-down">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>{giftSuccessToast}</span>
        </div>
      )}

      {/* TOP HEADER: EXECUTIVE ADMIN CENTER */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/30 p-5 sm:p-7 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/20 font-black">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-['Outfit',sans-serif] text-2xl font-black text-white tracking-tight">
                  Admin Command Panel
                </h1>
                <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-black text-amber-300 border border-amber-500/30">
                  EXECUTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-Time Creator Management, Live Submissions & Financial Controls
              </p>
            </div>
          </div>

          {/* Realtime Live Sync Status */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-bold text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live Synced</span>
            </div>

            <button
              id="admin-refresh-sync-btn"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        </div>

        {/* OVERVIEW STATS BOXES */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          {/* Box 1: Total Users */}
          <div
            onClick={() => setActiveTab('users')}
            className={`cursor-pointer rounded-2xl p-4 border transition-all ${
              activeTab === 'users'
                ? 'border-emerald-500/60 bg-emerald-950/30 shadow-lg shadow-emerald-500/10'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{users.length}</span>
              <span className="text-[10px] font-bold text-emerald-400">Live Creators</span>
            </div>
          </div>

          {/* Box 2: Task Uploads */}
          <div
            onClick={() => setActiveTab('tasks')}
            className={`cursor-pointer rounded-2xl p-4 border transition-all ${
              activeTab === 'tasks'
                ? 'border-cyan-500/60 bg-cyan-950/30 shadow-lg shadow-cyan-500/10'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Task Uploads</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                <Video className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{submissions.length}</span>
              {pendingTasksCount > 0 && (
                <span className="text-[10px] font-black text-amber-400 animate-pulse">
                  ({pendingTasksCount} Pending)
                </span>
              )}
            </div>
          </div>

          {/* Box 3: VIP Upgrades */}
          <div
            onClick={() => setActiveTab('vip')}
            className={`cursor-pointer rounded-2xl p-4 border transition-all ${
              activeTab === 'vip'
                ? 'border-amber-500/60 bg-amber-950/30 shadow-lg shadow-amber-500/10'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">VIP Upgrades</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                <Crown className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-300">{vipUsersCount}</span>
              <span className="text-[10px] font-bold text-amber-400/80">Tier Upgrades</span>
            </div>
          </div>

          {/* Box 4: Blocked Users */}
          <div
            onClick={() => setActiveTab('blocked')}
            className={`cursor-pointer rounded-2xl p-4 border transition-all ${
              activeTab === 'blocked'
                ? 'border-rose-500/60 bg-rose-950/30 shadow-lg shadow-rose-500/10'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Blocked</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
                <Ban className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-rose-300">{blockedUsers.length}</span>
              <span className="text-[10px] font-bold text-rose-400/80">Suspended</span>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS BAR */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'users', label: 'Live Users', icon: Users, count: liveUsers.length },
          { id: 'tasks', label: 'Tasks Upload', icon: Video, count: submissions.length, badge: pendingTasksCount },
          { id: 'vip', label: 'VIP Users', icon: Crown, count: vipPurchases.length },
          { id: 'blocked', label: 'Blocked Users', icon: Ban, count: blockedUsers.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`admin-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 ? (
                <span className="rounded-full bg-rose-600 px-1.5 py-0.2 text-[10px] font-black text-white animate-pulse">
                  {tab.badge}
                </span>
              ) : (
                <span className={`rounded-full px-2 py-0.5 text-[10px] ${isActive ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: LIVE USERS */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-400" />
                <span>Live Registered Users</span>
              </h2>
              <p className="text-xs text-slate-400">
                All real creators registered on the platform. Gift money or block violating accounts.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search user by name / phone..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-12 text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-500 mx-auto">
                <Users className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-slate-300">No registered users found</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Any creator who signs up from the website will appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={u.fullName}
                          className="h-12 w-12 rounded-2xl object-cover ring-1 ring-slate-700 shadow-md"
                        />
                        {u.vipTier > 0 && (
                          <div className="absolute -top-1.5 -right-1.5 rounded-full bg-amber-400 p-0.5 text-slate-950 shadow-md">
                            <Crown className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-black text-white">{u.fullName}</h3>
                          {u.vipTier > 0 ? (
                            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-black text-amber-300 border border-amber-500/30">
                              VIP {u.vipTier}
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-400">
                              Regular
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{u.emailOrPhone}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Joined: {u.joinedDate || 'Recent'}</p>
                      </div>
                    </div>

                    {onDeleteUser && (
                      <button
                        onClick={() => onDeleteUser(u.id)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-950 p-2.5 border border-slate-800/80 text-center">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-semibold">Balance</span>
                      <span className="text-xs font-black text-emerald-400">{formatNaira(u.totalBalance || 0)}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-semibold">Total Earned</span>
                      <span className="text-xs font-black text-white">{formatNaira(u.totalEarned || 0)}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-semibold">Tasks Done</span>
                      <span className="text-xs font-black text-cyan-400">{u.totalPosts || 0}</span>
                    </div>
                  </div>

                  {/* Action Buttons: Gift & Block */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                    <button
                      id={`user-gift-btn-${u.id}`}
                      onClick={() => setGiftTargetUser(u)}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-500 transition-all active:scale-95"
                    >
                      <Gift className="h-3.5 w-3.5" />
                      <span>Gift Money</span>
                    </button>

                    <button
                      id={`user-block-btn-${u.id}`}
                      onClick={() => {
                        setBlockTargetUser(u);
                        setBlockPinInput('');
                        setBlockPinError('');
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 py-2.5 text-xs font-black text-rose-400 hover:bg-rose-500/20 transition-all active:scale-95"
                    >
                      <Ban className="h-3.5 w-3.5 text-rose-400" />
                      <span>Block User</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TASKS UPLOAD */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <Video className="h-4 w-4 text-cyan-400" />
                <span>Uploaded Tasks Video Submissions</span>
              </h2>
              <p className="text-xs text-slate-400">
                Review submitted video clips. Approve to credit creator earnings or decline with custom notices.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setTaskFilter(f)}
                    className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                      taskFilter === f
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search task..."
                  value={taskSearchQuery}
                  onChange={(e) => setTaskSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-12 text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-500 mx-auto">
                <Video className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-slate-300">No uploaded tasks in this filter</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When creators record and submit task clips on the Earn page, they will show here immediately.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTasks.map((sub) => {
                const isPending = sub.status === 'pending_admin' || sub.status === 'processing';
                const isApproved = sub.status === 'approved';
                const isRejected = sub.status === 'rejected';

                const primaryVideoUrl =
                  sub.videoUrl ||
                  (sub.videoUrls && sub.videoUrls[0]) ||
                  'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-video-call-with-phone-42880-large.mp4';

                const targetReward = sub.potentialReward || sub.approvedReward || 2000;

                return (
                  <div
                    key={sub.id}
                    className="relative rounded-3xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between gap-4"
                  >
                    {/* Card Top Details + 3-Dots Menu */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 font-bold">
                          <FileVideo className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-white">{sub.userName || 'Creator'}</h3>
                          <p className="text-xs text-slate-400">{sub.taskTitle}</p>
                          <p className="text-[10px] text-slate-500">{sub.submittedAt || 'Just now'}</p>
                        </div>
                      </div>

                      {/* 3-DOTS (⋮) MENU */}
                      <div className="relative">
                        <button
                          id={`task-menu-btn-${sub.id}`}
                          onClick={() => setOpenVideoMenu(openVideoMenu === sub.id ? null : sub.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {openVideoMenu === sub.id && (
                          <div className="absolute right-0 top-9 z-30 w-44 rounded-2xl border border-slate-700 bg-slate-950 p-1.5 shadow-2xl animate-fade-in space-y-1">
                            <button
                              id={`download-video-btn-${sub.id}`}
                              onClick={() => {
                                setOpenVideoMenu(null);
                                handleDownloadVideo(primaryVideoUrl, `${sub.userName || 'task'}-${sub.id}.mp4`);
                              }}
                              className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all text-left"
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span>Download Video</span>
                            </button>

                            {onDeleteSubmission && (
                              <button
                                id={`delete-video-btn-${sub.id}`}
                                onClick={() => {
                                  setOpenVideoMenu(null);
                                  onDeleteSubmission(sub.id);
                                }}
                                className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-all text-left"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Delete Video</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* VIDEO CONTAINER */}
                    <div className="relative overflow-hidden rounded-2xl bg-black border border-slate-800">
                      <video
                        src={primaryVideoUrl}
                        controls
                        playsInline
                        preload="metadata"
                        className="w-full h-44 sm:h-52 object-cover bg-black"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white border border-white/10">
                        <Video className="h-3 w-3 text-cyan-400" />
                        <span>{sub.videoCount || 1} Clips Submitted</span>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-2 right-2">
                        {isApproved && (
                          <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-black text-slate-950 shadow-md">
                            ✓ Approved ({formatNaira(sub.approvedReward || targetReward)})
                          </span>
                        )}
                        {isRejected && (
                          <span className="rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-black text-white shadow-md">
                            ✕ Declined (₦0)
                          </span>
                        )}
                        {isPending && (
                          <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-black text-slate-950 shadow-md animate-pulse">
                            Pending Review
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Reward details */}
                    <div className="flex items-center justify-between text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <div>
                        <span className="text-slate-400">Reward: </span>
                        <span className="font-black text-emerald-400">{formatNaira(targetReward)}</span>
                      </div>
                      {sub.rejectionReason && (
                        <span className="text-[10px] text-rose-400 italic max-w-[180px] truncate">
                          Reason: {sub.rejectionReason}
                        </span>
                      )}
                    </div>

                    {/* APPROVE & DECLINE BUTTONS */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                      <button
                        id={`approve-task-btn-${sub.id}`}
                        onClick={() => onApproveSubmission(sub.id, targetReward)}
                        className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-black transition-all active:scale-95 shadow-md ${
                          isApproved
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/20'
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{isApproved ? 'Approved ✓' : 'Approve Task'}</span>
                      </button>

                      <button
                        id={`decline-task-btn-${sub.id}`}
                        onClick={() => {
                          setRejectSubId(sub.id);
                          setRejectReason('your videos was declined due not clear and lack of videoing face');
                        }}
                        className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-black transition-all active:scale-95 border ${
                          isRejected
                            ? 'border-rose-500/40 bg-rose-500/20 text-rose-300 cursor-default'
                            : 'border-rose-500/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                        }`}
                      >
                        <XCircle className="h-4 w-4" />
                        <span>{isRejected ? 'Declined ✕' : 'Decline'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: VIP USERS */}
      {activeTab === 'vip' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-400" />
                <span>VIP Upgrades & PalmPay Proof Verification</span>
              </h2>
              <p className="text-xs text-slate-400">
                Verify PalmPay payment receipts and approve creator VIP multipliers.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setVipFilter(f)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                    vipFilter === f
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filteredVIPs.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-12 text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-500 mx-auto">
                <Crown className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-slate-300">No VIP upgrade requests in this view</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When users upgrade on the VIP Upgrades screen, their payment screenshots will appear here for verification.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredVIPs.map((req) => (
                <div
                  key={req.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 font-black border border-amber-500/30">
                        <Crown className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-black text-white">{req.userName}</h3>
                          <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[9px] font-black text-amber-300 border border-amber-400/30">
                            VIP TIER {req.tierLevel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{req.userEmailOrPhone}</p>
                        <p className="text-[10px] text-slate-500">Submitted: {req.submittedAt || 'Recent'}</p>
                      </div>
                    </div>

                    <span className="text-sm font-black text-emerald-400">{formatNaira(req.amount)}</span>
                  </div>

                  {req.screenshotUrl && (
                    <div
                      onClick={() => setZoomProofUrl(req.screenshotUrl || null)}
                      className="cursor-pointer relative overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 group h-36 flex items-center justify-center"
                    >
                      <img
                        src={req.screenshotUrl}
                        alt="Payment Receipt"
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold">
                        <Eye className="h-4 w-4" />
                        <span>Tap to Zoom Receipt</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                    <button
                      id={`approve-vip-btn-${req.id}`}
                      onClick={() => onApproveVIPPurchase && onApproveVIPPurchase(req.id)}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 py-2.5 text-xs font-black text-slate-950 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Approve VIP</span>
                    </button>

                    <button
                      id={`decline-vip-btn-${req.id}`}
                      onClick={() => onRejectVIPPurchase && onRejectVIPPurchase(req.id)}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 py-2.5 text-xs font-black text-rose-400 hover:bg-rose-500/20 active:scale-95 transition-all"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: BLOCKED USERS */}
      {activeTab === 'blocked' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <Ban className="h-4 w-4 text-rose-400" />
                <span>Blocked Creators</span>
              </h2>
              <p className="text-xs text-slate-400">
                These users are completely locked out of the website. Tap Unblock to restore access.
              </p>
            </div>
          </div>

          {blockedUsers.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-12 text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-500 mx-auto">
                <UserCheck className="h-6 w-6 text-emerald-400" />
              </div>
              <p className="text-sm font-bold text-slate-300">No Blocked Users</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                All registered users currently have full active access to the website.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {blockedUsers.map((u) => (
                <div
                  key={u.id}
                  className="rounded-3xl border border-rose-500/40 bg-slate-900/90 p-4 sm:p-5 shadow-xl flex flex-col justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={u.fullName}
                      className="h-12 w-12 rounded-2xl object-cover ring-2 ring-rose-500/50 opacity-75"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-white">{u.fullName}</h3>
                        <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[9px] font-black text-rose-400 border border-rose-500/30">
                          BLOCKED
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{u.emailOrPhone}</p>
                      <p className="text-[10px] text-rose-400/80 mt-0.5">Access Prohibited</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-semibold">Balance</span>
                      <span className="text-xs font-bold text-slate-300">{formatNaira(u.totalBalance || 0)}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-semibold">Tasks Completed</span>
                      <span className="text-xs font-bold text-slate-300">{u.totalPosts || 0}</span>
                    </div>
                  </div>

                  {/* UNBLOCK BUTTON */}
                  <button
                    id={`unblock-user-btn-${u.id}`}
                    onClick={() => onToggleBlockUser(u.id)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-xs font-black text-white shadow-lg shadow-emerald-600/20 active:scale-95 hover:from-emerald-500 hover:to-teal-500 transition-all"
                  >
                    <Unlock className="h-4 w-4" />
                    <span>Unblock User & Restore Access</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* GIFT MONEY MODAL */}
      {giftTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-sm w-full rounded-3xl border border-emerald-500/50 bg-slate-900 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                <Gift className="h-4 w-4" />
                <span>Gift Cash Reward</span>
              </div>
              <button
                onClick={() => setGiftTargetUser(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="text-center">
              <h3 className="text-base font-black text-white">{giftTargetUser.fullName}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{giftTargetUser.emailOrPhone}</p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1.5">Preset Amounts</label>
              <div className="grid grid-cols-3 gap-1.5">
                {['5000', '10000', '25000', '50000', '100000', '200000'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setGiftAmount(amt)}
                    className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                      giftAmount === amt
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                        : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    ₦{parseInt(amt).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleConfirmGift} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Custom Naira Amount (₦)
                </label>
                <input
                  type="number"
                  required
                  min="100"
                  step="100"
                  value={giftAmount}
                  onChange={(e) => setGiftAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 px-3 text-sm font-black text-emerald-400 focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. 15000"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Message Note (shows on creator's phone)
                </label>
                <input
                  type="text"
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. Creator Performance Award"
                />
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  id="confirm-send-gift-btn"
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-xs font-black text-white shadow-lg shadow-emerald-600/30 active:scale-95 hover:from-emerald-500 hover:to-teal-500 transition-all"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Gift Cash (Instant Credit)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGiftTargetUser(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BLOCK USER CONFIRMATION MODAL WITH PIN 0913 */}
      {blockTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-sm w-full rounded-3xl border border-rose-500/50 bg-slate-900 p-5 space-y-4 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 mx-auto">
              <Lock className="h-6 w-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-black text-white">Security Check: Block Creator</h3>
              <p className="text-xs text-slate-300 mt-1">
                You are blocking <strong className="text-white">{blockTargetUser.fullName}</strong>. They will be completely restricted and unable to use the website.
              </p>
            </div>

            <form onSubmit={handleConfirmBlock} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 text-center">
                  Enter Security PIN to Confirm
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  autoFocus
                  value={blockPinInput}
                  onChange={(e) => {
                    setBlockPinInput(e.target.value);
                    setBlockPinError('');
                  }}
                  className="w-full rounded-xl border border-rose-500/50 bg-slate-950 py-3 text-center text-lg font-mono tracking-widest text-rose-400 focus:border-rose-400 focus:outline-none"
                  placeholder="••••"
                />
                {blockPinError && (
                  <p className="text-[11px] font-bold text-rose-400 text-center mt-1.5">
                    {blockPinError}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  id="confirm-block-user-btn"
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 py-3 text-xs font-black text-white shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
                >
                  <Ban className="h-4 w-4" />
                  <span>Confirm & Block Access</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBlockTargetUser(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DECLINE REASON MODAL */}
      {rejectSubId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-sm w-full rounded-3xl border border-rose-500/50 bg-slate-900 p-5 space-y-4 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 mx-auto">
              <XCircle className="h-6 w-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-black text-white">Decline Task Submission</h3>
              <p className="text-xs text-slate-300 mt-1">
                The creator will receive ₦0 and this explanation note on their phone.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Reason for Decline
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <button
                  id="confirm-decline-task-btn"
                  onClick={() => {
                    onRejectSubmission(rejectSubId, rejectReason);
                    setRejectSubId(null);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-3 text-xs font-black text-white shadow-lg shadow-rose-600/30 active:scale-95 hover:bg-rose-500 transition-all"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Confirm Decline (₦0 Earned)</span>
                </button>

                <button
                  onClick={() => setRejectSubId(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ZOOM PAYMENT SCREENSHOT MODAL */}
      {zoomProofUrl && (
        <div
          onClick={() => setZoomProofUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-fade-in"
        >
          <div className="relative max-w-lg w-full rounded-3xl overflow-hidden border border-slate-700 bg-black p-2 shadow-2xl">
            <button
              onClick={() => setZoomProofUrl(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-slate-900/80 p-2 text-white hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
            <img src={zoomProofUrl} alt="Receipt Proof" className="w-full max-h-[80vh] object-contain rounded-2xl" />
          </div>
        </div>
      )}
    </div>
  );
};
