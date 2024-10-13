import json
import re
import base64

from app.errors import *
from app.errors import InvalidFileFormatError


class ApiRequestValidator:
    """
    Class for validating parameters and collecting errors.

    Attributes:
        errors (list): A list of collected error instances.
    """
    def __init__(self):
        """Initializes the ApiRequestValidator with an empty error list."""
        self.errors = []

    def add_parameter_error(self, message, param):
        """Add a parameter error to the error list.

        Args:
            message (str): A descriptive error message.
            param (str): The name of the parameter that caused the error.
        """
        error = ParameterError(message, param)
        self.errors.append(error)

    def add_invalid_credentials_error(self, message=None):
        if message is None:
            message = "Invalid credentials."                
        error = InvalidCredentialsError(message)
        self.errors.append(error)

    def add_expired_refresh_token_error(self, message=None):
        if message is None:
            message = "Refresh token is invalid or has expired."                
        error = ExpiredRefreshTokenError(message)
        self.errors.append(error)

    def ensure_value_provided(self, param_name, param_value, message=None):
        """Check if a required parameter value is provided; if not, log an error.

        Args:
            param_name (str): The name of the parameter to check.
            param_value (Any): The value of the parameter to validate.
            message (str, optional): A custom error message. If None, a default message will be used.

        Returns:
            bool: False if the parameter is missing and an error is logged; True otherwise.
        """
        if param_value is None:
            if message is None:
                message = f"'{param_name}' is required."
            self.add_parameter_error(message, param_name)
            return False
        return True
    
    def ensure_is_string(self, param_name, value, message=None):
        """Ensure the provided value is a string; if not, log an error unless the value is None.

        Args:
            param_name (str): The name of the parameter to check.
            value (Any): The value to validate as a string.
            message (str, optional): Custom error message if value is not a string. Defaults to None.

        Returns:
            bool: False if the value is not a string (and not None) and an error is logged; True otherwise.
        """
        if value is not None and not isinstance(value, str):
            if message is None:
                message = f"'{param_name}' must be a string."
            self.add_parameter_error(message, param_name)
            return False
        return True
    
    def ensure_string_max_length(self, param_name, value, max_length, message=None):
        """Ensure the provided value is a string that does not exceed the maximum length; if not, log an error unless the value is None.

        Args:
            param_name (str): The name of the parameter to check.
            value (Any): The value to validate as a string.
            max_length (int): The maximum allowed length for the string.
            message (str, optional): Custom error message if the string exceeds the maximum length. Defaults to None.

        Returns:
            bool: False if the value is a string that exceeds the maximum length and an error is logged; True otherwise.
        """
        if isinstance(value, str) and len(value) > max_length:
            if message is None:
                message = f"'{param_name}' must not exceed {max_length} characters."
            self.add_parameter_error(message, param_name)
            return False
        return True
    
    def validate_email(self, email):
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if re.match(email_regex, email):
            return True
        return False

    def ensure_email_format(self, param_name, email, message=None):
        """Ensure the provided parameter is a valid email address; if not, log an error.

        Args:
            param_name (str): The name of the parameter to check.
            email (str): The email address to validate.
            message (str, optional): A custom error message. If None, a default message will be used.

        Returns:
            bool: False if the email is invalid and an error is logged; True otherwise.
        """
        if not self.validate_email(email):
            self.add_parameter_error("The email address is not valid.", param_name)
            return False
        return True

    def add_invalid_file_format_error(self, param_name, expected_file_types: set[str]):
        """Add an invalid file format error to the error list.

        Args:
            param (str): The name of the parameter that caused the error.
            expected_file_types (set[str]): A set of strings listing the expected file types.
        """
        message = f"The file format for '{param_name}' is unknown."

        if expected_file_types:
            formats_list = ', '.join(expected_file_types)
            message = message + f"  Only the following file formats are allowed: {formats_list}."

        error = InvalidFileFormatError(message, param_name)
        self.errors.append(error)


    def add_invalid_json_data(self, param_name, message=None):
        """Add an invalid JSON format error to the error list.

        Args:
            param (str): The name of the parameter that caused the error.
            message (str): A descriptive error message.
        """
        if message is None:
            message = f"The data provided is not properly formatted JSON."

        error = InvalidJsonFormatError(message, param_name)
        self.errors.append(error)




    def ensure_is_float(self, param_name, value, message=None):
        """Ensure the provided value is a float; if not, log an error unless the value is None.

        Args:
            param_name (str): The name of the parameter to check.
            value (Any): The value to validate as a float.
            message (str, optional): Custom error message if value is not a float. Defaults to None.

        Returns:
            bool: False if the value is not a float (and not None) and an error is logged; True otherwise.
        """
        if value is not None:
            try:
                number = float(value)
                return True
            except (ValueError, TypeError):
                self.add_parameter_error(f"'{param_name}' must be a float.", param_name)
                return False
        return True
    
    def ensure_is_int(self, param_name, value, message=None):
        """Ensure the provided value is an integer; if not, log an error unless the value is None.

        Args:
            param_name (str): The name of the parameter to check.
            value (Any): The value to validate as an integer.
            message (str, optional): Custom error message if value is not an integer. Defaults to None.

        Returns:
            bool: False if the value is not an integer (and not None) and an error is logged; True otherwise.
        """
        if value is not None:
            try:
                number = int(value)
                return True
            except (ValueError, TypeError):
                # Use the custom message if provided, otherwise a default one
                error_message = message or f"'{param_name}' must be an integer."
                self.add_parameter_error(error_message, param_name)
                return False
        return True
    
    def ensure_positive_value(self, param_name, value):
        """Ensure the provided parameter is a positive numeric; if not, log an error.

        Args:
            param_name (str): The name of the parameter to check.
            value (any): The value to validate as a positive numeric.

        Returns:
            bool: False if the value is zero or negative and an error is logged; True otherwise.
        """
        try:
            number = float(value)
            if number > 0:
                return True
            else:
                self.add_parameter_error(f"'{param_name}' must be a positive number, received {value}.", param_name)
                return False
        except (ValueError, TypeError):
            self.add_parameter_error(f"'{param_name}' must be a float.", param_name)
            return False
    
    def ensure_base64_format(self, param_name, value):
        """Ensure the provided parameter is a valid base-64 encoded string; if not, log an error.

        Args:
            param_name (str): The name of the parameter to check.
            value (str): The value to validate as a base-64 string.

        Returns:
            bool: False if the value is not a valid base-64 string and an error is logged; True otherwise.
        """
        try:
            # Attempt to decode the value to check if it's valid base-64
            if value is None or value == '':
                self.add_parameter_error(f"'{param_name}' cannot be empty.", param_name)
                return False
            base64.b64decode(value, validate=True)
        except (ValueError, TypeError):
            self.add_parameter_error("The value provided is not a valid base-64 string.", param_name)
            return False
        return True
    
    def get_error_count(self):
        """Return the total number of errors logged by the validator.

        Returns:
            int: The total number of errors logged by the validator.
        """
        return len(self.errors)

    def get_error_object(self):
        """Return the error object as a JSON string.

        Returns:
            str: A JSON string representation of the collected errors.
        """
        error_object = {
            "error-count": len(self.errors),
            "errors": [error.to_dict() for error in self.errors]
        }
        return error_object