from MLE.Inference.Predictions import spam_probability, spam_probability_batch
from MLE.Inference.Predictions import spam_probability
from pydantic import BaseModel
from MLE.API.API_server import creating_server

app = creating_server()

# Define input model
class Message(BaseModel):
    message: str

# Single message endpoint
@app.post("/predict")
def predict_spam(msg: Message):
    """
    Returns the spam probability for a single message.
    """
    prob = spam_probability(msg.message)
    return {"message": msg.message, "spam_probability": float(prob)}

# Batch endpoint (optional)
class Messages(BaseModel):
    messages: list[str]

@app.post("/predict_batch")
def predict_spam_batch(msgs: Messages):
    # Ensure all probabilities are JSON serializable
    probs = [float(p) for p in spam_probability_batch(msgs.messages)]
    return {"messages": msgs.messages, "spam_probabilities": probs}

# Test endpoint
@app.get("/")
def root():
    return {"message": "Spam Detector API is running"}