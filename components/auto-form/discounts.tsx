"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CarFront, Home, Shield, Lock } from "lucide-react"
import type { AutoDiscounts } from "@/lib/types"

interface Props {
  data: AutoDiscounts
  onChange: (data: AutoDiscounts) => void
}

const DISCOUNT_ITEMS = [
  {
    key: "multiCar" as const,
    label: "Multi-Car Discount",
    description: "Insuring more than one vehicle on this policy",
    icon: CarFront,
    savings: "Up to 5% off",
  },
  {
    key: "homeownerBundle" as const,
    label: "Homeowner Bundle",
    description: "Bundling auto with a homeowners or renters policy",
    icon: Home,
    savings: "Up to 10% off",
  },
  {
    key: "goodDriver" as const,
    label: "Good Driver Discount",
    description: "No at-fault accidents or violations in last 3 years",
    icon: Shield,
    savings: "Up to 8% off",
  },
  {
    key: "safetyDevice" as const,
    label: "Safety Device Discount",
    description: "Vehicle has factory-installed safety/anti-theft features",
    icon: Lock,
    savings: "Up to 3% off",
  },
]

export function DiscountsStep({ data, onChange }: Props) {
  function toggle(key: keyof AutoDiscounts) {
    onChange({ ...data, [key]: !data[key] })
  }

  const activeCount = Object.values(data).filter(Boolean).length

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
          return (
            <div
              key={item.key}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-colors cursor-pointer ${
                isActive
                  ? "border-primary/30 bg-primary/5"
                  : "border-border hover:border-border/80"
              }`}
              onClick={() => toggle(item.key)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggle(item.key) }}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                isActive ? "bg-primary/10" : "bg-secondary"
              }`}>
                <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <Label className="font-medium cursor-pointer">{item.label}</Label>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-medium text-primary hidden sm:block">{item.savings}</span>
                <Switch
                  checked={isActive}
                  onCheckedChange={() => toggle(item.key)}
                  aria-label={item.label}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
