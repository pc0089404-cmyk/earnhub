import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Enable JSON body parsing & CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Database persistence file setup
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'earnhub_db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface ServerDB {
  users: any[];
  submissions: any[];
  withdrawals: any[];
  announcements: any[];
  messages: any[];
  vipPurchases: any[];
}

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 'news-1',
    title: '⚡ Weekend Creator Payout Batch is Live!',
    content:
      'All pending submissions and withdrawals are being processed by automated compliance. Sunday payments are scheduled for prompt disbursal to all Nigerian banks.',
    author: 'Admin Desk',
    publishedAt: 'Today at 09:30 AM',
    isPinned: true,
    tag: 'PROMO',
  },
  {
    id: 'news-2',
    title: '🎉 Creator Milestone: Precious Joy Wins ₦150,000 Cash!',
    content:
      'Precious Joy just reached her 30th verified creator video milestone! She just won a ₦150,000 cash bonus sent directly to her registered bank account. Big congratulations!',
    author: 'Official Bulletin',
    publishedAt: 'Yesterday at 04:15 PM',
    isPinned: true,
    tag: 'WINNER',
  },
  {
    id: 'news-3',
    title: '⏰ Race to Month-End Prize Pool!',
    content:
      'You have from now until month end to win grand bonus rewards. Do more verified tasks to boost your position on the leaderboards and claim instant payouts!',
    author: 'Rewards Desk',
    publishedAt: '2 days ago',
    isPinned: false,
    tag: 'ALERT',
  },
];

function loadDatabase(): ServerDB {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      return {
        users: Array.isArray(parsed.users) ? parsed.users : [],
        submissions: Array.isArray(parsed.submissions) ? parsed.submissions : [],
        withdrawals: Array.isArray(parsed.withdrawals) ? parsed.withdrawals : [],
        announcements: Array.isArray(parsed.announcements) && parsed.announcements.length > 0 ? parsed.announcements : DEFAULT_ANNOUNCEMENTS,
        messages: Array.isArray(parsed.messages) ? parsed.messages : [],
        vipPurchases: Array.isArray(parsed.vipPurchases) ? parsed.vipPurchases : [],
      };
    }
  } catch (err) {
    console.error('Error loading database file:', err);
  }

  const initialDB: ServerDB = {
    users: [],
    submissions: [],
    withdrawals: [],
    announcements: DEFAULT_ANNOUNCEMENTS,
    messages: [],
    vipPurchases: [],
  };

  saveDatabase(initialDB);
  return initialDB;
}

let db: ServerDB = loadDatabase();

function saveDatabase(dataToSave: ServerDB) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), totalUsers: db.users.length });
});

// 2. Complete State Sync (used by all connected phones/browsers)
app.get('/api/state', (req, res) => {
  res.json({
    success: true,
    users: db.users,
    submissions: db.submissions,
    withdrawals: db.withdrawals,
    announcements: db.announcements,
    messages: db.messages,
    vipPurchases: db.vipPurchases,
  });
});

