import type { AutoQuoteInput, CarrierQuote, CoverageDetail } from "../types"
import { CARRIERS } from "../carriers"
import {
  getAgeFactor,
  getVehicleAgeFactor,
  getMileageFactor,
  getDrivingRecordFactor,
  getLicenseStatusFactor,
  getYearsDrivingFactor,
  getLiabilityMultiplier,
  getDeductibleFactor,
  getStateFactor,
  getAutoDiscountFactor,
  getPaymentPlanFactor,
} from "./factors"

// Per-carrier base annual rates
const CARRIER_BASE_RATES: Record<string, number> = {
  travelers: 1150,
  safeco: 1080,
  progressive: 980,
  nationwide: 1050,
  hartford: 1200,
  foremost: 920,
  branch: 1020,
}

// Each carrier has a slight variance range
const CARRIER_VARIANCE: Record<string, [number, number]> = {
  travelers: [-0.03, 0.04],
  safeco: [-0.04, 0.03],
  progressive: [-0.05, 0.05],
  nationwide: [-0.03, 0.03],
  hartford: [-0.02, 0.04],
  foremost: [-0.04, 0.06],
  branch: [-0.05, 0.04],
}

function seededRandom(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return ((Math.sin(hash) * 10000) % 1 + 1) % 1
}

