"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, FileText, Car, Home, TrendingUp, DollarSign, Calendar, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AuthGuard } from "@/components/auth-guard"

import { getQuotes, getCurrentUser } from "@/lib/storage"
import { exportQuotePDF } from "@/lib/pdf-export"
import type { QuoteResult, AutoQuoteInput, HomeownersQuoteInput } from "@/lib/types"

type DateFilter = "all" | "today" | "week" | "month"
type TypeFilter = "all" | "auto" | "homeowners"

function ReportsContent() {
  const [quotes, setQuotes] = useState<QuoteResult[]>([])
  const [dateFilter, setDateFilter] = useState<DateFilter>("all")
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all")
  const [vaName, setVaName] = useState("")

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setVaName(user)
    }
    setQuotes(getQuotes())
  }, [])

  // Filter quotes
  const filteredQuotes = quotes.filter((quote) => {
    // Type filter
    if (typeFilter !== "all" && quote.type !== typeFilter) return false

    // Date filter
    const quoteDate = new Date(quote.createdAt)
    const now = new Date()

    if (dateFilter === "today") {
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      if (quoteDate < todayStart) return false
    } else if (dateFilter === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      if (quoteDate < weekAgo) return false
    } else if (dateFilter === "month") {
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      if (quoteDate < monthAgo) return false
    }

    return true
  })

  // Calculate statistics
  const totalQuotes = filteredQuotes.length
  const autoQuotes = filteredQuotes.filter((q) => q.type === "auto")
  const homeQuotes = filteredQuotes.filter((q) => q.type === "homeowners")

  const avgAutoPremium = autoQuotes.length > 0
    ? Math.round(autoQuotes.reduce((sum, q) => {
        const best = q.quotes.find((qr) => qr.isBestValue)
        return sum + (best?.annualPremium || 0)
      }, 0) / autoQuotes.length)
    : 0

  const avgHomePremium = homeQuotes.length > 0
    ? Math.round(homeQuotes.reduce((sum, q) => {
        const best = q.quotes.find((qr) => qr.isBestValue)
        return sum + (best?.annualPremium || 0)
      }, 0) / homeQuotes.length)
    : 0

  // Multi-vehicle stats
  const multiVehicleQuotes = autoQuotes.filter((q) => {
    const input = q.input as AutoQuoteInput
    return (input.vehicles?.length || 0) > 1
  })

  // Unique customers
  const uniqueCustomers = new Set(filteredQuotes.map((q) => q.customerName)).size

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2 -ml-2 mb-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Quote summary and analytics for internal viewing
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Date Range</span>
          <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as DateFilter)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Quote Type</span>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="auto">Auto Only</SelectItem>
              <SelectItem value="homeowners">Home Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <FileText className="h-4 w-4" />
              <span className="text-xs font-medium">Total Quotes</span>
            </div>
            <p className="text-2xl font-bold">{totalQuotes}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Car className="h-4 w-4" />
              <span className="text-xs font-medium">Auto Quotes</span>
            </div>
            <p className="text-2xl font-bold">{autoQuotes.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Home className="h-4 w-4" />
              <span className="text-xs font-medium">Home Quotes</span>
            </div>
            <p className="text-2xl font-bold">{homeQuotes.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs font-medium">Avg Auto</span>
            </div>
            <p className="text-2xl font-bold">${avgAutoPremium.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Avg Home</span>
            </div>
            <p className="text-2xl font-bold">${avgHomePremium.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium">Customers</span>
            </div>
            <p className="text-2xl font-bold">{uniqueCustomers}</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Multi-Vehicle Quotes</CardTitle>
            <CardDescription className="text-xs">Auto quotes with 2+ vehicles</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{multiVehicleQuotes.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {autoQuotes.length > 0 
                ? `${Math.round((multiVehicleQuotes.length / autoQuotes.length) * 100)}% of auto quotes`
                : "No auto quotes yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Best Carrier Distribution</CardTitle>
            <CardDescription className="text-xs">Which carriers are winning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              {(() => {
                const carrierCounts: Record<string, number> = {}
                filteredQuotes.forEach((q) => {
                  const best = q.quotes.find((qr) => qr.isBestValue)
                  if (best) {
                    carrierCounts[best.carrierName] = (carrierCounts[best.carrierName] || 0) + 1
                  }
                })
                const sorted = Object.entries(carrierCounts)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 3)
                
                if (sorted.length === 0) {
                  return <p className="text-xs text-muted-foreground">No data yet</p>
                }
                
                return sorted.map(([name, count]) => (
                  <div key={name} className="flex items-center justify-between text-sm">
                    <span>{name}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))
              })()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <CardDescription className="text-xs">Quotes in the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {quotes.filter((q) => {
                const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
                return new Date(q.createdAt) > dayAgo
              }).length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              quotes created
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quote List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Quote Summary
          </CardTitle>
          <CardDescription>
            {filteredQuotes.length} quote{filteredQuotes.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredQuotes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground">No quotes match the selected filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Date</th>
                    <th className="text-left py-3 px-2">Type</th>
                    <th className="text-left py-3 px-2">Customer</th>
                    <th className="text-left py-3 px-2 hidden sm:table-cell">VA</th>
                    <th className="text-left py-3 px-2">Best Rate</th>
                    <th className="text-left py-3 px-2 hidden md:table-cell">Best Carrier</th>
                    <th className="text-left py-3 px-2 hidden lg:table-cell">Details</th>
                    <th className="text-right py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotes.map((quote) => {
                    const bestQuote = quote.quotes.find((q) => q.isBestValue)
                    const autoInput = quote.type === "auto" ? quote.input as AutoQuoteInput : null
                    const homeInput = quote.type === "homeowners" ? quote.input as HomeownersQuoteInput : null
                    
                    return (
                      <tr key={quote.id} className="border-b">
                        <td className="py-3 px-2 text-muted-foreground">
                          {new Date(quote.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant="secondary">
                            {quote.type === "auto" ? "Auto" : "Home"}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 font-medium">
                          {quote.customerName}
                        </td>
                        <td className="py-3 px-2 hidden sm:table-cell text-muted-foreground">
                          {quote.vaName}
                        </td>
                        <td className="py-3 px-2 font-medium text-primary">
                          ${bestQuote?.annualPremium.toLocaleString()}/yr
                        </td>
                        <td className="py-3 px-2 hidden md:table-cell">
                          {bestQuote?.carrierName}
                        </td>
                        <td className="py-3 px-2 hidden lg:table-cell text-muted-foreground text-xs">
                          {autoInput && (
                            <span>{autoInput.vehicles?.length || 1} vehicle(s)</span>
                          )}
                          {homeInput && (
                            <span>{homeInput.propertyInfo.policyType} - {homeInput.propertyInfo.squareFootage} sqft</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/quote/results?id=${quote.id}`}>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => exportQuotePDF(quote)}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
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

export default function ReportsPage() {
  return (
    <AuthGuard>
      <ReportsContent />
    </AuthGuard>
  )
}
