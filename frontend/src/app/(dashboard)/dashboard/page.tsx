"use client";
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AlertCircle, TrendingUp, BookOpen, Briefcase, GraduationCap, Clock, CheckCircle2, Sliders, Activity, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  // ML Input State
  const [mlInputs, setMlInputs] = useState({
    previous_gpa: 3.2,
    current_gpa: 3.1,
    attendance_pct: 85,
    midterm_marks: 78,
    quiz_average: 80,
    assignment_average: 85,
    study_hours: 3.5,
    course_load: 5,
    previous_failed_courses: 0,
    study_frequency: "Medium",
    class_participation: "Medium",
    assignment_completion: "High"
  });

  const [riskData, setRiskData] = useState<any>(null);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [explainData, setExplainData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Mock data for charts
  const [gpaData, setGpaData] = useState([
    { term: 'Fall 2024', gpa: 2.8 },
    { term: 'Spring 2025', gpa: 3.1 },
    { term: 'Fall 2025', gpa: 3.3 },
    { term: 'Spring 2026', gpa: 3.42 }
  ]);

  const runAnalytics = async () => {
    setLoading(true);
    try {
      const riskRes = await fetch('http://localhost:8000/api/predictions/risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mlInputs)
      });
      const riskResult = await riskRes.json();
      
      const perfRes = await fetch('http://localhost:8000/api/predictions/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mlInputs)
      });
      const perfResult = await perfRes.json();

      const explainRes = await fetch('http://localhost:8000/api/predictions/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mlInputs)
      });
      const explainResult = await explainRes.json();

      setRiskData(riskResult);
      setPerformanceData(perfResult);
      setExplainData(explainResult);

      setGpaData([
        { term: 'Fall 2024', gpa: mlInputs.previous_gpa },
        { term: 'Spring 2025', gpa: mlInputs.current_gpa },
        { term: 'Prediction', gpa: perfResult.predicted_gpa }
      ]);
      
    } catch (err) {
      console.error("Failed to run analytics", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    let { name, value } = e.target;
    
    if (["study_frequency", "class_participation", "assignment_completion"].includes(name)) {
      setMlInputs(prev => ({ ...prev, [name]: value }));
      return;
    }
    
    let numVal = Number(value);
    
    if (name.includes('gpa') && numVal > 4.0) numVal = 4.0;
    if ((name.includes('marks') || name.includes('pct') || name.includes('average')) && numVal > 100) numVal = 100;
    if (name === 'study_hours' && numVal > 24) numVal = 24;
    if (name === 'course_load' && numVal > 10) numVal = 10;
    if (numVal < 0) numVal = 0;

    setMlInputs(prev => ({
      ...prev,
      [name]: value.toString().endsWith('.') ? value : numVal
    }));
  };

  // Animation variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  // Get dynamic colors based on risk
  const getRiskColors = () => {
    if (!riskData) return { border: 'border-emerald-500/20', bg: 'bg-emerald-500/5', text: 'text-emerald-400', shadow: 'shadow-[0_0_40px_rgba(16,185,129,0.1)]', glow: 'bg-emerald-500' };
    if (riskData.risk_level === 'HIGH') return { border: 'border-rose-500/30', bg: 'bg-rose-500/10', text: 'text-rose-400', shadow: 'shadow-[0_0_50px_rgba(244,63,94,0.15)]', glow: 'bg-rose-500' };
    if (riskData.risk_level === 'MEDIUM') return { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400', shadow: 'shadow-[0_0_50px_rgba(245,158,11,0.15)]', glow: 'bg-amber-500' };
    return { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', shadow: 'shadow-[0_0_50px_rgba(16,185,129,0.15)]', glow: 'bg-emerald-500' };
  };

  const riskTheme = getRiskColors();

  return (
    <div className="relative min-h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-emerald-500/30 overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vh] bg-emerald-900/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vh] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

      <div className="relative z-10 p-4 md:p-8 max-w-[1920px] mx-auto">
        
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center border border-white/10 shadow-lg backdrop-blur-md">
              <Sparkles className="text-emerald-400" size={24} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent tracking-tight">
                EduInsight AI
              </h1>
              <p className="text-zinc-400 text-sm font-medium mt-1 tracking-wide">Predictive Analytics Engine</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={runAnalytics}
            disabled={loading}
            className="group relative overflow-hidden bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 text-white font-semibold py-3 px-8 rounded-2xl transition-all shadow-xl flex items-center gap-3 disabled:opacity-50"
          >
            {/* Button Hover Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              {loading ? 'Processing Data...' : 'Run Analytics'}
              <Activity size={18} className={loading ? "animate-spin text-emerald-400" : "text-emerald-400 group-hover:rotate-12 transition-transform"} />
            </span>
          </motion.button>
        </motion.header>

        <motion.main 
          variants={containerVars}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8"
        >
          
          {/* ML Control Panel */}
          <motion.div variants={itemVars} className="xl:col-span-3 bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 h-fit shadow-2xl relative overflow-hidden group">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <Sliders className="text-blue-400" size={18} />
              </div>
              <h3 className="text-zinc-100 font-semibold tracking-wide">Parameters</h3>
            </div>

            <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-3 custom-scrollbar">
              <div className="space-y-1.5">
                <label className="flex justify-between text-xs text-zinc-400 font-medium">
                  <span>Attendance</span>
                  <span className="text-zinc-200">{mlInputs.attendance_pct}%</span>
                </label>
                <input type="range" name="attendance_pct" min="0" max="100" value={mlInputs.attendance_pct} onChange={handleChange} className="w-full accent-emerald-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer" />
              </div>
              
              <div className="space-y-1.5">
                <label className="flex justify-between text-xs text-zinc-400 font-medium">
                  <span>Study Hours/Day</span>
                  <span className="text-zinc-200">{mlInputs.study_hours}h</span>
                </label>
                <input type="range" name="study_hours" min="0" max="10" step="0.5" value={mlInputs.study_hours} onChange={handleChange} className="w-full accent-blue-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer" />
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-xs text-zinc-400 font-medium">Prev GPA</label>
                  <input type="number" step="0.1" name="previous_gpa" value={mlInputs.previous_gpa} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all hover:bg-black/60" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs text-zinc-400 font-medium">Curr GPA</label>
                  <input type="number" step="0.1" name="current_gpa" value={mlInputs.current_gpa} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:bg-black/60" />
                </div>
              </div>
              
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs text-zinc-400 font-medium">Midterm Marks (%)</label>
                <input type="number" name="midterm_marks" value={mlInputs.midterm_marks} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all hover:bg-black/60" />
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-xs text-zinc-400 font-medium">Fails</label>
                  <input type="number" name="previous_failed_courses" value={mlInputs.previous_failed_courses} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all hover:bg-black/60" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs text-zinc-400 font-medium">Load</label>
                  <input type="number" name="course_load" value={mlInputs.course_load} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:bg-black/60" />
                </div>
              </div>
              
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs text-zinc-400 font-medium">Study Frequency</label>
                <select name="study_frequency" value={mlInputs.study_frequency} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all hover:bg-black/60 appearance-none">
                  <option>Low</option><option>Medium</option><option>High</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Dashboard Content */}
          <div className="xl:col-span-9 flex flex-col gap-6 md:gap-8">
            
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              
              {/* Risk Card */}
              <motion.div variants={itemVars} className={`relative overflow-hidden bg-white/[0.02] backdrop-blur-2xl border ${riskTheme.border} rounded-3xl p-8 transition-all duration-700 ${riskTheme.shadow} group`}>
                <div className={`absolute top-0 right-0 w-32 h-32 ${riskTheme.glow} blur-[80px] opacity-20 rounded-full`} />
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className={`p-2 rounded-xl border ${riskTheme.border} ${riskTheme.bg}`}>
                    <AlertCircle className={riskTheme.text} size={20} />
                  </div>
                  <h3 className="text-zinc-300 font-medium tracking-wide">Academic Risk Assessment</h3>
                </div>
                <div className="flex items-baseline gap-4 relative z-10">
                  <span className={`text-5xl font-black tracking-tighter ${riskTheme.text} drop-shadow-md`}>
                    {riskData ? riskData.risk_level : "PENDING"}
                  </span>
                </div>
                <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-zinc-400 font-medium">Model Confidence (Pass)</span>
                    <span className="text-zinc-100 font-bold tracking-wide">{riskData ? `${(riskData.pass_probability * 100).toFixed(1)}%` : '--'}</span>
                  </div>
                  <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5 p-px">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: riskData ? `${riskData.pass_probability * 100}%` : '0%' }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${riskTheme.glow} relative`}
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Performance Card */}
              <motion.div variants={itemVars} className="relative overflow-hidden bg-white/[0.02] backdrop-blur-2xl border border-white/10 hover:border-blue-500/30 rounded-3xl p-8 transition-all duration-500 shadow-xl group">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500 blur-[80px] opacity-10 rounded-full group-hover:opacity-20 transition-opacity duration-500" />
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <TrendingUp className="text-blue-400" size={20} />
                  </div>
                  <h3 className="text-zinc-300 font-medium tracking-wide">Expected Performance</h3>
                </div>
                <div className="flex items-baseline gap-3 relative z-10">
                  <span className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400 drop-shadow-sm">
                    {performanceData ? performanceData.predicted_gpa.toFixed(2) : "--"}
                  </span>
                  <span className="text-zinc-500 font-medium">/ 4.0 GPA</span>
                </div>
                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-sm relative z-10">
                  <span className="text-zinc-400 font-medium">Projected Final Marks</span>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 font-bold shadow-sm">
                      {performanceData ? `${performanceData.predicted_marks.toFixed(1)}%` : '--'}
                    </span>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 h-full">
              
              {/* GPA Trend */}
              <motion.div variants={itemVars} className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 hover:border-white/20 rounded-3xl p-6 md:p-8 transition-all duration-500 shadow-xl flex flex-col min-h-[400px]">
                <h3 className="text-zinc-300 font-medium mb-8 flex justify-between items-center tracking-wide">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                      <Activity className="text-indigo-400" size={18} />
                    </div>
                    <span>GPA Trajectory</span>
                  </div>
                  {performanceData && <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full uppercase tracking-widest border border-blue-500/20">Live Prediction</span>}
                </h3>
                <div className="flex-1 min-h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={gpaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                      <XAxis dataKey="term" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                      <YAxis domain={[0.0, 4.0]} stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                        itemStyle={{ color: '#e4e4e7', fontWeight: 600 }}
                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2, strokeDasharray: '4 4' }}
                      />
                      <Area type="monotone" dataKey="gpa" stroke="#818cf8" strokeWidth={4} fillOpacity={1} fill="url(#colorGpa)" activeDot={{ r: 6, fill: '#818cf8', stroke: '#000', strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Explainable AI Box */}
              <motion.div variants={itemVars} className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 hover:border-white/20 rounded-3xl p-6 md:p-8 flex flex-col justify-between transition-all duration-500 shadow-xl min-h-[400px]">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
                        <BookOpen className="text-amber-400" size={18} />
                      </div>
                      <h3 className="text-zinc-100 font-semibold tracking-wide">Explainable AI</h3>
                    </div>
                    {explainData && <span className="bg-amber-500/10 text-amber-500 text-[10px] px-3 py-1.5 rounded-full uppercase tracking-widest font-bold border border-amber-500/20">SHAP values</span>}
                  </div>
                  
                  {!explainData ? (
                    <div className="flex flex-col items-center justify-center h-48 text-center px-4">
                      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                        <Sparkles className="text-zinc-500" size={24} />
                      </div>
                      <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                        Run analytics to unveil the hidden factors driving your prediction model.
                      </p>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <p className="text-sm text-zinc-300 leading-relaxed">
                        Model classification rationale for <strong className={`${riskTheme.text} font-bold px-2 py-0.5 rounded bg-white/5 mx-1 border ${riskTheme.border}`}>{riskData?.risk_level} RISK</strong>:
                      </p>
                      <div className="space-y-3">
                        <AnimatePresence>
                          {explainData.explanation && Object.entries(explainData.explanation).map(([feature, value]: [string, any], idx) => {
                            const isNegative = typeof value === 'string' && (value.includes('Low') || value.includes('Poor'));
                            const isLowNum = typeof value === 'number' && value < 60;
                            const isRiskFactor = riskData?.risk_level === 'HIGH' && (isNegative || isLowNum);
                            
                            return (
                              <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={idx} 
                                className={`flex items-center justify-between p-3.5 rounded-2xl border ${isRiskFactor ? 'bg-rose-500/10 border-rose-500/20' : 'bg-black/30 border-white/5'} hover:bg-black/50 transition-colors`}
                              >
                                <span className="text-sm text-zinc-400 capitalize font-medium">{feature.replace('_', ' ')}</span>
                                <span className={`text-sm font-bold ${isRiskFactor ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'text-zinc-100'}`}>
                                  {value}
                                </span>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>

            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
