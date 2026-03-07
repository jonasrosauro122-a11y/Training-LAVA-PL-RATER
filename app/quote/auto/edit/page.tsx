"use client"

import { useState, useCallback, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"
import { QuoteWizard } from "@/components/quote-wizard"
import { PersonalInfoStep } from "@/components/auto-form/personal-info"
import { VehicleInfoStep } from "@/components/auto-form/vehicle-info"
import { DrivingHistoryStep } from "@/components/auto-form/driving-history"
import { CoverageOptionsStep } from "@/components/auto-form/coverage-options"
import { DiscountsStep } from "@/components/auto-form/discounts"
import { PaymentPlanStep } from "@/components/auto-form/payment-plan"
import { getQuoteById, updateQuote } from "@/lib/storage"
import { calculateAutoQuotes } from "@/lib/rating-engine/auto"
import type {
  PersonalInfo,
  VehicleInfo,
  DrivingHistory,
  AutoCoverage,
  AutoDiscounts,
  AutoQuoteInput,
  PaymentPlan,
  QuoteResult,
} from "@/lib/types"

const STEPS = [
  { label: "Personal Info", shortLabel: "Info" },
  { label: "Vehicles", shortLabel: "Vehicles" },
  { label: "Driving History", shortLabel: "History" },
  { label: "Coverage", shortLabel: "Coverage" },
  { label: "Discounts", shortLabel: "Disc." },
  { label: "Payment Plan", shortLabel: "Pay" },
]

function AutoEditContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const quoteId = searchParams.get("id")
  
  const [isLoading, setIsLoading] = useState(true)
  const [originalQuote, setOriginalQuote] = useState<QuoteResult | null>(null)
  const [step, setStep] = useState(0)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)
  const [vehicles, setVehicles] = useState<VehicleInfo[]>([])
  const [drivingHistory, setDrivingHistory] = useState<DrivingHistory | null>(null)
  const [coverage, setCoverage] = useState<AutoCoverage | null>(null)
  const [discounts, setDiscounts] = useState<AutoDiscounts | null>(null)
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!quoteId) {
      router.replace("/dashboard")
      return
    }

    const quote = getQuoteById(quoteId)
    if (!quote || quote.type !== "auto") {
      toast.error("Quote not found")
      router.replace("/dashboard")
      return
    }

    setOriginalQuote(quote)
    const input = quote.input as AutoQuoteInput
    setPersonalInfo(input.personalInfo)
    setVehicles(input.vehicles || [])
    setDrivingHistory(input.drivingHistory)
    setCoverage(input.coverage)
    setDiscounts(input.discounts)
    setPaymentPlan(input.paymentPlan || "")
    setIsLoading(false)
  }, [quoteId, router])

  const validateStep = useCallback((s: number): boolean => {
    if (!personalInfo || !coverage) return false
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
      vehicles.forEach((v) => {
        if (!v.vin || v.vin.length !== 17) errs[`${v.id}-vin`] = "VIN must be 17 characters"
        if (!v.year) errs[`${v.id}-year`] = "Required"
        if (!v.make.trim()) errs[`${v.id}-make`] = "Required"
        if (!v.model.trim()) errs[`${v.id}-model`] = "Required"
        if (!v.primaryUse) errs[`${v.id}-primaryUse`] = "Required"
        if (!v.annualMileage) errs[`${v.id}-annualMileage`] = "Required"
        if (!v.ownership) errs[`${v.id}-ownership`] = "Required"
        if (!v.deductible) errs[`${v.id}-deductible`] = "Required"
      })
    }

    if (s === 2 && drivingHistory) {
      if (!drivingHistory.yearsDriving) errs.yearsDriving = "Required"
      if (!drivingHistory.licenseStatus) errs.licenseStatus = "Required"
      if (drivingHistory.atFaultAccidents === "") errs.atFaultAccidents = "Required"
      if (drivingHistory.movingViolations === "") errs.movingViolations = "Required"
    }

    if (s === 3) {
      if (!coverage.liabilityLimit) errs.liabilityLimit = "Required"
      if (!coverage.uninsuredMotorist) errs.uninsuredMotorist = "Required"
    }

    if (s === 5) {
      if (!paymentPlan) errs.paymentPlan = "Required"
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }, [personalInfo, vehicles, drivingHistory, coverage, paymentPlan])

  const effectiveDiscounts = discounts ? {
    ...discounts,
    multiCar: vehicles.length > 1 ? true : discounts.multiCar,
  } : null

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
    if (!validateStep(step) || !originalQuote || !personalInfo || !drivingHistory || !coverage || !effectiveDiscounts) {
      toast.error("Please fill in all required fields.")
      return
    }

    const input: AutoQuoteInput = {
      personalInfo,
      vehicles,
      drivingHistory,
      coverage,
      discounts: effectiveDiscounts,
      paymentPlan,
    }

    const quotes = calculateAutoQuotes(input)

    const updatedResult: QuoteResult = {
      ...originalQuote,
      customerName: personalInfo.fullName,
      input,
      quotes,
    }

    updateQuote(updatedResult)
    toast.success("Quote updated successfully!")
    router.push(`/quote/results?id=${originalQuote.id}`)
  }

  if (isLoading || !personalInfo || !drivingHistory || !coverage || !discounts) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-muted-foreground">Loading quote...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 rounded font-medium">
            Editing
          </span>
          <span>Quote ID: {originalQuote?.id}</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Edit Auto Insurance Quote</h1>
        <p className="text-muted-foreground mt-1">
          Modify the quote details below. Changes will recalculate the premiums.
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
            data={vehicles}
            onChange={setVehicles}
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
        {step === 4 && effectiveDiscounts && (
          <DiscountsStep
            data={effectiveDiscounts}
            onChange={setDiscounts}
            vehicleCount={vehicles.length}
          />
        )}
        {step === 5 && (
          <PaymentPlanStep
            data={paymentPlan}
            onChange={setPaymentPlan}
            errors={errors}
          />
        )}
      </QuoteWizard>
    </main>
  )
}

export default function AutoEditPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <AutoEditContent />
      </Suspense>
    </AuthGuard>
  )
}
