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
        {/* Dwelling */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dwelling">Dwelling Coverage (Coverage A) *</Label>
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
        </div>

        {/* Derived coverages */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Other Structures (% of A)</Label>
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
            <Label>Personal Property (% of A)</Label>
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
            <Label>Loss of Use (% of A)</Label>
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

        {/* Liability & Medical */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Personal Liability *</Label>
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
            <Label>Medical Payments</Label>
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
      </CardContent>
    </Card>
  )
}
