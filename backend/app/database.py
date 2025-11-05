import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

# Para desarrollo usa SQLite, para producción PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./portfolio.db")

# Si usas PostgreSQL, el formato sería:
# DATABASE_URL = "postgresql://usuario:password@localhost/portfolio_db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# Dependencia para obtener la sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
