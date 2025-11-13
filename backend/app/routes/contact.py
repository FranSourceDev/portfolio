# Información de contacto
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.routes.auth import get_current_active_user

router = APIRouter()


@router.get("/", response_model=schemas.Contact)
def get_contact_info(db: Session = Depends(get_db)):
    """Obtener información de contacto (público)"""
    contact = db.query(models.Contact).first()
    if not contact:
        raise HTTPException(
            status_code=404, detail="Información de contacto no encontrada"
        )
    return contact


@router.post(
    "/",
    response_model=schemas.Contact,
    status_code=status.HTTP_201_CREATED,
)
def create_contact_info(
    contact: schemas.ContactCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """Crear información de contacto (requiere autenticación)"""
    # Verificar si ya existe información de contacto
    existing_contact = db.query(models.Contact).first()
    if existing_contact:
        raise HTTPException(
            status_code=400,
            detail="La información de contacto ya existe. Use PUT para actualizar.",
        )

    db_contact = models.Contact(**contact.dict())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact


@router.put("/", response_model=schemas.Contact)
def update_contact_info(
    contact_update: schemas.ContactUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """Actualizar información de contacto (requiere autenticación)"""
    db_contact = db.query(models.Contact).first()
    if not db_contact:
        raise HTTPException(
            status_code=404, detail="Información de contacto no encontrada"
        )

    # Actualizar solo los campos proporcionados
    update_data = contact_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_contact, field, value)

    db.commit()
    db.refresh(db_contact)
    return db_contact
