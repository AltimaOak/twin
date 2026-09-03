import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useVehicle } from '../context/VehicleContext';
import type { VehicleCategory } from '../data/vehicleConfigurations';
import {
  Activity,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Mail,
  Lock,
  Users
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, setSelectedCategory } = useVehicle();

  const [email, setEmail] = useState('demo.driver@motomindx.io');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(email, password);
      navigate('/dashboard');
    }, 250);
  };

  const handleQuickDemo = (category: VehicleCategory = 'car') => {
    setSelectedCategory(category);
    login('demo.driver@motomindx.io', 'password123', 'Demo Driver');
    navigate('/dashboard');
  };

  const handleGoogleLogin = () => {
    login('google.user@motomindx.io', 'google-auth', 'Alex Mercer');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 font-sans flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-4xl w-full mx-auto">
        {/* Main Split Card */}
        <div className="bg-white border border-stone-200/90 rounded-3xl sm:rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left Panel: Warm Cream Telematics & Digital Twin */}
          <div className="bg-[#fef9f3] p-8 sm:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200/60 relative">
            <div>
              {/* Brand Logo */}
              <Link to="/" className="inline-flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-xl bg-[#f9570c] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                  <Activity className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="text-xl font-bold tracking-tight text-stone-900">
                  MotoMind<span className="text-[#f9570c]">X</span>
                </span>
              </Link>

              {/* Headline & Description */}
              <div className="mt-8 space-y-2.5">
                <h2 className="text-2xl sm:text-[28px] font-bold text-stone-950 tracking-tight leading-snug">
                  Real-time telematics<br />&amp; 3D digital twins.
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Stream sensor channels, diagnose vehicle fault codes, and inspect sub-assemblies all in one workspace.
                </p>
              </div>

              {/* Bullet Features with Orange Icon Badges */}
              <div className="mt-6 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-orange-100/80 border border-orange-200/90 flex items-center justify-center text-[#f9570c] shrink-0">
                    <Activity className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span className="text-xs text-stone-700 font-medium">
                    High-frequency CAN-bus streaming
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-orange-100/80 border border-orange-200/90 flex items-center justify-center text-[#f9570c] shrink-0">
                    <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span className="text-xs text-stone-700 font-medium">
                    Interactive 3D subsystem inspection
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-orange-100/80 border border-orange-200/90 flex items-center justify-center text-[#f9570c] shrink-0">
                    <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span className="text-xs text-stone-700 font-medium">
                    Standard OBD-II hardware support
                  </span>
                </div>
              </div>
            </div>

            {/* Car Wireframe Line-Art Illustration (visible on tablet/desktop) */}
            <div className="my-6 hidden md:flex items-center justify-center">
              <img
                src="/images/car_wireframe_telematics.jpg"
                alt="3D Digital Twin Vehicle Wireframe"
                className="w-full max-w-[340px] h-auto object-contain mix-blend-multiply drop-shadow-xs"
              />
            </div>

            {/* Bottom Security Note */}
            <div className="pt-3 border-t border-stone-200/50 hidden md:flex items-center gap-2 text-xs text-stone-500 font-medium">
              <div className="w-4 h-4 rounded-full border border-stone-300 flex items-center justify-center text-stone-500">
                <ShieldCheck className="w-3 h-3" />
              </div>
              <span>Encrypted local session • ISO 15765-4</span>
            </div>
          </div>

          {/* Right Panel: Clean White Sign-in Form */}
          <div className="bg-white p-6 sm:p-10 flex flex-col justify-center space-y-4 sm:space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-stone-950 tracking-tight">
                Welcome back
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Sign in to your garage and telemetry workspace.
              </p>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-stone-200/90 bg-white text-stone-700 text-xs sm:text-sm font-medium hover:bg-stone-50 hover:border-stone-300 transition-colors shadow-xs"
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
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200/80" />
              </div>
              <div className="relative flex justify-center text-xs text-stone-400">
                <span className="bg-white px-3">or continue with email</span>
              </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-xs font-semibold text-stone-800 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="demo.driver@motomindx.io"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200/90 text-stone-900 text-xs sm:text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className="block text-xs font-semibold text-stone-800">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset instructions sent to demo.driver@motomindx.io')}
                    className="text-xs font-medium text-[#f9570c] hover:text-orange-700"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200/90 text-stone-900 text-xs sm:text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input
                  id="login-rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#f9570c] accent-[#f9570c] focus:ring-orange-500 border-stone-300"
                />
                <label htmlFor="login-rememberMe" className="text-xs text-stone-700 select-none cursor-pointer">
                  Remember me
                </label>
              </div>

              {/* Sign in Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-[#f9570c] hover:bg-[#ea4e05] text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <span>{isLoading ? 'Signing in...' : 'Sign in'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo Account Button */}
              <button
                type="button"
                onClick={() => handleQuickDemo('car')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-stone-200/90 bg-white text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors shadow-xs cursor-pointer"
              >
                <Users className="w-4 h-4 text-stone-500" />
                <span>Explore with Demo Account</span>
              </button>
            </form>

            {/* Footer Link */}
            <p className="text-center text-xs text-stone-500 pt-1">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#f9570c] font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
