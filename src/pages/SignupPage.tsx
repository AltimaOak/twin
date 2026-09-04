import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useVehicle } from '../context/VehicleContext';
import type { VehicleCategory } from '../data/vehicleConfigurations';
import { useEffect } from 'react';
import {
  Activity,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Mail,
  Lock,
  User,
  Users,
  Sparkles,
  Gauge,
  Layers
} from 'lucide-react';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, login, setSelectedCategory } = useVehicle();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleAuthMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        const { name: googleName, email: googleEmail } = event.data;
        signup(googleName, googleEmail, 'google-oauth');
        navigate('/select-vehicle');
      }
    };

    window.addEventListener('message', handleAuthMessage);
    return () => window.removeEventListener('message', handleAuthMessage);
  }, [signup, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please agree to the Terms & Conditions to create an account.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      signup(name, email, password);
      navigate('/select-vehicle');
    }, 250);
  };

  const handleQuickDemo = (category: VehicleCategory = 'car') => {
    setSelectedCategory(category);
    login('demo.driver@motomindx.io', 'password123', 'Demo Driver');
    navigate('/dashboard');
  };

  const handleGoogleSignup = () => {
    const width = 500;
    const height = 620;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      '/auth/google?mode=signup',
      'google_auth_popup',
      `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no`
    );

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      navigate('/auth/google?mode=signup');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] via-[#f7f3eb] to-[#ede5d8] text-stone-900 font-sans flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle Background Glow Orbs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-200/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl w-full mx-auto relative z-10">
        {/* Main Split Card: Premium Glassmorphic Studio Container */}
        <div className="bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_-15px_rgba(234,88,12,0.08),0_12px_32px_-4px_rgba(0,0,0,0.04)] overflow-hidden grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Panel: Warm Telematics & Digital Twin Showcase */}
          <div className="bg-gradient-to-b from-[#fffbf5] via-[#fef7ee] to-[#fbf1e3] p-6 sm:p-8 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-orange-100/80 relative overflow-hidden">
            {/* Ambient Corner Flare */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-radial from-orange-400/10 to-transparent blur-2xl pointer-events-none" />

            <div>
              {/* Brand Logo & Live Badge */}
              <div className="flex items-center justify-between">
                <Link to="/" className="inline-flex items-center gap-2.5 group">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#f9570c] to-[#ea580c] flex items-center justify-center text-white shadow-md shadow-orange-500/25 transition-transform duration-200 group-hover:scale-105">
                    <Activity className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span className="text-xl font-bold tracking-tight text-stone-950">
                    MotoMind<span className="text-[#f9570c]">X</span>
                  </span>
                </Link>

                <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[11px] font-semibold text-orange-800">
                  <Sparkles className="w-3 h-3 text-orange-600" />
                  <span>Next-Gen Telemetry</span>
                </div>
              </div>

              {/* Headline & Description */}
              <div className="mt-6 space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight leading-tight">
                  Set up your<br />
                  <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    digital garage.
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-sm">
                  Monitor, diagnose, and maintain your vehicle telemetry in minutes with zero setup friction.
                </p>
              </div>

              {/* Bullet Features with Orange Icon Badges */}
              <div className="mt-5 space-y-2.5">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/70 border border-orange-100/80 shadow-2xs hover:bg-white/90 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#f9570c] shrink-0">
                    <Gauge className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-900 font-semibold block">Cars, bikes, scooters &amp; custom models</span>
                    <span className="text-[11px] text-stone-500">Universal compatibility &amp; easy vehicle profiles</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/70 border border-orange-100/80 shadow-2xs hover:bg-white/90 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#f9570c] shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-900 font-semibold block">Real-time health alerts &amp; warning tips</span>
                    <span className="text-[11px] text-stone-500">Plain-English explanations &amp; fix suggestions</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/70 border border-orange-100/80 shadow-2xs hover:bg-white/90 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#f9570c] shrink-0">
                    <Layers className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-900 font-semibold block">Interactive 3D digital garage preview</span>
                    <span className="text-[11px] text-stone-500">Inspect vehicle components right in your browser</span>
                  </div>
                </div>
              </div>
            </div>


            {/* Bottom Security Note */}
            <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-stone-200/70 border border-stone-300/80 flex items-center justify-center text-stone-600">
                  <ShieldCheck className="w-2.5 h-2.5" />
                </div>
                <span>Compatible with all standard vehicles &amp; smart scanners</span>
              </div>
              <span className="hidden sm:inline-block text-stone-400 text-[10px]">Plug &amp; Play Ready</span>
            </div>
          </div>

          {/* Right Panel: Clean Sign-up Form */}
          <div className="bg-white p-6 sm:p-8 md:p-10 flex flex-col justify-center space-y-3.5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200/80 text-[11px] font-semibold text-orange-800 mb-2">
                <Sparkles className="w-3 h-3 text-orange-600" />
                <span>Instant Account Setup</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight">
                Create an account
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Configure your vehicles and live telemetry in seconds.
              </p>
            </div>

            {/* Google Signup Button */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-stone-200/90 bg-white text-stone-700 text-xs sm:text-sm font-semibold hover:bg-stone-50 hover:border-stone-300 hover:shadow-xs active:scale-[0.99] transition-all cursor-pointer shadow-2xs"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              <span>Sign up with Google</span>
            </button>

            {/* Divider */}
            <div className="relative my-0.5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200/90" />
              </div>
              <div className="relative flex justify-center text-[11px] font-medium text-stone-400">
                <span className="bg-white px-3 tracking-wider uppercase">or register with email</span>
              </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200/90 text-xs text-red-700 shadow-2xs animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="signup-name" className="block text-xs font-semibold text-stone-800 mb-1">
                  Full name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200/90 bg-stone-50/50 text-stone-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-stone-400 shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-xs font-semibold text-stone-800 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200/90 bg-stone-50/50 text-stone-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-stone-400 shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label htmlFor="signup-password" className="block text-xs font-semibold text-stone-800 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="signup-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 chars"
                      required
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-200/90 bg-stone-50/50 text-stone-900 text-xs focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-stone-400 shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-confirm-password" className="block text-xs font-semibold text-stone-800 mb-1">
                    Confirm password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="signup-confirm-password"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      required
                      className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-stone-200/90 bg-stone-50/50 text-stone-900 text-xs focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-stone-400 shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Agree Terms */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  id="signup-agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-[#f9570c] accent-[#f9570c] focus:ring-orange-500 border-stone-300 cursor-pointer"
                />
                <label htmlFor="signup-agreeTerms" className="text-[11px] text-stone-600 select-none cursor-pointer leading-tight">
                  I agree to the{' '}
                  <span className="text-stone-900 font-semibold underline hover:text-orange-600 transition-colors">Terms of Service</span> and{' '}
                  <span className="text-stone-900 font-semibold underline hover:text-orange-600 transition-colors">Privacy Policy</span>.
                </label>
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#f9570c] to-[#ea580c] hover:from-[#ea4e05] hover:to-[#d94806] text-white text-xs sm:text-sm font-semibold shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-70"
              >
                <span>{isLoading ? 'Creating account...' : 'Create Garage Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo Button */}
              <button
                type="button"
                onClick={() => handleQuickDemo('car')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-stone-200/90 bg-stone-50 hover:bg-stone-100/80 text-stone-700 text-xs font-semibold transition-all shadow-2xs hover:shadow-xs active:scale-[0.99] cursor-pointer"
              >
                <Users className="w-4 h-4 text-stone-500" />
                <span>Explore with Demo Account</span>
              </button>
            </form>

            {/* Footer Link */}
            <p className="text-center text-xs text-stone-500 pt-0.5">
              Already have an account?{' '}
              <Link to="/login" className="text-[#f9570c] font-bold hover:underline transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
