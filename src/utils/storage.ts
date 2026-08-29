import {
  User,
  VideoSubmission,
  TaskDefinition,
  WithdrawalRequest,
  LeaderboardCreator,
  NewsBulletin,
  UserMessage,
  VIPTier,
  NigerianBank,
  VIPPurchaseRequest,
} from '../types';

export const NIGERIAN_BANKS: NigerianBank[] = [
  { code: 'palmpay', name: 'PalmPay', popular: true, logoColor: 'bg-purple-600' },
  { code: 'opay', name: 'OPay Digital Services', popular: true, logoColor: 'bg-emerald-600' },
  { code: 'momo', name: 'MoMo PSB (MTN)', popular: true, logoColor: 'bg-yellow-500' },
  { code: 'uba', name: 'United Bank for Africa (UBA)', popular: true, logoColor: 'bg-red-600' },
  { code: 'firstbank', name: 'First Bank of Nigeria', popular: true, logoColor: 'bg-blue-800' },
  { code: 'zenith', name: 'Zenith Bank', popular: true, logoColor: 'bg-red-700' },
  { code: 'gtbank', name: 'Guaranty Trust Bank (GTBank)', popular: true, logoColor: 'bg-orange-600' },
  { code: 'access', name: 'Access Bank Plc', popular: true, logoColor: 'bg-orange-500' },
  { code: 'kuda', name: 'Kuda Microfinance Bank', popular: true, logoColor: 'bg-indigo-600' },
  { code: 'moniepoint', name: 'Moniepoint MFB', popular: true, logoColor: 'bg-blue-600' },
  { code: 'wema', name: 'Wema Bank (ALAT)', popular: false, logoColor: 'bg-purple-800' },
  { code: 'fidelity', name: 'Fidelity Bank', popular: false, logoColor: 'bg-green-700' },
  { code: 'fcmb', name: 'First City Monument Bank (FCMB)', popular: false, logoColor: 'bg-purple-700' },
  { code: 'stanbic', name: 'Stanbic IBTC Bank', popular: false, logoColor: 'bg-blue-900' },
  { code: 'union', name: 'Union Bank of Nigeria', popular: false, logoColor: 'bg-sky-600' },
];

export const VIP_TIERS: VIPTier[] = [
  {
    level: 1,
    name: 'VIP Tier 1',
    priceNgn: 10000,
    durationText: '1 Month',
    multiplier: 1.2,
    features: ['1.2x Earning Multiplier on all tasks', 'Standard 24-hr Task Review', 'Access to VIP Badge', 'Sunday Payout eligibility'],
    gradient: 'from-blue-600 to-indigo-700',
  },
  {
    level: 2,
    name: 'VIP Tier 2',
    priceNgn: 20000,
    durationText: '1 Month',
    multiplier: 1.5,
    features: ['1.5x Earning Multiplier', 'Priority Queue Processing', 'Exclusive Creator Group', 'Special Monthly Cash Raffle'],
    gradient: 'from-pink-600 to-rose-700',
  },
  {
    level: 3,
    name: 'VIP Tier 3',
    priceNgn: 35000,
    durationText: '1 Month',
    multiplier: 1.8,
    features: ['1.8x Earning Multiplier', 'Expedited Admin Approvals', 'Dedicated Account Manager', 'Custom Video Watermark Check'],
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    level: 4,
    name: 'VIP Tier 4',
    priceNgn: 50000,
    durationText: '1 Month',
    multiplier: 2.0,
    features: ['2.0x Double Earning Multiplier', 'Same-Day Fast Reviews', 'Exclusive Pro Masterclass Content', 'VIP Priority Support'],
    gradient: 'from-emerald-600 to-teal-700',
  },
  {
    level: 5,
    name: 'VIP Tier 5',
    priceNgn: 75000,
    durationText: '1 Month',
    multiplier: 2.5,
    features: ['2.5x High Earning Multiplier', 'Direct WhatsApp Manager', 'Unlimited Daily Submissions', 'Early Access to High-Paying Tasks'],
    gradient: 'from-purple-600 to-pink-700',
  },
  {
    level: 6,
    name: 'VIP Tier 6',
    priceNgn: 100000,
    durationText: '1 Month',
    multiplier: 3.0,
    features: ['3.0x Triple Rewards', 'Instant Auto-Approve on 50% tasks', 'Weekly Creator Bonus Pool', 'Custom Creator Profile Page'],
    gradient: 'from-yellow-500 to-amber-700',
  },
  {
    level: 7,
    name: 'VIP Tier 7',
    priceNgn: 130000,
    durationText: '1 Month',
    multiplier: 3.5,
    features: ['3.5x Multiplier', 'Double Weekend Payout Bonus', 'Zero Withdrawal Processing Fees', 'VIP Leaderboard Showcase'],
    gradient: 'from-cyan-600 to-blue-700',
  },
  {
    level: 8,
    name: 'VIP Tier 8',
    priceNgn: 160000,
    durationText: '1 Month',
    multiplier: 4.0,
    features: ['4.0x Massive Boost', 'Express Direct Wire Payout', 'Featured Spotlight on Homefeed', 'VIP Ambassador Status'],
    gradient: 'from-fuchsia-600 to-purple-800',
  },
  {
    level: 9,
    name: 'VIP Tier 9',
    priceNgn: 200000,
    durationText: '1 Month',
    multiplier: 4.5,
    features: ['4.5x Elite Multiplier', 'Priority 1st Batch Sunday Payout', '1-on-1 Monetization Strategist', 'Premium Hardware Giveaway Access'],
    gradient: 'from-rose-600 to-pink-800',
  },
  {
    level: 10,
    name: 'VIP Tier 10 (Master Diamond)',
    priceNgn: 250000,
    durationText: '1 Month',
    multiplier: 5.0,
    features: ['5.0x Maximum Supreme Multiplier', 'Instantaneous 1-Minute Approvals', 'Unlimited Withdrawal Amount', 'VIP Top Diamond Crown'],
    gradient: 'from-amber-400 via-pink-500 to-indigo-900',
  },
];

