from email_validator import validate_email, EmailNotValidError


def is_valid_email(email):
    try:
        validate_email(email)
        return True
    except EmailNotValidError:
        return False


def is_strong_password(password):
    """
    Minimum Requirements:
    - At least 8 characters
    """

    return len(password) >= 8