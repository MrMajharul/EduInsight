import React from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Moon, 
  ArrowRight, 
  Target, 
  FileText, 
  Users, 
  BrainCircuit,
  CircleCheck,
  Terminal,
  CodeXml,
  Mail,
  GitBranch,
  Globe,
  Layers,
  Briefcase,
  GraduationCap,
  Trophy,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-full flex flex-col bg-[#020817] text-slate-50 selection:bg-blue-500/30 font-sans">
      {/* NAVBAR */}
      <nav className="fixed top-0 right-0 h-16 bg-[#020817]/80 backdrop-blur-md border-b border-slate-800 z-50 transition-all left-0">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <Link className="flex items-center gap-2.5 text-xl font-bold text-white" href="/">
            <Zap className="w-8 h-8 text-blue-500" strokeWidth={2} />
            <span className="font-extrabold tracking-tight">EduInsight<span className="text-blue-500">.</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 ml-2">
              <Link className="text-sm font-semibold transition-all duration-300 text-slate-300 hover:text-white hover:-translate-y-0.5" href="/login">
                Log in
              </Link>
              <Link className="group relative inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-slate-900 transition-all duration-300 ease-in-out bg-white rounded-full hover:shadow-lg hover:shadow-white/20 hover:-translate-y-0.5 overflow-hidden" href="/register">
                <span className="relative">Get Started</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <div className="flex h-full w-full">
          <div className="flex-1 min-w-0 overflow-x-hidden pb-20 md:pb-0 pt-16">
            
            {/* AMBIENT GLOW EFFECTS */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[80px]"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[80px]"></div>
              <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-emerald-600/5 rounded-full blur-[80px]"></div>
            </div>

            {/* HERO SECTION */}
            <section className="relative pt-10 pb-20 px-4 sm:px-6 z-10 min-h-[85vh] flex items-center">
              <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                {/* Hero Text */}
                <div className="text-left space-y-8">
                  <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900/50 border border-slate-800/80 backdrop-blur-md shadow-2xl">
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </div>
                    <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">EduInsight is Live</span>
                  </div>
                  <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white leading-[1.1] drop-shadow-2xl">
                    Architect Your <br/>
                    <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 bg-clip-text text-transparent animate-gradient-x">Academic Success.</span>
                  </h1>
                  <p className="text-lg text-slate-400 max-w-lg leading-relaxed font-light">
                    The ultimate AI ecosystem for university students. 
                    <span className="text-slate-200 font-medium"> Generate study schedules, prepare for exams, and build your career portfolio.</span>
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-4">
                    <Link className="w-full sm:w-auto relative inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-white bg-blue-600 rounded-full overflow-hidden group hover:bg-blue-500 transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.6)]" href="/register">
                      <span className="relative z-10 flex items-center gap-2">
                        Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                    <Link className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-slate-300 bg-slate-900/40 border border-slate-700/50 rounded-full hover:bg-slate-800/80 hover:text-white backdrop-blur-sm transition-all" href="/login">
                      Log In
                    </Link>
                  </div>
                </div>

                {/* Hero Graphics / Floating Cards */}
                <div className="relative hidden lg:block h-[600px] w-full perspective-[2000px]">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/30 blur-[100px] rounded-full"></div>
                  
                  {/* Floating Card 1 */}
                  <div className="absolute top-12 right-0 w-64 p-5 rounded-2xl bg-slate-900/60 border border-slate-700/50 shadow-2xl backdrop-blur-xl transform rotate-12 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Study Planner</div>
                        <div className="text-xs text-blue-400">Midterms Approaching</div>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[80%] h-full bg-blue-500 rounded-full"></div>
                    </div>
                  </div>

                  {/* Floating Card 2 */}
                  <div className="absolute top-1/3 -left-8 w-72 p-5 rounded-2xl bg-slate-900/70 border border-purple-500/30 shadow-[0_0_50px_-15px_rgba(168,85,247,0.4)] backdrop-blur-xl transform -rotate-6 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-500 z-20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-purple-400">AI EXAM PREP</span>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-[10px] font-bold">A+ PROJECTED</span>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-rose-500 flex items-center justify-center font-bold text-[10px] z-20">ML</div>
                        <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-emerald-500 flex items-center justify-center font-bold text-[10px] z-10">DB</div>
                        <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-blue-500 flex items-center justify-center font-bold text-[10px] z-0">OS</div>
                      </div>
                      <span className="text-xs text-slate-400 font-medium ml-2">Modules Covered</span>
                    </div>
                  </div>

                  {/* Floating Card 3 */}
                  <div className="absolute bottom-16 right-10 w-60 p-5 rounded-2xl bg-slate-900/60 border border-slate-700/50 shadow-2xl backdrop-blur-xl transform rotate-3 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="text-sm font-bold text-white">Career Portfolio</div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-slate-800 rounded animate-pulse"></div>
                      <div className="h-2 w-3/4 bg-slate-800 rounded animate-pulse"></div>
                      <div className="h-2 w-1/2 bg-slate-800 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section className="py-32 px-4 sm:px-6 relative z-10 bg-slate-950/50 border-t border-slate-800/50">
              <div className="max-w-6xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
                  <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">How EduInsight Works</h2>
                  <p className="text-lg text-slate-400">We turned the chaos of student life into a clear, intelligent journey powered by Google Gemini AI.</p>
                </div>
                
                <div className="space-y-32">
                  
                  {/* Step 1 */}
                  <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 space-y-6">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 text-blue-400 border border-blue-800/50 font-bold text-sm">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs">1</span>
                        Plan Your Studies
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-bold text-white">AI Study Planner</h3>
                      <p className="text-slate-400 text-lg leading-relaxed">Stop cramming the night before. Our AI generates customized daily study schedules leading up to your exams, prioritizing your weakest topics.</p>
                      <ul className="space-y-3 pt-4">
                        <li className="flex items-center gap-3 text-slate-300">
                          <CircleCheck className="w-5 h-5 text-blue-500" /> Distributed checklist tracking
                        </li>
                        <li className="flex items-center gap-3 text-slate-300">
                          <CircleCheck className="w-5 h-5 text-blue-500" /> Adaptive pacing based on proficiency
                        </li>
                      </ul>
                    </div>
                    <div className="flex-1 w-full relative">
                      <div className="relative w-full aspect-square max-w-md mx-auto rounded-[2rem] border border-slate-700 bg-slate-900/80 p-6 backdrop-blur-sm shadow-[0_0_50px_-15px_rgba(37,99,235,0.3)]">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                            <span className="text-white font-bold">Week 1</span>
                            <span className="text-blue-400 text-xs font-mono">20 hrs remaining</span>
                          </div>
                          <div className="space-y-3">
                            <div className="p-3 bg-blue-900/20 border border-blue-800/50 rounded-xl flex items-center gap-3">
                              <div className="w-5 h-5 rounded-full border border-blue-500 flex items-center justify-center">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              </div>
                              <span className="text-sm text-slate-200">Review Data Structures</span>
                            </div>
                            <div className="p-3 bg-slate-800/50 rounded-xl flex items-center gap-3">
                              <div className="w-5 h-5 rounded-full border border-slate-600"></div>
                              <span className="text-sm text-slate-400">Read Operating Systems Ch. 3</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20">
                    <div className="flex-1 space-y-6">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/30 text-purple-400 border border-purple-800/50 font-bold text-sm">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500 text-white text-xs">2</span>
                        Prepare Intelligently
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-bold text-white">Interactive Exam Prep</h3>
                      <p className="text-slate-400 text-lg leading-relaxed">Test your knowledge before the real thing. The AI Exam Agent creates interactive mock tests, structured topic summaries, and revision checklists.</p>
                      <ul className="space-y-3 pt-4">
                        <li className="flex items-center gap-3 text-slate-300">
                          <CircleCheck className="w-5 h-5 text-purple-500" /> Deep reasoning for incorrect answers
                        </li>
                        <li className="flex items-center gap-3 text-slate-300">
                          <CircleCheck className="w-5 h-5 text-purple-500" /> Markdown-rendered conceptual guides
                        </li>
                      </ul>
                    </div>
                    <div className="flex-1 w-full">
                      <div className="rounded-xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
                        <div className="flex items-center px-4 py-2 bg-slate-800/50 border-b border-slate-700">
                          <BrainCircuit className="w-4 h-4 text-slate-400 mr-2" />
                          <span className="text-xs text-slate-400 font-mono">Exam Generator</span>
                        </div>
                        <div className="p-4 space-y-4 font-mono text-sm">
                          <div className="text-purple-200 bg-purple-900/20 border border-purple-800/50 p-4 rounded-xl w-full">
                            <div className="font-bold text-white mb-3">Q: What is the primary difference between a stack and a queue?</div>
                            <div className="space-y-2 mt-3">
                              <div className="p-2 border border-slate-700 rounded text-slate-400 hover:bg-slate-800 transition-colors">A) LIFO vs FIFO</div>
                              <div className="p-2 border border-purple-500/50 bg-purple-500/10 rounded text-white flex justify-between">
                                B) Both use FIFO
                                <CircleCheck className="w-4 h-4 text-purple-400" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 space-y-6">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 font-bold text-sm">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white text-xs">3</span>
                        Map Your Future
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-bold text-white">Career Guidance Agent</h3>
                      <p className="text-slate-400 text-lg leading-relaxed">Map your current academic skills against real-world engineering profiles. Discover what you need to learn to become a Backend Developer, AI Engineer, or Data Scientist.</p>
                      <ul className="space-y-3 pt-4">
                        <li className="flex items-center gap-3 text-slate-300">
                          <CircleCheck className="w-5 h-5 text-emerald-500" /> Skills gap analysis
                        </li>
                        <li className="flex items-center gap-3 text-slate-300">
                          <CircleCheck className="w-5 h-5 text-emerald-500" /> Horizontal & vertical career timelines
                        </li>
                      </ul>
                    </div>
                    <div className="flex-1 w-full relative">
                      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl relative">
                        <div className="absolute top-4 right-4 w-12 h-12 rounded-full border-4 border-emerald-500 border-l-slate-700 flex items-center justify-center">
                          <span className="text-xs font-bold text-emerald-400">82%</span>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-1">Target: AI Engineer</h4>
                        <p className="text-sm text-slate-400 mb-6">Current Progress</p>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="text-xs font-bold text-emerald-400 mb-2 uppercase tracking-wider">Mastered (3)</div>
                            <div className="flex gap-2">
                              <span className="px-3 py-1 bg-emerald-900/30 text-emerald-300 border border-emerald-800 rounded-full text-xs">Python</span>
                              <span className="px-3 py-1 bg-emerald-900/30 text-emerald-300 border border-emerald-800 rounded-full text-xs">SQL</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-rose-400 mb-2 uppercase tracking-wider">To Learn (2)</div>
                            <div className="flex gap-2">
                              <button className="px-3 py-1 bg-rose-900/30 text-rose-300 border border-rose-800 rounded-full text-xs hover:bg-rose-800/50 transition-colors">PyTorch</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-32 px-4 sm:px-6 relative z-10">
              <div className="max-w-5xl mx-auto">
                <div className="relative rounded-[2.5rem] bg-gradient-to-br from-blue-900/40 via-cyan-900/40 to-purple-900/40 border border-blue-500/20 p-10 sm:p-20 text-center overflow-hidden shadow-2xl">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>
                  <div className="relative z-10 space-y-8">
                    <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">Ready to Master Your Studies?</h2>
                    <p className="text-lg text-blue-200/80 max-w-2xl mx-auto font-light">Join the future of education and let AI guide your academic journey with precision.</p>
                    <div className="pt-4 flex justify-center">
                      <Link className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-slate-950 hover:bg-slate-200 font-extrabold text-base rounded-full shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all hover:scale-105" href="/register">
                        Create Your Free Profile <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-[#020817] text-slate-400 border-t border-slate-800 text-xs mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="md:col-span-2 space-y-4">
                    <Link className="inline-flex items-center gap-2.5 text-xl font-bold text-white" href="/">
                      <Zap className="w-8 h-8 text-blue-500" strokeWidth={2} />
                      <span className="font-extrabold tracking-tight">EduInsight<span className="text-blue-500">.</span></span>
                    </Link>
                    <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                      The AI-driven academic mentorship platform. Empowering students with intelligent study plans, mock exams, and personalized career pathways.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Agents</h4>
                    <ul className="space-y-2 font-medium">
                      <li><Link className="hover:text-blue-400 transition-colors" href="/overview">Study Planner</Link></li>
                      <li><Link className="hover:text-blue-400 transition-colors" href="/overview">Exam Prep</Link></li>
                      <li><Link className="hover:text-blue-400 transition-colors" href="/overview">Career Guidance</Link></li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Connect</h4>
                    <ul className="space-y-2 font-medium">
                      <li><a className="hover:text-blue-400 transition-colors" href="#">GitHub</a></li>
                      <li><a className="hover:text-blue-400 transition-colors" href="#">Support</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
