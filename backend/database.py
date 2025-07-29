from motor.motor_asyncio import AsyncIOMotorClient
import os
from typing import List

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
chemicals_collection = db.chemicals
calculations_collection = db.calculations

# Chemical database seed data
CHEMICAL_SEED_DATA = [
    {
        "id": "nacl",
        "name": "Natri Clorua (NaCl)",
        "formula": "NaCl",
        "molar_mass": 58.44,
        "category": "Muối"
    },
    {
        "id": "h2so4",
        "name": "Axit Sunfuric (H₂SO₄)",
        "formula": "H₂SO₄",
        "molar_mass": 98.08,
        "category": "Axit"
    },
    {
        "id": "naoh",
        "name": "Natri Hydroxide (NaOH)",
        "formula": "NaOH",
        "molar_mass": 40.00,
        "category": "Bazơ"
    },
    {
        "id": "hcl",
        "name": "Axit Clohidric (HCl)",
        "formula": "HCl",
        "molar_mass": 36.46,
        "category": "Axit"
    },
    {
        "id": "caco3",
        "name": "Canxi Carbonat (CaCO₃)",
        "formula": "CaCO₃",
        "molar_mass": 100.09,
        "category": "Muối"
    },
    {
        "id": "koh",
        "name": "Kali Hydroxide (KOH)",
        "formula": "KOH",
        "molar_mass": 56.11,
        "category": "Bazơ"
    },
    {
        "id": "h3po4",
        "name": "Axit Photphoric (H₃PO₄)",
        "formula": "H₃PO₄",
        "molar_mass": 97.99,
        "category": "Axit"
    },
    {
        "id": "na2co3",
        "name": "Natri Carbonat (Na₂CO₃)",
        "formula": "Na₂CO₃",
        "molar_mass": 105.99,
        "category": "Muối"
    },
    {
        "id": "mgso4",
        "name": "Magie Sulfat (MgSO₄)",
        "formula": "MgSO₄",
        "molar_mass": 120.37,
        "category": "Muối"
    },
    {
        "id": "glucose",
        "name": "Glucose (C₆H₁₂O₆)",
        "formula": "C₆H₁₂O₆",
        "molar_mass": 180.16,
        "category": "Hợp chất hữu cơ"
    },
    {
        "id": "sucrose",
        "name": "Sucrose (C₁₂H₂₂O₁₁)",
        "formula": "C₁₂H₂₂O₁₁",
        "molar_mass": 342.30,
        "category": "Hợp chất hữu cơ"
    },
    {
        "id": "kcl",
        "name": "Kali Clorua (KCl)",
        "formula": "KCl",
        "molar_mass": 74.55,
        "category": "Muối"
    },
    {
        "id": "nh4cl",
        "name": "Amoni Clorua (NH₄Cl)",
        "formula": "NH₄Cl",
        "molar_mass": 53.49,
        "category": "Muối"
    },
    {
        "id": "caso4",
        "name": "Canxi Sulfat (CaSO₄)",
        "formula": "CaSO₄",
        "molar_mass": 136.14,
        "category": "Muối"
    },
    {
        "id": "fe2o3",
        "name": "Sắt(III) Oxide (Fe₂O₃)",
        "formula": "Fe₂O₃",
        "molar_mass": 159.69,
        "category": "Oxide"
    },
    {
        "id": "al2o3",
        "name": "Nhôm Oxide (Al₂O₃)",
        "formula": "Al₂O₃",
        "molar_mass": 101.96,
        "category": "Oxide"
    },
    {
        "id": "h2o2",
        "name": "Hydrogen Peroxide (H₂O₂)",
        "formula": "H₂O₂",
        "molar_mass": 34.01,
        "category": "Peroxide"
    },
    {
        "id": "ch3cooh",
        "name": "Axit Acetic (CH₃COOH)",
        "formula": "CH₃COOH",
        "molar_mass": 60.05,
        "category": "Axit hữu cơ"
    },
    {
        "id": "bacl2",
        "name": "Bari Clorua (BaCl₂)",
        "formula": "BaCl₂",
        "molar_mass": 208.23,
        "category": "Muối"
    },
    {
        "id": "agno3",
        "name": "Bạc Nitrat (AgNO₃)",
        "formula": "AgNO₃",
        "molar_mass": 169.87,
        "category": "Muối"
    }
]

async def seed_chemicals():
    """Seed chemical database if empty"""
    try:
        count = await chemicals_collection.count_documents({})
        if count == 0:
            await chemicals_collection.insert_many(CHEMICAL_SEED_DATA)
            print(f"Seeded {len(CHEMICAL_SEED_DATA)} chemicals to database")
        else:
            print(f"Chemical database already has {count} records")
    except Exception as e:
        print(f"Error seeding chemicals: {e}")

async def get_all_chemicals() -> List[dict]:
    """Get all chemicals from database"""
    try:
        chemicals = await chemicals_collection.find({}).to_list(1000)
        return chemicals
    except Exception as e:
        print(f"Error getting chemicals: {e}")
        return []

async def get_chemical_by_id(chemical_id: str) -> dict:
    """Get chemical by ID"""
    try:
        chemical = await chemicals_collection.find_one({"id": chemical_id})
        return chemical
    except Exception as e:
        print(f"Error getting chemical {chemical_id}: {e}")
        return None

async def save_calculation(calculation: dict) -> str:
    """Save calculation result to database"""
    try:
        result = await calculations_collection.insert_one(calculation)
        return str(result.inserted_id)
    except Exception as e:
        print(f"Error saving calculation: {e}")
        return None

async def get_calculations(limit: int = 50) -> List[dict]:
    """Get calculation history"""
    try:
        calculations = await calculations_collection.find({}).sort("created_at", -1).limit(limit).to_list(limit)
        return calculations
    except Exception as e:
        print(f"Error getting calculations: {e}")
        return []