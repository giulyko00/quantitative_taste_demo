from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import jwt
import time
from typing import List, Dict


app = FastAPI()

# Configura CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",  # Aggiungi questa riga
        "http://127.0.0.1:3001"   # Aggiungi questa riga
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock di "credenziali" di un utente
MOCK_USER_EMAIL = "test@example.com"
MOCK_USER_PASSWORD = "12345"

# Chiave segreta per firmare il JWT (in un progetto reale, tienila in .env)
SECRET_KEY = "MY_SUPER_SECRET_KEY"
ALGORITHM = "HS256"

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/login")
def login(req: LoginRequest):
    if req.email == MOCK_USER_EMAIL and req.password == MOCK_USER_PASSWORD:
        payload = {
            "sub": req.email,
            "exp": int(time.time()) + 3600  # Scadenza tra 1 ora
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        return {"access_token": token}
    else:
        raise HTTPException(status_code=401, detail="Credenziali non valide")

@app.get("/protected")
def protected_route(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    scheme, _, token = auth_header.partition(" ")
    if scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid auth scheme")

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token scaduto")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token non valido")

    return {"message": f"Benvenuto utente {decoded['sub']}"}

# Mock di dati
categories_data = [
    "Aziende AI",
    "Energia Rinnovabile",
    "Aziende Blockchain"
]

ideas_data = {
    "Aziende AI": [
        {
            "name": "Google Inc. - GOOGL",
            "description": "Leader nell'AI con un focus sulla trasformazione aziendale.",
            "performance": "+5% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/googl"
        },
        {
            "name": "Microsoft Corporation - MSFT",
            "description": "Impegnata nello sviluppo di AI conversazionale e cloud intelligente.",
            "performance": "+2% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/msft"
        },
        {
            "name": "NVIDIA - NVDA",
            "description": "Specializzata in GPU e piattaforme AI per data center e gaming.",
            "performance": "+8% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/nvda"
        },
        {
            "name": "IBM - IBM",
            "description": "AI aziendale con Watson e soluzioni per enterprise.",
            "performance": "+1% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/ibm"
        },
        {
            "name": "Amazon - AMZN",
            "description": "Tra i pionieri dell'AI con Alexa e servizi cloud AWS.",
            "performance": "+4% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/amzn"
        },
        {
            "name": "Baidu - BIDU",
            "description": "AI cinese e motore di ricerca, innovazione in autonomous driving.",
            "performance": "+7% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/bidu"
        },
        {
            "name": "Apple Inc. - AAPL",
            "description": "AI nei servizi Siri e integrazione hardware/software.",
            "performance": "+3.5% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/aapl"
        },
        {
            "name": "Adobe - ADBE",
            "description": "AI per design e contenuti, basata su piattaforme creative cloud.",
            "performance": "+2.7% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/adbe"
        },
        {
            "name": "Palantir - PLTR",
            "description": "Soluzioni di data analysis e AI per governi e grandi aziende.",
            "performance": "+6% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/pltr"
        },
        {
            "name": "Salesforce - CRM",
            "description": "AI per CRM e automazione dei processi di vendita e marketing.",
            "performance": "+5.5% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/crm"
        },
    ],
    "Energia Rinnovabile": [
        {
            "name": "Tesla Inc. - TSLA",
            "description": "Pioniere nel settore auto elettriche e solare.",
            "performance": "+3% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/tsla"
        },
        {
            "name": "Vestas Wind Systems - VWDRY",
            "description": "Specializzata in soluzioni eoliche in tutto il mondo.",
            "performance": "+1.5% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/vwdry"
        },
        {
            "name": "NextEra Energy - NEE",
            "description": "Leader americano nelle rinnovabili, specialmente solare ed eolico.",
            "performance": "+2.3% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/nee"
        },
        {
            "name": "First Solar - FSLR",
            "description": "Produce pannelli solari ad alta efficienza.",
            "performance": "+4% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/fslr"
        },
        {
            "name": "Enphase Energy - ENPH",
            "description": "Microinverter e soluzioni energetiche smart.",
            "performance": "+5.2% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/enph"
        },
        {
            "name": "Ørsted - ORSTED",
            "description": "Grandi impianti eolici offshore in Europa e nel mondo.",
            "performance": "+3.8% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/orsted"
        },
        {
            "name": "Brookfield Renewable Partners - BEP",
            "description": "Un portafoglio diversificato di energia idroelettrica e solare.",
            "performance": "+1.9% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/bep"
        },
        {
            "name": "Canadian Solar - CSIQ",
            "description": "Produzione di moduli solari e soluzioni di stoccaggio.",
            "performance": "+2.5% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/csiq"
        },
        {
            "name": "SunPower - SPWR",
            "description": "Fornisce soluzioni solari residenziali e commerciali.",
            "performance": "+2.1% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/spwr"
        },
        {
            "name": "Plug Power - PLUG",
            "description": "Focus sull'idrogeno verde e celle a combustibile.",
            "performance": "+4.4% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/plug"
        },
    ],
    "Aziende Blockchain": [
        {
            "name": "Coinbase Global - COIN",
            "description": "Piattaforma di scambio crypto leader negli Stati Uniti.",
            "performance": "+10% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/coin"
        },
        {
            "name": "MicroStrategy - MSTR",
            "description": "Ha investito massicciamente in Bitcoin come riserva di valore.",
            "performance": "+6% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/mstr"
        },
        {
            "name": "Riot Platforms - RIOT",
            "description": "Mining di Bitcoin su larga scala.",
            "performance": "+8.5% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/riot"
        },
        {
            "name": "Marathon Digital Holdings - MARA",
            "description": "Una delle più grandi operazioni di mining di Bitcoin.",
            "performance": "+9% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/mara"
        },
        {
            "name": "Hive Blockchain - HIVE",
            "description": "Mining di criptovalute con focus su energia green.",
            "performance": "+7% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/hive"
        },
        {
            "name": "Hut 8 Mining - HUT",
            "description": "Azienda canadese di mining con focus su sostenibilità.",
            "performance": "+5.5% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/hut"
        },
        {
            "name": "Bitfarms - BITF",
            "description": "Mining globale di Bitcoin, con operazioni in Nord e Sud America.",
            "performance": "+4.2% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/bitf"
        },
        {
            "name": "Block Inc. (ex Square) - SQ",
            "description": "Servizi di pagamento con integrazioni crypto.",
            "performance": "+3% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/sq"
        },
        {
            "name": "Galaxy Digital - GLXY",
            "description": "Società di gestione fondi incentrata su criptovalute e blockchain.",
            "performance": "+6.7% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/glxy"
        },
        {
            "name": "PayPal Holdings - PYPL",
            "description": "Offre servizi di pagamento e supporto per transazioni in criptovalute.",
            "performance": "+1.8% nell'ultimo mese",
            "chartLink": "https://placeholder.com/chart/pypl"
        },
    ]
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
    if category not in ideas_data:
        raise HTTPException(status_code=404, detail="Categoria non trovata.")
    return ideas_data[category]
