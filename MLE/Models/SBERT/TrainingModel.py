
from datetime import datetime
now = datetime.now()
from sentence_transformers import SentenceTransformer
import numpy as np
from MLE.Data.CleanDataSetFunc  import  clean_data_set

def bert_loading():
    # ----------------------------------
    # Load SBERT
    # ----------------------------------
    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")


    #df = pd.read_csv("Data/DataSetTryFinalProject.csv", encoding="cp1252")

    df = clean_data_set()

    text = df["text"].tolist()
    labels = df["label"].values

    embeddings = model.encode(text, batch_size=64, show_progress_bar=True)

    np.save("MLE/Data/embeddings.npy", embeddings)
    np.save("MLE/Data/labels.npy", labels)
    return embeddings,text,model,labels
