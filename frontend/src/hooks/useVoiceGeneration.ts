'use client';

import { useState } from 'react';
import { Client, handle_file } from "@gradio/client";

export const speakers = ['Vivian', 'George', 'Alice', 'Bob', 'Charlie', 'Ryan', 'Serena', 'Uncle_Fu', 'Dylan', 'Jada', 'Sunny'];

export const spaceUrl = process.env.NEXT_PUBLIC_HF_SPACE_URL || "https://ytpybe-qwens.hf.space/";

export function useVoiceGeneration() {
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
  const [status, setStatus] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!text) return;
    setLoading(true);
    setError(null);
    setAudioSrc(null);
    setStatus(null);

    try {
      const client = await Client.connect(spaceUrl);
      const result = await client.predict("/tts_fn", {
        text,
        speaker,
        language: "English",
        instruct,
      }) as any;

      console.log("TTS Result:", result);

      if (result.data && result.data[0]) {
        const url = typeof result.data[0] === 'string' ? result.data[0] : result.data[0].url;
        setAudioSrc(url);
        if (result.data[1]) setStatus(result.data[1]);
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
    setStatus(null);

    try {
      const client = await Client.connect(spaceUrl);
      const audio_data = await handle_file(refFile);

      const result = await client.predict("/clone_fn", {
        text: cloneText,
        reference_audio_path: audio_data,
        reference_text: refText,
        language: "English",
      }) as any;

      console.log("Clone Result:", result);

      if (result.data && result.data[0]) {
        const url = typeof result.data[0] === 'string' ? result.data[0] : result.data[0].url;
        setAudioSrc(url);
        if (result.data[1]) setStatus(result.data[1]);
      } else {
        throw new Error("Cloning failed to return audio");
      }
    } catch (err: any) {
      setError(err.message || 'Error cloning voice');
    } finally {
      setLoading(false);
    }
  };

  return {
    // Generation
    text, setText,
    speaker, setSpeaker,
    instruct, setInstruct,
    handleGenerate,
    // Cloning
    cloneText, setCloneText,
    refText, setRefText,
    refFile, setRefFile,
    handleClone,
    // Common
    audioSrc, loading, error, status,
  };
}
