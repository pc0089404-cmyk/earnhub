import React, { useState } from 'react';
import { Lock, ShieldAlert, KeyRound, X, ArrowRight, AlertCircle } from 'lucide-react';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (pin === '0913') {
      setPin('');
      onSuccess();
    } else {
      setError('Invalid Administrative PIN. Access denied.');
      setPin('');
    }
  };

  const handleDigitClick = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        if (nextPin === '0913') {
          setTimeout(() => {
            setPin('');
            onSuccess();
          }, 200);
        } else {
          setError('Invalid PIN code. Please try again.');
          setTimeout(() => setPin(''), 500);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-amber-500/40 bg-slate-900 p-6 sm:p-8 shadow-2xl shadow-amber-500/20 text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Lock Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <h3 className="font-['Outfit',sans-serif] text-xl font-black text-white">
          Admin Security Check
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Enter the 4-digit master security PIN to unlock the management console.
        </p>

        {/* Error Alert */}
        {error && (
          <div className="my-4 flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/40 p-2.5 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* PIN Dots Display */}
        <div className="my-6 flex justify-center gap-3">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-xl font-bold transition-all ${
                pin.length > index
                  ? 'border-amber-400 bg-amber-500/20 text-amber-300 scale-105'
                  : 'border-slate-800 bg-slate-950 text-slate-600'
              }`}
            >
              {pin.length > index ? '•' : ''}
            </div>
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                if (k === 'C') {
                  setPin('');
                  setError(null);
                } else if (k === '⌫') {
                  setPin(pin.slice(0, -1));
                } else {
                  handleDigitClick(k);
                }
              }}
              className="rounded-2xl border border-slate-800 bg-slate-950/90 py-3 text-sm font-bold text-white hover:border-amber-500/40 hover:bg-slate-800 active:scale-95 transition-all"
            >
              {k}
            </button>
          ))}
        </div>

        <p className="text-[10px] text-slate-500">
          Only authorized staff with bloodline credentials may enter.
        </p>
      </div>
    </div>
  );
};
