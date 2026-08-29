import React, { useState, useRef } from 'react';
import {
  Upload,
  Video,
  CheckCircle2,
  Clock,
  Sparkles,
  Camera,
  Trash2,
  FileVideo,
  Play,
  XCircle,
  Film,
  Zap,
} from 'lucide-react';
import { User, VideoSubmission, VideoItem } from '../types';
import { TASK_DEFINITIONS, formatNaira, addMessage } from '../utils/storage';

interface EarnTasksProps {
  user: User;
  submissions?: VideoSubmission[];
  onUploadComplete: (newSub: VideoSubmission) => void;
  onNavigate: (tab: string) => void;
}

export interface TaskTier {
  id: string;
  count: number;
  label: string;
  badge?: string;
  rewardBase: number;
  durationRequired: string;
  isLongVideo?: boolean;
  minutesLength?: number;
  popular?: boolean;
  mega?: boolean;
}

export const TASK_TIERS: TaskTier[] = [
  {
    id: 'tier-1',
    count: 1,
    label: '1 Video Single',
    rewardBase: 2000,
    durationRequired: 'Min 1:00 min (60s+)',
  },
  {
    id: 'tier-5',
    count: 5,
    label: '5 Videos Task',
    rewardBase: 20000,
    popular: true,
    durationRequired: 'Min 1:00 min each',
  },
  {
    id: 'tier-10',
    count: 10,
    label: '10 Videos Task',
    rewardBase: 30000,
    durationRequired: 'Min 1:00 min each',
  },
  {
    id: 'tier-15',
    count: 15,
    label: '15 Videos Task',
    rewardBase: 37000,
    durationRequired: 'Min 1:00 min each',
  },
  {
    id: 'tier-20',
    count: 20,
    label: '20 Videos Task',
    rewardBase: 50000,
    durationRequired: 'Min 1:00 min each',
  },
  {
    id: 'tier-long-3m',
    count: 1,
    label: '1 Long Video (3 Mins)',
    badge: '₦90,000 Special',
    rewardBase: 90000,
    isLongVideo: true,
    minutesLength: 3,
    mega: true,
    durationRequired: 'Full 3:00 Mins (180s+) High Clear HD',
  },
  {
    id: 'tier-long-5m',
    count: 1,
    label: '1 Long Video (5 Mins)',
    badge: '₦190,000 Special',
    rewardBase: 190000,
    isLongVideo: true,
    minutesLength: 5,
    mega: true,
    durationRequired: 'Full 5:00 Mins (300s+) High Clear HD',
  },
  {
    id: 'tier-long-10m',
    count: 1,
    label: '1 Long Video (10 Mins)',
    badge: '₦290,000 Mega',
    rewardBase: 290000,
    isLongVideo: true,
    minutesLength: 10,
    mega: true,
    durationRequired: 'Full 10:00 Mins (600s+) High Clear HD',
  },
];