export const REWARD_MILESTONES = [
  { id: 'm-1', count: 1, rewardNgn: 2000, label: '1 Video (Single)', badge: '1 Video = ₦2,000', minDuration: '60s+ Minimum' },
  { id: 'm-5', count: 5, rewardNgn: 20000, label: '5 Videos Task', badge: '5 Videos = ₦20,000', popular: true, minDuration: '60s+ each' },
  { id: 'm-10', count: 10, rewardNgn: 30000, label: '10 Videos Task', badge: '10 Videos = ₦30,000', minDuration: '60s+ each' },
  { id: 'm-15', count: 15, rewardNgn: 37000, label: '15 Videos Task', badge: '15 Videos = ₦37,000', minDuration: '60s+ each' },
  { id: 'm-20', count: 20, rewardNgn: 50000, label: '20 Videos Task', badge: '20 Videos = ₦50,000', minDuration: '60s+ each' },
  { id: 'm-long-3m', count: 1, rewardNgn: 90000, label: '1 Long Video (3 Mins)', badge: '1 Video (3 Mins) = ₦90,000', isLongVideo: true, special: true, minDuration: 'Full 3:00 Mins (180s+) HD' },
  { id: 'm-long-5m', count: 1, rewardNgn: 190000, label: '1 Long Video (5 Mins)', badge: '1 Video (5 Mins) = ₦190,000', isLongVideo: true, special: true, minDuration: 'Full 5:00 Mins (300s+) HD' },
  { id: 'm-long-10m', count: 1, rewardNgn: 290000, label: '1 Long Video (10 Mins)', badge: '1 Video (10 Mins) = ₦290,000', isLongVideo: true, special: true, minDuration: 'Full 10:00 Mins (600s+) HD' },
];

