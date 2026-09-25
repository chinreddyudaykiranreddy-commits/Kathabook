
from datetime import timedelta
import secrets

from django.utils import timezone

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    UserAccount,
    Customer,
    Loan,
    Payment,
    PasswordResetToken,
)

from .serializers import (
    CustomerSerializer,
    LoanSerializer,
    PaymentSerializer,
)


# =========================================================
# JWT TOKEN FUNCTION
# =========================================================

def get_tokens_for_user(user):

    refresh = RefreshToken()

    # Store custom user information inside JWT
    refresh["user_id"] = user.id
    refresh["email"] = user.email
    refresh["name"] = user.name

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


# =========================================================
# REGISTER
# =========================================================

@api_view(["POST"])
def register(request):

    # Get data from React
    name = request.data.get("name")
    email = request.data.get("email")
    password = request.data.get("password")

    # Remove extra spaces
    if name:
        name = name.strip()

    if email:
        email = email.strip().lower()

    # Check required fields
    if not name or not email or not password:

        return Response(
            {
                "message": "All fields are required"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Password validation
    if len(password) < 6:

        return Response(
            {
                "message": (
                    "Password must contain at least 6 characters"
                )
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check whether email already exists
    if UserAccount.objects.filter(
        email=email
    ).exists():

        return Response(
            {
                "message": "Email already exists"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Create user
    user = UserAccount(
        name=name,
        email=email
    )

    # Hash password
    user.set_password(password)

    # Save user
    user.save()

    return Response(
        {
            "message": "Account created successfully",

            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            }
        },
        status=status.HTTP_201_CREATED
    )


# =========================================================
# LOGIN
# =========================================================

@api_view(["POST"])
def login(request):

    # Get login data
    email = request.data.get("email")
    password = request.data.get("password")

    # Clean email
    if email:
        email = email.strip().lower()

    # Check required fields
    if not email or not password:

        return Response(
            {
                "message": "Email and password are required"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Find user
    try:

        user = UserAccount.objects.get(
            email=email
        )

    except UserAccount.DoesNotExist:

        return Response(
            {
                "message": "Invalid email or password"
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Check password
    if not user.check_password(password):

        return Response(
            {
                "message": "Invalid email or password"
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Create JWT tokens
    tokens = get_tokens_for_user(user)

    return Response(
        {
            "message": "Login successful",

            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            },

            "tokens": tokens
        },
        status=status.HTTP_200_OK
    )


# =========================================================
# FORGOT PASSWORD
# =========================================================

@api_view(["POST"])
def forgot_password(request):

    # Get email from React
    email = request.data.get("email")

    # Clean email
    if email:
        email = email.strip().lower()

    # Check email
    if not email:

        return Response(
            {
                "message": "Email is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Find user
    try:

        user = UserAccount.objects.get(
            email=email
        )

    except UserAccount.DoesNotExist:

        return Response(
            {
                "message": "Email address is not registered."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # Disable previous unused reset tokens
    PasswordResetToken.objects.filter(
        user=user,
        used=False
    ).update(
        used=True
    )

    # Generate secure random token
    token = secrets.token_urlsafe(64)

    # Token expires after 15 minutes
    expires_at = (
        timezone.now()
        + timedelta(minutes=15)
    )

    # Save reset token
    PasswordResetToken.objects.create(
        user=user,
        token=token,
        expires_at=expires_at
    )

    # IMPORTANT:
    #
    # No Gmail
    # No email
    # No Django terminal
    #
    # The token is sent directly to React.
    # React will navigate to the Reset Password page.

    return Response(
        {
            "message": "Email verified successfully.",
            "token": token
        },
        status=status.HTTP_200_OK
    )


# =========================================================
# RESET PASSWORD
# =========================================================

@api_view(["POST"])
def reset_password(request):

    # Get data from React
    token = request.data.get("token")
    password = request.data.get("password")

    # Check token
    if not token:

        return Response(
            {
                "message": "Reset session is missing."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check password
    if not password:

        return Response(
            {
                "message": "Password is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Password validation
    if len(password) < 6:

        return Response(
            {
                "message": (
                    "Password must contain at least 6 characters."
                )
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Find reset token
    try:

        reset_token = PasswordResetToken.objects.get(
            token=token
        )

    except PasswordResetToken.DoesNotExist:

        return Response(
            {
                "message": "Invalid reset session."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check whether token was already used
    if reset_token.used:

        return Response(
            {
                "message": (
                    "This reset session has already been used."
                )
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check token expiration
    if timezone.now() > reset_token.expires_at:

        reset_token.used = True

        reset_token.save(
            update_fields=["used"]
        )

        return Response(
            {
                "message": (
                    "This reset session has expired."
                )
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Get user
    user = reset_token.user

    # Hash new password
    user.set_password(password)

    # Save new password
    user.save(
        update_fields=["password"]
    )

    # Mark reset token as used
    reset_token.used = True

    reset_token.save(
        update_fields=["used"]
    )

    return Response(
        {
            "message": (
                "Password changed successfully. "
                "You can now login with your new password."
            )
        },
        status=status.HTTP_200_OK
    )


# =========================================================
# CUSTOMER VIEWSET
# =========================================================

class CustomerViewSet(viewsets.ModelViewSet):

    serializer_class = CustomerSerializer

    permission_classes = [
        IsAuthenticated
    ]

    # -----------------------------------------------------
    # GET CUSTOMERS
    # -----------------------------------------------------

    def get_queryset(self):

        return Customer.objects.filter(
            user=self.request.user
        ).order_by(
            "-created_at"
        )

    # -----------------------------------------------------
    # CREATE CUSTOMER
    # -----------------------------------------------------

    def perform_create(self, serializer):

        serializer.save(
            user=self.request.user
        )

    # -----------------------------------------------------
    # UPDATE CUSTOMER
    # -----------------------------------------------------

    def perform_update(self, serializer):

        serializer.save(
            user=self.request.user
        )


# =========================================================
# LOAN VIEWSET
# =========================================================

class LoanViewSet(viewsets.ModelViewSet):

    serializer_class = LoanSerializer

    permission_classes = [
        IsAuthenticated
    ]

    # -----------------------------------------------------
    # GET LOANS
    # -----------------------------------------------------

    def get_queryset(self):

        return Loan.objects.filter(
            customer__user=self.request.user
        ).prefetch_related(
            "payments"
        ).order_by(
            "-created_at"
        )

    # -----------------------------------------------------
    # CREATE LOAN
    # -----------------------------------------------------

    def perform_create(self, serializer):

        customer = serializer.validated_data[
            "customer"
        ]

        # Make sure customer belongs
        # to current user
        if customer.user != self.request.user:

            raise PermissionDenied(
                "You cannot create a loan for another user's customer."
            )

        serializer.save()

    # -----------------------------------------------------
    # UPDATE LOAN
    # -----------------------------------------------------

    def perform_update(self, serializer):

        customer = serializer.validated_data.get(
            "customer"
        )

        # If customer is changed,
        # verify ownership
        if customer:

            if customer.user != self.request.user:

                raise PermissionDenied(
                    "You cannot update a loan for another user's customer."
                )

        serializer.save()


# =========================================================
# PAYMENT VIEWSET
# =========================================================

class PaymentViewSet(viewsets.ModelViewSet):

    serializer_class = PaymentSerializer

    permission_classes = [
        IsAuthenticated
    ]

    # -----------------------------------------------------
    # GET PAYMENTS
    # -----------------------------------------------------

    def get_queryset(self):

        return Payment.objects.filter(
            loan__customer__user=self.request.user
        ).select_related(
            "loan",
            "loan__customer"
        ).order_by(
            "-payment_date"
        )

    # -----------------------------------------------------
    # CREATE PAYMENT
    # -----------------------------------------------------

    def perform_create(self, serializer):

        loan = serializer.validated_data[
            "loan"
        ]

        # Make sure loan belongs
        # to current user
        if loan.customer.user != self.request.user:

            raise PermissionDenied(
                "You cannot add a payment for another user's loan."
            )

        serializer.save()

    # -----------------------------------------------------
    # UPDATE PAYMENT
    # -----------------------------------------------------

    def perform_update(self, serializer):

        loan = serializer.validated_data.get(
            "loan"
        )

        # If loan is changed,
        # verify ownership
        if loan:

            if loan.customer.user != self.request.user:

                raise PermissionDenied(
                    "You cannot update a payment for another user's loan."
                )

        serializer.save()
