from datetime import datetime
now = datetime.now()
from MLE.Inference.LoadModels import loading_model


# ----------------------------------
# Function to Predict Probability
# ----------------------------------

model,clf = loading_model()

def spam_probability(message: str):
    emb = model.encode([message])
    prob = clf.predict_proba(emb)[0][1]  # index 1 = spam probability
    return float(prob)

# -----------------------------
# Function to predict batch of messages
# -----------------------------

def spam_probability_batch(messages, batch_size=64):
    """
    Returns list of spam probabilities for a list of messages
    """
    emb2 = model.encode(messages, batch_size=batch_size, show_progress_bar=True)
    prob2 = clf.predict_proba(emb2)[:, 1]  # spam probability
    return [float(p) for p in prob2]

