from django.test import TestCase
from rest_framework.test import APIClient

from .models import UserAccount


class AuthApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = UserAccount.objects.create(
            name="Alice Example",
            email="alice@example.com",
        )
        self.user.set_password("secret123")
        self.user.save()

    def test_login_success_returns_user_details(self):
        response = self.client.post(
            "/api/auth/login/",
            {"email": "alice@example.com", "password": "secret123"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Login successful")
        self.assertEqual(response.data["user"]["email"], "alice@example.com")

    def test_protected_customer_endpoint_accepts_valid_jwt(self):
        login_response = self.client.post(
            "/api/auth/login/",
            {"email": "alice@example.com", "password": "secret123"},
            format="json",
        )

        self.assertEqual(login_response.status_code, 200)

        token = login_response.data["tokens"]["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        response = self.client.get("/api/customers/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])
