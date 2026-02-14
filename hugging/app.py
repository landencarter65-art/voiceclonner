import os
import torch
import numpy as np
import gradio as gr
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Global model variable and error message
model = None
load_error = None

try:
    from qwen_tts import Qwen3TTSModel
    print("Loading Qwen3-TTS model...")
    device = "cuda" if torch.cuda.is_available() else "cpu"
    
    # 0.6B model is perfect for most T4 or CPU spaces
    model_id = os.getenv("MODEL_ID", "Qwen/Qwen3-TTS-12Hz-0.6B-Base")
    dtype = torch.float32 if device == "cpu" else torch.bfloat16
    
    model = Qwen3TTSModel.from_pretrained(
        model_id,
        device_map="auto" if device == "cuda" else None,
        dtype=dtype
    )
    
    if device == "cpu":
        model = model.to("cpu")
    print(f"Model {model_id} loaded successfully on {device}.")
except Exception as e:
    load_error = str(e)
    print(f"Failed to load model: {e}")
    model = None

# 1. Standard TTS Function
def tts_fn(text, speaker, language, instruct):
    if not model:
        return None, f"Error: Model not loaded on server. {load_error or ''}"
    try:
        wavs, sr = model.generate_custom_voice(
            text=text,
            language=language,
            speaker=speaker,
            instruct=instruct,
        )
        # Ensure correct shape and convert to numpy for Gradio serialization
        audio_data = wavs[0].cpu().numpy().squeeze()
        return (sr, audio_data), "Success"
    except Exception as e:
        print(f"TTS Error: {e}")
        return None, f"Generation Error: {str(e)}"

# 2. Voice Cloning Function
def clone_fn(text, reference_audio_path, reference_text, language):
    if not model:
        return None, f"Error: Model not loaded on server. {load_error or ''}"
    try:
        wavs, sr = model.generate_voice_clone(
            ref_audio=reference_audio_path,
            ref_text=reference_text,
            text=text,
            language=language
        )
        # Ensure correct shape and convert to numpy
        audio_data = wavs[0].cpu().numpy().squeeze()
        return (sr, audio_data), "Cloning Successful"
    except Exception as e:
        print(f"Cloning Error: {e}")
        return None, f"Cloning Error: {str(e)}"

# Create Gradio Interface
with gr.Blocks(title="Qwen3-TTS Service") as demo:
    gr.Markdown("# 🎙️ Qwen3-TTS AI Voice Service")
    
    with gr.Tab("Text to Speech"):
        with gr.Row():
            with gr.Column():
                t_input = gr.Textbox(label="Text", value="Hello, how are you today?", lines=3)
                t_speaker = gr.Textbox(label="Speaker Name", value="Vivian")
                t_lang = gr.Dropdown(label="Language", choices=["English", "Chinese", "Japanese", "Korean", "German", "French", "Russian", "Portuguese", "Spanish", "Italian"], value="English")
                t_inst = gr.Textbox(label="Instruction", value="A warm, gentle tone.")
                t_btn = gr.Button("Generate Voice", variant="primary")
            with gr.Column():
                t_audio = gr.Audio(label="Output Audio")
                t_status = gr.Textbox(label="Status")
        
        t_btn.click(tts_fn, inputs=[t_input, t_speaker, t_lang, t_inst], outputs=[t_audio, t_status], api_name="tts_fn")

    with gr.Tab("Voice Cloning"):
        with gr.Row():
            with gr.Column():
                c_text = gr.Textbox(label="Target Text", placeholder="What should the cloned voice say?", lines=3)
                c_audio = gr.Audio(label="Reference Audio Sample", type="filepath")
                c_ref_text = gr.Textbox(label="Reference Transcript", placeholder="Exactly what is said in the sample...")
                c_lang = gr.Dropdown(label="Language", choices=["English", "Chinese", "Japanese", "Korean", "German", "French", "Russian", "Portuguese", "Spanish", "Italian"], value="English")
                c_btn = gr.Button("Clone Voice", variant="primary")
            with gr.Column():
                c_out_audio = gr.Audio(label="Cloned Audio")
                c_status = gr.Textbox(label="Status")
        
        c_btn.click(clone_fn, inputs=[c_text, c_audio, c_ref_text, c_lang], outputs=[c_out_audio, c_status], api_name="clone_fn")

# FastAPI setup
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "healthy", "model_loaded": model is not None}

app = gr.mount_gradio_app(app, demo, path="/")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)

