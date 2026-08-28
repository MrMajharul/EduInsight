"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Book, 
  Clock, 
  CheckCircle2, 
  Plus, 
  GraduationCap, 
  Library,
  Image as ImageIcon,
  BookOpen,
  ArrowLeft
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('user_id');
    if (!id) router.push('/register');
    setUserId(id);
    
    const storedName = localStorage.getItem('user_name');
    if (storedName) {
      setProfileData(prev => ({ ...prev, full_name: storedName }));
    }

    // In a real app, we'd fetch existing profile data here
    const storedCourses = localStorage.getItem('user_courses');
    if (storedCourses) {
      try {
        setCourses(JSON.parse(storedCourses));
      } catch (e) {
        // ignore
      }
    }
  }, [router]);

  const [profileData, setProfileData] = useState({
    full_name: 'Success Explorer',
    major: 'Computer Science',
    academic_year: '1'
  });

  const [academicData, setAcademicData] = useState({
    previous_gpa: '3.0',
    current_gpa: '3.0',
    attendance_pct: '85',
    study_hours: '3',
    failed_courses: '0'
  });

  const [courses, setCourses] = useState([
    { name: '', materials: '' }
  ]);

  const handleSubmit = async () => {
    try {
      await fetch('http://localhost:8000/api/students/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: parseInt(userId || '0'),
          full_name: profileData.full_name,
          major: profileData.major,
          academic_year: parseInt(profileData.academic_year)
        })
      });

      localStorage.setItem('user_courses', JSON.stringify(courses));
      localStorage.setItem('user_name', profileData.full_name);
      
      window.dispatchEvent(new Event('profile_updated'));

      alert("Profile updated successfully!");
    } catch (e) {
      console.error(e);
      alert("Profile saved locally!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 p-6 sm:p-8 flex justify-center relative">
      {/* Back Button */}
      <button 
        onClick={() => router.push('/dashboard')}
        className="absolute top-6 left-6 flex items-center gap-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 px-4 py-2 rounded-xl border border-zinc-800 transition-colors z-10"
      >
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">Dashboard</span>
      </button>

      <div className="w-full max-w-4xl space-y-6 pt-12 md:pt-0">
        
        {/* Header Section: Basic Profile */}
        <div className="bg-[#111622] border border-zinc-800 rounded-2xl p-6 relative">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 rounded-full border-4 border-zinc-800 overflow-hidden bg-zinc-900 flex items-center justify-center relative group">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.full_name}`} alt="Profile" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <ImageIcon size={24} className="text-white" />
                </div>
              </div>
              <div className="absolute bottom-1 right-1 bg-emerald-500 p-1.5 rounded-full border-2 border-[#111622]">
                <CheckCircle2 size={12} className="text-white" />
              </div>
            </div>

            {/* Profile Info Form */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col mb-2">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider mb-1">Upload Profile Picture</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-zinc-950/50 border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-500 flex items-center">
                    <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[10px] mr-2">Choose File</span> No file chosen
                  </div>
                </div>
              </div>

              <div>
                <input 
                  type="text" 
                  value={profileData.full_name} 
                  onChange={e => setProfileData({...profileData, full_name: e.target.value})} 
                  className="text-2xl font-bold text-white bg-transparent border-b border-zinc-800 pb-1 mb-3 focus:outline-none focus:border-emerald-500 w-full" 
                  placeholder="Full Name" 
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-3">
                  <div className="flex items-center gap-2 border-b border-zinc-800 pb-1">
                    <Library size={16} className="text-emerald-400" />
                    <input type="text" value={profileData.major} onChange={e => setProfileData({...profileData, major: e.target.value})} className="bg-transparent border-none text-sm text-zinc-300 focus:outline-none w-full" placeholder="Department / Major" />
                  </div>
                  <div className="flex items-center gap-2 border-b border-zinc-800 pb-1">
                    <GraduationCap size={16} className="text-emerald-400" />
                    <span className="text-xs text-zinc-500 mr-2 whitespace-nowrap">Academic Year:</span>
                    <select 
                      value={profileData.academic_year} 
                      onChange={e => setProfileData({...profileData, academic_year: e.target.value})} 
                      className="bg-transparent border-none text-sm text-zinc-300 focus:outline-none w-full cursor-pointer"
                    >
                      <option value="1" className="bg-[#111622]">Year 1 (Freshman)</option>
                      <option value="2" className="bg-[#111622]">Year 2 (Sophomore)</option>
                      <option value="3" className="bg-[#111622]">Year 3 (Junior)</option>
                      <option value="4" className="bg-[#111622]">Year 4 (Senior)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Overview Section */}
        <div className="bg-[#111622] border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Book className="text-blue-400" />
            <h2 className="text-base font-bold text-white">Academic Overview</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-zinc-950/50 border border-zinc-800 p-4 rounded-xl flex flex-col">
              <label className="text-xs text-zinc-500 font-medium mb-2">Previous GPA</label>
              <input type="number" step="0.1" value={academicData.previous_gpa} onChange={e => setAcademicData({...academicData, previous_gpa: e.target.value})} className="bg-transparent text-xl font-bold text-white border-b border-zinc-800 focus:outline-none focus:border-blue-500 pb-1" />
            </div>
            <div className="bg-zinc-950/50 border border-zinc-800 p-4 rounded-xl flex flex-col">
              <label className="text-xs text-zinc-500 font-medium mb-2">Current GPA</label>
              <input type="number" step="0.1" value={academicData.current_gpa} onChange={e => setAcademicData({...academicData, current_gpa: e.target.value})} className="bg-transparent text-xl font-bold text-white border-b border-zinc-800 focus:outline-none focus:border-blue-500 pb-1" />
            </div>
            <div className="bg-zinc-950/50 border border-zinc-800 p-4 rounded-xl flex flex-col">
              <label className="text-xs text-zinc-500 font-medium mb-2">Failed Courses</label>
              <input type="number" value={academicData.failed_courses} onChange={e => setAcademicData({...academicData, failed_courses: e.target.value})} className="bg-transparent text-xl font-bold text-white border-b border-zinc-800 focus:outline-none focus:border-red-500 pb-1" />
            </div>
          </div>
        </div>

        {/* Study Behavior Section */}
        <div className="bg-[#111622] border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="text-purple-400" />
            <h2 className="text-base font-bold text-white">Study Behavior</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-zinc-950/50 border border-zinc-800 p-4 rounded-xl flex flex-col">
              <label className="text-xs text-zinc-500 font-medium mb-2">Attendance %</label>
              <div className="flex items-center gap-2">
                <input type="number" value={academicData.attendance_pct} onChange={e => setAcademicData({...academicData, attendance_pct: e.target.value})} className="bg-transparent text-xl font-bold text-white border-b border-zinc-800 focus:outline-none focus:border-purple-500 pb-1 w-full" />
                <span className="text-zinc-500 font-bold">%</span>
              </div>
            </div>
            <div className="bg-zinc-950/50 border border-zinc-800 p-4 rounded-xl flex flex-col">
              <label className="text-xs text-zinc-500 font-medium mb-2">Study Hours / Day</label>
              <div className="flex items-center gap-2">
                <input type="number" value={academicData.study_hours} onChange={e => setAcademicData({...academicData, study_hours: e.target.value})} className="bg-transparent text-xl font-bold text-white border-b border-zinc-800 focus:outline-none focus:border-purple-500 pb-1 w-full" />
                <span className="text-zinc-500 font-bold">hrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Courses & Materials Section */}
        <div className="bg-[#111622] border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="text-cyan-400" />
              <h2 className="text-base font-bold text-white">Current Courses & Materials</h2>
            </div>
            <button 
              onClick={() => setCourses([...courses, { name: '', materials: '' }])}
              className="text-cyan-400 hover:bg-cyan-500/10 p-1 rounded transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <div className="space-y-4">
            {courses.length === 0 && (
              <p className="text-xs text-zinc-500 italic text-center py-4">No courses added yet. Add your current courses to track them.</p>
            )}
            {courses.map((course, idx) => (
              <div key={idx} className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 relative group">
                <button onClick={() => setCourses(courses.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  ✕
                </button>
                <div className="space-y-3">
                  <div>
                    <label className="block text-zinc-500 text-xs mb-1">Course Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Data Structures"
                      value={course.name}
                      onChange={e => {
                        const newCourses = [...courses];
                        newCourses[idx].name = e.target.value;
                        setCourses(newCourses);
                      }}
                      className="w-full bg-transparent border-b border-zinc-800 pb-1 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-500 text-xs mb-1">Study Materials (Links/Books)</label>
                    <input 
                      type="text" 
                      placeholder="e.g., https://course.link, textbook name"
                      value={course.materials}
                      onChange={e => {
                        const newCourses = [...courses];
                        newCourses[idx].materials = e.target.value;
                        setCourses(newCourses);
                      }}
                      className="w-full bg-transparent border-b border-zinc-800 pb-1 text-sm text-zinc-300 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSubmit} 
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-8 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Save Profile <CheckCircle2 size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
