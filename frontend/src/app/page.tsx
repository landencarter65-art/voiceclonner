'use client';

import { useState } from 'react';
import { Client, handle_file } from "@gradio/client";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'generate' | 'clone'>('generate');
  
  // Generation State
  const [text, setText] = useState('Hello, how are you today?');
  const [speaker, setSpeaker] = useState('Vivian');
  const [instruct, setInstruct] = useState('A warm, gentle tone.');
  
  // Cloning State
  const [cloneText, setCloneText] = useState('');
  const [refText, setRefText] = useState('');
  const [refFile, setRefFile] = useState<File | null>(null);

  // Common State
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const speakers = ['Vivian', 'George', 'Alice', 'Bob', 'Charlie']; 

  // Direct connection to Hugging Face Space
  const spaceUrl = process.env.NEXT_PUBLIC_HF_SPACE_URL || "https://ytpybe-qwens.hf.space/";

  const handleGenerate = async () => {
    if (!text) return;
    setLoading(true);
    setError(null);
    setAudioSrc(null);

    try {
      const client = await Client.connect(spaceUrl);
      const result = await client.predict("/tts_fn", { 		
        text, 
        speaker, 
        language: "English", 
        instruct, 
      }) as any;

      if (result.data && result.data[0]) {
        setAudioSrc(result.data[0].url);
      } else {
        throw new Error("No audio generated");
      }
    } catch (err: any) {
      setError(err.message || 'Error generating voice');
    } finally {
      setLoading(false);
    }
  };

  const handleClone = async () => {
    if (!cloneText || !refText || !refFile) {
        setError("Please provide all cloning inputs.");
        return;
    }
    setLoading(true);
    setError(null);
    setAudioSrc(null);

    try {
        const client = await Client.connect(spaceUrl);
        
        // Handle file upload correctly for Gradio JS client
        const audio_blob = await handle_file(refFile);

        const result = await client.predict("/clone_fn", { 		
            text: cloneText, 
            reference_audio_path: audio_blob, 
            reference_text: refText, 
            language: "English", 
        }) as any;

        if (result.data && result.data[0]) {
            setAudioSrc(result.data[0].url);
        } else {
            throw new Error("Cloning failed to return audio");
        }
    } catch (err: any) {
        setError(err.message || 'Error cloning voice');
    } finally {
        setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        <div className="bg-indigo-600 p-8 text-center text-white">
          <h1 className="text-3xl font-extrabold mb-2 text-white">Qwen Voice Studio</h1>
          <p className="opacity-90">Direct Hugging Face Integration (No Backend Required)</p>
        </div>

        <div className="flex border-b border-gray-200">
          <button onClick={() => setActiveTab('generate')} className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'generate' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700'}`}>
            Voice Generation
          </button>
          <button onClick={() => setActiveTab('clone')} className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'clone' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700'}`}>
            Voice Cloning
          </button>
        </div>

        <div className="p-8 space-y-6">
          {activeTab === 'generate' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
                <textarea className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-gray-900" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Speaker</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-gray-900" value={speaker} onChange={(e) => setSpeaker(e.target.value)}>
                        {speakers.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instruction</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-gray-900" value={instruct} onChange={(e) => setInstruct(e.target.value)} />
                 </div>
              </div>
              <button onClick={handleGenerate} disabled={loading || !text} className="w-full py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 shadow-lg transition-all">
                {loading ? 'Generating...' : 'Generate Voice'}
              </button>
            </div>
          )}

          {activeTab === 'clone' && (
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Voice Sample (Audio File)</label>
                    <input type="file" accept="audio/*" onChange={(e) => setRefFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sample Transcript</label>
                    <textarea className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-gray-900" rows={2} placeholder="Exactly what is said in the audio file..." value={refText} onChange={(e) => setRefText(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Text</label>
                    <textarea className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-gray-900" rows={3} placeholder="What should the cloned voice say?" value={cloneText} onChange={(e) => setCloneText(e.target.value)} />
                </div>
                <button onClick={handleClone} disabled={loading || !cloneText || !refFile} className="w-full py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 shadow-lg transition-all">
                    {loading ? 'Cloning Voice...' : 'Clone & Generate'}
                </button>
            </div>
          )}

          {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

          {audioSrc && (
            <div className="mt-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-900 mb-4 text-center">Output</h3>
              <audio controls className="w-full" src={audioSrc} />
              <div className="mt-4 text-center">
                <a href={audioSrc} download="voice.wav" className="text-sm text-indigo-600 hover:underline">Download Audio</a>
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className="mt-12 text-center text-gray-500 text-sm">
        Powered by Qwen3-TTS • Directly Connected to Hugging Face
      </footer>
    </main>
  );
}
