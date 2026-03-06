from fastapi import FastAPI

# Create FastAPI instance
def creating_server():
    app = FastAPI(title="Spam Detector API", version="1.0")
    return app
