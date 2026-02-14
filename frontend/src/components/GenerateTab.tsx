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
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
          Text to speak
        </label>
        <textarea
          className="dark-input w-full px-4 py-3 rounded-xl text-sm"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
            Speaker
          </label>
          <select
            className="dark-select w-full px-4 py-3 rounded-xl text-sm"
            value={speaker}
            onChange={(e) => setSpeaker(e.target.value)}
          >
            {speakers.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
            Style instruction
          </label>
          <input
            type="text"
            className="dark-input w-full px-4 py-3 rounded-xl text-sm"
            value={instruct}
            onChange={(e) => setInstruct(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={loading || !text}
        className={`w-full py-3.5 rounded-xl text-sm ${loading ? 'shimmer-loading' : 'btn-accent'}`}
      >
        {loading ? 'Generating...' : 'Generate Voice'}
      </button>

      <p className="text-xs text-slate-500 text-center">
        First request may take longer while the AI model loads
      </p>
    </div>
  );
}
