"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2, CheckCircle2, AlertCircle, Plus, Trash2, Car } from "lucide-react"
import { US_STATES, type VehicleInfo } from "@/lib/types"
import { decodeVin } from "@/lib/vin-decoder"

interface Props {
  vehicles: VehicleInfo[]
  onChange: (vehicles: VehicleInfo[]) => void
  errors: Record<string, string>
}

function createEmptyVehicle(): VehicleInfo {
  return {
    id: `vehicle-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    vin: "",
    year: "",
    make: "",
    model: "",
    trim: "",
    bodyType: "",
    primaryUse: "",
    annualMileage: "",
    oneWayMilesToWork: "",
    daysDrivenPerWeek: "",
    garagingSameAsPersonal: true,
    garagingStreet: "",
    garagingCity: "",
    garagingState: "",
    garagingZip: "",
    antiTheft: false,
    ownership: "",
    lienholder: "",
    compDeductible: "",
    collisionDeductible: "",
    rentalReimbursement: false,
    roadsideAssistance: false,
  }
}

export function VehicleInfoStep({ vehicles, onChange, errors }: Props) {
  const [vinLoadingIndex, setVinLoadingIndex] = useState<number | null>(null)
  const [vinStatuses, setVinStatuses] = useState<Record<number, { status: "idle" | "success" | "error"; message: string }>>({})

  function addVehicle() {
    onChange([...vehicles, createEmptyVehicle()])
  }

  function removeVehicle(index: number) {
    if (vehicles.length <= 1) return
    const updated = [...vehicles]
    updated.splice(index, 1)
    onChange(updated)
  }

  function updateVehicle(index: number, field: keyof VehicleInfo, value: string | boolean) {
    const updated = [...vehicles]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  async function handleVinLookup(index: number) {
    const vehicle = vehicles[index]
    if (!vehicle.vin || vehicle.vin.length !== 17) {
      setVinStatuses((prev) => ({
        ...prev,
        [index]: { status: "error", message: "VIN must be exactly 17 characters" },
      }))
      return
    }

    setVinLoadingIndex(index)
    setVinStatuses((prev) => ({ ...prev, [index]: { status: "idle", message: "" } }))

    const result = await decodeVin(vehicle.vin)

    if (result.error && !result.year) {
      setVinStatuses((prev) => ({
        ...prev,
        [index]: { status: "error", message: result.error || "VIN lookup failed" },
      }))
    } else {
      const updated = [...vehicles]
      updated[index] = {
        ...updated[index],
        year: result.year || vehicle.year,
        make: result.make || vehicle.make,
        model: result.model || vehicle.model,
        bodyType: result.bodyClass || vehicle.bodyType,
      }
      onChange(updated)
      setVinStatuses((prev) => ({
        ...prev,
        [index]: {
          status: "success",
          message: result.error
            ? `Partial decode: ${result.year} ${result.make} ${result.model}`
            : `Found: ${result.year} ${result.make} ${result.model}`,
        },
      }))
    }

    setVinLoadingIndex(null)
  }

  const hasMultipleVehicles = vehicles.length > 1

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Vehicle Information
              {hasMultipleVehicles && (
                <Badge variant="secondary" className="ml-2">
                  Multi-Car
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Add all vehicles to be insured. Multi-car discount applies for 2+ vehicles.
            </CardDescription>
          </div>
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
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={vehicles.map((_, i) => `vehicle-${i}`)} className="space-y-4">
          {vehicles.map((vehicle, index) => {
            const vinStatus = vinStatuses[index] || { status: "idle", message: "" }
            
            return (
              <AccordionItem
                key={vehicle.id}
                value={`vehicle-${index}`}
                className="border rounded-lg px-4"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Car className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">
                        {vehicle.year && vehicle.make && vehicle.model
                          ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
                          : `Vehicle ${index + 1}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {vehicle.vin ? `VIN: ${vehicle.vin.substring(0, 8)}...` : "No VIN entered"}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  <div className="flex flex-col gap-5">
                    {/* VIN Lookup */}
                    <div className="flex flex-col gap-1.5">
                      <Label>VIN (Vehicle Identification Number) *</Label>
                      <div className="flex gap-2">
                        <Input
                          value={vehicle.vin}
                          onChange={(e) => {
                            updateVehicle(index, "vin", e.target.value.toUpperCase())
                            if (vinStatus.status !== "idle") {
                              setVinStatuses((prev) => ({ ...prev, [index]: { status: "idle", message: "" } }))
                            }
                          }}
                          placeholder="1HGBH41JXMN109186"
                          maxLength={17}
                          className="font-mono uppercase"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleVinLookup(index)}
                          disabled={vinLoadingIndex === index || vehicle.vin.length !== 17}
                          className="shrink-0 gap-2"
                        >
                          {vinLoadingIndex === index ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Search className="h-4 w-4" />
                          )}
                          Lookup
                        </Button>
                      </div>
                      {errors[`vehicles.${index}.vin`] && (
                        <p className="text-xs text-destructive">{errors[`vehicles.${index}.vin`]}</p>
                      )}
                      {vinStatus.status === "success" && (
                        <div className="flex items-center gap-1.5 text-xs text-success">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {vinStatus.message}
                        </div>
                      )}
                      {vinStatus.status === "error" && (
                        <div className="flex items-center gap-1.5 text-xs text-destructive">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {vinStatus.message}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {vehicle.vin.length}/17 characters
                      </p>
                    </div>

                    {/* Year / Make / Model / Trim */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <Label>Year *</Label>
                        <Input
                          value={vehicle.year}
                          onChange={(e) => updateVehicle(index, "year", e.target.value)}
                          placeholder="2023"
                          maxLength={4}
                        />
                        {errors[`vehicles.${index}.year`] && (
                          <p className="text-xs text-destructive">{errors[`vehicles.${index}.year`]}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label>Make *</Label>
                        <Input
                          value={vehicle.make}
                          onChange={(e) => updateVehicle(index, "make", e.target.value)}
                          placeholder="Honda"
                        />
                        {errors[`vehicles.${index}.make`] && (
                          <p className="text-xs text-destructive">{errors[`vehicles.${index}.make`]}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label>Model *</Label>
                        <Input
                          value={vehicle.model}
                          onChange={(e) => updateVehicle(index, "model", e.target.value)}
                          placeholder="Civic"
                        />
                        {errors[`vehicles.${index}.model`] && (
                          <p className="text-xs text-destructive">{errors[`vehicles.${index}.model`]}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label>Trim</Label>
                        <Input
                          value={vehicle.trim}
                          onChange={(e) => updateVehicle(index, "trim", e.target.value)}
                          placeholder="EX-L"
                        />
                      </div>
                    </div>

                    {/* Use & Mileage */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <Label>Primary Use *</Label>
                        <Select value={vehicle.primaryUse} onValueChange={(v) => updateVehicle(index, "primaryUse", v)}>
                          <SelectTrigger><SelectValue placeholder="Select use" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="commute">Commute</SelectItem>
                            <SelectItem value="pleasure">Pleasure</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors[`vehicles.${index}.primaryUse`] && (
                          <p className="text-xs text-destructive">{errors[`vehicles.${index}.primaryUse`]}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label>Annual Mileage *</Label>
                        <Input
                          type="number"
                          value={vehicle.annualMileage}
                          onChange={(e) => updateVehicle(index, "annualMileage", e.target.value)}
                          placeholder="12000"
                        />
                        {errors[`vehicles.${index}.annualMileage`] && (
                          <p className="text-xs text-destructive">{errors[`vehicles.${index}.annualMileage`]}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label>Days Driven/Week</Label>
                        <Select value={vehicle.daysDrivenPerWeek} onValueChange={(v) => updateVehicle(index, "daysDrivenPerWeek", v)}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                              <SelectItem key={n} value={String(n)}>{n} days</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label>One Way Miles to Work</Label>
                      <Input
                        type="number"
                        value={vehicle.oneWayMilesToWork}
                        onChange={(e) => updateVehicle(index, "oneWayMilesToWork", e.target.value)}
                        placeholder="15"
                      />
                    </div>

                    {/* Ownership & Lienholder */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <Label>Vehicle Ownership *</Label>
                        <Select value={vehicle.ownership} onValueChange={(v) => updateVehicle(index, "ownership", v)}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owned">Owned</SelectItem>
                            <SelectItem value="financed">Financed</SelectItem>
                            <SelectItem value="leased">Leased</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors[`vehicles.${index}.ownership`] && (
                          <p className="text-xs text-destructive">{errors[`vehicles.${index}.ownership`]}</p>
                        )}
                      </div>
                      {(vehicle.ownership === "financed" || vehicle.ownership === "leased") && (
                        <div className="flex flex-col gap-1.5">
                          <Label>Lienholder / Lessor</Label>
                          <Input
                            value={vehicle.lienholder}
                            onChange={(e) => updateVehicle(index, "lienholder", e.target.value)}
                            placeholder="Bank of America"
                          />
                        </div>
                      )}
                    </div>

                    {/* Garaging Address */}
                    <div className="border-t pt-4 mt-2">
                      <div className="flex items-center gap-3 mb-4">
                        <Switch
                          checked={vehicle.garagingSameAsPersonal}
                          onCheckedChange={(v) => updateVehicle(index, "garagingSameAsPersonal", v)}
                        />
                        <Label className="cursor-pointer text-sm">
                          Garaging address same as home address
                        </Label>
                      </div>

                      {!vehicle.garagingSameAsPersonal && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pl-4 border-l-2 border-primary/20">
                          <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-4">
                            <Label>Garaging Street</Label>
                            <Input
                              value={vehicle.garagingStreet}
                              onChange={(e) => updateVehicle(index, "garagingStreet", e.target.value)}
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <Label>City</Label>
                            <Input
                              value={vehicle.garagingCity}
                              onChange={(e) => updateVehicle(index, "garagingCity", e.target.value)}
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <Label>State</Label>
                            <Select value={vehicle.garagingState} onValueChange={(v) => updateVehicle(index, "garagingState", v)}>
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
                              onChange={(e) => updateVehicle(index, "garagingZip", e.target.value)}
                              maxLength={5}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Vehicle Coverages */}
                    <div className="border-t pt-4 mt-2">
                      <h4 className="text-sm font-medium mb-4">Vehicle Coverages</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <Label>Comprehensive Deductible</Label>
                          <Select value={vehicle.compDeductible} onValueChange={(v) => updateVehicle(index, "compDeductible", v)}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Coverage</SelectItem>
                              <SelectItem value="250">$250</SelectItem>
                              <SelectItem value="500">$500</SelectItem>
                              <SelectItem value="1000">$1,000</SelectItem>
                              <SelectItem value="2000">$2,000</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label>Collision Deductible</Label>
                          <Select value={vehicle.collisionDeductible} onValueChange={(v) => updateVehicle(index, "collisionDeductible", v)}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Coverage</SelectItem>
                              <SelectItem value="250">$250</SelectItem>
                              <SelectItem value="500">$500</SelectItem>
                              <SelectItem value="1000">$1,000</SelectItem>
                              <SelectItem value="2000">$2,000</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={vehicle.rentalReimbursement}
                            onCheckedChange={(v) => updateVehicle(index, "rentalReimbursement", v)}
                          />
                          <Label className="cursor-pointer text-sm">Rental Reimbursement</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={vehicle.roadsideAssistance}
                            onCheckedChange={(v) => updateVehicle(index, "roadsideAssistance", v)}
                          />
                          <Label className="cursor-pointer text-sm">Roadside Assistance</Label>
                        </div>
                      </div>
                    </div>

                    {/* Anti-Theft */}
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={vehicle.antiTheft}
                        onCheckedChange={(v) => updateVehicle(index, "antiTheft", v)}
                      />
                      <Label className="cursor-pointer text-sm">Anti-Theft Device</Label>
                    </div>

                    {/* Remove Vehicle Button */}
                    {vehicles.length > 1 && (
                      <div className="flex justify-end pt-4 border-t mt-2">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeVehicle(index)}
                          className="gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove Vehicle
                        </Button>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>

        {vehicles.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Car className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p>No vehicles added yet.</p>
            <Button
              type="button"
              variant="outline"
              onClick={addVehicle}
              className="mt-4 gap-2"
            >
              <Plus className="h-4 w-4" />
              Add First Vehicle
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
