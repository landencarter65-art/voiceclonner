'use client';

import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [speaker, setSpeaker] = useState('Vivian');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const speakers = ['Vivian', 'George', 'Alice', 'Bob', 'Charlie']; // Example speakers

  const handleGenerate = async () => {
    if (!text) return;
    setLoading(true);
    setError(null);
    setAudioSrc(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          speaker,
          language: 'English',
          instruct: 'A professional and clear tone.',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate voice');
      }

      const data = await response.json();
      
      if (data.audio === "MOCK_AUDIO_BASE64_DATA") {
        setError("Note: Running in Mock Mode. No actual audio generated.");
      } else {
        const audioBlob = `data:audio/wav;base64,${data.audio}`;
        setAudioSrc(audioBlob);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Qwen Voice Cloning SaaS
          </h1>
          <p className="text-gray-600">
            Generate high-quality AI voices using Qwen3-TTS
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Text to Speak
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900"
              rows={4}
              placeholder="Type something here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Speaker
              </label>
              <select
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-gray-900"
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
              >
                {speakers.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !text}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
              loading || !text
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200'
            }`}
          >
            {loading ? 'Generating...' : 'Clone Voice & Generate Audio'}
          </button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {audioSrc && (
            <div className="mt-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-900 mb-4 text-center">
                Generated Audio
              </h3>
              <audio controls className="w-full" src={audioSrc}>
                Your browser does not support the audio element.
              </audio>
              <div className="mt-4 flex justify-center">
                <a
                  href={audioSrc}
                  download="generated_voice.wav"
                  className="text-sm text-indigo-600 hover:underline font-medium"
                >
                  Download WAV File
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        Powered by Qwen3-TTS-1.7B • Hosted on Vercel/Render/HuggingFace
      </footer>
    </main>
  );
}
