// ==========================================
// Rating Factor Tables
// ==========================================

// Age-based factor for auto insurance
export function getAgeFactor(dob: string): number {
  const age = calculateAge(dob)
  if (age < 18) return 2.0
  if (age < 21) return 1.65
  if (age < 25) return 1.45
  if (age < 30) return 1.15
  if (age <= 65) return 1.0
  if (age <= 75) return 1.15
  return 1.35
}

export function calculateAge(dob: string): number {
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

// Vehicle age factor
export function getVehicleAgeFactor(year: string): number {
  const vehicleAge = new Date().getFullYear() - parseInt(year || "2020")
  if (vehicleAge <= 1) return 1.25
  if (vehicleAge <= 3) return 1.15
  if (vehicleAge <= 5) return 1.05
  if (vehicleAge <= 10) return 1.0
  if (vehicleAge <= 15) return 0.9
  return 0.8
}

// Mileage factor
export function getMileageFactor(mileage: string): number {
  const m = parseInt(mileage || "12000")
  if (m < 5000) return 0.85
  if (m < 8000) return 0.9
  if (m < 12000) return 1.0
  if (m < 15000) return 1.05
  if (m < 20000) return 1.15
  return 1.25
}

// Driving record factor
export function getDrivingRecordFactor(
  accidents: string,
  violations: string
): number {
  const acc = parseInt(accidents || "0")
  const viol = parseInt(violations || "0")
  let factor = 1.0
  factor += acc * 0.25
  factor += viol * 0.12
  return factor
}

// License status factor
export function getLicenseStatusFactor(
  status: string
): number {
  switch (status) {
    case "valid": return 1.0
    case "permit": return 1.5
    case "suspended": return 2.5
    case "revoked": return 3.0
    default: return 1.0
  }
}

// Years driving factor
export function getYearsDrivingFactor(years: string): number {
  const y = parseInt(years || "5")
  if (y < 1) return 1.6
  if (y < 3) return 1.3
  if (y < 5) return 1.1
  if (y <= 10) return 1.0
  return 0.95
}

// Liability limit multiplier
export function getLiabilityMultiplier(limit: string): number {
  switch (limit) {
    case "25/50": return 0.8
    case "50/100": return 1.0
    case "100/300": return 1.25
    case "250/500": return 1.55
    default: return 1.0
  }
}

// Deductible factor (lower deductible = higher premium)
export function getDeductibleFactor(deductible: string): number {
  switch (deductible) {
    case "250": return 1.2
    case "500": return 1.0
    case "1000": return 0.85
    case "2000": return 0.7
    default: return 1.0
  }
}

// State geographic factor
export function getStateFactor(state: string): number {
  const highCost: Record<string, number> = {
    MI: 1.45, FL: 1.35, LA: 1.3, NY: 1.25, NJ: 1.25,
    CA: 1.2, TX: 1.15, GA: 1.1, DC: 1.2, CT: 1.15,
  }
  const lowCost: Record<string, number> = {
    ME: 0.8, VT: 0.82, NH: 0.82, IA: 0.85, ID: 0.85,
    OH: 0.88, WI: 0.88, NC: 0.9, VA: 0.9, IN: 0.9,
  }
  return highCost[state] || lowCost[state] || 1.0
}

// Auto discount factor
export function getAutoDiscountFactor(discounts: {
  multiCar: boolean
  homeownerBundle: boolean
  goodDriver: boolean
  safetyDevice: boolean
}): number {
  let factor = 1.0
  if (discounts.multiCar) factor -= 0.05
  if (discounts.homeownerBundle) factor -= 0.1
  if (discounts.goodDriver) factor -= 0.08
  if (discounts.safetyDevice) factor -= 0.03
  return Math.max(factor, 0.7)
}

// --- Homeowners Factors ---

export function getPolicyTypeFactor(type: string): number {
  switch (type) {
    case "HO3": return 1.0
    case "HO4": return 0.3
    case "HO6": return 0.5
    default: return 1.0
  }
}

export function getYearBuiltFactor(yearBuilt: string): number {
  const year = parseInt(yearBuilt || "2000")
  if (year < 1960) return 1.45
  if (year < 1980) return 1.3
  if (year < 2000) return 1.1
  if (year < 2010) return 1.0
  return 0.95
}

export function getRoofFactor(roofType: string, roofAge: string): number {
  const age = parseInt(roofAge || "10")
  let typeFactor = 1.0
  switch (roofType) {
    case "asphalt": typeFactor = 1.0; break
    case "tile": typeFactor = 0.9; break
    case "metal": typeFactor = 0.85; break
    case "slate": typeFactor = 0.8; break
  }
  let ageFactor = 1.0
  if (age > 20) ageFactor = 1.4
  else if (age > 15) ageFactor = 1.25
  else if (age > 10) ageFactor = 1.1
  return typeFactor * ageFactor
}

export function getConstructionFactor(type: string): number {
  switch (type) {
    case "frame": return 1.0
    case "masonry": return 0.9
    case "steel": return 0.85
    default: return 1.0
  }
}

export function getPropertyRiskFactor(pool: boolean, trampoline: boolean): number {
  let factor = 1.0
  if (pool) factor += 0.08
  if (trampoline) factor += 0.05
  return factor
}

export function getHomeClaimsFactor(claims: string): number {
  const c = parseInt(claims || "0")
  if (c === 0) return 1.0
  if (c === 1) return 1.2
  if (c === 2) return 1.45
  return 1.45 + (c - 2) * 0.2
}

export function getHomeDiscountFactor(discounts: {
  multiPolicy: boolean
  protectiveDevices: boolean
  claimsFree: boolean
}): number {
  let factor = 1.0
  if (discounts.multiPolicy) factor -= 0.1
  if (discounts.protectiveDevices) factor -= 0.05
  if (discounts.claimsFree) factor -= 0.08
  return Math.max(factor, 0.7)
}

export function getDwellingMultiplier(dwelling: string): number {
  const d = parseInt(dwelling || "250000")
  return d / 250000
}

export function getLiabilityHomeFactor(liability: string): number {
  switch (liability) {
    case "100000": return 1.0
    case "300000": return 1.15
    case "500000": return 1.3
    default: return 1.0
  }
}
