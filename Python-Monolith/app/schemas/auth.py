from pydantic import BaseModel, Field, field_validator

class LoginRequest(BaseModel):
    username: str = Field(..., min_length=1, description="Логин не может быть пустым")
    password: str = Field(..., min_length=1, description="Пароль не может быть пустым")
    
    @field_validator('username')
    @classmethod
    def username_must_not_be_whitespace(cls, v):
        if v.strip() == "":
            raise ValueError('Логин не может быть пустым или содержать только пробелы')
        return v
    
    @field_validator('password')
    @classmethod
    def password_must_not_be_whitespace(cls, v):
        if v.strip() == "":
            raise ValueError('Пароль не может быть пустым или содержать только пробелы')
        return v

class LoginResponse(BaseModel):
    access_token: str

class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    middle_name: str
    username: str
    password: str
    group_name: str

class RegisterResponse(BaseModel):
    access_token: str
    role: str