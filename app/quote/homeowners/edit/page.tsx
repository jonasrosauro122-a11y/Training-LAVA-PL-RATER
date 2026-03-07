"use client"

import { useState, useCallback, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"
import { QuoteWizard } from "@/components/quote-wizard"
import { PersonalInfoStep } from "@/components/auto-form/personal-info"
import { PropertyInfoStep } from "@/components/homeowners-form/property-info"
import { CoverageStep } from "@/components/homeowners-form/coverage"
import { ClaimsHistoryStep } from "@/components/homeowners-form/claims-history"
import { HomeDiscountsStep } from "@/components/homeowners-form/discounts"
import { getQuoteById, updateQuote } from "@/lib/storage"
import { calculateHomeownersQuotes } from "@/lib/rating-engine/homeowners"
import type {
  PersonalInfo,
  PropertyInfo,
  HomeownersCoverageOptions,
  HomeownersClaims,
  HomeownersDiscounts,
  HomeownersQuoteInput,
  QuoteResult,
} from "@/lib/types"

const STEPS = [
  { label: "Personal Info", shortLabel: "Info" },
  { label: "Property", shortLabel: "Property" },
  { label: "Coverage", shortLabel: "Coverage" },
  { label: "Claims", shortLabel: "Claims" },
  { label: "Discounts", shortLabel: "Disc." },
]

function HomeownersEditContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const quoteId = searchParams.get("id")
  
  const [isLoading, setIsLoading] = useState(true)
  const [originalQuote, setOriginalQuote] = useState<QuoteResult | null>(null)
  const [step, setStep] = useState(0)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)
  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo | null>(null)
  const [coverage, setCoverage] = useState<HomeownersCoverageOptions | null>(null)
  const [claims, setClaims] = useState<HomeownersClaims | null>(null)
  const [discounts, setDiscounts] = useState<HomeownersDiscounts | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!quoteId) {
      router.replace("/dashboard")
      return
    }

    const quote = getQuoteById(quoteId)
    if (!quote || quote.type !== "homeowners") {
      toast.error("Quote not found")
      router.replace("/dashboard")
      return
    }

    setOriginalQuote(quote)
    const input = quote.input as HomeownersQuoteInput
    setPersonalInfo(input.personalInfo)
    setPropertyInfo(input.propertyInfo)
    setCoverage(input.coverage)
    setClaims(input.claims)
    setDiscounts(input.discounts)
    setIsLoading(false)
  }, [quoteId, router])

  const validateStep = useCallback((s: number): boolean => {
    if (!personalInfo || !propertyInfo || !coverage) return false
    const errs: Record<string, string> = {}

    if (s === 0) {
      if (!personalInfo.fullName.trim()) errs.fullName = "Required"
      if (!personalInfo.dateOfBirth) errs.dateOfBirth = "Required"
      if (!personalInfo.street.trim()) errs.street = "Required"
      if (!personalInfo.city.trim()) errs.city = "Required"
      if (!personalInfo.state) errs.state = "Required"
      if (!personalInfo.zip || personalInfo.zip.length < 5) errs.zip = "Enter valid ZIP"
    }

    if (s === 1) {
      if (!propertyInfo.policyType) errs.policyType = "Required"
      if (!propertyInfo.yearBuilt) errs.yearBuilt = "Required"
      if (!propertyInfo.squareFootage) errs.squareFootage = "Required"
      if (!propertyInfo.roofShape) errs.roofShape = "Required"
      if (!propertyInfo.roofMaterial) errs.roofMaterial = "Required"
      if (!propertyInfo.roofYearInstalled) errs.roofYearInstalled = "Required"
      if (!propertyInfo.constructionType) errs.constructionType = "Required"
      if (!propertyInfo.foundation) errs.foundation = "Required"
      if (!propertyInfo.numberOfBedrooms) errs.numberOfBedrooms = "Required"
      if (!propertyInfo.numberOfBathrooms) errs.numberOfBathrooms = "Required"
      if (!propertyInfo.heatingType) errs.heatingType = "Required"
    }

    if (s === 2) {
      if (!coverage.dwellingCoverage) errs.dwellingCoverage = "Required"
      if (!coverage.liability) errs.liability = "Required"
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }, [personalInfo, propertyInfo, coverage])

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
    if (!validateStep(step) || !originalQuote || !personalInfo || !propertyInfo || !coverage || !claims || !discounts) {
      toast.error("Please fill in all required fields.")
      return
    }

    const input: HomeownersQuoteInput = {
      personalInfo,
      propertyInfo,
      coverage,
      claims,
      discounts,
    }

    const quotes = calculateHomeownersQuotes(input)

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

  if (isLoading || !personalInfo || !propertyInfo || !coverage || !claims || !discounts) {
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
        <h1 className="text-2xl font-bold text-foreground">Edit Homeowners Insurance Quote</h1>
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
          <PropertyInfoStep
            data={propertyInfo}
            onChange={setPropertyInfo}
            errors={errors}
          />
        )}
        {step === 2 && (
          <CoverageStep
            data={coverage}
            onChange={setCoverage}
            errors={errors}
          />
        )}
        {step === 3 && (
          <ClaimsHistoryStep
            data={claims}
            onChange={setClaims}
            errors={errors}
          />
        )}
        {step === 4 && (
          <HomeDiscountsStep
            data={discounts}
            onChange={setDiscounts}
          />
        )}
      </QuoteWizard>
    </main>
  )
}

export default function HomeownersEditPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <HomeownersEditContent />
      </Suspense>
    </AuthGuard>
  )
}