export const TASK_DEFINITIONS: TaskDefinition[] = [
  {
    id: 'task-1',
    tabNumber: 1,
    title: 'Authentic Creator Introduction & Self-Review',
    subtitle: 'Clear front-facing camera speaking review and expression',
    durationRequired: 'Min 1:00 min (60+ seconds)',
    rewardBase: 2000,
    category: 'Creator Intro',
    ruleDescription:
      'Video MUST clearly show your unobstructed real face in good lighting. You must introduce yourself to EarnHub, speak naturally to camera, and demonstrate genuine expressions. No still photos, slideshows, or third-party faces. Duration must be at least 1 full minute.',
    requirements: [
      'Face clearly visible in high resolution (no sunglasses/masks)',
      'Minimum continuous duration of 60 seconds (1 minute)',
      'Original creator voice and self recording',
      'Zero duplicate uploads; mismatched faces will lead to ban',
    ],
  },
  {
    id: 'task-2',
    tabNumber: 2,
    title: 'Lifestyle & Dynamic Product Showcase Clip',
    subtitle: 'Demonstrate everyday utility or creative gadget unboxing',
    durationRequired: 'Min 1:00 min (60+ seconds)',
    rewardBase: 2000,
    category: 'Product Demo',
    ruleDescription:
      'Show your face alongside a real household item, fashion accessory, or gadget. Explain features or thoughts. Frame must keep you as the primary presenter throughout the entire clip.',
    requirements: [
      'Front-facing presenter frame with hands and item visible',
      'Minimum duration 1 full minute (60s+)',
      'Clear audio quality without heavy background music distortion',
      'Only your genuine verified face allowed',
    ],
  },
  {
    id: 'task-3',
    tabNumber: 3,
    title: 'Daily Creative Vlog & Talent Challenge',
    subtitle: 'Share your daily routine, creative skill, or motivational monologue',
    durationRequired: 'Min 1:00 min (60+ seconds)',
    rewardBase: 2000,
    category: 'Vlog & Talent',
    ruleDescription:
      'Record an engaging continuous vlog clip showing your real surroundings, thoughts, or creative talent. Must maintain high energy and visible eye contact with camera.',
    requirements: [
      'Minimum video length of 60+ seconds',
      'Dynamic environment with authentic background lighting',
      'Strict single-creator identity rule',
      'No copyrighted TV/film screen recordings',
    ],
  },
  {
    id: 'task-4',
    tabNumber: 4,
    title: 'Facial Reaction & Dialogue Response Challenge',
    subtitle: 'Perform lively reactive commentary to trending topics',
    durationRequired: 'Min 1:00 min (60+ seconds)',
    rewardBase: 2000,
    category: 'Reaction Clip',
    ruleDescription:
      'Record live facial reactions, insightful commentary, and genuine vocal expressions to popular culture or life advice prompts. Video must run uninterrupted for over 60 seconds.',
    requirements: [
      'Face centered in portrait or landscape format',
      'Continuous video clip over 60 seconds',
      'High facial expression clarity',
      'Original recording only',
    ],
  },
  {
    id: 'task-5',
    tabNumber: 5,
    title: '🌟 High Clear 3-Minute Master Video (₦90,000)',
    subtitle: 'Full 3-minute ultra crystal-clear front-facing presentation',
    durationRequired: 'Full 3:00 Mins (180s+) High Clear HD',
    rewardBase: 90000,
    category: '3-Min Ultra HD',
    ruleDescription:
      'High clarity, crisp lighting, 3 full continuous minutes (180+ seconds) uninterrupted recording with face centered. Earn ₦90,000 cash reward upon admin verification!',
    requirements: [
      'Crystal clear HD camera quality in bright lighting',
      'Full 3 minutes continuous duration (180+ seconds)',
      'Clear face speaking and natural creator presentation',
      'Instant ₦90,000 payout upon admin review',
    ],
  },
  {
    id: 'task-6',
    tabNumber: 6,
    title: '🌟 High Clear 5-Minute Master Video (₦190,000)',
    subtitle: 'Full 5-minute ultra crystal-clear front-facing presentation',
    durationRequired: 'Full 5:00 Mins (300s+) High Clear HD',
    rewardBase: 190000,
    category: '5-Min Ultra HD',
    ruleDescription:
      'High clarity, crisp lighting, 5 full continuous minutes (300+ seconds) uninterrupted recording with face centered. Earn ₦190,000 cash reward upon admin verification!',
    requirements: [
      'Crystal clear HD camera quality in bright lighting',
      'Full 5 minutes continuous duration (300+ seconds)',
      'Clear face speaking and continuous engagement',
      'Instant ₦190,000 payout upon admin review',
    ],
  },
  {
    id: 'task-7',
    tabNumber: 7,
    title: '🌟 High Clear 10-Minute Mega Master Video (₦290,000)',
    subtitle: 'Full 10-minute ultra crystal-clear front-facing presentation',
    durationRequired: 'Full 10:00 Mins (600s+) High Clear HD',
    rewardBase: 290000,
    category: '10-Min Mega HD',
    ruleDescription:
      'High clarity, crisp lighting, 10 full continuous minutes (600+ seconds) uninterrupted recording with face centered. Earn the maximum ₦290,000 cash reward upon admin verification!',
    requirements: [
      'Crystal clear HD camera quality in bright lighting',
      'Full 10 minutes continuous duration (600+ seconds)',
      'Clear face speaking and master presentation',
      'Maximum ₦290,000 payout upon admin review',
    ],
  },
];

