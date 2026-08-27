"use client";
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AlertCircle, TrendingUp, BookOpen, Briefcase, GraduationCap, Clock, CheckCircle2, Sliders, Activity } from 'lucide-react';

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
      // Fetch Risk Prediction
      const riskRes = await fetch('http://localhost:8000/api/predictions/risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mlInputs)
      });
      const riskResult = await riskRes.json();
      
      // Fetch Performance Prediction
      const perfRes = await fetch('http://localhost:8000/api/predictions/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mlInputs)
      });
      const perfResult = await perfRes.json();

      // Fetch Explainable AI Data
      const explainRes = await fetch('http://localhost:8000/api/predictions/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mlInputs)
      });
      const explainResult = await explainRes.json();

      setRiskData(riskResult);
      setPerformanceData(perfResult);
      setExplainData(explainResult);

      // Update the chart to reflect the new predicted GPA
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
    
    // Logical bounds checking
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-8 font-sans selection:bg-emerald-500/30">
      
      {/* Header */}
      <header className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <GraduationCap className="text-emerald-400" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-500 bg-clip-text text-transparent">EduInsight AI</h1>
            <p className="text-zinc-500 text-sm">Interactive ML Dashboard Showcase</p>
          </div>
        </div>
        <button 
          onClick={runAnalytics}
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Running Inference...' : 'Run ML Analytics'} <Activity size={18} />
        </button>
      </header>

      <main className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* ML Control Panel */}
        <div className="xl:col-span-3 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 h-fit">
          <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4">
            <Sliders className="text-blue-400" size={18} />
            <h3 className="text-zinc-100 font-semibold">ML Control Panel</h3>
          </div>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Attendance (%) - {mlInputs.attendance_pct}%</label>
              <input type="range" name="attendance_pct" min="0" max="100" value={mlInputs.attendance_pct} onChange={handleChange} className="w-full accent-emerald-500" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Study Hours/Day - {mlInputs.study_hours}h</label>
              <input type="range" name="study_hours" min="0" max="10" step="0.5" value={mlInputs.study_hours} onChange={handleChange} className="w-full accent-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Prev GPA</label>
                <input type="number" step="0.1" name="previous_gpa" value={mlInputs.previous_gpa} onChange={handleChange} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-2 text-sm text-white" />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Curr GPA</label>
                <input type="number" step="0.1" name="current_gpa" value={mlInputs.current_gpa} onChange={handleChange} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-2 text-sm text-white" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Midterm Marks (%)</label>
              <input type="number" name="midterm_marks" value={mlInputs.midterm_marks} onChange={handleChange} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-2 text-sm text-white" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Failed Courses</label>
                <input type="number" name="previous_failed_courses" value={mlInputs.previous_failed_courses} onChange={handleChange} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-2 text-sm text-white" />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Course Load</label>
                <input type="number" name="course_load" value={mlInputs.course_load} onChange={handleChange} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-2 text-sm text-white" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Study Frequency</label>
              <select name="study_frequency" value={mlInputs.study_frequency} onChange={handleChange} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-2 text-sm text-white focus:outline-none">
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="xl:col-span-9 flex flex-col gap-6">
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Risk Card */}
            <div className={`border rounded-2xl p-6 transition-all ${riskData?.risk_level === 'HIGH' ? 'bg-rose-950/30 border-rose-500/50' : riskData?.risk_level === 'MEDIUM' ? 'bg-orange-950/30 border-orange-500/50' : 'bg-emerald-950/20 border-emerald-500/30'}`}>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className={riskData?.risk_level === 'HIGH' ? 'text-rose-400' : 'text-emerald-400'} size={18} />
                <h3 className="text-zinc-300 font-medium">Model Output: Academic Risk</h3>
              </div>
              <div className="flex items-baseline gap-3">
                <span className={`text-4xl font-bold ${riskData?.risk_level === 'HIGH' ? 'text-rose-400' : riskData?.risk_level === 'MEDIUM' ? 'text-orange-400' : 'text-emerald-400'}`}>
                  {riskData ? riskData.risk_level : "PENDING"}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-800/50">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-400">Pass Probability</span>
                  <span className="text-zinc-200 font-bold">{riskData ? `${(riskData.pass_probability * 100).toFixed(1)}%` : '--'}</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${riskData?.risk_level === 'HIGH' ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: riskData ? `${riskData.pass_probability * 100}%` : '0%' }}></div>
                </div>
              </div>
            </div>

            {/* Performance Card */}
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 transition-all">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-blue-400" size={18} />
                <h3 className="text-zinc-300 font-medium">Model Output: Expected Performance</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-zinc-100">{performanceData ? performanceData.predicted_gpa.toFixed(2) : "--"}</span>
                <span className="text-zinc-500 text-sm">/ 4.0 GPA</span>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-800/50 flex justify-between text-sm">
                <span className="text-zinc-400">Predicted Final Marks</span>
                <span className="text-blue-400 font-bold">{performanceData ? `${performanceData.predicted_marks.toFixed(1)}%` : '--'}</span>
              </div>
            </div>

          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* GPA Trend */}
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-zinc-400 font-medium mb-6 flex justify-between">
                <span>Dynamic GPA Trajectory</span>
                {performanceData && <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">Live Prediction</span>}
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={gpaData}>
                    <defs>
                      <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="term" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis domain={[0.0, 4.0]} stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                      itemStyle={{ color: '#e4e4e7' }}
                    />
                    <Area type="monotone" dataKey="gpa" stroke="#60a5fa" strokeWidth={3} fillOpacity={1} fill="url(#colorGpa)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Explainable AI Box */}
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="text-amber-400" size={18} />
                    <h3 className="text-zinc-100 font-semibold">Explainable AI (Module 7)</h3>
                  </div>
                  {explainData && <span className="bg-amber-500/10 text-amber-500 text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold">LIME / SHAP</span>}
                </div>
                
                {!explainData ? (
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Run ML Analytics to see a breakdown of the key factors influencing the model's risk prediction.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-zinc-300">
                      The ML model determined you are <strong className={riskData?.risk_level === 'HIGH' ? 'text-rose-400' : 'text-emerald-400'}>{riskData?.risk_level} RISK</strong>. Here is why:
                    </p>
                    <div className="space-y-3">
                      {explainData.explanation && Object.entries(explainData.explanation).map(([feature, value]: [string, any], idx) => {
                        const isNegative = typeof value === 'string' && (value.includes('Low') || value.includes('Poor'));
                        const isLowNum = typeof value === 'number' && value < 60;
                        const isRiskFactor = riskData?.risk_level === 'HIGH' && (isNegative || isLowNum);
                        
                        return (
                          <div key={idx} className={`flex items-center justify-between p-2 rounded-lg border ${isRiskFactor ? 'bg-rose-500/10 border-rose-500/20' : 'bg-zinc-800/50 border-zinc-700/50'}`}>
                            <span className="text-sm text-zinc-300 capitalize">{feature.replace('_', ' ')}</span>
                            <span className={`text-sm font-bold ${isRiskFactor ? 'text-rose-400' : 'text-zinc-100'}`}>
                              {value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
