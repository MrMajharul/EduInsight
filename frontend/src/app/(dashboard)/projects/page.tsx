"use client";
import React, { useState } from 'react';
import { FolderKanban, Code2, Brain, Download, AlertCircle, Rocket, FileText, CheckCircle } from 'lucide-react';

export default function ProjectRecommendationsPage() {
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedReadme, setExpandedReadme] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    domain: 'Full Stack Web Development',
    difficulty: 'Intermediate',
    tech_stack: 'React, Node.js, PostgreSQL',
    project_scope: 'Individual'
  });

  const generateProjects = async () => {
    setLoading(true);
    setError(null);
    setProjectData(null);
    setExpandedReadme(null);
    
    const payload = {
      domain: formData.domain,
      difficulty: formData.difficulty,
      tech_stack: formData.tech_stack.split(',').map(s => s.trim()),
      project_scope: formData.project_scope,
    };

    try {
      const res = await fetch('http://localhost:8001/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to generate project recommendations");
      }

      setProjectData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect to API. Ensure backend is running and Gemini API key is set.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 bg-orange-500/20 rounded-xl flex items-center justify-center border border-orange-500/30">
            <FolderKanban className="text-orange-400" size={20} />
          </div>
          <h1 className="text-3xl font-bold text-white">Project Builder</h1>
        </div>
        <p className="text-zinc-400">Generate portfolio-ready project ideas mapped to your tech stack and skill level.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#111622] border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Rocket className="text-orange-400" size={18} /> Project Parameters
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Target Domain</label>
                <input 
                  type="text" 
                  value={formData.domain}
                  onChange={e => setFormData({...formData, domain: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">Tech Stack (Comma separated)</label>
                <div className="relative">
                  <Code2 className="absolute left-3 top-2.5 text-zinc-500" size={16} />
                  <input 
                    type="text" 
                    value={formData.tech_stack}
                    onChange={e => setFormData({...formData, tech_stack: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2 pl-10 pr-3 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Difficulty</label>
                  <select 
                    value={formData.difficulty} 
                    onChange={e => setFormData({...formData, difficulty: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-orange-500"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Scope</label>
                  <select 
                    value={formData.project_scope} 
                    onChange={e => setFormData({...formData, project_scope: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-orange-500"
                  >
                    <option>Individual</option>
                    <option>Team</option>
                    <option>Hackathon</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={generateProjects}
              disabled={loading}
              className="w-full mt-6 bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_4px_14px_rgba(249,115,22,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Generating Ideas...' : 'Generate Projects'} <Brain size={18} />
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
            {!projectData && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                <FolderKanban size={48} className="mb-4 opacity-50" />
                <p>Input your stack on the left to generate project ideas.</p>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-orange-400">
                <Brain size={48} className="mb-4 animate-pulse" />
                <p className="animate-pulse font-medium">Gemini AI is crafting perfect project recommendations...</p>
              </div>
            )}

            {projectData && (
              <div className="animate-in fade-in space-y-8">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                  <h3 className="text-xl font-bold text-white">Recommended Projects</h3>
                </div>

                <div className="space-y-6">
                  {projectData.projects?.map((proj: any, idx: number) => (
                    <div key={idx} className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden group">
                      
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-bold text-orange-400">{proj.title}</h4>
                          <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                            {proj.difficulty}
                          </span>
                        </div>
                        <p className="text-zinc-300 text-sm mb-4">{proj.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <h5 className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-2">Key Features</h5>
                            <ul className="space-y-1">
                              {proj.key_features?.map((f: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                                  <CheckCircle size={12} className="text-orange-500/50 shrink-0 mt-0.5" /> {f}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-2">Tech Stack</h5>
                            <div className="flex flex-wrap gap-2">
                              {proj.suggested_tech_stack?.map((t: string, i: number) => (
                                <span key={i} className="text-[10px] bg-[#0a0a0a] border border-zinc-800 text-zinc-300 px-2 py-1 rounded">{t}</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {proj.implementation_milestones?.length > 0 && (
                          <div className="bg-[#0a0a0a] border border-zinc-800/50 rounded-lg p-4 mb-4">
                            <h5 className="text-xs text-zinc-400 uppercase tracking-wider font-bold mb-3">Implementation Plan</h5>
                            <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
                              {proj.implementation_milestones.map((ms: any, mIdx: number) => (
                                <div key={mIdx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                  <div className="flex items-center justify-center w-4 h-4 rounded-full border border-orange-500 bg-[#0a0a0a] text-orange-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow shadow-orange-500/20 z-10">
                                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                                  </div>
                                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                                    <div className="flex justify-between mb-1">
                                      <span className="font-bold text-zinc-200 text-xs">{ms.title}</span>
                                      <span className="text-[10px] text-zinc-500">{ms.target_date}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <button 
                          onClick={() => setExpandedReadme(expandedReadme === idx ? null : idx)}
                          className="w-full flex items-center justify-center gap-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg transition-colors border border-zinc-700"
                        >
                          <FileText size={16} /> {expandedReadme === idx ? 'Hide Template' : 'View README Template'}
                        </button>
                      </div>

                      {expandedReadme === idx && proj.readme_template && (
                        <div className="border-t border-zinc-800 bg-[#0a0a0a] p-6 text-xs text-zinc-400 font-mono whitespace-pre-wrap overflow-x-auto">
                          {proj.readme_template}
                        </div>
                      )}
                      
                    </div>
                  ))}
                </div>
                
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
