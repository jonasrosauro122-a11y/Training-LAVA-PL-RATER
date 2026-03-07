"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Car, Home, FileText, TrendingUp, Clock, ClipboardList, CheckCircle2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"

import { createClient } from "@/lib/supabase/client"
import type { QuoteResult, PreQuoteForm } from "@/lib/types"

interface DashboardData {
  vaName: string
  quotes: QuoteResult[]
  preQuoteForm: PreQuoteForm | null
}

function DashboardContent() {
  const [data, setData] = useState<DashboardData>({
    vaName: "",
    quotes: [],
    preQuoteForm: null,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadDashboard() {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace("/")
        return
      }

      const vaName = user.user_metadata?.va_name || user.email?.split("@")[0] || "VA"

      // Check for today's pre-quote form
      const today = new Date().toISOString().split("T")[0]
      const { data: preQuoteForms } = await supabase
        .from("pre_quote_forms")
        .select("*")
        .eq("user_id", user.id)
        .eq("quote_date", today)
        .limit(1)

      // Load quotes from Supabase
      const { data: quotesData } = await supabase
        .from("quotes")
        .select(`
          id,
          quote_type,
          customer_name,
          va_name,
          created_at,
          quote_results (
            carrier_id,
            carrier_name,
            annual_premium,
            is_best_value
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20)

      // Transform quotes data
      const quotes: QuoteResult[] = (quotesData || []).map((q) => ({
        id: q.id,
        type: q.quote_type as "auto" | "homeowners",
        vaName: q.va_name,
        customerName: q.customer_name,
        createdAt: q.created_at,
        input: {} as any,
        quotes: (q.quote_results || []).map((qr: any) => ({
          carrierId: qr.carrier_id,
          carrierName: qr.carrier_name,
          carrierColor: "#666",
          monthlyPremium: 0,
          semiAnnualPremium: 0,
          annualPremium: qr.annual_premium,
          isBestValue: qr.is_best_value,
          amBestRating: 4,
          coverageDetails: [],
          discountsApplied: [],
        })),
      }))

      setData({
        vaName,
        quotes,
        preQuoteForm: preQuoteForms?.[0] ? {
          id: preQuoteForms[0].id,
          vaName: preQuoteForms[0].va_name,
          quoteDate: preQuoteForms[0].quote_date,
          trainer: preQuoteForms[0].trainer,
          teamLeader: preQuoteForms[0].team_leader,
        } : null,
      })
      setLoading(false)
    }

    loadDashboard()
  }, [router])

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="lava-spinner" />
        </div>
      </main>
    )
  }

  const { vaName, quotes, preQuoteForm } = data
  const autoQuotes = quotes.filter((q) => q.type === "auto")
  const homeQuotes = quotes.filter((q) => q.type === "homeowners")
  const totalQuotes = quotes.length

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* HEADER WITH LOGO */}
      <div className="flex items-center gap-4 mb-10">
        <Image
          src="/apple-icon.png"
          alt="LAVA RATER Logo"
          width={60}
          height={60}
          className="rounded-xl shadow-md"
        />

        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {vaName}
          </h1>
          <p className="text-muted-foreground">
            Select a quote type to begin or review your previous submissions.
          </p>
        </div>
      </div>

      {/* PRE-QUOTE STATUS CARD */}
      <Card className={`mb-6 ${preQuoteForm ? 'border-green-500/30 bg-green-50/50 dark:bg-green-950/20' : 'border-orange-500/30 bg-orange-50/50 dark:bg-orange-950/20'}`}>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {preQuoteForm ? (
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            ) : (
              <ClipboardList className="h-6 w-6 text-orange-600" />
            )}
            <div>
              <p className="font-medium">
                {preQuoteForm 
                  ? "Pre-Quote Form Completed" 
                  : "Pre-Quote Form Required"
                }
              </p>
              <p className="text-sm text-muted-foreground">
                {preQuoteForm 
                  ? `Trainer: ${preQuoteForm.trainer} | Team Leader: ${preQuoteForm.teamLeader}` 
                  : "Complete the pre-quote form before starting quotes"
                }
              </p>
            </div>
          </div>
          <Link href="/pre-quote">
            <Button variant={preQuoteForm ? "outline" : "default"} size="sm">
              {preQuoteForm ? "Update" : "Complete Now"}
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* QUICK ACTION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link href="/quote/auto" className="group">
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary/30 cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Car className="h-7 w-7 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">New Auto Quote</CardTitle>
                <CardDescription className="mt-1">
                  Multi-step auto insurance quoting with driver and vehicle info
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/quote/homeowners" className="group">
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary/30 cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/20">
                <Home className="h-7 w-7 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">New Homeowners Quote</CardTitle>
                <CardDescription className="mt-1">
                  Property and coverage quoting with security details
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
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
              <span className="text-xs font-medium">Auto</span>
            </div>
            <p className="text-2xl font-bold">{autoQuotes.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Home className="h-4 w-4" />
              <span className="text-xs font-medium">Home</span>
            </div>
            <p className="text-2xl font-bold">{homeQuotes.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Training Goal</span>
            </div>
            <p className="text-2xl font-bold">{totalQuotes}/10</p>
          </CardContent>
        </Card>
      </div>

      {/* TRAINING PROGRESS */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Training Progress</span>
            <span className="text-sm text-muted-foreground">
              {Math.min(totalQuotes, 10)} of 10 quotes completed
            </span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{
                width: `${Math.min((totalQuotes / 10) * 100, 100)}%`
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* QUOTE HISTORY */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Quote History
          </CardTitle>
          <CardDescription>
            Your recent quoting submissions
          </CardDescription>
        </CardHeader>

        <CardContent>
          {quotes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground">
                No quotes yet.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Start a new auto or homeowners quote to see history here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Type</th>
                    <th className="text-left py-3 px-2">Customer</th>
                    <th className="text-left py-3 px-2 hidden sm:table-cell">Date</th>
                    <th className="text-left py-3 px-2">Best Rate</th>
                    <th className="text-left py-3 px-2 hidden md:table-cell">Carrier</th>
                    <th className="text-right py-3 px-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((quote) => {
                    const bestQuote = quote.quotes.find((q) => q.isBestValue)
                    return (
                      <tr key={quote.id} className="border-b">
                        <td className="py-3 px-2">
                          <Badge variant="secondary">
                            {quote.type === "auto" ? "Auto" : "Home"}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 font-medium">
                          {quote.customerName}
                        </td>
                        <td className="py-3 px-2 hidden sm:table-cell">
                          {new Date(quote.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-2 font-medium">
                          {bestQuote ? `$${bestQuote.annualPremium.toLocaleString()}/yr` : "N/A"}
                        </td>
                        <td className="py-3 px-2 hidden md:table-cell">
                          {bestQuote?.carrierName || "N/A"}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <Link href={`/quote/results?id=${quote.id}`}>
                            <Button variant="ghost" size="sm">
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
