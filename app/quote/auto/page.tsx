"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"
import { QuoteWizard } from "@/components/quote-wizard"
import { PersonalInfoStep } from "@/components/auto-form/personal-info"
import { DriverInfoStep } from "@/components/auto-form/driver-info"
import { VehicleInfoStep } from "@/components/auto-form/vehicle-info"
import { CoverageOptionsStep } from "@/components/auto-form/coverage-options"
import { DiscountsStep } from "@/components/auto-form/discounts"
import { getCurrentUser, getCurrentPreQuoteForm, saveQuote, generateQuoteId } from "@/lib/storage"
import { calculateAutoQuotes } from "@/lib/rating-engine/auto"
import type {
  PersonalInfo,
  VehicleInfo,
  DriverInfo,
  AutoCoverage,
  AutoDiscounts,
  AutoQuoteInput,
  DrivingHistory,
} from "@/lib/types"

const STEPS = [
  { label: "Client Info", shortLabel: "Client" },
  { label: "Drivers", shortLabel: "Drivers" },
  { label: "Vehicles", shortLabel: "Vehicles" },
  { label: "Coverage", shortLabel: "Coverage" },
  { label: "Discounts", shortLabel: "Disc." },
]

const INITIAL_PERSONAL: PersonalInfo = {
  firstName: "",
  lastName: "",
  fullName: "",
  dateOfBirth: "",
  gender: "",
  maritalStatus: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  county: "",
  email: "",
  phone: "",
  yearsAtAddress: "",
  ownership: "",
  currentCarrier: "",
  currentPremium: "",
  policyExpiration: "",
  priorCoverage: "",
  coverageLapses: false,
}

function createInitialDriver(): DriverInfo {
  return {
    id: `driver-${Date.now()}`,
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    occupation: "",
    relationshipToInsured: "self",
    licenseNumber: "",
    licenseState: "",
    ageFirstLicensed: "",
    licenseStatus: "",
    ticketsLast3Years: "0",
    accidentsLast5Years: "0",
    sr22Required: false,
    goodStudent: false,
    driversEducation: false,
    awayAtSchool: false,
  }
}

function createInitialVehicle(): VehicleInfo {
  return {
    id: `vehicle-${Date.now()}`,
    vin: "",
    year: "",
    make: "",
    model: "",
    trim: "",
    bodyType: "",
    primaryUse: "",
    annualMileage: "",
    oneWayMilesToWork: "",
    daysDrivenPerWeek: "",
    garagingSameAsPersonal: true,
    garagingStreet: "",
    garagingCity: "",
    garagingState: "",
    garagingZip: "",
    antiTheft: false,
    ownership: "",
    lienholder: "",
    compDeductible: "",
    collisionDeductible: "",
    rentalReimbursement: false,
    roadsideAssistance: false,
  }
}

const INITIAL_COVERAGE: AutoCoverage = {
  bodilyInjuryLimit: "",
  propertyDamageLimit: "",
  liabilityLimit: "",
  compDeductible: "",
  collisionDeductible: "",
  pip: "",
  medicalPayments: "",
  umUimCoverage: "",
  uninsuredMotorist: false,
  uninsuredLimit: "",
  rentalReimbursement: false,
  rentalDailyLimit: "",
  roadsideAssistance: false,
  gapCoverage: false,
}

const INITIAL_DISCOUNTS: AutoDiscounts = {
  multiCar: false,
  homeownerBundle: false,
  goodDriver: false,
  safetyDevice: false,
  dynamicDrive: false,
}

