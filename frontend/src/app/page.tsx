'use client';

import { useState } from 'react';
import { useVoiceGeneration } from '@/hooks/useVoiceGeneration';
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';
import GenerateTab from '@/components/GenerateTab';
import CloneTab from '@/components/CloneTab';
import AudioOutput from '@/components/AudioOutput';
import Footer from '@/components/Footer';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'generate' | 'clone'>('generate');
  const voice = useVoiceGeneration();

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#06061a] via-[#0a0a2e] to-[#12062e] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Header />

        <div className="glass-card overflow-hidden">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="p-6 sm:p-8 space-y-6">
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
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {voice.error}
              </div>
            )}

            {voice.status && !voice.error && (
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
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
