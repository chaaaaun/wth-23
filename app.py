import os
import requests
import base64

SPEECH_API_URL = "https://api-inference.huggingface.co/models/facebook/xm_transformer_unity_hk-en"
TEXT_API_URL = "https://api-inference.huggingface.co/models/jonatasgrosman/wav2vec2-large-xlsr-53-english"
headers = {"Authorization": f'Bearer {os.getenv("HF_TOKEN")}'}

def to_eng(filename):
    with open(filename, "rb") as f:
        data = f.read()
    response = requests.post(SPEECH_API_URL, headers=headers, data=data)
    return response.json()

def to_text(filename):
    with open(filename, "rb") as f:
        data = f.read()
    response = requests.post(TEXT_API_URL, headers=headers, data=data)
    return response.json()

output = to_eng("audio.mp3")
data = base64.b64decode(output[0]["blob"])

with open("res.flac", "wb") as f:
    f.write(data)

s = to_text("res.flac")
print(s["text"])