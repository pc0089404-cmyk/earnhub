import React, { useState } from 'react';
import {
  User as UserIcon,
  ShieldCheck,
  Building2,
  Camera,
  Save,
  CheckCircle2,
  ShieldAlert,
  KeyRound,
  Lock,
  Flame,
  Wallet,
  Video,
  Award,
} from 'lucide-react';
import { User } from '../types';
import { NIGERIAN_BANKS, formatNaira } from '../utils/storage';

interface ProfileProps {
  user: User;
  onUpdateUser: (updated: User) => void;
  onOpenPinModal: () => void;
  onNavigate: (tab: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({
  user,
  onUpdateUser,
  onOpenPinModal,
  onNavigate,
}) => {
  const [fullName, setFullName] = useState(user.fullName);
  const [emailOrPhone, setEmailOrPhone] = useState(user.emailOrPhone);
  const [bankName, setBankName] = useState(user.bankDetails?.bankName || NIGERIAN_BANKS[0].name);
  const [accountNumber, setAccountNumber] = useState(user.bankDetails?.accountNumber || '');
  const [accountName, setAccountName] = useState(user.bankDetails?.accountName || user.fullName);
  const [inviteCodeInput, setInviteCodeInput] = useState(user.inviteCode || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(
    user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  );

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setAvatarUrl(url);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInvite = inviteCodeInput.trim().toUpperCase();
    const isNowAdmin = cleanInvite === 'MBKBLOODLINE' || user.isAdminEligible;

    const updated: User = {
      ...user,
      fullName: fullName.trim(),
      emailOrPhone: emailOrPhone.trim(),
      avatarUrl: avatarUrl,
      inviteCode: cleanInvite || undefined,
      isAdminEligible: isNowAdmin,
      bankDetails: {
        bankName,
        accountNumber,
        accountName: accountName.toUpperCase(),
      },
    };

    onUpdateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-purple-950/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img
                src={avatarUrl}
                alt={user.fullName}
                className="h-20 w-20 rounded-3xl object-cover ring-2 ring-pink-500/50 shadow-xl"
              />
              <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-3xl bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="h-6 w-6 text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-['Outfit',sans-serif] text-2xl font-black text-white">{user.fullName}</h1>
                {user.vipTier > 0 && (
                  <span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 text-xs font-black text-amber-300 border border-amber-400/30">
                    VIP {user.vipTier}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{user.emailOrPhone}</p>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="rounded-md bg-pink-500/10 px-2 py-0.5 text-[11px] font-bold text-pink-400 border border-pink-500/20">
                  Earned: {formatNaira(user.totalEarned)}
                </span>
                <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-400 border border-amber-500/20">
                  Balance: {formatNaira(user.totalBalance)}
                </span>
              </div>
            </div>
          </div>

          {/* Admin Button if user is eligible */}
          {user.isAdminEligible ? (
            <button
              id="profile-admin-access-btn"
              onClick={onOpenPinModal}
              className="flex items-center gap-2.5 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 px-5 py-3 text-xs font-black text-amber-300 shadow-xl shadow-amber-500/10 hover:bg-amber-500/30 transition-all"
            >
              <ShieldAlert className="h-4 w-4 text-amber-400 animate-pulse" />
              <span>Enter Admin Control Center (PIN 0913)</span>
            </button>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 text-right">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Status</span>
              <span className="text-xs font-bold text-emerald-400">Verified Creator</span>
            </div>
          )}
        </div>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs text-emerald-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">Profile and payout banking credentials updated successfully!</span>
        </div>
      )}

      {/* Main Form Grid */}
      <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Creator Info Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md space-y-4">
          <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <UserIcon className="h-4 w-4 text-pink-400" />
            Creator Details & Identity
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Full Legal Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3.5 text-xs text-white focus:border-pink-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address / Phone
            </label>
            <input
              type="text"
              required
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3.5 text-xs text-white focus:border-pink-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Invite / Referral Code
            </label>
            <input
              type="text"
              placeholder="Enter invite code if any"
              value={inviteCodeInput}
              onChange={(e) => setInviteCodeInput(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3.5 text-xs text-white uppercase focus:border-pink-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Default Payout Bank Details */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md space-y-4">
          <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Building2 className="h-4 w-4 text-emerald-400" />
            Default Nigerian Bank Settings
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Default Bank
            </label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3.5 text-xs text-white focus:border-pink-500 focus:outline-none"
            >
              {NIGERIAN_BANKS.map((b) => (
                <option key={b.code} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              10-Digit Account Number
            </label>
            <input
              type="text"
              maxLength={10}
              placeholder="e.g. 8123456789"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3.5 text-xs font-mono text-white focus:border-pink-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Bank Account Holder Name
            </label>
            <input
              type="text"
              placeholder="e.g. PRECIOUS JOY ADEBAYO"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3.5 text-xs font-bold uppercase text-white focus:border-pink-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="lg:col-span-2 flex justify-end">
          <button
            id="profile-save-btn"
            type="submit"
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 px-8 py-3.5 text-xs font-black text-white shadow-xl shadow-pink-600/30 hover:from-pink-500 hover:to-rose-500 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>Save Profile & Payout Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
