import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ShieldCheck,
  Cpu,
  Layers,
  Wrench,
  FileText,
  Car,
  Bike,
  Gamepad2,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Box,
  CheckCircle,
  Menu,
  X
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
        className="relative pt-8 pb-10 sm:pt-10 sm:pb-14 lg:pt-12 lg:pb-16 px-4 sm:px-8 overflow-hidden bg-cover bg-center border-b border-stone-200"
        style={{
          backgroundImage: `radial-gradient(circle at 75% 40%, rgba(255, 237, 213, 0.4) 0%, rgba(248, 246, 240, 0.75) 55%, rgba(248, 246, 240, 0.98) 100%), url('/images/hero-architecture-bg.jpg')`
        }}
      >
        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/3 w-64 sm:w-96 h-64 sm:h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-56 sm:w-80 h-56 sm:h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-8 relative z-10">
          {/* Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-orange-200/90 shadow-sm text-xs font-mono font-bold text-orange-800">
                <Sparkles className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span>Next-Generation Automotive Telematics</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-black font-display tracking-tight text-stone-950 leading-[1.12]">
                Know Your Vehicle.<br />
                Drive with{' '}
                <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
                  Confidence.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Real-time OBD-II telematics, interactive 3D digital twin diagnostics, and smart health alerts for cars, motorcycles, and RC rigs.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                <button
                  onClick={handleGetStarted}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-sm font-bold shadow-lg shadow-orange-600/30 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollToSection('features')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/90 hover:bg-white text-stone-800 border border-stone-200/90 text-sm font-bold shadow-warm-sm backdrop-blur-md transition-all hover:scale-[1.02] active:scale-95"
                >
                  Explore Features
                </button>
              </div>

              {/* Tech Specs Strip */}
              <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-stone-500 font-mono">
                {['Real-time CAN Stream', '3D Digital Twin', 'Instant Diagnostics'].map(label => (
                  <span key={label} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Vehicle Image */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/15 via-amber-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-xl mx-auto">
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[90%] h-6 bg-stone-950/20 blur-xl rounded-full pointer-events-none" />
                <img
                  src="/images/hero-vehicles.png"
                  alt="Audi Sedan and Yamaha R1 Superbike with MotoMindX Telematics"
                  className="w-full max-h-[220px] sm:max-h-[280px] lg:max-h-[340px] object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.14)] relative z-10 transform hover:scale-[1.01] transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* 3-Feature Bar */}
          <div className="max-w-5xl mx-auto">
            <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-xl border border-white/90 shadow-xl shadow-stone-900/5 grid grid-cols-1 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-200/80">
              {[
                { icon: <Activity className="w-5 h-5 stroke-[2.5]" />, title: 'Real-time OBD-II & CAN', desc: 'Live sensor data streaming from vehicle ECU systems.', grad: 'from-orange-500 to-amber-500' },
                { icon: <Box className="w-5 h-5 stroke-[2.5]" />, title: '3D Digital Twin Visualizer', desc: 'Interactive 3D model with component-level inspection.', grad: 'from-amber-500 to-orange-500' },
                { icon: <ShieldCheck className="w-5 h-5 stroke-[2.5]" />, title: 'Plain-English Diagnostics', desc: 'Instant fault code explanation and severity ratings.', grad: 'from-orange-600 to-amber-600' },
              ].map((feat, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 pt-3 sm:pt-0 ${i > 0 ? 'sm:pl-6' : ''} first:pt-0 group cursor-pointer hover:translate-x-0.5 transition-transform`}
                  onClick={() => scrollToSection('features')}
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feat.grad} flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                    {feat.icon}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-black font-display text-stone-900 leading-snug group-hover:text-orange-600 transition-colors">{feat.title}</div>
                    <div className="text-[10px] sm:text-[11px] text-stone-600 mt-0.5 leading-tight">{feat.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-14 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-600 px-3 py-1 rounded-full bg-orange-50 border border-orange-200">
            Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-stone-900 tracking-tight">
            Engineered for Mechanics, Drivers, and Enthusiasts
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Everything you need to monitor, inspect, and maintain any connected vehicle in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {[
            { icon: <Cpu className="w-6 h-6" />, color: 'orange', title: 'Smart Diagnostics', desc: 'Decodes standard OBD-II and proprietary fault codes into plain-English answers: What happened, why it matters, and what you should do.' },
            { icon: <Activity className="w-6 h-6" />, color: 'sky', title: 'Live Vehicle Data', desc: 'Stream live RPM, temperatures, battery voltages, speed, throttle, fuel levels, and current draw with responsive gauge clusters and sparklines.' },
            { icon: <Layers className="w-6 h-6" />, color: 'orange', title: '3D Digital Twin', desc: 'Interactive 3D vehicle models for cars, motorcycles, and RC chassis with camera orbit controls, X-ray powertrain mode, and clickable component markers.' },
            { icon: <ShieldCheck className="w-6 h-6" />, color: 'emerald', title: 'Vehicle Health Score', desc: 'Transparent 0–100 composite index calculated from powertrain, electrical, cooling, braking, and maintenance adherence weights.' },
            { icon: <Wrench className="w-6 h-6" />, color: 'amber', title: 'Maintenance Tracking', desc: 'Mileage and cycle-based preventative maintenance schedules with remaining distance tracking and instant service record logging.' },
            { icon: <FileText className="w-6 h-6" />, color: 'orange', title: 'Mechanic Reports', desc: 'One-click printable automotive service work orders with vehicle details, active DTCs, freeze frames, and technician sign-off checklist.' },
          ].map((feat, i) => (
            <div key={i} className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200 shadow-warm-sm hover:shadow-warm-md hover:border-orange-300 transition-all space-y-3">
              <div className={`w-11 h-11 rounded-xl bg-${feat.color}-50 border border-${feat.color}-200 flex items-center justify-center text-${feat.color}-600`}>
                {feat.icon}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900">{feat.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. How It Works */}
      <section id="how-it-works" className="py-14 sm:py-20 px-4 sm:px-8 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-600 px-3 py-1 rounded-full bg-orange-50 border border-orange-200">
              Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-stone-900 tracking-tight">
              How MotoMindX Works
            </h2>
            <p className="text-sm text-stone-600">
              From hardware connection to actionable maintenance in 4 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              { step: '01', title: 'Connect', desc: 'Plug the MotoMindX hardware dongle into your OBD-II port, bike diagnostic plug, or RC receiver link.' },
              { step: '02', title: 'Select Vehicle', desc: 'Choose or configure your car, motorcycle, or RC rig. The platform automatically adapts its sensors.' },
              { step: '03', title: 'Analyze', desc: 'Inspect 3D digital twins, live telemetry streams, health scores, and decoded trouble codes.' },
              { step: '04', title: 'Maintain', desc: 'Log completed services, monitor component wear, and generate official mechanic report sheets.' },
            ].map(step => (
              <div key={step.step} className="p-5 sm:p-6 rounded-2xl bg-[#fbf9f4] border border-stone-200 space-y-3">
                <div className="text-2xl sm:text-3xl font-black font-mono text-orange-600">{step.step}</div>
                <h3 className="text-sm sm:text-base font-bold text-stone-900">{step.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Supported Vehicles */}
      <section id="vehicles" className="py-14 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-600 px-3 py-1 rounded-full bg-orange-50 border border-orange-200">
            Compatibility
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-stone-900 tracking-tight">
            Supported Vehicle Categories
          </h2>
          <p className="text-sm text-stone-600">
            Dedicated diagnostic profiles and 3D visualizers for every vehicle type.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {[
            {
              Icon: Car, label: 'Passenger & Commercial', title: 'CAR',
              desc: 'Professional passenger car diagnostics over standard OBD-II / CAN bus. Real-time engine PIDs, transmission status, emissions monitors, and brake pad life.',
              specs: ['ISO 15765-4 CAN 11/500', 'Sedan 3D Digital Twin'],
              btnLabel: 'Select Car Mode', type: 'car' as const
            },
            {
              Icon: Bike, label: 'Motorcycles & Scooters', title: 'MOTORCYCLE',
              desc: 'Motorcycle and scooter diagnostic telematics. Monitor engine temperatures, dual-channel ABS line pressures, stator charging, lean angle IMU, and chain slack.',
              specs: ['Motorcycle CAN Diagnostic Link', 'Sport Bike 3D Digital Twin'],
              btnLabel: 'Select Motorcycle Mode', type: 'motorcycle' as const
            },
            {
              Icon: Gamepad2, label: 'Electric RC & Hobby Rigs', title: 'RC CAR',
              desc: 'High-speed telemetry for brushless motors and LiPo packs. Monitor ESC MOSFET temperatures, per-cell battery balance, peak current draw, and RF signal RSSI.',
              specs: ['915MHz LoRa & Serial Telemetry', '1/10 Chassis 3D Digital Twin'],
              btnLabel: 'Select RC Car Mode', type: 'rc_car' as const
            },
          ].map(card => (
            <div key={card.type} className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-stone-200 shadow-warm-sm hover:shadow-warm-md hover:border-orange-300 transition-all flex flex-col justify-between space-y-5 sm:space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                  <card.Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-orange-600">{card.label}</span>
                  <h3 className="text-lg sm:text-xl font-black text-stone-900 mt-0.5">{card.title}</h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">{card.desc}</p>
                </div>
                <div className="space-y-1.5 text-xs text-stone-600 font-mono">
                  {card.specs.map(spec => (
                    <div key={spec} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => navigate('/select-vehicle')}
                className="w-full py-2.5 rounded-xl bg-[#fbf9f4] hover:bg-orange-50 hover:text-orange-700 text-stone-800 border border-stone-200 text-xs font-bold transition-all"
              >
                {card.btnLabel}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="py-14 sm:py-16 px-4 sm:px-8 bg-stone-900 text-white text-center">
        <div className="max-w-3xl mx-auto space-y-5 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight">
            Start monitoring your vehicle today.
          </h2>
          <p className="text-sm text-stone-400 max-w-xl mx-auto leading-relaxed">
            Join technicians, automotive engineers, and drivers using MotoMindX for real-time diagnostics and health tracking.
          </p>
          <div>
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-600/30 transition-all hover:scale-105 active:scale-95"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="w-full bg-white border-t border-stone-200 py-5 sm:py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row flex-wrap items-center justify-between gap-2 sm:gap-4 text-xs text-stone-500 font-mono text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
            <span className="font-bold text-stone-800">MotoMindX Automotive Diagnostics</span>
            <span className="hidden sm:inline">• CAN 2.0B / ISO 15765-4 &amp; LoRa RF Telemetry</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} MotoMindX Inc. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
