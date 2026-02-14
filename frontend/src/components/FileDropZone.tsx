'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface FileDropZoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export default function FileDropZone({ file, onFileChange }: FileDropZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith('audio/')) {
      onFileChange(dropped);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFileChange(e.target.files?.[0] || null);
  };

  return (
    <div
      className={`drop-zone rounded-xl p-6 text-center cursor-pointer ${dragOver ? 'drag-over' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        onChange={handleInputChange}
        className="hidden"
      />
      {file ? (
        <div className="flex items-center justify-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-400">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          <span className="text-sm text-slate-300">{file.name}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onFileChange(null); }}
            className="ml-2 text-slate-500 hover:text-red-400 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-slate-500">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="text-sm text-slate-500">
            Drop an audio file here or <span className="text-violet-400">browse</span>
          </p>
          <p className="text-xs text-slate-600">WAV, MP3, FLAC, OGG</p>
        </div>
      )}
    </div>
  );
}
