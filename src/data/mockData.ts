import { 
  Gym, 
  SubscriptionPlan, 
  MembershipPlan, 
  User, 
  Trainer, 
  Member, 
  FitnessClass, 
  Booking, 
  Attendance, 
  WorkoutPlan, 
  NutritionPlan, 
  PlatformLog,
  MemberProgress,
  Invoice
} from '../types';

// Standard Platform Subscription Plans
export const DEFAULT_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'sub_basic',
    name: 'Starter Plan',
    price: 49,
    interval: 'MONTHLY',
    maxMembers: 150,
    maxTrainers: 5,
    features: ['Standard Dashboard', 'Attendance Tracking', 'Basic Analytics', 'Email Support']
  },
  {
    id: 'sub_growth',
    name: 'Growth Pro',
    price: 99,
    interval: 'MONTHLY',
    maxMembers: 500,
    maxTrainers: 15,
    features: ['Advanced Analytics', 'Trainer & Client Portals', 'Diet & Workout Planners', 'SMS Notifications', '24/7 Support']
  },
  {
    id: 'sub_enterprise',
    name: 'Enterprise Elite',
    price: 199,
    interval: 'MONTHLY',
    maxMembers: 2000,
    maxTrainers: 50,
    features: ['Custom Branding', 'Unlimited Features', 'API Access', 'Dedicated Account Manager', 'Custom Integrations']
  }
];

// Default Gyms on the platform
export const DEFAULT_GYMS: Gym[] = [
  {
    id: 'gym_apex',
    name: 'Apex Fitness Club',
    address: '102 Wellness Parkway, Suite A, San Francisco, CA',
    phone: '(555) 123-4567',
    email: 'contact@apexfitness.com',
    status: 'ACTIVE',
    logoUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    subscriptionPlanId: 'sub_growth',
    createdAt: '2026-01-15'
  },
  {
    id: 'gym_iron',
    name: 'Iron Temple Gym',
    address: '44 Heavy Iron Way, Brooklyn, NY',
    phone: '(555) 987-6543',
    email: 'info@irontemple.com',
    status: 'ACTIVE',
    logoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    subscriptionPlanId: 'sub_enterprise',
    createdAt: '2026-02-10'
  },
  {
    id: 'gym_zest',
    name: 'Zest Yoga & Pilates',
    address: '789 Serene Hills, Austin, TX',
    phone: '(555) 333-4444',
    email: 'hello@zestyoga.com',
    status: 'PENDING',
    logoUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    subscriptionPlanId: 'sub_basic',
    createdAt: '2026-07-01'
  }
];

// Default Membership Plans for each gym
export const DEFAULT_MEMBERSHIP_PLANS: MembershipPlan[] = [
  // Apex Gym Plans
  {
    id: 'plan_apex_basic',
    gymId: 'gym_apex',
    name: 'Standard Pass',
    price: 59,
    features: ['Gym Floor Access', 'Locker Room & Showers', '2 Classes per Month'],
    durationMonths: 1
  },
  {
    id: 'plan_apex_premium',
    gymId: 'gym_apex',
    name: 'Apex Unlimited Gold',
    price: 99,
    features: ['Unlimited Gym Floor Access', 'Unlimited Live Classes', '1 Personal Trainer Session/mo', 'Sauna Access'],
    durationMonths: 1
  },
  // Iron Gym Plans
  {
    id: 'plan_iron_hardcore',
    gymId: 'gym_iron',
    name: 'Iron Warrior Pass',
    price: 49,
    features: ['24/7 Powerlifting Arena Access', 'Chalk Allowed', 'Free Protein Shake of the Day'],
    durationMonths: 1
  },
  {
    id: 'plan_iron_elite',
    gymId: 'gym_iron',
    name: 'Titanium VIP Power',
    price: 129,
    features: ['24/7 Access', 'Unlimited Coaching Calls', 'Custom Powerlifting App Login', 'Free Mech Store Items'],
    durationMonths: 12
  }
];

