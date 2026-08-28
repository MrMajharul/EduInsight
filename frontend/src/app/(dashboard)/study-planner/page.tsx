"use client";
import React, { useState } from 'react';
import { CalendarCheck, BookOpen, Clock, Activity, Wand2, Download, AlertCircle } from 'lucide-react';

export default function StudyPlannerPage() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    subject_name: 'Database Systems',
    exam_date: '2026-10-20',
    weak_topics: 'SQL Joins, Normalization, Concurrency',
    daily_hours: 3.5,
    current_level: 'Intermediate',
    predicted_risk: 'MEDIUM'
  });

  const generatePlan = async () => {
    setLoading(true);
    setError(null);
    setPlan(null);
    
    const payload = {
      subject_name: formData.subject_name,
      exam_date: formData.exam_date,
      weak_topics: formData.weak_topics.split(',').map(s => s.trim()),
      daily_hours: formData.daily_hours,
      current_level: formData.current_level,
      predicted_risk: formData.predicted_risk
    };

    try {
      const res = await fetch('http://localhost:8000/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || "Failed to generate plan");
      }
      
      setPlan(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect to Planner API. Ensure backend is running and Gemini API key is set.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 bg-cyan-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30">
            <CalendarCheck className="text-cyan-400" size={20} />
          </div>
          <h1 className="text-3xl font-bold text-white">AI Study Planner</h1>
        </div>
        <p className="text-zinc-400">Generative AI automatically builds your daily study roadmap based on ML predictions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#111622] border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="text-emerald-400" size={18} /> Plan Parameters
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Target Subject</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-2.5 text-zinc-500" size={16} />
                  <input 
                    type="text" 
                    value={formData.subject_name}
                    onChange={e => setFormData({...formData, subject_name: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2 pl-10 pr-3 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">Weak Topics (Comma separated)</label>
                <textarea 
                  rows={2}
                  value={formData.weak_topics}
                  onChange={e => setFormData({...formData, weak_topics: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Daily Hours</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 text-zinc-500" size={16} />
                    <input 
                      type="number" 
                      step="0.5"
                      value={formData.daily_hours}
                      onChange={e => setFormData({...formData, daily_hours: parseFloat(e.target.value)})}
                      className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2 pl-10 pr-3 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Exam Date</label>
                  <input 
                    type="date" 
                    value={formData.exam_date}
                    onChange={e => setFormData({...formData, exam_date: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Current Level</label>
                  <select 
                    value={formData.current_level} 
                    onChange={e => setFormData({...formData, current_level: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">ML Risk</label>
                  <select 
                    value={formData.predicted_risk} 
                    onChange={e => setFormData({...formData, predicted_risk: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={generatePlan}
              disabled={loading}
              className="w-full mt-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_4px_14px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate AI Plan'} <Wand2 size={18} />
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
            {!plan && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                <CalendarCheck size={48} className="mb-4 opacity-50" />
                <p>Configure your parameters and click generate to build your roadmap.</p>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-cyan-400">
                <Wand2 size={48} className="mb-4 animate-pulse" />
                <p className="animate-pulse font-medium">Gemini AI is crafting your personalized roadmap...</p>
              </div>
            )}

            {plan && (
              <div className="animate-in fade-in space-y-8">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                  <h3 className="text-xl font-bold text-white">
                    {plan.subject_name} Roadmap
                  </h3>
                  <button className="flex items-center gap-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                    <Download size={14} /> Export PDF
                  </button>
                </div>

                <div className="space-y-8">
                  {plan.weekly_schedule?.map((week: any, wIdx: number) => (
                    <div key={wIdx} className="space-y-4 relative">
                      <h4 className="font-bold text-white text-lg sticky top-0 bg-[#111622] py-2 z-10 border-b border-zinc-800/50">
                        Week {week.week_number}: <span className="text-cyan-400">{week.weekly_goal}</span>
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {week.days?.map((day: any, dIdx: number) => (
                          <div key={dIdx} className="bg-[#0a0a0a] border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
                            <h5 className="font-bold text-cyan-400 mb-3 flex items-center justify-between">
                              {day.day_name} 
                              <span className="text-zinc-500 text-xs px-2 py-1 bg-zinc-900 rounded-full">{day.duration_hours}h • {day.priority}</span>
                            </h5>
                            <div className="mb-3">
                              <strong className="text-zinc-100 block text-sm">{day.topic}</strong>
                              <span className="text-zinc-500 text-xs">{day.subtopics?.join(', ')}</span>
                            </div>
                            <ul className="space-y-1.5">
                              {day.activities?.map((act: string, aIdx: number) => (
                                <li key={aIdx} className="flex items-start gap-2 text-xs text-zinc-400 leading-snug">
                                  <span className="mt-1 h-1 w-1 rounded-full bg-cyan-500/50 shrink-0"></span> {act}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {plan.exam_readiness_checklist && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 mt-8">
                    <h4 className="font-bold text-emerald-400 mb-3 text-sm uppercase tracking-wide">Exam Readiness Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {plan.exam_readiness_checklist.map((item: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-emerald-100/70">
                          <input type="checkbox" className="accent-emerald-500 w-4 h-4 rounded border-emerald-500/30" />
                          <span>{item}</span>
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
