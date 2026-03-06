"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { HomeownersClaims } from "@/lib/types"

interface Props {
  data: HomeownersClaims
  onChange: (data: HomeownersClaims) => void
  errors: Partial<Record<keyof HomeownersClaims, string>>
}

const CLAIM_TYPES = [
  { value: "weather", label: "Weather / Wind / Hail" },
  { value: "theft", label: "Theft / Burglary" },
  { value: "water", label: "Water Damage" },
  { value: "fire", label: "Fire" },
  { value: "liability", label: "Liability / Injury" },
]

export function ClaimsHistoryStep({ data, onChange, errors }: Props) {
  function update(field: keyof HomeownersClaims, value: string | string[]) {
    onChange({ ...data, [field]: value })
  }

  function toggleClaimType(type: string) {
    const current = data.claimTypes || []
    if (current.includes(type)) {
      update("claimTypes", current.filter((t) => t !== type))
    } else {
      update("claimTypes", [...current, type])
    }
  }

  const numClaims = parseInt(data.numberOfClaims || "0")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Claims History</CardTitle>
        <CardDescription>Enter prior claims and previous carrier information.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label>Number of Claims (last 5 years) *</Label>
          <Select value={data.numberOfClaims} onValueChange={(v) => update("numberOfClaims", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.numberOfClaims && <p className="text-xs text-destructive">{errors.numberOfClaims}</p>}
        </div>

        {numClaims > 0 && (
          <div className="flex flex-col gap-2 pl-4 border-l-2 border-primary/20">
            <Label className="text-sm">Claim Types</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CLAIM_TYPES.map((ct) => (
                <div key={ct.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`claim-${ct.value}`}
                    checked={(data.claimTypes || []).includes(ct.value)}
                    onCheckedChange={() => toggleClaimType(ct.value)}
                  />
                  <Label htmlFor={`claim-${ct.value}`} className="cursor-pointer text-sm">
                    {ct.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="priorCarrier">Prior Insurance Carrier</Label>
          <Input
            id="priorCarrier"
            value={data.priorCarrier}
            onChange={(e) => update("priorCarrier", e.target.value)}
            placeholder="State Farm"
          />
        </div>
      </CardContent>
    </Card>
  )
}
