"use client";
import React, { useState } from 'react';
import { User, BookOpen, Clock, Activity, Save, ShieldCheck } from 'lucide-react';

export default function AcademicDataHub() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(() => {
    const defaultProfile = {
      university: 'Tech University',
      semester: 'Spring 2026',
      batch: 'Batch 22 (Junior)'
    };

    if (typeof window === 'undefined') return defaultProfile;

    const storedProfile = localStorage.getItem('academic_profile');
    if (!storedProfile) return defaultProfile;

    try {
      return { ...defaultProfile, ...JSON.parse(storedProfile) };
    } catch {
      localStorage.removeItem('academic_profile');
      return defaultProfile;
    }
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      localStorage.setItem('academic_profile', JSON.stringify(profileData));
      alert('Data updated successfully! ML Models will now use this data.');
    } catch (error) {
      console.error(error);
      alert('Unable to save your profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Academic Data Hub</h1>
        <p className="text-zinc-400">Manage your profile, coursework, and study behavior for the ML pipeline.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Left Column - Navigation Tabs */}
        <div className="space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all border ${activeTab === 'profile' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-transparent text-zinc-400 border-transparent hover:bg-zinc-900'}`}
          >
            <User size={18} /> Student Profile
          </button>
          <button 
            onClick={() => setActiveTab('academic')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all border ${activeTab === 'academic' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-transparent text-zinc-400 border-transparent hover:bg-zinc-900'}`}
          >
            <BookOpen size={18} /> Academic Overview
          </button>
          <button 
            onClick={() => setActiveTab('courses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all border ${activeTab === 'courses' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-transparent text-zinc-400 border-transparent hover:bg-zinc-900'}`}
          >
            <Activity size={18} /> Course Results
          </button>
          <button 
            onClick={() => setActiveTab('behavior')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all border ${activeTab === 'behavior' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-transparent text-zinc-400 border-transparent hover:bg-zinc-900'}`}
          >
            <Clock size={18} /> Study Behavior
          </button>
        </div>

        {/* Right Column - Forms */}
        <div className="md:col-span-3">
          <div className="bg-[#111622] border border-zinc-800 rounded-2xl p-8 min-h-[500px] flex flex-col justify-between">
            
            {activeTab === 'profile' && (
              <div className="animate-in fade-in space-y-6">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-zinc-800 pb-4">Basic Profile</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="block text-sm text-zinc-400 mb-2">University</label><input type="text" value={profileData.university} onChange={e => setProfileData({...profileData, university: e.target.value})} className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2.5 px-4 text-white" /></div>
                  <div><label className="block text-sm text-zinc-400 mb-2">Semester</label><input type="text" value={profileData.semester} onChange={e => setProfileData({...profileData, semester: e.target.value})} className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2.5 px-4 text-white" /></div>
                  <div><label className="block text-sm text-zinc-400 mb-2">Batch / Year</label><input type="text" value={profileData.batch} onChange={e => setProfileData({...profileData, batch: e.target.value})} className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2.5 px-4 text-white" /></div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Profile Photo Status</label>
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl"><ShieldCheck size={18} /> Uploaded & Verified</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'academic' && (
              <div className="animate-in fade-in space-y-6">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-zinc-800 pb-4">Academic Overview</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="block text-sm text-zinc-400 mb-2">Current CGPA</label><input type="number" step="0.1" defaultValue="3.2" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2.5 px-4 text-white" /></div>
                  <div><label className="block text-sm text-zinc-400 mb-2">Previous GPA</label><input type="number" step="0.1" defaultValue="3.0" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2.5 px-4 text-white" /></div>
                  <div><label className="block text-sm text-zinc-400 mb-2">Total Credits</label><input type="number" defaultValue="120" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2.5 px-4 text-white" /></div>
                  <div><label className="block text-sm text-zinc-400 mb-2">Completed Credits</label><input type="number" defaultValue="85" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2.5 px-4 text-white" /></div>
                  <div><label className="block text-sm text-zinc-400 mb-2">Failed Courses</label><input type="number" defaultValue="0" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2.5 px-4 text-white" /></div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="animate-in fade-in space-y-6">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-zinc-800 pb-4">Course Results & Attendance</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className="block text-sm text-zinc-400 mb-2">Midterm Avg (%)</label><input type="number" defaultValue="75" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2.5 px-4 text-white" /></div>
                  <div><label className="block text-sm text-zinc-400 mb-2">Quiz Avg (%)</label><input type="number" defaultValue="80" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2.5 px-4 text-white" /></div>
                  <div><label className="block text-sm text-zinc-400 mb-2">Assignment Avg (%)</label><input type="number" defaultValue="85" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2.5 px-4 text-white" /></div>
                  <div><label className="block text-sm text-zinc-400 mb-2">Total Classes</label><input type="number" defaultValue="40" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2.5 px-4 text-white" /></div>
                  <div><label className="block text-sm text-zinc-400 mb-2">Classes Attended</label><input type="number" defaultValue="34" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2.5 px-4 text-white" /></div>
                  <div><label className="block text-sm text-zinc-400 mb-2">Attendance %</label><input type="number" defaultValue="85" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2.5 px-4 text-emerald-400 font-bold bg-emerald-500/5" disabled /></div>
                </div>
              </div>
            )}

            {activeTab === 'behavior' && (
              <div className="animate-in fade-in space-y-6">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-zinc-800 pb-4">Study Behavior</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="block text-sm text-zinc-400 mb-2">Study Hours / Day</label><input type="number" step="0.5" defaultValue="3.5" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2.5 px-4 text-white" /></div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Study Frequency</label>
                    <select className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2.5 px-4 text-white"><option>High</option><option selected>Medium</option><option>Low</option></select>
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Assignment Completion</label>
                    <select className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2.5 px-4 text-white"><option selected>High</option><option>Medium</option><option>Low</option></select>
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Class Participation</label>
                    <select className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2.5 px-4 text-white"><option>High</option><option selected>Medium</option><option>Low</option></select>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-zinc-800 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={loading}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Saving Data...' : 'Save Academic Data'} <Save size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
