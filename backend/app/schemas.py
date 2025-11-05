from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr


# Schemas de Usuario
class UserBase(BaseModel):
    email: EmailStr
    username: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# Schemas de Media
class MediaBase(BaseModel):
    file_name: str
    file_type: str
    mime_type: str


class MediaCreate(MediaBase):
    file_path: str
    project_id: int


class Media(MediaBase):
    id: int
    file_path: str
    project_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Schemas de Project
class ProjectBase(BaseModel):
    title: str
    description: str
    technologies: List[str]
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    is_featured: bool = False


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    technologies: Optional[List[str]] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    is_featured: Optional[bool] = None


class Project(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime
    media: List[Media] = []

    class Config:
        from_attributes = True


# Schemas de Contact
class ContactBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    twitter: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None


class ContactCreate(ContactBase):
    pass


class ContactUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    twitter: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None


class Contact(ContactBase):
    id: int
    updated_at: datetime

    class Config:
        from_attributes = True
