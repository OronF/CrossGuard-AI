from datetime import datetime

now = datetime.now()

from sentence_transformers import SentenceTransformer
import joblib

# Load SBERT model (pretrained, instant)
def loading_model():
    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2" , cache_folder="MLE/Inference")

# Load trained classifier
    clf = joblib.load("MLE/Models/Classifier/spam_classifier.pkl")
    return model,clf

end = datetime.now()

print("this is the time it took the model to start working - LoadModels!")
print(end - now)