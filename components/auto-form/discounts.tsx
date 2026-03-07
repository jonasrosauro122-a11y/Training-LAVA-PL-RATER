"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CarFront, Home, Shield, Lock, Smartphone, AlertCircle } from "lucide-react"
import type { AutoDiscounts } from "@/lib/types"

interface Props {
  data: AutoDiscounts
  onChange: (data: AutoDiscounts) => void
  vehicleCount: number
}

const getDiscountItems = (vehicleCount: number, currentData: AutoDiscounts) => [
  {
    key: "multiCar" as const,
    label: "Multi-Car Discount",
    description: vehicleCount > 1 
      ? "Automatically applied - insuring multiple vehicles on this policy"
      : "Add more than one vehicle to qualify for this discount",
    icon: CarFront,
    savings: "Up to 5% off",
    disabled: vehicleCount <= 1,
    autoEnabled: vehicleCount > 1,
  },
  {
    key: "homeownerBundle" as const,
    label: "Homeowner Bundle",
    description: "Bundling auto with a homeowners or renters policy",
    icon: Home,
    savings: "Up to 10% off",
    disabled: false,
    autoEnabled: false,
  },
  {
    key: "goodDriver" as const,
    label: "Good Driver Discount",
    description: "No at-fault accidents or violations in last 3 years",
    icon: Shield,
    savings: "Up to 8% off",
    disabled: false,
    autoEnabled: false,
  },
  {
    key: "safetyDevice" as const,
    label: "Safety Device Discount",
    description: "Vehicle has factory-installed safety/anti-theft features",
    icon: Lock,
    savings: "Up to 3% off",
    disabled: false,
    autoEnabled: false,
  },
  {
    key: "dynamicDrive" as const,
    label: "Dynamic Drive",
    description: "Enroll in usage-based insurance tracking for safe driving rewards",
    icon: Smartphone,
    savings: "Up to 15% off",
    disabled: false,
    autoEnabled: false,
  },
]

export function DiscountsStep({ data, onChange, vehicleCount }: Props) {
  const DISCOUNT_ITEMS = getDiscountItems(vehicleCount, data)

  function toggle(key: keyof AutoDiscounts) {
    // Don't allow toggling multi-car if it's disabled or auto-enabled
    const item = DISCOUNT_ITEMS.find(i => i.key === key)
    if (item?.disabled || item?.autoEnabled) return
    
    onChange({ ...data, [key]: !data[key] })
  }

  const activeCount = Object.entries(data).filter(([key, value]) => {
    const item = DISCOUNT_ITEMS.find(i => i.key === key)
    return value && !item?.disabled
  }).length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Discounts</CardTitle>
        <CardDescription>
          Select all applicable discounts to reduce the premium.
          {activeCount > 0 && (
            <span className="ml-1 font-medium text-primary">
              {activeCount} discount{activeCount > 1 ? "s" : ""} selected
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {DISCOUNT_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = data[item.key]
          const isDisabled = item.disabled
          const isAutoEnabled = item.autoEnabled
          
          return (
            <div
              key={item.key}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                isDisabled 
                  ? "border-border bg-muted/30 opacity-60 cursor-not-allowed"
                  : isAutoEnabled
                    ? "border-primary/30 bg-primary/5 cursor-default"
                    : isActive
                      ? "border-primary/30 bg-primary/5 cursor-pointer"
                      : "border-border hover:border-border/80 cursor-pointer"
              }`}
              onClick={() => !isDisabled && !isAutoEnabled && toggle(item.key)}
              role="button"
              tabIndex={isDisabled || isAutoEnabled ? -1 : 0}
              onKeyDown={(e) => { 
                if ((e.key === "Enter" || e.key === " ") && !isDisabled && !isAutoEnabled) {
                  toggle(item.key)
                }
              }}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                isAutoEnabled || isActive ? "bg-primary/10" : "bg-secondary"
              }`}>
                <Icon className={`h-5 w-5 ${isAutoEnabled || isActive ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Label className={`font-medium ${isDisabled ? "text-muted-foreground" : "cursor-pointer"}`}>
                    {item.label}
                  </Label>
                  {isAutoEnabled && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      Auto-applied
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                {isDisabled && item.key === "multiCar" && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-amber-600">
                    <AlertCircle className="h-3 w-3" />
                    Add another vehicle to unlock this discount
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-xs font-medium hidden sm:block ${
                  isAutoEnabled || isActive ? "text-primary" : "text-muted-foreground"
                }`}>
                  {item.savings}
                </span>
                <Switch
                  checked={isAutoEnabled || isActive}
                  onCheckedChange={() => !isDisabled && !isAutoEnabled && toggle(item.key)}
                  aria-label={item.label}
                  disabled={isDisabled || isAutoEnabled}
                />
              </div>
            </div>
          )
        })}

        {/* Dynamic Drive info */}
        {data.dynamicDrive && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-2">
            <p className="text-sm font-medium text-foreground mb-1">Dynamic Drive Program</p>
            <p className="text-xs text-muted-foreground">
              By enrolling in Dynamic Drive, the customer agrees to have their driving behavior 
              monitored through a mobile app or device. Safe driving habits can earn discounts 
              of up to 15% on their premium at renewal.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
