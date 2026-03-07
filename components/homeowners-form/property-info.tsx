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

  const currentYear = new Date().getFullYear()
  const roofAge = data.roofYearInstalled 
    ? currentYear - parseInt(data.roofYearInstalled) 
    : null

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

        {/* Bedrooms / Bathrooms / Heating */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bedrooms">Number of Bedrooms *</Label>
            <Select value={data.numberOfBedrooms} onValueChange={(v) => update("numberOfBedrooms", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Bedroom</SelectItem>
                <SelectItem value="2">2 Bedrooms</SelectItem>
                <SelectItem value="3">3 Bedrooms</SelectItem>
                <SelectItem value="4">4 Bedrooms</SelectItem>
                <SelectItem value="5">5 Bedrooms</SelectItem>
                <SelectItem value="6">6+ Bedrooms</SelectItem>
              </SelectContent>
            </Select>
            {errors.numberOfBedrooms && <p className="text-xs text-destructive">{errors.numberOfBedrooms}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bathrooms">Number of Bathrooms (T&B) *</Label>
            <Select value={data.numberOfBathrooms} onValueChange={(v) => update("numberOfBathrooms", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Bathroom</SelectItem>
                <SelectItem value="1.5">1.5 Bathrooms</SelectItem>
                <SelectItem value="2">2 Bathrooms</SelectItem>
                <SelectItem value="2.5">2.5 Bathrooms</SelectItem>
                <SelectItem value="3">3 Bathrooms</SelectItem>
                <SelectItem value="3.5">3.5 Bathrooms</SelectItem>
                <SelectItem value="4">4+ Bathrooms</SelectItem>
              </SelectContent>
            </Select>
            {errors.numberOfBathrooms && <p className="text-xs text-destructive">{errors.numberOfBathrooms}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Heating Type *</Label>
            <Select value={data.heatingType} onValueChange={(v) => update("heatingType", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="gas">Gas (Forced Air)</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="oil">Oil</SelectItem>
                <SelectItem value="propane">Propane</SelectItem>
                <SelectItem value="heat-pump">Heat Pump</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.heatingType && <p className="text-xs text-destructive">{errors.heatingType}</p>}
          </div>
        </div>

        {/* Roof Shape & Material */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Roof Shape *</Label>
            <Select value={data.roofShape} onValueChange={(v) => update("roofShape", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="hip">Hip</SelectItem>
                <SelectItem value="gable">Gable</SelectItem>
                <SelectItem value="flat">Flat</SelectItem>
                <SelectItem value="shed">Shed</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.roofShape && <p className="text-xs text-destructive">{errors.roofShape}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Roof Material *</Label>
            <Select value={data.roofMaterial} onValueChange={(v) => update("roofMaterial", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="asphalt">Asphalt Shingles</SelectItem>
                <SelectItem value="tile">Tile</SelectItem>
                <SelectItem value="metal">Metal</SelectItem>
                <SelectItem value="wood">Wood</SelectItem>
                <SelectItem value="slate">Slate</SelectItem>
              </SelectContent>
            </Select>
            {errors.roofMaterial && <p className="text-xs text-destructive">{errors.roofMaterial}</p>}
          </div>
        </div>

        {/* Roof Year Installed */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="roofYear">Roof Year Installed / Last Updated *</Label>
          <Input
            id="roofYear"
            type="number"
            min="1900"
            max={currentYear}
            value={data.roofYearInstalled}
            onChange={(e) => update("roofYearInstalled", e.target.value)}
            placeholder={String(currentYear - 10)}
          />
          {roofAge !== null && roofAge >= 0 && (
            <p className="text-xs text-muted-foreground">
              Roof age: approximately {roofAge} year{roofAge !== 1 ? "s" : ""} old
              {roofAge > 15 && (
                <span className="text-amber-600 ml-1">
                  - Older roofs may affect premium or eligibility
                </span>
              )}
            </p>
          )}
          {errors.roofYearInstalled && <p className="text-xs text-destructive">{errors.roofYearInstalled}</p>}
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
