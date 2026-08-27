"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  LayoutDashboard, 
  CalendarCheck, 
  GraduationCap, 
  Briefcase, 
  FolderKanban, 
  Settings,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/', icon: BookOpen },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Study Planner', href: '/study-planner', icon: CalendarCheck },
    { name: 'Exam Prep', href: '/exam-prep', icon: GraduationCap },
    { name: 'Career Guidance', href: '/career-guidance', icon: Briefcase },
    { name: 'Project Recommendations', href: '/projects', icon: FolderKanban },
    { name: 'Settings', href: '/settings', icon: Settings, className: 'mt-4' },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-zinc-100 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#0b0f19] border-r border-zinc-800/60 flex flex-col justify-between shrink-0">
        
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-zinc-800/60">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-indigo-500/20 rounded flex items-center justify-center border border-indigo-500/30">
                <Sparkles className="text-indigo-400" size={16} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-tight text-white">Smart Student</span>
                <span className="text-xs text-indigo-400 font-medium">Success Agent</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? 'bg-indigo-500 text-white font-medium shadow-[0_4px_14px_rgba(99,102,241,0.3)]' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'} ${item.className || ''}`}>
                  <item.icon size={18} className={isActive ? 'text-white' : 'text-zinc-400'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Badge */}
        <div className="p-4 border-t border-zinc-800/60">
          <div className="flex items-center gap-3 bg-[#111622] border border-zinc-800 rounded-xl p-3">
            <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">Success Explorer</span>
              <span className="text-[10px] text-zinc-500">Active Learner</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <header className="h-16 border-b border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur flex items-center justify-between px-8 shrink-0">
          <h2 className="text-lg font-bold text-white">
            {pathname === '/' ? 'Overview Dashboard' 
             : pathname.includes('/dashboard') ? 'ML Intelligence Dashboard'
             : pathname.includes('/study-planner') ? 'AI Study Planner'
             : pathname.includes('/exam-prep') ? 'AI Exam Prep'
             : pathname.includes('/career-guidance') ? 'AI Career Advisor'
             : pathname.includes('/projects') ? 'Project Builder'
             : pathname.includes('/settings') ? 'Profile Settings'
             : 'Dashboard'}
          </h2>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              <AlertTriangle className="text-amber-500" size={14} />
              <span className="text-xs text-amber-500 font-medium tracking-wide">Demo Mode (Mock API)</span>
            </div>
            <span className="text-sm text-zinc-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <div className="flex items-center gap-3 border-l border-zinc-800 pl-6">
              <div className="flex flex-col text-right">
                <span className="text-sm font-bold text-white leading-tight">Success Explorer</span>
                <span className="text-[10px] text-zinc-500">Student Profile</span>
              </div>
              <div className="h-8 w-8 bg-indigo-900/50 rounded flex items-center justify-center border border-indigo-500/30 text-indigo-400 font-bold text-sm">
                S
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>

    </div>
  );
}
