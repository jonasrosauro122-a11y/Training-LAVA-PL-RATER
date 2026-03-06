"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { PropertyInfo } from "@/lib/types"

interface Props {
  data: PropertyInfo
  onChange: (data: PropertyInfo) => void
  errors: Partial<Record<keyof PropertyInfo, string>>
}

export function PropertyInfoStep({ data, onChange, errors }: Props) {
  function update(field: keyof PropertyInfo, value: string | boolean) {
    onChange({ ...data, [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Information</CardTitle>
        <CardDescription>Enter details about the insured property.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* Policy Type */}
        <div className="flex flex-col gap-2">
          <Label>Policy Type *</Label>
          <RadioGroup
            value={data.policyType}
            onValueChange={(v) => update("policyType", v)}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {[
              { value: "HO3", label: "HO3 - Homeowners", desc: "Standard home policy" },
              { value: "HO4", label: "HO4 - Renters", desc: "For tenants" },
              { value: "HO6", label: "HO6 - Condo", desc: "For condo owners" },
            ].map((opt) => (
              <div key={opt.value} className="relative">
                <RadioGroupItem value={opt.value} id={`policy-${opt.value}`} className="peer sr-only" />
                <Label
                  htmlFor={`policy-${opt.value}`}
                  className="flex flex-col gap-1 rounded-lg border-2 border-border p-4 cursor-pointer transition-colors hover:border-primary/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                >
                  <span className="font-medium text-foreground">{opt.label}</span>
                  <span className="text-xs text-muted-foreground">{opt.desc}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
          {errors.policyType && <p className="text-xs text-destructive">{errors.policyType}</p>}
        </div>

        {/* Year Built / SqFt / Stories */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="yearBuilt">Year Built *</Label>
            <Input
              id="yearBuilt"
              type="number"
              value={data.yearBuilt}
              onChange={(e) => update("yearBuilt", e.target.value)}
              placeholder="1995"
            />
            {errors.yearBuilt && <p className="text-xs text-destructive">{errors.yearBuilt}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sqft">Square Footage *</Label>
            <Input
              id="sqft"
              type="number"
              value={data.squareFootage}
              onChange={(e) => update("squareFootage", e.target.value)}
              placeholder="2000"
            />
            {errors.squareFootage && <p className="text-xs text-destructive">{errors.squareFootage}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="stories">Stories *</Label>
            <Select value={data.stories} onValueChange={(v) => update("stories", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Story</SelectItem>
                <SelectItem value="1.5">1.5 Stories</SelectItem>
                <SelectItem value="2">2 Stories</SelectItem>
                <SelectItem value="3">3+ Stories</SelectItem>
              </SelectContent>
            </Select>
            {errors.stories && <p className="text-xs text-destructive">{errors.stories}</p>}
          </div>
        </div>

        {/* Roof */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Roof Type *</Label>
            <Select value={data.roofType} onValueChange={(v) => update("roofType", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="asphalt">Asphalt Shingles</SelectItem>
                <SelectItem value="tile">Tile</SelectItem>
                <SelectItem value="metal">Metal</SelectItem>
                <SelectItem value="slate">Slate</SelectItem>
              </SelectContent>
            </Select>
            {errors.roofType && <p className="text-xs text-destructive">{errors.roofType}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="roofAge">Roof Age (years) *</Label>
            <Input
              id="roofAge"
              type="number"
              min="0"
              max="50"
              value={data.roofAge}
              onChange={(e) => update("roofAge", e.target.value)}
              placeholder="10"
            />
            {errors.roofAge && <p className="text-xs text-destructive">{errors.roofAge}</p>}
          </div>
        </div>

        {/* Construction & Foundation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Construction Type *</Label>
            <Select value={data.constructionType} onValueChange={(v) => update("constructionType", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="frame">Frame</SelectItem>
                <SelectItem value="masonry">Masonry / Brick</SelectItem>
                <SelectItem value="steel">Steel</SelectItem>
              </SelectContent>
            </Select>
            {errors.constructionType && <p className="text-xs text-destructive">{errors.constructionType}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Foundation *</Label>
            <Select value={data.foundation} onValueChange={(v) => update("foundation", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="slab">Slab</SelectItem>
                <SelectItem value="basement">Basement</SelectItem>
                <SelectItem value="crawlspace">Crawlspace</SelectItem>
              </SelectContent>
            </Select>
            {errors.foundation && <p className="text-xs text-destructive">{errors.foundation}</p>}
          </div>
        </div>

        {/* Risk Factors */}
        <div className="flex flex-col gap-3 pt-2">
          <Label className="text-sm font-medium">Property Risk Factors</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Switch id="security" checked={data.securitySystem} onCheckedChange={(v) => update("securitySystem", v)} />
              <Label htmlFor="security" className="cursor-pointer text-sm">Security System</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="pool" checked={data.swimmingPool} onCheckedChange={(v) => update("swimmingPool", v)} />
              <Label htmlFor="pool" className="cursor-pointer text-sm">Swimming Pool</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="trampoline" checked={data.trampoline} onCheckedChange={(v) => update("trampoline", v)} />
              <Label htmlFor="trampoline" className="cursor-pointer text-sm">Trampoline</Label>
            </div>
          </div>
        </div>

        {/* Distance to Fire */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fireDept">Distance to Fire Dept. (miles)</Label>
            <Input
              id="fireDept"
              type="number"
              step="0.1"
              min="0"
              value={data.distanceToFireDept}
              onChange={(e) => update("distanceToFireDept", e.target.value)}
              placeholder="2.5"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fireHydrant">Distance to Fire Hydrant (feet)</Label>
            <Input
              id="fireHydrant"
              type="number"
              min="0"
              value={data.distanceToFireHydrant}
              onChange={(e) => update("distanceToFireHydrant", e.target.value)}
              placeholder="500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
