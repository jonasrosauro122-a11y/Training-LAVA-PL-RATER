"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { UserPlus, Trash2, User } from "lucide-react"
import { US_STATES, type DriverInfo } from "@/lib/types"

interface Props {
  drivers: DriverInfo[]
  onChange: (drivers: DriverInfo[]) => void
  errors: Record<string, string>
}

function createEmptyDriver(): DriverInfo {
  return {
    id: `driver-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    occupation: "",
    relationshipToInsured: "",
    licenseNumber: "",
    licenseState: "",
    ageFirstLicensed: "",
    licenseStatus: "",
    ticketsLast3Years: "0",
    accidentsLast5Years: "0",
    sr22Required: false,
    goodStudent: false,
    driversEducation: false,
    awayAtSchool: false,
  }
}

export function DriverInfoStep({ drivers, onChange, errors }: Props) {
  function addDriver() {
    onChange([...drivers, createEmptyDriver()])
  }

  function removeDriver(index: number) {
    if (drivers.length <= 1) return
    const updated = [...drivers]
    updated.splice(index, 1)
    onChange(updated)
  }

  function updateDriver(index: number, field: keyof DriverInfo, value: string | boolean) {
    const updated = [...drivers]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Driver Information</CardTitle>
            <CardDescription>
              Add all drivers in the household. Include license info and driving history.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addDriver}
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Add Driver
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={drivers.map((_, i) => `driver-${i}`)} className="space-y-4">
          {drivers.map((driver, index) => (
            <AccordionItem
              key={driver.id}
              value={`driver-${index}`}
              className="border rounded-lg px-4"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">
                      {driver.firstName && driver.lastName
                        ? `${driver.firstName} ${driver.lastName}`
                        : `Driver ${index + 1}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {driver.relationshipToInsured === "self" ? "Primary Insured" : 
                       driver.relationshipToInsured ? driver.relationshipToInsured.charAt(0).toUpperCase() + driver.relationshipToInsured.slice(1) : 
                       "Additional Driver"}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <div className="flex flex-col gap-5">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label>First Name *</Label>
                      <Input
                        value={driver.firstName}
                        onChange={(e) => updateDriver(index, "firstName", e.target.value)}
                        placeholder="John"
                      />
                      {errors[`drivers.${index}.firstName`] && (
                        <p className="text-xs text-destructive">{errors[`drivers.${index}.firstName`]}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Last Name *</Label>
                      <Input
                        value={driver.lastName}
                        onChange={(e) => updateDriver(index, "lastName", e.target.value)}
                        placeholder="Smith"
                      />
                      {errors[`drivers.${index}.lastName`] && (
                        <p className="text-xs text-destructive">{errors[`drivers.${index}.lastName`]}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label>Date of Birth *</Label>
                      <Input
                        type="date"
                        value={driver.dateOfBirth}
                        onChange={(e) => updateDriver(index, "dateOfBirth", e.target.value)}
                      />
                      {errors[`drivers.${index}.dateOfBirth`] && (
                        <p className="text-xs text-destructive">{errors[`drivers.${index}.dateOfBirth`]}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Gender *</Label>
                      <Select value={driver.gender} onValueChange={(v) => updateDriver(index, "gender", v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="non-binary">Non-Binary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Marital Status *</Label>
                      <Select value={driver.maritalStatus} onValueChange={(v) => updateDriver(index, "maritalStatus", v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label>Occupation</Label>
                      <Input
                        value={driver.occupation}
                        onChange={(e) => updateDriver(index, "occupation", e.target.value)}
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Relationship to Insured *</Label>
                      <Select value={driver.relationshipToInsured} onValueChange={(v) => updateDriver(index, "relationshipToInsured", v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="self">Self (Primary)</SelectItem>
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="child">Child</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors[`drivers.${index}.relationshipToInsured`] && (
                        <p className="text-xs text-destructive">{errors[`drivers.${index}.relationshipToInsured`]}</p>
                      )}
                    </div>
                  </div>

                  {/* License Info */}
                  <div className="border-t pt-4 mt-2">
                    <h4 className="text-sm font-medium mb-4">License Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <Label>License Number</Label>
                        <Input
                          value={driver.licenseNumber}
                          onChange={(e) => updateDriver(index, "licenseNumber", e.target.value)}
                          placeholder="D1234567"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label>License State</Label>
                        <Select value={driver.licenseState} onValueChange={(v) => updateDriver(index, "licenseState", v)}>
                          <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
                          <SelectContent>
                            {US_STATES.map((s) => (
                              <SelectItem key={s.value} value={s.value}>{s.value}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label>Age First Licensed</Label>
                        <Input
                          type="number"
                          min="15"
                          max="80"
                          value={driver.ageFirstLicensed}
                          onChange={(e) => updateDriver(index, "ageFirstLicensed", e.target.value)}
                          placeholder="16"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 mt-4">
                      <Label>License Status *</Label>
                      <Select value={driver.licenseStatus} onValueChange={(v) => updateDriver(index, "licenseStatus", v)}>
                        <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="valid">Valid</SelectItem>
                          <SelectItem value="permit">Permit</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                          <SelectItem value="revoked">Revoked</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors[`drivers.${index}.licenseStatus`] && (
                        <p className="text-xs text-destructive">{errors[`drivers.${index}.licenseStatus`]}</p>
                      )}
                    </div>
                  </div>

                  {/* Driving History */}
                  <div className="border-t pt-4 mt-2">
                    <h4 className="text-sm font-medium mb-4">Driving History</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <Label>Tickets (Last 3 Years)</Label>
                        <Select value={driver.ticketsLast3Years} onValueChange={(v) => updateDriver(index, "ticketsLast3Years", v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5].map((n) => (
                              <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label>Accidents (Last 5 Years)</Label>
                        <Select value={driver.accidentsLast5Years} onValueChange={(v) => updateDriver(index, "accidentsLast5Years", v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5].map((n) => (
                              <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <Switch
                        checked={driver.sr22Required}
                        onCheckedChange={(v) => updateDriver(index, "sr22Required", v)}
                      />
                      <Label className="cursor-pointer text-sm">SR-22 Required</Label>
                    </div>
                  </div>

                  {/* Discount Indicators */}
                  <div className="border-t pt-4 mt-2">
                    <h4 className="text-sm font-medium mb-4">Discount Indicators</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={driver.goodStudent}
                          onCheckedChange={(v) => updateDriver(index, "goodStudent", v)}
                        />
                        <Label className="cursor-pointer text-sm">Good Student</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={driver.driversEducation}
                          onCheckedChange={(v) => updateDriver(index, "driversEducation", v)}
                        />
                        <Label className="cursor-pointer text-sm">{"Driver's Education"}</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={driver.awayAtSchool}
                          onCheckedChange={(v) => updateDriver(index, "awayAtSchool", v)}
                        />
                        <Label className="cursor-pointer text-sm">Away at School</Label>
                      </div>
                    </div>
                  </div>

                  {/* Remove Driver Button */}
                  {drivers.length > 1 && (
                    <div className="flex justify-end pt-4 border-t mt-2">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeDriver(index)}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove Driver
                      </Button>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {drivers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p>No drivers added yet.</p>
            <Button
              type="button"
              variant="outline"
              onClick={addDriver}
              className="mt-4 gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Add First Driver
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
