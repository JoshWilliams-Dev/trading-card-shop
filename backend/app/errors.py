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
    


class ParameterError(BaseError):
    """
    Error type for parameter-related issues.

    Attributes:
        param (str): The name of the parameter that caused the error.
    """
    def __init__(self, message, param):
        super().__init__(code=1, message=message)
        self.param = param

    def to_dict(self):
        error_dict = super().to_dict()
        error_dict["param"] = self.param
        return error_dict