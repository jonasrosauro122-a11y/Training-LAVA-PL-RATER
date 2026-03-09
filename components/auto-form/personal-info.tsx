"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { US_STATES } from "@/lib/types"
import type { PersonalInfo } from "@/lib/types"

interface Props {
  data: PersonalInfo
  onChange: (data: PersonalInfo) => void
  errors: Partial<Record<keyof PersonalInfo, string>>
}

export function PersonalInfoStep({ data, onChange, errors }: Props) {
  function update(field: keyof PersonalInfo, value: string | boolean) {
    const updates: Partial<PersonalInfo> = { [field]: value }
    
    // Auto-update fullName when first or last name changes
    if (field === "firstName" || field === "lastName") {
      const firstName = field === "firstName" ? (value as string) : data.firstName
      const lastName = field === "lastName" ? (value as string) : data.lastName
      updates.fullName = `${firstName} ${lastName}`.trim()
    }
    
    onChange({ ...data, ...updates })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client / Account Information</CardTitle>
        <CardDescription>Enter the customer&apos;s personal information and insurance history.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* Name Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={data.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              placeholder="John"
            />
            {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={data.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              placeholder="Smith"
            />
            {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
          </div>
        </div>

        {/* DOB, Gender, Marital */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dob">Date of Birth *</Label>
            <Input
              id="dob"
              type="date"
              value={data.dateOfBirth}
              onChange={(e) => update("dateOfBirth", e.target.value)}
            />
            {errors.dateOfBirth && <p className="text-xs text-destructive">{errors.dateOfBirth}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Gender *</Label>
            <Select value={data.gender} onValueChange={(v) => update("gender", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-Binary</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-xs text-destructive">{errors.gender}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Marital Status *</Label>
            <Select value={data.maritalStatus} onValueChange={(v) => update("maritalStatus", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
            {errors.maritalStatus && <p className="text-xs text-destructive">{errors.maritalStatus}</p>}
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="(555) 123-4567"
            />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="street">Street Address *</Label>
          <Input
            id="street"
            value={data.street}
            onChange={(e) => update("street", e.target.value)}
            placeholder="123 Main St"
          />
          {errors.street && <p className="text-xs text-destructive">{errors.street}</p>}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={data.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="Springfield"
            />
            {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>State *</Label>
            <Select value={data.state} onValueChange={(v) => update("state", v)}>
              <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
              <SelectContent>
                {US_STATES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && <p className="text-xs text-destructive">{errors.state}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="zip">ZIP *</Label>
            <Input
              id="zip"
              value={data.zip}
              onChange={(e) => update("zip", e.target.value)}
              placeholder="62701"
              maxLength={5}
            />
            {errors.zip && <p className="text-xs text-destructive">{errors.zip}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="county">County</Label>
            <Input
              id="county"
              value={data.county}
              onChange={(e) => update("county", e.target.value)}
              placeholder="Sangamon"
            />
          </div>
        </div>

        {/* Residence Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="yearsAtAddress">Years at Current Address</Label>
            <Input
              id="yearsAtAddress"
              type="number"
              min="0"
              value={data.yearsAtAddress}
              onChange={(e) => update("yearsAtAddress", e.target.value)}
              placeholder="5"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Residence Ownership</Label>
            <Select value={data.ownership} onValueChange={(v) => update("ownership", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="own">Own</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Insurance History */}
        <div className="border-t pt-5 mt-2">
          <h3 className="font-medium text-sm mb-4">Insurance History</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="currentCarrier">Current Carrier</Label>
              <Input
                id="currentCarrier"
                value={data.currentCarrier}
                onChange={(e) => update("currentCarrier", e.target.value)}
                placeholder="e.g. GEICO"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="currentPremium">Current Premium (Annual)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="currentPremium"
                  type="number"
                  value={data.currentPremium}
                  onChange={(e) => update("currentPremium", e.target.value)}
                  placeholder="1200"
                  className="pl-7"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="policyExpiration">Policy Expiration Date</Label>
              <Input
                id="policyExpiration"
                type="date"
                value={data.policyExpiration}
                onChange={(e) => update("policyExpiration", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="priorCoverage">Prior Coverage Duration</Label>
              <Select value={data.priorCoverage} onValueChange={(v) => update("priorCoverage", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Prior Coverage</SelectItem>
                  <SelectItem value="less_than_6_months">Less than 6 months</SelectItem>
                  <SelectItem value="6_to_12_months">6-12 months</SelectItem>
                  <SelectItem value="1_to_2_years">1-2 years</SelectItem>
                  <SelectItem value="2_to_5_years">2-5 years</SelectItem>
                  <SelectItem value="5_plus_years">5+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <Switch
              id="coverageLapses"
              checked={data.coverageLapses}
              onCheckedChange={(v) => update("coverageLapses", v)}
            />
            <Label htmlFor="coverageLapses" className="cursor-pointer text-sm">
              Has had coverage lapses in the past 5 years
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
