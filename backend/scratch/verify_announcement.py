import asyncio
import uuid
from datetime import datetime, timedelta, timezone
from httpx import AsyncClient, ASGITransport

from app.main import app
from app.database.session import SessionLocal
from app.core.deps import get_current_user
from app.models.user import User, UserRole
from app.models.classroom import Class, ClassEnrollment, EnrollmentRole
from app.models.announcement import Announcement
from sqlalchemy.future import select


# Dynamic mock user to be returned by get_current_user dependency override
mock_user = None

async def override_get_current_user():
    if mock_user is None:
        raise Exception("Mock user is not set in test")
    return mock_user


app.dependency_overrides[get_current_user] = override_get_current_user


async def main():
    async with SessionLocal() as db:
        print("--- RUNNING ANNOUNCEMENT VERIFICATION SCRIPT ---")

        # 1. Create mock Teacher, Student, and Class
        teacher = User(
            id=uuid.uuid4(),
            email=f"test_teacher_{uuid.uuid4().hex[:6]}@example.com",
            hashed_password="hashed_password",
            full_name="Test Teacher",
            role=UserRole.TEACHER,
        )
        student = User(
            id=uuid.uuid4(),
            email=f"test_student_{uuid.uuid4().hex[:6]}@example.com",
            hashed_password="hashed_password",
            full_name="Test Student",
            role=UserRole.STUDENT,
        )
        unrelated_student = User(
            id=uuid.uuid4(),
            email=f"unrelated_{uuid.uuid4().hex[:6]}@example.com",
            hashed_password="hashed_password",
            full_name="Unrelated Student",
            role=UserRole.STUDENT,
        )

        db.add_all([teacher, student, unrelated_student])
        await db.commit()

        classroom = Class(
            id=uuid.uuid4(),
            class_name="Test Physics Class",
            class_code=f"PHYS{uuid.uuid4().hex[:2].upper()}",
            instructor_id=teacher.id,
        )
        db.add(classroom)
        await db.commit()

        enrollment = ClassEnrollment(
            id=uuid.uuid4(),
            class_id=classroom.id,
            student_id=student.id,
            role=EnrollmentRole.student,
        )
        db.add(enrollment)
        await db.commit()

        print(f"Test Class created with ID: {classroom.id}")
        print(f"Teacher ID: {teacher.id}, Student ID: {student.id}, Unrelated Student ID: {unrelated_student.id}")

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://testserver") as client:
            global mock_user

            # --- TEST 1: Create Announcement (Unauthorized Student) ---
            print("\nTest 1.1: Student trying to create announcement (Should fail with 403)...")
            mock_user = student
            response = await client.post(
                f"/classes/{classroom.id}/announcements/",
                json={
                    "content": "Student announcement"
                }
            )
            assert response.status_code == 403, f"Expected 403, got {response.status_code}: {response.text}"
            print("Passed!")

            # --- TEST 2: Create Announcements (Authorized Teacher) ---
            print("\nTest 2.1: Teacher creating multiple announcements with different pinning options...")
            mock_user = teacher
            
            # Ann 1: Regular (Not pinned)
            response1 = await client.post(
                f"/classes/{classroom.id}/announcements/",
                json={"content": "Announcement 1: Regular"}
            )
            assert response1.status_code == 201
            ann1 = response1.json()
            print("Created Regular Announcement 1")
            
            # Sleep 1s to ensure distinct timestamps for sorting
            await asyncio.sleep(1)

            # Ann 2: Pinned indefinitely
            response2 = await client.post(
                f"/classes/{classroom.id}/announcements/",
                json={"content": "Announcement 2: Pinned Indefinitely", "is_pinned": True}
            )
            assert response2.status_code == 201
            ann2 = response2.json()
            print("Created Pinned Announcement 2")
            
            await asyncio.sleep(1)

            # Ann 3: Pinned with future expiry (expires tomorrow)
            tomorrow = datetime.now(timezone.utc) + timedelta(days=1)
            response3 = await client.post(
                f"/classes/{classroom.id}/announcements/",
                json={"content": "Announcement 3: Pinned Future Expiry", "pinned_until": tomorrow.isoformat()}
            )
            assert response3.status_code == 201
            ann3 = response3.json()
            assert ann3["is_pinned"] is True, "Should be forced to True because pinned_until was provided"
            print("Created Pinned Future Expiry Announcement 3")
            
            await asyncio.sleep(1)

            # Ann 4: Pinned with past expiry (expired yesterday)
            yesterday = datetime.now(timezone.utc) - timedelta(days=1)
            response4 = await client.post(
                f"/classes/{classroom.id}/announcements/",
                json={"content": "Announcement 4: Pinned Past Expiry", "pinned_until": yesterday.isoformat()}
            )
            assert response4.status_code == 201
            ann4 = response4.json()
            assert ann4["is_pinned"] is True, "Should be forced to True because pinned_until was provided"
            print("Created Pinned Past Expiry Announcement 4")

            # --- TEST 3: Fetch sorted announcements (Instructors and enrolled students) ---
            print("\nTest 3.1: Fetch announcements as student and verify smart sorting...")
            mock_user = student
            response = await client.get(f"/classes/{classroom.id}/announcements/")
            assert response.status_code == 200
            announcements = response.json()
            assert len(announcements) == 4, f"Expected 4 announcements, got {len(announcements)}"

            # Expected sorting: Active pins first, then sort by created_at desc.
            # Active pins:
            # - Ann 3 (is_pinned=True, expires tomorrow) -> Created at T3
            # - Ann 2 (is_pinned=True, pinned_until=None) -> Created at T2
            # Active pins sorted desc: Ann 3 first, then Ann 2.
            # Regular/Expired pins:
            # - Ann 4 (is_pinned=True, expired yesterday) -> Created at T4
            # - Ann 1 (is_pinned=False) -> Created at T1
            # Regular sorted desc: Ann 4 first, then Ann 1.
            # Total order: Ann 3, Ann 2, Ann 4, Ann 1
            print("Returned order of IDs:")
            for item in announcements:
                print(f" - Content: {item['content']} (Pinned: {item['is_pinned']}, Pinned Until: {item['pinned_until']})")

            assert announcements[0]["id"] == ann3["id"], "First announcement should be Announcement 3"
            assert announcements[1]["id"] == ann2["id"], "Second announcement should be Announcement 2"
            assert announcements[2]["id"] == ann4["id"], "Third announcement should be Announcement 4"
            assert announcements[3]["id"] == ann1["id"], "Fourth announcement should be Announcement 1"
            print("Passed Smart Sorting Verification!")

            # --- TEST 4: Delete Announcement ---
            print("\nTest 4.1: Student trying to delete announcement (Should fail with 403)...")
            mock_user = student
            response = await client.delete(f"/classes/{classroom.id}/announcements/{ann3['id']}")
            assert response.status_code == 403
            print("Passed!")

            print("\nTest 4.2: Teacher deleting announcement (Should succeed with 204)...")
            mock_user = teacher
            response = await client.delete(f"/classes/{classroom.id}/announcements/{ann3['id']}")
            assert response.status_code == 204
            print("Passed!")

            # Verify deletion
            mock_user = student
            response = await client.get(f"/classes/{classroom.id}/announcements/")
            announcements = response.json()
            assert len(announcements) == 3, f"Expected 3 announcements, got {len(announcements)}"
            assert all(item["id"] != ann3["id"] for item in announcements)
            print("Passed deletion verification!")

        # 5. Clean up created resources from DB
        print("\nCleaning up test resources...")
        # Clean up announcements explicitly (ondelete cascade handles it, but let's be clean)
        await db.execute(select(Announcement).where(Announcement.class_id == classroom.id))
        await db.commit()

        await db.delete(enrollment)
        await db.delete(classroom)
        await db.delete(teacher)
        await db.delete(student)
        await db.delete(unrelated_student)
        await db.commit()
        print("Database cleaned successfully!")
        print("\n--- ALL TESTS PASSED SUCCESSFULLY! ---")


if __name__ == "__main__":
    asyncio.run(main())
