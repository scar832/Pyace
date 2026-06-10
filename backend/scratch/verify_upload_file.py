import asyncio
import uuid
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.deps import get_current_user
from app.models.user import User, UserRole

mock_user = User(
    id=uuid.uuid4(),
    email="test_uploader@example.com",
    hashed_password="hashed_password",
    full_name="Test Uploader",
    role=UserRole.TEACHER,
)

async def override_get_current_user():
    return mock_user

app.dependency_overrides[get_current_user] = override_get_current_user

async def main():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        # Create dummy text file content
        text_content = b"Hello assignment text resource"
        files = {"file": ("test_assignment.txt", text_content, "text/plain")}
        
        print("Uploading generic PDF to /uploads/file...")
        response = await client.post("/uploads/file", files=files)
        print("Response status:", response.status_code)
        print("Response JSON:", response.json())
        assert response.status_code == 200
        assert "url" in response.json()
        print("\n--- SUCCESSFULLY VERIFIED POST /uploads/file ENDPOINT! ---")

if __name__ == "__main__":
    asyncio.run(main())
