import React, { useState } from 'react';
import { Flame, CheckCircle } from 'lucide-react';
import loginBanner from '../assets/images/gym_login_banner_1783183864051.jpg';

interface CosmeticLoginScreenProps {
  activePage: 'member' | 'trainer' | 'gym_admin' | 'super_admin' | 'guide' | 'pass';
  onPageChange: (page: 'member' | 'trainer' | 'gym_admin' | 'super_admin' | 'guide' | 'pass') => void;
  onLoginSuccess: (page: 'member' | 'trainer' | 'gym_admin' | 'super_admin' | 'guide' | 'pass') => void;
}

export default function CosmeticLoginScreen({
  activePage,
  onPageChange,
  onLoginSuccess
}: CosmeticLoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Determine portal details based on the active role/page
  const getPortalDetails = () => {
    switch (activePage) {
      case 'trainer':
        return {
          title: 'Trainer Coaching Hub',
          desc: 'Prescribe programs, diets, and track member attendance.',
          roleName: 'Fitness Coach',
          themeColor: 'emerald',
          btnBg: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500',
          accentText: 'text-emerald-600',
          bgBadge: 'bg-emerald-50 text-emerald-700'
        };
      case 'gym_admin':
        return {
          title: 'Gym Owner Control HQ',
          desc: 'Manage memberships, staff trainers, class schedules, and invoices.',
          roleName: 'Gym Administrator',
          themeColor: 'indigo',
          btnBg: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
          accentText: 'text-indigo-600',
          bgBadge: 'bg-indigo-50 text-indigo-700'
        };
      case 'super_admin':
        return {
          title: 'Pro Platform Admin',
          desc: 'Review multi-tenant subscription accounts, SaaS pricing, and audit logs.',
          roleName: 'Platform Owner',
          themeColor: 'rose',
          btnBg: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500',
          accentText: 'text-rose-600',
          bgBadge: 'bg-rose-50 text-rose-700'
        };
      default:
        return {
          title: 'Core Member Portal',
          desc: 'Book classes, log physical exercises, track diets, and message coach.',
          roleName: 'Gym Member',
          themeColor: 'indigo',
          btnBg: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
          accentText: 'text-indigo-600',
          bgBadge: 'bg-indigo-50 text-indigo-700'
        };
    }
  };

  const portal = getPortalDetails();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(activePage);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden min-h-[620px]">
        
        {/* Left Column - Immersive Gym Aesthetic Column (Visible on md and larger) */}
        <div className="md:col-span-5 bg-slate-950 relative hidden md:flex flex-col justify-between p-10 text-white overflow-hidden select-none">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <img 
              src={loginBanner} 
              alt="High-end modern fitness center" 
              className="w-full h-full object-cover opacity-60 scale-105 hover:scale-100 transition-transform duration-[10000ms] ease-out"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950" />
          </div>

          {/* Logo / Top section */}
          <div className="relative z-10 flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black shrink-0 shadow-md">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight font-display text-white">FitnessUp</h2>
              <p className="text-[9px] text-slate-300 font-bold uppercase tracking-wider">Enterprise Gym SaaS</p>
            </div>
          </div>

          {/* Slogan / Center section */}
          <div className="relative z-10 my-auto pt-12">
            <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest bg-indigo-900/40 px-2.5 py-1 rounded-md border border-indigo-500/20">
              NEXT GEN PLATFORM
            </span>
            <h1 className="text-3xl font-black text-white font-display mt-4 tracking-tight leading-tight">
              Powering elite fitness centers worldwide.
            </h1>
            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Connect owners, personal coaches, and gym members under a single unified, intelligent real-time SaaS engine.
            </p>

            <ul className="mt-6 space-y-2.5">
              <li className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multi-tenant client analytics</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Personalized diet &amp; workout coaching</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-time digital NFC check-ins</span>
              </li>
            </ul>
          </div>

          {/* Quote / Bottom section */}
          <div className="relative z-10 border-t border-slate-800/80 pt-4 mt-6">
            <p className="text-[10px] text-slate-400 font-mono italic leading-relaxed">
              "GymFlow transformed our community retention by 42% in just three months of deployment."
            </p>
            <p className="text-[9px] text-slate-300 font-bold uppercase tracking-wide mt-1.5">
              — Apex Club Owner
            </p>
          </div>
        </div>

        {/* Right Column - Pristine Login Form */}
        <div className="md:col-span-7 p-8 sm:p-12 md:p-14 flex flex-col justify-center space-y-8 bg-white">
          
          {/* Logo Header (Visible on Mobile Only) */}
          <div className="flex flex-col items-center text-center md:hidden">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-md shadow-slate-900/10 text-white font-black shrink-0 mb-3 relative overflow-hidden">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight font-display">FitnessUp</h2>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Gym &amp; Fitness Management Hub</span>
          </div>

          {/* Form Header */}
          <div className="text-center md:text-left">
            <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase mb-3.5 border border-slate-100 bg-slate-50 text-slate-600">
              ⚡ Demo Environment
            </div>
            <div className={`inline-flex md:hidden items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase mt-2 border border-slate-100 ${portal.bgBadge}`}>
              {portal.roleName} Mode
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug mt-1">{portal.title}</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-sm">{portal.desc}</p>
          </div>

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-3.5">
              <div>
                <label htmlFor="email" className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="demo@gymflow.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="pt-2 space-y-3">
              {/* Primary Action */}
              <button
                type="submit"
                className={`w-full flex justify-center items-center px-4 py-3.5 border border-transparent rounded-xl text-xs font-bold text-white shadow-sm focus:outline-hidden focus:ring-2 focus:ring-offset-2 transition-all cursor-pointer ${portal.btnBg}`}
              >
                Continue as {portal.roleName}
              </button>

              {/* Google Authentication Button */}
              <button
                type="button"
                onClick={() => onLoginSuccess(activePage)}
                className="w-full flex justify-center items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 shadow-xs transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" width="16" height="16">
                  <g transform="matrix(1, 0, 0, 1, 0, 0)">
                    <path fill="#EA4335" d="M20.6 12.3c0-.6-.1-1.2-.2-1.8H12v3.4h4.8c-.2 1.1-.8 2-1.8 2.6v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.4z"/>
                    <path fill="#4285F4" d="M12 21c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.8.8-3.1.8-2.4 0-4.4-1.6-5.1-3.8H3.9v2.3C5.4 18.9 8.5 21 12 21z"/>
                    <path fill="#FBBC05" d="M6.9 13.6c-.2-.5-.3-1.1-.3-1.6s.1-1.1.3-1.6V8.1H3.9c-.8 1.6-1.3 3.4-1.3 5.3s.5 3.7 1.3 5.3l3-2.3z"/>
                    <path fill="#34A853" d="M12 6.4c1.3 0 2.5.4 3.4 1.3l2.6-2.6C16.5 3.7 14.4 3 12 3 8.5 3 5.4 5.1 3.9 8.1l3 2.3c.7-2.2 2.7-3.8 5.1-3.8z"/>
                  </g>
                </svg>
                Sign in with Google
              </button>
            </div>
          </form>

          {/* Demo Disclaimer */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-mono leading-normal text-center">
              ⚙️ DEMO WORKSPACE: No real password needed. Submit any input to instantly log in as the default role persona.
            </p>
          </div>

          {/* Cross-Panel Links */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              Switch Live Portal Preview:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono uppercase tracking-wider">
              <button
                onClick={() => onPageChange('member')}
                className={`py-2 rounded-lg transition-colors border border-dashed cursor-pointer ${activePage === 'member' ? 'bg-indigo-50/50 border-indigo-200 text-indigo-600 font-extrabold' : 'border-slate-100 text-slate-400 hover:text-slate-600'}`}
              >
                Member
              </button>
              <button
                onClick={() => onPageChange('trainer')}
                className={`py-2 rounded-lg transition-colors border border-dashed cursor-pointer ${activePage === 'trainer' ? 'bg-emerald-50/50 border-emerald-200 text-emerald-600 font-extrabold' : 'border-slate-100 text-slate-400 hover:text-slate-600'}`}
              >
                Trainer
              </button>
              <button
                onClick={() => onPageChange('gym_admin')}
                className={`py-2 rounded-lg transition-colors border border-dashed cursor-pointer ${activePage === 'gym_admin' ? 'bg-indigo-50/50 border-indigo-200 text-indigo-600 font-extrabold' : 'border-slate-100 text-slate-400 hover:text-slate-600'}`}
              >
                Gym Owner
              </button>
              <button
                onClick={() => onPageChange('super_admin')}
                className={`py-2 rounded-lg transition-colors border border-dashed cursor-pointer ${activePage === 'super_admin' ? 'bg-rose-50/50 border-rose-200 text-rose-600 font-extrabold' : 'border-slate-100 text-slate-400 hover:text-slate-600'}`}
              >
                Pro Admin
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
