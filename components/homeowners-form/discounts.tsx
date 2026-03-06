"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Award, RefreshCw, Droplets, Mountain, Waves } from "lucide-react"
import type { HomeownersDiscounts } from "@/lib/types"

interface Props {
  data: HomeownersDiscounts
  onChange: (data: HomeownersDiscounts) => void
}

const DISCOUNT_ITEMS = [
  {
    key: "multiPolicy" as const,
    label: "Multi-Policy Discount",
    description: "Bundle with auto or other policies",
    icon: Shield,
    savings: "Up to 10% off",
    isDiscount: true,
  },
  {
    key: "protectiveDevices" as const,
    label: "Protective Devices",
    description: "Smoke detectors, fire extinguisher, deadbolts",
    icon: Lock,
    savings: "Up to 5% off",
    isDiscount: true,
  },
  {
    key: "claimsFree" as const,
    label: "Claims-Free Discount",
    description: "No claims in the last 5 years",
    icon: Award,
    savings: "Up to 8% off",
    isDiscount: true,
  },
]

const OPTIONAL_COVERAGES = [
  {
    key: "replacementCost" as const,
    label: "Replacement Cost Endorsement",
    description: "Replaces items at new value, not depreciated",
    icon: RefreshCw,
    cost: "+~$85/yr",
  },
  {
    key: "waterBackup" as const,
    label: "Water Backup Coverage",
    description: "Covers sewer and drain backup damage",
    icon: Droplets,
    cost: "+~$55/yr",
  },
  {
    key: "earthquake" as const,
    label: "Earthquake Coverage",
    description: "Covers damage from seismic activity",
    icon: Mountain,
    cost: "+~$180/yr",
  },
  {
    key: "flood" as const,
    label: "Flood Coverage",
    description: "Covers flood damage (usually excluded)",
    icon: Waves,
    cost: "+~$250/yr",
  },
]

export function HomeDiscountsStep({ data, onChange }: Props) {
  function toggle(key: keyof HomeownersDiscounts) {
    onChange({ ...data, [key]: !data[key] })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discounts & Optional Coverage</CardTitle>
        <CardDescription>Select applicable discounts and add-on coverages.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Discounts */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Discounts</h3>
          <div className="flex flex-col gap-3">
            {DISCOUNT_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = data[item.key]
              return (
                <div
                  key={item.key}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-colors cursor-pointer ${
                    isActive ? "border-primary/30 bg-primary/5" : "border-border hover:border-border/80"
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
                    <Switch checked={isActive} onCheckedChange={() => toggle(item.key)} aria-label={item.label} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Optional Coverages */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Optional Coverage Add-ons</h3>
          <div className="flex flex-col gap-3">
            {OPTIONAL_COVERAGES.map((item) => {
              const Icon = item.icon
              const isActive = data[item.key]
              return (
                <div
                  key={item.key}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-colors cursor-pointer ${
                    isActive ? "border-accent/30 bg-accent/5" : "border-border hover:border-border/80"
                  }`}
                  onClick={() => toggle(item.key)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggle(item.key) }}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    isActive ? "bg-accent/10" : "bg-secondary"
                  }`}>
                    <Icon className={`h-5 w-5 ${isActive ? "text-accent" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Label className="font-medium cursor-pointer">{item.label}</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-medium text-muted-foreground hidden sm:block">{item.cost}</span>
                    <Switch checked={isActive} onCheckedChange={() => toggle(item.key)} aria-label={item.label} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
