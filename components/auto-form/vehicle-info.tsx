"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { US_STATES } from "@/lib/types"
import type { VehicleInfo } from "@/lib/types"
import { decodeVin } from "@/lib/vin-decoder"

interface Props {
  data: VehicleInfo
  onChange: (data: VehicleInfo) => void
  errors: Partial<Record<keyof VehicleInfo, string>>
}

export function VehicleInfoStep({ data, onChange, errors }: Props) {
  const [vinLoading, setVinLoading] = useState(false)
  const [vinStatus, setVinStatus] = useState<"idle" | "success" | "error">("idle")
  const [vinMessage, setVinMessage] = useState("")

  function update(field: keyof VehicleInfo, value: string | boolean) {
    onChange({ ...data, [field]: value })
  }

  async function handleVinLookup() {
    if (!data.vin || data.vin.length !== 17) {
      setVinStatus("error")
      setVinMessage("VIN must be exactly 17 characters")
      return
    }

    setVinLoading(true)
    setVinStatus("idle")
    setVinMessage("")

    const result = await decodeVin(data.vin)

    if (result.error && !result.year) {
      setVinStatus("error")
      setVinMessage(result.error)
    } else {
      onChange({
        ...data,
        year: result.year || data.year,
        make: result.make || data.make,
        model: result.model || data.model,
        bodyType: result.bodyClass || data.bodyType,
      })
      setVinStatus("success")
      setVinMessage(
        result.error
          ? `Partial decode: ${result.year} ${result.make} ${result.model}`
          : `Found: ${result.year} ${result.make} ${result.model}`
      )
    }

    setVinLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Information</CardTitle>
        <CardDescription>
          Enter the VIN to auto-populate vehicle details, or fill in manually.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* VIN Lookup */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="vin">VIN (Vehicle Identification Number) *</Label>
          <div className="flex gap-2">
            <Input
              id="vin"
              value={data.vin}
              onChange={(e) => {
                update("vin", e.target.value.toUpperCase())
                if (vinStatus !== "idle") {
                  setVinStatus("idle")
                  setVinMessage("")
                }
              }}
              placeholder="1HGBH41JXMN109186"
              maxLength={17}
              className="font-mono uppercase"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleVinLookup}
              disabled={vinLoading || data.vin.length !== 17}
              className="shrink-0 gap-2"
            >
              {vinLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Lookup
            </Button>
          </div>
          {errors.vin && <p className="text-xs text-destructive">{errors.vin}</p>}
          {vinStatus === "success" && (
            <div className="flex items-center gap-1.5 text-xs text-success">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {vinMessage}
            </div>
          )}
          {vinStatus === "error" && (
            <div className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5" />
              {vinMessage}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            {data.vin.length}/17 characters
          </p>
        </div>

        {/* Year / Make / Model */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="year">Year *</Label>
            <Input
              id="year"
              value={data.year}
              onChange={(e) => update("year", e.target.value)}
              placeholder="2023"
              maxLength={4}
            />
            {errors.year && <p className="text-xs text-destructive">{errors.year}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="make">Make *</Label>
            <Input
              id="make"
              value={data.make}
              onChange={(e) => update("make", e.target.value)}
              placeholder="Honda"
            />
            {errors.make && <p className="text-xs text-destructive">{errors.make}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="model">Model *</Label>
            <Input
              id="model"
              value={data.model}
              onChange={(e) => update("model", e.target.value)}
              placeholder="Civic"
            />
            {errors.model && <p className="text-xs text-destructive">{errors.model}</p>}
          </div>
        </div>

        {/* Use & Mileage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Primary Use *</Label>
            <Select value={data.primaryUse} onValueChange={(v) => update("primaryUse", v)}>
              <SelectTrigger><SelectValue placeholder="Select use" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="commute">Commute</SelectItem>
                <SelectItem value="pleasure">Pleasure</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
            {errors.primaryUse && <p className="text-xs text-destructive">{errors.primaryUse}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="mileage">Annual Mileage *</Label>
            <Input
              id="mileage"
              type="number"
              value={data.annualMileage}
              onChange={(e) => update("annualMileage", e.target.value)}
              placeholder="12000"
            />
            {errors.annualMileage && <p className="text-xs text-destructive">{errors.annualMileage}</p>}
          </div>
        </div>

        {/* Garaging Address */}
        <div className="flex items-center gap-3 pt-2">
          <Switch
            id="garagingSame"
            checked={data.garagingSameAsPersonal}
            onCheckedChange={(v) => update("garagingSameAsPersonal", v)}
          />
          <Label htmlFor="garagingSame" className="cursor-pointer">
            Garaging address same as personal address
          </Label>
        </div>

        {!data.garagingSameAsPersonal && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pl-4 border-l-2 border-primary/20">
            <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-4">
              <Label htmlFor="gStreet">Garaging Street</Label>
              <Input
                id="gStreet"
                value={data.garagingStreet}
                onChange={(e) => update("garagingStreet", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gCity">City</Label>
              <Input
                id="gCity"
                value={data.garagingCity}
                onChange={(e) => update("garagingCity", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>State</Label>
              <Select value={data.garagingState} onValueChange={(v) => update("garagingState", v)}>
                <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
                <SelectContent>
                  {US_STATES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gZip">ZIP</Label>
              <Input
                id="gZip"
                value={data.garagingZip}
                onChange={(e) => update("garagingZip", e.target.value)}
                maxLength={5}
              />
            </div>
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-3">
            <Switch
              id="antiTheft"
              checked={data.antiTheft}
              onCheckedChange={(v) => update("antiTheft", v)}
            />
            <Label htmlFor="antiTheft" className="cursor-pointer">Anti-Theft Device</Label>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Vehicle Ownership *</Label>
            <Select value={data.ownership} onValueChange={(v) => update("ownership", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="owned">Owned</SelectItem>
                <SelectItem value="financed">Financed</SelectItem>
                <SelectItem value="leased">Leased</SelectItem>
              </SelectContent>
            </Select>
            {errors.ownership && <p className="text-xs text-destructive">{errors.ownership}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
