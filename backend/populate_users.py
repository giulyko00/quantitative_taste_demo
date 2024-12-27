from main import User, SessionLocal

# Crea una sessione del database
db = SessionLocal()

# Aggiungi un utente mock
user = User(email="test@example.com", password="12345", name="Giulio")

# Aggiungi l'utente al database
db.add(user)

# Conferma le modifiche
db.commit()

# Chiudi la sessione
db.close()
