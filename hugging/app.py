import os
import torch
import soundfile as sf
import io
import base64
import tempfile
import shutil
import gradio as gr
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Global model variable
model = None

try:
    from qwen_tts import Qwen3TTSModel
    print("Loading Qwen3-TTS model...")
    device = "cuda" if torch.cuda.is_available() else "cpu"
    
    # Base model supports both CustomVoice generation AND Voice Cloning
    model_id = os.getenv("MODEL_ID", "Qwen/Qwen3-TTS-12Hz-0.6B-Base")
    
    dtype = torch.float32 if device == "cpu" else torch.bfloat16
    
    model = Qwen3TTSModel.from_pretrained(
        model_id,
        device_map=device,
        dtype=dtype
    )
    print(f"Model {model_id} loaded successfully on {device}.")
except Exception as e:
    print(f"Failed to load model: {e}")
    model = None

# 1. Standard TTS Function
def tts_fn(text, speaker, language, instruct):
    if not model:
        return None, "Model not loaded (Mock Mode)"
    try:
        # Note: Base model uses generate_custom_voice for text instructions
        wavs, sr = model.generate_custom_voice(
            text=text,
            language=language,
            speaker=speaker,
            instruct=instruct,
        )
        return (sr, wavs[0]), "Success"
    except Exception as e:
        return None, f"Error: {str(e)}"

# 2. Voice Cloning Function
def clone_fn(text, reference_audio_path, reference_text, language):
    if not model:
        return None, "Model not loaded"
    try:
        # Qwen3-TTS Base model uses generate_voice_clone
        # Updated parameter names to match latest qwen-tts API
        wavs, sr = model.generate_voice_clone(
            ref_audio=reference_audio_path,
            ref_text=reference_text,
            text=text,
            language=language
        )
        return (sr, wavs[0]), "Cloning Successful"
    except Exception as e:
        return None, f"Cloning Error: {str(e)}"

# Create Gradio Interface with two distinct tabs/APIs
with gr.Blocks() as demo:
    gr.Markdown("# Qwen3-TTS AI Service")
    
    with gr.Tab("Text to Speech"):
        t_input = gr.Textbox(label="Text", value="Hello, how are you today?")
        t_speaker = gr.Textbox(label="Speaker Name", value="Vivian")
        t_lang = gr.Dropdown(label="Language", choices=["English", "Chinese", "Japanese", "Korean", "German", "French", "Russian", "Portuguese", "Spanish", "Italian"], value="English")
        t_inst = gr.Textbox(label="Instruction", value="A warm, gentle tone.")
        t_btn = gr.Button("Generate")
        t_audio = gr.Audio(label="Output Audio")
        t_status = gr.Textbox(label="Status")
        
        t_btn.click(tts_fn, inputs=[t_input, t_speaker, t_lang, t_inst], outputs=[t_audio, t_status], api_name="tts_fn")

    with gr.Tab("Voice Cloning"):
        c_text = gr.Textbox(label="Target Text", placeholder="What should the cloned voice say?")
        c_audio = gr.Audio(label="Reference Audio Sample", type="filepath")
        c_ref_text = gr.Textbox(label="Reference Transcript", placeholder="Exactly what is said in the sample...")
        c_lang = gr.Dropdown(label="Language", choices=["English", "Chinese", "Japanese", "Korean", "German", "French", "Russian", "Portuguese", "Spanish", "Italian"], value="English")
        c_btn = gr.Button("Clone Voice")
        c_out_audio = gr.Audio(label="Cloned Audio")
        c_status = gr.Textbox(label="Status")
        
        c_btn.click(clone_fn, inputs=[c_text, c_audio, c_ref_text, c_lang], outputs=[c_out_audio, c_status], api_name="clone_fn")

# FastAPI Wrapper
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app = gr.mount_gradio_app(app, demo, path="/")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
