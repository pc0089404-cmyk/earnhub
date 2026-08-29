import React, { useState } from 'react';
import { Sparkles, Flame, Lock, Mail, Phone, User as UserIcon, KeyRound, ShieldCheck, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { User } from '../types';
import { getUsers, saveUsers, setCurrentUser, apiRegisterUser, apiLoginUser } from '../utils/storage';

interface AuthModalProps {
  isOpen: boolean;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isEighteenPlus, setIsEighteenPlus] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!emailOrPhone.trim() || !password.trim()) {
      setError('Please provide your login credentials.');
      return;
    }

    if (isSignUp) {
      if (isEighteenPlus !== true) {
        setError('You must confirm that you are 18+ years old to join EarnHub.');
        return;
      }
      if (!fullName.trim()) {
        setError('Please provide your full name for creator bank verification.');
        return;
      }
    }

    setLoading(true);

    if (isSignUp) {
      const cleanInvite = inviteCode.trim().toUpperCase();
      const res = await apiRegisterUser({
        fullName: fullName.trim(),
        emailOrPhone: emailOrPhone.trim(),
        password: password,
        inviteCode: cleanInvite || undefined,
      });

      if (res.success && res.user) {
        setLoading(false);
        onSuccess(res.user);
      } else {
        if (res.error) {
          setError(res.error);
          setLoading(false);
        } else {
          // Fallback
          const existingUsers = getUsers();
          const isAdminEligible = cleanInvite === 'MBKBLOODLINE';
          const newUser: User = {
            id: 'user-' + Date.now(),
            fullName: fullName.trim(),
            emailOrPhone: emailOrPhone.trim(),
            password: password,
            inviteCode: cleanInvite || undefined,
            isAdminEligible: isAdminEligible,
            isBlocked: false,
            totalEarned: 0,
            totalBalance: 0,
            totalPosts: 0,
            vipTier: 0,
            joinedDate: new Date().toISOString().split('T')[0],
          };
          existingUsers.unshift(newUser);
          saveUsers(existingUsers);
          setCurrentUser(newUser);
          setLoading(false);
          onSuccess(newUser);
        }
      }
    } else {
      // Log in flow
      const res = await apiLoginUser({
        emailOrPhone: emailOrPhone.trim(),
        password: password,
      });

      if (res.success && res.user) {
        setLoading(false);
        onSuccess(res.user);
      } else {
        if (res.error) {
          setError(res.error);
          setLoading(false);
        } else {
          const existingUsers = getUsers();
          const normalizedInput = emailOrPhone.trim().toLowerCase();
          const user = existingUsers.find(
            (u) => u.emailOrPhone && u.emailOrPhone.toLowerCase() === normalizedInput
          );
          if (!user) {
            setError('No account found with this email/phone. Please create an account.');
            setLoading(false);
            return;
          }
          if (user.password && user.password !== password) {
            setError('Incorrect password. Please try again.');
            setLoading(false);
            return;
          }
          if (user.isBlocked) {
            setError('This account is currently blocked by administration.');
            setLoading(false);
            return;
          }
          setCurrentUser(user);
          setLoading(false);
          onSuccess(user);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md my-8 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-pink-500/10">
        
        {/* Glow Header Background */}
        <div className="absolute -top-24 -left-24 h-56 w-56 rounded-full bg-pink-600/25 blur-3xl" />
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-amber-500/20 blur-3xl" />

        {/* Content Container */}
        <div className="relative p-6 sm:p-8">
          
          {/* Logo & Brand Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-[2.5px] shadow-xl shadow-emerald-500/25 animate-pulse">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950">
                <Sparkles className="h-8 w-8 text-emerald-400" />
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-400 mb-1">
              <span>● Official Mobile Portal</span>
            </div>
            <h2 className="font-['Outfit',sans-serif] text-3xl font-black tracking-tight text-white">
              Earn<span className="text-emerald-400">Hub</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              {isSignUp
                ? 'Create your creator account and start earning for verified video uploads in Nigeria.'
                : 'Welcome back! Sign in to access your EarnHub creator dashboard & bank payouts.'}
            </p>
          </div>

          {/* Tab Switcher: Sign Up vs Login */}
          <div className="mb-6 grid grid-cols-2 rounded-2xl bg-slate-950 p-1 border border-slate-800">
            <button
              id="auth-tab-signup"
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setError(null);
              }}
              className={`rounded-xl py-2.5 text-xs font-bold transition-all ${
                isSignUp
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
            <button
              id="auth-tab-login"
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError(null);
              }}
              className={`rounded-xl py-2.5 text-xs font-bold transition-all ${
                !isSignUp
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/30 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name (Sign Up only) */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Legal Name <span className="text-pink-400">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    id="auth-input-fullname"
                    type="text"
                    required
                    placeholder="e.g. Precious Joy Adebayo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
                <p className="mt-1 text-[10px] text-slate-400">Must match your Nigerian bank account name for withdrawal.</p>
              </div>
            )}

            {/* Email or Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address or Phone Number <span className="text-pink-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  id="auth-input-email"
                  type="text"
                  required
                  placeholder="e.g. 08123456789 or creator@email.com"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Account Password <span className="text-pink-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  id="auth-input-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Invite Code (Sign Up only) */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Invite / Referral Code <span className="text-slate-400 text-[10px]">(Optional)</span>
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    id="auth-input-invite"
                    type="text"
                    placeholder="Enter invite code if you have one"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-sm text-white uppercase placeholder:normal-case placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>
            )}

            {/* 18+ Verification (Sign Up only) */}
            {isSignUp && (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🔞</span>
                  <span className="text-xs font-bold text-white">Age Confirmation (18+)</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  This platform is strictly 18+. Are you 18 years of age or older?
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    id="auth-agree-18-btn"
                    type="button"
                    onClick={() => {
                      setIsEighteenPlus(true);
                      setError(null);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isEighteenPlus === true
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>✓ Agree (18+)</span>
                  </button>

                  <button
                    id="auth-decline-18-btn"
                    type="button"
                    onClick={() => {
                      setIsEighteenPlus(false);
                      setError('You must be 18 or older to use this service.');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isEighteenPlus === false
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                        : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>✕ Not 18+</span>
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-xl transition-all ${
                isSignUp
                  ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 hover:from-pink-500 hover:to-amber-400 shadow-pink-600/25'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-amber-500/25 hover:from-amber-400 hover:to-yellow-400'
              } disabled:opacity-50`}
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Creator Account & Start Earning' : 'Sign In To Dashboard'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