export function calculateAutoQuotes(input: AutoQuoteInput): CarrierQuote[] {
  const ageFactor = getAgeFactor(input.personalInfo.dateOfBirth)
  const drivingRecord = getDrivingRecordFactor(
    input.drivingHistory.atFaultAccidents,
    input.drivingHistory.movingViolations
  )
  const licenseFactor = getLicenseStatusFactor(input.drivingHistory.licenseStatus)
  const yearsDriving = getYearsDrivingFactor(input.drivingHistory.yearsDriving)
  const liabilityMult = getLiabilityMultiplier(input.coverage.liabilityLimit)
  const stateFactor = getStateFactor(input.personalInfo.state)
  const discountFactor = getAutoDiscountFactor(input.discounts)
  const paymentFactor = getPaymentPlanFactor(input.paymentPlan)

  // Calculate per-vehicle premiums
  let totalVehiclePremium = 0
  const vehicleCoverageDetails: CoverageDetail[] = []
  
  input.vehicles.forEach((vehicle, idx) => {
    const vehicleAgeFactor = getVehicleAgeFactor(vehicle.year)
    const mileageFactor = getMileageFactor(vehicle.annualMileage)
    
    // Vehicle-specific deductible factor
    const deductibleFactor = vehicle.deductible === "none" 
      ? 0.6 // Liability-only is cheaper
      : getDeductibleFactor(vehicle.deductible)
    
    // Extra coverage additions per vehicle
    let vehicleAddon = 0
    if (vehicle.rentalReimbursement) vehicleAddon += 25
    if (vehicle.roadsideAssistance) vehicleAddon += 15
    
    const vehiclePremium = vehicleAgeFactor * mileageFactor * deductibleFactor * 500 + vehicleAddon
    totalVehiclePremium += vehiclePremium
    
    // Add vehicle coverage details
    const vehicleLabel = vehicle.year && vehicle.make && vehicle.model 
      ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
      : `Vehicle ${idx + 1}`
    
    if (vehicle.deductible === "none") {
      vehicleCoverageDetails.push({ 
        label: `${vehicleLabel}`, 
        value: "Liability Only" 
      })
    } else {
      vehicleCoverageDetails.push({ 
        label: `${vehicleLabel}`, 
        value: `$${vehicle.deductible} Deductible` 
      })
    }
    
    if (vehicle.rentalReimbursement) {
      vehicleCoverageDetails.push({ 
        label: `${vehicleLabel} Rental`, 
        value: `$${vehicle.rentalDailyLimit || "30"}/day` 
      })
    }
    if (vehicle.roadsideAssistance) {
      vehicleCoverageDetails.push({ 
        label: `${vehicleLabel} Roadside`, 
        value: "Included" 
      })
    }
  })

  // Policy-level coverage additions
  let policyAddon = 0
  if (input.coverage.uninsuredMotorist && input.coverage.uninsuredMotorist !== "none") {
    policyAddon += 45
  }
  const medPay = input.coverage.medicalPayments === "none" ? 0 : parseInt(input.coverage.medicalPayments || "0")
  if (medPay > 0) policyAddon += medPay * 0.003

  // Build coverage details
  const coverageDetails: CoverageDetail[] = [
    { label: "Liability", value: input.coverage.liabilityLimit || "N/A" },
    { label: "Vehicles", value: `${input.vehicles.length} covered` },
  ]
  
  if (input.coverage.uninsuredMotorist && input.coverage.uninsuredMotorist !== "none") {
    coverageDetails.push({ 
      label: "Uninsured Motorist", 
      value: input.coverage.uninsuredMotorist === "state-minimum" ? "State Minimum" : "Standard" 
    })
  }
  
  if (input.coverage.medicalPayments && input.coverage.medicalPayments !== "none") {
    coverageDetails.push({ 
      label: "Medical Payments", 
      value: `$${parseInt(input.coverage.medicalPayments).toLocaleString()}` 
    })
  }
  
  // Add payment plan info
  const paymentPlanLabels: Record<string, string> = {
    "paid-in-full": "Paid in Full",
    "2-pay": "2 Pay (Semi-Annual)",
    "4-pay": "4 Pay (Quarterly)",
    "monthly": "Monthly",
  }
  coverageDetails.push({
    label: "Payment Plan",
    value: paymentPlanLabels[input.paymentPlan] || "Not Selected"
  })
  
  // Add vehicle-specific details
  coverageDetails.push(...vehicleCoverageDetails)

  // Build discounts applied
  const discountsApplied: string[] = []
  if (input.discounts.multiCar) discountsApplied.push("Multi-Car")
  if (input.discounts.homeownerBundle) discountsApplied.push("Home Bundle")
  if (input.discounts.goodDriver) discountsApplied.push("Good Driver")
  if (input.discounts.safetyDevice) discountsApplied.push("Safety Device")
  if (input.discounts.dynamicDrive) discountsApplied.push("Dynamic Drive")
  if (input.paymentPlan === "paid-in-full") discountsApplied.push("Pay-in-Full")

  // AM Best ratings per carrier (simulated)
  const AM_BEST: Record<string, number> = {
    travelers: 5, safeco: 4, progressive: 4, nationwide: 5,
    hartford: 5, foremost: 3, branch: 3,
  }

  const seedBase = `${input.personalInfo.fullName}-${input.vehicles[0]?.vin || ""}-${input.personalInfo.zip}`

  const quotes: CarrierQuote[] = CARRIERS.map((carrier) => {
    const baseRate = CARRIER_BASE_RATES[carrier.id] || 1000
    const [minVar, maxVar] = CARRIER_VARIANCE[carrier.id] || [-0.03, 0.03]
    const rand = seededRandom(seedBase + carrier.id)
    const variance = 1 + minVar + rand * (maxVar - minVar)

    const annualPremium = Math.round(
      (baseRate *
        ageFactor *
        drivingRecord *
        licenseFactor *
        yearsDriving *
        liabilityMult *
        stateFactor *
        discountFactor *
        paymentFactor *
        variance +
        totalVehiclePremium +
        policyAddon) *
        100
    ) / 100

    return {
      carrierId: carrier.id,
      carrierName: carrier.name,
      carrierColor: carrier.color,
      monthlyPremium: Math.round((annualPremium / 12) * 100) / 100,
      semiAnnualPremium: Math.round((annualPremium / 2) * 100) / 100,
      annualPremium,
      isBestValue: false,
      amBestRating: AM_BEST[carrier.id] || 4,
      coverageDetails,
      discountsApplied,
    }
  })

  // Mark best value
  const minPremium = Math.min(...quotes.map((q) => q.annualPremium))
  quotes.forEach((q) => {
    q.isBestValue = q.annualPremium === minPremium
  })

  return quotes.sort((a, b) => a.annualPremium - b.annualPremium)
}
