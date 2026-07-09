import React, { useState } from 'react';
import { 
  Users, 
  Dumbbell, 
  Apple, 
  Calendar, 
  Check, 
  X, 
  Star, 
  ClipboardList, 
  TrendingUp, 
  Activity, 
  Plus, 
  Save, 
  User, 
  Award,
  Search,
  BookOpen
} from 'lucide-react';
import { 
  Trainer, 
  Member, 
  FitnessClass, 
  Booking, 
  Attendance, 
  WorkoutPlan, 
  NutritionPlan,
  Exercise,
  Meal
} from '../types';
import { db } from '../data/mockData';

interface TrainerDashboardProps {
  trainer: Trainer;
  clients: Member[];
  classes: FitnessClass[];
  bookings: Booking[];
  attendance: Attendance[];
  workoutPlans: WorkoutPlan[];
  nutritionPlans: NutritionPlan[];
  onWorkoutPlansUpdate: (plans: WorkoutPlan[]) => void;
  onNutritionPlansUpdate: (plans: NutritionPlan[]) => void;
  onAttendanceUpdate: (attendance: Attendance[]) => void;
  onLogsUpdate: (logs: any) => void;
  currentUser: any;
  activeTab?: 'clients' | 'attendance' | 'trainer_analytics';
  onTabChange?: (tab: 'clients' | 'attendance' | 'trainer_analytics') => void;
}