// Platform Users (For Authentication simulation)
export const DEFAULT_USERS: User[] = [
  {
    id: 'user_super_admin',
    email: 'admin@platform.com',
    name: 'Marcus Vance',
    role: 'SUPER_ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    createdAt: '2026-01-01'
  },
  {
    id: 'user_gym_admin_apex',
    email: 'admin@apexfitness.com',
    name: 'Helena Carter',
    role: 'GYM_ADMIN',
    gymId: 'gym_apex',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    createdAt: '2026-01-15'
  },
  {
    id: 'user_gym_admin_iron',
    email: 'admin@irontemple.com',
    name: 'Viktor Dragov',
    role: 'GYM_ADMIN',
    gymId: 'gym_iron',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    createdAt: '2026-02-10'
  },
  {
    id: 'user_trainer_sarah',
    email: 'sarah.j@apexfitness.com',
    name: 'Sarah Jenkins',
    role: 'TRAINER',
    gymId: 'gym_apex',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    createdAt: '2026-01-18'
  },
  {
    id: 'user_trainer_mike',
    email: 'mike.t@apexfitness.com',
    name: 'Mike Tyson-Stone',
    role: 'TRAINER',
    gymId: 'gym_apex',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    createdAt: '2026-01-20'
  },
  {
    id: 'user_trainer_john',
    email: 'john.m@irontemple.com',
    name: 'John Miller',
    role: 'TRAINER',
    gymId: 'gym_iron',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    createdAt: '2026-02-12'
  },
  {
    id: 'user_member_alex',
    email: 'alex.jones@gmail.com',
    name: 'Alex Jones',
    role: 'MEMBER',
    gymId: 'gym_apex',
    avatarUrl: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    createdAt: '2026-02-01'
  },
  {
    id: 'user_member_david',
    email: 'david.smith@hotmail.com',
    name: 'David Smith',
    role: 'MEMBER',
    gymId: 'gym_apex',
    avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    createdAt: '2026-02-15'
  },
  {
    id: 'user_member_emma',
    email: 'emma.watson@yahoo.com',
    name: 'Emma Watson',
    role: 'MEMBER',
    gymId: 'gym_iron',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    createdAt: '2026-02-28'
  }
];

// Default trainers info mapping to users
export const DEFAULT_TRAINERS: Trainer[] = [
  {
    id: 'user_trainer_sarah',
    gymId: 'gym_apex',
    name: 'Sarah Jenkins',
    email: 'sarah.j@apexfitness.com',
    specialties: ['HIIT Training', 'Yoga Flow', 'Fat Loss Coaching'],
    bio: 'Certified personal trainer with 6+ years of experience helping clients achieve sustainable results through movement.',
    experienceYears: 6,
    rating: 4.9,
    schedule: [
      { day: 'Monday', startTime: '08:00 AM', endTime: '12:00 PM' },
      { day: 'Wednesday', startTime: '08:00 AM', endTime: '12:00 PM' },
      { day: 'Friday', startTime: '08:00 AM', endTime: '12:00 PM' }
    ]
  },
  {
    id: 'user_trainer_mike',
    gymId: 'gym_apex',
    name: 'Mike Tyson-Stone',
    email: 'mike.t@apexfitness.com',
    specialties: ['Strength & Conditioning', 'Bodybuilding', 'Athletic Prep'],
    bio: 'Former collegiate athlete specialized in heavy compound movements, hypertrophy, and speed endurance development.',
    experienceYears: 8,
    rating: 4.8,
    schedule: [
      { day: 'Tuesday', startTime: '10:00 AM', endTime: '04:00 PM' },
      { day: 'Thursday', startTime: '10:00 AM', endTime: '04:00 PM' },
      { day: 'Saturday', startTime: '09:00 AM', endTime: '01:00 PM' }
    ]
  },
  {
    id: 'user_trainer_john',
    gymId: 'gym_iron',
    name: 'John Miller',
    email: 'john.m@irontemple.com',
    specialties: ['Powerlifting', 'Olympic Weightlifting', 'Mobility'],
    bio: 'State-record bench press holder, specialized in helping lifters fine-tune squat, bench, and deadlift mechanics safely.',
    experienceYears: 10,
    rating: 5.0,
    schedule: [
      { day: 'Monday', startTime: '02:00 PM', endTime: '08:00 PM' },
      { day: 'Wednesday', startTime: '02:00 PM', endTime: '08:00 PM' },
      { day: 'Friday', startTime: '02:00 PM', endTime: '08:00 PM' }
    ]
  }
];

