"use client";
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Hello! I am EduInsight AI, your academic and career tutor. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedQs, setSuggestedQs] = useState<string[]>([
    "How do I create a study plan?",
    "Can you explain machine learning?",
    "What projects are good for a resume?"
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const newMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setLoading(true);
    setSuggestedQs([]);

    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages,
          context: {}
        })
      });

      if (!res.ok) throw new Error('API Error');
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'model', content: data.reply }]);
      if (data.suggested_questions) {
        setSuggestedQs(data.suggested_questions);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: 'Sorry, I am having trouble connecting to the server. Please check if the backend is running.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-[350px] sm:w-[400px] h-[500px] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#111622] p-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <Bot className="text-cyan-400" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm flex items-center gap-2">EduInsight AI <Sparkles size={12} className="text-amber-400" /></h3>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Always online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 ${
                    msg.role === 'user' 
                      ? 'bg-cyan-600 text-white rounded-tr-sm' 
                      : 'bg-[#111622] border border-white/5 text-zinc-300 rounded-tl-sm text-sm'
                  }`}>
                    {msg.role === 'model' && (
                       // Simple bold parsing for markdown bold
                       <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                    )}
                    {msg.role === 'user' && msg.content}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#111622] border border-white/5 text-zinc-400 rounded-2xl rounded-tl-sm p-4">
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                </div>
              )}
              
              {suggestedQs.length > 0 && !loading && (
                <div className="flex flex-col gap-2 mt-4 pt-2">
                  <span className="text-xs text-zinc-500">Suggested Questions</span>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQs.map((q, i) => (
                      <button 
                        key={i}
                        onClick={() => sendMessage(q)}
                        className="text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 px-3 py-1.5 rounded-full transition-colors text-left"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-[#111622] border-t border-white/5">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="relative"
              >
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full bg-[#0a0a0a] border border-zinc-800 text-white rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-cyan-500"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-2 top-2 p-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-lg transition-colors"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-transform hover:scale-105 active:scale-95"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}
