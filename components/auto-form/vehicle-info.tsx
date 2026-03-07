"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, Loader2, CheckCircle2, AlertCircle, Plus, Trash2, Car } from "lucide-react"
import { US_STATES } from "@/lib/types"
import type { VehicleInfo } from "@/lib/types"
import { decodeVin } from "@/lib/vin-decoder"
import { generateVehicleId } from "@/lib/storage"

interface Props {
  data: VehicleInfo[]
  onChange: (data: VehicleInfo[]) => void
  errors: Record<string, string>
}

const EMPTY_VEHICLE: Omit<VehicleInfo, 'id'> = {
  vin: "", year: "", make: "", model: "", bodyType: "",
  primaryUse: "", annualMileage: "", garagingSameAsPersonal: true,
  garagingStreet: "", garagingCity: "", garagingState: "", garagingZip: "",
  antiTheft: false, ownership: "", lienholder: "",
  deductible: "", rentalReimbursement: false, rentalDailyLimit: "",
  roadsideAssistance: false,
}

export function VehicleInfoStep({ data, onChange, errors }: Props) {
  const [vinLoading, setVinLoading] = useState<Record<string, boolean>>({})
  const [vinStatus, setVinStatus] = useState<Record<string, "idle" | "success" | "error">>({})
  const [vinMessage, setVinMessage] = useState<Record<string, string>>({})
  const [expandedVehicles, setExpandedVehicles] = useState<string[]>(data.length > 0 ? [data[0]?.id] : [])

  function updateVehicle(id: string, field: keyof VehicleInfo, value: string | boolean) {
    const updated = data.map((v) =>
      v.id === id ? { ...v, [field]: value } : v
    )
    onChange(updated)
  }

  function addVehicle() {
    const newVehicle: VehicleInfo = {
      ...EMPTY_VEHICLE,
      id: generateVehicleId(),
    }
    onChange([...data, newVehicle])
    setExpandedVehicles([...expandedVehicles, newVehicle.id])
  }

  function removeVehicle(id: string) {
    if (data.length <= 1) return
    onChange(data.filter((v) => v.id !== id))
    setExpandedVehicles(expandedVehicles.filter((eid) => eid !== id))
  }

  async function handleVinLookup(vehicle: VehicleInfo) {
    if (!vehicle.vin || vehicle.vin.length !== 17) {
      setVinStatus((s) => ({ ...s, [vehicle.id]: "error" }))
      setVinMessage((m) => ({ ...m, [vehicle.id]: "VIN must be exactly 17 characters" }))
      return
    }

    setVinLoading((l) => ({ ...l, [vehicle.id]: true }))
    setVinStatus((s) => ({ ...s, [vehicle.id]: "idle" }))
    setVinMessage((m) => ({ ...m, [vehicle.id]: "" }))

    const result = await decodeVin(vehicle.vin)

    if (result.error && !result.year) {
      setVinStatus((s) => ({ ...s, [vehicle.id]: "error" }))
      setVinMessage((m) => ({ ...m, [vehicle.id]: result.error }))
    } else {
      const updated = data.map((v) =>
        v.id === vehicle.id
          ? {
              ...v,
              year: result.year || v.year,
              make: result.make || v.make,
              model: result.model || v.model,
              bodyType: result.bodyClass || v.bodyType,
            }
          : v
      )
      onChange(updated)
      setVinStatus((s) => ({ ...s, [vehicle.id]: "success" }))
      setVinMessage((m) => ({
        ...m,
        [vehicle.id]: result.error
          ? `Partial decode: ${result.year} ${result.make} ${result.model}`
          : `Found: ${result.year} ${result.make} ${result.model}`,
      }))
    }

    setVinLoading((l) => ({ ...l, [vehicle.id]: false }))
  }

  function getVehicleLabel(v: VehicleInfo, index: number) {
    if (v.year && v.make && v.model) {
      return `${v.year} ${v.make} ${v.model}`
    }
    return `Vehicle ${index + 1}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Vehicle Information</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addVehicle}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Vehicle
          </Button>
        </CardTitle>
        <CardDescription>
          Add all vehicles to be covered. Each vehicle can have its own coverage options.
          {data.length > 1 && (
            <span className="ml-1 font-medium text-primary">
              {data.length} vehicles added - Multi-Car Discount may apply!
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion
          type="multiple"
          value={expandedVehicles}
          onValueChange={setExpandedVehicles}
          className="flex flex-col gap-4"
        >
          {data.map((vehicle, index) => (
            <AccordionItem
              key={vehicle.id}
              value={vehicle.id}
              className="border rounded-lg px-4"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Car className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{getVehicleLabel(vehicle, index)}</p>
                    {vehicle.vin && (
                      <p className="text-xs text-muted-foreground font-mono">
                        VIN: {vehicle.vin}
                      </p>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="flex flex-col gap-5">
                  {/* Delete button for additional vehicles */}
                  {data.length > 1 && (
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVehicle(vehicle.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove Vehicle
                      </Button>
                    </div>
                  )}

                  {/* VIN Lookup */}
                  <div className="flex flex-col gap-1.5">
                    <Label>VIN (Vehicle Identification Number) *</Label>
                    <div className="flex gap-2">
                      <Input
                        value={vehicle.vin}
                        onChange={(e) => {
                          updateVehicle(vehicle.id, "vin", e.target.value.toUpperCase())
                          if (vinStatus[vehicle.id] !== "idle") {
                            setVinStatus((s) => ({ ...s, [vehicle.id]: "idle" }))
                            setVinMessage((m) => ({ ...m, [vehicle.id]: "" }))
                          }
                        }}
                        placeholder="1HGBH41JXMN109186"
                        maxLength={17}
                        className="font-mono uppercase"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleVinLookup(vehicle)}
                        disabled={vinLoading[vehicle.id] || vehicle.vin.length !== 17}
                        className="shrink-0 gap-2"
                      >
                        {vinLoading[vehicle.id] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                        Lookup
                      </Button>
                    </div>
                    {errors[`${vehicle.id}-vin`] && (
                      <p className="text-xs text-destructive">{errors[`${vehicle.id}-vin`]}</p>
                    )}
                    {vinStatus[vehicle.id] === "success" && (
                      <div className="flex items-center gap-1.5 text-xs text-success">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {vinMessage[vehicle.id]}
                      </div>
                    )}
                    {vinStatus[vehicle.id] === "error" && (
                      <div className="flex items-center gap-1.5 text-xs text-destructive">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {vinMessage[vehicle.id]}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {vehicle.vin.length}/17 characters
                    </p>
                  </div>

                  {/* Year / Make / Model */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label>Year *</Label>
                      <Input
                        value={vehicle.year}
                        onChange={(e) => updateVehicle(vehicle.id, "year", e.target.value)}
                        placeholder="2023"
                        maxLength={4}
                      />
                      {errors[`${vehicle.id}-year`] && (
                        <p className="text-xs text-destructive">{errors[`${vehicle.id}-year`]}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Make *</Label>
                      <Input
                        value={vehicle.make}
                        onChange={(e) => updateVehicle(vehicle.id, "make", e.target.value)}
                        placeholder="Honda"
                      />
                      {errors[`${vehicle.id}-make`] && (
                        <p className="text-xs text-destructive">{errors[`${vehicle.id}-make`]}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Model *</Label>
                      <Input
                        value={vehicle.model}
                        onChange={(e) => updateVehicle(vehicle.id, "model", e.target.value)}
                        placeholder="Civic"
                      />
                      {errors[`${vehicle.id}-model`] && (
                        <p className="text-xs text-destructive">{errors[`${vehicle.id}-model`]}</p>
                      )}
                    </div>
                  </div>

                  {/* Use & Mileage */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label>Primary Use *</Label>
                      <Select
                        value={vehicle.primaryUse}
                        onValueChange={(v) => updateVehicle(vehicle.id, "primaryUse", v)}
                      >
                        <SelectTrigger><SelectValue placeholder="Select use" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="commute">Commute</SelectItem>
                          <SelectItem value="pleasure">Pleasure</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors[`${vehicle.id}-primaryUse`] && (
                        <p className="text-xs text-destructive">{errors[`${vehicle.id}-primaryUse`]}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Annual Mileage *</Label>
                      <Input
                        type="number"
                        value={vehicle.annualMileage}
                        onChange={(e) => updateVehicle(vehicle.id, "annualMileage", e.target.value)}
                        placeholder="12000"
                      />
                      {errors[`${vehicle.id}-annualMileage`] && (
                        <p className="text-xs text-destructive">{errors[`${vehicle.id}-annualMileage`]}</p>
                      )}
                    </div>
                  </div>

                  {/* Ownership & Lienholder */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label>Vehicle Ownership *</Label>
                      <Select
                        value={vehicle.ownership}
                        onValueChange={(v) => updateVehicle(vehicle.id, "ownership", v)}
                      >
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owned">Owned</SelectItem>
                          <SelectItem value="financed">Financed</SelectItem>
                          <SelectItem value="leased">Leased</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors[`${vehicle.id}-ownership`] && (
                        <p className="text-xs text-destructive">{errors[`${vehicle.id}-ownership`]}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Lienholder / Lessor</Label>
                      <Input
                        value={vehicle.lienholder}
                        onChange={(e) => updateVehicle(vehicle.id, "lienholder", e.target.value)}
                        placeholder="Bank name or lessor"
                        disabled={vehicle.ownership === "owned"}
                      />
                      {vehicle.ownership === "owned" && (
                        <p className="text-xs text-muted-foreground">Not applicable for owned vehicles</p>
                      )}
                    </div>
                  </div>

                  {/* Garaging Address */}
                  <div className="flex items-center gap-3 pt-2">
                    <Switch
                      checked={vehicle.garagingSameAsPersonal}
                      onCheckedChange={(v) => updateVehicle(vehicle.id, "garagingSameAsPersonal", v)}
                    />
                    <Label className="cursor-pointer">
                      Garaging address same as personal address
                    </Label>
                  </div>

                  {!vehicle.garagingSameAsPersonal && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pl-4 border-l-2 border-primary/20">
                      <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-4">
                        <Label>Garaging Street</Label>
                        <Input
                          value={vehicle.garagingStreet}
                          onChange={(e) => updateVehicle(vehicle.id, "garagingStreet", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label>City</Label>
                        <Input
                          value={vehicle.garagingCity}
                          onChange={(e) => updateVehicle(vehicle.id, "garagingCity", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label>State</Label>
                        <Select
                          value={vehicle.garagingState}
                          onValueChange={(v) => updateVehicle(vehicle.id, "garagingState", v)}
                        >
                          <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
                          <SelectContent>
                            {US_STATES.map((s) => (
                              <SelectItem key={s.value} value={s.value}>{s.value}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label>ZIP</Label>
                        <Input
                          value={vehicle.garagingZip}
                          onChange={(e) => updateVehicle(vehicle.id, "garagingZip", e.target.value)}
                          maxLength={5}
                        />
                      </div>
                    </div>
                  )}

                  {/* Anti-Theft */}
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={vehicle.antiTheft}
                      onCheckedChange={(v) => updateVehicle(vehicle.id, "antiTheft", v)}
                    />
                    <Label className="cursor-pointer">Anti-Theft Device</Label>
                  </div>

                  {/* Vehicle-Specific Coverages */}
                  <div className="border-t pt-4 mt-2">
                    <h4 className="font-medium mb-4">Vehicle-Specific Coverages</h4>
                    
                    {/* Deductible */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="flex flex-col gap-1.5">
                        <Label>Deductible (Comp & Collision) *</Label>
                        <Select
                          value={vehicle.deductible}
                          onValueChange={(v) => updateVehicle(vehicle.id, "deductible", v)}
                        >
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Coverage (Liability Only)</SelectItem>
                            <SelectItem value="250">$250</SelectItem>
                            <SelectItem value="500">$500</SelectItem>
                            <SelectItem value="1000">$1,000</SelectItem>
                            <SelectItem value="2000">$2,000</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors[`${vehicle.id}-deductible`] && (
                          <p className="text-xs text-destructive">{errors[`${vehicle.id}-deductible`]}</p>
                        )}
                        {vehicle.deductible === "none" && (
                          <p className="text-xs text-amber-600">
                            This vehicle will have liability coverage only - no comp/collision coverage.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Rental & Roadside */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={vehicle.rentalReimbursement}
                            onCheckedChange={(v) => updateVehicle(vehicle.id, "rentalReimbursement", v)}
                          />
                          <Label className="cursor-pointer">Rental Reimbursement</Label>
                        </div>
                        {vehicle.rentalReimbursement && (
                          <div className="pl-4 border-l-2 border-primary/20">
                            <Select
                              value={vehicle.rentalDailyLimit}
                              onValueChange={(v) => updateVehicle(vehicle.id, "rentalDailyLimit", v)}
                            >
                              <SelectTrigger><SelectValue placeholder="Daily limit" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="30">$30/day</SelectItem>
                                <SelectItem value="50">$50/day</SelectItem>
                                <SelectItem value="75">$75/day</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={vehicle.roadsideAssistance}
                          onCheckedChange={(v) => updateVehicle(vehicle.id, "roadsideAssistance", v)}
                        />
                        <Label className="cursor-pointer">Roadside Assistance</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
