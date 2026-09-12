import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ShieldCheck,
  FileText,
  Car,
  Bike,
  Zap,
  Gamepad2,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Box,
  Menu,
  X,
  Gauge,
  Calendar,
  Users,
  HelpCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState<'home' | 'features' | 'how-it-works' | 'vehicles'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    navigate('/signup');
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const scrollToSection = (id: 'home' | 'features' | 'how-it-works' | 'vehicles') => {
    setActiveNav(id);
    setMobileMenuOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'home' as const, label: 'Home' },
    { id: 'features' as const, label: 'Features' },
    { id: 'how-it-works' as const, label: 'How It Works' },
    { id: 'vehicles' as const, label: 'Vehicles' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f6f0] text-stone-900 font-sans selection:bg-orange-500/20 selection:text-orange-950 flex flex-col">

      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-stone-200/80 shadow-warm-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollToSection('home')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-600/30 group-hover:scale-105 transition-transform shrink-0">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black font-display tracking-tight text-stone-900 leading-none">
                MotoMind<span className="text-orange-600">X</span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-stone-500 font-medium tracking-tight mt-0.5 hidden xs:block">
                Vehicle Health &amp; Diagnostics
              </p>
            </div>
          </div>

          {/* Desktop Center Nav */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-stone-600">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`relative py-1 transition-colors ${activeNav === link.id ? 'text-orange-600 font-extrabold' : 'hover:text-orange-600'}`}
              >
                {link.label}
                {activeNav === link.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-orange-600 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Desktop Right Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={handleLogin} className="px-4 py-2 rounded-xl text-xs font-bold text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors">
              Login
            </button>
            <button
              onClick={handleGetStarted}
              className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold shadow-md shadow-orange-600/25 transition-all hover:shadow-lg hover:shadow-orange-600/35 active:scale-95"
            >
              <span>Get Started</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={handleGetStarted}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-bold shadow-md shadow-orange-600/25 active:scale-95"
            >
              Start
              <ChevronRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white/98 backdrop-blur-xl px-4 py-4 space-y-1 shadow-lg">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  activeNav === link.id
                    ? 'bg-orange-50 text-orange-700 border border-orange-200'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-stone-100 flex flex-col gap-2 mt-2">
              <button
                onClick={handleLogin}
                className="w-full py-3 rounded-xl text-sm font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                Login
              </button>
              <button
                onClick={handleGetStarted}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white text-sm font-bold shadow-md shadow-orange-600/25 active:scale-95"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section
        id="home"
        className="relative pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20 px-4 sm:px-8 overflow-hidden bg-gradient-to-b from-[#faf9f6] via-[#f4f3ef] to-[#eceae4] border-b border-stone-200/80"
      >
        {/* Subtle Ambient Studio Flares */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-stone-300/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          {/* Hero Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Overline Accent Dash */}
              <div className="inline-flex items-center gap-2.5">
                <span className="w-5 h-[2.5px] bg-[#f9570c] rounded-full inline-block" />
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-stone-500 font-mono">
                  Next-Generation Automotive Telematics
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black font-display tracking-tight text-stone-950 leading-[1.1]">
                Know Your Vehicle.<br />
                Drive with <span className="text-[#f9570c]">Confidence.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-stone-600 max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal">
                Real-time OBD-II telematics, 3D digital twin diagnostics, and smart health alerts for cars and motorcycles.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={handleGetStarted}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#f9570c] hover:bg-[#ea580c] text-white text-sm font-bold shadow-md shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollToSection('features')}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 text-sm font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-95"
                >
                  <span>Explore Features</span>
                </button>
              </div>
            </div>

            {/* Right: Studio Vehicles Showcase */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end items-center">
              <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-2xl flex items-center justify-center">
                {/* Soft Contact Ground Shadow underneath transparent vehicle cutout */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[88%] h-7 bg-stone-900/20 blur-xl rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[75%] h-3 bg-stone-950/25 blur-md rounded-full pointer-events-none" />
                <img
                  src="/images/hero-vehicles.png"
                  alt="Audi Sedan and Yamaha R1 Superbike with MotoMindX Telematics"
                  className="w-full max-h-[320px] sm:max-h-[380px] lg:max-h-[420px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.14)] relative z-10 transition-transform duration-500 hover:scale-[1.01]"
                />
              </div>
            </div>
          </div>

          {/* 3-Feature Bar (Matching Reference Layout) */}
          <div className="pt-4 sm:pt-6 border-t border-stone-200/80">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 md:divide-x divide-stone-200/90">
              {/* Feature 1 */}
              <div
                className="flex items-start gap-4 md:pr-6 cursor-pointer group"
                onClick={() => scrollToSection('features')}
              >
                <div className="w-11 h-11 rounded-full bg-orange-100/90 flex items-center justify-center text-[#f9570c] shrink-0 group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="space-y-0.5">
                  <h2 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-[#f9570c] transition-colors">
                    Real-time OBD-II &amp; CAN
                  </h2>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Live sensor data from vehicle ECU systems.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div
                className="flex items-start gap-4 md:px-6 cursor-pointer group"
                onClick={() => scrollToSection('features')}
              >
                <div className="w-11 h-11 rounded-full bg-orange-100/90 flex items-center justify-center text-[#f9570c] shrink-0 group-hover:scale-105 transition-transform">
                  <Box className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="space-y-0.5">
                  <h2 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-[#f9570c] transition-colors">
                    3D Digital Twin
                  </h2>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Interactive 3D model with component-level inspection.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div
                className="flex items-start gap-4 md:pl-6 cursor-pointer group"
                onClick={() => scrollToSection('features')}
              >
                <div className="w-11 h-11 rounded-full bg-orange-100/90 flex items-center justify-center text-[#f9570c] shrink-0 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="space-y-0.5">
                  <h2 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-[#f9570c] transition-colors">
                    Plain-English Diagnostics
                  </h2>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Instant fault code explanation and severity ratings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section (Simple & Human) */}
      <section id="features" className="py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-orange-700 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200/80">
            Everyday Vehicle Health
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
            Everything you need to understand your vehicle
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            No confusing mechanical codes or technical jargon. Just clear, honest insights into how your car, bike, or RC is running.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Plain-English Alerts */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:shadow-md hover:border-orange-200 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-orange-600">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Plain-English Health Alerts</h3>
                <p className="text-xs text-orange-700 font-medium mt-0.5">Know what warning lights actually mean</p>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                When a warning indicator turns on, MotoMindX explains in plain language what happened, whether your vehicle is safe to keep driving, and the exact question to ask your repair shop.
              </p>
            </div>
            <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>No diagnostic code memorization</span>
            </div>
          </div>

          {/* Card 2: Clean Gauges */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:shadow-md hover:border-orange-200 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600">
                <Gauge className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Live Dashboard Dials</h3>
                <p className="text-xs text-amber-700 font-medium mt-0.5">Engine heat, battery charge &amp; speed</p>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Clean, clear dials show battery health, engine temperature, and fuel levels so you can spot a weak battery or cooling issue before you are stranded on the road.
              </p>
            </div>
            <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Real-time easy-to-read numbers</span>
            </div>
          </div>

          {/* Card 3: 3D Inspection */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:shadow-md hover:border-orange-200 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-orange-600">
                <Box className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Interactive 3D Look</h3>
                <p className="text-xs text-orange-700 font-medium mt-0.5">See where vehicle parts are located</p>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Spin and inspect a 3D model of your vehicle. Click on brakes, radiator, battery, or tires to check their health without getting grease on your hands.
              </p>
            </div>
            <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Sedan, motorcycle &amp; RC views</span>
            </div>
          </div>

          {/* Card 4: Service & Oil Reminders in Rupees */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:shadow-md hover:border-orange-200 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600">
                <Calendar className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Service Reminders in ₹</h3>
                <p className="text-xs text-emerald-700 font-medium mt-0.5">Estimated maintenance costs in Rupees</p>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Know when your next oil change, brake inspection, or tire rotation is due. See estimated repair costs in Indian Rupees (₹) so you are never surprised by repair shop bills.
              </p>
            </div>
            <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Transparent cost estimates in ₹</span>
            </div>
          </div>

          {/* Card 5: Mechanic Reports */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:shadow-md hover:border-orange-200 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-orange-600">
                <FileText className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">One-Page Mechanic Reports</h3>
                <p className="text-xs text-orange-700 font-medium mt-0.5">Show your mechanic exactly what’s needed</p>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Export or print a clean summary sheet before heading to the service center. Service advisors know exactly what you’ve verified, preventing unnecessary upsells.
              </p>
            </div>
            <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Downloadable PDF report</span>
            </div>
          </div>

          {/* Card 6: All Family Rides */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:shadow-md hover:border-orange-200 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700">
                <Users className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Multi-Vehicle Garage</h3>
                <p className="text-xs text-stone-600 font-medium mt-0.5">Cars, bikes and hobby models together</p>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Easily switch between your family sedan, commuter motorcycle, and hobby RC car. Each vehicle keeps its own separate maintenance log, health history, and readings.
              </p>
            </div>
            <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>One-click vehicle switching</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works (Simple 4-Step Guide) */}
      <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-8 bg-white border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-700 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200/80">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
              How MotoMindX works for everyday drivers
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Get connected in under 2 minutes — no tools, wiring, or mechanical background required.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: '01',
                title: 'Plug In Scanner',
                desc: 'Insert any small wireless OBD-II adapter under your car’s steering wheel. It takes 30 seconds and draws power directly from your vehicle.',
                tag: 'Under 30 seconds'
              },
              {
                step: '02',
                title: 'Open Your Garage',
                desc: 'Open MotoMindX on your phone or computer. The app discovers your vehicle and syncs live readings automatically.',
                tag: 'Zero setup required'
              },
              {
                step: '03',
                title: 'Check Health Score',
                desc: 'See a clear 0 to 100 overall score. Green means everything is nominal; amber clearly explains what needs a quick look.',
                tag: '0–100 Health Score'
              },
              {
                step: '04',
                title: 'Drive with Confidence',
                desc: 'Get timely reminders before small wear turns into costly roadside breakdowns, and log services as they happen.',
                tag: 'Avoid surprise bills'
              },
            ].map(item => (
              <div key={item.step} className="p-6 rounded-2xl bg-[#faf8f4] border border-stone-200/90 flex flex-col justify-between space-y-4 hover:border-orange-300 transition-colors">
                <div className="space-y-3">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-orange-600">
                    {item.step}
                  </div>
                  <h3 className="text-base font-bold text-stone-900">{item.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
                </div>
                <div className="pt-2 border-t border-stone-200/60 text-[11px] text-orange-700 font-semibold">
                  {item.tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Supported Vehicles */}
      <section id="vehicles" className="py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-orange-700 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200/80">
            Compatibility
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
            Built for your everyday ride
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Dedicated dashboards, custom 3D views, and plain-English guidance for each vehicle type.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              Icon: Car,
              label: 'Sedans, SUVs & Hatchbacks',
              title: 'Passenger Cars',
              desc: 'For your daily commute and family road trips. Check warning lights, verify battery health before cold mornings, and track scheduled maintenance with estimated costs in ₹.',
              perks: [
                'Standard OBD-II port compatibility',
                'Clear check-engine light translations',
                'Service estimates in Indian Rupees (₹)',
                'Interactive 3D sedan visualizer'
              ],
              btnLabel: 'Select Car Mode',
              type: 'car' as const
            },
            {
              Icon: Bike,
              label: 'Bikes & Roadsters',
              title: 'Motorcycles',
              desc: 'Tailored for two-wheelers. Keep track of battery charge while parked, monitor engine temperatures during heavy traffic, and get chain service reminders.',
              perks: [
                'Motorcycle diagnostic port support',
                '12V battery drain & stator health',
                'Chain maintenance & brake alerts',
                'Sport bike 3D visualizer'
              ],
              btnLabel: 'Select Motorcycle Mode',
              type: 'motorcycle' as const
            },
            {
              Icon: Zap,
              label: 'Smart EV Two-Wheelers',
              title: 'Electric Scooters',
              desc: 'For modern electric scooters. Monitor Li-ion cell balancing, PMSM motor temperatures, TrueRange battery projections, and regenerative braking telemetry.',
              perks: [
                'EV CAN & BLE telemetry gateway',
                'High-voltage BMS SOH tracking',
                'Gates carbon belt service alerts',
                'Ather 450X 3D EV visualizer'
              ],
              btnLabel: 'Select EV Scooter Mode',
              type: 'scooter' as const
            },
            {
              Icon: Gamepad2,
              label: 'Electric & Hobby Models',
              title: 'RC Vehicles',
              desc: 'For RC enthusiasts and racers. Keep track of motor heat, speed controller temperatures, and battery cell balance so your hobby gear never burns out.',
              perks: [
                'Motor & ESC heat monitoring',
                'LiPo per-cell battery health',
                'Run duration & performance logs',
                '1/10 chassis 3D visualizer'
              ],
              btnLabel: 'Select RC Car Mode',
              type: 'rc_car' as const
            },
          ].map(card => (
            <div key={card.type} className="p-6 sm:p-7 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:shadow-md hover:border-orange-300 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-orange-600">
                  <card.Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-orange-700">{card.label}</span>
                  <h3 className="text-xl font-bold text-stone-900 mt-0.5">{card.title}</h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">{card.desc}</p>
                </div>
                <div className="space-y-2 text-xs text-stone-700">
                  {card.perks.map(perk => (
                    <div key={perk} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => navigate('/select-vehicle')}
                className="w-full py-2.5 rounded-xl bg-stone-50 hover:bg-orange-50 hover:text-orange-700 text-stone-800 border border-stone-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                {card.btnLabel}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Questions Everyday Drivers Ask (FAQ) */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 bg-white border-y border-stone-200/80">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-700 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200/80">
              Clear Answers
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
              Frequently asked questions
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Everything you need to know about setting up and using MotoMindX.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-[#faf8f4] border border-stone-200/90 space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Do I need to be a mechanic or tech expert?</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Not at all. MotoMindX is designed specifically for everyday drivers. All complex fault codes are automatically translated into plain English: what happened, why it matters, and whether you can keep driving.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#faf8f4] border border-stone-200/90 space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-orange-600 shrink-0" />
                <span>What hardware adapter do I need?</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Any standard wireless OBD-II Bluetooth scanner (commonly available online for ₹800–₹1,500) works immediately. It plugs into the small diagnostic port under your car’s dashboard without any tools.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#faf8f4] border border-stone-200/90 space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Are maintenance costs shown in Rupees?</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Yes! All scheduled services, brake replacements, oil changes, and parts have localized estimated price ranges in Indian Rupees (₹) so you know what is fair before visiting a mechanic.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#faf8f4] border border-stone-200/90 space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Can I test it before buying an adapter?</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Yes! You can explore the full application right now using our pre-configured Demo Account. Click "Explore with Demo Account" on the login screen to test live dials and 3D views.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Final Simple CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 bg-stone-900 text-white text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Take the guesswork out of vehicle maintenance.
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
            Keep your car or motorcycle running safely, know when services are due in Rupees, and never be surprised by a garage bill again.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Get Started Free →
            </button>
            <button
              onClick={() => {
                navigate('/login');
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 transition-all cursor-pointer"
            >
              Explore Demo Account
            </button>
          </div>
        </div>
      </section>

      {/* 8. Clean Simple Footer */}
      <footer className="w-full bg-white border-t border-stone-200 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-orange-600 flex items-center justify-center text-white text-xs font-bold">
              M
            </div>
            <span className="font-bold text-stone-800">MotoMindX</span>
            <span>• Simple vehicle diagnostics &amp; maintenance</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} MotoMindX. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
