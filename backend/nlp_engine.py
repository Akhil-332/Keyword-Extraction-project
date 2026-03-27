import google.generativeai as genai
import json
import PyPDF2
from docx import Document as DocxDocument
import io
from config import settings

# Configure Gemini
try:
    if settings.GOOGLE_API_KEY and settings.GOOGLE_API_KEY != "your_gemini_api_key_here":
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        # Use gemini-flash-latest which is widely available on free tier
        try:
            model = genai.GenerativeModel('gemini-flash-latest')
        except:
            model = genai.GenerativeModel('gemini-pro-latest')
        use_gemini = True
    else:
        use_gemini = False
except Exception as e:
    print(f"Gemini Configuration Error: {e}")
    use_gemini = False

class NLPEngine:
    @staticmethod
    def extract_text_from_pdf(file_bytes):
        try:
            reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""
            return text
        except Exception as e:
            print(f"Error extracting PDF: {e}")
            return ""

    @staticmethod
    def extract_text_from_docx(file_bytes):
        try:
            doc = DocxDocument(io.BytesIO(file_bytes))
            text = "\n".join([para.text for para in doc.paragraphs])
            return text
        except Exception as e:
            print(f"Error extracting DOCX: {e}")
            return ""

    @staticmethod
    def extract_keywords(text: str):
        if not text: return []
        if use_gemini:
            try:
                prompt = f"Extract the top 15 most important keywords and key phrases from this text. Return them ONLY as a comma-separated list of short strings (1-3 words each).\n\nText: {text[:8000]}"
                response = model.generate_content(prompt)
                keywords = response.text.strip().split(", ")
                return [k.strip() for k in keywords if k.strip()][:15]
            except:
                pass
        
        # Simple fallback logic if Gemini fails
        words = text.split()
        return list(set([w.strip(',.()') for w in words if len(w) > 5]))[:12]

    @staticmethod
    def extract_ordered_points(text: str, num_points: int = 8):
        if not text: return []
        if use_gemini:
            try:
                prompt = f"Extract exactly {num_points} key points from this document in CHRONOLOGICAL order. Focus on the most important facts. Return them ONLY as a bulleted list starting with '1. ', '2. ', etc.\n\nText: {text[:15000]}"
                response = model.generate_content(prompt)
                lines = response.text.strip().split("\n")
                points = [l.split(". ", 1)[1] if ". " in l else l for l in lines if l.strip()]
                return points[:num_points]
            except:
                pass
        
        # Simple sentence-based fallback
        sentences = [s.strip() for s in text.split('.') if len(s.split()) > 8]
        return sentences[:num_points]

    @staticmethod
    def detect_topics(text: str):
        if not text: return []
        if use_gemini:
            try:
                prompt = f"Identify the top 8 main topics or categories discussed in this text. Return them ONLY as a comma-separated list of short phrases.\n\nText: {text[:8000]}"
                response = model.generate_content(prompt)
                topics = response.text.strip().split(", ")
                return [t.strip() for t in topics if t.strip()][:8]
            except:
                pass
        return ["General"]

    @staticmethod
    def generate_summary(text: str, max_length: int = 400):
        if not text: return "No text provided for summary."
        if use_gemini:
            try:
                prompt = f"Provide a concise and professional summary of this document (max {max_length} characters). Give an executive overview.\n\nText: {text[:15000]}"
                response = model.generate_content(prompt)
                return response.text.strip()
            except:
                pass
        return text[:max_length] + "..."

    @staticmethod
    def get_context_answer(query: str, doc_content: str):
        if not doc_content: return "I don't have enough context."
        
        # Handle Small Talk
        greetings = ["hi", "hello", "hey", "how are you"]
        if query.lower().strip() in greetings:
            return "Hello! I'm your Gemini-powered DocInsight AI. I've analyzed your document. What would you like to know?"

        if use_gemini:
            try:
                # Construct a professional agentic prompt
                prompt = f"""
                You are a professional Document Intelligence Agent for DocInsight AI.
                Your task is to answer the user's question based ONLY on the provided document content.
                If the answer is not in the document, say you don't know based on the file.
                Be concise, accurate, and professional.

                Document Content Context:
                {doc_content[:30000]}

                User Question: {query}
                """
                response = model.generate_content(prompt)
                return response.text.strip()
            except Exception as e:
                print(f"Gemini Chat Error: {e}")
                return "I ran into an error while trying to generate an answer. Please check my connection."

        return "Gemini API is not configured. Please add your API key to the .env file."
