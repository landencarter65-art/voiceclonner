'use client';

type Tab = 'generate' | 'clone';

interface TabNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex border-b border-white/10">
      <button
        onClick={() => onTabChange('generate')}
        className={`flex-1 py-3.5 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
          activeTab === 'generate'
            ? 'text-violet-400 border-b-2 border-violet-500 bg-violet-500/5'
            : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
        Generate
      </button>
      <button
        onClick={() => onTabChange('clone')}
        className={`flex-1 py-3.5 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
          activeTab === 'clone'
            ? 'text-violet-400 border-b-2 border-violet-500 bg-violet-500/5'
            : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
        Clone
      </button>
    </div>
  );
}
