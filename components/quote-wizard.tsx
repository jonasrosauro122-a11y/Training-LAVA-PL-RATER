"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Send } from "lucide-react"

interface QuoteWizardStep {
  label: string
  shortLabel: string
}

interface QuoteWizardProps {
  steps: QuoteWizardStep[]
  currentStep: number
  onNext: () => void
  onPrev: () => void
  onSubmit: () => void
  canProceed: boolean
  children: React.ReactNode
}

export function QuoteWizard({
  steps,
  currentStep,
  onNext,
  onPrev,
  onSubmit,
  canProceed,
  children,
}: QuoteWizardProps) {
  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  return (
    <div className="flex flex-col gap-6">
      {/* Stepper */}
      <div className="flex items-center justify-between" role="navigation" aria-label="Form progress">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep
          const isCurrent = idx === currentStep
          return (
            <div key={step.label} className="flex items-center flex-1 last:flex-0">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-all",
                    isCompleted && "lava-gradient-bg text-white",
                    isCurrent && "ring-2 ring-primary bg-primary/10 text-primary",
                    !isCompleted && !isCurrent && "bg-secondary text-muted-foreground"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium hidden sm:block",
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium sm:hidden",
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.shortLabel}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 rounded-full transition-colors",
                    idx < currentStep ? "lava-gradient-bg" : "bg-border"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">{children}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={isFirstStep}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        {isLastStep ? (
          <Button
            onClick={onSubmit}
            disabled={!canProceed}
            className="gap-2 lava-gradient-bg text-white border-0 hover:opacity-90"
          >
            Get Quotes
            <Send className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
