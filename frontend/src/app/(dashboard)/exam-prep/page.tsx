"use client";
import React, { useState } from 'react';
import { GraduationCap, BookOpen, Brain, Download, AlertCircle, FileQuestion, Target, CheckCircle2 } from 'lucide-react';

export default function ExamPrepPage() {
  const [loading, setLoading] = useState(false);
  const [prepData, setPrepData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  
  const [formData, setFormData] = useState({
    topic: 'Database Management Systems',
    exam_format: 'All',
    number_of_questions: 5,
    difficulty: 'Intermediate'
  });

  const generatePrep = async () => {
    setLoading(true);
    setError(null);
    setPrepData(null);
    setShowAnswers(false);
    
    try {
      const res = await fetch('http://localhost:8001/api/exam-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to generate exam prep");
      }

      setPrepData(data);
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
          <div className="h-10 w-10 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
            <GraduationCap className="text-blue-400" size={20} />
          </div>
          <h1 className="text-3xl font-bold text-white">AI Exam Prep</h1>
        </div>
        <p className="text-zinc-400">Instantly generate summaries, mock exams, and checklists for any topic.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#111622] border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Target className="text-blue-400" size={18} /> Prep Parameters
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Target Topic / Chapter</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-2.5 text-zinc-500" size={16} />
                  <input 
                    type="text" 
                    value={formData.topic}
                    onChange={e => setFormData({...formData, topic: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2 pl-10 pr-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">Material Format</label>
                <select 
                  value={formData.exam_format} 
                  onChange={e => setFormData({...formData, exam_format: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option>All</option>
                  <option>Summary</option>
                  <option>MCQs</option>
                  <option>Questions</option>
                  <option>Checklist</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Num Questions</label>
                  <input 
                    type="number"
                    min="1" max="20" 
                    value={formData.number_of_questions}
                    onChange={e => setFormData({...formData, number_of_questions: parseInt(e.target.value)})}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Difficulty</label>
                  <select 
                    value={formData.difficulty} 
                    onChange={e => setFormData({...formData, difficulty: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={generatePrep}
              disabled={loading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_4px_14px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Material'} <Brain size={18} />
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
            {!prepData && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                <GraduationCap size={48} className="mb-4 opacity-50" />
                <p>Input your target topic on the left to generate exam materials.</p>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-blue-400">
                <Brain size={48} className="mb-4 animate-pulse" />
                <p className="animate-pulse font-medium">Gemini AI is reviewing literature and building mock exams...</p>
              </div>
            )}

            {prepData && (
              <div className="animate-in fade-in space-y-8">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">Exam Guide: {prepData.topic}</h3>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowAnswers(!showAnswers)}
                      className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${showAnswers ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-zinc-800 text-zinc-400 border border-transparent hover:text-white'}`}
                    >
                      {showAnswers ? 'Hide Answers' : 'Reveal Answers'}
                    </button>
                    <button className="flex items-center gap-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                      <Download size={14} /> Export PDF
                    </button>
                  </div>
                </div>

                {prepData.summary && (
                  <div>
                    <h4 className="font-bold text-zinc-300 text-sm uppercase tracking-wider mb-3">Topic Summary</h4>
                    <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl p-5 text-sm text-zinc-400 whitespace-pre-wrap leading-relaxed">
                      {prepData.summary}
                    </div>
                  </div>
                )}

                {prepData.quizzes?.length > 0 && (
                  <div>
                    <h4 className="font-bold text-zinc-300 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FileQuestion size={16} /> Multiple Choice (MCQs)
                    </h4>
                    <div className="space-y-4">
                      {prepData.quizzes.map((q: any, idx: number) => (
                        <div key={idx} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
                          <p className="font-bold text-zinc-200 mb-4">{idx + 1}. {q.question}</p>
                          <div className="space-y-2">
                            {q.options.map((opt: string, oIdx: number) => {
                              const isCorrect = oIdx === q.correct_answer_index;
                              let styles = "bg-[#0a0a0a] border-zinc-800 text-zinc-400";
                              if (showAnswers && isCorrect) styles = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-medium";
                              return (
                                <div key={oIdx} className={`p-3 rounded-lg border text-sm transition-all ${styles}`}>
                                  {['A', 'B', 'C', 'D'][oIdx]}. {opt}
                                </div>
                              );
                            })}
                          </div>
                          {showAnswers && (
                            <div className="mt-4 pt-3 border-t border-zinc-800/50 text-xs text-zinc-500">
                              <span className="text-emerald-500 font-bold mr-1">Explanation:</span> {q.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {prepData.important_questions?.length > 0 && (
                  <div>
                    <h4 className="font-bold text-zinc-300 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Target size={16} /> Subjective Questions
                    </h4>
                    <div className="space-y-4">
                      {prepData.important_questions.map((q: any, idx: number) => (
                        <div key={idx} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
                          <p className="font-medium text-blue-400 mb-2">Q: {q.question}</p>
                          {showAnswers ? (
                            <div className="bg-[#0a0a0a] border border-zinc-800/50 rounded-lg p-4 text-sm text-zinc-300 leading-relaxed mt-3">
                              <span className="text-blue-500/70 font-bold text-xs uppercase block mb-1">Model Answer</span>
                              {q.sample_answer}
                            </div>
                          ) : (
                            <div className="h-20 bg-[#0a0a0a] border border-zinc-800/50 border-dashed rounded-lg flex items-center justify-center text-zinc-600 text-xs italic mt-3">
                              Click 'Reveal Answers' in the top right to see the model answer
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {prepData.checklist?.length > 0 && (
                  <div>
                    <h4 className="font-bold text-zinc-300 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                      <CheckCircle2 size={16} /> Final Checklist
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {prepData.checklist.map((item: string, idx: number) => (
                        <div key={idx} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 flex items-center gap-3">
                          <input type="checkbox" className="accent-blue-500" />
                          <span className="text-sm text-zinc-300">{item}</span>
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