// Default members info mapping to users
export const DEFAULT_MEMBERS: Member[] = [
  {
    id: 'user_member_alex',
    gymId: 'gym_apex',
    name: 'Alex Jones',
    email: 'alex.jones@gmail.com',
    membershipPlanId: 'plan_apex_premium',
    membershipStatus: 'ACTIVE',
    trainerId: 'user_trainer_sarah',
    joinedDate: '2026-02-01',
    expiryDate: '2026-08-01',
    weight: 78.5,
    targetWeight: 72.0,
    height: 175
  },
  {
    id: 'user_member_david',
    gymId: 'gym_apex',
    name: 'David Smith',
    email: 'david.smith@hotmail.com',
    membershipPlanId: 'plan_apex_basic',
    membershipStatus: 'ACTIVE',
    trainerId: 'user_trainer_mike',
    joinedDate: '2026-02-15',
    expiryDate: '2026-07-15',
    weight: 92.0,
    targetWeight: 85.0,
    height: 182
  },
  {
    id: 'user_member_emma',
    gymId: 'gym_iron',
    name: 'Emma Watson',
    email: 'emma.watson@yahoo.com',
    membershipPlanId: 'plan_iron_hardcore',
    membershipStatus: 'ACTIVE',
    trainerId: 'user_trainer_john',
    joinedDate: '2026-02-28',
    expiryDate: '2026-08-28',
    weight: 64.0,
    targetWeight: 60.0,
    height: 168
  }
];

// Default classes scheduled at gyms
export const DEFAULT_CLASSES: FitnessClass[] = [
  {
    id: 'class_hiit',
    gymId: 'gym_apex',
    name: 'CrossFit HIIT Burn',
    description: 'High intensity interval session combining plyometrics, kettlebell circuits, and rowing machines.',
    trainerId: 'user_trainer_sarah',
    trainerName: 'Sarah Jenkins',
    day: 'Monday',
    time: '09:00 AM - 10:00 AM',
    capacity: 20,
    bookedCount: 12
  },
  {
    id: 'class_yoga',
    gymId: 'gym_apex',
    name: 'Vinyasa Core Flow Yoga',
    description: 'Calming yet rigorous flow focusing on breathing, stability, core engagement, and posture control.',
    trainerId: 'user_trainer_sarah',
    trainerName: 'Sarah Jenkins',
    day: 'Wednesday',
    time: '10:30 AM - 11:30 AM',
    capacity: 15,
    bookedCount: 5
  },
  {
    id: 'class_strength',
    gymId: 'gym_apex',
    name: 'Compound Strength & Hypertrophy',
    description: 'Focus on mastering deadlifts, barbell rows, and military presses for physical density and strength.',
    trainerId: 'user_trainer_mike',
    trainerName: 'Mike Tyson-Stone',
    day: 'Tuesday',
    time: '11:00 AM - 12:00 PM',
    capacity: 12,
    bookedCount: 8
  },
  {
    id: 'class_power',
    gymId: 'gym_iron',
    name: 'Powerlifting Fundamentals',
    description: 'Break down your lift technique: low bar squats, flat bench arches, and proper deadlift slack-pulling.',
    trainerId: 'user_trainer_john',
    trainerName: 'John Miller',
    day: 'Monday',
    time: '03:00 PM - 04:30 PM',
    capacity: 8,
    bookedCount: 4
  }
];

// Default bookings
export const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 'b_1',
    classId: 'class_hiit',
    memberId: 'user_member_alex',
    bookingDate: '2026-07-02',
    status: 'CONFIRMED'
  },
  {
    id: 'b_2',
    classId: 'class_strength',
    memberId: 'user_member_david',
    bookingDate: '2026-07-01',
    status: 'CONFIRMED'
  },
  {
    id: 'b_3',
    classId: 'class_power',
    memberId: 'user_member_emma',
    bookingDate: '2026-07-02',
    status: 'CONFIRMED'
  }
];

// Default classes attendance
export const DEFAULT_ATTENDANCE: Attendance[] = [
  {
    id: 'att_1',
    memberId: 'user_member_alex',
    classId: 'class_hiit',
    className: 'CrossFit HIIT Burn',
    date: '2026-06-29',
    status: 'PRESENT'
  },
  {
    id: 'att_2',
    memberId: 'user_member_alex',
    classId: 'class_hiit',
    className: 'CrossFit HIIT Burn',
    date: '2026-06-22',
    status: 'PRESENT'
  },
  {
    id: 'att_3',
    memberId: 'user_member_david',
    classId: 'class_strength',
    className: 'Compound Strength & Hypertrophy',
    date: '2026-06-30',
    status: 'PRESENT'
  },
  {
    id: 'att_4',
    memberId: 'user_member_emma',
    classId: 'class_power',
    className: 'Powerlifting Fundamentals',
    date: '2026-06-29',
    status: 'PRESENT'
  }
];

