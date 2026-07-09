import React, { useState } from 'react';
import { 
  Dumbbell, 
  Apple, 
  Calendar, 
  TrendingDown, 
  Plus, 
  Check, 
  X, 
  User, 
  MessageSquare, 
  ChevronRight, 
  Scale, 
  Percent, 
  Clock, 
  ArrowUpRight,
  BookOpen,
  Zap,
  Bookmark,
  QrCode,
  CreditCard,
  Ticket,
  Sparkles,
  Search,
  Bell,
  Download,
  Activity,
  Award
} from 'lucide-react';
// Custom SVG Bar Chart used instead of recharts for full React 19 compatibility and stability
import { 
  Member, 
  Trainer, 
  FitnessClass, 
  Booking, 
  Attendance, 
  WorkoutPlan, 
  NutritionPlan,
  MemberProgress
} from '../types';
import { db } from '../data/mockData';
import memberPortalBanner from '../assets/images/member_portal_banner_1783184882327.jpg';

interface MemberPortalProps {
  member: Member;
  trainer?: Trainer;
  classes: FitnessClass[];
  bookings: Booking[];
  attendance: Attendance[];
  workoutPlan?: WorkoutPlan;
  nutritionPlan?: NutritionPlan;
  progressHistory: MemberProgress[];
  onBookingsUpdate: (bookings: Booking[]) => void;
  onClassesUpdate: (classes: FitnessClass[]) => void;
  onProgressUpdate: (progress: MemberProgress[]) => void;
  onAttendanceUpdate: (attendance: Attendance[]) => void;
  onLogsUpdate: (logs: any) => void;
  currentUser: any;
  activeTab?: 'dashboard' | 'schedule' | 'workouts' | 'nutrition' | 'progress' | 'messages' | 'pass';
  onTabChange?: (tab: 'dashboard' | 'schedule' | 'workouts' | 'nutrition' | 'progress' | 'messages' | 'pass') => void;
}

