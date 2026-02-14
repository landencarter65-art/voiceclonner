'use client';

import FileDropZone from './FileDropZone';

interface CloneTabProps {
  cloneText: string;
  setCloneText: (v: string) => void;
  refText: string;
  setRefText: (v: string) => void;
  refFile: File | null;
  setRefFile: (f: File | null) => void;
  loading: boolean;
  onClone: () => void;
}

export default function CloneTab({
  cloneText, setCloneText,
  refText, setRefText,
  refFile, setRefFile,
  loading, onClone,
}: CloneTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em] display-text">
          Source Frequency
        </label>
        <FileDropZone file={refFile} onFileChange={setRefFile} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em] display-text">
            Source Script
          </label>
          <textarea
            className="neo-input w-full min-h-[80px] resize-none"
            placeholder="Exactly what is said in the audio file..."
            value={refText}
            onChange={(e) => setRefText(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em] display-text">
            Target Manuscript
          </label>
          <textarea
            className="neo-input w-full min-h-[120px] resize-none"
            placeholder="What should the cloned voice say?"
            value={cloneText}
            onChange={(e) => setCloneText(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={onClone}
        disabled={loading || !cloneText || !refFile}
        className="w-full btn-magical disabled:opacity-50 disabled:cursor-not-allowed group relative"
      >
        <span className={`inline-flex items-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
          Extract & Synthesize
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
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
        High-fidelity cloning requires clear source audio
      </p>
    </div>
  );
}
