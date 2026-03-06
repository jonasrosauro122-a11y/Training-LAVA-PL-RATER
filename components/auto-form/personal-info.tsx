"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { US_STATES } from "@/lib/types"
import type { PersonalInfo } from "@/lib/types"

interface Props {
  data: PersonalInfo
  onChange: (data: PersonalInfo) => void
  errors: Partial<Record<keyof PersonalInfo, string>>
}

export function PersonalInfoStep({ data, onChange, errors }: Props) {
  function update(field: keyof PersonalInfo, value: string) {
    onChange({ ...data, [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Enter the customer&apos;s basic details and address.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* Name Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={data.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              placeholder="John Smith"
            />
            {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
          </div>
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
        </div>

        {/* Gender & Marital */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Gender *</Label>
            <Select value={data.gender} onValueChange={(v) => update("gender", v)}>
              <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
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
              <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="john@example.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
