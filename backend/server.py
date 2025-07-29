from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from models import (
    Chemical, ChemicalCreate, ChemicalResponse,
    CalculationRequest, CalculationResult, CalculationResponse
)
from database import (
    seed_chemicals, get_all_chemicals, get_chemical_by_id,
    save_calculation, get_calculations
)
from typing import List

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Molarity Calculator API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Startup event to seed database
@app.on_event("startup")
async def startup_event():
    await seed_chemicals()

@api_router.get("/")
async def root():
    return {"message": "Molarity Calculator API is running"}

@api_router.get("/chemicals", response_model=List[ChemicalResponse])
async def get_chemicals():
    """Get all available chemicals"""
    try:
        chemicals = await get_all_chemicals()
        return [ChemicalResponse(**chemical) for chemical in chemicals]
    except Exception as e:
        logging.error(f"Error getting chemicals: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving chemicals")

@api_router.get("/chemicals/{chemical_id}", response_model=ChemicalResponse)
async def get_chemical(chemical_id: str):
    """Get specific chemical by ID"""
    try:
        chemical = await get_chemical_by_id(chemical_id)
        if not chemical:
            raise HTTPException(status_code=404, detail="Chemical not found")
        return ChemicalResponse(**chemical)
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error getting chemical {chemical_id}: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving chemical")

@api_router.post("/calculate", response_model=CalculationResponse)
async def calculate_molarity(request: CalculationRequest):
    """Calculate molarity and save result"""
    try:
        # Validate input
        if request.mass <= 0:
            raise HTTPException(status_code=400, detail="Mass must be greater than 0")
        if request.volume <= 0:
            raise HTTPException(status_code=400, detail="Volume must be greater than 0")
        if request.volume_unit not in ["L", "mL"]:
            raise HTTPException(status_code=400, detail="Volume unit must be 'L' or 'mL'")
        
        # Get molar mass
        molar_mass = None
        chemical_name = "Chất tùy chỉnh"
        
        if request.chemical_id:
            chemical = await get_chemical_by_id(request.chemical_id)
            if not chemical:
                raise HTTPException(status_code=404, detail="Chemical not found")
            molar_mass = chemical["molar_mass"]
            chemical_name = chemical["name"]
        elif request.custom_molar_mass:
            if request.custom_molar_mass <= 0:
                raise HTTPException(status_code=400, detail="Custom molar mass must be greater than 0")
            molar_mass = request.custom_molar_mass
        else:
            raise HTTPException(status_code=400, detail="Either chemical_id or custom_molar_mass must be provided")
        
        # Convert volume to liters
        volume_in_liters = request.volume if request.volume_unit == "L" else request.volume / 1000
        
        # Calculate molarity
        moles = request.mass / molar_mass
        molarity = moles / volume_in_liters
        
        # Create calculation result
        calculation = CalculationResult(
            chemical_id=request.chemical_id,
            chemical_name=chemical_name,
            custom_molar_mass=request.custom_molar_mass,
            mass=request.mass,
            volume=request.volume,
            volume_unit=request.volume_unit,
            volume_in_liters=volume_in_liters,
            molar_mass=molar_mass,
            moles=moles,
            molarity=molarity
        )
        
        # Save to database
        await save_calculation(calculation.dict())
        
        # Return response
        return CalculationResponse(
            id=calculation.id,
            chemical_name=calculation.chemical_name,
            mass=calculation.mass,
            volume=calculation.volume,
            volume_unit=calculation.volume_unit,
            volume_in_liters=calculation.volume_in_liters,
            molar_mass=calculation.molar_mass,
            moles=calculation.moles,
            molarity=calculation.molarity,
            created_at=calculation.created_at
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error calculating molarity: {e}")
        raise HTTPException(status_code=500, detail="Error calculating molarity")

@api_router.get("/calculations", response_model=List[CalculationResponse])
async def get_calculation_history(limit: int = 50):
    """Get calculation history"""
    try:
        if limit > 100:
            limit = 100  # Maximum limit
        
        calculations = await get_calculations(limit)
        return [
            CalculationResponse(
                id=calc.get("id", ""),
                chemical_name=calc.get("chemical_name", ""),
                mass=calc.get("mass", 0),
                volume=calc.get("volume", 0),
                volume_unit=calc.get("volume_unit", "L"),
                volume_in_liters=calc.get("volume_in_liters", 0),
                molar_mass=calc.get("molar_mass", 0),
                moles=calc.get("moles", 0),
                molarity=calc.get("molarity", 0),
                created_at=calc.get("created_at")
            )
            for calc in calculations
        ]
    except Exception as e:
        logging.error(f"Error getting calculations: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving calculations")

@api_router.delete("/calculations")
async def clear_calculation_history():
    """Clear all calculation history"""
    try:
        result = await db.calculations.delete_many({})
        return {"message": f"Cleared {result.deleted_count} calculations"}
    except Exception as e:
        logging.error(f"Error clearing calculations: {e}")
        raise HTTPException(status_code=500, detail="Error clearing calculations")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()