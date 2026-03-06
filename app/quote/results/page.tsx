"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthGuard } from "@/components/auth-guard"
import { LavaSpinner } from "@/components/lava-spinner"
import { CarrierCard } from "@/components/carrier-card"
import { getQuoteById } from "@/lib/storage"
import { exportQuotePDF } from "@/lib/pdf-export"
import type { QuoteResult } from "@/lib/types"

function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get("id")

  const [isLoading, setIsLoading] = useState(true)
  const [result, setResult] = useState<QuoteResult | null>(null)
  const [showCards, setShowCards] = useState(false)

  useEffect(() => {
    if (!id) {
      router.replace("/dashboard")
      return
    }

    const quote = getQuoteById(id)
    if (!quote) {
      router.replace("/dashboard")
      return
    }

    setResult(quote)

    // Simulate loading time for the spinner animation
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Slight delay before showing cards for stagger effect
      setTimeout(() => setShowCards(true), 100)
    }, 3500)

    return () => clearTimeout(timer)
  }, [id, router])

  if (isLoading || !result) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <LavaSpinner />
      </main>
    )
  }

  const sortedQuotes = [...result.quotes].sort(
    (a, b) => a.annualPremium - b.annualPremium
  )
  const bestQuote = sortedQuotes.find((q) => q.isBestValue) || sortedQuotes[0]
  const highestQuote = sortedQuotes[sortedQuotes.length - 1]
  const avgPremium = Math.round(
    sortedQuotes.reduce((sum, q) => sum + q.annualPremium, 0) /
      sortedQuotes.length
  )
  const savingsRange = highestQuote.annualPremium - bestQuote.annualPremium

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back and actions */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="gap-2 text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <Button
          onClick={() => exportQuotePDF(result)}
          className="gap-2 lava-gradient-bg text-white border-0 hover:opacity-90 transition-opacity"
        >
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {/* Summary Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-balance">
          {result.type === "auto" ? "Auto" : "Homeowners"} Insurance Quotes
        </h1>
        <p className="text-muted-foreground mt-1">
          for {result.customerName} &middot;{" "}
          {new Date(result.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Best Rate</p>
            <p className="text-xl font-bold text-foreground lava-gradient-text">
              ${bestQuote.annualPremium.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">/year</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Best Carrier</p>
            <p className="text-sm font-bold text-foreground">
              {bestQuote.carrierName}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Average</p>
            <p className="text-xl font-bold text-foreground">
              ${avgPremium.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">/year</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Potential Savings</p>
            <p className="text-xl font-bold text-foreground" style={{ color: "var(--success)" }}>
              ${savingsRange.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Bar Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-5 w-5" />
            Premium Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {sortedQuotes.map((quote) => {
              const maxPremium = highestQuote.annualPremium
              const widthPercent = (quote.annualPremium / maxPremium) * 100

              return (
                <div key={quote.carrierId} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground w-28 shrink-0 truncate">
                    {quote.carrierName}
                  </span>
                  <div className="flex-1 h-8 bg-secondary rounded-md overflow-hidden">
                    <div
                      className="h-full rounded-md flex items-center justify-end px-2 transition-all duration-700"
                      style={{
                        width: `${widthPercent}%`,
                        background: quote.isBestValue
                          ? "linear-gradient(90deg, var(--lava-red), var(--lava-orange))"
                          : "var(--muted-foreground)",
                        opacity: quote.isBestValue ? 1 : 0.3,
                      }}
                    >
                      <span
                        className="text-xs font-bold"
                        style={{
                          color: quote.isBestValue ? "#fff" : "var(--foreground)",
                        }}
                      >
                        ${quote.annualPremium.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Carrier Cards Grid */}
      {showCards && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedQuotes.map((quote, idx) => (
            <CarrierCard
              key={quote.carrierId}
              quote={quote}
              index={idx}
              rank={idx + 1}
            />
          ))}
        </div>
      )}
    </main>
  )
}

export default function ResultsPage() {
  return (
    <AuthGuard>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="lava-spinner" />
          </div>
        }
      >
        <ResultsContent />
      </Suspense>
    </AuthGuard>
  )
}
