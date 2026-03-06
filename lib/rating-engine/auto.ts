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
  const vehicleAgeFactor = getVehicleAgeFactor(input.vehicleInfo.year)
  const mileageFactor = getMileageFactor(input.vehicleInfo.annualMileage)
  const drivingRecord = getDrivingRecordFactor(
    input.drivingHistory.atFaultAccidents,
    input.drivingHistory.movingViolations
  )
  const licenseFactor = getLicenseStatusFactor(input.drivingHistory.licenseStatus)
  const yearsDriving = getYearsDrivingFactor(input.drivingHistory.yearsDriving)
  const liabilityMult = getLiabilityMultiplier(input.coverage.liabilityLimit)
  const compDeductible = getDeductibleFactor(input.coverage.compDeductible)
  const collisionDeductible = getDeductibleFactor(input.coverage.collisionDeductible)
  const stateFactor = getStateFactor(input.personalInfo.state)
  const discountFactor = getAutoDiscountFactor(input.discounts)

  // Extra coverage additions
  let coverageAddon = 0
  if (input.coverage.uninsuredMotorist) coverageAddon += 45
  if (input.coverage.rentalReimbursement) coverageAddon += 25
  if (input.coverage.roadsideAssistance) coverageAddon += 15
  const medPay = parseInt(input.coverage.medicalPayments || "0")
  if (medPay > 0) coverageAddon += medPay * 0.003

  // Build coverage details
  const coverageDetails: CoverageDetail[] = [
    { label: "Liability", value: input.coverage.liabilityLimit || "N/A" },
    { label: "Comp Deductible", value: `$${input.coverage.compDeductible || "N/A"}` },
    { label: "Collision Deductible", value: `$${input.coverage.collisionDeductible || "N/A"}` },
  ]
  if (input.coverage.uninsuredMotorist) {
    coverageDetails.push({ label: "Uninsured Motorist", value: input.coverage.uninsuredLimit || "Included" })
  }
  if (input.coverage.medicalPayments) {
    coverageDetails.push({ label: "Medical Payments", value: `$${parseInt(input.coverage.medicalPayments).toLocaleString()}` })
  }
  if (input.coverage.rentalReimbursement) {
    coverageDetails.push({ label: "Rental Reimburse", value: `$${input.coverage.rentalDailyLimit || "30"}/day` })
  }
  if (input.coverage.roadsideAssistance) {
    coverageDetails.push({ label: "Roadside Assist", value: "Included" })
  }

  // Build discounts applied
  const discountsApplied: string[] = []
  if (input.discounts.multiCar) discountsApplied.push("Multi-Car")
  if (input.discounts.homeownerBundle) discountsApplied.push("Home Bundle")
  if (input.discounts.goodDriver) discountsApplied.push("Good Driver")
  if (input.discounts.safetyDevice) discountsApplied.push("Safety Device")

  // AM Best ratings per carrier (simulated)
  const AM_BEST: Record<string, number> = {
    travelers: 5, safeco: 4, progressive: 4, nationwide: 5,
    hartford: 5, foremost: 3, branch: 3,
  }

  const seedBase = `${input.personalInfo.fullName}-${input.vehicleInfo.vin}-${input.personalInfo.zip}`

  const quotes: CarrierQuote[] = CARRIERS.map((carrier) => {
    const baseRate = CARRIER_BASE_RATES[carrier.id] || 1000
    const [minVar, maxVar] = CARRIER_VARIANCE[carrier.id] || [-0.03, 0.03]
    const rand = seededRandom(seedBase + carrier.id)
    const variance = 1 + minVar + rand * (maxVar - minVar)

    const annualPremium = Math.round(
      (baseRate *
        ageFactor *
        vehicleAgeFactor *
        mileageFactor *
        drivingRecord *
        licenseFactor *
        yearsDriving *
        liabilityMult *
        ((compDeductible + collisionDeductible) / 2) *
        stateFactor *
        discountFactor *
        variance +
        coverageAddon) *
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
