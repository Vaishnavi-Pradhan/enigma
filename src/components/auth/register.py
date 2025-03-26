from flask import Flask, request, jsonify
import numpy as np
import face_recognition
import bcrypt
from supabase import create_client
import io
from PIL import Image

# Supabase Credentials
SUPABASE_URL = "https://kfldodwfdtnafaqpbdhe.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmbGRvZHdmZHRuYWZhcXBiZGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5ODMxNzcsImV4cCI6MjA1ODU1OTE3N30.a22_yLYQzfzuOckHLY29UUZ_7sU1_gBE7Qo9L1ijFiM"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)

# Hash password
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

@app.route('/register', methods=['POST'])
def register():
    username = request.form.get("username")
    password = request.form.get("password")
    image_file = request.files["image"]

    # Convert image to array
    image = Image.open(io.BytesIO(image_file.read()))
    image = np.array(image)

    # Extract face embeddings
    encodings = face_recognition.face_encodings(image)
    if len(encodings) == 0:
        return jsonify({"error": "No face detected"}), 400

    embedding = encodings[0].tolist()
    hashed_password = hash_password(password)

    # Store in Supabase
    data = {
        "username": username,
        "password": hashed_password,
        "embedding": embedding
    }
    supabase.table("users").insert(data).execute()

    return jsonify({"message": "User registered successfully!"})

if __name__ == '__main__':
    app.run(debug=True)
