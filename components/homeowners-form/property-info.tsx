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

        {/* Property Type */}
        <div className="flex flex-col gap-1.5">
          <Label>Property Type *</Label>
          <Select value={data.propertyType} onValueChange={(v) => update("propertyType", v)}>
            <SelectTrigger><SelectValue placeholder="Select property type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="single_family">Single Family</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
            </SelectContent>
          </Select>
          {errors.propertyType && <p className="text-xs text-destructive">{errors.propertyType}</p>}
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

        {/* Roof Information */}
        <div className="border-t pt-5 mt-2">
          <h3 className="font-medium text-sm mb-4">Roof Information</h3>
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
              <Select value={data.roofType} onValueChange={(v) => update("roofType", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="asphalt">Asphalt Shingles</SelectItem>
                  <SelectItem value="tile">Tile</SelectItem>
                  <SelectItem value="metal">Metal</SelectItem>
                  <SelectItem value="wood">Wood</SelectItem>
                  <SelectItem value="slate">Slate</SelectItem>
                </SelectContent>
              </Select>
              {errors.roofType && <p className="text-xs text-destructive">{errors.roofType}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
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
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="yearRoofUpdated">Year Roof Installed/Updated</Label>
              <Input
                id="yearRoofUpdated"
                type="number"
                value={data.yearRoofUpdated}
                onChange={(e) => update("yearRoofUpdated", e.target.value)}
                placeholder="2015"
              />
            </div>
          </div>
        </div>

        {/* Construction & Foundation */}
        <div className="border-t pt-5 mt-2">
          <h3 className="font-medium text-sm mb-4">Construction Details</h3>
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
        </div>

        {/* Interior Details */}
        <div className="border-t pt-5 mt-2">
          <h3 className="font-medium text-sm mb-4">Interior Details</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                min="0"
                max="20"
                value={data.bedrooms}
                onChange={(e) => update("bedrooms", e.target.value)}
                placeholder="3"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bathrooms">Bathrooms (T&B)</Label>
              <Input
                id="bathrooms"
                type="number"
                min="0"
                max="20"
                step="0.5"
                value={data.bathrooms}
                onChange={(e) => update("bathrooms", e.target.value)}
                placeholder="2"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Heating Type</Label>
              <Select value={data.heatingType} onValueChange={(v) => update("heatingType", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="central">Central</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="gas">Gas</SelectItem>
                  <SelectItem value="oil">Oil</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Cooling Type</Label>
              <Select value={data.coolingType} onValueChange={(v) => update("coolingType", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="central">Central AC</SelectItem>
                  <SelectItem value="window">Window Units</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Home Risk & Security */}
        <div className="border-t pt-5 mt-2">
          <h3 className="font-medium text-sm mb-4">Home Risk & Security</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Switch id="fireAlarm" checked={data.fireAlarm} onCheckedChange={(v) => update("fireAlarm", v)} />
              <Label htmlFor="fireAlarm" className="cursor-pointer text-sm">Fire/Smoke Alarm</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="security" checked={data.securitySystem} onCheckedChange={(v) => update("securitySystem", v)} />
              <Label htmlFor="security" className="cursor-pointer text-sm">Security System</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="deadbolts" checked={data.deadbolts} onCheckedChange={(v) => update("deadbolts", v)} />
              <Label htmlFor="deadbolts" className="cursor-pointer text-sm">Deadbolts on Doors</Label>
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

        {/* Fire Station Distance */}
        <div className="border-t pt-5 mt-2">
          <h3 className="font-medium text-sm mb-4">Fire Protection</h3>
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
        </div>
      </CardContent>
    </Card>
  )
}
