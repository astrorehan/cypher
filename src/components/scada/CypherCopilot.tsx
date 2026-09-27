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
import { useSound } from '../../utils/SoundProvider';

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
  const { playClick } = useSound();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!draft.trim()) return;
    playClick();
    onSendMessage(draft);
    setDraft('');
  };

  return (
    <div className="rounded-3xl surface-card flex flex-col h-[min(680px,75vh)] min-h-[480px] overflow-hidden text-hi">
      {/* Header */}
      <div className="p-4 px-6 border-b border-black/[.06] flex items-center justify-between bg-slate-50/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-core-500/10 text-core-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="section-title text-[17px] text-hi flex flex-wrap items-center gap-2">
              <span>Asisten NEXUS</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-core-500/10 text-core-700 font-semibold border border-core-500/20">
                UGM 2026 MODEL
              </span>
            </h3>
            <p className="text-[12px] text-mid">
              Tanyakan tentang TEG, filtrasi, atau pembacaan CEMS pada simulasi.
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scroll-paper bg-slate-50/40">
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
              className={`p-4 rounded-3xl max-w-2xl text-[14px] leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-gradient-to-r from-core-500 to-cyan-600 text-white rounded-tr-sm'
                    : 'bg-white text-hi border border-black/[.08] rounded-tl-sm'
                }`}
              >
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: m.content
                      .replace(/\n\n/g, '<br/><br/>')
                      .replace(/\n/g, '<br/>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em class="text-core-600">$1</em>')
                      .replace(/### (.*?)(<br\/>|$)/g, '<div class="font-display font-bold text-[14.5px] text-hi mb-1">$1</div>'),
                  }}
                />
                <div className={`text-[11px] mt-2.5 font-mono ${isUser ? 'text-cyan-100' : 'text-lo'}`}>
                  {m.timestamp}
                </div>
              </div>
              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-core-500/10 text-core-700 border border-core-500/20 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Suggested Starter Questions (Chips) */}
      <div className="px-5 py-2.5 bg-slate-50 border-t border-black/[.06] flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[12px] font-semibold text-mid shrink-0">
          Coba tanyakan:
        </span>
        {DEFAULT_COPILOT_PROMPTS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => {
              playClick();
              onSendMessage(q);
            }}
            className="liquid-control px-3 py-1.5 rounded-full hover:text-core-600 text-[12px] font-medium text-mid whitespace-nowrap cursor-pointer shrink-0"
          >
            {q.length > 55 ? `${q.substring(0, 55)}...` : q}
          </button>
        ))}
      </div>

      {/* Input Composer Form */}
      <form onSubmit={handleSubmit} className="p-3.5 bg-white border-t border-black/[.08] flex items-center gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Tanyakan analisis termal Seebeck, reduksi emisi Wilcoxon, atau kepatuhan CEMS..."
          className="flex-1 min-w-0 px-4 py-2.5 rounded-2xl surface-inset text-[14px] text-hi placeholder:text-lo focus:bg-white transition-all"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="primary-action h-11 px-5 rounded-2xl text-[13px] font-semibold flex items-center gap-1.5 cursor-pointer"
        >
          <span>Kirim</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
