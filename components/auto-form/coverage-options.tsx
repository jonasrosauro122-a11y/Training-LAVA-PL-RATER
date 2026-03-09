"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { AutoCoverage } from "@/lib/types"

interface Props {
  data: AutoCoverage
  onChange: (data: AutoCoverage) => void
  errors: Partial<Record<keyof AutoCoverage, string>>
  paymentPlan?: string
  onPaymentPlanChange?: (plan: "full" | "2pay" | "4pay" | "monthly" | "") => void
}

export function CoverageOptionsStep({ data, onChange, errors, paymentPlan, onPaymentPlanChange }: Props) {
  function update(field: keyof AutoCoverage, value: string | boolean) {
    onChange({ ...data, [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coverage Options</CardTitle>
        <CardDescription>Select liability limits, deductibles, and additional coverages.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* Liability Coverage */}
        <div className="border-b pb-5">
          <h3 className="font-medium text-sm mb-4">Liability Coverage</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="flex flex-col gap-1.5">
              <Label>Property Damage Limit</Label>
              <Select value={data.propertyDamageLimit} onValueChange={(v) => update("propertyDamageLimit", v)}>
                <SelectTrigger><SelectValue placeholder="Select limit" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">$25,000</SelectItem>
                  <SelectItem value="50">$50,000</SelectItem>
                  <SelectItem value="100">$100,000</SelectItem>
                  <SelectItem value="250">$250,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* UM/UIM Coverage */}
        <div className="border-b pb-5">
          <h3 className="font-medium text-sm mb-4">Uninsured / Underinsured Motorist</h3>
          <div className="flex flex-col gap-1.5">
            <Label>UM/UIM Coverage</Label>
            <Select value={data.umUimCoverage} onValueChange={(v) => update("umUimCoverage", v)}>
              <SelectTrigger><SelectValue placeholder="Select coverage" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Coverage</SelectItem>
                <SelectItem value="state_min">State Minimum</SelectItem>
                <SelectItem value="standard">Standard Limits (Match Liability)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* PIP / Medical Payments */}
        <div className="border-b pb-5">
          <h3 className="font-medium text-sm mb-4">Medical Coverage</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Personal Injury Protection (PIP)</Label>
              <Select value={data.pip} onValueChange={(v) => update("pip", v)}>
                <SelectTrigger><SelectValue placeholder="Select amount" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Coverage</SelectItem>
                  <SelectItem value="2500">$2,500</SelectItem>
                  <SelectItem value="5000">$5,000</SelectItem>
                  <SelectItem value="10000">$10,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Medical Payments</Label>
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
            </div>
          </div>
        </div>

        {/* Vehicle Coverage - Deductibles */}
        <div className="border-b pb-5">
          <h3 className="font-medium text-sm mb-4">Vehicle Coverage Deductibles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Comprehensive Deductible</Label>
              <Select value={data.compDeductible} onValueChange={(v) => update("compDeductible", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Coverage</SelectItem>
                  <SelectItem value="250">$250</SelectItem>
                  <SelectItem value="500">$500</SelectItem>
                  <SelectItem value="1000">$1,000</SelectItem>
                  <SelectItem value="2000">$2,000</SelectItem>
                </SelectContent>
              </Select>
              {errors.compDeductible && <p className="text-xs text-destructive">{errors.compDeductible}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Collision Deductible</Label>
              <Select value={data.collisionDeductible} onValueChange={(v) => update("collisionDeductible", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Coverage</SelectItem>
                  <SelectItem value="250">$250</SelectItem>
                  <SelectItem value="500">$500</SelectItem>
                  <SelectItem value="1000">$1,000</SelectItem>
                  <SelectItem value="2000">$2,000</SelectItem>
                </SelectContent>
              </Select>
              {errors.collisionDeductible && <p className="text-xs text-destructive">{errors.collisionDeductible}</p>}
            </div>
          </div>
        </div>

        {/* Optional Coverages */}
        <div className="border-b pb-5">
          <h3 className="font-medium text-sm mb-4">Optional Coverages</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Switch
                  id="rental"
                  checked={data.rentalReimbursement}
                  onCheckedChange={(v) => update("rentalReimbursement", v)}
                />
                <Label htmlFor="rental" className="cursor-pointer">
                  Rental Reimbursement
                </Label>
              </div>
              {data.rentalReimbursement && (
                <div className="pl-4 border-l-2 border-primary/20">
                  <Select value={data.rentalDailyLimit} onValueChange={(v) => update("rentalDailyLimit", v)}>
                    <SelectTrigger><SelectValue placeholder="Daily limit" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">$30/day</SelectItem>
                      <SelectItem value="50">$50/day</SelectItem>
                      <SelectItem value="75">$75/day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="roadside"
                checked={data.roadsideAssistance}
                onCheckedChange={(v) => update("roadsideAssistance", v)}
              />
              <Label htmlFor="roadside" className="cursor-pointer">
                Roadside Assistance
              </Label>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <Switch
              id="gap"
              checked={data.gapCoverage}
              onCheckedChange={(v) => update("gapCoverage", v)}
            />
            <Label htmlFor="gap" className="cursor-pointer">
              Gap Coverage
            </Label>
            <span className="text-xs text-muted-foreground">(Covers difference between vehicle value and loan balance)</span>
          </div>
        </div>

        {/* Payment Plan */}
        {onPaymentPlanChange && (
          <div>
            <h3 className="font-medium text-sm mb-4">Payment Plan</h3>
            <div className="flex flex-col gap-1.5">
              <Label>Payment Option</Label>
              <Select value={paymentPlan} onValueChange={(v) => onPaymentPlanChange(v as "full" | "2pay" | "4pay" | "monthly" | "")}>
                <SelectTrigger><SelectValue placeholder="Select payment plan" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Paid In Full</SelectItem>
                  <SelectItem value="2pay">2 Pay (Semi-Annual)</SelectItem>
                  <SelectItem value="4pay">4 Pay (Quarterly)</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