export default function TrainerDashboard({
  trainer,
  clients,
  classes,
  bookings,
  attendance,
  workoutPlans,
  nutritionPlans,
  onWorkoutPlansUpdate,
  onNutritionPlansUpdate,
  onAttendanceUpdate,
  onLogsUpdate,
  currentUser,
  activeTab: controlledActiveTab,
  onTabChange
}: TrainerDashboardProps) {
  const [localActiveTab, setLocalActiveTab] = useState<'clients' | 'attendance' | 'trainer_analytics'>('clients');
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : localActiveTab;
  const setActiveTab = onTabChange !== undefined ? onTabChange : setLocalActiveTab;

  // Client Selection for plan edits
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [plannerTab, setPlannerTab] = useState<'workout' | 'nutrition'>('workout');

  // Workout Plan Edit States
  const [workTitle, setWorkTitle] = useState('');
  const [workDesc, setWorkDesc] = useState('');
  const [workExercises, setWorkExercises] = useState<Exercise[]>([
    { name: 'Squats', sets: 4, reps: '10 reps', rest: '90s' }
  ]);

  // Nutrition Plan Edit States
  const [nutTitle, setNutTitle] = useState('');
  const [nutMeals, setNutMeals] = useState<Meal[]>([
    { time: '08:00 AM', name: 'Breakfast', items: ['Oats', 'Eggs'], calories: 400 }
  ]);

  // Class Selection for Attendance marking
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  // 1. Calculations & Filters
  const myClients = clients.filter(m => m.trainerId === trainer.id);
  const myClasses = classes.filter(c => c.trainerId === trainer.id);

  // 1RM performance calculator states
  const [calcClient, setCalcClient] = useState(myClients[0]?.id || '');
  const [calcWeight, setCalcWeight] = useState(80);
  const [calcReps, setCalcReps] = useState(5);
  const [calcEx, setCalcEx] = useState('Back Squat');

  // Load existing plans when a client is selected
  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId);
    
    // Check for existing workout plan
    const existingWorkout = workoutPlans.find(wp => wp.memberId === clientId && wp.trainerId === trainer.id);
    if (existingWorkout) {
      setWorkTitle(existingWorkout.title);
      setWorkDesc(existingWorkout.description);
      setWorkExercises(existingWorkout.exercises);
    } else {
      setWorkTitle('Custom Strength Conditioning');
      setWorkDesc('Custom target fitness plan tailored to your health goals.');
      setWorkExercises([{ name: 'Barbell Squats', sets: 4, reps: '8 reps', rest: '120s' }]);
    }

    // Check for existing nutrition plan
    const existingNutrition = nutritionPlans.find(np => np.memberId === clientId && np.trainerId === trainer.id);
    if (existingNutrition) {
      setNutTitle(existingNutrition.title);
      setNutMeals(existingNutrition.meals);
    } else {
      setNutTitle('Caloric Deficit High Protein Fueling');
      setNutMeals([
        { time: '08:00 AM', name: 'Breakfast', items: ['3 Egg whites', '1 slice Whole wheat toast'], calories: 300 }
      ]);
    }
  };

  // Workout Plan Action Handlers
  const handleAddExerciseRow = () => {
    setWorkExercises([...workExercises, { name: '', sets: 3, reps: '10 reps', rest: '60s' }]);
  };

  const handleRemoveExerciseRow = (index: number) => {
    setWorkExercises(workExercises.filter((_, idx) => idx !== index));
  };

  const handleExerciseChange = (index: number, key: keyof Exercise, value: any) => {
    const updated = workExercises.map((ex, idx) => {
      if (idx === index) {
        return { ...ex, [key]: value };
      }
      return ex;
    });
    setWorkExercises(updated);
  };

  const handleSaveWorkoutPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return;

    const existingIdx = workoutPlans.findIndex(wp => wp.memberId === selectedClientId && wp.trainerId === trainer.id);
    
    const newPlan: WorkoutPlan = {
      id: existingIdx >= 0 ? workoutPlans[existingIdx].id : `wp_${Date.now()}`,
      memberId: selectedClientId,
      trainerId: trainer.id,
      title: workTitle,
      description: workDesc,
      exercises: workExercises.filter(ex => ex.name.trim() !== ''),
      updatedAt: new Date().toISOString().split('T')[0]
    };

    let updatedPlans: WorkoutPlan[];
    if (existingIdx >= 0) {
      updatedPlans = workoutPlans.map((wp, idx) => idx === existingIdx ? newPlan : wp);
    } else {
      updatedPlans = [...workoutPlans, newPlan];
    }

    onWorkoutPlansUpdate(updatedPlans);
    db.workoutPlans = updatedPlans;

    const targetClient = clients.find(c => c.id === selectedClientId);
    db.addLog('MEMBER', `Trainer ${trainer.name} updated workout routine for client "${targetClient?.name}"`, currentUser.name);
    onLogsUpdate(db.logs);
    alert('Workout routine updated and dispatched to client successfully!');
  };

  // Nutrition Plan Action Handlers
  const handleAddMealRow = () => {
    setNutMeals([...nutMeals, { time: '12:00 PM', name: 'Lunch', items: [''], calories: 450 }]);
  };

  const handleRemoveMealRow = (index: number) => {
    setNutMeals(nutMeals.filter((_, idx) => idx !== index));
  };

  const handleMealChange = (index: number, key: keyof Meal, value: any) => {
    const updated = nutMeals.map((meal, idx) => {
      if (idx === index) {
        return { ...meal, [key]: value };
      }
      return meal;
    });
    setNutMeals(updated);
  };

  const handleMealItemsChange = (index: number, val: string) => {
    const updated = nutMeals.map((meal, idx) => {
      if (idx === index) {
        return { ...meal, items: val.split(',').map(i => i.trim()).filter(Boolean) };
      }
      return meal;
    });
    setNutMeals(updated);
  };

  const handleSaveNutritionPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return;

    const existingIdx = nutritionPlans.findIndex(np => np.memberId === selectedClientId && np.trainerId === trainer.id);

    const newPlan: NutritionPlan = {
      id: existingIdx >= 0 ? nutritionPlans[existingIdx].id : `np_${Date.now()}`,
      memberId: selectedClientId,
      trainerId: trainer.id,
      title: nutTitle,
      meals: nutMeals.filter(m => m.name.trim() !== ''),
      updatedAt: new Date().toISOString().split('T')[0]
    };

    let updatedPlans: NutritionPlan[];
    if (existingIdx >= 0) {
      updatedPlans = nutritionPlans.map((np, idx) => idx === existingIdx ? newPlan : np);
    } else {
      updatedPlans = [...nutritionPlans, newPlan];
    }

    onNutritionPlansUpdate(updatedPlans);
    db.nutritionPlans = updatedPlans;

    const targetClient = clients.find(c => c.id === selectedClientId);
    db.addLog('MEMBER', `Trainer ${trainer.name} updated diet planner for client "${targetClient?.name}"`, currentUser.name);
    onLogsUpdate(db.logs);
    alert('Nutrition fuel planner saved and dispatched to client!');
  };

  // Attendance Marking
  const handleMarkAttendance = (memberId: string, classId: string, className: string, status: 'PRESENT' | 'ABSENT') => {
    // Generate fresh record
    const newRecord: Attendance = {
      id: `att_${Date.now()}`,
      memberId,
      classId,
      className,
      date: new Date().toISOString().split('T')[0],
      status
    };

    // Remove any same-day same-class duplicates
    const filtered = attendance.filter(a => !(a.memberId === memberId && a.classId === classId && a.date === newRecord.date));
    const updated = [newRecord, ...filtered];

    onAttendanceUpdate(updated);
    db.attendance = updated;

    const targetClient = clients.find(c => c.id === memberId);
    db.addLog('MEMBER', `Coach marked attendance for ${targetClient?.name} in "${className}" as ${status}`, currentUser.name);
    onLogsUpdate(db.logs);
  };

  return (
    <div className="space-y-6">
      {/* Trainer Profile Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img 
            src={trainer.id === 'user_trainer_sarah' ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120" : "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"} 
            alt="Trainer Bio" 
            className="w-14 h-14 rounded-2xl object-cover bg-slate-50"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-display font-semibold tracking-tight text-slate-900">{trainer.name}</h2>
              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" /> {trainer.rating} rating
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-0.5 max-w-xl italic">"{trainer.bio}"</p>
          </div>
        </div>

        {/* Navigation Selector */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100/80 p-1 border border-slate-200 rounded-lg text-xs font-semibold shrink-0 self-start xl:self-auto">
          <button 
            onClick={() => setActiveTab('clients')}
            className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === 'clients' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            My Client Roster ({myClients.length})
          </button>
          <button 
            onClick={() => {
              setActiveTab('attendance');
              if (myClasses[0]) setSelectedClassId(myClasses[0].id);
            }}
            className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === 'attendance' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Teach &amp; Attend registers ({myClasses.length})
          </button>
          <button 
            onClick={() => setActiveTab('trainer_analytics')}
            className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === 'trainer_analytics' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Client Progress &amp; Workload
          </button>
        </div>
      </div>

      {/* Trainer Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Assigned Members</span>
            <div className="text-2xl font-bold font-display text-slate-900">{myClients.length} Clients</div>
            <div className="text-[11px] text-slate-500">1-on-1 athletic coaching focus</div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Today's Class Schedule</span>
            <div className="text-2xl font-bold font-display text-slate-900">{myClasses.length} Scheduled</div>
            <div className="text-[11px] text-slate-500">Scheduled active hours</div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Coach Experience</span>
            <div className="text-2xl font-bold font-display text-slate-900">{trainer.experienceYears} Years</div>
            <div className="text-[11px] text-slate-500">Certified industry professional</div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Estimated Earnings</span>
              <div className="text-2xl font-bold font-display text-emerald-600">
                ${(myClasses.length * 45 * 4 + myClients.length * 25).toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider leading-none mt-0.5">
                32 hrs billed • {myClients.length} clients
              </p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          {/* Handbuilt SVG Weekly payout bar series */}
          <div className="mt-3 pt-2.5 border-t border-slate-50">
            <div className="flex items-end justify-between h-9 gap-2 px-1">
              {[
                { label: 'W1', amt: 500 },
                { label: 'W2', amt: 620 },
                { label: 'W3', amt: 480 },
                { label: 'W4', amt: 750 }
              ].map((w, idx) => {
                const maxAmt = 800;
                const pct = (w.amt / maxAmt) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    {/* Tiny tooltip */}
                    <div className="absolute bottom-full mb-1 hidden group-hover:block bg-slate-900 text-white text-[8px] px-1 py-0.5 rounded font-mono font-bold z-15 whitespace-nowrap">
                      ${w.amt}
                    </div>
                    <div 
                      style={{ height: `${pct}%` }} 
                      className="w-full bg-emerald-500/20 group-hover:bg-emerald-500/35 rounded-xs transition-all h-full min-h-[4px] cursor-pointer"
                    ></div>
                    <span className="text-[8px] text-slate-400 font-mono font-bold mt-1 leading-none">{w.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* VIEW: Clients and Workout/Nutrition Planners */}
      {activeTab === 'clients' && (
        <div className="space-y-6 w-full col-span-full">
          {/* Related Function Image Banner */}
          <div className="relative h-44 rounded-2xl overflow-hidden flex items-center justify-start p-6 text-white bg-cover bg-center shadow-xs" style={{ backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.2) 100%), url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&auto=format&fit=crop&q=80')` }}>
            <div className="space-y-1 z-10">
              <span className="text-[9px] bg-indigo-500 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">Client Coaching</span>
              <h3 className="font-display font-black text-xl tracking-tight mt-1.5">Athlete Roster & Planners</h3>
              <p className="text-xs text-slate-200/90 max-w-md">Assign comprehensive muscle hypertrophic lifting schemes and custom high-protein deficit meal plans.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CLIENT LIST COLUMN */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-semibold text-slate-800 text-sm">Active Member Clients</h3>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-mono font-bold">LIFETIME</span>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {myClients.map(client => {
                const isSelected = selectedClientId === client.id;
                
                return (
                  <button
                    key={client.id}
                    id={`select-client-${client.name.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => handleSelectClient(client.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50/20 text-slate-900 font-semibold' 
                        : 'border-slate-100 hover:border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={client.email === 'alex.jones@gmail.com' ? "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=80" : `https://api.dicebear.com/7.x/avataaars/svg?seed=${client.name}`} 
                        alt="avatar" 
                        className="w-10 h-10 rounded-full bg-slate-100 object-cover" 
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-800 leading-tight">{client.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{client.email}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-500 block">Weight</span>
                      <span className="text-xs font-extrabold text-slate-700">{client.weight} kg</span>
                    </div>
                  </button>
                );
              })}
              {myClients.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs">
                  You do not have any assigned clients. Ask your Gym Admin to delegate members to you.
                </div>
              )}
            </div>
          </div>

          {/* ACTIVE CLIENT WORKOUT/NUTRITION PLANNER COLUMN */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-xs p-5 space-y-4">
            {selectedClientId ? (
              (() => {
                const activeClient = clients.find(c => c.id === selectedClientId);
                
                return (
                  <div className="space-y-4">
                    {/* Header showing Active Client health parameters */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="font-display font-semibold text-slate-800 text-sm">Prescribing Fitness &amp; Diet Plan</h3>
                        <p className="text-[11px] text-slate-500">Client: <span className="font-bold text-slate-700">{activeClient?.name}</span></p>
                      </div>

                      <div className="flex gap-2 text-xs font-mono bg-slate-50 p-2 rounded-lg border border-slate-150">
                        <div>
                          <span className="text-slate-400 block text-[8px] uppercase">Starting</span>
                          <span className="font-bold text-slate-700">{activeClient?.weight} kg</span>
                        </div>
                        <div className="border-l border-slate-200 pl-2">
                          <span className="text-slate-400 block text-[8px] uppercase">Target</span>
                          <span className="font-bold text-indigo-600">{activeClient?.targetWeight} kg</span>
                        </div>
                        <div className="border-l border-slate-200 pl-2">
                          <span className="text-slate-400 block text-[8px] uppercase">Height</span>
                          <span className="font-bold text-slate-700">{activeClient?.height} cm</span>
                        </div>
                      </div>
                    </div>

                    {/* Selector of Plan Type */}
                    <div className="flex gap-1 bg-slate-50 p-1 border border-slate-150 rounded-lg text-xs">
                      <button
                        onClick={() => setPlannerTab('workout')}
                        className={`flex-1 py-1.5 rounded-md font-semibold flex items-center justify-center gap-1.5 transition-colors ${plannerTab === 'workout' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        <Dumbbell className="w-3.5 h-3.5" /> Prescribe Workout Routine
                      </button>
                      <button
                        onClick={() => setPlannerTab('nutrition')}
                        className={`flex-1 py-1.5 rounded-md font-semibold flex items-center justify-center gap-1.5 transition-colors ${plannerTab === 'nutrition' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        <Apple className="w-3.5 h-3.5" /> Nutrition Diet Planner
                      </button>
                    </div>

                    {/* PLANNER TAB: WORKOUT EDITOR */}
                    {plannerTab === 'workout' && (
                      <form onSubmit={handleSaveWorkoutPlan} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Routine Title</label>
                          <input 
                            required 
                            type="text" 
                            value={workTitle} 
                            onChange={(e)=>setWorkTitle(e.target.value)} 
                            className="w-full border border-slate-200 rounded p-1.5 text-xs focus:outline-indigo-500" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Coaching Instructions</label>
                          <textarea 
                            value={workDesc} 
                            onChange={(e)=>setWorkDesc(e.target.value)} 
                            className="w-full border border-slate-200 rounded p-1.5 text-xs h-16 focus:outline-indigo-500" 
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">
                            <span>Exercises Exercises List</span>
                            <button type="button" onClick={handleAddExerciseRow} className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 lowercase">
                              <Plus className="w-3 h-3" /> Add Exercise
                            </button>
                          </div>

                          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                            {workExercises.map((ex, idx) => (
                              <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2 rounded border border-slate-100">
                                <input 
                                  required 
                                  placeholder="Exercise Name" 
                                  value={ex.name} 
                                  onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)}
                                  className="flex-1 bg-white border border-slate-200 rounded p-1 text-xs" 
                                />
                                <input 
                                  required 
                                  type="number" 
                                  placeholder="Sets" 
                                  value={ex.sets} 
                                  onChange={(e) => handleExerciseChange(idx, 'sets', Number(e.target.value))}
                                  className="w-12 bg-white border border-slate-200 rounded p-1 text-xs text-center" 
                                />
                                <input 
                                  required 
                                  placeholder="Reps" 
                                  value={ex.reps} 
                                  onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)}
                                  className="w-20 bg-white border border-slate-200 rounded p-1 text-xs text-center" 
                                />
                                <input 
                                  placeholder="Rest (s)" 
                                  value={ex.rest || ''} 
                                  onChange={(e) => handleExerciseChange(idx, 'rest', e.target.value)}
                                  className="w-16 bg-white border border-slate-200 rounded p-1 text-xs text-center" 
                                />
                                <button type="button" onClick={() => handleRemoveExerciseRow(idx)} className="text-slate-400 hover:text-rose-500">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                          <button type="submit" id="save-workout-plan-btn" className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-xs flex items-center gap-1.5 cursor-pointer">
                            <Save className="w-3.5 h-3.5" /> Dispatch Workout Plan
                          </button>
                        </div>
                      </form>
                    )}

                    {/* PLANNER TAB: DIET NUTRITION EDITOR */}
                    {plannerTab === 'nutrition' && (
                      <form onSubmit={handleSaveNutritionPlan} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nutrition Program Title</label>
                          <input 
                            required 
                            type="text" 
                            value={nutTitle} 
                            onChange={(e)=>setNutTitle(e.target.value)} 
                            className="w-full border border-slate-200 rounded p-1.5 text-xs focus:outline-indigo-500" 
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">
                            <span>Meals Intake List</span>
                            <button type="button" onClick={handleAddMealRow} className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 lowercase">
                              <Plus className="w-3 h-3" /> Add Meal
                            </button>
                          </div>

                          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                            {nutMeals.map((meal, idx) => (
                              <div key={idx} className="bg-slate-50 p-2.5 rounded border border-slate-100 space-y-2 relative">
                                <button type="button" onClick={() => handleRemoveMealRow(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-rose-500">
                                  <X className="w-3.5 h-3.5" />
                                </button>

                                <div className="grid grid-cols-3 gap-2">
                                  <input 
                                    required 
                                    placeholder="Intake Time (e.g. 08:00 AM)" 
                                    value={meal.time} 
                                    onChange={(e) => handleMealChange(idx, 'time', e.target.value)}
                                    className="bg-white border border-slate-200 rounded p-1 text-xs" 
                                  />
                                  <input 
                                    required 
                                    placeholder="Meal Label (Breakfast)" 
                                    value={meal.name} 
                                    onChange={(e) => handleMealChange(idx, 'name', e.target.value)}
                                    className="bg-white border border-slate-200 rounded p-1 text-xs" 
                                  />
                                  <input 
                                    required 
                                    type="number"
                                    placeholder="Calories (kcal)" 
                                    value={meal.calories} 
                                    onChange={(e) => handleMealChange(idx, 'calories', Number(e.target.value))}
                                    className="bg-white border border-slate-200 rounded p-1 text-xs text-center" 
                                  />
                                </div>
                                <input 
                                  required 
                                  placeholder="Food Items list (comma separated, e.g. Oatmeal, 3 Scrambled Eggs)" 
                                  value={meal.items.join(', ')} 
                                  onChange={(e) => handleMealItemsChange(idx, e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded p-1 text-xs" 
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                          <button type="submit" id="save-nutrition-plan-btn" className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-xs flex items-center gap-1.5 cursor-pointer">
                            <Save className="w-3.5 h-3.5" /> Dispatch Nutrition Plan
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
                <ClipboardList className="w-12 h-12 text-slate-300 stroke-1" />
                <div className="text-center">
                  <h4 className="font-semibold text-slate-600 text-sm">No Client Selected</h4>
                  <p className="text-[11px] text-slate-400 max-w-xs">Select a member from your client roster column on the left to review metrics and assign diets or compound exercises.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* VIEW: Class registers & Attendance checking */}
      {activeTab === 'attendance' && (
        <div className="space-y-6 w-full col-span-full">
          {/* Related Function Image Banner */}
          <div className="relative h-44 rounded-2xl overflow-hidden flex items-center justify-start p-6 text-white bg-cover bg-center shadow-xs" style={{ backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.2) 100%), url('https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&auto=format&fit=crop&q=80')` }}>
            <div className="space-y-1 z-10">
              <span className="text-[9px] bg-indigo-500 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">Attendance Register</span>
              <h3 className="font-display font-black text-xl tracking-tight mt-1.5">Teach & Attend Classes</h3>
              <p className="text-xs text-slate-200/90 max-w-md">Monitor real-time class registration roll calls and confirm member check-in credentials.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SESSIONS TAUGHT */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-4 space-y-4">
            <h3 className="font-display font-semibold text-slate-800 text-sm border-b border-slate-100 pb-3">
              Group Classes Taught By Me
            </h3>
            
            <div className="space-y-2">
              {myClasses.map(cls => {
                const isSelected = selectedClassId === cls.id;
                
                return (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`w-full p-3.5 rounded-lg border text-left transition-all flex flex-col gap-1.5 ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50/20 text-slate-900 font-semibold' 
                        : 'border-slate-100 hover:border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-indigo-600">
                      <span>{cls.day}</span>
                      <span>{cls.time}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800">{cls.name}</div>
                    <div className="text-[10px] text-slate-400">Target seat cap: {cls.capacity} members</div>
                  </button>
                );
              })}
              {myClasses.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No classes assigned to you under the gym schedule.
                </div>
              )}
            </div>
          </div>

          {/* ACTIVE CLASS STUDENT ROSTER FOR CHECK-IN */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-xs p-5">
            {selectedClassId ? (
              (() => {
                const activeClass = classes.find(c => c.id === selectedClassId);
                
                // Get all bookings for this class
                const bookedRecords = bookings.filter(b => b.classId === selectedClassId && b.status === 'CONFIRMED');
                const bookedMembers = clients.filter(m => bookedRecords.some(b => b.memberId === m.id));

                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                      <div>
                        <h4 className="font-display font-semibold text-slate-800 text-sm">{activeClass?.name}</h4>
                        <span className="text-[11px] text-slate-400">Class Roster (Present Date Check-In register)</span>
                      </div>
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold">
                        {bookedMembers.length} Booked
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                      {bookedMembers.map(member => {
                        // Check if attendance marked for today
                        const todayStr = new Date().toISOString().split('T')[0];
                        const attMarked = attendance.find(a => a.memberId === member.id && a.classId === selectedClassId && a.date === todayStr);

                        return (
                          <div key={member.id} className="py-3 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} alt="avatar" className="w-8 h-8 rounded-full bg-slate-100" />
                              <div>
                                <span className="font-semibold text-xs text-slate-800 block">{member.name}</span>
                                <span className="text-[10px] text-slate-500">{member.email}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleMarkAttendance(member.id, selectedClassId, activeClass?.name || '', 'PRESENT')}
                                className={`px-2.5 py-1 text-[11px] font-bold rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                                  attMarked?.status === 'PRESENT'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                <Check className="w-3 h-3" /> Present
                              </button>
                              <button
                                onClick={() => handleMarkAttendance(member.id, selectedClassId, activeClass?.name || '', 'ABSENT')}
                                className={`px-2.5 py-1 text-[11px] font-bold rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                                  attMarked?.status === 'ABSENT'
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                <X className="w-3 h-3" /> Absent
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {bookedMembers.length === 0 && (
                        <div className="text-center py-12 text-slate-400 text-xs">
                          No members have booked a seat in this class slot.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
                <BookOpen className="w-12 h-12 text-slate-300 stroke-1" />
                <div className="text-center">
                  <h4 className="font-semibold text-slate-600 text-sm">No Class Session Selected</h4>
                  <p className="text-[11px] text-slate-400 max-w-xs">Select a group class session card on the left to check and audit attendee roll calls.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Tab: Client Progress & Workload Analytics */}
      {activeTab === 'trainer_analytics' && (
        <div className="space-y-6">
          {/* Related Function Image Banner */}
          <div className="relative h-44 rounded-2xl overflow-hidden flex items-center justify-start p-6 text-white bg-cover bg-center shadow-xs" style={{ backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.2) 100%), url('https://images.unsplash.com/photo-1551854838-212c50b4c184?w=1200&auto=format&fit=crop&q=80')` }}>
            <div className="space-y-1 z-10">
              <span className="text-[9px] bg-indigo-500 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">Performance Telemetry</span>
              <h3 className="font-display font-black text-xl tracking-tight mt-1.5">Strength Analytics</h3>
              <p className="text-xs text-slate-200/90 max-w-md">Track 1-Rep Max progress curve indicators and client physical training load ratios.</p>
            </div>
          </div>

          {/* Interactive Weight 1-Rep Max (1RM) Target Generator */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
            <h3 className="text-base font-bold text-slate-800 tracking-tight mb-1 font-display">Athletic Performance &amp; 1RM Calculator</h3>
            <p className="text-xs text-slate-400 mb-6 font-medium">Select a client and estimate their 1-Rep Max (Epley Formula) to program their targeted strength percentage splits.</p>
            
            {(() => {
              const selectedClientObj = myClients.find(c => c.id === calcClient);
              const calculated1RM = Math.round(calcWeight * (1 + calcReps / 30));

              return (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Controls */}
                  <div className="space-y-4 bg-slate-50/40 border border-slate-100 p-4 rounded-xl">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Target Client</label>
                      <select 
                        value={calcClient}
                        onChange={(e) => setCalcClient(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-700"
                      >
                        {myClients.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Target Exercise</label>
                      <select 
                        value={calcEx}
                        onChange={(e) => setCalcEx(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-700"
                      >
                        <option value="Back Squat">Barbell Back Squat</option>
                        <option value="Deadlift">Conventional Deadlift</option>
                        <option value="Bench Press">Flat Bench Press</option>
                        <option value="Overhead Press">Military Overhead Press</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>Working Weight</span>
                        <span className="text-indigo-600 font-bold font-mono">{calcWeight} kg</span>
                      </div>
                      <input 
                        type="range" 
                        min="20" 
                        max="240" 
                        value={calcWeight} 
                        onChange={(e) => setCalcWeight(Number(e.target.value))}
                        className="w-full accent-indigo-600 bg-slate-100 rounded-lg cursor-pointer h-1.5"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>Repetitions (To Failure)</span>
                        <span className="text-indigo-600 font-bold font-mono">{calcReps} reps</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="12" 
                        value={calcReps} 
                        onChange={(e) => setCalcReps(Number(e.target.value))}
                        className="w-full accent-indigo-600 bg-slate-100 rounded-lg cursor-pointer h-1.5"
                      />
                    </div>
                  </div>

                  {/* Middle Formula Display Card */}
                  <div className="bg-indigo-600 text-white p-5 rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-indigo-500 rounded-full opacity-20 pointer-events-none"></div>
                    
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-200 font-mono">Performance Estimator</span>
                      <h4 className="text-lg font-bold font-display leading-tight">{selectedClientObj?.name || 'Client'}'s Estimated Max</h4>
                      <p className="text-[10px] text-indigo-100">Calculated using the Epley formula: 1RM = w(1 + r/30)</p>
                    </div>

                    <div className="my-4 text-center">
                      <span className="text-4xl font-black font-mono block tracking-tight">{calculated1RM} kg</span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-200 font-mono mt-1 block">{calcEx} One-Rep Max</span>
                    </div>

                    <div className="bg-indigo-700/50 p-2.5 rounded-lg border border-indigo-500/20 text-[10px] leading-relaxed text-indigo-100">
                      We recommend utilizing <strong>{Math.round(calculated1RM * 0.8)} kg</strong> (80% of 1RM) for a 4-6 rep strength stimulus, or <strong>{Math.round(calculated1RM * 0.7)} kg</strong> (70% of 1RM) for an 8-12 rep hypertrophy cycle.
                    </div>
                  </div>

                  {/* Right Target Splits Matrix */}
                  <div className="border border-slate-100 p-4 rounded-xl space-y-3.5 bg-slate-50/20">
                    <h4 className="text-xs font-bold text-slate-800 tracking-tight font-display">Target Intensity Split Table</h4>
                    <p className="text-[10px] text-slate-400">Apply these weights to {selectedClientObj?.name || 'client'}'s customized {calcEx} workout logs:</p>

                    <div className="space-y-2">
                      {[
                        { percent: 95, label: 'Absolute Power / Neuro Stimulus', reps: '1-2 reps' },
                        { percent: 85, label: 'Mechanical Tension / Strength', reps: '3-5 reps' },
                        { percent: 75, label: 'Myofibrillar Hypertrophy', reps: '6-10 reps' },
                        { percent: 65, label: 'Metabolic Stress / Local Endurance', reps: '12-15 reps' }
                      ].map((split, i) => (
                        <div key={i} className="flex items-center justify-between text-xs border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                          <div>
                            <span className="font-bold text-slate-700 font-mono">{split.percent}% 1RM</span>
                            <span className="text-[10px] text-slate-400 ml-2">({split.reps})</span>
                            <p className="text-[10px] text-slate-400/90 leading-tight">{split.label}</p>
                          </div>
                          <span className="text-xs font-bold text-indigo-600 font-mono bg-indigo-50 px-2 py-0.5 rounded">
                            {Math.round(calculated1RM * (split.percent / 100))} kg
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Elegant SVG Area Line-chart represent client average weekly training hours/intensity */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-slate-800 font-display">Weekly Client Activity Burn Ratios</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Consolidated physical workout output volumes across all active coached accounts</p>
                </div>
                <span className="text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2.5 py-0.5 rounded-md font-semibold font-mono">
                  Target: 180 total hours
                </span>
              </div>

              {/* Handcrafted Beautiful SVG Area/Path Chart */}
              <div className="h-56 w-full flex flex-col justify-between pt-4 select-none">
                <div className="flex-1 flex items-end justify-between px-1 relative h-[160px] border-b border-slate-100">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    <div className="w-full border-t border-slate-100 h-0"></div>
                    <div className="w-full border-t border-slate-100 h-0"></div>
                    <div className="w-full border-t border-slate-100 h-0"></div>
                    <div className="w-full border-t border-slate-100 h-0"></div>
                  </div>

                  {[
                    { week: 'Week 1', hours: 120, avgCal: 3400 },
                    { week: 'Week 2', hours: 145, avgCal: 3800 },
                    { week: 'Week 3', hours: 165, avgCal: 4200 },
                    { week: 'Week 4', hours: 135, avgCal: 3900 },
                    { week: 'Week 5', hours: 190, avgCal: 4800 },
                    { week: 'Week 6', hours: 210, avgCal: 5300 }
                  ].map((item, index) => {
                    const maxHours = 240;
                    const heightPercent = Math.max(15, (item.hours / maxHours) * 100);
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center group relative z-10 h-full justify-end">
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-30 animate-fade-in whitespace-nowrap">
                          <div className="bg-slate-900 text-white p-2.5 rounded-lg text-[10px] font-bold shadow-md border border-slate-800 text-left">
                            <p className="font-bold text-slate-300">{item.week} Performance</p>
                            <p className="text-indigo-400 font-mono">Coached Hours: {item.hours} hrs</p>
                            <p className="text-emerald-400 font-mono">Avg Calories: {item.avgCal} kcal</p>
                          </div>
                          <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1 border-r border-b border-slate-800"></div>
                        </div>

                        {/* Visual Pill/Bar Representing hours */}
                        <div 
                          style={{ height: `${heightPercent}%` }}
                          className="w-12 bg-gradient-to-t from-emerald-50 to-emerald-500/10 group-hover:from-emerald-100 group-hover:to-emerald-500/20 transition-all rounded-t-lg relative border-t border-emerald-200"
                        >
                          {/* Anchor Circle Indicator */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-600 border border-white group-hover:scale-125 transition-transform"></div>
                        </div>

                        {/* Label */}
                        <span className="text-[10px] font-bold text-slate-400 mt-2 font-mono">{item.week}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Goal Completion Matrix progress lists */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 font-display mb-1">Roster Goal Milestones</h3>
                <p className="text-[10px] text-slate-400 font-medium mb-4">Milestone progress track for assigned athletes' transformation benchmarks</p>

                <div className="space-y-4 pt-2">
                  {[
                    { name: 'Alex Jones (Muscle Growth)', percent: 80, status: 'Near Target' },
                    { name: 'Marcus Brody (Body Fat %)', percent: 55, status: 'In Progress' },
                    { name: 'Helen Hunt (Endurance/5k)', percent: 90, status: 'Almost Done' },
                    { name: 'David Goggins (Ultra Conditioning)', percent: 100, status: 'Completed' }
                  ].map((milestone, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-700">{milestone.name}</span>
                        <span className="text-indigo-600 font-mono">{milestone.percent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${milestone.percent}%` }}></div>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 font-mono block">{milestone.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-slate-50 pt-4">
                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/40 flex items-start gap-2.5">
                  <span className="p-1 bg-indigo-500 text-white rounded text-[10px] font-bold font-mono shrink-0">DATA</span>
                  <p className="text-[10px] text-indigo-700 leading-normal">
                    Assigned athletes are logging <strong>high compliance ratings</strong>. Schedule active body comp reviews next Monday to calibrate diet targets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