// Default workout plans
export const DEFAULT_WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: 'wp_alex',
    memberId: 'user_member_alex',
    trainerId: 'user_trainer_sarah',
    title: 'Fat Loss & High Endurance Cardio Circuit',
    description: 'High density, short rest periods. Track your heart rate and try to stay within the fat burning zone (130-150 bpm).',
    exercises: [
      { name: 'Kettlebell Swings', sets: 4, reps: '20 reps', rest: '45 sec' },
      { name: 'Dumbbell Thrusters', sets: 3, reps: '15 reps', rest: '60 sec' },
      { name: 'Rowing Machine Interval', sets: 5, reps: '300m sprint', rest: '60 sec' },
      { name: 'Hanging Knee Raises', sets: 3, reps: 'Max till failure', rest: '30 sec' }
    ],
    updatedAt: '2026-06-25'
  },
  {
    id: 'wp_emma',
    memberId: 'user_member_emma',
    trainerId: 'user_trainer_john',
    title: 'Powerlifting Squat & Bench Hypertrophy Phase 1',
    description: 'High volume compound movements. Focus on depth (below parallel) and progressive overload. Increase weights by 2.5kg each week.',
    exercises: [
      { name: 'Low Bar Back Squat', sets: 5, reps: '5 reps @ 75% 1RM', rest: '3 min' },
      { name: 'Competition Bench Press', sets: 4, reps: '8 reps @ 65% 1RM', rest: '2 min' },
      { name: 'Romanian Deadlifts (RDL)', sets: 3, reps: '10 reps', rest: '90 sec' },
      { name: 'Overhead Press (OHP)', sets: 4, reps: '6 reps', rest: '2 min' }
    ],
    updatedAt: '2026-06-28'
  }
];

// Default nutrition plans
export const DEFAULT_NUTRITION_PLANS: NutritionPlan[] = [
  {
    id: 'np_alex',
    memberId: 'user_member_alex',
    trainerId: 'user_trainer_sarah',
    title: '1,800 kcal Lean Deficit High Protein Diet',
    meals: [
      { 
        time: '08:00 AM', 
        name: 'Breakfast', 
        items: ['3 Scrambled Egg Whites + 1 Whole Egg', '50g Rolled Oats with water & cinnamon', 'Black Coffee'], 
        calories: 380 
      },
      { 
        time: '01:00 PM', 
        name: 'Lunch', 
        items: ['150g Grilled Chicken Breast', '100g Jasmine Rice', 'Mixed green salad (spinach, cucumber, lemon juice)'], 
        calories: 480 
      },
      { 
        time: '04:30 PM', 
        name: 'Post-Workout Snack', 
        items: ['1 scoop Whey Protein Isolate', '1 medium Banana', '20g Raw Almonds'], 
        calories: 320 
      },
      { 
        time: '08:00 PM', 
        name: 'Dinner', 
        items: ['150g Baked Salmon', '150g Steamed Broccoli', '50g Sweet Potato'], 
        calories: 450 
      }
    ],
    updatedAt: '2026-06-26'
  },
  {
    id: 'np_emma',
    memberId: 'user_member_emma',
    trainerId: 'user_trainer_john',
    title: '2,400 kcal Power & Strength Surplus Diet',
    meals: [
      { 
        time: '07:30 AM', 
        name: 'Breakfast', 
        items: ['3 Whole Eggs cooked in butter', '2 slices Whole Wheat Toast', '1 Glass Whole Milk'], 
        calories: 580 
      },
      { 
        time: '12:30 PM', 
        name: 'Lunch', 
        items: ['180g Lean Ground Beef (90%)', '150g Brown Rice', '1 cup Roasted Asparagus'], 
        calories: 650 
      },
      { 
        time: '04:00 PM', 
        name: 'Pre-Workout Fuel', 
        items: ['Greek Yogurt (200g)', '30g Honey', '50g Granola'], 
        calories: 420 
      },
      { 
        time: '08:30 PM', 
        name: 'Dinner', 
        items: ['200g Pan-Seared Ribeye Steak', '200g Mashed Potatoes (with real butter)', 'Side of Asparagus'], 
        calories: 780 
      }
    ],
    updatedAt: '2026-06-29'
  }
];

