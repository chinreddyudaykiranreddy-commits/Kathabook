from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed

from .models import UserAccount


class CustomJWTAuthentication(JWTAuthentication):

    def get_user(self, validated_token):
        user_id = validated_token.get("user_id")

        if not user_id:
            raise AuthenticationFailed(
                "Token does not contain user information"
            )

        try:
            user = UserAccount.objects.get(id=user_id)
        except UserAccount.DoesNotExist:
            raise AuthenticationFailed(
                "User not found"
            )

        return user