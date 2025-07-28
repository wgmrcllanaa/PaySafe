import os
import re
import numpy as np
import traceback
import joblib
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from tensorflow.keras.models import Model, load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import Tokenizer

# --- Configuration ---
MODEL_DIR = "model"
CALIBRATED_SVM_PATH = os.path.join(MODEL_DIR, "calibrated_svm_model.joblib")
TOKENIZER_PATH = os.path.join(MODEL_DIR, "tokenizer.pkl")
LSTM_FULL_MODEL_PATH = os.path.join(MODEL_DIR, "lstm_feature_extractor.h5")
THRESHOLD_PATH = os.path.join(MODEL_DIR, "optimal_threshold.txt")

# --- Globals ---
svm_model = None
tokenizer = None
lstm_feature_model = None
optimal_threshold = 0.2821
MAX_SEQUENCE_LENGTH = 18
TEMPERATURE_SCALING_VALUE = 2.0
MARGIN = 0.05
UPPER_THRESHOLD = None
LOWER_THRESHOLD = None

SAFE_KEYWORDS = [
    "thank you", "your order", "transaction successful", "delivery", "confirmed",
    "pickup", "receipt", "customer support", "paid", "tracking number",
    "shopee", "lazada", "see you", "payment received", "otp", "code",
    "verify", "pin", "gcash", "paymaya", "bank", "account", "fund"
]

# --- Text Preprocessing ---
def normalize_text(text):
    text = str(text).lower()
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'\S+@\S+', '', text)
    text = re.sub(r'\b\d{7,}\b', '', text)
    text = re.sub(r'[^\w\s₱:.]', '', text)
    text = text.replace('@', 'a').replace('$', 's')
    text = text.replace('0', 'o').replace('1', 'i').replace('3', 'e')
    text = re.sub(r'\s+', ' ', text.strip())
    return text

def apply_temperature_scaling(proba, temperature=TEMPERATURE_SCALING_VALUE):
    eps = 1e-7
    proba = np.clip(proba, eps, 1 - eps)
    logits = np.log(proba / (1 - proba))
    scaled_logits = logits / temperature
    return 1 / (1 + np.exp(-scaled_logits))

def load_models():
    global svm_model, tokenizer, lstm_feature_model, optimal_threshold
    global UPPER_THRESHOLD, LOWER_THRESHOLD

    print("--- Loading Models ---")
    svm_model = joblib.load(CALIBRATED_SVM_PATH)
    with open(TOKENIZER_PATH, 'rb') as f:
        tokenizer = joblib.load(f)
    base_model = load_model(LSTM_FULL_MODEL_PATH)
    lstm_feature_model = Model(inputs=base_model.input, outputs=base_model.layers[-4].output)

    UPPER_THRESHOLD = optimal_threshold + MARGIN
    LOWER_THRESHOLD = optimal_threshold - MARGIN

# --- Flask + SocketIO Init ---
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

with app.app_context():
    load_models()

# --- API Endpoint ---
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        raw_message = data.get("message") or data.get("clipboard", "")
        if not raw_message or len(raw_message.strip()) < 5:
            return jsonify({"error": "Invalid or too short message."}), 400

        message = normalize_text(raw_message)
        sequence = tokenizer.texts_to_sequences([message])
        padded_sequence = pad_sequences(sequence, maxlen=MAX_SEQUENCE_LENGTH, padding='post', truncating='post')
        features = lstm_feature_model.predict(padded_sequence, verbose=0)
        scam_prob_raw = svm_model.predict_proba(features)[0][0]
        scam_prob = apply_temperature_scaling(scam_prob_raw)
        confidence = round(abs(scam_prob - 0.5) * 2, 2)

        message_lower = message.lower()
        has_safe_keyword = any(k in message_lower for k in SAFE_KEYWORDS)

        label = "UNSURE"
        reasons = []

        if scam_prob >= UPPER_THRESHOLD:
            label = "SCAM"
            reasons.append(f"High scam probability ({scam_prob:.2f}) > {UPPER_THRESHOLD:.2f}")
        elif scam_prob <= LOWER_THRESHOLD:
            label = "SAFE"
            reasons.append(f"Low scam probability ({scam_prob:.2f}) < {LOWER_THRESHOLD:.2f}")
        else:
            reasons.append(f"Probability ({scam_prob:.2f}) within ambiguous range.")
            if has_safe_keyword:
                label = "SAFE"
                reasons.append("Contains safe keyword.")
            else:
                label = "UNSURE"
                reasons.append("Needs manual review.")

        reported_prob = round((1 - scam_prob) * 100, 2) if label == "SAFE" else round(scam_prob * 100, 2)

        result = {
            "status": label,
            "probability": reported_prob,
            "confidence": confidence,
            "reasons": reasons,
            "raw_input": raw_message,
            "normalized_input": message
        }

        # 🔥 Emit result to clipboard clients via WebSocket
        socketio.emit("clipboard", {"clipboard": raw_message}, namespace="/ws_clipboard")

        print(f"[PREDICT] {result}")
        return jsonify(result)

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# --- WebSocket Namespace ---
@socketio.on('connect', namespace='/ws_clipboard')
def handle_connect():
    print("[✓] Client connected to /ws_clipboard")
    emit("clipboard", {"clipboard": "Welcome from server!"})

@socketio.on('disconnect', namespace='/ws_clipboard')
def handle_disconnect():
    print("[✗] Client disconnected from /ws_clipboard")

# --- Run Server ---
if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5001, debug=True)
