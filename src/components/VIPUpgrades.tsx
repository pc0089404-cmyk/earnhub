import React, { useState } from 'react';
import {
  Crown,
  Check,
  ArrowRight,
  ArrowLeft,
  Copy,
  CheckCircle2,
  Upload,
  Sparkles,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { User, VIPTier } from '../types';
import { VIP_TIERS, formatNaira } from '../utils/storage';

interface VIPUpgradesProps {
  user: User;
  onUpgradeTier: (newTier: number) => void;
  onSubmitVIPPurchase?: (tierLevel: number, amount: number, screenshotUrl: string) => void;
  onNavigate: (tab: string) => void;
}

export const VIPUpgrades: React.FC<VIPUpgradesProps> = ({
  user,
  onUpgradeTier,
  onSubmitVIPPurchase,
  onNavigate,
}) => {
  const [selectedTierForPayment, setSelectedTierForPayment] = useState<VIPTier | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotFileName, setScreenshotFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('9130619144');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image screenshot (PNG, JPG, JPEG).');
      return;
    }

    setScreenshotFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTierForPayment) return;

    if (!screenshotPreview) {
      setUploadError('Please upload a screenshot proof of your transfer.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      if (onSubmitVIPPurchase) {
        onSubmitVIPPurchase(
          selectedTierForPayment.level,
          selectedTierForPayment.priceNgn,
          screenshotPreview
        );
      }
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 900);
  };

  // If a VIP Tier is selected, render the dedicated payment page
  if (selectedTierForPayment) {
    return (
      <div className="space-y-4 pb-20 max-w-md mx-auto">
        {/* Back Button */}
        <button
          onClick={() => {
            setSelectedTierForPayment(null);
            setScreenshotPreview(null);
            setSubmitSuccess(false);
            setUploadError(null);
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to VIP Plans</span>
        </button>

        {submitSuccess ? (
          <div className="rounded-3xl border border-emerald-500/50 bg-slate-900/90 p-6 text-center shadow-2xl space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <h2 className="font-['Outfit',sans-serif] text-xl font-bold text-white">
                Payment Screenshot Submitted!
              </h2>
              <p className="text-xs text-slate-300 mt-2">
                Your payment proof for <span className="font-bold text-amber-400">{selectedTierForPayment.name}</span> ({formatNaira(selectedTierForPayment.priceNgn)}) has been submitted to Admin.
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Once reviewed and verified, your VIP tier will be activated immediately.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setSelectedTierForPayment(null);
                  setSubmitSuccess(false);
                  onNavigate('dashboard');
                }}
                className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 py-3 text-xs font-bold text-white shadow-lg"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-amber-500/40 bg-slate-900/90 p-6 shadow-2xl space-y-5">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold text-amber-400">
                <Crown className="h-3.5 w-3.5" />
                <span>VIP Upgrade Payment</span>
              </div>
              <h2 className="font-['Outfit',sans-serif] text-2xl font-black text-white">
                {selectedTierForPayment.name}
              </h2>
              <p className="text-xs text-slate-300">
                Transfer the exact amount below to activate your VIP booster.
              </p>
            </div>

            {/* Amount to Pay */}
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-900 p-4 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Amount to Pay
              </span>
              <div className="text-3xl font-black text-amber-400 font-['Outfit',sans-serif] mt-0.5">
                {formatNaira(selectedTierForPayment.priceNgn)}
              </div>
              <span className="text-[10px] text-pink-400 font-semibold">
                {selectedTierForPayment.multiplier}x Multiplier Boost
              </span>
            </div>

            {/* Bank Details Box */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <span className="text-xs text-slate-400">Bank Name</span>
                <span className="text-sm font-bold text-purple-400">PalmPay</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Account Number</span>
                  <span className="text-base font-mono font-black text-white tracking-wider">
                    9130619144
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-700 active:scale-95 transition-all"
                >
                  {copiedAccount ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Upload Screenshot Form */}
            <form onSubmit={handleSubmitProof} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white mb-2">
                  Upload Payment Screenshot:
                </label>

                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="vip-screenshot-upload"
                  />
                  <label
                    htmlFor="vip-screenshot-upload"
                    className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center cursor-pointer transition-all ${
                      screenshotPreview
                        ? 'border-emerald-500 bg-emerald-950/20'
                        : 'border-slate-700 bg-slate-950/60 hover:border-pink-500/60'
                    }`}
                  >
                    {screenshotPreview ? (
                      <div className="space-y-2">
                        <img
                          src={screenshotPreview}
                          alt="Screenshot Proof Preview"
                          className="h-36 max-w-full rounded-xl object-contain mx-auto border border-emerald-500/40"
                        />
                        <p className="text-[11px] font-bold text-emerald-400">
                          ✓ {screenshotFileName || 'Screenshot Selected'} (Tap to change)
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 mb-2">
                          <Upload className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-bold text-white">
                          Tap to select or take transfer screenshot
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          PNG, JPG, or JPEG transfer receipt
                        </p>
                      </>
                    )}
                  </label>
                </div>

                {uploadError && (
                  <p className="text-[11px] font-semibold text-rose-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{uploadError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 py-3 text-xs font-black text-white shadow-lg shadow-pink-600/30 hover:from-pink-500 hover:to-rose-500 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting Screenshot...</span>
                ) : (
                  <>
                    <span>Submit Payment Screenshot</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/40 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400">
              <Crown className="h-3.5 w-3.5" />
              <span>VIP Creator Accelerators</span>
            </div>
            <h1 className="font-['Outfit',sans-serif] text-2xl sm:text-4xl font-black text-white">
              Upgrade to VIP & Boost Payouts Up to <span className="text-amber-400">5.0x</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Unlock prioritized same-day video task approvals, higher payout multipliers, direct WhatsApp account management, and exclusive creator content.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-slate-950/80 p-4 text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400">Current Creator Status</span>
            <div className="text-xl font-black text-amber-400 mt-1">
              {user.vipTier > 0 ? `Active VIP Tier ${user.vipTier}` : 'Standard Free Tier'}
            </div>
            <span className="text-[11px] text-pink-400 font-semibold">
              {user.vipTier > 0 ? `${VIP_TIERS[user.vipTier - 1]?.multiplier}x Active Multiplier` : '1.0x Base Payouts'}
            </span>
          </div>
        </div>
      </div>

      {/* 10 VIP Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {VIP_TIERS.map((tier) => {
          const isCurrent = user.vipTier === tier.level;
          const isPopular = tier.level === 2 || tier.level === 5;

          return (
            <div
              key={tier.level}
              className={`relative flex flex-col justify-between rounded-3xl border p-6 transition-all backdrop-blur-md ${
                isCurrent
                  ? 'border-amber-400 bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 shadow-xl shadow-amber-500/20'
                  : 'border-slate-800 bg-slate-900/70 hover:border-pink-500/40'
              }`}
            >
              {/* Popular / Active Badge */}
              {isCurrent && (
                <span className="absolute -top-3 left-6 rounded-full bg-amber-400 px-3 py-0.5 text-[10px] font-black text-slate-950 uppercase tracking-wider">
                  ✓ Your Current Tier
                </span>
              )}
              {!isCurrent && isPopular && (
                <span className="absolute -top-3 left-6 rounded-full bg-pink-600 px-3 py-0.5 text-[10px] font-black text-white uppercase tracking-wider">
                  🔥 Most Popular
                </span>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                    VIP Tier {tier.level}
                  </span>
                  <span className="rounded-full bg-amber-400/10 px-2.5 py-0.5 text-xs font-black text-amber-300 border border-amber-400/20">
                    {tier.multiplier}x Multiplier
                  </span>
                </div>

                <h3 className="font-['Outfit',sans-serif] text-xl font-extrabold text-white mt-2">
                  {tier.name}
                </h3>

                <div className="my-4">
                  <div className="text-3xl font-black text-white">
                    {formatNaira(tier.priceNgn)}
                  </div>
                  <span className="text-xs text-slate-400">Per 1 Month Access</span>
                </div>

                {/* Features List */}
                <ul className="space-y-2.5 pt-3 border-t border-slate-800 text-xs text-slate-300">
                  {tier.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Upgrade Button */}
              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  disabled={isCurrent}
                  onClick={() => setSelectedTierForPayment(tier)}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black transition-all ${
                    isCurrent
                      ? 'bg-slate-800 text-slate-400 cursor-default'
                      : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/30 hover:from-pink-500 hover:to-rose-500 active:scale-95'
                  }`}
                >
                  {isCurrent ? (
                    <span>Current Active Plan</span>
                  ) : (
                    <>
                      <span>Upgrade to VIP {tier.level} ({formatNaira(tier.priceNgn)})</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
