# CRUD de proyectos
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.routes.auth import get_current_active_user

router = APIRouter()


@router.get("/", response_model=List[schemas.Project])
def get_projects(
    skip: int = 0,
    limit: int = 100,
    featured: bool = None,
    db: Session = Depends(get_db),
):
    """Obtener todos los proyectos (público)"""
    query = db.query(models.Project)

    if featured is not None:
        query = query.filter(models.Project.is_featured == featured)

    projects = query.offset(skip).limit(limit).all()
    return projects


@router.get("/{project_id}", response_model=schemas.Project)
def get_project(project_id: int, db: Session = Depends(get_db)):
    """Obtener un proyecto específico (público)"""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return project


@router.post(
    "/",
    response_model=schemas.Project,
    status_code=status.HTTP_201_CREATED,
)
def create_project(
    project: schemas.ProjectCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """Crear un nuevo proyecto (requiere autenticación)"""
    db_project = models.Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


@router.put("/{project_id}", response_model=schemas.Project)
def update_project(
    project_id: int,
    project_update: schemas.ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """Actualizar un proyecto (requiere autenticación)"""
    db_project = (
        db.query(models.Project).filter(models.Project.id == project_id).first()
    )
    if db_project is None:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    # Actualizar solo los campos proporcionados
    update_data = project_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_project, field, value)

    db.commit()
    db.refresh(db_project)
    return db_project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    """Eliminar un proyecto (requiere autenticación)"""
    db_project = (
        db.query(models.Project).filter(models.Project.id == project_id).first()
    )
    if db_project is None:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    db.delete(db_project)
    db.commit()
    return None
