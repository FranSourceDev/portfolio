from typing import List, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app import models
from app.database import get_db

router = APIRouter()


class ChatMessage(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str
    suggestions: Optional[List[str]] = None


def get_contact_info(db: Session):
    """Obtener información de contacto"""
    return db.query(models.Contact).first()


def get_featured_projects(db: Session):
    """Obtener proyectos destacados"""
    return (
        db.query(models.Project)
        .filter(models.Project.is_featured == True)
        .limit(3)
        .all()
    )


def get_all_technologies(db: Session):
    """Obtener todas las tecnologías únicas"""
    projects = db.query(models.Project).all()
    technologies = set()
    for project in projects:
        if project.technologies:
            technologies.update(project.technologies)
    return list(technologies)


def match_intent(message: str) -> str:
    """Detectar la intención del usuario"""
    message = message.lower()

    # Patrones de intención
    if any(
        word in message
        for word in ["contacto", "email", "correo", "mail", "contactar", "escribir"]
    ):
        return "contact"

    if any(
        word in message
        for word in ["teléfono", "telefono", "celular", "llamar", "número"]
    ):
        return "phone"

    if any(word in message for word in ["linkedin", "red social", "redes"]):
        return "social"

    if any(word in message for word in ["github", "código", "repositorio", "repos"]):
        return "github"

    if any(
        word in message
        for word in ["ubicación", "ubicacion", "lugar", "donde", "ciudad"]
    ):
        return "location"

    if any(
        word in message
        for word in ["proyecto", "proyectos", "trabajo", "trabajos", "portfolio"]
    ):
        return "projects"

    if any(
        word in message
        for word in [
            "tecnología",
            "tecnologia",
            "tecnologías",
            "stack",
            "herramientas",
            "lenguaje",
        ]
    ):
        return "technologies"

    if any(
        word in message
        for word in ["experiencia", "sobre ti", "quien eres", "bio", "acerca"]
    ):
        return "about"

    if any(
        word in message
        for word in ["hola", "holi", "buenos días", "buenas tardes", "hey", "saludos"]
    ):
        return "greeting"

    if any(
        word in message
        for word in ["ayuda", "opciones", "puedes", "qué puedes", "comandos"]
    ):
        return "help"

    return "unknown"


@router.post("/", response_model=ChatResponse)
async def chat(message: ChatMessage, db: Session = Depends(get_db)):
    """Endpoint del chatbot"""

    intent = match_intent(message.message)
    contact = get_contact_info(db)

    # Respuestas según la intención
    if intent == "greeting":
        return ChatResponse(
            response=f"¡Hola! 👋 Soy el asistente virtual de {contact.name if contact else 'este portafolio'}. Estoy aquí para ayudarte. ¿Qué te gustaría saber?",
            suggestions=[
                "¿Cómo puedo contactarte?",
                "Muéstrame tus proyectos",
                "¿Qué tecnologías usas?",
            ],
        )

    elif intent == "contact":
        if not contact:
            return ChatResponse(
                response="Lo siento, no hay información de contacto disponible."
            )

        response = f"📧 Puedes contactarme por email: {contact.email}"
        if contact.phone:
            response += f"\n📱 O llamarme al: {contact.phone}"

        return ChatResponse(
            response=response,
            suggestions=[
                "Ver redes sociales",
                "¿Dónde te encuentras?",
                "Ver proyectos",
            ],
        )

    elif intent == "phone":
        if not contact or not contact.phone:
            return ChatResponse(
                response="Lo siento, no hay número de teléfono disponible. Pero puedes escribirme a: "
                + (contact.email if contact else "mi email")
            )

        return ChatResponse(
            response=f"📱 Puedes llamarme al: {contact.phone}",
            suggestions=["Ver email", "Ver LinkedIn"],
        )

    elif intent == "social":
        if not contact:
            return ChatResponse(
                response="Lo siento, no hay información de redes sociales disponible."
            )

        socials = []
        if contact.linkedin:
            socials.append(f"💼 LinkedIn: {contact.linkedin}")
        if contact.github:
            socials.append(f"💻 GitHub: {contact.github}")
        if contact.twitter:
            socials.append(f"🐦 Twitter: {contact.twitter}")

        if not socials:
            return ChatResponse(response="No hay redes sociales configuradas aún.")

        return ChatResponse(
            response="Mis redes sociales:\n" + "\n".join(socials),
            suggestions=["Ver proyectos", "¿Cómo contactarte?"],
        )

    elif intent == "github":
        if not contact or not contact.github:
            return ChatResponse(
                response="Lo siento, no hay enlace de GitHub disponible."
            )

        return ChatResponse(
            response=f"💻 Puedes ver mi código en GitHub: {contact.github}",
            suggestions=["Ver proyectos", "¿Qué tecnologías usas?"],
        )

    elif intent == "location":
        if not contact or not contact.location:
            return ChatResponse(
                response="Lo siento, no hay información de ubicación disponible."
            )

        return ChatResponse(
            response=f"📍 Me encuentro en: {contact.location}",
            suggestions=["¿Cómo contactarte?", "Ver proyectos"],
        )

    elif intent == "projects":
        projects = get_featured_projects(db)

        if not projects:
            return ChatResponse(response="Aún no hay proyectos disponibles.")

        response = "🚀 Estos son algunos de mis proyectos destacados:\n\n"
        for project in projects:
            response += f"• **{project.title}**\n"
            response += f"  {project.description[:100]}...\n"
            if project.demo_url:
                response += f"  🔗 Demo: {project.demo_url}\n"
            response += "\n"

        return ChatResponse(
            response=response,
            suggestions=["¿Qué tecnologías usas?", "¿Cómo contactarte?"],
        )

    elif intent == "technologies":
        technologies = get_all_technologies(db)

        if not technologies:
            return ChatResponse(
                response="No hay información de tecnologías disponible."
            )

        tech_list = ", ".join(technologies[:10])  # Primeras 10

        return ChatResponse(
            response=f"💻 Trabajo con estas tecnologías: {tech_list}"
            + (" y más!" if len(technologies) > 10 else ""),
            suggestions=["Ver proyectos", "¿Cómo contactarte?"],
        )

    elif intent == "about":
        if not contact or not contact.bio:
            return ChatResponse(
                response="No hay información biográfica disponible aún."
            )

        return ChatResponse(
            response=f"👨‍💻 Sobre mí:\n{contact.bio}",
            suggestions=[
                "Ver proyectos",
                "¿Cómo contactarte?",
                "¿Qué tecnologías usas?",
            ],
        )

    elif intent == "help":
        return ChatResponse(
            response="🤖 Puedo ayudarte con:\n• Información de contacto\n• Proyectos y portfolio\n• Tecnologías que uso\n• Redes sociales\n• Ubicación\n\n¿Qué te gustaría saber?",
            suggestions=[
                "¿Cómo contactarte?",
                "Muéstrame tus proyectos",
                "¿Qué tecnologías usas?",
            ],
        )

    else:
        return ChatResponse(
            response="🤔 No estoy seguro de entender tu pregunta. ¿Podrías reformularla? O elige una de las opciones sugeridas.",
            suggestions=[
                "¿Cómo puedo contactarte?",
                "Muéstrame tus proyectos",
                "Ver ayuda",
            ],
        )


@router.get("/suggestions", response_model=List[str])
async def get_suggestions():
    """Obtener sugerencias iniciales"""
    return [
        "¿Cómo puedo contactarte?",
        "Muéstrame tus proyectos",
        "¿Qué tecnologías usas?",
        "¿Dónde te encuentras?",
        "Ver tus redes sociales",
    ]
