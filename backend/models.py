from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class Chemical(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    formula: str
    molar_mass: float
    category: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ChemicalCreate(BaseModel):
    name: str
    formula: str
    molar_mass: float
    category: str

class ChemicalResponse(BaseModel):
    id: str
    name: str
    formula: str
    molar_mass: float
    category: str

class CalculationRequest(BaseModel):
    chemical_id: Optional[str] = None
    custom_molar_mass: Optional[float] = None
    mass: float
    volume: float
    volume_unit: str  # "L" or "mL"

class CalculationResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    chemical_id: Optional[str] = None
    chemical_name: str
    custom_molar_mass: Optional[float] = None
    mass: float  # grams
    volume: float  # original volume
    volume_unit: str  # "L" or "mL"
    volume_in_liters: float  # converted to liters
    molar_mass: float  # g/mol
    moles: float  # mol
    molarity: float  # M
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CalculationResponse(BaseModel):
    id: str
    chemical_name: str
    mass: float
    volume: float
    volume_unit: str
    volume_in_liters: float
    molar_mass: float
    moles: float
    molarity: float
    created_at: datetime