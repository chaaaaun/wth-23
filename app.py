import base64
import os
import json

import openai
import requests
from flask import Flask
from flask import abort, request, Response
from decouple import config

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000


@app.route("/api", methods=['POST'])
def handle():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            print('No file part')
            abort(400)
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            print('No selected file')
            return abort(400)
        if file:
            q = to_query(file)
            print(q)
            if q[1] != "":
                return abort(400, q[1])
            ans = query_to_response(q[0])
            print(ans)
            # return {'data':ans }, 200      
            
            res = from_response(ans)
            if res[1] != "":
                return abort(400, res[1])
            return {"data":  {"text": ans} }, 200


api_urls = {
    "HK_TO_ENG": "https://api-inference.huggingface.co/models/facebook/xm_transformer_unity_hk-en",
    "ENG_TO_HK": "https://api-inference.huggingface.co/models/facebook/xm_transformer_unity_en-hk",
    "ENG_TO_TEXT": "https://api-inference.huggingface.co/models/jonatasgrosman/wav2vec2-large-xlsr-53-english",
    "TEXT_TO_ENG": "https://api-inference.huggingface.co/models/facebook/fastspeech2-en-ljspeech"
}
headers = {"Authorization": f'Bearer {os.getenv("HF_TOKEN")}'}
openai.api_key = os.getenv("AI_TOKEN")

if headers["Authorization"] == 'Bearer None':
    headers = {"Authorization": f'Bearer {config("HF_TOKEN")}'}
    openai.api_key = config('AI_TOKEN')

ERR_FAILED_AUD = "Failed to process audio, please try again later."


def to_query(audio) -> (str, str):
    eng_aud_res = requests.post(api_urls["HK_TO_ENG"], headers=headers, data=audio)
    if eng_aud_res.status_code != 200:
        print(eng_aud_res.content)
        print(headers)
        return "", ERR_FAILED_AUD

    eng_aud_obj = eng_aud_res.json()
    eng_aud_blob = base64.b64decode(eng_aud_obj[0]["blob"])

    eng_text_res = requests.post(api_urls["ENG_TO_TEXT"], headers=headers, data=eng_aud_blob)
    if eng_text_res.status_code != 200:
        return "", ERR_FAILED_AUD
    eng_text = eng_text_res.json()

    return eng_text["text"], ""


def query_to_response(query) -> str:
    messages = [{"role": "system",
                 "content": "The user is an elderly living in Singapore. You are a helpful AI assistant helping the "
                            "user. Replies should be summarised in 30 words and in Chinese."},
                {"role": "user", "content": query}]
    chat = openai.ChatCompletion.create(
        model="gpt-3.5-turbo", messages=messages
    )
    reply = chat.choices[0].message.content
    messages.append({"role": "assistant", "content": reply})
    return reply


def from_response(text) -> (str, str):
    text_req = {
        "inputs": text
    }
    eng_aud_res = requests.post(api_urls["TEXT_TO_ENG"], headers=headers, data=text_req)
    if eng_aud_res.status_code != 200:
        print("ENG", eng_aud_res.content)
        return "", ERR_FAILED_AUD

    hk_aud_res = requests.post(api_urls["ENG_TO_HK"], headers=headers, data=eng_aud_res)
    if hk_aud_res.status_code != 200:
        print("HK", hk_aud_res.content)
        return "", ERR_FAILED_AUD
    hk_aud = hk_aud_res.json()

    return hk_aud, ""
