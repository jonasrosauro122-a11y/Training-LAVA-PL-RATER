"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { AutoCoverage } from "@/lib/types"

interface Props {
  data: AutoCoverage
  onChange: (data: AutoCoverage) => void
  errors: Partial<Record<keyof AutoCoverage, string>>
}

export function CoverageOptionsStep({ data, onChange, errors }: Props) {
  function update(field: keyof AutoCoverage, value: string) {
    onChange({ ...data, [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coverage Options</CardTitle>
        <CardDescription>
          Select liability limits and policy-wide coverage options. 
          Vehicle-specific coverages (deductibles, rental, roadside) are configured per vehicle.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* Liability */}
        <div className="flex flex-col gap-1.5">
          <Label>Bodily Injury / Property Damage Liability *</Label>
          <Select value={data.liabilityLimit} onValueChange={(v) => update("liabilityLimit", v)}>
            <SelectTrigger><SelectValue placeholder="Select limits" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="25/50">25/50 ($25k/$50k) - State Minimum</SelectItem>
              <SelectItem value="50/100">50/100 ($50k/$100k)</SelectItem>
              <SelectItem value="100/300">100/300 ($100k/$300k) - Recommended</SelectItem>
              <SelectItem value="250/500">250/500 ($250k/$500k) - Premium</SelectItem>
            </SelectContent>
          </Select>
          {errors.liabilityLimit && <p className="text-xs text-destructive">{errors.liabilityLimit}</p>}
        </div>

        {/* UM/UIM - Now a dropdown instead of toggle */}
        <div className="flex flex-col gap-1.5">
          <Label>Uninsured / Underinsured Motorist (UM/UIM) *</Label>
          <Select value={data.uninsuredMotorist} onValueChange={(v) => update("uninsuredMotorist", v)}>
            <SelectTrigger><SelectValue placeholder="Select coverage option" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Coverage</SelectItem>
              <SelectItem value="state-minimum">State Minimum (25/50)</SelectItem>
              <SelectItem value="standard">Standard Limits (100/300) - Recommended</SelectItem>
            </SelectContent>
          </Select>
          {errors.uninsuredMotorist && <p className="text-xs text-destructive">{errors.uninsuredMotorist}</p>}
          {data.uninsuredMotorist === "none" && (
            <p className="text-xs text-amber-600">
              Without UM/UIM coverage, you may have limited protection if involved in an accident with an uninsured driver.
            </p>
          )}
        </div>

        {/* UM/UIM Limits - shown when UM/UIM is enabled */}
        {data.uninsuredMotorist && data.uninsuredMotorist !== "none" && (
          <div className="pl-4 border-l-2 border-primary/20">
            <div className="flex flex-col gap-1.5">
              <Label>UM/UIM Limits</Label>
              <Select value={data.uninsuredLimit} onValueChange={(v) => update("uninsuredLimit", v)}>
                <SelectTrigger><SelectValue placeholder="Select limits" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="25/50">25/50 ($25k/$50k)</SelectItem>
                  <SelectItem value="50/100">50/100 ($50k/$100k)</SelectItem>
                  <SelectItem value="100/300">100/300 ($100k/$300k)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {data.uninsuredMotorist === "state-minimum" 
                  ? "State minimum limits applied automatically"
                  : "Choose limits that match or are lower than your liability limits"}
              </p>
            </div>
          </div>
        )}

        {/* Medical Payments - with No Coverage option */}
        <div className="flex flex-col gap-1.5">
          <Label>Medical Payments / PIP</Label>
          <Select value={data.medicalPayments} onValueChange={(v) => update("medicalPayments", v)}>
            <SelectTrigger><SelectValue placeholder="Select amount" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Coverage</SelectItem>
              <SelectItem value="1000">$1,000</SelectItem>
              <SelectItem value="5000">$5,000</SelectItem>
              <SelectItem value="10000">$10,000</SelectItem>
              <SelectItem value="25000">$25,000</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Medical Payments covers medical expenses for you and passengers regardless of fault.
          </p>
          {data.medicalPayments === "none" && (
            <p className="text-xs text-amber-600">
              Without MedPay, you may need to rely solely on health insurance for accident-related medical expenses.
            </p>
          )}
        </div>

        {/* Info box about vehicle-specific coverages */}
        <div className="bg-secondary/50 rounded-lg p-4 mt-2">
          <p className="text-sm font-medium text-foreground mb-1">Vehicle-Specific Coverages</p>
          <p className="text-xs text-muted-foreground">
            Deductibles, Rental Reimbursement, and Roadside Assistance are now configured 
            individually for each vehicle in the Vehicle Information step. This allows you to 
            customize coverage based on each {"vehicle's"} needs and value.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
