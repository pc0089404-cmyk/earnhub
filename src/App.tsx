import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { NavigationDrawer } from './components/NavigationDrawer';
import { Dashboard } from './components/Dashboard';
import { EarnTasks } from './components/EarnTasks';
import { EarnView } from './components/EarnView';
import { WithdrawPage } from './components/WithdrawPage';
import { Leaderboard } from './components/Leaderboard';
import { NewsAnnouncements } from './components/NewsAnnouncements';
import { VIPUpgrades } from './components/VIPUpgrades';
import { Profile } from './components/Profile';
import { AdminPanel } from './components/AdminPanel';
import { AdminPinModal } from './components/AdminPinModal';
import { AuthModal } from './components/AuthModal';
import { MessagesModal } from './components/MessagesModal';
import { BlockedScreen } from './components/BlockedScreen';
import { MobileBottomNav } from './components/MobileBottomNav';
import {
  User,
  VideoSubmission,
  WithdrawalRequest,
  NewsBulletin,
  UserMessage,
  VIPPurchaseRequest,
} from './types';
import {
  getCurrentUser,
  setCurrentUser,
  getUsers,
  saveUsers,
  getSubmissions,
  saveSubmissions,
  getWithdrawals,
  saveWithdrawals,
  getAnnouncements,
  saveAnnouncements,
  getMessages,
  addMessage,
  markMessagesRead,
  initLocalStorage,
  formatNaira,
  giftUserReward,
  deleteUser,
  getVIPPurchases,
  saveVIPPurchases,
  addVIPPurchase,
  approveVIPPurchase,
  rejectVIPPurchase,
  VIP_TIERS,
  apiFetchServerState,
  apiUpdateUser,
  apiDeleteUser,
  apiToggleBlockUser,
  apiGiftUserReward,
  apiSubmitVideoTask,
  apiReviewVideoTask,
  apiDeleteSubmission,
  apiSubmitWithdrawal,
  apiDisburseWithdrawal,
  apiSubmitVIPPurchase,
  apiReviewVIPPurchase,
  apiAddAnnouncement,
  apiDeleteAnnouncement,
  apiDeleteVIPPurchase,
  apiDeleteWithdrawal,
  apiMarkMessagesRead,
  apiResetAllUsers,
  apiResetAllData,
} from './utils/storage';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState<boolean>(false);
  const [isAdminPinOpen, setIsAdminPinOpen] = useState<boolean>(false);
  
  // Data Lists
  const [usersList, setUsersList] = useState<User[]>([]);
  const [submissionsList, setSubmissionsList] = useState<VideoSubmission[]>([]);
  const [withdrawalsList, setWithdrawalsList] = useState<WithdrawalRequest[]>([]);
  const [announcementsList, setAnnouncementsList] = useState<NewsBulletin[]>([]);
  const [vipPurchasesList, setVIPPurchasesList] = useState<VIPPurchaseRequest[]>([]);
  const [userMessages, setUserMessages] = useState<UserMessage[]>([]);

  const userRef = useRef<User | null>(null);
  userRef.current = user;

  // Function to poll the server for real-time changes across devices
  const syncWithServer = async () => {
    const serverState = await apiFetchServerState();
    if (serverState) {
      setUsersList(serverState.users || []);
      setSubmissionsList(serverState.submissions || []);
      setWithdrawalsList(serverState.withdrawals || []);
      setAnnouncementsList(serverState.announcements || []);
      setVIPPurchasesList(serverState.vipPurchases || []);

      const currentUser = userRef.current;
      if (currentUser) {
        const freshUser = (serverState.users || []).find((u) => u.id === currentUser.id);
        if (freshUser) {
          setUser(freshUser);
          setCurrentUser(freshUser);
        }
        setUserMessages(getMessages(currentUser.id));
      }
    }
  };

  // Initialize and load server state + sync interval
  useEffect(() => {
    initLocalStorage();
    const storedUser = getCurrentUser();
    const storedUsers = getUsers();
    const storedSubs = getSubmissions();
    const storedWd = getWithdrawals();
    const storedAnn = getAnnouncements();
    const storedVip = getVIPPurchases();

    setUsersList(storedUsers);
    setSubmissionsList(storedSubs);
    setWithdrawalsList(storedWd);
    setAnnouncementsList(storedAnn);
    setVIPPurchasesList(storedVip);

    if (storedUser) {
      const fresh = storedUsers.find((u) => u.id === storedUser.id) || storedUser;
      setUser(fresh);
      setUserMessages(getMessages(fresh.id));
    }

    // Immediate initial sync
    syncWithServer();

    // Auto-poll every 1.2 seconds so any newly registered users or uploaded videos show up almost instantly
    const interval = setInterval(syncWithServer, 1200);
    return () => clearInterval(interval);
  }, []);

  // Sync current user state if usersList updates
  useEffect(() => {
    if (user) {
      const fresh = usersList.find((u) => u.id === user.id);
      if (fresh && (fresh.totalBalance !== user.totalBalance || fresh.totalEarned !== user.totalEarned || fresh.vipTier !== user.vipTier || fresh.isBlocked !== user.isBlocked)) {
        setUser(fresh);
        setCurrentUser(fresh);
      }
      setUserMessages(getMessages(user.id));
    }
  }, [usersList]);

  // Handle Login / Sign Up
  const handleAuthSuccess = async (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setCurrentUser(authenticatedUser);
    setUsersList(getUsers());
    setUserMessages(getMessages(authenticatedUser.id));
    setActiveTab('dashboard');
    await syncWithServer();
  };

  // Handle Sign Out
  const handleSignOut = () => {
    setUser(null);
    setCurrentUser(null);
    setActiveTab('dashboard');
    setIsDrawerOpen(false);
  };

  // Handle Profile Update
  const handleUpdateProfile = (updated: User) => {
    setUser(updated);
    setCurrentUser(updated);
    const all = getUsers().map((u) => (u.id === updated.id ? updated : u));
    saveUsers(all);
    setUsersList(all);
    apiUpdateUser(updated);
  };

  // Handle Video Upload Task Submission
  const handleUploadComplete = async (newSub: VideoSubmission) => {
    const updated = [newSub, ...submissionsList];
    setSubmissionsList(updated);
    saveSubmissions(updated);

    // Increment user's total uploaded video count immediately
    if (user) {
      const allUsers = getUsers();
      const uIdx = allUsers.findIndex((u) => u.id === user.id);
      if (uIdx >= 0) {
        allUsers[uIdx].totalPosts = (allUsers[uIdx].totalPosts || 0) + newSub.videoCount;
        saveUsers(allUsers);
        setUsersList(allUsers);
        setUser({ ...allUsers[uIdx] });
        setCurrentUser({ ...allUsers[uIdx] });
      }
    }

    // Add in-app message
    if (user) {
      addMessage({
        id: 'msg-' + Date.now(),
        userId: user.id,
        title: `📤 Upload Queued: ${newSub.videoCount} Video(s)`,
        content: `Your upload for "${newSub.taskTitle}" has been received and queued for compliance validation. Potential reward: ${formatNaira(newSub.potentialReward)}.`,
        date: 'Just now',
        read: false,
        type: 'system',
      });
      setUserMessages(getMessages(user.id));
    }

    // Instantly post to server and sync
    await apiSubmitVideoTask(newSub);
    await syncWithServer();
  };

  // Handle Withdrawal Request Submission
  const handleWithdrawSuccess = (newWd: WithdrawalRequest, updatedBalance: number) => {
    const updatedList = [newWd, ...withdrawalsList];
    setWithdrawalsList(updatedList);
    saveWithdrawals(updatedList);
    apiSubmitWithdrawal(newWd, updatedBalance);

    if (user) {
      const updatedUser = { ...user, totalBalance: updatedBalance };
      setUser(updatedUser);
      setCurrentUser(updatedUser);
      const all = getUsers().map((u) => (u.id === user.id ? updatedUser : u));
      saveUsers(all);
      setUsersList(all);

      addMessage({
        id: 'msg-' + Date.now(),
        userId: user.id,
        title: `⏳ Withdrawal Queued: ${formatNaira(newWd.amount)}`,
        content: `Your Sunday payout request of ${formatNaira(newWd.amount)} to ${newWd.bankName} (${newWd.accountNumber}) is queued for automated weekend disbursal.`,
        date: 'Just now',
        read: false,
        type: 'payout',
      });
      setUserMessages(getMessages(user.id));
    }
  };

  // Handle VIP Upgrade Submission with Screenshot
  const handleSubmitVIPPurchase = (tierLevel: number, amount: number, screenshotUrl: string) => {
    if (!user) return;
    const tier = VIP_TIERS.find((t) => t.level === tierLevel);
    const newReq: VIPPurchaseRequest = {
      id: 'vip-req-' + Date.now(),
      userId: user.id,
      userName: user.fullName,
      userEmailOrPhone: user.emailOrPhone,
      tierLevel,
      tierName: tier?.name || `VIP Tier ${tierLevel}`,
      amount,
      screenshotUrl,
      submittedAt: 'Just now',
      status: 'pending',
    };
    addVIPPurchase(newReq);
    setVIPPurchasesList(getVIPPurchases());
    apiSubmitVIPPurchase(newReq);

    addMessage({
      id: 'msg-vip-sub-' + Date.now(),
      userId: user.id,
      title: `👑 VIP ${tierLevel} Upgrade Submitted`,
      content: `Your payment screenshot for ${tier?.name || `VIP Tier ${tierLevel}`} (${formatNaira(amount)}) has been submitted to Admin.`,
      date: 'Just now',
      read: false,
      type: 'vip',
    });
    setUserMessages(getMessages(user.id));
  };

  // Handle VIP Upgrade Tier (Direct Admin/Instant)
  const handleUpgradeTier = (newTier: number) => {
    if (!user) return;
    const all = getUsers();
    const idx = all.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      all[idx].vipTier = newTier;
      saveUsers(all);
      setUsersList(all);
      setUser({ ...all[idx] });
      setCurrentUser({ ...all[idx] });
      apiUpdateUser(all[idx]);
    }
  };

  // Admin VIP Approval
  const handleApproveVIPPurchase = (purchaseId: string) => {
    const res = approveVIPPurchase(purchaseId);
    if (res.success) {
      setVIPPurchasesList(getVIPPurchases());
      const updatedUsers = getUsers();
      setUsersList(updatedUsers);
      if (user) {
        const fresh = updatedUsers.find((u) => u.id === user.id);
        if (fresh) {
          setUser({ ...fresh });
          setCurrentUser(fresh);
        }
        setUserMessages(getMessages(user.id));
      }
    }
    apiReviewVIPPurchase(purchaseId, 'approved');
  };

  // Admin VIP Rejection
  const handleRejectVIPPurchase = (purchaseId: string) => {
    const res = rejectVIPPurchase(purchaseId);
    if (res.success) {
      setVIPPurchasesList(getVIPPurchases());
      if (user) {
        setUserMessages(getMessages(user.id));
      }
    }
    apiReviewVIPPurchase(purchaseId, 'rejected', 'Payment proof verification failed');
  };

  // Admin Submission Approval
  const handleApproveSubmission = (subId: string, rewardAmount: number) => {
    const subIndex = submissionsList.findIndex((s) => s.id === subId);
    if (subIndex === -1) return;

    const sub = submissionsList[subIndex];
    const updatedSub: VideoSubmission = {
      ...sub,
      status: 'approved',
      approvedReward: rewardAmount,
      reviewedAt: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedSubs = [...submissionsList];
    updatedSubs[subIndex] = updatedSub;
    setSubmissionsList(updatedSubs);
    saveSubmissions(updatedSubs);

    // Credit user's balance and total earned
    const all = getUsers();
    const uIdx = all.findIndex((u) => u.id === sub.userId);
    if (uIdx >= 0) {
      all[uIdx].totalEarned = (all[uIdx].totalEarned || 0) + rewardAmount;
      all[uIdx].totalBalance = (all[uIdx].totalBalance || 0) + rewardAmount;
      saveUsers(all);
      setUsersList([...all]);

      if (user && user.id === sub.userId) {
        setUser({ ...all[uIdx] });
        setCurrentUser({ ...all[uIdx] });
      }
    }

    // Call server API for persistence across devices
    apiReviewVideoTask(subId, 'approved', rewardAmount);

    // Add notification
    addMessage({
      id: 'msg-' + Date.now(),
      userId: sub.userId,
      title: `🎉 Video Task Approved! +${formatNaira(rewardAmount)}`,
      content: `Your upload for "${sub.taskTitle}" (${sub.videoCount} videos) was approved by administrator. You have earned ${formatNaira(rewardAmount)} credited to your balance!`,
      date: 'Just now',
      read: false,
      type: 'approval',
      amount: rewardAmount,
    });

    if (user) {
      setUserMessages(getMessages(user.id));
    }
  };

  const handleRejectSubmission = (subId: string, reason: string) => {
    const subIndex = submissionsList.findIndex((s) => s.id === subId);
    if (subIndex === -1) return;

    const sub = submissionsList[subIndex];
    const declineReason = reason || 'your videos was declined due not clear and lack of videoing face';
    const updatedSub: VideoSubmission = {
      ...sub,
      status: 'rejected',
      rejectionReason: declineReason,
      reviewedAt: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedSubs = [...submissionsList];
    updatedSubs[subIndex] = updatedSub;
    setSubmissionsList(updatedSubs);
    saveSubmissions(updatedSubs);

    // Call server API for persistence across devices
    apiReviewVideoTask(subId, 'rejected', 0, declineReason);

    // Add rejection notification with exact required copy
    addMessage({
      id: 'msg-' + Date.now(),
      userId: sub.userId,
      title: `⚠️ Video Task Declined (₦0 Earned)`,
      content: declineReason,
      date: 'Just now',
      read: false,
      type: 'rejection',
    });

    if (user) {
      setUserMessages(getMessages(user.id));
    }
  };

  const handleDeleteSubmission = (subId: string) => {
    const updatedSubs = submissionsList.filter((s) => s.id !== subId);
    setSubmissionsList(updatedSubs);
    saveSubmissions(updatedSubs);
    apiDeleteSubmission(subId);
  };

  const handleToggleBlockUser = (targetUserId: string) => {
    const all = getUsers();
    const idx = all.findIndex((u) => u.id === targetUserId);
    if (idx >= 0) {
      all[idx].isBlocked = !all[idx].isBlocked;
      saveUsers(all);
      setUsersList([...all]);

      if (user && user.id === targetUserId) {
        setUser({ ...all[idx] });
        setCurrentUser({ ...all[idx] });
      }
      apiToggleBlockUser(targetUserId);
    }
  };

  const handleAddAnnouncement = (news: NewsBulletin) => {
    const updatedAnn = [news, ...announcementsList];
    setAnnouncementsList(updatedAnn);
    saveAnnouncements(updatedAnn);
    apiAddAnnouncement(news);
  };

  const handleDisburseWithdrawal = (wId: string) => {
    const idx = withdrawalsList.findIndex((w) => w.id === wId);
    if (idx === -1) return;

    const updatedWds = [...withdrawalsList];
    updatedWds[idx] = {
      ...updatedWds[idx],
      status: 'completed',
    };
    setWithdrawalsList(updatedWds);
    saveWithdrawals(updatedWds);
    apiDisburseWithdrawal(wId);

    // Send payout confirmation
    addMessage({
      id: 'msg-' + Date.now(),
      userId: updatedWds[idx].userId,
      title: `💸 Payout Sent: ${formatNaira(updatedWds[idx].amount)}`,
      content: `Your withdrawal of ${formatNaira(updatedWds[idx].amount)} has been successfully disbursed to your ${updatedWds[idx].bankName} account (${updatedWds[idx].accountNumber}).`,
      date: 'Just now',
      read: false,
      type: 'payout',
    });

    if (user) {
      setUserMessages(getMessages(user.id));
    }
  };

  // Gift Reward to User Handler
  const handleGiftReward = (userId: string, amount: number, note?: string) => {
    const result = giftUserReward(userId, amount, note);
    if (result.success) {
      const all = getUsers();
      setUsersList(all);
      if (user && user.id === userId && result.user) {
        setUser({ ...result.user });
        setCurrentUser(result.user);
      }
      if (user) {
        setUserMessages(getMessages(user.id));
      }
    }
    apiGiftUserReward(userId, amount, note);
  };

  // Delete User Handler
  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
    setUsersList(getUsers());
    apiDeleteUser(userId);
  };

  // Delete Announcement Handler
  const handleDeleteAnnouncement = (bulletinId: string) => {
    const updated = announcementsList.filter((a) => a.id !== bulletinId);
    setAnnouncementsList(updated);
    saveAnnouncements(updated);
    apiDeleteAnnouncement(bulletinId);
  };

  // Delete VIP Purchase Handler
  const handleDeleteVIPPurchase = (purchaseId: string) => {
    const updated = vipPurchasesList.filter((v) => v.id !== purchaseId);
    setVIPPurchasesList(updated);
    saveVIPPurchases(updated);
    apiDeleteVIPPurchase(purchaseId);
  };

  // Delete Withdrawal Handler
  const handleDeleteWithdrawal = (withdrawalId: string) => {
    const updated = withdrawalsList.filter((w) => w.id !== withdrawalId);
    setWithdrawalsList(updated);
    saveWithdrawals(updated);
    apiDeleteWithdrawal(withdrawalId);
  };

  // Manual Refresh Server State Handler
  const handleRefreshServerState = async () => {
    await syncWithServer();
  };

  // Reset All Users Handler
  const handleResetAllUsers = async () => {
    saveUsers([]);
    setUsersList([]);
    await apiResetAllUsers();
    await syncWithServer();
  };

  // Reset All Data Handler
  const handleResetAllData = async () => {
    saveUsers([]);
    saveSubmissions([]);
    saveWithdrawals([]);
    saveVIPPurchases([]);
    setUsersList([]);
    setSubmissionsList([]);
    setWithdrawalsList([]);
    setVIPPurchasesList([]);
    await apiResetAllData();
    await syncWithServer();
  };

  // Mark all user notifications as read
  const handleMarkAllMessagesRead = () => {
    if (user) {
      markMessagesRead(user.id);
      setUserMessages(getMessages(user.id));
    }
  };

  // Unread messages counter
  const unreadMessagesCount = userMessages.filter((m) => !m.read).length;

  // If user is blocked, display blocked screen
  if (user && user.isBlocked) {
    return <BlockedScreen user={user} onLogout={handleSignOut} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Auth Screen Modal if no active user */}
      {!user && <AuthModal isOpen={!user} onSuccess={handleAuthSuccess} />}

      {/* Main App Container */}
      <div className="flex-1 flex flex-col w-full max-w-lg mx-auto sm:border-x sm:border-slate-800/80 bg-slate-950">
        {/* Navigation Top Header */}
        <Navbar
          user={user}
          onNavigate={(tab) => setActiveTab(tab)}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onOpenMessages={() => setIsMessagesOpen(true)}
          unreadCount={unreadMessagesCount}
        />

        {/* Side Navigation Drawer */}
        <NavigationDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          activeTab={activeTab}
          onNavigate={(tab) => setActiveTab(tab)}
          user={user}
          onLogout={handleSignOut}
          onOpenPinModal={() => {
            setIsDrawerOpen(false);
            setIsAdminPinOpen(true);
          }}
        />

        {/* View Port Router */}
        <main className="flex-1 px-3.5 py-4 pb-28 sm:px-5">
          {user && (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  user={user}
                  onNavigate={(tab) => setActiveTab(tab)}
                  submissions={submissionsList.filter((s) => s.userId === user.id)}
                  announcements={announcementsList}
                />
              )}

              {activeTab === 'earn_view' && (
                <EarnView
                  user={user}
                  announcements={announcementsList}
                  onNavigate={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'earn' && (
                <EarnTasks
                  user={user}
                  submissions={submissionsList}
                  onUploadComplete={handleUploadComplete}
                  onNavigate={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'withdraw' && (
                <WithdrawPage
                  user={user}
                  withdrawals={withdrawalsList}
                  onWithdrawSuccess={handleWithdrawSuccess}
                  onNavigate={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'leaderboard' && <Leaderboard />}

              {activeTab === 'news' && (
                <NewsAnnouncements
                  announcements={announcementsList}
                  onNavigate={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'vip' && (
                <VIPUpgrades
                  user={user}
                  onUpgradeTier={handleUpgradeTier}
                  onSubmitVIPPurchase={handleSubmitVIPPurchase}
                  onNavigate={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'profile' && (
                <Profile
                  user={user}
                  onUpdateUser={handleUpdateProfile}
                  onOpenPinModal={() => setIsAdminPinOpen(true)}
                  onNavigate={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'admin' && (
                (user.inviteCode === 'MBKBLOODLINE' || user.isAdminEligible) ? (
                  <AdminPanel
                    users={usersList}
                    submissions={submissionsList}
                    announcements={announcementsList}
                    withdrawals={withdrawalsList}
                    vipPurchases={vipPurchasesList}
                    onApproveSubmission={handleApproveSubmission}
                    onRejectSubmission={handleRejectSubmission}
                    onApproveVIPPurchase={handleApproveVIPPurchase}
                    onRejectVIPPurchase={handleRejectVIPPurchase}
                    onToggleBlockUser={handleToggleBlockUser}
                    onAddAnnouncement={handleAddAnnouncement}
                    onDisburseWithdrawal={handleDisburseWithdrawal}
                    onGiftReward={handleGiftReward}
                    onDeleteUser={handleDeleteUser}
                    onDeleteSubmission={handleDeleteSubmission}
                    onDeleteAnnouncement={handleDeleteAnnouncement}
                    onDeleteVIPPurchase={handleDeleteVIPPurchase}
                    onDeleteWithdrawal={handleDeleteWithdrawal}
                    onResetUsers={handleResetAllUsers}
                    onResetAllData={handleResetAllData}
                    onRefreshState={handleRefreshServerState}
                    onNavigate={(tab) => setActiveTab(tab)}
                  />
                ) : (
                  <div className="rounded-3xl border border-amber-500/40 bg-slate-900/90 p-6 text-center space-y-4 max-w-sm mx-auto my-8 shadow-2xl">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 mx-auto">
                      <span className="text-2xl">🔐</span>
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">Administrator Access Required</h3>
                      <p className="text-xs text-slate-300 mt-1">
                        Please enter the administrator master security PIN (0913) to unlock the Admin Management Panel.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setIsAdminPinOpen(true)}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 py-3 text-xs font-black text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                      >
                        <span>Enter Security PIN (0913)</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('dashboard')}
                        className="rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700"
                      >
                        Return to Home
                      </button>
                    </div>
                  </div>
                )
              )}
            </>
          )}
        </main>

        {/* Dedicated Phone Bottom Navigation Bar */}
        {user && (
          <MobileBottomNav
            activeTab={activeTab}
            onNavigate={(tab) => setActiveTab(tab)}
            user={user}
            unreadCount={unreadMessagesCount}
          />
        )}

        {/* Admin PIN Security Dialog */}
        <AdminPinModal
          isOpen={isAdminPinOpen}
          onClose={() => setIsAdminPinOpen(false)}
          onSuccess={() => {
            setIsAdminPinOpen(false);
            setActiveTab('admin');
          }}
        />

        {/* Notifications / Messages Center Modal */}
        <MessagesModal
          isOpen={isMessagesOpen}
          onClose={() => setIsMessagesOpen(false)}
          messages={userMessages}
          onMarkAllRead={handleMarkAllMessagesRead}
        />
      </div>
    </div>
  );
}
