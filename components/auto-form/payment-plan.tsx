"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Calendar, CalendarDays, CalendarRange } from "lucide-react"
import type { PaymentPlan } from "@/lib/types"

interface Props {
  data: PaymentPlan
  onChange: (data: PaymentPlan) => void
  errors: Record<string, string>
}

const PAYMENT_OPTIONS = [
  {
    value: "paid-in-full" as const,
    label: "Paid in Full",
    description: "Pay the entire premium upfront and save on fees",
    icon: CreditCard,
    discount: "Save up to 5%",
  },
  {
    value: "2-pay" as const,
    label: "2 Pay",
    description: "Split into 2 equal payments (every 6 months)",
    icon: CalendarRange,
    discount: "Save up to 3%",
  },
  {
    value: "4-pay" as const,
    label: "4 Pay",
    description: "Split into 4 equal payments (quarterly)",
    icon: CalendarDays,
    discount: "Save up to 2%",
  },
  {
    value: "monthly" as const,
    label: "Monthly",
    description: "Pay monthly installments for budget flexibility",
    icon: Calendar,
    discount: "Standard rate",
  },
]

export function PaymentPlanStep({ data, onChange, errors }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Plan</CardTitle>
        <CardDescription>
          Choose how you would like to pay for the policy. Paying upfront may qualify for additional discounts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={data}
          onValueChange={onChange}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {PAYMENT_OPTIONS.map((option) => {
            const Icon = option.icon
            const isSelected = data === option.value
            return (
              <div key={option.value} className="relative">
                <RadioGroupItem
                  value={option.value}
                  id={`payment-${option.value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`payment-${option.value}`}
                  className={`flex flex-col gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors
                    ${isSelected 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/30"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      isSelected ? "bg-primary/10" : "bg-secondary"
                    }`}>
                      <Icon className={`h-5 w-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      option.value === "paid-in-full"
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-muted-foreground"
                    }`}>
                      {option.discount}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">{option.label}</span>
                    <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                  </div>
                </Label>
              </div>
            )
          })}
        </RadioGroup>
        {errors.paymentPlan && (
          <p className="text-xs text-destructive mt-3">{errors.paymentPlan}</p>
        )}
      </CardContent>
    </Card>
  )
}
