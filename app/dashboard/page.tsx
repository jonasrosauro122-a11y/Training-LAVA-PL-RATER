"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Car, Home, FileText, TrendingUp, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { getCurrentUser, getQuotesByUser } from "@/lib/storage"
import type { QuoteResult } from "@/lib/types"

function DashboardContent() {
  const [vaName, setVaName] = useState("")
  const [quotes, setQuotes] = useState<QuoteResult[]>([])

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setVaName(user)
      setQuotes(getQuotesByUser(user))
    }
  }, [])

  const autoQuotes = quotes.filter((q) => q.type === "auto")
  const homeQuotes = quotes.filter((q) => q.type === "homeowners")
  const totalQuotes = quotes.length

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground text-balance">
          Welcome back, {vaName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Select a quote type to begin, or review your past submissions below.
        </p>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link href="/quote/auto" className="group">
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary/30 cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Car className="h-7 w-7 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">New Auto Quote</CardTitle>
                <CardDescription className="mt-1">
                  5-step auto insurance quoting wizard with VIN lookup
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/quote/homeowners" className="group">
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary/30 cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/20">
                <Home className="h-7 w-7 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">New Homeowners Quote</CardTitle>
                <CardDescription className="mt-1">
                  4-step home/renters/condo quoting with coverage options
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <FileText className="h-4 w-4" />
              <span className="text-xs font-medium">Total Quotes</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalQuotes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Car className="h-4 w-4" />
              <span className="text-xs font-medium">Auto</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{autoQuotes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Home className="h-4 w-4" />
              <span className="text-xs font-medium">Homeowners</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{homeQuotes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Training Goal</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalQuotes}/10</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Training Progress</span>
            <span className="text-sm text-muted-foreground">
              {Math.min(totalQuotes, 10)} of 10 quotes completed
            </span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full lava-gradient-bg rounded-full transition-all duration-500"
              style={{ width: `${Math.min((totalQuotes / 10) * 100, 100)}%` }}
            />
          </div>
          {totalQuotes >= 10 && (
            <p className="text-sm text-success mt-2 font-medium">
              Training goal achieved! Keep practicing to sharpen your skills.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quote History Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Quote History
              </CardTitle>
              <CardDescription className="mt-1">
                Your recent quoting submissions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {quotes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground">No quotes yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Start a new auto or homeowners quote to see your history here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Customer</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Best Rate</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground hidden md:table-cell">Carrier</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((quote) => {
                    const bestQuote = quote.quotes.find((q) => q.isBestValue)
                    return (
                      <tr key={quote.id} className="border-b border-border/50">
                        <td className="py-3 px-2">
                          <Badge
                            variant={quote.type === "auto" ? "default" : "secondary"}
                            className={
                              quote.type === "auto"
                                ? "bg-primary/10 text-primary hover:bg-primary/10"
                                : "bg-accent/10 text-accent hover:bg-accent/10"
                            }
                          >
                            {quote.type === "auto" ? "Auto" : "Home"}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 font-medium text-foreground">
                          {quote.customerName}
                        </td>
                        <td className="py-3 px-2 text-muted-foreground hidden sm:table-cell">
                          {new Date(quote.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-2 font-medium text-foreground">
                          ${bestQuote?.annualPremium.toLocaleString()}/yr
                        </td>
                        <td className="py-3 px-2 text-muted-foreground hidden md:table-cell">
                          {bestQuote?.carrierName}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <Link href={`/quote/results?id=${quote.id}`}>
                            <Button variant="ghost" size="sm" className="text-primary">
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
