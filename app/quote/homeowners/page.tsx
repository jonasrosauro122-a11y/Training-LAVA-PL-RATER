"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"
import { QuoteWizard } from "@/components/quote-wizard"
import { PersonalInfoStep } from "@/components/auto-form/personal-info"
import { PropertyInfoStep } from "@/components/homeowners-form/property-info"
import { CoverageStep } from "@/components/homeowners-form/coverage"
import { ClaimsHistoryStep } from "@/components/homeowners-form/claims-history"
import { HomeDiscountsStep } from "@/components/homeowners-form/discounts"
import { getCurrentUser, saveQuote, generateQuoteId } from "@/lib/storage"
import { calculateHomeownersQuotes } from "@/lib/rating-engine/homeowners"
import type {
  PersonalInfo,
  PropertyInfo,
  HomeownersCoverageOptions,
  HomeownersClaims,
  HomeownersDiscounts,
  HomeownersQuoteInput,
} from "@/lib/types"

const STEPS = [
  { label: "Personal Info", shortLabel: "Info" },
  { label: "Property", shortLabel: "Property" },
  { label: "Coverage", shortLabel: "Coverage" },
  { label: "Claims", shortLabel: "Claims" },
  { label: "Discounts", shortLabel: "Disc." },
]

const INITIAL_PERSONAL: PersonalInfo = {
  fullName: "", dateOfBirth: "", gender: "", maritalStatus: "",
  street: "", city: "", state: "", zip: "", email: "", phone: "",
}

const INITIAL_PROPERTY: PropertyInfo = {
  policyType: "HO3", yearBuilt: "", squareFootage: "", stories: "1",
  roofType: "", roofAge: "", constructionType: "", foundation: "",
  securitySystem: false, swimmingPool: false, trampoline: false,
  distanceToFireDept: "", distanceToFireHydrant: "",
}

const INITIAL_COVERAGE: HomeownersCoverageOptions = {
  dwellingCoverage: "250000", otherStructures: "10",
  personalProperty: "50", lossOfUse: "20",
  liability: "", medicalPayments: "5000",
}

const INITIAL_CLAIMS: HomeownersClaims = {
  numberOfClaims: "0", claimTypes: [], priorCarrier: "",
}

const INITIAL_DISCOUNTS: HomeownersDiscounts = {
  multiPolicy: false, protectiveDevices: false, claimsFree: false,
  replacementCost: false, waterBackup: false, earthquake: false, flood: false,
}

function HomeownersQuoteContent() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(INITIAL_PERSONAL)
  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo>(INITIAL_PROPERTY)
  const [coverage, setCoverage] = useState<HomeownersCoverageOptions>(INITIAL_COVERAGE)
  const [claims, setClaims] = useState<HomeownersClaims>(INITIAL_CLAIMS)
  const [discounts, setDiscounts] = useState<HomeownersDiscounts>(INITIAL_DISCOUNTS)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = useCallback((s: number): boolean => {
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
      if (!propertyInfo.roofType) errs.roofType = "Required"
      if (!propertyInfo.roofAge) errs.roofAge = "Required"
      if (!propertyInfo.constructionType) errs.constructionType = "Required"
      if (!propertyInfo.foundation) errs.foundation = "Required"
    }

    if (s === 2) {
      if (!coverage.dwellingCoverage) errs.dwellingCoverage = "Required"
      if (!coverage.liability) errs.liability = "Required"
    }

    // Claims and Discounts steps don't have required fields

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
    if (!validateStep(step)) {
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
    const vaName = getCurrentUser() || "Unknown"
    const quoteId = generateQuoteId()

    const result = {
      id: quoteId,
      type: "homeowners" as const,
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
        <h1 className="text-2xl font-bold text-foreground">Homeowners Insurance Quote</h1>
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

export default function HomeownersQuotePage() {
  return (
    <AuthGuard>
      <HomeownersQuoteContent />
    </AuthGuard>
  )
}
