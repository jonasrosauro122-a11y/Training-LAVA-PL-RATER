"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { DrivingHistory } from "@/lib/types"

interface Props {
  data: DrivingHistory
  onChange: (data: DrivingHistory) => void
  errors: Partial<Record<keyof DrivingHistory, string>>
}

export function DrivingHistoryStep({ data, onChange, errors }: Props) {
  function update(field: keyof DrivingHistory, value: string | boolean) {
    onChange({ ...data, [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Driving History</CardTitle>
        <CardDescription>Enter the customer&apos;s driving record and prior insurance details.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* Years & License */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="yearsDriving">Years of Driving Experience *</Label>
            <Input
              id="yearsDriving"
              type="number"
              min="0"
              max="70"
              value={data.yearsDriving}
              onChange={(e) => update("yearsDriving", e.target.value)}
              placeholder="5"
            />
            {errors.yearsDriving && <p className="text-xs text-destructive">{errors.yearsDriving}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>License Status *</Label>
            <Select value={data.licenseStatus} onValueChange={(v) => update("licenseStatus", v)}>
              <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="valid">Valid</SelectItem>
                <SelectItem value="permit">Permit</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
            {errors.licenseStatus && <p className="text-xs text-destructive">{errors.licenseStatus}</p>}
          </div>
        </div>

        {/* Accidents & Violations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>At-Fault Accidents (last 5 years) *</Label>
            <Select value={data.atFaultAccidents} onValueChange={(v) => update("atFaultAccidents", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.atFaultAccidents && <p className="text-xs text-destructive">{errors.atFaultAccidents}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Moving Violations (last 3 years) *</Label>
            <Select value={data.movingViolations} onValueChange={(v) => update("movingViolations", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.movingViolations && <p className="text-xs text-destructive">{errors.movingViolations}</p>}
          </div>
        </div>

        {/* Prior Insurance */}
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex items-center gap-3">
            <Switch
              id="priorInsurance"
              checked={data.priorInsurance}
              onCheckedChange={(v) => update("priorInsurance", v)}
            />
            <Label htmlFor="priorInsurance" className="cursor-pointer">
              Currently has prior insurance
            </Label>
          </div>

          {data.priorInsurance && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-4 border-l-2 border-primary/20">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="priorCarrier">Prior Carrier Name</Label>
                <Input
                  id="priorCarrier"
                  value={data.priorCarrier}
                  onChange={(e) => update("priorCarrier", e.target.value)}
                  placeholder="GEICO"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="yearsWithCarrier">Years with Carrier</Label>
                <Input
                  id="yearsWithCarrier"
                  type="number"
                  min="0"
                  max="50"
                  value={data.yearsWithCarrier}
                  onChange={(e) => update("yearsWithCarrier", e.target.value)}
                  placeholder="3"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
