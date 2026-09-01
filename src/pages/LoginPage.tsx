import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useVehicle } from '../context/VehicleContext';
import type { VehicleCategory } from '../data/vehicleConfigurations';
import {
  Activity,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Car,
  Bike,
  Gamepad2,
  Play
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, setSelectedCategory } = useVehicle();

  const [email, setEmail] = useState('demo.driver@motomindx.io');
  const [password, setPassword] = useState('password123');
  const [errorMessage, setErrorMessage] = useState('');

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

    login(email, password);
    navigate('/dashboard');
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
    <div className="min-h-screen bg-[#f8f6f0] text-stone-900 font-sans flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 selection:bg-orange-500/20 selection:text-orange-950">
      {/* Top Brand Logo Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-5 sm:mb-6">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-600/30">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-black font-display tracking-tight text-stone-900">
            MotoMind<span className="text-orange-600">X</span>
          </span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto w-full">
        {/* Quick Demo Banner Bar */}
        <div className="mb-4 sm:mb-5 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black font-display tracking-tight leading-none">
                Instant 3D Telematics Demo
              </div>
              <p className="text-[11px] text-orange-100 font-sans mt-0.5">
                Explore real-time 3D twins & diagnostics without typing credentials.
              </p>
            </div>
          </div>

          {/* Quick Demo Preset Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleQuickDemo('car')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-orange-800 text-xs font-bold shadow-sm hover:bg-orange-50 active:scale-95 transition-all"
            >
              <Car className="w-3.5 h-3.5 text-orange-600" />
              <span>Car</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('motorcycle')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-orange-800 text-xs font-bold shadow-sm hover:bg-orange-50 active:scale-95 transition-all"
            >
              <Bike className="w-3.5 h-3.5 text-orange-600" />
              <span>Bike</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('rc_car')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-orange-800 text-xs font-bold shadow-sm hover:bg-orange-50 active:scale-95 transition-all"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-orange-600" />
              <span>RC</span>
            </button>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-3xl shadow-warm-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Left Side: Branding & Vehicle Diagnostic Visual */}
          <div className="md:col-span-5 bg-gradient-to-br from-orange-600 via-orange-700 to-stone-900 p-6 sm:p-8 text-white flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/20">
                PRO DIAGNOSTICS
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight leading-tight">
                Your Complete Vehicle Telematics Hub
              </h2>
              <p className="text-xs text-orange-100 leading-relaxed">
                Connect your hardware dongle, monitor real-time CAN bus streams, and inspect 3D digital twins.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-2.5 text-xs text-orange-100 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Car, Motorcycle & RC Telemetry</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Live 3D Digital Twin Visualizer</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>One-Click Printable Mechanic Reports</span>
              </div>
            </div>

            {/* One-Click Direct Demo Launch */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('car')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-bold transition-all shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Live 3D Demo Directly</span>
              </button>
            </div>

            <div className="text-[11px] text-orange-200/80 font-mono">
              Secure Hardware Bus Protocol • ISO 15765-4
            </div>
          </div>

          {/* Right Side: Login Card */}
          <div className="md:col-span-7 p-6 sm:p-10 space-y-5 sm:space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-black font-display text-stone-900 tracking-tight">
                Welcome Back
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Enter your credentials or click a demo profile above to explore.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase font-mono mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-[#fbf9f4] border border-stone-300 rounded-xl px-3.5 py-2.5 pl-10 text-xs font-medium text-stone-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    required
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-stone-700 uppercase font-mono">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Password reset link sent to demo email.');
                    }}
                    className="text-[11px] font-semibold text-orange-600 hover:text-orange-700"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#fbf9f4] border border-stone-300 rounded-xl px-3.5 py-2.5 pl-10 text-xs font-medium text-stone-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-mono"
                    required
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/25 transition-all active:scale-95"
                >
                  <span>Login to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('car')}
                  title="Skip login with instant demo access"
                  className="px-3.5 py-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition-colors shrink-0"
                >
                  ⚡ Demo
                </button>
              </div>
            </form>

            {/* Social Divider */}
            <div className="relative my-3 sm:my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase font-mono">
                <span className="bg-white px-2 text-stone-400 font-semibold">Or continue with</span>
              </div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-xs font-bold text-stone-700 transition-colors shadow-warm-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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

            {/* Bottom Link to Signup */}
            <div className="pt-2 text-center text-xs text-stone-500">
              Don't have an account?{' '}
              <Link to="/signup" className="font-bold text-orange-600 hover:text-orange-700">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