// Progress metrics tracking (weights)
export const DEFAULT_PROGRESS: MemberProgress[] = [
  // Alex: Fat Loss progress
  { id: 'p_a1', memberId: 'user_member_alex', date: '2026-05-01', weight: 82.0, bodyFat: 22 },
  { id: 'p_a2', memberId: 'user_member_alex', date: '2026-05-15', weight: 81.1, bodyFat: 21 },
  { id: 'p_a3', memberId: 'user_member_alex', date: '2026-06-01', weight: 80.2, bodyFat: 20 },
  { id: 'p_a4', memberId: 'user_member_alex', date: '2026-06-15', weight: 79.3, bodyFat: 19.2 },
  { id: 'p_a5', memberId: 'user_member_alex', date: '2026-07-01', weight: 78.5, bodyFat: 18.5 },
  // David
  { id: 'p_d1', memberId: 'user_member_david', date: '2026-05-15', weight: 94.2 },
  { id: 'p_d2', memberId: 'user_member_david', date: '2026-06-15', weight: 93.0 },
  { id: 'p_d3', memberId: 'user_member_david', date: '2026-07-01', weight: 92.0 },
  // Emma: Powerlifting recomp
  { id: 'p_e1', memberId: 'user_member_emma', date: '2026-05-10', weight: 63.2, bodyFat: 17 },
  { id: 'p_e2', memberId: 'user_member_emma', date: '2026-06-10', weight: 63.8, bodyFat: 16.2 },
  { id: 'p_e3', memberId: 'user_member_emma', date: '2026-07-01', weight: 64.0, bodyFat: 15.5 }
];

// Default Platform Logs
export const DEFAULT_PLATFORM_LOGS: PlatformLog[] = [
  {
    id: 'log_1',
    timestamp: '2026-07-02 14:32:00',
    category: 'GYM',
    message: 'New Gym Registration Request: Zest Yoga & Pilates submitted details for approval',
    user: 'system'
  },
  {
    id: 'log_2',
    timestamp: '2026-07-01 10:15:00',
    category: 'BILLING',
    message: 'Invoice paid successfully: Iron Temple Gym ($199.00 subscription charge)',
    user: 'billing-bot'
  },
  {
    id: 'log_3',
    timestamp: '2026-06-30 18:22:11',
    category: 'SECURITY',
    message: 'Super Admin credentials verified for Marcus Vance from IP 182.23.4.11',
    user: 'system'
  },
  {
    id: 'log_4',
    timestamp: '2026-06-29 09:12:05',
    category: 'MEMBER',
    message: 'Member Alex Jones booked CrossFit HIIT Burn at Apex Fitness Club',
    user: 'alex.jones@gmail.com'
  }
];

export const DEFAULT_INVOICES: Invoice[] = [
  {
    id: 'inv_1',
    invoiceNumber: 'INV-1001',
    memberId: 'user_member_alex',
    memberName: 'Alex Jones',
    gymId: 'gym_apex',
    planName: 'Apex Unlimited Gold',
    date: '2026-06-01',
    dueDate: '2026-06-15',
    subtotal: 99.00,
    tax: 9.90,
    discount: 0.00,
    total: 108.90,
    status: 'PAID',
    items: [
      { description: 'Apex Unlimited Gold Membership Fee', amount: 99.00 }
    ]
  },
  {
    id: 'inv_2',
    invoiceNumber: 'INV-1002',
    memberId: 'user_member_david',
    memberName: 'David Smith',
    gymId: 'gym_apex',
    planName: 'Standard Pass',
    date: '2026-06-15',
    dueDate: '2026-06-30',
    subtotal: 59.00,
    tax: 5.90,
    discount: 5.00,
    total: 59.90,
    status: 'PAID',
    items: [
      { description: 'Standard Pass Monthly Membership Fee', amount: 59.00 },
      { description: 'Locker Rental Discount', amount: -5.00 }
    ]
  },
  {
    id: 'inv_3',
    invoiceNumber: 'INV-1003',
    memberId: 'user_member_emma',
    memberName: 'Emma Watson',
    gymId: 'gym_iron',
    planName: 'Iron Warrior Pass',
    date: '2026-07-01',
    dueDate: '2026-07-15',
    subtotal: 49.00,
    tax: 0.00,
    discount: 0.00,
    total: 49.00,
    status: 'UNPAID',
    items: [
      { description: 'Iron Warrior Pass Membership Fee', amount: 49.00 }
    ]
  }
];



/**
 * Active local database engine using localStorage with automatic in-memory fallback
 */
class LocalDB {
  private memoryStorage: Record<string, string> = {};

