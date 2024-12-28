from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import jwt


# Configura il database
DATABASE_URL = "sqlite:///./test.db"  # Usa SQLite per semplicità
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modello utente
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    name = Column(String)

Base.metadata.create_all(bind=engine)

# Dipendenza di database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# App FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modello per richieste di login
class LoginRequest(BaseModel):
    email: str
    password: str

# Endpoint per il login
@app.post("/login")
def login(req: LoginRequest, db: SessionLocal = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or user.password != req.password:
        raise HTTPException(status_code=401, detail="Credenziali non valide")

    # Genera token JWT
    payload = {"sub": user.email, "name": user.name}
    token = jwt.encode(payload, "MY_SUPER_SECRET_KEY", algorithm="HS256")
    return {"access_token": token}

# Endpoint per recuperare i dettagli utente
@app.get("/user/me")
def get_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    scheme, _, token = auth_header.partition(" ")
    if scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid auth scheme")

    try:
        decoded = jwt.decode(token, "MY_SUPER_SECRET_KEY", algorithms=["HS256"])
        return {"email": decoded["sub"], "name": decoded["name"]}
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token non valido")

@app.get("/protected")
def protected_route(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    scheme, _, token = auth_header.partition(" ")
    if scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid auth scheme")

    try:
        decoded = jwt.decode(token, "MY_SUPER_SECRET_KEY", algorithms=["HS256"])
        print(f"Decoded token: {decoded}")  # Aggiungi logging
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token scaduto")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token non valido")

    return {"message": f"Benvenuto utente {decoded['sub']}"}


# Mock di dati
categories_data = [
    {"id": 1, "name": "Aziende AI"},
    {"id": 2, "name": "Energia Rinnovabile"},
    {"id": 3, "name": "Aziende Blockchain"}
]

category_icons = {
    1: {"name": "Aziende AI", "icon": "Bot"},
    2: {"name": "Energia Rinnovabile", "icon": "Leaf"},
    3: {"name": "Aziende Blockchain", "icon": "Bitcoin"},
}


ideas_data = {
    1: [  # Aziende AI
        {
            "id": 1,
            "name": "Google Inc. - GOOGL",
            "description": "Leader nell'AI con un focus sulla trasformazione aziendale.",
            "performance": "+5% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/googl",
        },
        {
            "id": 2,
            "name": "Microsoft Corporation - MSFT",
            "description": "Impegnata nello sviluppo di AI conversazionale e cloud intelligente.",
            "performance": "+2% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/msft",
        },
        {
            "id": 3,
            "name": "NVIDIA - NVDA",
            "description": "Specializzata in GPU e piattaforme AI per data center e gaming.",
            "performance": "+8% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/nvda",
        },
        {
            "id": 4,
            "name": "IBM - IBM",
            "description": "AI aziendale con Watson e soluzioni per enterprise.",
            "performance": "+1% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/ibm",
        },
        {
            "id": 5,
            "name": "Amazon - AMZN",
            "description": "Tra i pionieri dell'AI con Alexa e servizi cloud AWS.",
            "performance": "+4% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/amzn",
        },
        {
            "id": 6,
            "name": "Baidu - BIDU",
            "description": "AI cinese e motore di ricerca, innovazione in autonomous driving.",
            "performance": "+7% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/bidu",
        },
        {
            "id": 7,
            "name": "Apple Inc. - AAPL",
            "description": "AI nei servizi Siri e integrazione hardware/software.",
            "performance": "+3.5% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/aapl",
        },
        {
            "id": 8,
            "name": "Adobe - ADBE",
            "description": "AI per design e contenuti, basata su piattaforme creative cloud.",
            "performance": "+2.7% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/adbe",
        },
        {
            "id": 9,
            "name": "Palantir - PLTR",
            "description": "Soluzioni di data analysis e AI per governi e grandi aziende.",
            "performance": "+6% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/pltr",
        },
        {
            "id": 10,
            "name": "Salesforce - CRM",
            "description": "AI per CRM e automazione dei processi di vendita e marketing.",
            "performance": "+5.5% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/crm",
        },
    ],
    2: [  # Energia Rinnovabile
        {
            "id": 1,
            "name": "Tesla Inc. - TSLA",
            "description": "Pioniere nel settore auto elettriche e solare.",
            "performance": "+3% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/tsla",
        },
        {
            "id": 2,
            "name": "Vestas Wind Systems - VWDRY",
            "description": "Specializzata in soluzioni eoliche in tutto il mondo.",
            "performance": "+1.5% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/vwdry",
        },
        {
            "id": 3,
            "name": "NextEra Energy - NEE",
            "description": "Leader americano nelle rinnovabili, specialmente solare ed eolico.",
            "performance": "+2.3% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/nee",
        },
        {
            "id": 4,
            "name": "First Solar - FSLR",
            "description": "Produce pannelli solari ad alta efficienza.",
            "performance": "+4% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/fslr",
        },
        {
            "id": 5,
            "name": "Enphase Energy - ENPH",
            "description": "Microinverter e soluzioni energetiche smart.",
            "performance": "+5.2% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/enph",
        },
        {
            "id": 6,
            "name": "Ørsted - ORSTED",
            "description": "Grandi impianti eolici offshore in Europa e nel mondo.",
            "performance": "+3.8% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/orsted",
        },
        {
            "id": 7,
            "name": "Brookfield Renewable Partners - BEP",
            "description": "Un portafoglio diversificato di energia idroelettrica e solare.",
            "performance": "+1.9% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/bep",
        },
        {
            "id": 8,
            "name": "Canadian Solar - CSIQ",
            "description": "Produzione di moduli solari e soluzioni di stoccaggio.",
            "performance": "+2.5% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/csiq",
        },
        {
            "id": 9,
            "name": "SunPower - SPWR",
            "description": "Fornisce soluzioni solari residenziali e commerciali.",
            "performance": "+2.1% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/spwr",
        },
        {
            "id": 10,
            "name": "Plug Power - PLUG",
            "description": "Focus sull'idrogeno verde e celle a combustibile.",
            "performance": "+4.4% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/plug",
        },
    ],
    3: [  # Aziende Blockchain
        {
            "id": 1,
            "name": "Coinbase Global - COIN",
            "description": "Piattaforma di scambio crypto leader negli Stati Uniti.",
            "performance": "+10% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/coin",
        },
        {
            "id": 2,
            "name": "MicroStrategy - MSTR",
            "description": "Ha investito massicciamente in Bitcoin come riserva di valore.",
            "performance": "+6% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/mstr",
        },
        {
            "id": 3,
            "name": "Riot Platforms - RIOT",
            "description": "Mining di Bitcoin su larga scala.",
            "performance": "+8.5% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/riot",
        },
        {
            "id": 4,
            "name": "Marathon Digital Holdings - MARA",
            "description": "Una delle più grandi operazioni di mining di Bitcoin.",
            "performance": "+9% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/mara",
        },
        {
            "id": 5,
            "name": "Hive Blockchain - HIVE",
            "description": "Mining di criptovalute con focus su energia green.",
            "performance": "+7% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/hive",
        },
        {
            "id": 6,
            "name": "Hut 8 Mining - HUT",
            "description": "Azienda canadese di mining con focus su sostenibilità.",
            "performance": "+5.5% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/hut",
        },
        {
            "id": 7,
            "name": "Bitfarms - BITF",
            "description": "Mining globale di Bitcoin, con operazioni in Nord e Sud America.",
            "performance": "+4.2% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/bitf",
        },
        {
            "id": 8,
            "name": "Block Inc. (ex Square) - SQ",
            "description": "Servizi di pagamento con integrazioni crypto.",
            "performance": "+3% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/sq",
        },
        {
            "id": 9,
            "name": "Galaxy Digital - GLXY",
            "description": "Società di gestione fondi incentrata su criptovalute e blockchain.",
            "performance": "+6.7% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/glxy",
        },
        {
            "id": 10,
            "name": "PayPal Holdings - PYPL",
            "description": "Offre servizi di pagamento e supporto per transazioni in criptovalute.",
            "performance": "+1.8% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/pypl",
        },
    ],
}


@app.get("/")
def read_root():
    """
    Endpoint root per evitare un 404 generico.
    """
    return {"message": "Benvenuto nell'API Investing Ideas!"}

@app.get("/categories")
def get_categories() -> List[str]:
    return categories_data

@app.get("/ideas/{category}")
def get_ideas_by_category(category: str) -> List[Dict]:
    def slugify(text):
        return text.lower().replace(" ", "-")
    
    # Normalizza la categoria richiesta
    slugified_category = slugify(category)

    # Normalizza le categorie nel backend
    backend_categories = {slugify(cat): cat for cat in ideas_data.keys()}

    if slugified_category not in backend_categories:
        raise HTTPException(status_code=404, detail="Categoria non trovata.")
    
    original_category = backend_categories[slugified_category]
    return ideas_data[original_category]

@app.get("/categories-with-ideas")
def get_categories_with_ideas() -> List[Dict]:
    """
    Restituisce le categorie con le relative idee e icone in una struttura nidificata,
    spostando il nome e l'icona della categoria a livello superiore.
    """
    return [
        {
            "id": category_id,
            "name": category_icons[category_id]["name"],  # Nome della categoria
            "icon": category_icons[category_id]["icon"],  # Icona della categoria
            "items": [
                {
                    "id": idea["id"],  # ID dell'idea
                    "title": idea["name"],  # Nome dell'idea
                    "url": idea["chartLink"],  # URL dell'idea
                }
                for idea in ideas
            ],
        }
        for category_id, ideas in ideas_data.items()
    ]


# Aggiungi questo endpoint al tuo main.py

@app.get("/ideas/{category_id}/{idea_id}")
def get_idea_detail(category_id: int, idea_id: int) -> Dict:
    if category_id not in ideas_data:
        raise HTTPException(status_code=404, detail="Categoria non trovata.")
    
    for idea in ideas_data[category_id]:
        if idea["id"] == idea_id:
            return idea
    raise HTTPException(status_code=404, detail="Idea non trovata.")
