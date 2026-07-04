import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  Check, 
  QrCode, 
  Sparkles, 
  Ticket, 
  Plus, 
  Bookmark, 
  Calendar, 
  ShieldAlert, 
  User, 
  Clock, 
  Award, 
  Coins, 
  History,
  Download,
  Flame,
  ArrowRight
} from 'lucide-react';
import { Member, Attendance, PlatformLog } from '../types';
import { db } from '../data/mockData';

interface MembershipPassPageProps {
  member: Member;
  attendance: Attendance[];
  onAttendanceUpdate: (attendance: Attendance[]) => void;
  onLogsUpdate: (logs: PlatformLog[]) => void;
  currentUser: any;
}

export default function MembershipPassPage({
  member,
  attendance,
  onAttendanceUpdate,
  onLogsUpdate,
  currentUser
}: MembershipPassPageProps) {
  const [checkInSuccess, setCheckInSuccess] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPasses, setGuestPasses] = useState<string[]>([
    'Sarah Smith|||APX-GUEST-7721',
    'Michael Chang|||APX-GUEST-8104'
  ]);
  const [customHolderName, setCustomHolderName] = useState(member.name);
  const [isEditingName, setIsEditingName] = useState(false);

  // Filter current member's attendance
  const myAttendance = attendance.filter(a => a.memberId === member.id);

  const handleGymCheckIn = () => {
    setIsScanning(true);
    setCheckInSuccess(null);

    setTimeout(() => {
      setIsScanning(false);
      const todayStr = new Date().toISOString().split('T')[0];
      const todayTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Add actual check in attendance
      const newCheckIn: Attendance = {
        id: `att_${Date.now()}`,
        memberId: member.id,
        date: todayStr,
        status: 'PRESENT'
      };

      onAttendanceUpdate([...attendance, newCheckIn]);

      // Add platform log
      const newLog: PlatformLog = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: 'MEMBER',
        message: `${customHolderName} checked in to Apex Gym HQ via Digital Gold Pass at ${todayTimeStr}.`,
        user: customHolderName
      };

      // Retrieve current logs from db or props, append the new log
      const currentLogs = [...(db.logs || [])];
      const updatedLogs = [...currentLogs, newLog];
      onLogsUpdate(updatedLogs);
      db.logs = updatedLogs;

      setCheckInSuccess(`Successfully checked in to Apex Gym HQ at ${todayTimeStr}!`);

      // Auto-clear success message after 5 seconds
      setTimeout(() => {
        setCheckInSuccess(null);
      }, 5000);
    }, 1200);
  };

  const handleGenerateGuestPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    if (guestPasses.length >= 5) {
      alert("You have reached the maximum of 5 guest passes for this billing cycle.");
      return;
    }

    const randomCode = `APX-GUEST-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPass = `${guestName.trim()}|||${randomCode}`;
    setGuestPasses([...guestPasses, newPass]);
    setGuestName('');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Related Function Image Banner */}
      <div className="relative h-48 rounded-2xl overflow-hidden flex items-center justify-start p-6 md:p-8 text-white bg-cover bg-center shadow-xs" style={{ backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.3) 100%), url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80')` }}>
        <div className="space-y-1.5 z-10">
          <span className="text-[9px] bg-amber-500 text-slate-950 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">Verified Credential</span>
          <h1 className="font-display font-black text-2xl md:text-3xl tracking-tight mt-1.5">Apex Club Pass Center</h1>
          <p className="text-xs text-slate-200/90 max-w-lg leading-relaxed">Scan your gold pass at the reception kiosk scanner to log check-in metrics and unlock premium amenities.</p>
        </div>
      </div>

      {/* Intro Hero with Golden Glow Accent */}
      <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/50 text-amber-800 text-[10px] font-bold uppercase tracking-wider font-mono">
              <Sparkles className="w-3 h-3 text-amber-500" /> Premium Access Pass
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-display">
              Apex Unlimited Gold Pass
            </h1>
            <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
              Welcome to your dedicated Digital Credentials Center. Your fully fictional, high-fidelity elite tier pass allows seamless physical hardware simulator check-ins, guest management, and VIP tier reward tracking.
            </p>
          </div>

          <div className="flex gap-4 font-mono text-xs shrink-0">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-center shadow-2xs">
              <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider mb-0.5">Visits This Month</span>
              <span className="font-extrabold text-slate-800 text-base">{myAttendance.length + 12} Check-ins</span>
            </div>
            <div className="bg-amber-50/40 border border-amber-200/30 rounded-xl px-4 py-2.5 text-center shadow-2xs">
              <span className="text-[9px] text-amber-600 block uppercase font-bold tracking-wider mb-0.5">Membership Tier</span>
              <span className="font-extrabold text-amber-700 text-base flex items-center justify-center gap-1">
                GOLD <Award className="w-4 h-4 text-amber-500 shrink-0" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COMPARTMENT (COL 1-7): THE PREMIUM PASS CARD & SCANNER */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Card Showcase Container */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 font-display tracking-tight flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-500" /> Digital Credentials Card
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">High-fidelity active wallet pass mockup with live holographic textures</p>
              </div>

              {/* Edit Name Trigger */}
              <button
                onClick={() => setIsEditingName(!isEditingName)}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                {isEditingName ? "Done Editing" : "Change Pass Holder"}
              </button>
            </div>

            {/* Editable Name Field */}
            <AnimatePresence>
              {isEditingName && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-slate-50 rounded-xl p-4 border border-slate-200/60"
                >
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Customize Pass Holder Name
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customHolderName}
                      onChange={(e) => setCustomHolderName(e.target.value)}
                      placeholder="Enter pass holder's name..."
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-indigo-500 font-medium"
                    />
                    <button
                      onClick={() => setIsEditingName(false)}
                      className="px-4 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* THE PASS WALLET CARD */}
            <div className="relative">
              {/* Premium Glow Shadows */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-indigo-600/10 rounded-2xl blur-xl filter opacity-80 pointer-events-none"></div>
              
              {/* The Actual Card Markup */}
              <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-2xl border border-slate-800 overflow-hidden group">
                {/* Gold Holographic Metallic Foil Effect overlay */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-400/15 via-pink-500/5 to-transparent rounded-full blur-2xl pointer-events-none -mr-16 -mt-16 transition-all duration-1000 group-hover:scale-110"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-xl pointer-events-none -ml-16 -mb-16"></div>
                
                {/* Card Header */}
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-amber-400/90 font-mono font-black flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Apex Gym VIP Network
                    </span>
                    <h3 className="text-xl font-extrabold tracking-tight font-display mt-1 text-white">
                      Apex Unlimited Gold Pass
                    </h3>
                  </div>
                  {/* Luxury G Logo Accent */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 font-black font-display text-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
                    G
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-8 flex items-center gap-2 relative z-10">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-black text-emerald-400 tracking-wider uppercase font-mono bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Status: ACTIVE
                  </span>
                </div>

                {/* Card Body Credentials */}
                <div className="mt-12 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 relative z-10">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 uppercase font-mono block tracking-wider">Pass Holder</span>
                    <span className="text-sm font-extrabold font-display text-white tracking-wide">{customHolderName}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-[9px] text-slate-400 uppercase font-mono block tracking-wider">Credential ID</span>
                    <span className="text-sm font-mono font-bold text-amber-400 tracking-wider">APX-9823-GLD</span>
                  </div>
                </div>

                {/* Card Expiry and Dates */}
                <div className="mt-4 flex justify-between items-center text-[10px] text-slate-400 font-mono relative z-10 border-t border-white/5 pt-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Issued: 2026-01-15</span>
                  </div>
                  <span>Expires: 2026-12-31</span>
                </div>
              </div>
            </div>

            {/* Apple & Google Wallet buttons */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button 
                onClick={() => alert("Added to Apple Wallet! Your Gold Pass is ready in Apple Wallet on your iOS Simulator.")}
                className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-black text-white hover:bg-zinc-900 transition-all cursor-pointer font-semibold text-xs active:scale-95 border border-zinc-800 shadow-sm"
              >
                <div className="w-4 h-4 flex flex-col justify-between items-center text-white text-lg font-black leading-none"></div>
                <span>Add to Apple Wallet</span>
              </button>
              <button 
                onClick={() => alert("Added to Google Pay! Your Gold Pass is ready in Google Wallet on your Android Simulator.")}
                className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer font-semibold text-xs active:scale-95 border border-slate-800 shadow-sm"
              >
                <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white leading-none">G</div>
                <span>Add to Google Wallet</span>
              </button>
            </div>
          </div>

          {/* FRONT DESK KIOSK SIMULATOR (QR & BARCODE) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-800 font-display tracking-tight flex items-center gap-2">
                <QrCode className="w-5 h-5 text-indigo-500" /> Front-Desk Scanner Simulator
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">Scan your barcode below to test front-desk hardware integration and register a visit.</p>
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200/50 rounded-2xl text-center space-y-6">
              
              {/* Barcode Graphic Block */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs max-w-sm w-full space-y-2">
                <div className="h-16 bg-white flex items-center justify-center overflow-hidden">
                  <div className="flex gap-0.5 w-full h-full justify-center">
                    {[3, 1, 4, 1, 5, 2, 6, 1, 3, 2, 5, 1, 4, 3, 1, 2, 4, 1, 5, 2, 3, 1, 4, 2, 5, 1, 3, 2].map((weight, i) => (
                      <div 
                        key={i} 
                        className="bg-slate-900 h-full" 
                        style={{ width: `${weight * 1.5}px` }}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="text-center font-mono text-[10px] tracking-widest text-slate-400 uppercase">
                  APX-MEMBER-9823-GLD
                </div>
              </div>

              {/* Action Buttons & Simulation Feedback */}
              <div className="w-full max-w-sm space-y-3">
                {checkInSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-2"
                  >
                    <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                    <span>{checkInSuccess}</span>
                  </motion.div>
                ) : (
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Click the scan trigger below. It will update the database attendance tracker and add check-in records live.
                  </p>
                )}

                <button
                  onClick={handleGymCheckIn}
                  disabled={isScanning}
                  className={`w-full py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isScanning
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-wait'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/10 hover:shadow-lg active:scale-98'
                  }`}
                >
                  {isScanning ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-400 border-t-indigo-600 rounded-full animate-spin"></span>
                      <span>Transmitting Gold Credentials...</span>
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4.5 h-4.5 text-indigo-200" />
                      <span>Simulate Barcode Scan (Check In)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COMPARTMENT (COL 8-12): BENEFITS, GUEST PASSES & BILLING */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* ELITE GOLD TIER BENEFITS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-5">
            <div>
              <h2 className="text-sm font-extrabold text-slate-800 font-display tracking-tight flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-amber-500" /> Gold Tier Inclusions
              </h2>
              <p className="text-slate-400 text-[11px] mt-0.5">Your premium pass comes with exclusive elite network membership perks</p>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Full Locker Room Spa Access', desc: 'Complimentary wet/dry saunas, hot tubs, and steam suites at all locations.', icon: Award },
                { name: 'Smoothie Bar VIP Pricing', desc: '15% flat off all pre-workout drinks, protein powders, and healthy snacks.', icon: Coins },
                { name: 'Pre-Dispatched Towel service', desc: 'Fresh ultra-soft towel kit waiting for you at check-in reception.', icon: Check },
                { name: 'Priority Training Reservation', desc: 'Book scheduled classes 48 hours in advance to guarantee your slot.', icon: Clock },
                { name: 'Apex Recovery Pod Sessions', desc: 'Two monthly 30-minute sessions in the premium zero-gravity massage chair.', icon: Flame },
              ].map((b, idx) => {
                const Icon = b.icon;
                return (
                  <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="text-[11px] font-bold text-slate-800 block">{b.name}</strong>
                      <span className="text-[10px] text-slate-500 leading-normal block mt-0.5">{b.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GUEST PASS GENERATOR DISPATCHER */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-5">
            <div>
              <h2 className="text-sm font-extrabold text-slate-800 font-display tracking-tight flex items-center gap-2">
                <Ticket className="w-4.5 h-4.5 text-indigo-500" /> Guest Pass Dispatcher
              </h2>
              <p className="text-slate-400 text-[11px] mt-0.5">Generate physical pass invitations. You have <strong>{5 - guestPasses.length} / 5</strong> remaining monthly invitations.</p>
            </div>

            <form onSubmit={handleGenerateGuestPass} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Friend's Full Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. John Doe"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-indigo-500 bg-slate-50 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={guestPasses.length >= 5 || !guestName.trim()}
                className={`w-full py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  guestPasses.length >= 5 || !guestName.trim()
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                }`}
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Issue & Dispatch Guest Pass</span>
              </button>
            </form>

            {/* Generated passes list */}
            {guestPasses.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono block">
                  Active Guest Invitation Passes
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {guestPasses.map((p, idx) => {
                    const [name, code] = p.split('|||');
                    return (
                      <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-indigo-50/50 border border-indigo-100/40 text-[10px]">
                        <span className="text-slate-700 font-bold">{name}</span>
                        <span className="font-mono font-bold text-indigo-700 bg-white border border-indigo-100 px-2 py-0.5 rounded-lg tracking-wider">
                          {code}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* PRICING SUBSCRIPTION & BILLING SUMMARY */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-extrabold text-slate-800 font-display tracking-tight flex items-center gap-2">
                <CreditCard className="w-4.5 h-4.5 text-amber-500" /> Billing & Renewal Ledger
              </h2>
              <p className="text-slate-400 text-[11px] mt-0.5">Your monthly subscription schedule and active credit card</p>
            </div>

            <div className="space-y-2.5 text-xs font-mono text-slate-600">
              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span className="text-slate-400">Subscription Fee</span>
                <span className="font-extrabold text-slate-800">$79.00 / mo</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span className="text-slate-400">Funding Source</span>
                <span className="font-extrabold text-slate-800">Visa ending in •••• 4242</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span className="text-slate-400">Auto-Renewal Date</span>
                <span className="font-extrabold text-slate-800">August 01, 2026</span>
              </div>
            </div>

            <button
              onClick={() => alert("Invoice loaded! Simulated PDF check-in ledger downloaded successfully.")}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Download Recent Statement</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
