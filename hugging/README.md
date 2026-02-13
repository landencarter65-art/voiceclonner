---
title: Qwen3 TTS Custom Voice
emoji: 🎙️
colorFrom: blue
colorTo: indigo
sdk: docker
pinned: false
---

# Qwen3-TTS API

This is a FastAPI-based TTS service using the Qwen3-TTS model.

## API Endpoints

- `GET /`: Check status
- `POST /generate`: Generate audio from text

### Usage

```json
{
  "text": "Hello world",
  "speaker": "Vivian",
  "language": "English",
  "instruct": "A warm, gentle tone."
}
```
