'use client';

import { speakers } from '@/hooks/useVoiceGeneration';

interface GenerateTabProps {
  text: string;
  setText: (v: string) => void;
  speaker: string;
  setSpeaker: (v: string) => void;
  instruct: string;
  setInstruct: (v: string) => void;
  loading: boolean;
  onGenerate: () => void;
}

export default function GenerateTab({
  text, setText,
  speaker, setSpeaker,
  instruct, setInstruct,
  loading, onGenerate,
}: GenerateTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em] display-text">
          Text Blueprint
        </label>
        <textarea
          className="neo-input w-full min-h-[120px] resize-none text-base leading-relaxed"
          placeholder="Type what you want the AI to speak..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em] display-text">
            Identity
          </label>
          <div className="relative">
            <select
              className="neo-input w-full appearance-none pr-10 cursor-pointer"
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
            >
              {speakers.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-violet-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em] display-text">
            Aesthetic Tone
          </label>
          <input
            type="text"
            className="neo-input w-full"
            placeholder="e.g. A warm, gentle tone."
            value={instruct}
            onChange={(e) => setInstruct(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={loading || !text}
        className="w-full btn-magical disabled:opacity-50 disabled:cursor-not-allowed group relative"
      >
        <span className={`inline-flex items-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
          Generate Neural Voice
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </span>
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div 
                  key={i}
                  className="w-2 h-2 rounded-full bg-white animate-bounce" 
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </button>

      <p className="text-[10px] text-gray-600 text-center uppercase tracking-[0.15em] display-text">
        Processing typically takes 3-10 seconds
      </p>
    </div>
  );
}