  private isStorageAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && 'localStorage' in window && window.localStorage !== null;
    } catch {
      return false;
    }
  }

  private get<T>(key: string, defaultValue: T): T {
    try {
      if (this.isStorageAvailable()) {
        const value = window.localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
      }
    } catch {
      // ignore and fallback
    }
    const memVal = this.memoryStorage[key];
    return memVal ? JSON.parse(memVal) : defaultValue;
  }

  private set<T>(key: string, value: T): void {
    const stringified = JSON.stringify(value);
    try {
      if (this.isStorageAvailable()) {
        window.localStorage.setItem(key, stringified);
        return;
      }
    } catch (e) {
      console.error("Local Storage write failed, falling back to memory", e);
    }
    this.memoryStorage[key] = stringified;
  }

  get gyms(): Gym[] {
    return this.get('gyms', DEFAULT_GYMS);
  }
  set gyms(value: Gym[]) {
    this.set('gyms', value);
  }

  get subscriptionPlans(): SubscriptionPlan[] {
    return this.get('subscriptionPlans', DEFAULT_SUBSCRIPTION_PLANS);
  }
  set subscriptionPlans(value: SubscriptionPlan[]) {
    this.set('subscriptionPlans', value);
  }

  get membershipPlans(): MembershipPlan[] {
    return this.get('membershipPlans', DEFAULT_MEMBERSHIP_PLANS);
  }
  set membershipPlans(value: MembershipPlan[]) {
    this.set('membershipPlans', value);
  }

  get users(): User[] {
    return this.get('users', DEFAULT_USERS);
  }
  set users(value: User[]) {
    this.set('users', value);
  }

  get trainers(): Trainer[] {
    return this.get('trainers', DEFAULT_TRAINERS);
  }
  set trainers(value: Trainer[]) {
    this.set('trainers', value);
  }

  get members(): Member[] {
    return this.get('members', DEFAULT_MEMBERS);
  }
  set members(value: Member[]) {
    this.set('members', value);
  }

  get classes(): FitnessClass[] {
    return this.get('classes', DEFAULT_CLASSES);
  }
  set classes(value: FitnessClass[]) {
    this.set('classes', value);
  }

  get bookings(): Booking[] {
    return this.get('bookings', DEFAULT_BOOKINGS);
  }
  set bookings(value: Booking[]) {
    this.set('bookings', value);
  }

  get attendance(): Attendance[] {
    return this.get('attendance', DEFAULT_ATTENDANCE);
  }
  set attendance(value: Attendance[]) {
    this.set('attendance', value);
  }

  get workoutPlans(): WorkoutPlan[] {
    return this.get('workoutPlans', DEFAULT_WORKOUT_PLANS);
  }
  set workoutPlans(value: WorkoutPlan[]) {
    this.set('workoutPlans', value);
  }

  get nutritionPlans(): NutritionPlan[] {
    return this.get('nutritionPlans', DEFAULT_NUTRITION_PLANS);
  }
  set nutritionPlans(value: NutritionPlan[]) {
    this.set('nutritionPlans', value);
  }

  get progress(): MemberProgress[] {
    return this.get('progress', DEFAULT_PROGRESS);
  }
  set progress(value: MemberProgress[]) {
    this.set('progress', value);
  }

  get invoices(): Invoice[] {
    return this.get('invoices', DEFAULT_INVOICES);
  }
  set invoices(value: Invoice[]) {
    this.set('invoices', value);
  }

  get logs(): PlatformLog[] {
    return this.get('logs', DEFAULT_PLATFORM_LOGS);
  }
  set logs(value: PlatformLog[]) {
    this.set('logs', value);
  }

  // Helper to log a platform message
  addLog(category: 'GYM' | 'BILLING' | 'SECURITY' | 'MEMBER', message: string, user: string) {
    const currentLogs = this.logs;
    const newLog: PlatformLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      category,
      message,
      user
    };
    this.logs = [newLog, ...currentLogs];
  }

  resetAll() {
    this.memoryStorage = {};
    try {
      if (this.isStorageAvailable()) {
        window.localStorage.removeItem('gyms');
        window.localStorage.removeItem('subscriptionPlans');
        window.localStorage.removeItem('membershipPlans');
        window.localStorage.removeItem('users');
        window.localStorage.removeItem('trainers');
        window.localStorage.removeItem('members');
        window.localStorage.removeItem('classes');
        window.localStorage.removeItem('bookings');
        window.localStorage.removeItem('attendance');
        window.localStorage.removeItem('workoutPlans');
        window.localStorage.removeItem('nutritionPlans');
        window.localStorage.removeItem('progress');
        window.localStorage.removeItem('invoices');
        window.localStorage.removeItem('logs');
      }
    } catch (e) {
      console.error("Local Storage reset failed", e);
    }
  }
}

export const db = new LocalDB();
