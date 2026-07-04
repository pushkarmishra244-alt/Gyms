import React, { useState } from 'react';
import { Copy, Check, Server, Database, Layers, ArrowUpRight } from 'lucide-react';

export default function IntegrationGuide() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const prismaSchema = `// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL") // Neon PostgreSQL connection string
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  SUPER_ADMIN
  GYM_ADMIN
  TRAINER
  MEMBER
}

enum GymStatus {
  ACTIVE
  PENDING
  SUSPENDED
}

enum MembershipStatus {
  ACTIVE
  EXPIRED
  UNPAID
}

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  name         String
  role         Role      @default(MEMBER)
  avatarUrl    String?
  createdAt    DateTime  @default(now())
  
  // Relations
  gymId        String?
  gym          Gym?      @relation(fields: [gymId], references: [id], onDelete: Cascade)
  
  trainer      Trainer?  @relation
  member       Member?   @relation
}`;

  const nextAction = `// app/actions/gyms.ts
"use server"

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createGym(formData: FormData) {
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const planId = formData.get("planId") as string;

  try {
    const gym = await prisma.gym.create({
      data: {
        name,
        address,
        phone,
        email,
        status: "PENDING",
        subscriptionPlanId: planId,
      }
    });

    revalidatePath("/super-admin/gyms");
    return { success: true, gym };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}`;

  const envConfig = `# .env for Vercel & local development
# Database connection (Neon Serverless PostgreSQL string)
DATABASE_URL="postgresql://[user]:[password]@[neon-host]/gym-saas?sslmode=require"

# NextAuth secret for session verification
NEXTAUTH_SECRET="your-32-character-random-secret-key"
NEXTAUTH_URL="https://your-domain.vercel.app"`;

  const migrationSteps = `1. Create Next.js App:
   npx create-next-app@latest my-gym-platform --ts --tailwind --app

2. Install Prisma & Neon Database Drivers:
   npm install prisma @prisma/client @neondatabase/serverless
   npx prisma init

3. Copy the schema to prisma/schema.prisma and run migrations:
   npx prisma db push

4. Configure Vercel Project:
   - Import your GitHub repo in Vercel.
   - Add the DATABASE_URL environment variable from your Neon Console.
   - Click Deploy!`;

  return (
    <div className="space-y-8" id="integration-guide">
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Layers className="w-3.5 h-3.5" /> Direct Export Blueprint
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-semibold tracking-tight">Vercel &amp; Neon DB Integration Guide</h2>
            <p className="text-slate-300 text-sm">
              Ready to take this platform to production? Since this AI Studio preview runs on a secure client-side sandbox to honor your "Do Not Enable Cloud SQL" instruction, we generated complete Next.js, Prisma, and Neon code blueprints for you below.
            </p>
          </div>
          <div className="flex flex-row md:flex-col gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700/50">
              <Database className="text-emerald-400 w-4 h-4" /> Neon Ready
            </div>
            <div className="flex items-center gap-2 text-xs bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700/50">
              <Server className="text-blue-400 w-4 h-4" /> Vercel Ready
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prisma Schema */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <span className="font-mono text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-indigo-600" /> schema.prisma (Neon Optimized)
            </span>
            <button 
              onClick={() => handleCopy(prismaSchema, 'prisma')}
              className="text-slate-500 hover:text-slate-800 p-1 rounded-md hover:bg-slate-200/60 transition-colors"
            >
              {copiedSection === 'prisma' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="p-4 bg-slate-900 text-slate-200 overflow-x-auto text-xs font-mono leading-relaxed h-[320px]">
            <pre>{prismaSchema}</pre>
          </div>
        </div>

        {/* NextJS Server Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <span className="font-mono text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-indigo-600" /> Next.js 14 Server Action
            </span>
            <button 
              onClick={() => handleCopy(nextAction, 'next')}
              className="text-slate-500 hover:text-slate-800 p-1 rounded-md hover:bg-slate-200/60 transition-colors"
            >
              {copiedSection === 'next' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="p-4 bg-slate-900 text-slate-200 overflow-x-auto text-xs font-mono leading-relaxed h-[320px]">
            <pre>{nextAction}</pre>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ENV variables */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 space-y-4">
          <h3 className="font-display font-semibold text-slate-800 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Environment Configuration
          </h3>
          <p className="text-xs text-slate-500">
            Set these environment variables in your Vercel Dashboard or local <code className="bg-slate-50 px-1 py-0.5 rounded border border-slate-200">.env.local</code>.
          </p>
          <div className="relative">
            <button 
              onClick={() => handleCopy(envConfig, 'env')}
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 p-1 bg-white/80 rounded-md border border-slate-150 transition-colors"
            >
              {copiedSection === 'env' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <pre className="bg-slate-50 p-3 rounded-lg text-slate-600 text-xs font-mono border border-slate-100 overflow-x-auto">
              {envConfig}
            </pre>
          </div>
        </div>

        {/* Steps to deploy to Vercel */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-display font-semibold text-slate-800 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Steps to Deploy (Next.js + Prisma + Neon)
            </h3>
            <div className="text-xs text-slate-600 space-y-2 font-sans">
              {migrationSteps.split('\n\n').map((step, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-mono text-slate-700 whitespace-pre-wrap">
                  {step}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Neon offers a fully managed free-tier PostgreSQL database.</span>
            <a 
              href="https://neon.tech" 
              target="_blank" 
              referrerPolicy="no-referrer" 
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Create Neon Account <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
