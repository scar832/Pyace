import asyncio
import uuid
from datetime import datetime, timedelta, timezone
from httpx import AsyncClient, ASGITransport

from app.main import app
from app.database.session import SessionLocal
from app.core.deps import get_current_user
from app.models.user import User, UserRole
from app.models.classroom import Class, ClassEnrollment, EnrollmentRole
from app.models.assignment import Assignment


# Dynamic mock user to be returned by get_current_user dependency override
mock_user = None

async def override_get_current_user():
    if mock_user is None:
        raise Exception("Mock user is not set in test")
    return mock_user


app.dependency_overrides[get_current_user] = override_get_current_user


async def main():
    async with SessionLocal() as db:
        print("--- RUNNING ASSIGNMENT VERIFICATION SCRIPT ---")

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

        # Use ASGITransport for testing FastAPI app
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://testserver") as client:
            global mock_user

            # --- TEST 1: Create Assignment (Unauthorized) ---
            print("\nTest 1.1: Student trying to create assignment (Should fail with 403)...")
            mock_user = student
            response = await client.post(
                f"/classes/{classroom.id}/assignments/",
                json={
                    "title": "Homework 1",
                    "description": "Solve problems 1 to 5",
                    "due_date": (datetime.now(timezone.utc) + timedelta(days=2)).isoformat(),
                    "max_score": 100,
                    "is_published": True
                }
            )
            assert response.status_code == 403, f"Expected 403, got {response.status_code}: {response.text}"
            print("Passed!")

            # --- TEST 2: Create Assignment (Authorized Teacher) ---
            print("\nTest 2.1: Teacher creating draft assignment...")
            mock_user = teacher
            due_date_draft = datetime.now(timezone.utc) + timedelta(days=5)
            response = await client.post(
                f"/classes/{classroom.id}/assignments/",
                json={
                    "title": "Draft Lab Assignment",
                    "description": "Internal test draft",
                    "due_date": due_date_draft.isoformat(),
                    "max_score": 50,
                    "is_published": False
                }
            )
            assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
            draft_assignment = response.json()
            print(f"Passed! Created Draft Assignment ID: {draft_assignment['id']}")

            print("\nTest 2.2: Teacher creating published assignment...")
            due_date_pub = datetime.now(timezone.utc) + timedelta(days=1)
            response = await client.post(
                f"/classes/{classroom.id}/assignments/",
                json={
                    "title": "Final Exam Prep",
                    "description": "Submit before due date",
                    "due_date": due_date_pub.isoformat(),
                    "max_score": 100,
                    "is_published": True
                }
            )
            assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
            pub_assignment = response.json()
            print(f"Passed! Created Published Assignment ID: {pub_assignment['id']}")

            # --- TEST 3: List Assignments (Access Control & Ordering) ---
            print("\nTest 3.1: Teacher listing assignments (should see both draft & pub)...")
            mock_user = teacher
            response = await client.get(f"/classes/{classroom.id}/assignments/")
            assert response.status_code == 200
            assignments = response.json()
            assert len(assignments) == 2, f"Expected 2 assignments, got {len(assignments)}"
            # Verify sorted by due date ascending: pub (1 day) should come before draft (5 days)
            assert assignments[0]["id"] == pub_assignment["id"]
            assert assignments[1]["id"] == draft_assignment["id"]
            print("Passed!")

            print("\nTest 3.2: Enrolled student listing assignments (should ONLY see published)...")
            mock_user = student
            response = await client.get(f"/classes/{classroom.id}/assignments/")
            assert response.status_code == 200
            assignments = response.json()
            assert len(assignments) == 1, f"Expected 1 assignment, got {len(assignments)}"
            assert assignments[0]["id"] == pub_assignment["id"]
            print("Passed!")

            print("\nTest 3.3: Unenrolled student listing assignments (should fail with 403)...")
            mock_user = unrelated_student
            response = await client.get(f"/classes/{classroom.id}/assignments/")
            assert response.status_code == 403
            print("Passed!")

            # --- TEST 4: Delete Assignment ---
            print("\nTest 4.1: Student trying to delete assignment (Should fail with 403)...")
            mock_user = student
            response = await client.delete(f"/classes/{classroom.id}/assignments/{pub_assignment['id']}")
            assert response.status_code == 403
            print("Passed!")

            print("\nTest 4.2: Teacher deleting assignment (Should succeed with 204)...")
            mock_user = teacher
            response = await client.delete(f"/classes/{classroom.id}/assignments/{pub_assignment['id']}")
            assert response.status_code == 204
            print("Passed!")

            # Verify deletion
            response = await client.get(f"/classes/{classroom.id}/assignments/")
            assignments = response.json()
            # Enrolled student should see 0 now (since only draft remains, which is hidden)
            mock_user = student
            response = await client.get(f"/classes/{classroom.id}/assignments/")
            assert len(response.json()) == 0
            print("Passed deletion verification!")

        # 5. Clean up created resources from DB
        print("\nCleaning up test resources...")
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
