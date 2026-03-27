import sqlite3
import os

db_path = r"c:\Users\DELL\OneDrive\Desktop\keypoints extraction\backend\docinsight.db"

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if key_points exists
        cursor.execute("PRAGMA table_info(documents)")
        columns = [col[1] for col in cursor.fetchall()]
        print(f"Current columns: {columns}")
        
        if "key_points" not in columns:
            print("Adding key_points column...")
            cursor.execute("ALTER TABLE documents ADD COLUMN key_points TEXT")
            conn.commit()
            print("Column added successfully.")
        else:
            print("key_points column already exists.")
            
    except Exception as e:
        print(f"Error handling database: {e}")
    finally:
        conn.close()
else:
    print("Database file not found.")
