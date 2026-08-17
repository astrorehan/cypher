import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Cpu,
  Bot,
  User,
  Zap,
  Wind,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { CopilotMessage, ScadaSystemState } from '../../engine/cypherTypes';
import { DEFAULT_COPILOT_PROMPTS } from '../../engine/cypherData';
import { CypherMark } from '../brand/CypherMark';

interface Props {
  state: ScadaSystemState;
  messages: CopilotMessage[];
  onSendMessage: (text: string) => void;
}

export const CypherCopilot: React.FC<Props> = ({
  state,
  messages,
  onSendMessage,
}) => {
  const [draft, setDraft] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!draft.trim()) return;
    onSendMessage(draft);
    setDraft('');
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col h-[560px] overflow-hidden">
      {/* Header */}
      <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-[15px] text-slate-900 flex items-center gap-2">
              <span>CYPHER AI Copilot &amp; Engineering Advisory</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold">
                UGM 2026 MODEL
              </span>
            </h3>
            <p className="text-[11.5px] text-slate-500">
              Asisten rekayasa cerdas untuk optimasi TEG Seebeck, filtrasi gas cerobong, dan kepatuhan CEMS.
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scroll-paper bg-slate-50/30">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 anim-rise ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <CypherMark className="w-4 h-4" />
                </div>
              )}
              <div
                className={`p-4 rounded-3xl max-w-2xl text-[13px] leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-cyan-600 text-white rounded-tr-sm'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-sm'
                }`}
              >
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: m.content
                      .replace(/\n\n/g, '<br/><br/>')
                      .replace(/\n/g, '<br/>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/### (.*?)(<br\/>|$)/g, '<div class="font-bold text-[14px] mb-1">$1</div>'),
                  }}
                />
                <div className={`text-[10px] mt-2 font-mono ${isUser ? 'text-cyan-100' : 'text-slate-400'}`}>
                  {m.timestamp}
                </div>
              </div>
              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Suggested Starter Questions (Chips) */}
      <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-mono font-bold text-slate-600 uppercase shrink-0">
          Pertanyaan Kunci:
        </span>
        {DEFAULT_COPILOT_PROMPTS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(q)}
            className="px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-cyan-500 hover:text-cyan-700 text-[11.5px] font-medium text-slate-700 whitespace-nowrap transition-all cursor-pointer shadow-2xs shrink-0"
          >
            {q.length > 55 ? `${q.substring(0, 55)}...` : q}
          </button>
        ))}
      </div>

      {/* Input Composer Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Tanyakan analisis termal Seebeck, reduksi emisi Wilcoxon, atau kepatuhan CEMS..."
          className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="h-10 px-5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white text-[13px] font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
        >
          <span>Kirim</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
