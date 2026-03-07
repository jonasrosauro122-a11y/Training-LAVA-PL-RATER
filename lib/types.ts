// ==========================================
// LAVA Training Rater - Core Type Definitions
// ==========================================

// --- Pre-Quote Form (Required before starting any quote) ---
export interface PreQuoteForm {
  id?: string
  vaName: string
  quoteDate: string
  trainer: "Nash/Aurelle" | "Kyle/Chanie" | ""
  teamLeader: "RJ" | "Martin" | "Ed" | "Rezyl" | ""
}

export const TRAINERS = [
  { value: "Nash/Aurelle", label: "Nash/Aurelle" },
  { value: "Kyle/Chanie", label: "Kyle/Chanie" },
] as const

export const TEAM_LEADERS = [
  { value: "RJ", label: "RJ" },
  { value: "Martin", label: "Martin" },
  { value: "Ed", label: "Ed" },
  { value: "Rezyl", label: "Rezyl" },
] as const

// --- Driver Info (enhanced) ---
export interface DriverInfo {
  id?: string
  isPrimary: boolean
  fullName: string
  dateOfBirth: string
  gender: "male" | "female" | "non-binary" | ""
  maritalStatus: "single" | "married" | "divorced" | "widowed" | ""
  licenseNumber: string
  licenseState: string
  licenseStatus: "valid" | "suspended" | "revoked" | "permit" | ""
  yearsDriving: string
  atFaultAccidents: string
  movingViolations: string
  sr22Required: boolean
  fr44Required: boolean
  goodStudent: boolean
  distantStudent: boolean
  defensiveDriving: boolean
}

// --- Personal Info ---
export interface PersonalInfo {
  fullName: string
  dateOfBirth: string
  gender: "male" | "female" | "non-binary" | ""
  maritalStatus: "single" | "married" | "divorced" | "widowed" | ""
  street: string
  city: string
  state: string
  zip: string
  email: string
  phone: string
}

// --- Vehicle Info (enhanced with multi-car support) ---
export interface VehicleInfo {
  id?: string
  vehicleNumber: number
  vin: string
  year: string
  make: string
  model: string
  bodyType: string
  primaryUse: "commute" | "pleasure" | "business" | ""
  annualMileage: string
  garagingSameAsPersonal: boolean
  garagingStreet: string
  garagingCity: string
  garagingState: string
  garagingZip: string
  antiTheft: boolean
  ownership: "owned" | "financed" | "leased" | ""
}

// --- Driving History ---
export interface DrivingHistory {
  yearsDriving: string
  atFaultAccidents: string
  movingViolations: string
  licenseStatus: "valid" | "suspended" | "revoked" | "permit" | ""
  priorInsurance: boolean
  priorCarrier: string
  yearsWithCarrier: string
}

// --- Auto Coverage (enhanced with UM/UIM, PIP, payment plans) ---
export interface AutoCoverage {
  liabilityLimit: "25/50" | "50/100" | "100/300" | "250/500" | "No Coverage" | ""
  compDeductible: "250" | "500" | "1000" | "2000" | "No Coverage" | ""
  collisionDeductible: "250" | "500" | "1000" | "2000" | "No Coverage" | ""
  umPd: boolean
  umPdLimit: "25/50" | "50/100" | "100/300" | "No Coverage" | ""
  uimStacked: boolean
  uimLimit: "25/50" | "50/100" | "100/300" | "No Coverage" | ""
  medicalPayments: "1000" | "5000" | "10000" | "25000" | "No Coverage" | ""
  pipCoverage: "2500" | "5000" | "10000" | "No Coverage" | ""
  rentalReimbursement: boolean
  rentalDailyLimit: "30" | "50" | "75" | ""
  roadsideAssistance: boolean
  paymentPlan: "paid-in-full" | "2-pay" | "4-pay" | "monthly" | ""
  priorInsurance: boolean
  priorCarrier: string
  priorLimits: string
  yearsWithPrior: string
  lapseInCoverage: boolean
}

// --- Auto Discounts ---
export interface AutoDiscounts {
  multiCar: boolean
  homeownerBundle: boolean
  goodDriver: boolean
  safetyDevice: boolean
}

