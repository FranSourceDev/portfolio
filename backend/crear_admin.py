from app.database import Base, SessionLocal, engine
from app.models import User
from passlib.context import CryptContext

# Configurar bcrypt correctamente
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)

# Crear tablas
print("Creando tablas...")
Base.metadata.create_all(bind=engine)

# Crear sesión
db = SessionLocal()

try:
    # Verificar si existe
    existing = db.query(User).filter(User.username == "admin").first()

    if existing:
        print("⚠️  El usuario admin ya existe")
        print(f"   Username: {existing.username}")
        print(f"   Email: {existing.email}")

        # Preguntar si quiere resetear
        respuesta = input("\n¿Resetear contraseña? (s/n): ")
        if respuesta.lower() == "s":
            existing.hashed_password = pwd_context.hash("admin123")
            db.commit()
            print("✅ Contraseña reseteada a: admin123")
    else:
        # Crear usuario nuevo
        admin = User(
            email="admin@portfolio.com",
            username="admin",
            hashed_password=pwd_context.hash("admin123"),
            is_active=True,
        )

        db.add(admin)
        db.commit()
        print("✅ Usuario administrador creado exitosamente")
        print("   Username: admin")
        print("   Password: admin123")
        print("   Email: admin@portfolio.com")

except Exception as e:
    print(f"❌ Error: {e}")
    import traceback

    traceback.print_exc()
    db.rollback()
finally:
    db.close()