export const EarnTasks: React.FC<EarnTasksProps> = ({
  user,
  submissions = [],
  onUploadComplete,
  onNavigate,
}) => {
  const [selectedTierId, setSelectedTierId] = useState<string>('tier-5');
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number>(0);
  const [uploadedVideos, setUploadedVideos] = useState<VideoItem[]>([]);
  const [submissionNotes, setSubmissionNotes] = useState<string>('');
  
  // Feedback modal
  const [showPendingSuccess, setShowPendingSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentTier = TASK_TIERS.find((t) => t.id === selectedTierId) || TASK_TIERS[1];
  const currentTask = TASK_DEFINITIONS[selectedTaskIndex] || TASK_DEFINITIONS[0];

  // Calculate potential payout based on selected tier and VIP multiplier
  const calculateTierReward = (tier: TaskTier) => {
    const vipMultiplier = user.vipTier > 0 ? 1 + user.vipTier * 0.3 : 1.0;
    return Math.round(tier.rewardBase * vipMultiplier);
  };

  const currentEstimatedReward = calculateTierReward(currentTier);

  // Handle multi-video selection from phone/device
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newItems: VideoItem[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const url = URL.createObjectURL(file);
        newItems.push({
          id: 'vid-' + Date.now() + '-' + i + '-' + Math.random().toString(36).substring(2, 6),
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          url: url,
        });
      }

      setUploadedVideos((prev) => {
        const combined = [...prev, ...newItems];
        return combined.slice(0, currentTier.count);
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove individual video if selected accidentally
  const handleRemoveVideo = (idToRemove: string) => {
    setUploadedVideos((prev) => prev.filter((v) => v.id !== idToRemove));
  };

  // Attach sample/demo clip for quick test if user is exploring
  const handleAttachSampleClip = () => {
    const sampleUrls = [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    ];

    const needed = currentTier.count - uploadedVideos.length;
    if (needed <= 0) return;

    const toAdd: VideoItem[] = [];
    for (let i = 0; i < needed; i++) {
      const idx = (uploadedVideos.length + i) % sampleUrls.length;
      toAdd.push({
        id: 'sample-' + Date.now() + '-' + i,
        name: currentTier.isLongVideo
          ? `High_Clear_${currentTier.minutesLength || 3}Min_Recording_${i + 1}.mp4`
          : `Camera_Video_Clip_${uploadedVideos.length + i + 1}.mp4`,
        size: currentTier.isLongVideo ? `${(currentTier.minutesLength || 3) * 22} MB` : '24.5 MB',
        url: sampleUrls[idx],
      });
    }
    setUploadedVideos((prev) => [...prev, ...toAdd]);
  };

  // Final Submit Handler
  const handleSubmitTask = () => {
    if (uploadedVideos.length === 0) return;

    const newSubId = 'sub-' + Date.now();
    const primaryVideoUrl =
      uploadedVideos[0]?.url ||
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    const allVideoUrls = uploadedVideos.map((v) => v.url);

    const taskTitle = currentTier.isLongVideo
      ? `🌟 High Clear ${currentTier.minutesLength || 3}-Minute Master Video`
      : currentTask.title;

    const newSubmission: VideoSubmission = {
      id: newSubId,
      userId: user.id,
      userName: user.fullName || 'Creator',
      taskId: currentTask.id,
      taskTitle: taskTitle,
      videoCount: uploadedVideos.length,
      videoUrl: primaryVideoUrl,
      videoUrls: allVideoUrls,
      videoItems: uploadedVideos,
      fileName:
        uploadedVideos.length === 1
          ? uploadedVideos[0].name
          : `${uploadedVideos.length}_Videos_Batch.zip`,
      fileSize: `${uploadedVideos.length * (currentTier.isLongVideo ? (currentTier.minutesLength || 3) * 22 : 25)} MB`,
      durationSeconds: currentTier.isLongVideo ? (currentTier.minutesLength || 3) * 60 : 70,
      status: 'pending_admin',
      potentialReward: currentEstimatedReward,
      submittedAt:
        'Today at ' +
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes:
        submissionNotes ||
        `${uploadedVideos.length} original video clips submitted for ${currentTier.label} (${currentTier.durationRequired}).`,
    };

    addMessage({
      id: 'msg-' + Date.now(),
      userId: user.id,
      title: `⏳ Task Pending Review (${uploadedVideos.length} Videos)`,
      content: `Your upload for "${taskTitle}" (${uploadedVideos.length} videos) is pending admin approval. Potential reward: ${formatNaira(currentEstimatedReward)}.`,
      date: 'Just now',
      read: false,
      type: 'system',
      amount: currentEstimatedReward,
    });

    onUploadComplete(newSubmission);
    setShowPendingSuccess(true);
    setUploadedVideos([]);
    setSubmissionNotes('');
  };

  const mySubmissions = submissions.filter((s) => s.userId === user.id);

  return (
    <div className="space-y-6 pb-20 max-w-3xl mx-auto">
      {/* SECTION 1: TOP MANDATORY RULES */}
      <div className="rounded-3xl border-2 border-pink-500/40 bg-gradient-to-br from-slate-900 via-rose-950/40 to-slate-950 p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-pink-600 text-white shadow-lg">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Video Verification Rules & Quality Guide
              </h2>
              <p className="text-xs text-pink-300">
                Follow these simple rules so your videos get approved instantly
              </p>
            </div>
          </div>
        </div>

        {/* 4 Big Clear Rules for Everyone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-pink-500/20 text-pink-400 text-sm font-black">
              1
            </span>
            <div className="space-y-1">
              <h4 className="text-xs font-black text-white">Show Your Face Clearly</h4>
              <p className="text-[11px] text-slate-300">
                Keep your real face visible to the camera in good lighting. No face masks or sunglasses.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 text-sm font-black">
              2
            </span>
            <div className="space-y-1">
              <h4 className="text-xs font-black text-white">Bright & Clear Video</h4>
              <p className="text-[11px] text-slate-300">
                Record in bright room lighting or natural light. Make sure your video is clear and sharp.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 text-sm font-black">
              3
            </span>
            <div className="space-y-1">
              <h4 className="text-xs font-black text-white">Required Video Duration</h4>
              <p className="text-[11px] text-slate-300">
                Normal tasks must be over 60 seconds. Long video special tasks must be 3, 5, or 10 full minutes.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 text-sm font-black">
              4
            </span>
            <div className="space-y-1">
              <h4 className="text-xs font-black text-white">100% Real Original Video</h4>
              <p className="text-[11px] text-slate-300">
                Record yourself speaking naturally. Never upload internet clips or fake videos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: CHOOSE CASH REWARD & TASK VOLUME */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl space-y-6">
        {/* Step A: Select Task Tier */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-pink-600 text-white text-xs font-black shadow-md">
                A
              </span>
              <h3 className="text-sm sm:text-base font-black text-white">
                Step 1: Choose Your Task & Cash Reward
              </h3>
            </div>
            <span className="text-xs text-amber-400 font-bold hidden sm:inline">
              Select one package below
            </span>
          </div>

          {/* 6 BIG REWARD CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TASK_TIERS.map((tier) => {
              const isSelected = selectedTierId === tier.id;
              const rewardAmount = calculateTierReward(tier);
              return (
                <button
                  key={tier.id}
                  id={`tier-card-${tier.id}`}
                  type="button"
                  onClick={() => {
                    setSelectedTierId(tier.id);
                    // Trim videos if count exceeds new selection
                    if (uploadedVideos.length > tier.count) {
                      setUploadedVideos((prev) => prev.slice(0, tier.count));
                    }
                  }}
                  className={`relative flex flex-col items-center justify-between rounded-3xl p-4 text-center transition-all border-2 ${
                    isSelected
                      ? 'border-pink-500 bg-gradient-to-b from-pink-500/25 via-slate-900 to-rose-500/15 shadow-xl shadow-pink-500/20 scale-[1.03]'
                      : 'border-slate-800 bg-slate-950/80 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  {/* Badges */}
                  {tier.popular && !isSelected && (
                    <span className="absolute -top-3 rounded-full bg-amber-400 px-2.5 py-0.5 text-[9px] font-black text-slate-950 uppercase shadow-md">
                      🔥 Most Popular
                    </span>
                  )}
                  {tier.mega && !isSelected && (
                    <span className="absolute -top-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2.5 py-0.5 text-[9px] font-black text-white uppercase shadow-md">
                      {tier.badge || '⭐ Long Special'}
                    </span>
                  )}
                  {isSelected && (
                    <span className="absolute -top-3 rounded-full bg-pink-600 px-3 py-0.5 text-[10px] font-black text-white shadow-md">
                      ✓ Selected
                    </span>
                  )}

                  <span className="text-xs font-bold text-slate-300 mt-1">{tier.label}</span>
                  
                  {/* Huge Reward Text */}
                  <div className="my-2 text-lg sm:text-xl font-black text-amber-400">
                    {formatNaira(rewardAmount)}
                  </div>

                  <div className="text-[10px] text-slate-400 font-semibold space-y-0.5">
                    <div>{tier.count} Video{tier.count > 1 ? 's' : ''}</div>
                    <div className="text-slate-500 text-[9px]">{tier.durationRequired}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step B: Select Topic/Category */}
        <div className="pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-pink-600 text-white text-xs font-black shadow-md">
              B
            </span>
            <h3 className="text-sm sm:text-base font-black text-white">
              Step 2: Choose Video Category
            </h3>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {TASK_DEFINITIONS.map((task, idx) => {
              const isActive = selectedTaskIndex === idx;
              return (
                <button
                  key={task.id}
                  onClick={() => setSelectedTaskIndex(idx)}
                  className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/30'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-slate-950/80 text-[10px] font-black">
                    {task.tabNumber}
                  </span>
                  <span>{task.category}</span>
                </button>
              );
            })}
          </div>

          {/* Current Selection Information */}
          <div className="mt-3 rounded-2xl border border-pink-500/30 bg-gradient-to-r from-pink-950/30 via-slate-950 to-slate-950 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-pink-400 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                <span>
                  {currentTier.isLongVideo
                    ? `${currentTier.minutesLength || 3}-Minute High Clear Special Task`
                    : `Task #${currentTask.tabNumber}: ${currentTask.title}`}
                </span>
              </span>
              <span className="text-sm font-black text-amber-400">
                Reward: {formatNaira(currentEstimatedReward)}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentTier.isLongVideo
                ? `High clarity, bright lighting, continuous ${currentTier.minutesLength || 3} full minutes uninterrupted video with face centered throughout. Payout of ${formatNaira(currentTier.rewardBase)} upon review!`
                : currentTask.ruleDescription}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                ⏱️ Duration: {currentTier.durationRequired}
              </span>
              <span className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-1 text-xs font-semibold text-emerald-400">
                📹 Need: {currentTier.count} Video{currentTier.count > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: VIDEO UPLOADER & MANAGEMENT */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-pink-600 text-white text-xs font-black shadow-md">
              C
            </span>
            <h3 className="text-sm sm:text-base font-black text-white">
              Step 3: Select Your {currentTier.count} Video{currentTier.count > 1 ? 's' : ''} from Phone
            </h3>
          </div>
          <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-pink-400 border border-slate-800">
            {uploadedVideos.length} / {currentTier.count} Ready
          </span>
        </div>

        {/* Hidden Multi-file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          multiple={currentTier.count > 1}
          className="hidden"
          onChange={handleFilesSelected}
        />

        {/* Main Phone Picker Zone */}
        <div className="rounded-3xl border-2 border-dashed border-slate-700 bg-slate-950/70 p-6 text-center space-y-4 hover:border-pink-500/60 transition-all">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-500/15 text-pink-400 shadow-inner">
            <Upload className="h-7 w-7 animate-bounce" />
          </div>

          <div>
            <h4 className="text-base font-black text-white">
              {uploadedVideos.length === 0
                ? `Select ${currentTier.count} Video${currentTier.count > 1 ? 's' : ''} from your Phone / Device`
                : uploadedVideos.length < currentTier.count
                ? `Select ${currentTier.count - uploadedVideos.length} more video${
                    currentTier.count - uploadedVideos.length > 1 ? 's' : ''
                  } to complete your ${currentTier.count}-video task`
                : `All ${currentTier.count} Videos Selected! Ready to Submit.`}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              {currentTier.isLongVideo
                ? 'Select 1 high-clear video with 3 full minutes (180s+) recording.'
                : `Select ${currentTier.count} clear videos showing your face (60s+ each).`}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            {uploadedVideos.length < currentTier.count && (
              <button
                type="button"
                id="select-videos-phone-btn"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-3.5 text-xs font-black text-white shadow-lg shadow-pink-600/30 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <FileVideo className="h-4 w-4" />
                <span>
                  {uploadedVideos.length === 0
                    ? `Select ${currentTier.count} Videos from Phone`
                    : `Add Video (${uploadedVideos.length}/${currentTier.count})`}
                </span>
              </button>
            )}

            {/* Test Helper Button */}
            {uploadedVideos.length < currentTier.count && (
              <button
                type="button"
                onClick={handleAttachSampleClip}
                className="flex items-center gap-1.5 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3.5 text-xs font-bold text-slate-300 hover:border-slate-600 hover:text-white"
              >
                <Camera className="h-4 w-4 text-amber-400" />
                <span>Attach Test Video ({currentTier.count - uploadedVideos.length} needed)</span>
              </button>
            )}
          </div>
        </div>

        {/* LIST OF SELECTED VIDEOS WITH PLAY PREVIEW & DEDICATED REMOVE BUTTON */}
        {uploadedVideos.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Selected Videos ({uploadedVideos.length} of {currentTier.count}):
              </h4>
              <button
                type="button"
                onClick={() => setUploadedVideos([])}
                className="text-xs text-rose-400 hover:underline font-semibold"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {uploadedVideos.map((item, idx) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5 space-y-2.5 relative"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-pink-500/20 text-pink-400 text-xs font-black">
                        #{idx + 1}
                      </span>
                      <div className="truncate">
                        <p className="text-xs font-bold text-white truncate">{item.name}</p>
                        <span className="text-[10px] text-slate-400">{item.size} • Clear Video</span>
                      </div>
                    </div>

                    {/* Remove accidental video button */}
                    <button
                      type="button"
                      title="Remove this video"
                      onClick={() => handleRemoveVideo(item.id)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Playable Video Preview */}
                  <div className="overflow-hidden rounded-xl bg-black border border-slate-800">
                    <video
                      src={item.url}
                      controls
                      playsInline
                      className="w-full aspect-video rounded-xl bg-black max-h-36 object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Creator Note */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Creator Note (Optional):
          </label>
          <input
            type="text"
            placeholder="e.g. Good lighting, full face visible throughout the clip"
            value={submissionNotes}
            onChange={(e) => setSubmissionNotes(e.target.value)}
            className="w-full rounded-2xl border border-slate-800 bg-slate-950 py-3 px-4 text-xs text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none"
          />
        </div>

        {/* DONE / SUBMIT BUTTON */}
        <div className="pt-2">
          <button
            id="done-submit-task-btn"
            type="button"
            disabled={uploadedVideos.length === 0}
            onClick={handleSubmitTask}
            className={`w-full flex items-center justify-center gap-2 rounded-2xl py-4 px-6 text-sm font-black transition-all shadow-xl ${
              uploadedVideos.length > 0
                ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 text-white shadow-pink-600/30 hover:scale-[1.01] active:scale-98 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="h-5 w-5" />
            <span>
              {uploadedVideos.length === 0
                ? `Please Select ${currentTier.count} Video${currentTier.count > 1 ? 's' : ''} First`
                : `Done — Submit ${uploadedVideos.length} Video${
                    uploadedVideos.length > 1 ? 's' : ''
                  } for ${formatNaira(currentEstimatedReward)}`}
            </span>
          </button>
        </div>
      </div>

      {/* CONFIRMATION POPUP: SHOWING PENDING REVIEW */}
      {showPendingSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-amber-500/50 bg-slate-900 p-6 sm:p-7 text-center shadow-2xl space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
              <Clock className="h-8 w-8" />
            </div>

            <div>
              <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-black text-amber-300 uppercase tracking-wider">
                Status: Pending Admin Review
              </span>
              <h3 className="mt-2 text-xl font-black text-white">
                Task Submitted Successfully!
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Your video submission is currently pending review by the administrator. Once verified for clear face and lighting, your payout of <strong className="text-amber-400 font-extrabold">{formatNaira(currentEstimatedReward)}</strong> will be credited directly to your balance.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5 text-left text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Task Selected:</span>
                <span className="font-bold text-white">{currentTier.label}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Reward:</span>
                <span className="font-extrabold text-amber-400">{formatNaira(currentEstimatedReward)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Status:</span>
                <span className="font-bold text-amber-400">⏳ Pending Admin Review</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPendingSuccess(false)}
              className="w-full rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 py-3.5 text-xs font-black text-white hover:opacity-90 transition-all"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* SECTION 4: MY TASK HISTORY & STATUSES */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-pink-400" />
            <h3 className="text-sm font-black text-white">
              My Task History & Live Statuses
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {mySubmissions.length} submission{mySubmissions.length !== 1 ? 's' : ''}
          </span>
        </div>

        {mySubmissions.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-center">
            <Video className="h-8 w-8 text-slate-600 mx-auto mb-1.5" />
            <p className="text-xs font-bold text-slate-400">No submissions yet</p>
            <p className="text-[11px] text-slate-500">
              Select your videos above and tap submit to begin earning.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {mySubmissions.map((sub) => (
              <div
                key={sub.id}
                className={`rounded-2xl border p-4 transition-all ${
                  sub.status === 'pending_admin' || sub.status === 'processing'
                    ? 'border-amber-500/40 bg-gradient-to-r from-slate-950 to-amber-950/20'
                    : sub.status === 'approved'
                    ? 'border-emerald-500/40 bg-gradient-to-r from-slate-950 to-emerald-950/20'
                    : 'border-rose-500/40 bg-gradient-to-r from-slate-950 to-rose-950/20'
                }`}
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-white">{sub.taskTitle}</span>
                      <span className="rounded-full bg-pink-500/20 px-2 py-0.5 text-[9px] font-black text-pink-300">
                        {sub.videoCount} Video{sub.videoCount > 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {(sub.status === 'pending_admin' || sub.status === 'processing') && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-black text-amber-300">
                          <Clock className="h-3 w-3" />
                          <span>Pending</span>
                        </span>
                      )}
                      {sub.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-black text-emerald-300">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Approved</span>
                        </span>
                      )}
                      {sub.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 border border-rose-500/40 px-2.5 py-0.5 text-[10px] font-black text-rose-300">
                          <XCircle className="h-3 w-3" />
                          <span>Declined</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Submitted: {sub.submittedAt}</span>
                    <span className="font-bold text-white">
                      {sub.status === 'approved' ? (
                        <span className="text-emerald-400 font-extrabold">
                          +{formatNaira(sub.approvedReward || sub.potentialReward)} Credited
                        </span>
                      ) : sub.status === 'rejected' ? (
                        <span className="text-rose-400 font-bold">₦0 (Declined)</span>
                      ) : (
                        <span className="text-amber-400 font-bold">
                          Potential: {formatNaira(sub.potentialReward)}
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Status explanation */}
                  {(sub.status === 'pending_admin' || sub.status === 'processing') && (
                    <div className="rounded-xl bg-amber-950/30 border border-amber-500/20 p-2.5 text-[11px] text-amber-200">
                      ⏳ <strong>Pending Admin Review:</strong> Your video clips are being checked by the compliance team.
                    </div>
                  )}

                  {sub.status === 'approved' && (
                    <div className="rounded-xl bg-emerald-950/30 border border-emerald-500/20 p-2.5 text-[11px] text-emerald-200">
                      ✅ <strong>Approved & Credited:</strong> Your video passed verification and {formatNaira(sub.approvedReward || sub.potentialReward)} was credited to your available balance!
                    </div>
                  )}

                  {sub.status === 'rejected' && (
                    <div className="rounded-xl bg-rose-950/40 border border-rose-500/30 p-2.5 text-[11px] text-rose-200">
                      ❌ <strong>Declined Notice:</strong> {sub.rejectionReason || 'your videos was declined due not clear and lack of videoing face'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
