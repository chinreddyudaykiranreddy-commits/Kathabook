
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    register,
    login,
    forgot_password,
    reset_password,
    CustomerViewSet,
    LoanViewSet,
    PaymentViewSet,
)

router = DefaultRouter()

router.register(
    "customers",
    CustomerViewSet,
    basename="customer"
)

router.register(
    "loans",
    LoanViewSet,
    basename="loan"
)

router.register(
    "payments",
    PaymentViewSet,
    basename="payment"
)

urlpatterns = [
    path(
        "auth/register/",
        register,
        name="register"
    ),

    path(
        "auth/login/",
        login,
        name="login"
    ),

    path(
        "auth/forgot-password/",
        forgot_password,
        name="forgot_password"
    ),

    path(
        "auth/reset-password/",
        reset_password,
        name="reset_password"
    ),

    path(
        "",
        include(router.urls)
    ),
]

