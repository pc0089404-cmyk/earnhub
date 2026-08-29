export interface User {
  id: string;
  fullName: string;
  emailOrPhone: string;
  password?: string;
  inviteCode?: string;
  isAdminEligible?: boolean;
  isBlocked?: boolean;
  isDemo?: boolean;
  avatarUrl?: string;
  totalEarned: number;
  totalBalance: number;
  totalPosts: number;
  vipTier: number; // 0 = Free, 1-10 = VIP
  joinedDate: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export interface VideoItem {
  id: string;
  name: string;
  size: string;
  url: string;
}

export interface VideoSubmission {
  id: string;
  userId: string;
  userName: string;
  taskId: string;
  taskTitle: string;
  videoCount: number;
  videoUrl?: string;
  videoUrls?: string[];
  videoItems?: VideoItem[];
  fileName: string;
  fileSize?: string;
  durationSeconds: number;
  status: 'processing' | 'pending_admin' | 'approved' | 'rejected';
  potentialReward: number;
  approvedReward?: number;
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  notes?: string;
}

export interface TaskDefinition {
  id: string;
  tabNumber: number;
  title: string;
  subtitle: string;
  durationRequired: string;
  rewardBase: number;
  ruleDescription: string;
  category: string;
  requirements: string[];
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: 'queued_sunday' | 'processing' | 'completed' | 'failed';
  requestedAt: string;
  scheduledDisbursement: string;
  processedAt?: string;
}

export interface LeaderboardCreator {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  city: string;
  videosUploaded: number;
  totalEarned: number;
  vipLevel: number;
  badge?: string;
}

export interface NewsBulletin {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
  isPinned?: boolean;
  tag: 'PROMO' | 'WINNER' | 'UPDATE' | 'ALERT';
}

export interface UserMessage {
  id: string;
  userId: string;
  title: string;
  content: string;
  date: string;
  read: boolean;
  type: 'approval' | 'rejection' | 'payout' | 'system' | 'vip';
  amount?: number;
}

export interface VIPTier {
  level: number;
  name: string;
  priceNgn: number;
  durationText: string;
  multiplier: number;
  features: string[];
  gradient: string;
}

export interface NigerianBank {
  code: string;
  name: string;
  popular?: boolean;
  logoColor?: string;
}

export interface VIPPurchaseRequest {
  id: string;
  userId: string;
  userName: string;
  userEmailOrPhone: string;
  tierLevel: number;
  tierName: string;
  amount: number;
  screenshotUrl: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: string;
  rejectionReason?: string;
}
