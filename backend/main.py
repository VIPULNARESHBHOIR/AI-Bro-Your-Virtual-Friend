from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import google.generativeai as genai
from dotenv import load_dotenv


app = FastAPI()

origins = [
    'http://127.0.0.1:5500',
    'http://127.0.0.1:5500/index.html',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

generation_config = {
"temperature": 1,
"top_p": 0.95,
"top_k": 64,
"max_output_tokens": 2000,
"response_mime_type": "text/plain",
}

safety_settings = [
{
    "category": "HARM_CATEGORY_HARASSMENT",
    "threshold": "BLOCK_NONE",
},
{
    "category": "HARM_CATEGORY_HATE_SPEECH",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE",
},
{
    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE",
},
{
    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE",
},
]

model = genai.GenerativeModel(
model_name= "gemini-1.5-flash",
safety_settings= safety_settings,
generation_config= generation_config,
system_instruction= "You are the expert system of the world. Just keep it in mind that provide precise and brief answer every time.",
)

chat_session = model.start_chat(
    history=[]
)

async def generate_response(user_input: str):
    try:
        response = chat_session.send_message(user_input)
        model_response = response.text
        
        chat_session.history.append({"role": "user", "parts": [user_input]})
        chat_session.history.append({"role": "model", "parts": [model_response]})
    
    except Exception as e:
        print(e)
        model_response = "Sorry! an error occured at server."
    
    return model_response


@app.get('/response/')
async def get_response(prompt: str):

    response = await generate_response(prompt)

    print(response)

    return { 'response' : response }
    

#http://127.0.0.1:8000/response/?prompt=hello%2C%20my%20name%20is%20vipul