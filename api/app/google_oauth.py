import requests
from fastapi import HTTPException

import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("CLIENT_ID_API")
GOOGLE_CLIENT_SECRET = os.getenv("CLIENT_SECRET_API")
GOOGLE_REDIRECT_URI = "http://localhost:8000/auth/google/callback"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

# Step 1: Redirect user to Google OAuth URL
# Step 2: Handle callback and exchange code for token
# Step 3: Get user info from Google

def get_google_token(code: str):
    data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code"
    }
    response = requests.post(GOOGLE_TOKEN_URL, data=data)
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to get token from Google")
    return response.json()

def get_google_userinfo(access_token: str):
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(GOOGLE_USERINFO_URL, headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to get user info from Google")
    return response.json()
