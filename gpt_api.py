import openai
import gradio as gr

openai.api_key = "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"

messages = [
    {"role": "system", "content": "The user is an elderly living in Singapore. You are a helpful AI assistant helping the user. Replies should be summarised in 100 words."},
]

def chatbot(input):
    if input:
        messages.append({"role": "user", "content": input})
        chat = openai.ChatCompletion.create(
            model="gpt-3.5-turbo", messages=messages
        )
        reply = chat.choices[0].message.content
        messages.append({"role": "assistant", "content": reply})
        return reply

inputs = gr.inputs.Textbox(lines=7, label="Chat with AI")
outputs = gr.outputs.Textbox(label="Reply")

gr.Interface(fn=chatbot, inputs=inputs, outputs=outputs, title="AI Chatbot",
             description="Ask anything you want",
             theme="compact").launch(share=True)