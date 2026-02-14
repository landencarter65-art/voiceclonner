'use client';

import { useQueue } from '@/hooks/useQueue';

export default function QueueOverlay() {
  const { isActive, position, timeLeft, isConnecting, queue } = useQueue();

  if (isConnecting) return null;
  if (isActive) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-card max-w-md w-full p-8 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-violet-500 animate-spin-slow" />
          <div className="absolute inset-2 rounded-full border border-violet-500/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold display-text text-violet-400">#{position + 1}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold display-text text-white">In Queue</h2>
          <p className="text-gray-400 text-sm">
            Our voices are currently busy. You are at position <span className="text-white font-medium">{position + 1}</span> of <span className="text-white font-medium">{queue.length}</span>.
          </p>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Estimated Wait</div>
          <div className="text-2xl font-mono text-violet-400">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-gray-500 italic">
            You will be automatically connected when it's your turn. Please don't close this window.
          </p>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-violet-500/50 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
