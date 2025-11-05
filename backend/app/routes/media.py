import os
import shutil
from typing import List
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.routes.auth import get_current_active_user

router = APIRouter()

UPLOAD_DIR = "uploads"
ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]
ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"]
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB


def save_upload_file(upload_file: UploadFile, destination: str):
    """Guardar archivo subido"""
    with open(destination, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)


def get_file_type(mime_type: str) -> str:
    """Determinar el tipo de archivo"""
    if mime_type in ALLOWED_IMAGE_TYPES:
        return "image"
    elif mime_type in ALLOWED_VIDEO_TYPES:
        return "video"
    return "unknown"


@router.post("/upload/{project_id}", response_model=List[schemas.Media])
async def upload_files(
    project_id: int,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """Subir archivos (imágenes o videos) a un proyecto"""
    # Verificar que el proyecto existe
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    # Crear directorio para el proyecto si no existe
    project_dir = os.path.join(UPLOAD_DIR, f"project_{project_id}")
    os.makedirs(project_dir, exist_ok=True)

    uploaded_media = []

    for file in files:
        # Validar tipo de archivo
        file_type = get_file_type(file.content_type)
        if file_type == "unknown":
            raise HTTPException(
                status_code=400,
                detail=f"Tipo de archivo no permitido: {file.content_type}",
            )

        # Generar nombre único para el archivo
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid4()}{file_extension}"
        file_path = os.path.join(project_dir, unique_filename)

        # Guardar archivo
        save_upload_file(file, file_path)

        # Crear registro en base de datos
        db_media = models.Media(
            project_id=project_id,
            file_path=file_path,
            file_name=file.filename,
            file_type=file_type,
            mime_type=file.content_type,
        )
        db.add(db_media)
        db.commit()
        db.refresh(db_media)
        uploaded_media.append(db_media)

    return uploaded_media


@router.get("/{media_id}", response_model=schemas.Media)
def get_media(media_id: int, db: Session = Depends(get_db)):
    """Obtener información de un archivo"""
    media = db.query(models.Media).filter(models.Media.id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    return media


@router.delete("/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_media(
    media_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """Eliminar un archivo"""
    media = db.query(models.Media).filter(models.Media.id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")

    # Eliminar archivo físico
    if os.path.exists(media.file_path):
        os.remove(media.file_path)

    # Eliminar registro de base de datos
    db.delete(media)
    db.commit()
    return None


@router.get("/project/{project_id}", response_model=List[schemas.Media])
def get_project_media(project_id: int, db: Session = Depends(get_db)):
    """Obtener todos los archivos de un proyecto"""
    media_list = (
        db.query(models.Media).filter(models.Media.project_id == project_id).all()
    )
    return media_list
