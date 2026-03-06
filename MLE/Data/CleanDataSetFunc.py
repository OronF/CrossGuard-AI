import re
import pandas as pd

def clean_text_light(text: str) -> str:
    if not isinstance(text, str):
        return ""

    # Normalize weird unicode quotes, spaces, etc.
    text = text.encode("utf-8", "ignore").decode("utf-8")

    # Replace URLs with token
    text = re.sub(r"http\S+|www\.\S+", "<URL>", text)

    # Replace emails
    text = re.sub(r"\S+@\S+\.\S+", "<EMAIL>", text)

    # Remove weird non-printable chars
    text = re.sub(r"[^\x09\x0A\x0D\x20-\x7F\u0080-\uFFFF]", "", text)

    # Remove duplicate spaces
    text = re.sub(r"\s+", " ", text)

    return text.strip()

def clean_data_set():
    df = pd.read_csv("MLE/Data/kaggleDataSet.csv", encoding="cp1252")

    df['text'] = df['text'].apply(clean_text_light)

    # Save cleaned dataset
    df.to_csv("MLE/Data/CleanedDataSet.csv", index=False)
    return df


# Apply cleaning