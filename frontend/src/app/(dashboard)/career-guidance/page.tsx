"use client";
import React, { useState } from 'react';
import { Briefcase, Code2, Database, Brain, Rocket, Download, Target, AlertCircle } from 'lucide-react';

export default function CareerGuidancePage() {
  const [loading, setLoading] = useState(false);
  const [careerData, setCareerData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    programming_skills: 'Python, JavaScript',
    framework_skills: 'React, Django',
    database_skills: 'PostgreSQL',
    problem_solving: 'Intermediate',
    academic_performance: 'High',
    interests: 'Web Development, AI',
    projects: 'E-commerce site, ML Predictor',
    academic_level: 'Junior'
  });

  const analyzeCareer = async () => {
    setLoading(true);
    setError(null);
    setCareerData(null);
    
    const payload = {
      programming_skills: formData.programming_skills.split(',').map(s => s.trim()),
      framework_skills: formData.framework_skills.split(',').map(s => s.trim()),
      database_skills: formData.database_skills.split(',').map(s => s.trim()),
      problem_solving: formData.problem_solving,
      academic_performance: formData.academic_performance,
      interests: formData.interests.split(',').map(s => s.trim()),
      projects: formData.projects.split(',').map(s => s.trim()),
      academic_level: formData.academic_level,
    };

    try {
      const res = await fetch('http://localhost:8000/api/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to generate career guidance");
      }

      setCareerData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect to Career API. Ensure backend is running and Gemini API key is set.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
            <Briefcase className="text-emerald-400" size={20} />
          </div>
          <h1 className="text-3xl font-bold text-white">AI Career Advisor</h1>
        </div>
        <p className="text-zinc-400">Map your current technical skills and academic profile to generate optimal career pathways.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#111622] border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Target className="text-cyan-400" size={18} /> Skill Profile
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Programming Languages</label>
                <div className="relative">
                  <Code2 className="absolute left-3 top-2.5 text-zinc-500" size={16} />
                  <input 
                    type="text" 
                    value={formData.programming_skills}
                    onChange={e => setFormData({...formData, programming_skills: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2 pl-10 pr-3 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">Frameworks</label>
                <div className="relative">
                  <Rocket className="absolute left-3 top-2.5 text-zinc-500" size={16} />
                  <input 
                    type="text" 
                    value={formData.framework_skills}
                    onChange={e => setFormData({...formData, framework_skills: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2 pl-10 pr-3 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">Databases</label>
                <div className="relative">
                  <Database className="absolute left-3 top-2.5 text-zinc-500" size={16} />
                  <input 
                    type="text" 
                    value={formData.database_skills}
                    onChange={e => setFormData({...formData, database_skills: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2 pl-10 pr-3 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Problem Solving</label>
                  <select 
                    value={formData.problem_solving} 
                    onChange={e => setFormData({...formData, problem_solving: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Academic Perf.</label>
                  <select 
                    value={formData.academic_performance} 
                    onChange={e => setFormData({...formData, academic_performance: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm text-zinc-400 mb-1">Recent Projects</label>
                  <input 
                    type="text" 
                    value={formData.projects}
                    onChange={e => setFormData({...formData, projects: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Academic Level</label>
                  <input 
                    type="text" 
                    value={formData.academic_level}
                    onChange={e => setFormData({...formData, academic_level: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Interests</label>
                  <input 
                    type="text" 
                    value={formData.interests}
                    onChange={e => setFormData({...formData, interests: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

            </div>

            <button 
              onClick={analyzeCareer}
              disabled={loading}
              className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_4px_14px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze Career Path'} <Brain size={18} />
            </button>

            {error && (
              <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2">
                <AlertCircle className="text-rose-400 shrink-0 mt-0.5" size={16} />
                <span className="text-xs text-rose-400 leading-tight">{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Output */}
        <div className="lg:col-span-8">
          <div className="bg-[#111622] border border-zinc-800 rounded-2xl p-8 min-h-[500px]">
            {!careerData && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                <Briefcase size={48} className="mb-4 opacity-50" />
                <p>Input your skills on the left to generate your career roadmap.</p>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-emerald-400">
                <Brain size={48} className="mb-4 animate-pulse" />
                <p className="animate-pulse font-medium">Gemini AI is analyzing industry trends to map your career...</p>
              </div>
            )}

            {careerData && (
              <div className="animate-in fade-in space-y-8">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">Career Alignment Analysis</h3>
                    <p className="text-emerald-400 text-sm font-medium mt-1">Target Profile: {careerData.target_career}</p>
                  </div>
                  <button className="flex items-center gap-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                    <Download size={14} /> Export Report
                  </button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-zinc-300 text-sm uppercase tracking-wider mb-2">Top Matched Roles</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {careerData.top_careers?.map((career: any, idx: number) => (
                      <div key={idx} className="bg-[#0a0a0a] border border-emerald-500/30 rounded-xl p-4 relative overflow-hidden group hover:border-emerald-400 transition-colors">
                        <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none"></div>
                        <h5 className="font-bold text-white text-sm leading-tight flex items-start justify-between">
                          <span>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'} {career.role}</span>
                        </h5>
                        <div className="mt-3 inline-flex bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded text-xs font-bold">
                          {Math.round(career.confidence * 100)}% Match
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {careerData.skills_gap_analysis && (
                  <div>
                    <h4 className="font-bold text-zinc-300 text-sm uppercase tracking-wider mb-3">Skill Gap Analysis</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {careerData.skills_gap_analysis.map((skill: any, idx: number) => (
                        <div key={idx} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-white text-sm">{skill.skill_name}</span>
                            <span className="text-zinc-500 text-xs ml-3 hidden md:inline">{skill.action_item}</span>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${skill.status.toLowerCase() === 'acquired' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                            {skill.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {careerData.roadmap && (
                  <div>
                    <h4 className="font-bold text-zinc-300 text-sm uppercase tracking-wider mb-3">Action Plan Roadmap</h4>
                    <div className="space-y-4">
                      {careerData.roadmap.map((phase: any, idx: number) => (
                        <div key={idx} className="bg-[#0a0a0a] border border-zinc-800 rounded-xl p-5 border-l-4 border-l-emerald-500">
                          <h5 className="font-bold text-white mb-1 flex items-center justify-between">
                            {phase.phase_name}
                            <span className="text-emerald-400 text-xs bg-emerald-500/10 px-2 py-0.5 rounded">{phase.duration}</span>
                          </h5>
                          <p className="text-zinc-400 text-sm mb-3">{phase.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {phase.skills_to_learn?.map((skill: string, sIdx: number) => (
                              <span key={sIdx} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-1 rounded-full border border-zinc-700">{skill}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
