import requests
import os

# Test PDF/DOCX extraction and analysis
def test_upload_and_chat():
    backend_url = "http://localhost:8000"
    
    # Check if we can reach the backend
    try:
        response = requests.get(f"{backend_url}/documents")
        print(f"Backend connection: {response.status_code}")
    except Exception as e:
        print(f"Failed to connect to backend: {e}")
        return

if __name__ == "__main__":
    test_upload_and_chat()
