import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useVehicle } from '../context/VehicleContext';

export const GoogleAuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signup, login } = useVehicle();

  const mode = searchParams.get('mode') || 'signup';

  const [step, setStep] = useState<'email' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Enter an email or phone number');
      return;
    }

    if (!email.includes('@')) {
      setError('Couldn’t find your Google Account. Please enter a valid email.');
      return;
    }

    // Auto-generate realistic display name from email (e.g. alex.mercer -> Alex Mercer)
    const emailUser = email.split('@')[0];
    const formattedName = emailUser
      .split(/[._-]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    setName(formattedName || 'Google User');

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('password');
    }, 400);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Enter a password');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // If opened in a popup window by opener
      if (window.opener && !window.opener.closed) {
        try {
          window.opener.postMessage(
            {
              type: 'GOOGLE_AUTH_SUCCESS',
              name: name || 'Google User',
              email: email.trim(),
              mode
            },
            '*'
          );
          window.close();
          return;
        } catch (_err) {
          // Fallback if cross-origin or opener postMessage fails
        }
      }

      // If standalone window or fallback
      if (mode === 'signup') {
        signup(name, email, 'google-oauth');
        navigate('/select-vehicle');
      } else {
        login(email, 'google-oauth', name);
        navigate('/dashboard');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-[#1f1f1f] font-sans flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Google Card Container */}
      <div className="w-full max-w-[448px] bg-white rounded-3xl p-8 sm:p-10 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] relative overflow-hidden border border-stone-200/40">
        
        {/* Animated Google Progress Bar */}
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#d3e3fd] overflow-hidden">
            <div className="h-full bg-[#1a73e8] animate-[indeterminate_1.5s_infinite_linear] origin-left w-full" />
          </div>
        )}

        {/* Google Multi-Color G Logo */}
        <div className="flex justify-start">
          <svg className="w-10 h-10" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        </div>

        {/* Step 1: Enter Email / Phone */}
        {step === 'email' && (
          <div className="mt-4 space-y-6">
            <div>
              <h1 className="text-2xl font-normal text-[#1f1f1f] tracking-tight">
                {mode === 'signup' ? 'Create a Google Account' : 'Sign in'}
              </h1>
              <p className="text-base text-[#444746] mt-1.5 font-normal">
                to continue to <span className="font-medium text-[#1f1f1f]">MotoMindX</span>
              </p>
            </div>

            <form onSubmit={handleEmailNext} className="space-y-6">
              <div>
                <div className="relative">
                  <input
                    type="text"
                    id="google-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email or phone"
                    className={`w-full px-4 py-3.5 text-base rounded-lg border ${
                      error ? 'border-[#d93025]' : 'border-[#747775]'
                    } focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition-all bg-transparent`}
                    autoFocus
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-[#d93025] font-normal">
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}
                <div className="mt-2.5">
                  <button
                    type="button"
                    onClick={() => setEmail('alex.mercer@gmail.com')}
                    className="text-xs text-[#0b57d0] font-semibold hover:underline"
                  >
                    Forgot email?
                  </button>
                </div>
              </div>

              <div className="text-xs text-[#444746] leading-relaxed">
                Not your computer? Use Guest mode to sign in privately.{' '}
                <span className="text-[#0b57d0] font-medium hover:underline cursor-pointer">
                  Learn more
                </span>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (window.opener) {
                      window.close();
                    } else {
                      navigate(mode === 'signup' ? '/signup' : '/login');
                    }
                  }}
                  className="text-sm font-semibold text-[#0b57d0] hover:bg-[#ebf3fe] px-4 py-2.5 rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#0b57d0] hover:bg-[#0842a0] text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-70"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Enter Password */}
        {step === 'password' && (
          <div className="mt-4 space-y-6">
            <div>
              <h1 className="text-2xl font-normal text-[#1f1f1f] tracking-tight">
                Welcome
              </h1>
              {/* Account Pill with Back Option */}
              <button
                type="button"
                onClick={() => setStep('email')}
                className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full border border-[#747775]/40 hover:bg-stone-50 text-xs text-[#444746] transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-[#0b57d0] text-white flex items-center justify-center font-bold text-[10px]">
                  {name.charAt(0) || 'U'}
                </div>
                <span className="font-medium text-[#1f1f1f]">{email}</span>
                <svg className="w-3.5 h-3.5 text-[#747775]" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M7 10l5 5 5-5z" />
                </svg>
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="google-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`w-full px-4 py-3.5 text-base rounded-lg border ${
                      error ? 'border-[#d93025]' : 'border-[#747775]'
                    } focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition-all bg-transparent`}
                    autoFocus
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-[#d93025] font-normal">
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="show-pass"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="w-4 h-4 text-[#0b57d0] border-[#747775] rounded focus:ring-[#0b57d0]"
                  />
                  <label htmlFor="show-pass" className="text-xs text-[#1f1f1f] select-none cursor-pointer">
                    Show password
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-sm font-semibold text-[#0b57d0] hover:bg-[#ebf3fe] px-4 py-2.5 rounded-full transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#0b57d0] hover:bg-[#0842a0] text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-70"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Google Footer */}
      <div className="w-full max-w-[448px] mt-4 px-4 flex items-center justify-between text-xs text-[#747775]">
        <div>English (United States)</div>
        <div className="flex items-center gap-4">
          <span className="hover:text-[#1f1f1f] cursor-pointer">Help</span>
          <span className="hover:text-[#1f1f1f] cursor-pointer">Privacy</span>
          <span className="hover:text-[#1f1f1f] cursor-pointer">Terms</span>
        </div>
      </div>
    </div>
  );
};
