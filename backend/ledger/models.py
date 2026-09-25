from django.db import models
from django.contrib.auth.hashers import (
    make_password,
    check_password
)


# =========================================================
# USER ACCOUNT
# =========================================================

class UserAccount(models.Model):

    name = models.CharField(
        max_length=100
    )

    email = models.EmailField(
        unique=True
    )

    password = models.CharField(
        max_length=128
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )


    # Django/DRF authentication compatibility
    @property
    def is_authenticated(self):

        return True


    @property
    def is_anonymous(self):

        return False


    # Hash password before saving
    def set_password(self, raw_password):

        self.password = make_password(
            raw_password
        )


    # Check entered password
    def check_password(self, raw_password):

        return check_password(
            raw_password,
            self.password
        )


    def __str__(self):

        return self.email


# =========================================================
# CUSTOMER
# =========================================================

class Customer(models.Model):

    user = models.ForeignKey(
        UserAccount,
        on_delete=models.CASCADE,
        related_name="customers"
    )

    name = models.CharField(
        max_length=100
    )

    phone = models.CharField(
        max_length=15
    )

    email = models.EmailField(
        blank=True
    )

    address = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )


    def __str__(self):

        return self.name


# =========================================================
# LOAN
# =========================================================

class Loan(models.Model):

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="loans"
    )

    loan_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    interest_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )

    duration_months = models.PositiveIntegerField()

    start_date = models.DateField()

    due_date = models.DateField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )


    def __str__(self):

        return (
            f"{self.customer.name} - "
            f"{self.loan_amount}"
        )


# =========================================================
# PAYMENT
# =========================================================

class Payment(models.Model):

    loan = models.ForeignKey(
        Loan,
        on_delete=models.CASCADE,
        related_name="payments"
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    payment_date = models.DateField()

    notes = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )


    def __str__(self):

        return (
            f"{self.loan.customer.name} - "
            f"{self.amount}"
        )
# =========================================================
# PASSWORD RESET TOKEN
# =========================================================

class PasswordResetToken(models.Model):

    user = models.ForeignKey(
        UserAccount,
        on_delete=models.CASCADE,
        related_name="password_reset_tokens"
    )

    token = models.CharField(
        max_length=128,
        unique=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    expires_at = models.DateTimeField()

    used = models.BooleanField(
        default=False
    )


    def __str__(self):

        return self.user.email