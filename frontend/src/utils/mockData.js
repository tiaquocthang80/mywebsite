// Mock data for common chemicals and their molar masses
export const chemicalDatabase = [
  {
    id: 'nacl',
    name: 'Natri Clorua (NaCl)',
    formula: 'NaCl',
    molarMass: 58.44,
    category: 'Muối'
  },
  {
    id: 'h2so4',
    name: 'Axit Sunfuric (H₂SO₄)',
    formula: 'H₂SO₄',
    molarMass: 98.08,
    category: 'Axit'
  },
  {
    id: 'naoh',
    name: 'Natri Hydroxide (NaOH)',
    formula: 'NaOH',
    molarMass: 40.00,
    category: 'Bazơ'
  },
  {
    id: 'hcl',
    name: 'Axit Clohidric (HCl)',
    formula: 'HCl',
    molarMass: 36.46,
    category: 'Axit'
  },
  {
    id: 'caco3',
    name: 'Canxi Carbonat (CaCO₃)',
    formula: 'CaCO₃',
    molarMass: 100.09,
    category: 'Muối'
  },
  {
    id: 'koh',
    name: 'Kali Hydroxide (KOH)',
    formula: 'KOH',
    molarMass: 56.11,
    category: 'Bazơ'
  },
  {
    id: 'h3po4',
    name: 'Axit Photphoric (H₃PO₄)',
    formula: 'H₃PO₄',
    molarMass: 97.99,
    category: 'Axit'
  },
  {
    id: 'na2co3',
    name: 'Natri Carbonat (Na₂CO₃)',
    formula: 'Na₂CO₃',
    molarMass: 105.99,
    category: 'Muối'
  },
  {
    id: 'mgso4',
    name: 'Magie Sulfat (MgSO₄)',
    formula: 'MgSO₄',
    molarMass: 120.37,
    category: 'Muối'
  },
  {
    id: 'glucose',
    name: 'Glucose (C₆H₁₂O₆)',
    formula: 'C₆H₁₂O₆',
    molarMass: 180.16,
    category: 'Hợp chất hữu cơ'
  },
  {
    id: 'sucrose',
    name: 'Sucrose (C₁₂H₂₂O₁₁)',
    formula: 'C₁₂H₂₂O₁₁',
    molarMass: 342.30,
    category: 'Hợp chất hữu cơ'
  },
  {
    id: 'kcl',
    name: 'Kali Clorua (KCl)',
    formula: 'KCl',
    molarMass: 74.55,
    category: 'Muối'
  },
  {
    id: 'nh4cl',
    name: 'Amoni Clorua (NH₄Cl)',
    formula: 'NH₄Cl',
    molarMass: 53.49,
    category: 'Muối'
  },
  {
    id: 'caso4',
    name: 'Canxi Sulfat (CaSO₄)',
    formula: 'CaSO₄',
    molarMass: 136.14,
    category: 'Muối'
  },
  {
    id: 'fe2o3',
    name: 'Sắt(III) Oxide (Fe₂O₃)',
    formula: 'Fe₂O₃',
    molarMass: 159.69,
    category: 'Oxide'
  },
  {
    id: 'al2o3',
    name: 'Nhôm Oxide (Al₂O₃)',
    formula: 'Al₂O₃',
    molarMass: 101.96,
    category: 'Oxide'
  },
  {
    id: 'h2o2',
    name: 'Hydrogen Peroxide (H₂O₂)',
    formula: 'H₂O₂',
    molarMass: 34.01,
    category: 'Peroxide'
  },
  {
    id: 'ch3cooh',
    name: 'Axit Acetic (CH₃COOH)',
    formula: 'CH₃COOH',
    molarMass: 60.05,
    category: 'Axit hữu cơ'
  },
  {
    id: 'bacl2',
    name: 'Bari Clorua (BaCl₂)',
    formula: 'BaCl₂',
    molarMass: 208.23,
    category: 'Muối'
  },
  {
    id: 'agno3',
    name: 'Bạc Nitrat (AgNO₃)',
    formula: 'AgNO₃',
    molarMass: 169.87,
    category: 'Muối'
  }
];

// Mock calculation history
export const mockCalculationHistory = [
  {
    id: 1,
    chemical: 'NaCl',
    mass: 5.84,
    volume: 1,
    volumeUnit: 'L',
    result: '0.1000',
    timestamp: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    chemical: 'H₂SO₄',
    mass: 9.81,
    volume: 500,
    volumeUnit: 'mL',
    result: '0.2000',
    timestamp: '2024-01-15 11:15:00'
  },
  {
    id: 3,
    chemical: 'NaOH',
    mass: 4.00,
    volume: 1,
    volumeUnit: 'L',
    result: '0.1000',
    timestamp: '2024-01-15 14:20:00'
  }
];