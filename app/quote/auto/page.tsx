"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"
import { QuoteWizard } from "@/components/quote-wizard"
import { PersonalInfoStep } from "@/components/auto-form/personal-info"
import { VehicleInfoStep } from "@/components/auto-form/vehicle-info"
import { DrivingHistoryStep } from "@/components/auto-form/driving-history"
import { CoverageOptionsStep } from "@/components/auto-form/coverage-options"
import { DiscountsStep } from "@/components/auto-form/discounts"
import { getCurrentUser, saveQuote, generateQuoteId } from "@/lib/storage"
import { calculateAutoQuotes } from "@/lib/rating-engine/auto"
import type {
  PersonalInfo,
  VehicleInfo,
  DrivingHistory,
  AutoCoverage,
  AutoDiscounts,
  AutoQuoteInput,
} from "@/lib/types"

const STEPS = [
  { label: "Personal Info", shortLabel: "Info" },
  { label: "Vehicle", shortLabel: "Vehicle" },
  { label: "Driving History", shortLabel: "History" },
  { label: "Coverage", shortLabel: "Coverage" },
  { label: "Discounts", shortLabel: "Disc." },
]

const INITIAL_PERSONAL: PersonalInfo = {
  fullName: "", dateOfBirth: "", gender: "", maritalStatus: "",
  street: "", city: "", state: "", zip: "", email: "", phone: "",
}

const INITIAL_VEHICLE: VehicleInfo = {
  vin: "", year: "", make: "", model: "", bodyType: "",
  primaryUse: "", annualMileage: "", garagingSameAsPersonal: true,
  garagingStreet: "", garagingCity: "", garagingState: "", garagingZip: "",
  antiTheft: false, ownership: "",
}

const INITIAL_DRIVING: DrivingHistory = {
  yearsDriving: "", atFaultAccidents: "0", movingViolations: "0",
  licenseStatus: "", priorInsurance: false, priorCarrier: "", yearsWithCarrier: "",
}

const INITIAL_COVERAGE: AutoCoverage = {
  liabilityLimit: "", compDeductible: "", collisionDeductible: "",
  uninsuredMotorist: false, uninsuredLimit: "",
  medicalPayments: "", rentalReimbursement: false, rentalDailyLimit: "",
  roadsideAssistance: false,
}

const INITIAL_DISCOUNTS: AutoDiscounts = {
  multiCar: false, homeownerBundle: false, goodDriver: false, safetyDevice: false,
}

function AutoQuoteContent() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(INITIAL_PERSONAL)
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo>(INITIAL_VEHICLE)
  const [drivingHistory, setDrivingHistory] = useState<DrivingHistory>(INITIAL_DRIVING)
  const [coverage, setCoverage] = useState<AutoCoverage>(INITIAL_COVERAGE)
  const [discounts, setDiscounts] = useState<AutoDiscounts>(INITIAL_DISCOUNTS)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = useCallback((s: number): boolean => {
    const errs: Record<string, string> = {}

    if (s === 0) {
      if (!personalInfo.fullName.trim()) errs.fullName = "Required"
      if (!personalInfo.dateOfBirth) errs.dateOfBirth = "Required"
      if (!personalInfo.gender) errs.gender = "Required"
      if (!personalInfo.maritalStatus) errs.maritalStatus = "Required"
      if (!personalInfo.street.trim()) errs.street = "Required"
      if (!personalInfo.city.trim()) errs.city = "Required"
      if (!personalInfo.state) errs.state = "Required"
      if (!personalInfo.zip || personalInfo.zip.length < 5) errs.zip = "Enter valid ZIP"
    }

    if (s === 1) {
      if (!vehicleInfo.vin || vehicleInfo.vin.length !== 17) errs.vin = "VIN must be 17 characters"
      if (!vehicleInfo.year) errs.year = "Required"
      if (!vehicleInfo.make.trim()) errs.make = "Required"
      if (!vehicleInfo.model.trim()) errs.model = "Required"
      if (!vehicleInfo.primaryUse) errs.primaryUse = "Required"
      if (!vehicleInfo.annualMileage) errs.annualMileage = "Required"
      if (!vehicleInfo.ownership) errs.ownership = "Required"
    }

    if (s === 2) {
      if (!drivingHistory.yearsDriving) errs.yearsDriving = "Required"
      if (!drivingHistory.licenseStatus) errs.licenseStatus = "Required"
      if (drivingHistory.atFaultAccidents === "") errs.atFaultAccidents = "Required"
      if (drivingHistory.movingViolations === "") errs.movingViolations = "Required"
    }

    if (s === 3) {
      if (!coverage.liabilityLimit) errs.liabilityLimit = "Required"
      if (!coverage.compDeductible) errs.compDeductible = "Required"
      if (!coverage.collisionDeductible) errs.collisionDeductible = "Required"
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }, [personalInfo, vehicleInfo, drivingHistory, coverage])

  function handleNext() {
    if (validateStep(step)) {
      setStep((s) => s + 1)
    } else {
      toast.error("Please fill in all required fields.")
    }
  }

  function handlePrev() {
    setErrors({})
    setStep((s) => Math.max(0, s - 1))
  }

  function handleSubmit() {
    if (!validateStep(step)) {
      toast.error("Please fill in all required fields.")
      return
    }

    const input: AutoQuoteInput = {
      personalInfo,
      vehicleInfo,
      drivingHistory,
      coverage,
      discounts,
    }

    const quotes = calculateAutoQuotes(input)
    const vaName = getCurrentUser() || "Unknown"
    const quoteId = generateQuoteId()

    const result = {
      id: quoteId,
      type: "auto" as const,
      vaName,
      customerName: personalInfo.fullName,
      createdAt: new Date().toISOString(),
      input,
      quotes,
    }

    saveQuote(result)
    router.push(`/quote/results?id=${quoteId}`)
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Auto Insurance Quote</h1>
        <p className="text-muted-foreground mt-1">
          Complete all 5 steps to generate quotes from 7 carriers.
        </p>
      </div>

      <QuoteWizard
        steps={STEPS}
        currentStep={step}
        onNext={handleNext}
        onPrev={handlePrev}
        onSubmit={handleSubmit}
        canProceed={true}
      >
        {step === 0 && (
          <PersonalInfoStep
            data={personalInfo}
            onChange={setPersonalInfo}
            errors={errors}
          />
        )}
        {step === 1 && (
          <VehicleInfoStep
            data={vehicleInfo}
            onChange={setVehicleInfo}
            errors={errors}
          />
        )}
        {step === 2 && (
          <DrivingHistoryStep
            data={drivingHistory}
            onChange={setDrivingHistory}
            errors={errors}
          />
        )}
        {step === 3 && (
          <CoverageOptionsStep
            data={coverage}
            onChange={setCoverage}
            errors={errors}
          />
        )}
        {step === 4 && (
          <DiscountsStep
            data={discounts}
            onChange={setDiscounts}
          />
        )}
      </QuoteWizard>
    </main>
  )
}

export default function AutoQuotePage() {
  return (
    <AuthGuard>
      <AutoQuoteContent />
    </AuthGuard>
  )
}