export default function MemberPortal({
  member,
  trainer,
  classes,
  bookings,
  attendance,
  workoutPlan,
  nutritionPlan,
  progressHistory,
  onBookingsUpdate,
  onClassesUpdate,
  onProgressUpdate,
  onAttendanceUpdate,
  onLogsUpdate,
  currentUser,
  activeTab: controlledActiveTab,
  onTabChange
}: MemberPortalProps) {
  const [localActiveTab, setLocalActiveTab] = useState<'dashboard' | 'schedule' | 'workouts' | 'nutrition' | 'progress' | 'messages' | 'pass'>('dashboard');
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : localActiveTab;
  const setActiveTab = onTabChange !== undefined ? onTabChange : setLocalActiveTab;

  // Interactive Modal edit states (for custom scheduler dialog shown in the video)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClassId, setEditingClassId] = useState('');
  const [editingClassName, setEditingClassName] = useState('');
  const [editingClassActivePill, setEditingClassActivePill] = useState('');
  const [editingClassTime, setEditingClassTime] = useState('');
  const [editingClassLocation, setEditingClassLocation] = useState('Salon 2');
  const [editingClassTrainer, setEditingClassTrainer] = useState('Jakob Dorwort');
  const [editingClassCapacity, setEditingClassCapacity] = useState(15);
  const [editingClassBookedCount, setEditingClassBookedCount] = useState(8);
  const [editingClassDay, setEditingClassDay] = useState('Monday');

  // Workout state tracking (checking off exercises!)
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});

  // Progress Logging
  const [newWeight, setNewWeight] = useState<number>(member.weight || 70);
  const [newBodyFat, setNewBodyFat] = useState<number>(18);

  // Chat Messenger state
  const [chatMessage, setChatMessage] = useState('');
  const [chatLog, setChatLog] = useState<{ sender: 'member' | 'trainer'; text: string; time: string }[]>([
    { sender: 'trainer', text: `Hi ${member.name}! I uploaded your new compound strength program and lean deficit diet plan. Let me know if you have any questions!`, time: 'Yesterday' }
  ]);

  // Guest passes and check in states
  const [guestPassesUsed, setGuestPassesUsed] = useState<string[]>([]);
  const [guestName, setGuestName] = useState('');
  const [checkInSuccess, setCheckInSuccess] = useState<string | null>(null);

  const handleGymCheckIn = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const myAttendance = attendance.filter(a => a.memberId === member.id);
    
    // Check if they already checked in today
    const alreadyCheckedIn = myAttendance.some(a => a.date === todayStr && !a.classId);
    if (alreadyCheckedIn) {
      alert("You have already checked in to the gym today!");
      return;
    }

    const newAttendance: Attendance = {
      id: `att_${Date.now()}`,
      memberId: member.id,
      date: todayStr,
      status: 'PRESENT'
    };

    const updated = [...attendance, newAttendance];
    onAttendanceUpdate(updated);
    
    db.addLog('MEMBER', `Member ${member.name} checked into the gym via Gold Pass barcode scanner`, currentUser.name);
    onLogsUpdate(db.logs);

    setCheckInSuccess('Check-in complete! Kiosk scan logged at front desk.');
    
    // Clear success after 4 seconds
    setTimeout(() => {
      setCheckInSuccess(null);
    }, 4000);
  };

  const handleGenerateGuestPass = () => {
    if (guestPassesUsed.length >= 5) {
      alert("You have exhausted your guest passes for the month!");
      return;
    }
    if (!guestName.trim()) return;

    const accessCode = `G-${Math.floor(100000 + Math.random() * 900000)}`;
    const record = `${guestName.trim()}|||${accessCode}`;
    setGuestPassesUsed(prev => [...prev, record]);
    
    db.addLog('MEMBER', `Member ${member.name} generated Guest Pass access code "${accessCode}" for ${guestName}`, currentUser.name);
    onLogsUpdate(db.logs);

    setGuestName('');
    alert(`Success! Entry code "${accessCode}" is now active. Your friend can scan this at the reception desk for entry.`);
  };

  // 1. Calculations & Filters
  const gymClasses = classes.filter(c => c.gymId === member.gymId);
  const myBookings = bookings.filter(b => b.memberId === member.id && b.status === 'CONFIRMED');
  const myAttendance = attendance.filter(a => a.memberId === member.id);

  // Next booked class
  const nextBookedClass = gymClasses.find(c => myBookings.some(b => b.classId === c.id));

  // Attendance Rate
  const attendanceRate = myAttendance.length > 0 
    ? Math.round((myAttendance.filter(a => a.status === 'PRESENT').length / myAttendance.length) * 100)
    : 100;

  // Book/Cancel group class
  const handleToggleBooking = (classId: string, className: string, isBooked: boolean) => {
    if (isBooked) {
      // Cancel Booking
      const updatedBookings = bookings.filter(b => !(b.classId === classId && b.memberId === member.id));
      onBookingsUpdate(updatedBookings);
      db.bookings = updatedBookings;

      // Decrement bookedCount in classes
      const updatedClasses = classes.map(c => {
        if (c.id === classId) {
          return { ...c, bookedCount: Math.max(0, c.bookedCount - 1) };
        }
        return c;
      });
      onClassesUpdate(updatedClasses);
      db.classes = updatedClasses;

      db.addLog('MEMBER', `Member ${member.name} cancelled class booking for "${className}"`, currentUser.name);
      onLogsUpdate(db.logs);
    } else {
      // Book Seat
      const targetClass = classes.find(c => c.id === classId);
      if (targetClass && targetClass.bookedCount >= targetClass.capacity) {
        alert('This class session is fully booked!');
        return;
      }

      const newBooking: Booking = {
        id: `b_${Date.now()}`,
        classId,
        memberId: member.id,
        bookingDate: new Date().toISOString().split('T')[0],
        status: 'CONFIRMED'
      };

      const updatedBookings = [...bookings, newBooking];
      onBookingsUpdate(updatedBookings);
      db.bookings = updatedBookings;

      const updatedClasses = classes.map(c => {
        if (c.id === classId) {
          return { ...c, bookedCount: c.bookedCount + 1 };
        }
        return c;
      });
      onClassesUpdate(updatedClasses);
      db.classes = updatedClasses;

      db.addLog('MEMBER', `Member ${member.name} booked a seat in "${className}"`, currentUser.name);
      onLogsUpdate(db.logs);
    }
  };

  // Toggle Exercise completion
  const handleToggleExercise = (name: string) => {
    setCompletedExercises(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Progress Logger Submit
  const handleLogProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;

    const newRecord: MemberProgress = {
      id: `p_${Date.now()}`,
      memberId: member.id,
      date: new Date().toISOString().split('T')[0],
      weight: newWeight,
      bodyFat: newBodyFat
    };

    const updated = [...progressHistory, newRecord];
    onProgressUpdate(updated);
    db.progress = updated;

    db.addLog('MEMBER', `Member ${member.name} logged progress weight: ${newWeight}kg`, currentUser.name);
    onLogsUpdate(db.logs);
    alert('Progress weight logged successfully! Weight history graph updated.');
  };

  // Chat dispatch
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMessage = {
      sender: 'member' as const,
      text: chatMessage,
      time: 'Just now'
    };

    const updatedLogs = [...chatLog, newMessage];
    setChatLog(updatedLogs);
    setChatMessage('');

    // Auto trainer response simulation!
    setTimeout(() => {
      const coachReply = {
        sender: 'trainer' as const,
        text: `Thanks for the message, ${(member?.name || 'Champ').split(' ')[0]}! I reviewed your notes and yes, make sure to progressively overload by increasing your squat weight by 2.5kg if you completed all 5 sets. Keep up the hustle!`,
        time: 'Just now'
      };
      setChatLog(prev => [...prev, coachReply]);
    }, 1500);
  };

  // Get member's private weight history sorted chronologically
  const myWeightLogs = progressHistory
    .filter(p => p.memberId === member.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Interactive scheduler edit helpers
  const openClassEditModal = (cls: FitnessClass) => {
    setEditingClassId(cls.id);
    setEditingClassName(cls.name);
    setEditingClassActivePill(cls.name);
    setEditingClassTime(cls.time);
    setEditingClassDay(cls.day);
    setEditingClassTrainer(cls.trainerName);
    setEditingClassCapacity(cls.capacity);
    setEditingClassBookedCount(cls.bookedCount);
    setEditingClassLocation(cls.id.includes('yoga') || cls.name.includes('Yoga') ? 'Yoga Studio' : cls.id.includes('spin') || cls.name.includes('Cycling') ? 'Spin Cave' : 'Salon 2');
    setIsModalOpen(true);
  };

  const saveClassEdits = () => {
    const updated = classes.map(cls => {
      if (cls.id === editingClassId) {
        return {
          ...cls,
          name: editingClassName,
          time: editingClassTime,
          day: editingClassDay,
          trainerName: editingClassTrainer,
          capacity: Number(editingClassCapacity),
          bookedCount: Number(editingClassBookedCount)
        };
      }
      return cls;
    });
    onClassesUpdate(updated);
    setIsModalOpen(false);
    db.addLog('MEMBER', `Updated class ${editingClassName} timetable schedule manually via Interactive Modal`, currentUser.name);
    onLogsUpdate(db.logs);
  };

  return (
    <div className="space-y-6">
      {/* Member Welcome Banner */}
      <div className="relative overflow-hidden bg-slate-950 text-white rounded-2xl p-6 md:p-8 shadow-md">
        {/* Clearly visible side image for desktop layout */}
        <div className="absolute inset-y-0 right-0 w-full md:w-1/2 z-0">
          <img 
            src={memberPortalBanner} 
            alt="Member Portal Banner" 
            className="w-full h-full object-cover opacity-45 md:opacity-85"
            referrerPolicy="no-referrer"
          />
          {/* Subtle overlay on the right to blend back to black */}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent md:bg-none" />
        </div>
        
        {/* Solid gradient on the left that fades out to the right for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-950/30 z-0 hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent z-0 md:hidden" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Zap className="w-3.5 h-3.5" /> Core Member Portal
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-semibold tracking-tight">Hustle Hard, {(member?.name || 'Champ').split(' ')[0]}!</h2>
            <p className="text-slate-300 text-sm max-w-xl">Track your personal calorie intakes, mark workout completions, book fitness classes, and chat with your trainer directly.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {['dashboard', 'schedule', 'workouts', 'nutrition', 'progress', 'messages', 'pass'].map((tab) => {
              let label = tab.toUpperCase();
              if (tab === 'dashboard') label = 'Dashboard';
              if (tab === 'schedule') label = 'Book Classes';
              if (tab === 'workouts') label = 'My Exercises';
              if (tab === 'nutrition') label = 'Diet Tracker';
              if (tab === 'progress') label = 'Weight Log';
              if (tab === 'messages') label = 'Chat Coach';
              if (tab === 'pass') label = 'Membership Pass';

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeTab === tab 
                      ? 'bg-sky-500 text-white font-bold shadow-xs' 
                      : 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Member Main KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Assigned Personal Trainer</span>
            <div className="text-sm font-bold text-slate-800">{trainer ? trainer.name : 'No Assigned Coach'}</div>
            <span className="text-[10px] text-slate-400 block">{trainer ? trainer.email : 'Consult gym admin to hire'}</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <User className="w-5 h-5" />
          </div>
        </div>

        <button 
          onClick={() => setActiveTab('pass')}
          className={`p-5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer group w-full ${
            activeTab === 'pass' 
              ? 'bg-sky-50 border-sky-200 shadow-sm ring-1 ring-sky-500/20' 
              : 'bg-white border-slate-100 hover:border-sky-200 hover:bg-slate-50/50 shadow-xs'
          }`}
        >
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Membership Pass</span>
            <div className="text-sm font-bold text-slate-800">Apex Unlimited Gold Pass</div>
            <span className="text-[10px] text-emerald-600 font-bold block">Status: ACTIVE</span>
          </div>
          <div className={`p-3 rounded-lg transition-all ${
            activeTab === 'pass' ? 'bg-sky-500 text-white shadow-xs' : 'bg-sky-50 text-sky-600 group-hover:bg-sky-100'
          }`}>
            <Bookmark className="w-5 h-5" />
          </div>
        </button>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Next Scheduled Class</span>
            <div className="text-sm font-bold text-slate-800 truncate max-w-[160px]">
              {nextBookedClass ? nextBookedClass.name : 'None Booked'}
            </div>
            <span className="text-[10px] text-slate-400 block">
              {nextBookedClass ? `${nextBookedClass.day} • ${nextBookedClass.time}` : 'Click Book Classes below'}
            </span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Monthly Attendance Rate</span>
            <div className="text-2xl font-bold font-display text-slate-900">{attendanceRate}%</div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Percent className="w-3 h-3" /> Based on 30-day window
            </div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* VIEW: Dashboard (Fireup style) */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Welcome Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
            <div className="space-y-1">
              <h1 className="text-2xl font-display font-bold text-slate-800 tracking-tight">
                Welcome, {(member?.name || 'Champ').split(' ')[0]}!
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })} • Thursday, 11 July
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="text" 
                  placeholder="Search classes, trainers..." 
                  className="pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 w-full sm:w-64"
                />
              </div>

              {/* Notification Bell */}
              <button className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100/60 hover:bg-slate-100 rounded-xl transition-all relative cursor-pointer">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
              </button>

              {/* Share/Download Button */}
              <button 
                onClick={() => alert("Successfully downloaded workout agenda!")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 bg-slate-100/60 hover:bg-slate-100 rounded-xl transition-all font-semibold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>

          {/* Related Function Image Banner */}
          <div className="relative h-44 rounded-2xl overflow-hidden flex items-center justify-start p-6 text-white shadow-xs">
            <img 
              src={memberPortalBanner} 
              alt="My Training Arena" 
              className="absolute inset-0 w-full h-full object-cover z-0"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent z-0" />
            <div className="space-y-1 z-10 relative">
              <span className="text-[9px] bg-sky-500 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">My Training Arena</span>
              <h3 className="font-display font-black text-xl tracking-tight mt-1.5">Unleash Your Absolute Limits</h3>
              <p className="text-xs text-slate-200/90 max-w-md">Track real-time fitness metrics, book elite group classes, schedule coach sessions, and balance daily nutritional macros.</p>
            </div>
          </div>

          {/* Grid for Members Counting chart and Popular Classes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Col: Members Counting Chart (7 Cols) */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-100/80 shadow-3xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-display font-extrabold text-slate-800">Members counting</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Weekly active enrollment distribution</p>
                </div>
                <button className="text-[10px] font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-all cursor-pointer inline-flex items-center gap-1 font-mono uppercase">
                  WEEKLY <ChevronRight className="w-3 h-3 rotate-90" />
                </button>
              </div>

              {/* Responsive SVG/CSS Bar Chart with Screenshot Precision */}
              <div className="h-56 w-full flex flex-col justify-between pt-6 select-none">
                <div className="flex-1 flex items-end justify-between gap-3 px-2 relative h-[180px]">
                  {/* Subtle Grid Line */}
                  <div className="absolute inset-x-0 bottom-0 border-b border-slate-100 pointer-events-none"></div>
                  
                  {[
                    { name: 'Jan', count: 150, active: false },
                    { name: 'Feb', count: 200, active: false },
                    { name: 'Mar', count: 260, active: false },
                    { name: 'Apr', count: 310, active: true },
                    { name: 'May', count: 220, active: false },
                    { name: 'Jun', count: 180, active: false },
                    { name: 'Jul', count: 240, active: false }
                  ].map((item, index) => {
                    const maxCount = 350;
                    const heightPercent = (item.count / maxCount) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center group relative z-10 h-full justify-end">
                        {/* Persistent/Hover Tooltip for Apr */}
                        {(item.active) && (
                          <div className="absolute bottom-[92%] mb-2 flex flex-col items-center pointer-events-none z-30 animate-fade-in whitespace-nowrap">
                            <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-[10px] font-bold shadow-md border border-slate-800">
                              <span className="text-slate-300">April</span>
                              <span className="mx-1.5 text-slate-500">•</span>
                              <span className="text-blue-400">310 members</span>
                            </div>
                            <div className="w-2.5 h-2.5 bg-slate-900 rotate-45 -mt-1.5 border-r border-b border-slate-900"></div>
                          </div>
                        )}
                        
                        {/* Bar */}
                        <div 
                          className={`w-full max-w-[28px] rounded-full transition-all duration-300 relative cursor-pointer ${
                            item.active 
                              ? 'bg-blue-600 hover:bg-blue-500 shadow-sm shadow-blue-500/20' 
                              : 'bg-slate-100 hover:bg-slate-200'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        >
                          {item.active && (
                            <span className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full opacity-60"></span>
                          )}
                        </div>
                        
                        {/* Label */}
                        <span className={`text-[10px] font-bold mt-2 font-mono ${item.active ? 'text-blue-600 font-extrabold' : 'text-slate-400'}`}>
                          {item.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Col: Popular Classes (5 Cols) */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-display font-extrabold text-slate-800">Popular Classes</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Highest attendance ratings</p>
                </div>
                <button 
                  onClick={() => setActiveTab('schedule')}
                  className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all cursor-pointer border border-slate-100"
                  title="Export"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* Class Cards matching the elegant visual style of screenshots */}
              <div className="space-y-3.5">
                {/* Class 1: Routine Workout */}
                <div 
                  className="relative group overflow-hidden rounded-2xl p-4 border border-slate-100 flex flex-col justify-between h-32 transition-all bg-cover bg-center text-white"
                  style={{ backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.85) 100%), url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=60')` }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-black tracking-wide uppercase text-white/95">Routine Workout</h4>
                      <p className="text-[10px] text-white/80 mt-0.5 line-clamp-1">Strength training program with overlapping squats.</p>
                    </div>
                    <span className="text-[9px] bg-white/20 backdrop-blur-md text-white px-2 py-1 rounded-lg font-bold border border-white/10">
                      9:30 AM
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-2 mt-2">
                    {/* Overlapping Avatars */}
                    <div className="flex -space-x-1.5 overflow-hidden">
                      <img className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop" alt="Member" referrerPolicy="no-referrer" />
                      <img className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop" alt="Member" referrerPolicy="no-referrer" />
                      <img className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop" alt="Member" referrerPolicy="no-referrer" />
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[8px] font-black text-white ring-2 ring-slate-900">+12</div>
                    </div>
                    <button 
                      onClick={() => alert("Current members attending: Alex Jones, David Smith, Chloe Bennett, Emma Watson, Chloe Miller, Sam Harris.")}
                      className="text-[10px] font-bold text-sky-400 hover:text-sky-300 transition-all cursor-pointer"
                    >
                      See all members
                    </button>
                  </div>
                </div>

                {/* Class 2: Bodybuilding */}
                <div 
                  className="relative group overflow-hidden rounded-2xl p-4 border border-slate-100 flex flex-col justify-between h-32 transition-all bg-cover bg-center text-white"
                  style={{ backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.85) 100%), url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=60')` }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-black tracking-wide uppercase text-white/95">Bodybuilding</h4>
                      <p className="text-[10px] text-white/80 mt-0.5 line-clamp-1">Heavy compound lift progressions under Sarah.</p>
                    </div>
                    <span className="text-[9px] bg-white/20 backdrop-blur-md text-white px-2 py-1 rounded-lg font-bold border border-white/10">
                      11:00 AM
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-2 mt-2">
                    {/* Overlapping Avatars */}
                    <div className="flex -space-x-1.5 overflow-hidden">
                      <img className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop" alt="Member" referrerPolicy="no-referrer" />
                      <img className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop" alt="Member" referrerPolicy="no-referrer" />
                      <img className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop" alt="Member" referrerPolicy="no-referrer" />
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[8px] font-black text-white ring-2 ring-slate-900">+8</div>
                    </div>
                    <button 
                      onClick={() => alert("Current members attending: Jakob Dorwort, Sarah Jenkins, John Watson, Chloe Bennett.")}
                      className="text-[10px] font-bold text-sky-400 hover:text-sky-300 transition-all cursor-pointer"
                    >
                      See all members
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Timeline & Interactive Scheduler Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-display font-bold text-slate-800 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-sky-500" /> Live Timetable & Interactive Scheduler
                </h3>
                <p className="text-[10px] text-slate-400">Click any class schedule block below to edit categories, trainers, salons, times and attendees live</p>
              </div>

              {/* Day Filter Slider */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
                {[
                  { label: 'MAR 27', text: 'Wed' },
                  { label: 'MAR 28', text: 'Thu' },
                  { label: 'MAR 29', text: 'Fri' },
                  { label: 'MAR 30', text: 'Sat' },
                  { label: 'APR 27', text: 'Sun', active: true },
                  { label: 'APR 28', text: 'Mon' },
                  { label: 'APR 29', text: 'Tue' }
                ].map((d, idx) => (
                  <button 
                    key={idx}
                    className={`px-3 py-1 text-[10px] font-semibold rounded-lg shrink-0 transition-all cursor-pointer ${
                      d.active 
                        ? 'bg-slate-900 text-white font-bold shadow-xs' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200/60'
                    }`}
                  >
                    {d.label} • {d.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Blocks */}
            <div className="overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none md:scrollbar-thin">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:min-w-[850px] xl:min-w-0">
                {[
                  { id: 'class_cycling', name: 'Cycling', category: 'Cardio', style: 'border-emerald-100 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-700', badgeStyle: 'bg-emerald-100 text-emerald-800' },
                  { id: 'class_bodybuilding', name: 'Bodybuilding', category: 'Strength', style: 'border-purple-100 bg-purple-500/5 hover:bg-purple-500/10 text-purple-700', badgeStyle: 'bg-purple-100 text-purple-800' },
                  { id: 'class_zumba', name: 'Zumba', category: 'Dance', style: 'border-amber-100 bg-amber-500/5 hover:bg-amber-500/10 text-amber-700', badgeStyle: 'bg-amber-100 text-amber-800' },
                  { id: 'class_swimming', name: 'Swimming', category: 'Endurance', style: 'border-teal-100 bg-teal-500/5 hover:bg-teal-500/10 text-teal-700', badgeStyle: 'bg-teal-100 text-teal-800' },
                  { id: 'class_trx', name: 'TRX training', category: 'Suspension', style: 'border-sky-100 bg-sky-500/5 hover:bg-sky-500/10 text-sky-700', badgeStyle: 'bg-sky-100 text-sky-800' }
                ].map(block => {
                  // Find matching live class from state, or auto create if missing
                  const liveClass = classes.find(c => c.id === block.id) || {
                    id: block.id,
                    name: block.id === 'class_cycling' ? 'Cardio Cycling Spin' : block.id === 'class_bodybuilding' ? 'Ultimate Bodybuilding' : block.id === 'class_zumba' ? 'Rhythm Zumba Dance' : block.id === 'class_swimming' ? 'Endurance Swimming Laps' : 'Suspension TRX Training',
                    time: block.id === 'class_cycling' ? '09:00 AM - 10:15 AM' : block.id === 'class_bodybuilding' ? '11:00 AM - 12:30 PM' : block.id === 'class_zumba' ? '02:00 PM - 03:00 PM' : block.id === 'class_swimming' ? '04:30 PM - 05:45 PM' : '07:00 PM - 08:15 PM',
                    trainerName: block.id === 'class_cycling' || block.id === 'class_zumba' ? 'Sarah Jenkins' : 'Mike Tyson-Stone',
                    capacity: 15,
                    bookedCount: block.id === 'class_cycling' ? 10 : block.id === 'class_bodybuilding' ? 8 : block.id === 'class_zumba' ? 18 : block.id === 'class_swimming' ? 4 : 6
                  };

                  return (
                    <div 
                      key={block.id}
                      onClick={() => openClassEditModal(liveClass as FitnessClass)}
                      className={`p-4 rounded-xl border flex flex-col justify-between h-48 transition-all cursor-pointer transform hover:-translate-y-1 ${block.style}`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${block.badgeStyle}`}>
                            {block.category}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {liveClass.id === 'class_cycling' ? 'Salon 1' : liveClass.id === 'class_bodybuilding' ? 'Salon 2' : 'Studio B'}
                          </span>
                        </div>
                        
                        <h4 className="font-display font-extrabold text-xs tracking-tight text-slate-800">
                          {liveClass.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-semibold font-mono">
                          {liveClass.time}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/40 flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span className="text-[10px] font-medium text-slate-600 truncate">
                            {liveClass.trainerName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-slate-500">
                          <span>Booked Capacity:</span>
                          <span className="font-bold font-mono text-slate-700">
                            {liveClass.bookedCount}/{liveClass.capacity}
                          </span>
                        </div>
                        <span className="mt-1 text-[9px] font-bold text-indigo-600 flex items-center gap-0.5 group-hover:underline">
                          Edit Schedule &rarr;
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Class Scheduler Dialog/Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg border border-slate-100 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
                <h3 className="font-display font-bold text-slate-800 text-sm">Interactive Class Scheduler</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-4">
              {/* Class Title input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Class Title</label>
                <input 
                  type="text" 
                  value={editingClassName} 
                  onChange={(e) => setEditingClassName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter custom class title..."
                />
              </div>

              {/* Quick Category Selection Pills */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Quick Category Selection</label>
                <div className="flex flex-wrap gap-1.5">
                  {['Bodybuilding', 'Body balance', 'Cardio', 'Yoga', 'Zumba', 'Cycling', 'TRX training'].map(pill => (
                    <button 
                      key={pill}
                      type="button"
                      onClick={() => {
                        setEditingClassActivePill(pill);
                        setEditingClassName(pill);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                        editingClassActivePill.toLowerCase().includes(pill.toLowerCase()) || editingClassName.toLowerCase().includes(pill.toLowerCase())
                          ? 'bg-indigo-600 text-white font-bold shadow-xs' 
                          : 'bg-slate-100 hover:bg-slate-150 text-slate-600 border border-slate-200/50'
                      }`}
                    >
                      {pill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid: Date & Time, and Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Time Slot</label>
                  <input 
                    type="text" 
                    value={editingClassTime} 
                    onChange={(e) => setEditingClassTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. 11:00 AM - 12:30 PM"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Location / Salon</label>
                  <select 
                    value={editingClassLocation}
                    onChange={(e) => setEditingClassLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Salon 1">Salon 1 (Cardio & Dance)</option>
                    <option value="Salon 2">Salon 2 (Strength & Hypertrophy)</option>
                    <option value="Yoga Studio">Yoga Studio (Zen Zone)</option>
                    <option value="Spin Cave">Spin Cave (Indoor Cycle)</option>
                    <option value="Main Stage">Main Stage (Zumba Arena)</option>
                  </select>
                </div>
              </div>

              {/* Grid: Trainer selection and capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Assigned Trainer</label>
                  <select 
                    value={editingClassTrainer}
                    onChange={(e) => setEditingClassTrainer(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Jakob Dorwort">Jakob Dorwort</option>
                    <option value="Sarah Jenkins">Sarah Jenkins</option>
                    <option value="Mike Tyson-Stone">Mike Tyson-Stone</option>
                    <option value="Alex Rivera">Alex Rivera</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Booked</label>
                    <input 
                      type="number" 
                      value={editingClassBookedCount} 
                      onChange={(e) => setEditingClassBookedCount(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      min={0}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Capacity</label>
                    <input 
                      type="number" 
                      value={editingClassCapacity} 
                      onChange={(e) => setEditingClassCapacity(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      min={1}
                    />
                  </div>
                </div>
              </div>

              {/* Attending Members list simulation */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Attending Members</label>
                  <span className="text-[10px] text-slate-400">Total: {editingClassBookedCount}</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  {/* Overlapping small circular badges with name */}
                  <div className="flex -space-x-1.5 overflow-hidden">
                    <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop" alt="Member" referrerPolicy="no-referrer" />
                    <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&auto=format&fit=crop" alt="Member" referrerPolicy="no-referrer" />
                    <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&auto=format&fit=crop" alt="Member" referrerPolicy="no-referrer" />
                    <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&auto=format&fit=crop" alt="Member" referrerPolicy="no-referrer" />
                  </div>
                  
                  {/* Simulate adding member */}
                  <button 
                    type="button"
                    onClick={() => {
                      setEditingClassBookedCount(prev => prev + 1);
                      alert("Simulated: Successfully registered active user Alex Jones as attendee!");
                    }}
                    className="h-7 px-2.5 rounded-lg border border-dashed border-slate-300 text-slate-500 hover:text-slate-800 hover:border-slate-400 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Join / Attend
                  </button>
                </div>
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-150 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={saveClassEdits}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs hover:shadow-sm cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: Book Classes Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          {/* Related Function Image Banner */}
          <div className="relative h-44 rounded-2xl overflow-hidden flex items-center justify-start p-6 text-white bg-cover bg-center shadow-xs" style={{ backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.2) 100%), url('https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&auto=format&fit=crop&q=80')` }}>
            <div className="space-y-1 z-10">
              <span className="text-[9px] bg-sky-500 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">Group Training</span>
              <h3 className="font-display font-black text-xl tracking-tight mt-1.5">Interactive Sessions</h3>
              <p className="text-xs text-slate-200/90 max-w-md">Reserve slots in our high-energy training courses led by certified personal coaches.</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
            <h3 className="font-display font-semibold text-slate-800 text-sm">Fitness Class Timetable Schedule</h3>
            <p className="text-slate-400 text-[10px]">Reserve your training spots. Classes feature strict attendance checks by coaches.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gymClasses.map(cls => {
              const isBooked = myBookings.some(b => b.classId === cls.id);
              const isFull = cls.bookedCount >= cls.capacity;

              return (
                <div key={cls.id} className={`bg-white rounded-xl border p-5 flex flex-col justify-between transition-all ${
                  isBooked ? 'border-indigo-600 shadow-sm ring-1 ring-indigo-600/5' : 'border-slate-100 shadow-xs'
                }`}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        {cls.day}
                      </span>
                      <span className="text-slate-500 text-xs font-semibold flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {cls.time}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-slate-800 text-sm">{cls.name}</h4>
                    <p className="text-xs text-slate-500 leading-normal">{cls.description}</p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-[8px] text-slate-400 block uppercase">Coach</span>
                        <span className="font-bold text-slate-700">{cls.trainerName}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] text-slate-400 block uppercase">Bookings</span>
                        <span className={`font-bold ${isFull ? 'text-rose-600' : 'text-slate-800'}`}>
                          {cls.bookedCount} / {cls.capacity} spots
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleToggleBooking(cls.id, cls.name, isBooked)}
                      className={`w-full py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        isBooked 
                          ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' 
                          : isFull 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                      }`}
                    >
                      {isBooked ? 'Cancel Reservation' : isFull ? 'Class Fully Booked' : 'Reserve Spot'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: My Exercise Workout Routine */}
      {activeTab === 'workouts' && (
        <div className="space-y-6 w-full col-span-full">
          {/* Related Function Image Banner */}
          <div className="relative h-44 rounded-2xl overflow-hidden flex items-center justify-start p-6 text-white bg-cover bg-center shadow-xs" style={{ backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.2) 100%), url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80')` }}>
            <div className="space-y-1 z-10">
              <span className="text-[9px] bg-sky-500 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">Exercises & Routines</span>
              <h3 className="font-display font-black text-xl tracking-tight mt-1.5">Strength Program</h3>
              <p className="text-xs text-slate-200/90 max-w-md">Progressive physical resistance training. Track sets, repetitions, and rest periods.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs lg:col-span-2 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-slate-800 text-sm">
                {workoutPlan ? workoutPlan.title : 'General Fitness Exercises Routine'}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {workoutPlan ? workoutPlan.description : 'Welcome to your training routines. Follow reps and sets prescribed by coach.'}
              </p>
            </div>

            <div className="space-y-2.5">
              {(workoutPlan ? workoutPlan.exercises : [
                { name: 'Warm-Up Treadmill', sets: 1, reps: '10 mins', rest: 'None' },
                { name: 'Compound Barbell Squat', sets: 4, reps: '10 reps', rest: '90s' },
                { name: 'Dumbbell Incline Bench Press', sets: 4, reps: '12 reps', rest: '60s' },
                { name: 'Hanging Leg Raises', sets: 3, reps: '15 reps', rest: '45s' }
              ]).map((ex, idx) => {
                const isCompleted = completedExercises[ex.name];
                
                return (
                  <div key={idx} className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                    isCompleted ? 'bg-slate-50/50 border-slate-200 opacity-60' : 'bg-white border-slate-100 shadow-2xs'
                  }`}>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleToggleExercise(ex.name)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                          isCompleted ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 hover:border-indigo-600'
                        }`}
                      >
                        {isCompleted && <Check className="w-3.5 h-3.5" />}
                      </button>
                      <div>
                        <span className={`text-xs font-bold block ${isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {ex.name}
                        </span>
                        <div className="flex gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                          <span>Sets: <strong className="text-slate-600">{ex.sets}</strong></span>
                          <span>•</span>
                          <span>Reps: <strong className="text-slate-600">{ex.reps}</strong></span>
                          <span>•</span>
                          {ex.rest && <span>Rest: <strong className="text-slate-600">{ex.rest}</strong></span>}
                        </div>
                      </div>
                    </div>

                    <div className="p-1.5 rounded-lg bg-indigo-50/50 text-indigo-600">
                      <Dumbbell className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SIDEBAR TIPS */}
          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs h-fit space-y-4">
            <h4 className="font-display font-semibold text-slate-800 text-xs flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-500 fill-indigo-500" /> Coaching Pro-Tips
            </h4>
            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>1. **Mind-Muscle Connection**: Focus entirely on stretching and contracting the target muscle tissue rather than just throwing the weight up.</p>
              <p>2. **Hydration Levels**: Consume at least 750ml of clean water during active workout training sessions.</p>
              <p>3. **Progressive Overload**: Try to add a rep or 1.25kg to your barbell exercises each week to continually force muscular hypertrophy adaptions.</p>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* VIEW: Nutrition Diet Plan */}
      {activeTab === 'nutrition' && (
        <div className="space-y-6 w-full col-span-full">
          {/* Related Function Image Banner */}
          <div className="relative h-44 rounded-2xl overflow-hidden flex items-center justify-start p-6 text-white bg-cover bg-center shadow-xs" style={{ backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.2) 100%), url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&auto=format&fit=crop&q=80')` }}>
            <div className="space-y-1 z-10">
              <span className="text-[9px] bg-sky-500 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">Nutritional Fueling</span>
              <h3 className="font-display font-black text-xl tracking-tight mt-1.5">Diet Plan & macros</h3>
              <p className="text-xs text-slate-200/90 max-w-md">Fuel muscular adaptation and track progressive daily caloric intake targets configured by your coach.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs lg:col-span-2 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-slate-800 text-sm">
                  {nutritionPlan ? nutritionPlan.title : 'Standard Nutrition Meal Planner'}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Dispatched by Coach Jenkins. Track calorie levels daily.</p>
              </div>

              {/* Calculated total calories */}
              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Intake</span>
                <span className="text-sm font-extrabold text-indigo-600">
                  {nutritionPlan 
                    ? nutritionPlan.meals.reduce((acc, m) => acc + m.calories, 0) 
                    : 1230} kcal
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 space-y-1">
              {(nutritionPlan ? nutritionPlan.meals : [
                { time: '08:00 AM', name: 'Breakfast Intake', items: ['Oats', 'Blueberries', 'Whey protein'], calories: 410 },
                { time: '01:00 PM', name: 'Lunch Box', items: ['Chicken Breast', 'Jasmine rice', 'Broccoli'], calories: 520 },
                { time: '07:30 PM', name: 'Lean Dinner', items: ['Salmon filet', 'Mashed sweet potato', 'Asparagus'], calories: 480 }
              ]).map((meal, idx) => (
                <div key={idx} className="py-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="bg-slate-100 font-mono text-[9px] font-bold text-slate-500 px-2 py-1 rounded shrink-0 w-20 text-center">
                      {meal.time}
                    </span>
                    <div>
                      <strong className="text-slate-800 text-xs block">{meal.name}</strong>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {meal.items.map((item, iIdx) => (
                          <span key={iIdx} className="bg-slate-50 border border-slate-150 px-2 py-0.5 rounded text-[10px] text-slate-600">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-extrabold text-slate-600 shrink-0">
                    {meal.calories} kcal
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CALORIE PROGRESS GRAPH */}
          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs space-y-4">
            <h4 className="font-display font-semibold text-slate-800 text-xs">Calorie Deficit Progression</h4>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Current Target Limit</span>
                  <span className="font-bold text-slate-800">1,800 kcal</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100/30 text-xs text-slate-600 leading-relaxed">
                Consume high quality lean protein (approx 2g per kg bodyweight) to sustain lean muscle mass tissue while preserving strength in a deficit.
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* VIEW: Weight Progress Logger */}
      {activeTab === 'progress' && (
        <div className="space-y-6 w-full col-span-full">
          {/* Related Function Image Banner */}
          <div className="relative h-44 rounded-2xl overflow-hidden flex items-center justify-start p-6 text-white bg-cover bg-center shadow-xs" style={{ backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.2) 100%), url('https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=1200&auto=format&fit=crop&q=80')` }}>
            <div className="space-y-1 z-10">
              <span className="text-[9px] bg-sky-500 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">Biometrics Center</span>
              <h3 className="font-display font-black text-xl tracking-tight mt-1.5">Weight & Progress Curve</h3>
              <p className="text-xs text-slate-200/90 max-w-md">Log real-time body mass indexes, muscular density improvements, and body fat ratios.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LOG WEIGHT FORM */}
          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5">
              Log Weight Progress
            </h3>

            <form onSubmit={handleLogProgress} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Current Weight (kg)</label>
                <input 
                  required
                  type="number" 
                  step="0.1"
                  value={newWeight} 
                  onChange={(e) => setNewWeight(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded p-1.5 text-xs focus:outline-indigo-500" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Estimated Body Fat % (Optional)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={newBodyFat} 
                  onChange={(e) => setNewBodyFat(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded p-1.5 text-xs focus:outline-indigo-500" 
                />
              </div>
              <button type="submit" id="log-weight-btn" className="w-full py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer">
                <Scale className="w-4 h-4" /> Save Metric Log
              </button>
            </form>
          </div>

          {/* HISTORICAL CHART / GRID */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-5 shadow-xs space-y-4">
            <h3 className="font-display font-semibold text-slate-800 text-sm">Weight Progression Curve</h3>
            
            {/* Custom visual charting! */}
            <div className="h-44 flex items-end justify-between gap-2 border-b border-slate-200 pb-4 pt-4">
              {myWeightLogs.map((log, idx) => {
                // Calculate height relative to max weight in logs (to scale nicely)
                const weights = myWeightLogs.map(w => w.weight);
                const minW = Math.min(...weights) - 2;
                const maxW = Math.max(...weights) + 2;
                const range = maxW - minW;
                const pct = range > 0 ? ((log.weight - minW) / range) * 100 : 50;

                return (
                  <div key={log.id} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Hover Tooltip */}
                    <div className="absolute bottom-full mb-1 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-mono">
                      {log.weight} kg {log.bodyFat ? `• BF: ${log.bodyFat}%` : ''}
                    </div>

                    <div className="w-full bg-slate-100 hover:bg-indigo-50 rounded-md transition-all flex items-end h-28 cursor-pointer">
                      <div 
                        className="bg-indigo-600 hover:bg-indigo-700 rounded-md w-full transition-all"
                        style={{ height: `${Math.max(10, pct)}%` }}
                      ></div>
                    </div>
                    
                    <span className="text-[9px] text-slate-400 font-mono truncate max-w-full">
                      {log.date.substring(5)}
                    </span>
                  </div>
                );
              })}
              {myWeightLogs.length === 0 && (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                  No weight history recorded yet. Input logs on the left to generate graphs.
                </div>
              )}
            </div>

            {/* WEIGHT METRICS MATRIX */}
            <div className="grid grid-cols-3 gap-4 text-center py-2 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <span className="text-slate-400 text-[8px] uppercase block">Starting weight</span>
                <span className="font-bold text-slate-700 text-xs">{myWeightLogs[0]?.weight || member.weight} kg</span>
              </div>
              <div className="border-x border-slate-200">
                <span className="text-slate-400 text-[8px] uppercase block">Current weight</span>
                <span className="font-bold text-slate-800 text-xs">
                  {myWeightLogs[myWeightLogs.length - 1]?.weight || member.weight} kg
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[8px] uppercase block">Target weight</span>
                <span className="font-bold text-indigo-600 text-xs">{member.targetWeight || 70} kg</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* VIEW: Coach Messages */}
      {activeTab === 'messages' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Related Function Image Banner */}
          <div className="relative h-40 rounded-2xl overflow-hidden flex items-center justify-start p-6 text-white bg-cover bg-center shadow-xs" style={{ backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.2) 100%), url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&auto=format&fit=crop&q=80')` }}>
            <div className="space-y-1 z-10">
              <span className="text-[9px] bg-sky-500 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">Coach Chat</span>
              <h3 className="font-display font-black text-xl tracking-tight mt-1">1-on-1 Consultations</h3>
              <p className="text-xs text-slate-200/90 max-w-sm">Direct, real-time messaging with your assigned personal athletic trainer.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-xs flex flex-col h-[520px] overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <div>
                <strong className="text-slate-800 text-xs block">{trainer ? trainer.name : 'Gym Trainer support'}</strong>
                <span className="text-[10px] text-slate-400">Personal Athletic Coach</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">ENCRYPTED PORTAL</span>
          </div>

          {/* CHAT CHRONICLES STREAM */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {chatLog.map((chat, idx) => {
              const isMe = chat.sender === 'member';
              
              return (
                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl px-3.5 py-2 text-xs shadow-2xs ${
                    isMe 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-150 text-slate-800 rounded-tl-none'
                  }`}>
                    <p className="leading-relaxed">{chat.text}</p>
                    <span className={`block text-[9px] text-right mt-1.5 ${isMe ? 'text-white/60' : 'text-slate-400'}`}>
                      {chat.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* INPUT FORM */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white flex gap-2">
            <input 
              type="text" 
              placeholder="Ask coach Sarah Jenkins a training question..." 
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-indigo-500 bg-slate-50 focus:bg-white transition-all" 
            />
            <button type="submit" id="send-chat-btn" className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1 cursor-pointer">
              Send <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
      )}

      {/* VIEW: Membership Pass Tab */}
      {activeTab === 'pass' && (
        <div className="space-y-6">
          {/* Header Description */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-display font-semibold text-slate-800 text-sm flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-sky-500" /> Digital Membership Pass
              </h3>
              <p className="text-slate-400 text-[10px]">Your verified credentials to access GymCore HQ locations, check in, and claim premium partner rewards.</p>
            </div>
            
            {/* Quick Stats: Check-in counts */}
            <div className="flex gap-4 font-mono text-xs">
              <div className="bg-sky-50/50 border border-sky-100/50 rounded-lg px-3 py-1.5 text-center">
                <span className="text-[9px] text-slate-400 block uppercase font-semibold">Total Visits</span>
                <span className="font-bold text-sky-700">{myAttendance.length} Checked In</span>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-lg px-3 py-1.5 text-center">
                <span className="text-[9px] text-slate-400 block uppercase font-semibold">Pass Tier</span>
                <span className="font-bold text-emerald-600">VIP GOLD</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* COLUMN 1: DIGITAL PASS CARD & BARCODE SCANNER */}
            <div className="space-y-4">
              {/* The Pass Card itself */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-sky-950 text-white rounded-2xl p-5 shadow-xl border border-slate-800 relative overflow-hidden group">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-700 group-hover:scale-125"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-sky-400/5 rounded-full blur-xl -ml-6 -mb-6"></div>
                
                {/* Header info */}
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-sky-400 font-mono font-bold">GymCore Member Pass</span>
                    <h4 className="text-sm font-extrabold tracking-tight font-display mt-0.5">Apex Unlimited Gold Pass</h4>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sky-300 font-bold font-display shadow-inner">
                    G
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="mt-6 flex items-center gap-1.5 relative z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">Status: ACTIVE</span>
                </div>

                {/* Card Holder Details */}
                <div className="mt-10 flex justify-between items-end border-t border-white/10 pt-4 relative z-10">
                  <div className="space-y-1">
                    <span className="text-[8px] text-slate-400 uppercase font-mono block">Pass Holder</span>
                    <span className="text-xs font-bold font-display">{member.name}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-[8px] text-slate-400 uppercase font-mono block">Pass ID</span>
                    <span className="text-xs font-mono font-bold text-slate-200">APX-9823-GLD</span>
                  </div>
                </div>

                {/* Valid dates */}
                <div className="mt-3 flex justify-between items-center text-[9px] text-slate-400 font-mono relative z-10">
                  <span>Issued: {member.joinedDate || '2026-01-15'}</span>
                  <span>Expires: {member.expiryDate || '2026-12-31'}</span>
                </div>
              </div>

              {/* BARCODE / SCANNER CONTAINER FOR CHECK-IN */}
              <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-3 bg-sky-50 rounded-xl">
                  {/* Digital barcode made with premium layout elements and QR Code concept */}
                  <div className="w-48 h-12 bg-white flex items-center justify-between px-1 py-1.5 border border-slate-200 rounded overflow-hidden">
                    {/* Generative lines for barcode styling */}
                    <div className="flex gap-0.5 w-full h-full justify-center">
                      {[3, 1, 4, 1, 5, 2, 6, 1, 3, 2, 5, 1, 4, 3, 1, 2, 4, 1, 5, 2, 3, 1, 4, 2].map((weight, i) => (
                        <div 
                          key={i} 
                          className="bg-slate-800 h-full" 
                          style={{ width: `${weight * 1.5}px` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 mt-1.5 block">APX-MEMBER-9823-GLD</span>
                </div>

                <div className="space-y-2 w-full">
                  <h5 className="text-xs font-bold text-slate-800">Quick Check-in Scanner</h5>
                  <p className="text-[10px] text-slate-500 max-w-xs leading-normal">Simulate scanning your digital membership barcode at the front desk kiosk scanner.</p>
                  
                  {checkInSuccess ? (
                    <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-[11px] font-medium flex items-center justify-center gap-1.5 animate-fade-in">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" /> {checkInSuccess}
                    </div>
                  ) : (
                    <button
                      onClick={handleGymCheckIn}
                      className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-600/10 hover:shadow-lg hover:shadow-sky-600/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <QrCode className="w-4 h-4" /> Scan Barcode (Check In)
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* COLUMN 2: GOLD TIER BENEFITS & INCLUSIONS */}
            <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs space-y-4">
              <h4 className="font-display font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-500" /> Premium Benefits Included
              </h4>
              
              <div className="space-y-2.5">
                {[
                  { name: 'All Gym & Cardio Zones', desc: 'Unlimited full-day access to all weight rooms, cardio decks, and functional hubs.' },
                  { name: 'VIP Sauna & Steam Suite', desc: 'Indulge in premium wet and dry thermal suites located inside locker rooms.' },
                  { name: '15% Smoothie Bar Discount', desc: 'Exclusive Member Barcode for premium high-protein shakes and nutrition supplements.' },
                  { name: 'Complimentary Clean Towels', desc: 'Get a sanitized fresh premium towel at the reception desk upon each visit.' },
                  { name: 'Priority Group Class Booking', desc: 'Book scheduled yoga, strength, and spin training classes 48 hours early.' },
                ].map((b, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-slate-50 bg-slate-50/30 flex items-start gap-2.5">
                    <div className="p-1 rounded-full bg-sky-50 text-sky-600 shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="text-[11px] font-bold text-slate-800 block">{b.name}</strong>
                      <span className="text-[10px] text-slate-500 leading-normal block mt-0.5">{b.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 3: GUEST PASS DISPATCHER & SUBSCRIPTION */}
            <div className="space-y-6">
              
              {/* Guest pass dispatcher form */}
              <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-2.5">
                  <h4 className="font-display font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                    <Ticket className="w-4 h-4 text-sky-500" /> Guest Pass Dispatcher
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Generate direct entry access codes for your friends. You have <strong>{5 - guestPassesUsed.length} / 5</strong> remaining this month.</p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Friend's Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-2 text-xs focus:outline-sky-500 bg-slate-50 focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <button
                    onClick={handleGenerateGuestPass}
                    disabled={guestPassesUsed.length >= 5 || !guestName.trim()}
                    className={`w-full py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      guestPassesUsed.length >= 5 || !guestName.trim()
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-sky-600 text-white hover:bg-sky-700 shadow-sm shadow-sky-600/10 active:scale-95'
                    }`}
                  >
                    <Plus className="w-4 h-4" /> Dispatch Pass Access Code
                  </button>

                  {/* Active guest passes list */}
                  {guestPassesUsed.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-150">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Active Guest Invitations</span>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto">
                        {guestPassesUsed.map((g, idx) => {
                          const [name, code] = g.split('|||');
                          return (
                            <div key={idx} className="flex justify-between items-center p-2 rounded bg-sky-50/50 border border-sky-100/30 text-[10px] font-mono">
                              <span className="text-slate-700 font-sans font-bold">{name}</span>
                              <span className="text-sky-700 font-bold uppercase tracking-widest">{code}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Subscription Billing Details */}
              <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs space-y-4">
                <h4 className="font-display font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-sky-500" /> Billing & Renewal Summary
                </h4>

                <div className="space-y-2 text-xs font-mono leading-relaxed text-slate-600">
                  <div className="flex justify-between border-b border-slate-50 pb-1.5">
                    <span className="text-slate-400">Monthly Plan Fee</span>
                    <span className="font-bold text-slate-800">$79.00 / mo</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1.5">
                    <span className="text-slate-400">Payment Instrument</span>
                    <span className="font-bold text-slate-800">Visa ending in •••• 4242</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1.5">
                    <span className="text-slate-400">Next Auto-Renewal</span>
                    <span className="font-bold text-slate-800">August 01, 2026</span>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => alert('Invoice loaded! Mock PDF receipt downloaded successfully.')}
                  className="w-full py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 transition-all cursor-pointer text-center"
                >
                  Download Recent Invoice
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
