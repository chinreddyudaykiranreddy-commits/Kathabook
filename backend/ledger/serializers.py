from decimal import Decimal
from rest_framework import serializers
from .models import UserAccount, Customer, Loan, Payment


class UserAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ["id", "name", "email", "created_at"]


class CustomerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer
        fields = [
            "id",
            "user",
            "name",
            "phone",
            "email",
            "address",
            "created_at",
        ]

        read_only_fields = [
            "user",
        ]


class LoanSerializer(serializers.ModelSerializer):
    total_interest = serializers.SerializerMethodField()
    total_payable = serializers.SerializerMethodField()
    total_paid = serializers.SerializerMethodField()
    pending_balance = serializers.SerializerMethodField()

    class Meta:
        model = Loan
        fields = [
            "id",
            "customer",
            "loan_amount",
            "interest_rate",
            "duration_months",
            "start_date",
            "due_date",
            "created_at",
            "total_interest",
            "total_payable",
            "total_paid",
            "pending_balance",
        ]

    def get_total_interest(self, obj):
        interest = (
            obj.loan_amount * obj.interest_rate / Decimal("100")
        )

        return interest.quantize(Decimal("0.01"))

    def get_total_payable(self, obj):
        total = obj.loan_amount + self.get_total_interest(obj)

        return total.quantize(Decimal("0.01"))

    def get_total_paid(self, obj):
        total = sum(
            (payment.amount for payment in obj.payments.all()),
            Decimal("0")
        )

        return total.quantize(Decimal("0.01"))

    def get_pending_balance(self, obj):
        pending = (
            self.get_total_payable(obj)
            - self.get_total_paid(obj)
        )

        if pending < Decimal("0.00"):
            pending = Decimal("0.00")

        return pending.quantize(Decimal("0.01"))


class PaymentSerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(
        source="loan.customer.name",
        read_only=True
    )

    class Meta:
        model = Payment

        fields = [
            "id",
            "loan",
            "customer_name",
            "amount",
            "payment_date",
            "notes",
            "created_at",
        ]

    def validate_amount(self, value):

        if value <= 0:
            raise serializers.ValidationError(
                "Payment amount must be greater than zero."
            )

        return value