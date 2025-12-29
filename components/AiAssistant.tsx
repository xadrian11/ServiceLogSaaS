
import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, MessageSquare } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMsg = prompt;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setPrompt('');
    setLoading(true);

    try {
      /* Fix: Strictly use process.env.API_KEY directly for initialization */
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      /* Fix: Use gemini-3-pro-preview for advanced technical reasoning and troubleshooting */
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: userMsg,
        config: {
          systemInstruction: "Jesteś ekspertem serwisu technicznego. Pomagasz serwisantom diagnozować usterki kotłów, klimatyzacji i sprzętu AGD. Odpowiadaj konkretnie, punktowo i technicznie w języku polskim."
        }
      });
      
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "Przepraszam, nie mogłem przetworzyć tego zapytania." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Błąd połączenia z mózgiem AI. Sprawdź konfigurację klucza." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform group"
        >
          <Sparkles className="group-hover:animate-pulse" />
        </button>
      ) : (
        <div className="w-80 sm:w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
          <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-bold">Asystent Serwisowy AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.length === 0 && (
              <div className="text-center py-10">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 text-indigo-600 shadow-sm">
                  <MessageSquare size={24} />
                </div>
                <p className="text-sm text-slate-500 font-medium">Zadaj pytanie techniczne, np.<br/>"Kocioł Viessmann błąd F2"</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 animate-pulse">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleAskAi} className="p-3 border-t border-slate-100 bg-white">
            <div className="relative">
              <input 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Wpisz usterkę..."
                className="w-full pl-4 pr-10 py-3 bg-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 hover:scale-110 transition-transform">
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AiAssistant;
