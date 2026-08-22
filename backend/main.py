from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os
import shutil
import uuid

from database import get_db, init_db, Document
from nlp_engine import NLPEngine
from config import settings

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload directory exists
if not os.path.exists(settings.UPLOAD_DIR):
    os.makedirs(settings.UPLOAD_DIR)

class ChatRequest(BaseModel):
    doc_id: int
    query: str

@app.on_event("startup")
def startup():
    init_db()

@app.post("/upload")
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_bytes = await file.read()
    file_path = os.path.join(settings.UPLOAD_DIR, f"{uuid.uuid4()}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        buffer.write(file_bytes)
    
    # Read content based on file type
    content = ""
    if file.filename.endswith(".txt"):
        content = file_bytes.decode("utf-8")
    elif file.filename.endswith(".pdf"):
        content = NLPEngine.extract_text_from_pdf(file_bytes)
    elif file.filename.endswith(".docx") or file.filename.endswith(".doc"):
        content = NLPEngine.extract_text_from_docx(file_bytes)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format")

    if not content:
        content = "Could not extract text from the document."

    # Clean text (remove headers, footers, boilerplate)
    content = NLPEngine.clean_text(content)

    # Analyze
    keywords = NLPEngine.extract_keywords(content)
    topics = NLPEngine.detect_topics(content)
    key_points = NLPEngine.extract_ordered_points(content)
    summary_short = NLPEngine.generate_summary(content, max_length=150)
    summary_detailed = NLPEngine.generate_summary(content, max_length=400)

    db_doc = Document(
        filename=file.filename,
        content=content,
        summary_short=summary_short,
        summary_detailed=summary_detailed,
        keywords=", ".join(keywords),
        topics=", ".join(topics),
        key_points="||".join(key_points) # Use a separator for the list
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    
    return db_doc

@app.get("/documents")
def get_documents(db: Session = Depends(get_db)):
    return db.query(Document).order_by(Document.created_at.desc()).all()

@app.api_route("/documents/{doc_id}", methods=["GET"])
def get_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc

@app.api_route("/documents/{doc_id}/delete", methods=["DELETE", "POST"])
def delete_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(doc)
    db.commit()
    return {"message": "Document deleted successfully"}

@app.api_route("/documents/clear", methods=["DELETE", "POST"])
def clear_documents(db: Session = Depends(get_db)):
    db.query(Document).delete()
    db.commit()
    return {"message": "All documents cleared successfully"}

@app.post("/chat")
async def chat_with_document(request: ChatRequest, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == request.doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    answer = NLPEngine.get_context_answer(request.query, doc.content)
    return {"answer": answer}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
