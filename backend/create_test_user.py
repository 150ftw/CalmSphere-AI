import os
import asyncio
from datetime import datetime, timedelta, timezone
from supabase import create_client, Client
from dotenv import load_dotenv

# Explicitly load from the backend directory
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

async def main():
    supabase_url = os.environ.get('SUPABASE_URL')
    supabase_key = os.environ.get('SUPABASE_KEY')
    
    if not supabase_url or not supabase_key:
        print("Error: SUPABASE_URL or SUPABASE_KEY not found in .env file")
        return
        
    supabase: Client = create_client(supabase_url, supabase_key)

    user_id = f"test-user-{int(datetime.now().timestamp())}"
    session_token = f"test_session_{int(datetime.now().timestamp())}"

    user_data = {
        "user_id": user_id,
        "email": f"test.user.{int(datetime.now().timestamp())}@example.com",
        "name": "Test User",
        "picture": "https://via.placeholder.com/150",
    }
    
    session_data = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
    }

    try:
        supabase.table("users").insert(user_data).execute()
        supabase.table("user_sessions").insert(session_data).execute()
        print(f"SESSION_TOKEN={session_token}")
        print(f"USER_ID={user_id}")
    except Exception as e:
        print(f"Error creating test user: {e}")

if __name__ == "__main__":
    asyncio.run(main())
