import type { HomeownersQuoteInput, CarrierQuote, CoverageDetail } from "../types"
import { CARRIERS } from "../carriers"
import {
  getPolicyTypeFactor,
  getYearBuiltFactor,
  getRoofFactor,
  getConstructionFactor,
  getPropertyRiskFactor,
  getHomeClaimsFactor,
  getHomeDiscountFactor,
  getDwellingMultiplier,
  getLiabilityHomeFactor,
  getStateFactor,
} from "./factors"

// Per-carrier base annual rate for a $250k dwelling HO3
const CARRIER_BASE_RATES: Record<string, number> = {
  travelers: 1350,
  safeco: 1280,
  progressive: 1180,
  nationwide: 1300,
  hartford: 1420,
  foremost: 1100,
  branch: 1220,
}

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

export function calculateHomeownersQuotes(
  input: HomeownersQuoteInput
): CarrierQuote[] {
  const policyType = getPolicyTypeFactor(input.propertyInfo.policyType)
  const yearBuilt = getYearBuiltFactor(input.propertyInfo.yearBuilt)
  const roof = getRoofFactor(
    input.propertyInfo.roofType,
    input.propertyInfo.roofAge
  )
  const construction = getConstructionFactor(input.propertyInfo.constructionType)
  const risk = getPropertyRiskFactor(
    input.propertyInfo.swimmingPool,
    input.propertyInfo.trampoline
  )
  const claims = getHomeClaimsFactor(input.claims.numberOfClaims)
  const discountFactor = getHomeDiscountFactor(input.discounts)
  const dwelling = getDwellingMultiplier(input.coverage.dwellingCoverage)
  const liability = getLiabilityHomeFactor(input.coverage.liability)
  const stateFactor = getStateFactor(input.personalInfo.state)

  // Optional coverage add-ons
  let addon = 0
  if (input.discounts.replacementCost) addon += 85
  if (input.discounts.waterBackup) addon += 55
  if (input.discounts.earthquake) addon += 180
  if (input.discounts.flood) addon += 250

  // Build coverage details
  const coverageDetails: CoverageDetail[] = [
    { label: "Dwelling (A)", value: `$${parseInt(input.coverage.dwellingCoverage || "0").toLocaleString()}` },
    { label: "Other Structures (B)", value: `${input.coverage.otherStructures || 10}% of A` },
    { label: "Personal Property (C)", value: `${input.coverage.personalProperty || 50}% of A` },
    { label: "Liability", value: `$${parseInt(input.coverage.liability || "100000").toLocaleString()}` },
  ]
  if (input.coverage.medicalPayments) {
    coverageDetails.push({ label: "Medical Payments", value: `$${parseInt(input.coverage.medicalPayments).toLocaleString()}` })
  }

  // Build discounts
  const discountsApplied: string[] = []
  if (input.discounts.multiPolicy) discountsApplied.push("Multi-Policy")
  if (input.discounts.protectiveDevices) discountsApplied.push("Protective Devices")
  if (input.discounts.claimsFree) discountsApplied.push("Claims-Free")
  if (input.discounts.replacementCost) discountsApplied.push("Replacement Cost")
  if (input.discounts.waterBackup) discountsApplied.push("Water Backup")
  if (input.discounts.earthquake) discountsApplied.push("Earthquake")
  if (input.discounts.flood) discountsApplied.push("Flood")

  const AM_BEST: Record<string, number> = {
    travelers: 5, safeco: 4, progressive: 4, nationwide: 5,
    hartford: 5, foremost: 3, branch: 3,
  }

  const seedBase = `${input.personalInfo.fullName}-${input.propertyInfo.yearBuilt}-${input.personalInfo.zip}`

  const quotes: CarrierQuote[] = CARRIERS.map((carrier) => {
    const baseRate = CARRIER_BASE_RATES[carrier.id] || 1200
    const [minVar, maxVar] = CARRIER_VARIANCE[carrier.id] || [-0.03, 0.03]
    const rand = seededRandom(seedBase + carrier.id)
    const variance = 1 + minVar + rand * (maxVar - minVar)

    const annualPremium =
      Math.round(
        (baseRate *
          policyType *
          yearBuilt *
          roof *
          construction *
          risk *
          claims *
          discountFactor *
          dwelling *
          liability *
          stateFactor *
          variance +
          addon) *
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

  const minPremium = Math.min(...quotes.map((q) => q.annualPremium))
  quotes.forEach((q) => {
    q.isBestValue = q.annualPremium === minPremium
  })

  return quotes.sort((a, b) => a.annualPremium - b.annualPremium)
}
