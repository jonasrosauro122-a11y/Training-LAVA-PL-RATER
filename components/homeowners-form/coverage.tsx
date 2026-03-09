"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { HomeownersCoverageOptions } from "@/lib/types"

interface Props {
  data: HomeownersCoverageOptions
  onChange: (data: HomeownersCoverageOptions) => void
  errors: Partial<Record<keyof HomeownersCoverageOptions, string>>
}

export function CoverageStep({ data, onChange, errors }: Props) {
  function update(field: keyof HomeownersCoverageOptions, value: string) {
    onChange({ ...data, [field]: value })
  }

  const dwellingAmount = parseInt(data.dwellingCoverage || "0")
  const otherStructuresPct = parseInt(data.otherStructures || "10")
  const personalPropPct = parseInt(data.personalProperty || "50")
  const lossPct = parseInt(data.lossOfUse || "20")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coverage Options</CardTitle>
        <CardDescription>Set dwelling coverage and related limits.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* Dwelling Coverage (Coverage A) */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dwelling">Coverage A: Dwelling *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="dwelling"
              type="number"
              min="25000"
              step="5000"
              value={data.dwellingCoverage}
              onChange={(e) => update("dwellingCoverage", e.target.value)}
              placeholder="250000"
              className="pl-7"
            />
          </div>
          {errors.dwellingCoverage && <p className="text-xs text-destructive">{errors.dwellingCoverage}</p>}
          <p className="text-xs text-muted-foreground">
            The amount to rebuild your home in case of total loss
          </p>
        </div>

        {/* Coverage B, C, D - Derived coverages */}
        <div className="border-t pt-5 mt-2">
          <h3 className="font-medium text-sm mb-4">Additional Coverages (based on Coverage A)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Coverage B: Other Structures (% of A)</Label>
              <Select value={data.otherStructures || "10"} onValueChange={(v) => update("otherStructures", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="10">10% (Standard)</SelectItem>
                  <SelectItem value="15">15%</SelectItem>
                  <SelectItem value="20">20%</SelectItem>
                </SelectContent>
              </Select>
              {dwellingAmount > 0 && (
                <p className="text-xs text-muted-foreground">
                  = ${(dwellingAmount * otherStructuresPct / 100).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Coverage C: Personal Property (% of A)</Label>
              <Select value={data.personalProperty || "50"} onValueChange={(v) => update("personalProperty", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25%</SelectItem>
                  <SelectItem value="50">50% (Standard)</SelectItem>
                  <SelectItem value="75">75%</SelectItem>
                </SelectContent>
              </Select>
              {dwellingAmount > 0 && (
                <p className="text-xs text-muted-foreground">
                  = ${(dwellingAmount * personalPropPct / 100).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Coverage D: Loss of Use (% of A)</Label>
              <Select value={data.lossOfUse || "20"} onValueChange={(v) => update("lossOfUse", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10%</SelectItem>
                  <SelectItem value="20">20% (Standard)</SelectItem>
                  <SelectItem value="30">30%</SelectItem>
                </SelectContent>
              </Select>
              {dwellingAmount > 0 && (
                <p className="text-xs text-muted-foreground">
                  = ${(dwellingAmount * lossPct / 100).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Liability & Medical */}
        <div className="border-t pt-5 mt-2">
          <h3 className="font-medium text-sm mb-4">Liability & Medical Payments</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Liability Limit *</Label>
              <Select value={data.liability} onValueChange={(v) => update("liability", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="100000">$100,000</SelectItem>
                  <SelectItem value="300000">$300,000 (Recommended)</SelectItem>
                  <SelectItem value="500000">$500,000</SelectItem>
                </SelectContent>
              </Select>
              {errors.liability && <p className="text-xs text-destructive">{errors.liability}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>MedPay Limit</Label>
              <Select value={data.medicalPayments} onValueChange={(v) => update("medicalPayments", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1000">$1,000</SelectItem>
                  <SelectItem value="5000">$5,000</SelectItem>
                  <SelectItem value="10000">$10,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Deductible */}
        <div className="border-t pt-5 mt-2">
          <h3 className="font-medium text-sm mb-4">Deductible</h3>
          <div className="flex flex-col gap-1.5">
            <Label>Deductible (All Perils) *</Label>
            <Select value={data.deductible} onValueChange={(v) => update("deductible", v)}>
              <SelectTrigger><SelectValue placeholder="Select deductible" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="500">$500</SelectItem>
                <SelectItem value="1000">$1,000 (Standard)</SelectItem>
                <SelectItem value="2500">$2,500</SelectItem>
                <SelectItem value="5000">$5,000</SelectItem>
              </SelectContent>
            </Select>
            {errors.deductible && <p className="text-xs text-destructive">{errors.deductible}</p>}
            <p className="text-xs text-muted-foreground">
              Higher deductibles typically result in lower premiums
            </p>
          </div>
        </div>

        {/* Coverage Summary */}
        {dwellingAmount > 0 && (
          <div className="border-t pt-5 mt-2 bg-secondary/30 rounded-lg p-4">
            <h3 className="font-medium text-sm mb-4">Coverage Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Coverage A (Dwelling):</div>
              <div className="font-medium">${dwellingAmount.toLocaleString()}</div>
              <div>Coverage B (Other Structures):</div>
              <div className="font-medium">${(dwellingAmount * otherStructuresPct / 100).toLocaleString()}</div>
              <div>Coverage C (Personal Property):</div>
              <div className="font-medium">${(dwellingAmount * personalPropPct / 100).toLocaleString()}</div>
              <div>Coverage D (Loss of Use):</div>
              <div className="font-medium">${(dwellingAmount * lossPct / 100).toLocaleString()}</div>
              <div>Liability:</div>
              <div className="font-medium">${parseInt(data.liability || "0").toLocaleString()}</div>
              <div>Deductible:</div>
              <div className="font-medium">${parseInt(data.deductible || "0").toLocaleString()}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
