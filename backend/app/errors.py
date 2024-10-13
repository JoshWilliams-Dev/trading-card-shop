import json
import re



class BaseError:
    """
    Base class for all error types.

    Attributes:
        code (int): The error code.
        message (str): A descriptive error message.
    """
    def __init__(self, code, message):
        self.code = code
        self.message = message

    def to_dict(self):
        return {
            "code": self.code,
            "message": self.message
        }
    


class InternalServerError(BaseError):
    """
    Error type for internal server errors.
    """
    def __init__(self, message):
        super().__init__(code=1, message=message)

    def to_dict(self):
        error_dict = super().to_dict()
        return error_dict
    


class ParameterError(BaseError):
    """
    Error type for parameter-related issues.

    Attributes:
        param (str): The name of the parameter that caused the error.
    """
    def __init__(self, message, param, code=2):
        super().__init__(code, message=message)
        self.param = param

    def to_dict(self):
        error_dict = super().to_dict()
        error_dict["param"] = self.param
        return error_dict
    


class InvalidCredentialsError(BaseError):
    
    def __init__(self, message):
        super().__init__(code=3, message=message)

    def to_dict(self):
        error_dict = super().to_dict()
        return error_dict
    


class ExpiredRefreshTokenError(BaseError):    
    def __init__(self, message):
        super().__init__(code=4, message=message)

    def to_dict(self):
        error_dict = super().to_dict()
        return error_dict
    


class InvalidFileFormatError(ParameterError):    
    def __init__(self, message, param):
        super().__init__(message=message, param=param, code=5)

    def to_dict(self):
        error_dict = super().to_dict()
        return error_dict
    


class InvalidJsonFormatError(ParameterError):    
    def __init__(self, message, param):
        super().__init__(message=message, param=param, code=6)

    def to_dict(self):
        error_dict = super().to_dict()
        return error_dict