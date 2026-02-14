'use client';

import { useState } from 'react';
import { useVoiceGeneration } from '@/hooks/useVoiceGeneration';
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';
import GenerateTab from '@/components/GenerateTab';
import CloneTab from '@/components/CloneTab';
import AudioOutput from '@/components/AudioOutput';
import Footer from '@/components/Footer';
import QueueOverlay from '@/components/QueueOverlay';
import SessionTimer from '@/components/SessionTimer';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'generate' | 'clone'>('generate');
  const voice = useVoiceGeneration();

  return (
    <main className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 selection:bg-violet-500/30">
      <div className="bg-mesh" />
      <div className="bg-grid" />
      
      <QueueOverlay />
      <SessionTimer />

      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        <Header />

        <div className="glass-card overflow-hidden border-white/10 shadow-2xl shadow-black">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="p-8 sm:p-10 space-y-8">
            {activeTab === 'generate' && (
              <GenerateTab
                text={voice.text}
                setText={voice.setText}
                speaker={voice.speaker}
                setSpeaker={voice.setSpeaker}
                instruct={voice.instruct}
                setInstruct={voice.setInstruct}
                loading={voice.loading}
                onGenerate={voice.handleGenerate}
              />
            )}

            {activeTab === 'clone' && (
              <CloneTab
                cloneText={voice.cloneText}
                setCloneText={voice.setCloneText}
                refText={voice.refText}
                setRefText={voice.setRefText}
                refFile={voice.refFile}
                setRefFile={voice.setRefFile}
                loading={voice.loading}
                onClone={voice.handleClone}
              />
            )}

            {voice.error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-in slide-in-from-top-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {voice.error}
              </div>
            )}

            {voice.status && !voice.error && (
              <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm flex items-center gap-3 animate-in slide-in-from-top-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                {voice.status}
              </div>
            )}

            {voice.audioSrc && <AudioOutput audioSrc={voice.audioSrc} />}
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
