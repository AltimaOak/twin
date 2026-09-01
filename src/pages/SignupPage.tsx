import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useVehicle } from '../context/VehicleContext';
import type { VehicleCategory } from '../data/vehicleConfigurations';
import {
  Activity,
  User,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Car,
  Bike,
  Gamepad2,
  Play,
  Zap
} from 'lucide-react';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, login, setSelectedCategory } = useVehicle();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
      setErrorMessage('You must agree to the Terms & Conditions to create an account.');
      return;
    }

    signup(name, email, password);
    navigate('/select-vehicle');
  };

  const handleQuickDemo = (category: VehicleCategory = 'car') => {
    setSelectedCategory(category);
    login('demo.driver@motomindx.io', 'password123', 'Demo Driver');
    navigate('/dashboard');
  };

  const handleAutofillDemo = () => {
    setName('Alex Mercer');
    setEmail('alex.mercer@motomindx.io');
    setPassword('demopass123');
    setConfirmPassword('demopass123');
    setAgreeTerms(true);
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
        {/* Quick Demo Mode Banner */}
        <div className="mb-4 sm:mb-5 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black font-display tracking-tight leading-none">
                Skip Signup — Test Drive Live 3D Demo
              </div>
              <p className="text-[11px] text-orange-100 font-sans mt-0.5">
                Launch directly with simulated live CAN telemetry and interactive 3D digital twins.
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
              <span>Car Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('motorcycle')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-orange-800 text-xs font-bold shadow-sm hover:bg-orange-50 active:scale-95 transition-all"
            >
              <Bike className="w-3.5 h-3.5 text-orange-600" />
              <span>Bike Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('rc_car')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-orange-800 text-xs font-bold shadow-sm hover:bg-orange-50 active:scale-95 transition-all"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-orange-600" />
              <span>RC Demo</span>
            </button>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-3xl shadow-warm-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Left Side: Branding & Value Proposition */}
          <div className="md:col-span-5 bg-gradient-to-br from-orange-600 via-orange-700 to-stone-900 p-6 sm:p-8 text-white flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/20">
                START MONITORING
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight leading-tight">
                Connect Any Vehicle In Minutes
              </h2>
              <p className="text-xs text-orange-100 leading-relaxed">
                Create your account to start streaming live telemetry, decoding trouble codes, and tracking maintenance.
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5 text-xs text-orange-100 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Multi-Vehicle Fleet & Garage</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Interactive 3D Digital Twin</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Instant Mechanic Diagnostic Reports</span>
              </div>
            </div>

            {/* Direct Instant Demo CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('car')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-bold transition-all shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Try Demo as Guest (No Signup)</span>
              </button>
            </div>

            <div className="text-[11px] text-orange-200/80 font-mono">
              Free Community Diagnostic Protocol Access
            </div>
          </div>

          {/* Right Side: Signup Form */}
          <div className="md:col-span-7 p-6 sm:p-10 space-y-4 sm:space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-black font-display text-stone-900 tracking-tight">
                  Create Your Account
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Enter your details or autofill to get started.
                </p>
              </div>

              {/* Autofill Demo button */}
              <button
                type="button"
                onClick={handleAutofillDemo}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 text-[11px] font-bold transition-colors"
                title="Fill sample details"
              >
                <Zap className="w-3 h-3 text-orange-600" />
                <span>Autofill Demo</span>
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase font-mono mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Mercer"
                    className="w-full bg-[#fbf9f4] border border-stone-300 rounded-xl px-3.5 py-2.5 pl-10 text-xs font-medium text-stone-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    required
                  />
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase font-mono mb-1">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase font-mono mb-1">
                    Password
                  </label>
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

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase font-mono mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#fbf9f4] border border-stone-300 rounded-xl px-3.5 py-2.5 pl-10 text-xs font-medium text-stone-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-mono"
                      required
                    />
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-stone-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="agreeTerms" className="text-xs text-stone-600 leading-snug cursor-pointer select-none">
                  I agree to the <a href="#terms" onClick={(e) => { e.preventDefault(); alert('MotoMindX Standard Terms: Diagnostic data is handled securely on your device.'); }} className="text-orange-600 font-bold hover:underline">Terms & Conditions</a> and privacy policy.
                </label>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/25 transition-all active:scale-95"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('car')}
                  title="Explore live demo without signing up"
                  className="px-3.5 py-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition-colors shrink-0"
                >
                  ⚡ Skip & Demo
                </button>
              </div>
            </form>

            <div className="pt-2 text-center text-xs text-stone-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-orange-600 hover:text-orange-700">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