// 3. User Registration (Cross-device persistence)
app.post('/api/users/register', (req, res) => {
  try {
    const { fullName, emailOrPhone, password, inviteCode } = req.body;

    if (!emailOrPhone || !fullName) {
      return res.status(400).json({ success: false, error: 'Full name and email/phone are required.' });
    }

    const normalizedInput = emailOrPhone.trim().toLowerCase();
    const existing = db.users.find(
      (u) => u.emailOrPhone && u.emailOrPhone.toLowerCase() === normalizedInput
    );

    if (existing) {
      return res.status(400).json({ success: false, error: 'An account with this email/phone already exists. Please log in.' });
    }

    const cleanInvite = (inviteCode || '').trim().toUpperCase();
    const isAdminEligible = cleanInvite === 'MBKBLOODLINE';

    const newUser = {
      id: 'user-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      fullName: fullName.trim(),
      emailOrPhone: emailOrPhone.trim(),
      password: password || '',
      inviteCode: cleanInvite || undefined,
      isAdminEligible: isAdminEligible,
      isBlocked: false,
      totalEarned: 0,
      totalBalance: 0,
      totalPosts: 0,
      vipTier: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    db.users.unshift(newUser);
    saveDatabase(db);

    console.log(`[API] New user registered on server: ${newUser.fullName} (${newUser.emailOrPhone}). Total server users: ${db.users.length}`);

    return res.json({ success: true, user: newUser, allUsers: db.users });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// 4. User Login
app.post('/api/users/login', (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    const normalizedInput = (emailOrPhone || '').trim().toLowerCase();

    const user = db.users.find(
      (u) => u.emailOrPhone && u.emailOrPhone.toLowerCase() === normalizedInput
    );

    if (!user) {
      return res.status(404).json({ success: false, error: 'No account found with this email/phone. Please create an account.' });
    }

    if (user.password && user.password !== password) {
      return res.status(401).json({ success: false, error: 'Incorrect password. Please try again.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, error: 'This account is currently blocked by administration.' });
    }

    return res.json({ success: true, user, allUsers: db.users });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// 5. Update User Profile / Settings / Balance
app.post('/api/users/update', (req, res) => {
  try {
    const { user } = req.body;
    if (!user || !user.id) {
      return res.status(400).json({ success: false, error: 'Invalid user payload' });
    }

    const idx = db.users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      db.users[idx] = { ...db.users[idx], ...user };
    } else {
      db.users.unshift(user);
    }

    saveDatabase(db);
    return res.json({ success: true, user: idx >= 0 ? db.users[idx] : user, allUsers: db.users });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// 6. Delete User
app.delete('/api/users/:id', (req, res) => {
  try {
    const userId = req.params.id;
    db.users = db.users.filter((u) => u.id !== userId);
    saveDatabase(db);
    return res.json({ success: true, allUsers: db.users });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// 7. Toggle Block User
app.post('/api/users/toggle-block', (req, res) => {
  try {
    const { userId } = req.body;
    const idx = db.users.findIndex((u) => u.id === userId);
    if (idx >= 0) {
      db.users[idx].isBlocked = !db.users[idx].isBlocked;
      saveDatabase(db);
      return res.json({ success: true, user: db.users[idx], allUsers: db.users });
    }
    return res.status(404).json({ success: false, error: 'User not found' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// 8. Admin Gift Reward
app.post('/api/users/gift', (req, res) => {
  try {
    const { userId, amount, note } = req.body;
    const idx = db.users.findIndex((u) => u.id === userId);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const giftAmount = Number(amount) || 0;
    db.users[idx].totalBalance = (db.users[idx].totalBalance || 0) + giftAmount;
    db.users[idx].totalEarned = (db.users[idx].totalEarned || 0) + giftAmount;

    // Add message
    const newMsg = {
      id: 'gift-' + Date.now(),
      userId: userId,
      title: `🎁 Gift from EarnHub (+₦${giftAmount.toLocaleString('en-NG')})`,
      content: note || `you have been gifted ₦${giftAmount.toLocaleString('en-NG')} by earnhub company`,
      date: 'Just now',
      read: false,
      type: 'approval',
      amount: giftAmount,
    };
    db.messages.unshift(newMsg);

    saveDatabase(db);
    return res.json({ success: true, user: db.users[idx], allUsers: db.users, messages: db.messages });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// 9. Video Task Submissions (Create)
app.post('/api/submissions', (req, res) => {
  try {
    const { submission } = req.body;
    if (!submission) {
      return res.status(400).json({ success: false, error: 'Submission payload is required' });
    }

    db.submissions.unshift(submission);

    // Update user's post count
    const uIdx = db.users.findIndex((u) => u.id === submission.userId);
    if (uIdx >= 0) {
      db.users[uIdx].totalPosts = (db.users[uIdx].totalPosts || 0) + (submission.videoCount || 1);
    }

    // Add system notification
    const newMsg = {
      id: 'msg-' + Date.now(),
      userId: submission.userId,
      title: `📤 Upload Queued: ${submission.videoCount || 1} Video(s)`,
      content: `Your upload for "${submission.taskTitle}" has been received and queued for compliance validation. Potential reward: ₦${(submission.potentialReward || 0).toLocaleString('en-NG')}.`,
      date: 'Just now',
      read: false,
      type: 'system',
    };
    db.messages.unshift(newMsg);

    saveDatabase(db);
    console.log(`[API] New video submission: ${submission.taskTitle} by user ${submission.userName}`);

    return res.json({ success: true, submission, allSubmissions: db.submissions, allUsers: db.users, messages: db.messages });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// 10. Review Video Task Submission (Approve / Decline)
app.post('/api/submissions/review', (req, res) => {
  try {
    const { subId, status, rewardAmount, declineReason } = req.body;
    const subIndex = db.submissions.findIndex((s) => s.id === subId);
    if (subIndex === -1) {
      return res.status(404).json({ success: false, error: 'Submission not found' });
    }

    const sub = db.submissions[subIndex];
    const timestamp = 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (status === 'approved') {
      const reward = Number(rewardAmount) || sub.potentialReward || 0;
      db.submissions[subIndex] = {
        ...sub,
        status: 'approved',
        approvedReward: reward,
        reviewedAt: timestamp,
      };

      // Credit user
      const uIdx = db.users.findIndex((u) => u.id === sub.userId);
      if (uIdx >= 0) {
        db.users[uIdx].totalEarned = (db.users[uIdx].totalEarned || 0) + reward;
        db.users[uIdx].totalBalance = (db.users[uIdx].totalBalance || 0) + reward;
      }

      // Send approval message
      db.messages.unshift({
        id: 'msg-' + Date.now(),
        userId: sub.userId,
        title: `🎉 Video Task Approved! +₦${reward.toLocaleString('en-NG')}`,
        content: `Your upload for "${sub.taskTitle}" (${sub.videoCount} videos) was approved by administrator. You have earned ₦${reward.toLocaleString('en-NG')} credited to your balance!`,
        date: 'Just now',
        read: false,
        type: 'approval',
        amount: reward,
      });
    } else {
      // Declined
      const reasonText = declineReason || 'your videos was declined due not clear and lack of videoing face';
      db.submissions[subIndex] = {
        ...sub,
        status: 'rejected',
        rejectionReason: reasonText,
        reviewedAt: timestamp,
      };

      // Send rejection notification
      db.messages.unshift({
        id: 'msg-' + Date.now(),
        userId: sub.userId,
        title: `⚠️ Video Task Declined (₦0 Earned)`,
        content: reasonText,
        date: 'Just now',
        read: false,
        type: 'rejection',
      });
    }

    saveDatabase(db);
    return res.json({
      success: true,
      submission: db.submissions[subIndex],
      allSubmissions: db.submissions,
      allUsers: db.users,
      messages: db.messages,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// 11. Delete Submission
app.delete('/api/submissions/:id', (req, res) => {
  try {
    const subId = req.params.id;
    db.submissions = db.submissions.filter((s) => s.id !== subId);
    saveDatabase(db);
    return res.json({ success: true, allSubmissions: db.submissions });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// 12. Create Withdrawal Request
app.post('/api/withdrawals', (req, res) => {
  try {
    const { withdrawal, updatedBalance } = req.body;
    if (!withdrawal) {
      return res.status(400).json({ success: false, error: 'Withdrawal payload required' });
    }

    db.withdrawals.unshift(withdrawal);

    // Update user balance
    const uIdx = db.users.findIndex((u) => u.id === withdrawal.userId);
    if (uIdx >= 0) {
      if (typeof updatedBalance === 'number') {
        db.users[uIdx].totalBalance = updatedBalance;
      } else {
        db.users[uIdx].totalBalance = Math.max(0, (db.users[uIdx].totalBalance || 0) - withdrawal.amount);
      }
    }

    // Add notification
    db.messages.unshift({
      id: 'msg-' + Date.now(),
      userId: withdrawal.userId,
      title: `⏳ Withdrawal Queued: ₦${(withdrawal.amount || 0).toLocaleString('en-NG')}`,
      content: `Your Sunday payout request of ₦${(withdrawal.amount || 0).toLocaleString('en-NG')} to ${withdrawal.bankName} (${withdrawal.accountNumber}) is queued for automated weekend disbursal.`,
      date: 'Just now',
      read: false,
      type: 'payout',
    });

    saveDatabase(db);
    return res.json({
      success: true,
      withdrawal,
      allWithdrawals: db.withdrawals,
      allUsers: db.users,
      messages: db.messages,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// 13. Disburse / Complete Withdrawal
app.post('/api/withdrawals/disburse', (req, res) => {
  try {
    const { withdrawalId } = req.body;
    const wIdx = db.withdrawals.findIndex((w) => w.id === withdrawalId);
    if (wIdx === -1) {
      return res.status(404).json({ success: false, error: 'Withdrawal not found' });
    }

    db.withdrawals[wIdx].status = 'completed';
    db.withdrawals[wIdx].processedAt = 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Send notification
    db.messages.unshift({
      id: 'msg-' + Date.now(),
      userId: db.withdrawals[wIdx].userId,
      title: `💸 Payout Sent: ₦${(db.withdrawals[wIdx].amount || 0).toLocaleString('en-NG')}`,
      content: `Your withdrawal of ₦${(db.withdrawals[wIdx].amount || 0).toLocaleString('en-NG')} has been successfully transferred to your ${db.withdrawals[wIdx].bankName} account (${db.withdrawals[wIdx].accountNumber}).`,
      date: 'Just now',
      read: false,
      type: 'payout',
    });

    saveDatabase(db);
    return res.json({ success: true, allWithdrawals: db.withdrawals, messages: db.messages });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// 14. Submit VIP Purchase Request
app.post('/api/vip/purchase', (req, res) => {
  try {
    const { purchase } = req.body;
    if (!purchase) {
      return res.status(400).json({ success: false, error: 'Purchase payload required' });
    }

    db.vipPurchases.unshift(purchase);

    db.messages.unshift({
      id: 'msg-vip-sub-' + Date.now(),
      userId: purchase.userId,
      title: `👑 VIP ${purchase.tierLevel} Upgrade Submitted`,
      content: `Your payment screenshot for ${purchase.tierName} (₦${(purchase.amount || 0).toLocaleString('en-NG')}) has been submitted to Admin.`,
      date: 'Just now',
      read: false,
      type: 'vip',
    });

    saveDatabase(db);
    return res.json({ success: true, purchase, allVIPPurchases: db.vipPurchases, messages: db.messages });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// 15. Review VIP Purchase (Approve / Reject)
app.post('/api/vip/review', (req, res) => {
  try {
    const { purchaseId, status, reason } = req.body;
    const pIdx = db.vipPurchases.findIndex((p) => p.id === purchaseId);
    if (pIdx === -1) {
      return res.status(404).json({ success: false, error: 'VIP Purchase not found' });
    }

    const reqItem = db.vipPurchases[pIdx];

    if (status === 'approved') {
      db.vipPurchases[pIdx].status = 'approved';
      db.vipPurchases[pIdx].reviewedAt = 'Just now';

      // Upgrade user
      const uIdx = db.users.findIndex((u) => u.id === reqItem.userId);
      if (uIdx >= 0) {
        db.users[uIdx].vipTier = reqItem.tierLevel;
      }

      db.messages.unshift({
        id: 'vip-appr-' + Date.now(),
        userId: reqItem.userId,
        title: `👑 VIP ${reqItem.tierLevel} Activated!`,
        content: `Your payment of ₦${(reqItem.amount || 0).toLocaleString('en-NG')} for VIP Tier ${reqItem.tierLevel} (${reqItem.tierName}) has been approved! Your earning booster multiplier is now active.`,
        date: 'Just now',
        read: false,
        type: 'vip',
      });
    } else {
      // Reject
      db.vipPurchases[pIdx].status = 'rejected';
      db.vipPurchases[pIdx].reviewedAt = 'Just now';
      db.vipPurchases[pIdx].rejectionReason = reason || 'Payment proof verification failed';

      db.messages.unshift({
        id: 'vip-dec-' + Date.now(),
        userId: reqItem.userId,
        title: `VIP Upgrade Status`,
        content: `your vip ativited was declined please try again`,
        date: 'Just now',
        read: false,
        type: 'rejection',
      });
    }

    saveDatabase(db);
    return res.json({
      success: true,
      allVIPPurchases: db.vipPurchases,
      allUsers: db.users,
      messages: db.messages,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// 16. Announcements (Create)
app.post('/api/announcements', (req, res) => {
  try {
    const { announcement } = req.body;
    if (announcement) {
      db.announcements.unshift(announcement);
      saveDatabase(db);
    }
    return res.json({ success: true, allAnnouncements: db.announcements });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// 16b. Announcements (Delete)
app.delete('/api/announcements/:id', (req, res) => {
  try {
    const aId = req.params.id;
    db.announcements = db.announcements.filter((a) => a.id !== aId);
    saveDatabase(db);
    return res.json({ success: true, allAnnouncements: db.announcements });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// 16c. VIP Purchase (Delete)
app.delete('/api/vip/purchase/:id', (req, res) => {
  try {
    const pId = req.params.id;
    db.vipPurchases = db.vipPurchases.filter((p) => p.id !== pId);
    saveDatabase(db);
    return res.json({ success: true, allVIPPurchases: db.vipPurchases });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// 16d. Withdrawals (Delete)
app.delete('/api/withdrawals/:id', (req, res) => {
  try {
    const wId = req.params.id;
    db.withdrawals = db.withdrawals.filter((w) => w.id !== wId);
    saveDatabase(db);
    return res.json({ success: true, allWithdrawals: db.withdrawals });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// 17. Messages (Mark read)
app.post('/api/messages/mark-read', (req, res) => {
  try {
    const { userId } = req.body;
    db.messages = db.messages.map((m) => {
      if (m.userId === userId || m.userId === 'all') {
        return { ...m, read: true };
      }
      return m;
    });
    saveDatabase(db);
    return res.json({ success: true, messages: db.messages });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// 17b. Admin Reset All Users Endpoint
app.post('/api/admin/reset-users', (req, res) => {
  try {
    db.users = [];
    saveDatabase(db);
    console.log('[API] Admin reset all registered users.');
    return res.json({ success: true, allUsers: [] });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// 17c. Admin Reset All Data (Users, Submissions, Withdrawals, VIP Buys, Messages)
app.post('/api/admin/reset-all', (req, res) => {
  try {
    db.users = [];
    db.submissions = [];
    db.withdrawals = [];
    db.vipPurchases = [];
    db.messages = [];
    saveDatabase(db);
    console.log('[API] Admin reset all platform data.');
    return res.json({
      success: true,
      allUsers: [],
      allSubmissions: [],
      allWithdrawals: [],
      allVIPPurchases: [],
      messages: [],
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// 18. Bidirectional Sync & Merge Endpoint (Safely merges any local offline data into server database)
app.post('/api/sync', (req, res) => {
  try {
    const { localUsers, localSubmissions, localWithdrawals, localVipPurchases } = req.body;

    let modified = false;

    if (Array.isArray(localUsers)) {
      for (const u of localUsers) {
        if (!u || !u.id) continue;
        const exists = db.users.find((su) => su.id === u.id || (su.emailOrPhone && u.emailOrPhone && su.emailOrPhone.toLowerCase() === u.emailOrPhone.toLowerCase()));
        if (!exists) {
          db.users.push(u);
          modified = true;
        }
      }
    }

    if (Array.isArray(localSubmissions)) {
      for (const s of localSubmissions) {
        if (!s || !s.id) continue;
        const exists = db.submissions.find((ss) => ss.id === s.id);
        if (!exists) {
          db.submissions.unshift(s);
          modified = true;
        }
      }
    }

    if (Array.isArray(localWithdrawals)) {
      for (const w of localWithdrawals) {
        if (!w || !w.id) continue;
        const exists = db.withdrawals.find((sw) => sw.id === w.id);
        if (!exists) {
          db.withdrawals.unshift(w);
          modified = true;
        }
      }
    }

    if (Array.isArray(localVipPurchases)) {
      for (const v of localVipPurchases) {
        if (!v || !v.id) continue;
        const exists = db.vipPurchases.find((sv) => sv.id === v.id);
        if (!exists) {
          db.vipPurchases.unshift(v);
          modified = true;
        }
      }
    }

    if (modified) {
      saveDatabase(db);
    }

    return res.json({
      success: true,
      users: db.users,
      submissions: db.submissions,
      withdrawals: db.withdrawals,
      announcements: db.announcements,
      messages: db.messages,
      vipPurchases: db.vipPurchases,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// Catch-all for API routes to guarantee they always respond with JSON
app.all('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: 'API endpoint not found' });
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & STATIC ASSETS
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EarnHub Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
