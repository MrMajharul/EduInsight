import React from 'react';
import Link from 'next/link';
import { Sparkles, CalendarCheck, GraduationCap, Briefcase, FolderKanban, ArrowRight } from 'lucide-react';

export default function OverviewPage() {
  const agents = [
    {
      id: 1,
      title: 'AI Study Planner',
      description: 'Generate optimized daily study schedules leading up to your exam dates, targeting weak topics first.',
      icon: CalendarCheck,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20'
    },
    {
      id: 2,
      title: 'Exam Prep Agent',
      description: 'Produce structured topic summaries, multiple-choice practice tests (MCQs), and important questions with answers.',
      icon: GraduationCap,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20'
    },
    {
      id: 3,
      title: 'Career Guidance Agent',
      description: 'Analyze your skills, projects, and coursework to generate personalized career pathways and skill roadmaps.',
      icon: Briefcase,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      id: 4,
      title: 'Project Advisor',
      description: 'Get tailored portfolio project ideas based on your target career role to fill in critical technical gaps.',
      icon: FolderKanban,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121629] via-[#0b0f19] to-[#0a0a0a] border border-zinc-800/60 p-12">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-wide mb-6">
            <Sparkles size={14} />
            Agents For Good — Kaggle Capstone
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Empower Your Academic & <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Career Success Journey
            </span>
          </h1>
          
          <p className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-2xl">
            Welcome to the Smart Student Success Agent. Our production-grade AI agents utilize advanced reasoning and structured prompts to build tailored study roadmaps, host mock exams, map out skills, and suggest code portfolios.
          </p>
          
          <div className="flex items-center gap-4">
            <button className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-[0_4px_20px_rgba(99,102,241,0.4)] flex items-center gap-2">
              Start Study Planner <ArrowRight size={18} />
            </button>
            <Link href="/dashboard" className="bg-zinc-800/50 hover:bg-zinc-800 text-zinc-100 font-medium py-3 px-6 rounded-xl border border-zinc-700 transition-colors">
              View Analytics
            </Link>
          </div>
        </div>
      </section>

      {/* Agents Grid */}
      <section>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Meet Your AI Success Agents</h2>
          <p className="text-zinc-500 text-sm">Four specialized agents working together to support your progress.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-[#111622] hover:bg-[#151b29] border border-zinc-800/80 rounded-2xl p-6 transition-all group flex flex-col justify-between min-h-[220px]">
              <div>
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center border mb-5 ${agent.bg}`}>
                  <agent.icon className={agent.color} size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{agent.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {agent.description}
                </p>
              </div>
              <button className="mt-6 flex items-center gap-2 text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">
                Deploy Agent <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
