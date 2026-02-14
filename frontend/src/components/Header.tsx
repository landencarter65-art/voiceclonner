import WaveformDecoration from './WaveformDecoration';

export default function Header() {
  return (
    <div className="text-center py-10 px-6">
      <div className="flex items-center justify-center gap-3 mb-3">
        <WaveformDecoration barCount={4} />
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-purple-300 to-fuchsia-400 bg-clip-text text-transparent">
          Voice Studio
        </h1>
        <WaveformDecoration barCount={4} />
      </div>
      <p className="text-sm text-slate-400">
        AI-powered voice generation & cloning
      </p>
    </div>
  );
}
