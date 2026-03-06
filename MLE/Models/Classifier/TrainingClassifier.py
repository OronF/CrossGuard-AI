from datetime import datetime
now = datetime.now()
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import joblib
from MLE.Models.SBERT.TrainingModel import bert_loading
from sklearn.metrics import classification_report

# ----------------------------------
# Train/Test Split
# ----------------------------------
embeddings,text,model,labels = bert_loading()

def train_test_split_func():
    x_train, x_temp, y_train, y_temp = train_test_split(embeddings, labels, test_size=0.3, random_state=42, stratify=labels)
    return x_train, x_temp, y_train, y_temp

# Step 2: split temp into validation + test (each 15%)
def val_test_split():
    x_train, x_temp, y_train, y_temp = train_test_split_func()
    x_val, x_test, y_val, y_test = train_test_split(x_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp)
    return x_val, x_test, y_val, y_test

# ----------------------------------
# Train Classifier
# ----------------------------------
def train_model():
    x_train, x_temp, y_train, y_temp = train_test_split_func()

    clf = LogisticRegression(max_iter=500)
    clf.fit(x_train, y_train)

    joblib.dump(clf, "spam_classifier.pkl")
    return clf

def classification_report_func():
    # ----------------------------------
    # Evaluate
    # ----------------------------------
    clf = train_model()
    x_train, x_temp, y_train, y_temp = train_test_split_func()
    y_pred = clf.predict(x_train)
    print(classification_report(y_train, y_pred))


classification_report_func()
print("Model saved successfully! - trainingClassifier")

end = datetime.now()

print("this is the time it took the model to start working - trainingClassifier")
print(end - now)