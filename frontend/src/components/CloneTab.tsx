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
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
          Voice sample
        </label>
        <FileDropZone file={refFile} onFileChange={setRefFile} />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
          Sample transcript
        </label>
        <textarea
          className="dark-input w-full px-4 py-3 rounded-xl text-sm"
          rows={2}
          placeholder="Exactly what is said in the audio file..."
          value={refText}
          onChange={(e) => setRefText(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
          Target text
        </label>
        <textarea
          className="dark-input w-full px-4 py-3 rounded-xl text-sm"
          rows={3}
          placeholder="What should the cloned voice say?"
          value={cloneText}
          onChange={(e) => setCloneText(e.target.value)}
        />
      </div>

      <button
        onClick={onClone}
        disabled={loading || !cloneText || !refFile}
        className={`w-full py-3.5 rounded-xl text-sm ${loading ? 'shimmer-loading' : 'btn-accent'}`}
      >
        {loading ? 'Cloning Voice...' : 'Clone & Generate'}
      </button>

      <p className="text-xs text-slate-500 text-center">
        First request may take longer while the AI model loads
      </p>
    </div>
  );
}
