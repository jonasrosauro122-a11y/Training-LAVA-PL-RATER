"use client"

import { Award, Shield, Star } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CarrierQuote } from "@/lib/types"

interface CarrierCardProps {
  quote: CarrierQuote
  index: number
  rank: number
}

export function CarrierCard({ quote, index, rank }: CarrierCardProps) {
  const monthlyPremium = Math.round(quote.annualPremium / 12)

  return (
    <div
      className="card-reveal"
      style={{ animationDelay: `${index * 200}ms` }}
    >
      <Card
        className={`relative overflow-hidden transition-all hover:shadow-lg ${
          quote.isBestValue ? "ring-2 ring-primary shadow-lg" : ""
        }`}
      >
        {quote.isBestValue && (
          <div className="absolute top-0 left-0 right-0 h-1 lava-gradient-bg" />
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold"
                style={{
                  backgroundColor: quote.isBestValue
                    ? "var(--lava-orange)"
                    : "var(--muted)",
                  color: quote.isBestValue ? "#fff" : "var(--foreground)",
                }}
              >
                #{rank}
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-balance">
                  {quote.carrierName}
                </h3>
                <div className="flex items-center gap-1 mt-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.round(quote.amBestRating)
                          ? "fill-accent text-accent"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            {quote.isBestValue && (
              <Badge className="lava-gradient-bg text-white border-0 gap-1">
                <Award className="h-3 w-3" />
                Best Value
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {/* Premium Display */}
          <div className="text-center p-4 rounded-lg bg-secondary/50">
            <p className="text-3xl font-bold text-foreground">
              ${quote.annualPremium.toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground">/yr</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              ${monthlyPremium.toLocaleString()}/mo
            </p>
          </div>

          {/* Coverage Details */}
          <div className="flex flex-col gap-2">
            {quote.coverageDetails.map((detail) => (
              <div
                key={detail.label}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Shield className="h-3 w-3" />
                  {detail.label}
                </span>
                <span className="font-medium text-foreground">{detail.value}</span>
              </div>
            ))}
          </div>

          {/* Discounts Applied */}
          {quote.discountsApplied.length > 0 && (
            <div className="border-t border-border pt-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Discounts Applied
              </p>
              <div className="flex flex-wrap gap-1.5">
                {quote.discountsApplied.map((discount) => (
                  <Badge
                    key={discount}
                    variant="secondary"
                    className="text-xs bg-secondary text-secondary-foreground"
                  >
                    {discount}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
