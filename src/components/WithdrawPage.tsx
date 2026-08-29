import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Clock,
  Lock,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  RotateCcw,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { User, WithdrawalRequest } from '../types';
import { NIGERIAN_BANKS, formatNaira, addMessage } from '../utils/storage';

interface WithdrawPageProps {
  user: User;
  withdrawals: WithdrawalRequest[];
  onWithdrawSuccess: (newReq: WithdrawalRequest, updatedBalance: number) => void;
  onNavigate: (tab: string) => void;
}

export const WithdrawPage: React.FC<WithdrawPageProps> = ({
  user,
  withdrawals,
  onWithdrawSuccess,
  onNavigate,
}) => {
  const [selectedBank, setSelectedBank] = useState<string>(
    user.bankDetails?.bankName || NIGERIAN_BANKS[0].name
  );
  const [accountNumber, setAccountNumber] = useState<string>(
    user.bankDetails?.accountNumber || ''
  );
  const [accountName, setAccountName] = useState<string>(
    user.bankDetails?.accountName || user.fullName || ''
  );
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isVerifyingAccount, setIsVerifyingAccount] = useState<boolean>(false);
  const [simulatedWindowOpen, setSimulatedWindowOpen] = useState<boolean>(false);

  // Check if current real time is Sunday between 6:00 PM (18:00) and 12:00 PM (midnight / 23:59:59)
  const isRealSundayWindow = () => {
    const now = new Date();
    const isSunday = now.getDay() === 0;
    const hour = now.getHours();
    return isSunday && hour >= 18 && hour <= 23;
  };

  const isWindowActive = simulatedWindowOpen || isRealSundayWindow();

  // Calculate Next Sunday 6:00 PM countdown
  const [timeUntilSunday, setTimeUntilSunday] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 2, hours: 14, minutes: 30, seconds: 45 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextSunday = new Date(now);
      const day = now.getDay();
      const diff = (7 - day) % 7; // days to next sunday
      nextSunday.setDate(now.getDate() + (diff === 0 && now.getHours() >= 18 ? 7 : diff));
      nextSunday.setHours(18, 0, 0, 0); // 6:00 PM

      const deltaMs = nextSunday.getTime() - now.getTime();
      if (deltaMs > 0) {
        const days = Math.floor(deltaMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((deltaMs / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((deltaMs / (1000 * 60)) % 60);
        const seconds = Math.floor((deltaMs / 1000) % 60);
        setTimeUntilSunday({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setAccountNumber(val);

    if (val.length === 10) {
      setIsVerifyingAccount(true);
      setTimeout(() => {
        setIsVerifyingAccount(false);
        if (!accountName || accountName.trim() === '') {
          setAccountName((user.fullName || 'VERIFIED CREATOR').toUpperCase());
        }
      }, 500);
    }
  };

  const handleAmountQuickPick = (percentage: number) => {
    if (!isWindowActive) return;
    const calculated = Math.floor(user.totalBalance * (percentage / 100));
    setAmount(calculated.toString());
  };

  const handleSubmitWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!isWindowActive) {
      setError('Withdrawals are locked. Payouts open strictly on Sunday from 6:00 PM to 12:00 AM (Midnight).');
      return;
    }

    const withdrawAmt = Number(amount);

    if (isNaN(withdrawAmt) || withdrawAmt <= 0) {
      setError('Please enter a valid amount to withdraw.');
      return;
    }

    if (withdrawAmt < 5000) {
      setError('Minimum withdrawal threshold is ₦5,000.');
      return;
    }

    if (withdrawAmt > user.totalBalance) {
      setError(`Insufficient balance. Your available balance is ${formatNaira(user.totalBalance)}.`);
      return;
    }

    if (accountNumber.length !== 10) {
      setError('Please provide a valid 10-digit Nigerian NUBAN account number.');
      return;
    }

    if (!accountName.trim()) {
      setError('Please enter the verified bank account holder name.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newReq: WithdrawalRequest = {
        id: 'wd-' + Date.now(),
        userId: user.id,
        userName: user.fullName,
        bankName: selectedBank,
        accountNumber: accountNumber,
        accountName: accountName.toUpperCase(),
        amount: withdrawAmt,
        fee: 0,
        netAmount: withdrawAmt,
        status: 'queued_sunday',
        requestedAt: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        scheduledDisbursement: 'Sunday 6:00 PM - 12:00 AM Window',
      };

      const updatedBalance = user.totalBalance - withdrawAmt;

      // Add system message
      addMessage({
        id: 'msg-' + Date.now(),
        userId: user.id,
        title: `💳 Withdrawal Queued: ${formatNaira(withdrawAmt)}`,
        content: `Your withdrawal of ${formatNaira(withdrawAmt)} to ${selectedBank} (${accountNumber}) has been submitted for Sunday 6:00 PM - 12:00 AM disbursement.`,
        date: 'Just now',
        read: false,
        type: 'payout',
        amount: withdrawAmt,
      });

      setLoading(false);
      setSuccessMsg(
        `Withdrawal of ${formatNaira(withdrawAmt)} successfully processed! Funds will disburse during the Sunday 6:00 PM - 12:00 AM window to ${accountName} (${selectedBank}).`
      );
      setAmount('');
      onWithdrawSuccess(newReq, updatedBalance);
    }, 800);
  };

  const userWithdrawals = withdrawals.filter((w) => w.userId === user.id);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Sunday 6:00 PM - 12:00 AM Lock Alert */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400">
              <Lock className="h-3.5 w-3.5" />
              <span>Sunday Payout Window (6:00 PM - 12:00 AM)</span>
            </div>
            <h2 className="font-['Outfit',sans-serif] text-2xl font-black text-white">
              Withdrawals Strictly Open on Sunday 6:00 PM - 12:00 AM
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Creator bank withdrawals are locked during the week and only open <strong className="text-amber-400">Sundays between 6:00 PM and 12:00 AM (Midnight)</strong> for direct Nigerian bank disbursals.
            </p>

            {/* Test Simulation Toggle */}
            <div className="pt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSimulatedWindowOpen(!simulatedWindowOpen)}
                className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-all ${
                  isWindowActive
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                {isWindowActive ? '🟢 Sunday 6PM-12AM Window: OPEN' : '🔴 Sunday Window: LOCKED (Click to test)'}
              </button>
            </div>
          </div>

          {/* Countdown Clock Box */}
          <div className="rounded-2xl border border-amber-500/30 bg-slate-950/80 p-4 text-center shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80">
              Next Sunday 6:00 PM Window In:
            </span>
            <div className="mt-2 grid grid-cols-4 gap-2 text-center">
              <div className="rounded-xl bg-slate-900 p-2 border border-slate-800">
                <span className="block font-['Outfit',sans-serif] text-xl font-extrabold text-white">
                  {timeUntilSunday.days}
                </span>
                <span className="text-[9px] text-slate-400 uppercase">Days</span>
              </div>
              <div className="rounded-xl bg-slate-900 p-2 border border-slate-800">
                <span className="block font-['Outfit',sans-serif] text-xl font-extrabold text-white">
                  {timeUntilSunday.hours}
                </span>
                <span className="text-[9px] text-slate-400 uppercase">Hours</span>
              </div>
              <div className="rounded-xl bg-slate-900 p-2 border border-slate-800">
                <span className="block font-['Outfit',sans-serif] text-xl font-extrabold text-white">
                  {timeUntilSunday.minutes}
                </span>
                <span className="text-[9px] text-slate-400 uppercase">Mins</span>
              </div>
              <div className="rounded-xl bg-slate-900 p-2 border border-slate-800">
                <span className="block font-['Outfit',sans-serif] text-xl font-extrabold text-pink-500">
                  {timeUntilSunday.seconds}
                </span>
                <span className="text-[9px] text-slate-400 uppercase">Secs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form on Left, Balance & Bank Ticker on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Withdrawal Form */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div>
              <h3 className="font-['Outfit',sans-serif] text-xl font-bold text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-pink-400" />
                Nigerian Bank Transfer Payout
              </h3>
              <p className="text-xs text-slate-400">Direct NUBAN disbursement via NIBSS / Interswitch</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-semibold">Available Balance</span>
              <span className="text-lg font-black text-amber-400">{formatNaira(user.totalBalance)}</span>
            </div>
          </div>

          {!isWindowActive && (
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-amber-500/40 bg-amber-950/30 p-4 text-xs text-amber-200">
              <Lock className="h-5 w-5 text-amber-400 shrink-0" />
              <div>
                <strong className="block font-bold text-amber-300 mb-0.5">🔒 Payout Window Locked</strong>
                <span>Withdrawals are locked until Sunday 6:00 PM to 12:00 AM (Midnight). You cannot initiate transfers outside this window.</span>
              </div>
            </div>
          )}

          {/* Success / Error Alerts */}
          {successMsg && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs text-emerald-200">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-emerald-300 mb-0.5">Withdrawal Queued!</strong>
                <span>{successMsg}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 text-xs text-rose-200">
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmitWithdrawal} className="space-y-5">
            
            {/* Bank Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Select Destination Bank / Fintech <span className="text-pink-400">*</span>
              </label>
              <select
                id="withdraw-bank-select"
                disabled={!isWindowActive}
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 py-3.5 px-4 text-sm font-semibold text-white focus:border-pink-500 focus:outline-none disabled:opacity-50"
              >
                {NIGERIAN_BANKS.map((b) => (
                  <option key={b.code} value={b.name}>
                    {b.name} {b.popular ? '⚡ (Fast Instant)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Account Number */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  10-Digit NUBAN Account Number <span className="text-pink-400">*</span>
                </label>
                {isVerifyingAccount && (
                  <span className="text-[10px] text-amber-400 flex items-center gap-1 animate-pulse">
                    <RotateCcw className="h-3 w-3 animate-spin" /> Resolving NUBAN...
                  </span>
                )}
              </div>
              <input
                id="withdraw-account-number"
                type="text"
                disabled={!isWindowActive}
                maxLength={10}
                required
                placeholder="e.g. 8123456789 (PalmPay / OPay / UBA)"
                value={accountNumber}
                onChange={handleAccountNumberChange}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 py-3.5 px-4 text-sm font-mono tracking-wider text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none disabled:opacity-50"
              />
            </div>

            {/* Account Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Account Holder Name <span className="text-pink-400">*</span>
              </label>
              <input
                id="withdraw-account-name"
                type="text"
                disabled={!isWindowActive}
                required
                placeholder="e.g. PRECIOUS JOY ADEBAYO"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 py-3.5 px-4 text-sm font-bold uppercase text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none disabled:opacity-50"
              />
            </div>

            {/* Amount */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Amount to Withdraw (NGN) <span className="text-pink-400">*</span>
                </label>
                <span className="text-[11px] text-slate-400">Min: ₦5,000</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-3.5 font-bold text-slate-500">₦</span>
                <input
                  id="withdraw-amount"
                  type="number"
                  disabled={!isWindowActive}
                  required
                  min="5000"
                  step="1000"
                  placeholder="20000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 py-3.5 pl-8 pr-4 text-sm font-black text-amber-400 placeholder-slate-600 focus:border-pink-500 focus:outline-none disabled:opacity-50"
                />
              </div>

              {/* Quick Pick Buttons */}
              <div className="mt-2.5 flex items-center gap-2">
                <span className="text-[11px] text-slate-500">Quick:</span>
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    disabled={!isWindowActive}
                    onClick={() => handleAmountQuickPick(pct)}
                    className="rounded-lg bg-slate-950 px-2.5 py-1 text-[11px] font-bold text-slate-400 border border-slate-800 hover:border-pink-500/50 hover:text-pink-400 transition-colors disabled:opacity-40"
                  >
                    {pct}% {pct === 100 ? '(All)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-800">
              <button
                id="withdraw-submit-btn"
                type="submit"
                disabled={!isWindowActive || loading || user.totalBalance < 5000}
                className={`w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black text-white shadow-xl transition-all ${
                  isWindowActive
                    ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 shadow-pink-600/30 hover:from-pink-500 hover:to-amber-400'
                    : 'bg-slate-800 border border-slate-700 text-slate-400 cursor-not-allowed'
                } disabled:opacity-50`}
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>
                      {!isWindowActive
                        ? '🔒 Payout Locked (Sunday 6:00 PM - 12:00 AM Only)'
                        : user.totalBalance < 5000
                        ? 'Insufficient Balance (Min ₦5,000)'
                        : 'Submit Withdrawal (Sunday 6PM-12AM)'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Supported Banks Pill List & Payout Rules */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md">
            <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-3 flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              <span>Supported Nigerian Banks</span>
            </h4>
            <div className="space-y-2">
              {NIGERIAN_BANKS.slice(0, 7).map((b) => (
                <div
                  key={b.code}
                  className="flex items-center justify-between rounded-xl bg-slate-950 p-2.5 border border-slate-800/80 text-xs"
                >
                  <span className="font-semibold text-slate-300">{b.name}</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    Direct
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              <span>Payout Security Rules</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero hidden deduction fees on all creator payouts.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Account name must strictly match your registered creator identity.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Instant SMS & App notification sent immediately upon disbursement.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Withdrawal History Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md">
        <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-amber-400" />
          Your Withdrawal Request History
        </h3>

        {userWithdrawals.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-8 text-center">
            <Wallet className="h-10 w-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-400">No withdrawal requests yet</p>
            <p className="text-xs text-slate-500 mt-1">Complete creator tasks to earn and submit payout requests.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Bank & Account</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Scheduled Window</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {userWithdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-950/40">
                    <td className="py-3.5 px-4 text-slate-300 font-medium">{w.requestedAt}</td>
                    <td className="py-3.5 px-4 text-slate-200">
                      <span className="font-bold">{w.bankName}</span>
                      <span className="block text-[10px] text-slate-400 font-mono">{w.accountNumber} • {w.accountName}</span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-amber-400 text-sm">{formatNaira(w.amount)}</td>
                    <td className="py-3.5 px-4 text-slate-400">{w.scheduledDisbursement}</td>
                    <td className="py-3.5 px-4 text-right">
                      {w.status === 'queued_sunday' && (
                        <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-amber-300 border border-amber-500/20 inline-flex items-center gap-1">
                          <Lock className="h-3 w-3" /> Queued (Sunday 7PM)
                        </span>
                      )}
                      {w.status === 'completed' && (
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300 border border-emerald-500/20">
                          ✓ Paid to Bank
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
