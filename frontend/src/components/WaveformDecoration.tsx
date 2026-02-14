export default function WaveformDecoration({ barCount = 5 }: { barCount?: number }) {
  return (
    <div className="flex items-end gap-[3px] h-6">
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-violet-400/60 waveform-bar"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}