function AutoQuoteContent() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(INITIAL_PERSONAL)
  const [drivers, setDrivers] = useState<DriverInfo[]>([createInitialDriver()])
  const [vehicles, setVehicles] = useState<VehicleInfo[]>([createInitialVehicle()])
  const [coverage, setCoverage] = useState<AutoCoverage>(INITIAL_COVERAGE)
  const [discounts, setDiscounts] = useState<AutoDiscounts>(INITIAL_DISCOUNTS)
  const [paymentPlan, setPaymentPlan] = useState<"full" | "2pay" | "4pay" | "monthly" | "">("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Check for pre-quote form
  useEffect(() => {
    const preQuote = getCurrentPreQuoteForm()
    if (!preQuote) {
      // Redirect to pre-quote form if not filled
      router.replace("/pre-quote?type=auto")
    }
  }, [router])

  // Auto-update multi-car discount based on number of vehicles
  useEffect(() => {
    if (vehicles.length > 1 && !discounts.multiCar) {
      setDiscounts((prev) => ({ ...prev, multiCar: true }))
    } else if (vehicles.length <= 1 && discounts.multiCar) {
      setDiscounts((prev) => ({ ...prev, multiCar: false }))
    }
  }, [vehicles.length, discounts.multiCar])

  const validateStep = useCallback((s: number): boolean => {
    const errs: Record<string, string> = {}

    if (s === 0) {
      if (!personalInfo.firstName.trim()) errs.firstName = "Required"
      if (!personalInfo.lastName.trim()) errs.lastName = "Required"
      if (!personalInfo.dateOfBirth) errs.dateOfBirth = "Required"
      if (!personalInfo.gender) errs.gender = "Required"
      if (!personalInfo.maritalStatus) errs.maritalStatus = "Required"
      if (!personalInfo.email.trim()) errs.email = "Required"
      if (!personalInfo.phone.trim()) errs.phone = "Required"
      if (!personalInfo.street.trim()) errs.street = "Required"
      if (!personalInfo.city.trim()) errs.city = "Required"
      if (!personalInfo.state) errs.state = "Required"
      if (!personalInfo.zip || personalInfo.zip.length < 5) errs.zip = "Enter valid ZIP"
    }

    if (s === 1) {
      drivers.forEach((driver, index) => {
        if (!driver.firstName.trim()) errs[`drivers.${index}.firstName`] = "Required"
        if (!driver.lastName.trim()) errs[`drivers.${index}.lastName`] = "Required"
        if (!driver.dateOfBirth) errs[`drivers.${index}.dateOfBirth`] = "Required"
        if (!driver.relationshipToInsured) errs[`drivers.${index}.relationshipToInsured`] = "Required"
        if (!driver.licenseStatus) errs[`drivers.${index}.licenseStatus`] = "Required"
      })
    }

    if (s === 2) {
      vehicles.forEach((vehicle, index) => {
        if (!vehicle.vin || vehicle.vin.length !== 17) errs[`vehicles.${index}.vin`] = "VIN must be 17 characters"
        if (!vehicle.year) errs[`vehicles.${index}.year`] = "Required"
        if (!vehicle.make.trim()) errs[`vehicles.${index}.make`] = "Required"
        if (!vehicle.model.trim()) errs[`vehicles.${index}.model`] = "Required"
        if (!vehicle.primaryUse) errs[`vehicles.${index}.primaryUse`] = "Required"
        if (!vehicle.annualMileage) errs[`vehicles.${index}.annualMileage`] = "Required"
        if (!vehicle.ownership) errs[`vehicles.${index}.ownership`] = "Required"
      })
    }

    if (s === 3) {
      if (!coverage.liabilityLimit) errs.liabilityLimit = "Required"
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }, [personalInfo, drivers, vehicles, coverage])

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

    // Create driving history from primary driver
    const primaryDriver = drivers.find((d) => d.relationshipToInsured === "self") || drivers[0]
    const drivingHistory: DrivingHistory = {
      yearsDriving: primaryDriver.ageFirstLicensed 
        ? String(new Date().getFullYear() - parseInt(primaryDriver.ageFirstLicensed) - parseInt(primaryDriver.dateOfBirth.split("-")[0] || "0"))
        : "",
      atFaultAccidents: primaryDriver.accidentsLast5Years,
      movingViolations: primaryDriver.ticketsLast3Years,
      licenseStatus: primaryDriver.licenseStatus,
      priorInsurance: !!personalInfo.currentCarrier,
      priorCarrier: personalInfo.currentCarrier,
      yearsWithCarrier: personalInfo.priorCoverage === "5_plus_years" ? "5" : 
                        personalInfo.priorCoverage === "2_to_5_years" ? "3" :
                        personalInfo.priorCoverage === "1_to_2_years" ? "1" : "0",
    }

    const input: AutoQuoteInput = {
      personalInfo,
      vehicles,
      drivers,
      drivingHistory,
      coverage,
      discounts,
      paymentPlan,
    }

    const quotes = calculateAutoQuotes(input)
    const vaName = getCurrentUser() || "Unknown"
    const quoteId = generateQuoteId()

    const result = {
      id: quoteId,
      type: "auto" as const,
      vaName,
      customerName: personalInfo.fullName || `${personalInfo.firstName} ${personalInfo.lastName}`,
      createdAt: new Date().toISOString(),
      input,
      quotes,
    }

    saveQuote(result)
    router.push(`/quote/results?id=${quoteId}`)
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Auto Insurance Quote</h1>
        <p className="text-muted-foreground mt-1">
          Complete all 5 steps to generate quotes from 7 carriers.
          {vehicles.length > 1 && (
            <span className="ml-2 text-primary font-medium">
              Multi-Car Discount Eligible
            </span>
          )}
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
          <DriverInfoStep
            drivers={drivers}
            onChange={setDrivers}
            errors={errors}
          />
        )}
        {step === 2 && (
          <VehicleInfoStep
            vehicles={vehicles}
            onChange={setVehicles}
            errors={errors}
          />
        )}
        {step === 3 && (
          <CoverageOptionsStep
            data={coverage}
            onChange={setCoverage}
            errors={errors}
            paymentPlan={paymentPlan}
            onPaymentPlanChange={setPaymentPlan}
          />
        )}
        {step === 4 && (
          <DiscountsStep
            data={discounts}
            onChange={setDiscounts}
            vehicleCount={vehicles.length}
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
