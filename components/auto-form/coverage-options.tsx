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
}

export function CoverageOptionsStep({ data, onChange, errors }: Props) {
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

        {/* Deductibles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Comprehensive Deductible *</Label>
            <Select value={data.compDeductible} onValueChange={(v) => update("compDeductible", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="250">$250</SelectItem>
                <SelectItem value="500">$500</SelectItem>
                <SelectItem value="1000">$1,000</SelectItem>
                <SelectItem value="2000">$2,000</SelectItem>
              </SelectContent>
            </Select>
            {errors.compDeductible && <p className="text-xs text-destructive">{errors.compDeductible}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Collision Deductible *</Label>
            <Select value={data.collisionDeductible} onValueChange={(v) => update("collisionDeductible", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="250">$250</SelectItem>
                <SelectItem value="500">$500</SelectItem>
                <SelectItem value="1000">$1,000</SelectItem>
                <SelectItem value="2000">$2,000</SelectItem>
              </SelectContent>
            </Select>
            {errors.collisionDeductible && <p className="text-xs text-destructive">{errors.collisionDeductible}</p>}
          </div>
        </div>

        {/* UM/UIM */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Switch
              id="uninsured"
              checked={data.uninsuredMotorist}
              onCheckedChange={(v) => update("uninsuredMotorist", v)}
            />
            <Label htmlFor="uninsured" className="cursor-pointer">
              Uninsured / Underinsured Motorist
            </Label>
          </div>
          {data.uninsuredMotorist && (
            <div className="pl-4 border-l-2 border-primary/20">
              <Label>UM/UIM Limits</Label>
              <Select value={data.uninsuredLimit} onValueChange={(v) => update("uninsuredLimit", v)}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="25/50">25/50</SelectItem>
                  <SelectItem value="50/100">50/100</SelectItem>
                  <SelectItem value="100/300">100/300</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Medical Payments */}
        <div className="flex flex-col gap-1.5">
          <Label>Medical Payments / PIP</Label>
          <Select value={data.medicalPayments} onValueChange={(v) => update("medicalPayments", v)}>
            <SelectTrigger><SelectValue placeholder="Select amount" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1000">$1,000</SelectItem>
              <SelectItem value="5000">$5,000</SelectItem>
              <SelectItem value="10000">$10,000</SelectItem>
              <SelectItem value="25000">$25,000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rental & Roadside */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
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
      </CardContent>
    </Card>
  )
}