export const INITIAL_LEADERBOARD: LeaderboardCreator[] = [
  { rank: 1, id: 'c-1', name: 'Precious Joy Adebayo', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', city: 'Lagos (Ikeja)', videosUploaded: 42, totalEarned: 1485000, vipLevel: 10, badge: '🔥 #1 Top Earner of Nigeria' },
  { rank: 2, id: 'c-2', name: 'Emeka Okafor', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', city: 'Abuja (FCT)', videosUploaded: 36, totalEarned: 1250000, vipLevel: 9, badge: '⭐ Diamond Creator' },
  { rank: 3, id: 'c-3', name: 'Chidinma Obi', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', city: 'Port Harcourt', videosUploaded: 33, totalEarned: 980000, vipLevel: 8, badge: '💎 Speed Uploader' },
  { rank: 4, id: 'c-4', name: 'Tunde Adeleke', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', city: 'Lagos (Lekki)', videosUploaded: 29, totalEarned: 840000, vipLevel: 7 },
  { rank: 5, id: 'c-5', name: 'Blessing Danladi', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80', city: 'Kaduna', videosUploaded: 27, totalEarned: 725000, vipLevel: 6 },
  { rank: 6, id: 'c-6', name: 'Nkechi Eze', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80', city: 'Enugu', videosUploaded: 25, totalEarned: 618000, vipLevel: 6 },
  { rank: 7, id: 'c-7', name: 'Femi Balogun', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', city: 'Ibadan', videosUploaded: 24, totalEarned: 520000, vipLevel: 5 },
  { rank: 8, id: 'c-8', name: 'Amina Bello', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', city: 'Kano', videosUploaded: 22, totalEarned: 440000, vipLevel: 5 },
  { rank: 9, id: 'c-9', name: 'David Chukwuma', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', city: 'Asaba', videosUploaded: 20, totalEarned: 375000, vipLevel: 4 },
  { rank: 10, id: 'c-10', name: 'Zainab Lawal', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', city: 'Ilorin', videosUploaded: 19, totalEarned: 310000, vipLevel: 4 },
  { rank: 11, id: 'c-11', name: 'Kelechi Nwosu', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80', city: 'Owerri', videosUploaded: 17, totalEarned: 260000, vipLevel: 3 },
  { rank: 12, id: 'c-12', name: 'Mercy Johnson-Peters', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80', city: 'Benin City', videosUploaded: 16, totalEarned: 220000, vipLevel: 3 },
  { rank: 13, id: 'c-13', name: 'Segun Ogundipe', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', city: 'Lagos (Surulere)', videosUploaded: 15, totalEarned: 185000, vipLevel: 3 },
  { rank: 14, id: 'c-14', name: 'Halima Yusuf', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', city: 'Sokoto', videosUploaded: 14, totalEarned: 150000, vipLevel: 2 },
  { rank: 15, id: 'c-15', name: 'Victor Umeh', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', city: 'Warri', videosUploaded: 13, totalEarned: 125000, vipLevel: 2 },
  { rank: 16, id: 'c-16', name: 'Funke Akindele-Cole', avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80', city: 'Abeokuta', videosUploaded: 12, totalEarned: 98000, vipLevel: 2 },
  { rank: 17, id: 'c-17', name: 'Ibrahim Sani', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80', city: 'Jos', videosUploaded: 11, totalEarned: 82000, vipLevel: 1 },
  { rank: 18, id: 'c-18', name: 'Bukola Shonibare', avatar: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?w=150&auto=format&fit=crop&q=80', city: 'Lagos (Yaba)', videosUploaded: 10, totalEarned: 68000, vipLevel: 1 },
  { rank: 19, id: 'c-19', name: 'Tochukwu Anozie', avatar: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=150&auto=format&fit=crop&q=80', city: 'Onitsha', videosUploaded: 9, totalEarned: 54000, vipLevel: 1 },
  { rank: 20, id: 'c-20', name: 'Grace Bassey', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80', city: 'Calabar', videosUploaded: 8, totalEarned: 42000, vipLevel: 1 },
  { rank: 21, id: 'c-21', name: 'Olawale Sanusi', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&auto=format&fit=crop&q=80', city: 'Osogbo', videosUploaded: 7, totalEarned: 32000, vipLevel: 0 },
  { rank: 22, id: 'c-22', name: 'Rahmatu Mohammed', avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=150&auto=format&fit=crop&q=80', city: 'Minna', videosUploaded: 6, totalEarned: 25000, vipLevel: 0 },
  { rank: 23, id: 'c-23', name: 'Godwin Akpan', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', city: 'Uyo', videosUploaded: 5, totalEarned: 18000, vipLevel: 0 },
  { rank: 24, id: 'c-24', name: 'Yetunde Oladipo', avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&auto=format&fit=crop&q=80', city: 'Akure', videosUploaded: 4, totalEarned: 14000, vipLevel: 0 },
  { rank: 25, id: 'c-25', name: 'Uchechi Madu', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', city: 'Aba', videosUploaded: 3, totalEarned: 10000, vipLevel: 0 },
  { rank: 26, id: 'c-26', name: 'Musa Abdullahi', avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80', city: 'Bauchi', videosUploaded: 3, totalEarned: 7500, vipLevel: 0 },
  { rank: 27, id: 'c-27', name: 'Folake Alabi', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80', city: 'Lagos (Victoria Island)', videosUploaded: 2, totalEarned: 5000, vipLevel: 0 },
  { rank: 28, id: 'c-28', name: 'Emmanuel Ebere', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', city: 'Awka', videosUploaded: 2, totalEarned: 4000, vipLevel: 0 },
  { rank: 29, id: 'c-29', name: 'Mariam Abubakar', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', city: 'Zaria', videosUploaded: 1, totalEarned: 2000, vipLevel: 0 },
  { rank: 30, id: 'c-30', name: 'Austin Agada', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', city: 'Makurdi', videosUploaded: 1, totalEarned: 2000, vipLevel: 0 },
];

export const INITIAL_ANNOUNCEMENTS: NewsBulletin[] = [
  {
    id: 'news-1',
    title: '🔥 Monthly Creator Sprint is Live!',
    content:
      'ClipEarn users: This month will be very hot! Complete your video tasks consistently to earn higher payouts and unlock special milestone tiers.',
    author: 'Admin Team',
    publishedAt: 'Today at 08:30 AM',
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

export const PRO_DEMO_VIDEOS = [
  {
    id: 'demo-1',
    title: 'Masterclass: How Top Creators Earn ₦150k Weekly with 1-Min Clips',
    creator: 'Precious Joy (VIP 8)',
    views: '48.2k views',
    duration: '04:12',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    lockedNote: '🔒 Premium VIP Stream — Available exclusively to VIP Tier 1+ Members',
  },
  {
    id: 'demo-2',
    title: 'Lighting & Framing Secrets for Fast 1-Minute Face Verification',
    creator: 'Emeka Okafor (VIP 7)',
    views: '32.9k views',
    duration: '03:45',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    lockedNote: '🔒 Premium VIP Stream — Available exclusively to VIP Tier 1+ Members',
  },
  {
    id: 'demo-3',
    title: 'Direct Bank Withdrawal Strategies & Weekend Payout Scheduling',
    creator: 'Chidinma Obi (VIP 6)',
    views: '29.1k views',
    duration: '05:10',
    thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    lockedNote: '🔒 Premium VIP Stream — Available exclusively to VIP Tier 1+ Members',
  },
];

// Helper to format Nigerian Naira
export function formatNaira(amount: number): string {
  return '₦' + (amount || 0).toLocaleString('en-NG');
}

// LocalStorage Keys
const USERS_KEY = 'earnhub_users';
const CURRENT_USER_KEY = 'earnhub_current_user';
const SUBMISSIONS_KEY = 'earnhub_submissions';
const WITHDRAWALS_KEY = 'earnhub_withdrawals';
const ANNOUNCEMENTS_KEY = 'earnhub_announcements';
const MESSAGES_KEY = 'earnhub_messages';
const VIP_PURCHASES_KEY = 'earnhub_vip_purchases';

// Live Creator Earnings Stream for Earn View (10+ realistic creators without mentioning demo)
export interface CreatorActivity {
  id: string;
  name: string;
  avatar: string;
  amount: number;
  type: string;
  bankOrMethod: string;
  timeAgo: string;
  verified: boolean;
}

export const LIVE_CREATOR_ACTIVITY: CreatorActivity[] = [
  { id: 'act-1', name: 'Chinedu Eze', avatar: 'C', amount: 18500, type: 'Face Video Task', bankOrMethod: 'PalmPay', timeAgo: '2m ago', verified: true },
  { id: 'act-2', name: 'Amina Bello', avatar: 'A', amount: 52000, type: 'Sunday Disbursement', bankOrMethod: 'OPay', timeAgo: '5m ago', verified: true },
  { id: 'act-3', name: 'Tunde Adeleke', avatar: 'T', amount: 30000, type: 'Top Star 20-Photo Bonus', bankOrMethod: 'GTBank', timeAgo: '8m ago', verified: true },
  { id: 'act-4', name: 'Blessing Danladi', avatar: 'B', amount: 65000, type: '15-Video Milestone Reward', bankOrMethod: 'UBA', timeAgo: '12m ago', verified: true },
  { id: 'act-5', name: 'Emeka Okafor', avatar: 'E', amount: 37000, type: '10 Video Challenge', bankOrMethod: 'FirstBank', timeAgo: '18m ago', verified: true },
  { id: 'act-6', name: 'Faith Kalu', avatar: 'F', amount: 14000, type: 'Identity Verification Task', bankOrMethod: 'MoMo PSB', timeAgo: '24m ago', verified: true },
  { id: 'act-7', name: 'Ibrahim Sani', avatar: 'I', amount: 101000, type: '30 Video Super Bonus', bankOrMethod: 'Kuda MFB', timeAgo: '31m ago', verified: true },
  { id: 'act-8', name: 'Ngozi Umeh', avatar: 'N', amount: 28000, type: 'Creative Talent Vlog', bankOrMethod: 'Moniepoint', timeAgo: '42m ago', verified: true },
  { id: 'act-9', name: 'Oluwaseun Alabi', avatar: 'O', amount: 45000, type: 'VIP Multiplier Payout', bankOrMethod: 'Access Bank', timeAgo: '55m ago', verified: true },
  { id: 'act-10', name: 'Kelechi Nwosu', avatar: 'K', amount: 35000, type: 'Dialogue Challenge', bankOrMethod: 'Zenith Bank', timeAgo: '1h ago', verified: true },
  { id: 'act-11', name: 'Halima Yusuf', avatar: 'H', amount: 22500, type: 'Weekly Creator Sprint', bankOrMethod: 'PalmPay', timeAgo: '1h ago', verified: true },
  { id: 'act-12', name: 'David Chukwuma', avatar: 'D', amount: 120000, type: '50 Video Blitz Champion', bankOrMethod: 'OPay', timeAgo: '2h ago', verified: true },
];

// Top Star Rewards definitions for Earn View
export interface StarRewardTask {
  id: string;
  title: string;
  badge: string;
  gradeReward: number;
  requiredCount: number;
  itemType: 'pictures' | 'videos';
  description: string;
  requirements: string[];
}

export const TOP_STAR_REWARDS: StarRewardTask[] = [
  {
    id: 'star-photos-20',
    title: 'Top Star 20 Picture Challenge',
    badge: 'Grade A Reward',
    gradeReward: 30000,
    requiredCount: 20,
    itemType: 'pictures',
    description: 'Upload 20 different clear high-definition creator pictures/poses in good lighting for a big grade reward of ₦30,000.',
    requirements: ['20 distinct clear photos/poses', 'Good natural or studio lighting', 'No repetitive duplicates', 'Instant ₦30,000 credit upon approval'],
  },
  {
    id: 'star-video-50',
    title: 'Top Star 50 Video Blitz',
    badge: 'Mega Bonus',
    gradeReward: 120000,
    requiredCount: 50,
    itemType: 'videos',
    description: 'Complete 50 short video clips (1-minute each) to unlock the highest platform cash bonus tier of ₦120,000.',
    requirements: ['50 recorded clips (60s each)', 'Original face visibility', 'High audio clarity', 'Credited directly to available balance'],
  },
  {
    id: 'star-marathon-15',
    title: 'Weekend Creator Marathon (15 Videos)',
    badge: 'Weekend Sprint',
    gradeReward: 55000,
    requiredCount: 15,
    itemType: 'videos',
    description: 'Record and submit 15 authentic vlog and review videos during the weekend sprint for ₦55,000 bonus cash.',
    requirements: ['15 separate video recordings', 'Clear spoken dialogue', 'Approved within 12 hours'],
  },
];

// Initialize default storage if empty
export function initLocalStorage(): void {
  if (!localStorage.getItem(ANNOUNCEMENTS_KEY)) {
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(INITIAL_ANNOUNCEMENTS));
  }

  if (!localStorage.getItem(SUBMISSIONS_KEY)) {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify([]));
  }

  if (!localStorage.getItem(USERS_KEY)) {
    // Only real users who sign up will populate the users list
    localStorage.setItem(USERS_KEY, JSON.stringify([]));
  }
}

// -------------------------------------------------------------
// SERVER API SYNC & CROSS-DEVICE PERSISTENCE
// -------------------------------------------------------------

export interface ServerStateResponse {
  success: boolean;
  users: User[];
  submissions: VideoSubmission[];
  withdrawals: WithdrawalRequest[];
  announcements: NewsBulletin[];
  messages: UserMessage[];
  vipPurchases: VIPPurchaseRequest[];
}

export async function apiFetchServerState(): Promise<ServerStateResponse | null> {
  try {
    const res = await fetch('/api/state');
    if (!res.ok) return null;
    const data: ServerStateResponse = await res.json();
    if (data.success) {
      if (Array.isArray(data.users)) saveUsers(data.users);
      if (Array.isArray(data.submissions)) saveSubmissions(data.submissions);
      if (Array.isArray(data.withdrawals)) saveWithdrawals(data.withdrawals);
      if (Array.isArray(data.announcements)) saveAnnouncements(data.announcements);
      if (Array.isArray(data.vipPurchases)) saveVIPPurchases(data.vipPurchases);
      if (Array.isArray(data.messages)) {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(data.messages));
      }
      return data;
    }
    return null;
  } catch (err) {
    // Return null if offline or initial load
    return null;
  }
}

export async function apiRegisterUser(params: {
  fullName: string;
  emailOrPhone: string;
  password?: string;
  inviteCode?: string;
}): Promise<{ success: boolean; user?: User; error?: string; allUsers?: User[] }> {
  try {
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (data.success && data.user) {
      if (Array.isArray(data.allUsers)) saveUsers(data.allUsers);
      setCurrentUser(data.user);
      return { success: true, user: data.user, allUsers: data.allUsers };
    }
    return { success: false, error: data.error || 'Failed to register account' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network connection failed' };
  }
}

export async function apiLoginUser(params: {
  emailOrPhone: string;
  password?: string;
}): Promise<{ success: boolean; user?: User; error?: string; allUsers?: User[] }> {
  try {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (data.success && data.user) {
      if (Array.isArray(data.allUsers)) saveUsers(data.allUsers);
      setCurrentUser(data.user);
      return { success: true, user: data.user, allUsers: data.allUsers };
    }
    return { success: false, error: data.error || 'Invalid credentials' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network connection failed' };
  }
}

export async function apiUpdateUser(user: User): Promise<boolean> {
  try {
    const res = await fetch('/api/users/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user }),
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.allUsers)) {
      saveUsers(data.allUsers);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function apiDeleteUser(userId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success && Array.isArray(data.allUsers)) {
      saveUsers(data.allUsers);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function apiToggleBlockUser(userId: string): Promise<boolean> {
  try {
    const res = await fetch('/api/users/toggle-block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.allUsers)) {
      saveUsers(data.allUsers);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function apiGiftUserReward(userId: string, amount: number, note?: string): Promise<boolean> {
  try {
    const res = await fetch('/api/users/gift', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount, note }),
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.allUsers)) {
      saveUsers(data.allUsers);
      if (Array.isArray(data.messages)) {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(data.messages));
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function apiSubmitVideoTask(submission: VideoSubmission): Promise<boolean> {
  try {
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submission }),
    });
    const data = await res.json();
    if (data.success) {
      if (Array.isArray(data.allSubmissions)) saveSubmissions(data.allSubmissions);
      if (Array.isArray(data.allUsers)) saveUsers(data.allUsers);
      if (Array.isArray(data.messages)) {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(data.messages));
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function apiReviewVideoTask(
  subId: string,
  status: 'approved' | 'rejected',
  rewardAmount?: number,
  declineReason?: string
): Promise<boolean> {
  try {
    const res = await fetch('/api/submissions/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subId, status, rewardAmount, declineReason }),
    });
    const data = await res.json();
    if (data.success) {
      if (Array.isArray(data.allSubmissions)) saveSubmissions(data.allSubmissions);
      if (Array.isArray(data.allUsers)) saveUsers(data.allUsers);
      if (Array.isArray(data.messages)) {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(data.messages));
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function apiDeleteSubmission(subId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/submissions/${subId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success && Array.isArray(data.allSubmissions)) {
      saveSubmissions(data.allSubmissions);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function apiSubmitWithdrawal(withdrawal: WithdrawalRequest, updatedBalance?: number): Promise<boolean> {
  try {
    const res = await fetch('/api/withdrawals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ withdrawal, updatedBalance }),
    });
    const data = await res.json();
    if (data.success) {
      if (Array.isArray(data.allWithdrawals)) saveWithdrawals(data.allWithdrawals);
      if (Array.isArray(data.allUsers)) saveUsers(data.allUsers);
      if (Array.isArray(data.messages)) {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(data.messages));
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function apiDisburseWithdrawal(withdrawalId: string): Promise<boolean> {
  try {
    const res = await fetch('/api/withdrawals/disburse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ withdrawalId }),
    });
    const data = await res.json();
    if (data.success) {
      if (Array.isArray(data.allWithdrawals)) saveWithdrawals(data.allWithdrawals);
      if (Array.isArray(data.messages)) {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(data.messages));
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function apiSubmitVIPPurchase(purchase: VIPPurchaseRequest): Promise<boolean> {
  try {
    const res = await fetch('/api/vip/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ purchase }),
    });
    const data = await res.json();
    if (data.success) {
      if (Array.isArray(data.allVIPPurchases)) saveVIPPurchases(data.allVIPPurchases);
      if (Array.isArray(data.messages)) {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(data.messages));
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function apiReviewVIPPurchase(purchaseId: string, status: 'approved' | 'rejected', reason?: string): Promise<boolean> {
  try {
    const res = await fetch('/api/vip/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ purchaseId, status, reason }),
    });
    const data = await res.json();
    if (data.success) {
      if (Array.isArray(data.allVIPPurchases)) saveVIPPurchases(data.allVIPPurchases);
      if (Array.isArray(data.allUsers)) saveUsers(data.allUsers);
      if (Array.isArray(data.messages)) {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(data.messages));
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function apiAddAnnouncement(announcement: NewsBulletin): Promise<boolean> {
  try {
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ announcement }),
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.allAnnouncements)) {
      saveAnnouncements(data.allAnnouncements);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function apiMarkMessagesRead(userId: string): Promise<boolean> {
  try {
    const res = await fetch('/api/messages/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.messages)) {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(data.messages));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Storage Accessors
export function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function deleteUser(userId: string): void {
  const users = getUsers().filter((u) => u.id !== userId);
  saveUsers(users);
  apiDeleteUser(userId);
  const current = getCurrentUser();
  if (current?.id === userId) {
    setCurrentUser(null);
  }
}

export function giftUserReward(userId: string, amount: number, note?: string): { success: boolean; user?: User } {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return { success: false };

  users[idx].totalBalance = (users[idx].totalBalance || 0) + amount;
  users[idx].totalEarned = (users[idx].totalEarned || 0) + amount;
  saveUsers(users);

  // If current logged in user is the recipient, update current user too
  const current = getCurrentUser();
  if (current?.id === userId) {
    setCurrentUser(users[idx]);
  }

  // Send gift notification message
  addMessage({
    id: 'gift-' + Date.now(),
    userId: userId,
    title: `🎁 Gift from EarnHub (+${formatNaira(amount)})`,
    content: note || `you have been gifted ${formatNaira(amount)} by earnhub company`,
    date: 'Just now',
    read: false,
    type: 'approval',
    amount: amount,
  });

  // Also sync to server
  apiGiftUserReward(userId, amount, note);

  return { success: true, user: users[idx] };
}

export function getCurrentUser(): User | null {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    // Also update in all users array
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.unshift(user);
    }
    saveUsers(users);
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function getSubmissions(): VideoSubmission[] {
  try {
    return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveSubmissions(subs: VideoSubmission[]): void {
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(subs));
}

export function getWithdrawals(): WithdrawalRequest[] {
  try {
    return JSON.parse(localStorage.getItem(WITHDRAWALS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveWithdrawals(w: WithdrawalRequest[]): void {
  localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(w));
}

export function getAnnouncements(): NewsBulletin[] {
  try {
    return JSON.parse(localStorage.getItem(ANNOUNCEMENTS_KEY) || '[]');
  } catch {
    return INITIAL_ANNOUNCEMENTS;
  }
}

export function saveAnnouncements(news: NewsBulletin[]): void {
  localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(news));
}

export function getMessages(userId: string): UserMessage[] {
  try {
    const allMessages: UserMessage[] = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
    return allMessages.filter((m) => m.userId === userId || m.userId === 'all');
  } catch {
    return [];
  }
}

export function addMessage(msg: UserMessage): void {
  try {
    const allMessages: UserMessage[] = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
    allMessages.unshift(msg);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages));
  } catch (err) {
    console.error('Failed to add message', err);
  }
}

export function markMessagesRead(userId: string): void {
  try {
    const allMessages: UserMessage[] = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
    const updated = allMessages.map((m) => {
      if (m.userId === userId || m.userId === 'all') {
        return { ...m, read: true };
      }
      return m;
    });
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
    apiMarkMessagesRead(userId);
  } catch (err) {
    console.error('Failed to mark read', err);
  }
}

export function getVIPPurchases(): VIPPurchaseRequest[] {
  try {
    return JSON.parse(localStorage.getItem(VIP_PURCHASES_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveVIPPurchases(reqs: VIPPurchaseRequest[]): void {
  localStorage.setItem(VIP_PURCHASES_KEY, JSON.stringify(reqs));
}

export function addVIPPurchase(req: VIPPurchaseRequest): void {
  const reqs = getVIPPurchases();
  reqs.unshift(req);
  saveVIPPurchases(reqs);
  apiSubmitVIPPurchase(req);
}

export function approveVIPPurchase(id: string): { success: boolean; user?: User; req?: VIPPurchaseRequest } {
  const reqs = getVIPPurchases();
  const reqIdx = reqs.findIndex((r) => r.id === id);
  if (reqIdx === -1) return { success: false };

  const req = reqs[reqIdx];
  req.status = 'approved';
  req.reviewedAt = 'Just now';
  saveVIPPurchases(reqs);

  // Upgrade user tier
  const users = getUsers();
  const userIdx = users.findIndex((u) => u.id === req.userId);
  let updatedUser: User | undefined;
  if (userIdx !== -1) {
    users[userIdx].vipTier = req.tierLevel;
    saveUsers(users);
    updatedUser = users[userIdx];
    const current = getCurrentUser();
    if (current?.id === req.userId) {
      setCurrentUser(users[userIdx]);
    }
  }

  // Send approval message to user
  addMessage({
    id: 'vip-appr-' + Date.now(),
    userId: req.userId,
    title: `👑 VIP ${req.tierLevel} Activated!`,
    content: `Your payment of ${formatNaira(req.amount)} for VIP Tier ${req.tierLevel} (${req.tierName}) has been approved! Your earning booster multiplier is now active.`,
    date: 'Just now',
    read: false,
    type: 'vip',
  });

  apiReviewVIPPurchase(id, 'approved');

  return { success: true, user: updatedUser, req };
}

export function rejectVIPPurchase(id: string, reason?: string): { success: boolean; req?: VIPPurchaseRequest } {
  const reqs = getVIPPurchases();
  const reqIdx = reqs.findIndex((r) => r.id === id);
  if (reqIdx === -1) return { success: false };

  const req = reqs[reqIdx];
  req.status = 'rejected';
  req.reviewedAt = 'Just now';
  req.rejectionReason = reason || 'Payment proof verification failed';
  saveVIPPurchases(reqs);

  // Send exact decline message to user dashboard messages
  addMessage({
    id: 'vip-dec-' + Date.now(),
    userId: req.userId,
    title: `VIP Upgrade Status`,
    content: `your vip ativited was declined please try again`,
    date: 'Just now',
    read: false,
    type: 'rejection',
  });

  apiReviewVIPPurchase(id, 'rejected', req.rejectionReason);

  return { success: true, req };
}

