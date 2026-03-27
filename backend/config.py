from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "DocInsight AI"
    DATABASE_URL: str = "sqlite:///./docinsight.db"
    UPLOAD_DIR: str = "uploads"
    GOOGLE_API_KEY: str = ""
    
    class Config:
        env_file = ".env"

settings = Settings()
