export type Role = 'SUPER_ADMIN' | 'GYM_ADMIN' | 'TRAINER' | 'MEMBER';

export interface Gym {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  logoUrl?: string;
  subscriptionPlanId: string;
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'MONTHLY' | 'YEARLY';
  maxMembers: number;
  maxTrainers: number;
  features: string[];
}

export interface MembershipPlan {
  id: string;
  gymId: string;
  name: string;
  price: number;
  features: string[];
  durationMonths: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  gymId?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Trainer {
  id: string; // matches User.id
  gymId: string;
  name: string;
  email: string;
  specialties: string[];
  bio: string;
  experienceYears: number;
  rating: number;
  schedule: { day: string; startTime: string; endTime: string }[];
}

export interface Member {
  id: string; // matches User.id
  gymId: string;
  name: string;
  email: string;
  membershipPlanId: string;
  membershipStatus: 'ACTIVE' | 'EXPIRED' | 'UNPAID';
  trainerId?: string; // assigned trainer ID
  joinedDate: string;
  expiryDate: string;
  weight?: number; // in kg
  targetWeight?: number; // in kg
  height?: number; // in cm
}

export interface FitnessClass {
  id: string;
  gymId: string;
  name: string;
  description: string;
  trainerId: string;
  trainerName: string;
  day: string; // e.g. "Monday", "Tuesday", etc.
  time: string; // e.g. "08:00 AM - 09:00 AM"
  capacity: number;
  bookedCount: number;
}

export interface Booking {
  id: string;
  classId: string;
  memberId: string;
  bookingDate: string;
  status: 'CONFIRMED' | 'CANCELLED';
}

export interface Attendance {
  id: string;
  memberId: string;
  classId?: string; // if linked to a specific class, otherwise general gym entry
  className?: string;
  date: string; // YYYY-MM-DD
  status: 'PRESENT' | 'ABSENT';
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest?: string;
}

export interface WorkoutPlan {
  id: string;
  memberId: string;
  trainerId: string;
  title: string;
  description: string;
  exercises: Exercise[];
  updatedAt: string;
}

export interface Meal {
  time: string;
  name: string;
  items: string[];
  calories: number;
}

export interface NutritionPlan {
  id: string;
  memberId: string;
  trainerId: string;
  title: string;
  meals: Meal[];
  updatedAt: string;
}

export interface PlatformLog {
  id: string;
  timestamp: string;
  category: 'GYM' | 'BILLING' | 'SECURITY' | 'MEMBER';
  message: string;
  user: string;
}

export interface MemberProgress {
  id: string;
  memberId: string;
  date: string;
  weight: number;
  bodyFat?: number;
  notes?: string;
}

export interface InvoiceItem {
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  memberId: string;
  memberName: string;
  gymId: string;
  planName: string;
  date: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'PAID' | 'UNPAID' | 'OVERDUE';
  items: InvoiceItem[];
}

