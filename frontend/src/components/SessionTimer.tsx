'use client';

import { useQueue } from '@/hooks/useQueue';

export default function SessionTimer() {
  const { isActive, timeLeft } = useQueue();

  if (!isActive) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = (timeLeft / (15 * 60)) * 100;

  return (
    <div className="fixed top-4 right-4 z-[90]">
      <div className="glass-card px-4 py-2 flex items-center gap-4 border-violet-500/30">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Session Time</span>
          <span className="text-sm font-mono font-bold text-violet-400">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