// --- Full Auto Quote Input ---
export interface AutoQuoteInput {
  personalInfo: PersonalInfo
  vehicleInfo: VehicleInfo
  drivingHistory: DrivingHistory
  coverage: AutoCoverage
  discounts: AutoDiscounts
}

// --- Homeowners Property Info (enhanced) ---
export interface PropertyInfo {
  policyType: "HO3" | "HO4" | "HO6" | ""
  yearBuilt: string
  squareFootage: string
  stories: string
  bedrooms: string
  bathrooms: string
  roofType: "gable" | "hip" | "flat" | "mansard" | ""
  roofMaterial: "asphalt" | "tile" | "metal" | "slate" | "wood" | ""
  roofAge: string
  roofUpdateYear: string
  constructionType: "frame" | "masonry" | "steel" | ""
  foundation: "slab" | "basement" | "crawlspace" | ""
  heatingType: "central" | "heat-pump" | "baseboard" | "radiant" | ""
  plumbingUpdateYear: string
  electricalUpdateYear: string
  // Security features
  securitySystem: boolean
  fireAlarm: boolean
  smokeDetectors: boolean
  sprinklerSystem: boolean
  deadbolts: boolean
  gatedCommunity: boolean
  // Liability risks
  swimmingPool: boolean
  poolFenced: boolean
  trampoline: boolean
  dogBreed: string
  // Fire protection
  distanceToFireDept: string
  distanceToFireHydrant: string
  fireProtectionClass: string
}

// --- Homeowners Coverage (enhanced with Cov A-D, deductibles) ---
export interface HomeownersCoverageOptions {
  // Coverage A-D
  dwellingCoverage: string // Coverage A
  otherStructures: string // Coverage B
  personalProperty: string // Coverage C
  lossOfUse: string // Coverage D
  liability: "100000" | "300000" | "500000" | ""
  medicalPayments: "1000" | "5000" | "10000" | ""
  // Deductibles
  aopDeductible: "500" | "1000" | "2500" | "5000" | ""
  windHailDeductible: "1%" | "2%" | "5%" | "$1000" | "$2500" | ""
  hurricaneDeductible: "2%" | "5%" | "10%" | ""
  // Additional coverages
  waterBackup: boolean
  waterBackupLimit: string
  earthquake: boolean
  flood: boolean
  replacementCost: boolean
  scheduledPersonalProperty: boolean
  // Prior insurance
  priorInsurance: boolean
  priorCarrier: string
  yearsWithPrior: string
}

// --- Homeowners Claims ---
export interface HomeownersClaims {
  numberOfClaims: string
  claimTypes: string[]
  priorCarrier: string
}

// --- Homeowners Discounts ---
export interface HomeownersDiscounts {
  multiPolicy: boolean
  protectiveDevices: boolean
  claimsFree: boolean
  replacementCost: boolean
  waterBackup: boolean
  earthquake: boolean
  flood: boolean
}

// --- Full Homeowners Quote Input ---
export interface HomeownersQuoteInput {
  personalInfo: PersonalInfo
  propertyInfo: PropertyInfo
  coverage: HomeownersCoverageOptions
  claims: HomeownersClaims
  discounts: HomeownersDiscounts
}

// --- Carrier Definition ---
export interface Carrier {
  id: string
  name: string
  color: string
  shortName: string
}

// --- Coverage Detail Line Item ---
export interface CoverageDetail {
  label: string
  value: string
}

// --- Quote Result for Single Carrier ---
export interface CarrierQuote {
  carrierId: string
  carrierName: string
  carrierColor: string
  monthlyPremium: number
  semiAnnualPremium: number
  annualPremium: number
  isBestValue: boolean
  amBestRating: number // 1-5 rating
  coverageDetails: CoverageDetail[]
  discountsApplied: string[]
}

// --- Full Quote Result ---
export interface QuoteResult {
  id: string
  type: "auto" | "homeowners"
  vaName: string
  customerName: string
  createdAt: string
  input: AutoQuoteInput | HomeownersQuoteInput
  quotes: CarrierQuote[]
  selectedCarrierId?: string
}

// --- VA User ---
export interface VAUser {
  name: string
  loginCount: number
  lastLogin: string
  createdAt: string
}

// --- US States ---
export const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
] as const
