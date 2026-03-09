"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Car, Home, FileText, TrendingUp, Clock, Users, Shield, Calendar, Mail } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthGuard } from "@/components/auth-guard"

import { getCurrentUser, getCurrentEmail, getUserRole, getQuotesByUser, getUsers, getAllQuotes } from "@/lib/storage"
import type { QuoteResult, VAUser } from "@/lib/types"

function DashboardContent() {
  const [vaName, setVaName] = useState("")
  const [vaEmail, setVaEmail] = useState("")
  const [userRole, setUserRole] = useState<"student" | "trainer">("student")
  const [quotes, setQuotes] = useState<QuoteResult[]>([])
  const [allQuotes, setAllQuotes] = useState<QuoteResult[]>([])
  const [allUsers, setAllUsers] = useState<VAUser[]>([])

  useEffect(() => {
    const user = getCurrentUser()
    const email = getCurrentEmail()
    const role = getUserRole()

    if (user) {
      setVaName(user)
      setVaEmail(email || "")
      setUserRole(role)
      setQuotes(getQuotesByUser(user))
      
      if (role === "trainer") {
        setAllQuotes(getAllQuotes())
        setAllUsers(getUsers())
      }
    }
  }, [])

  const autoQuotes = quotes.filter((q) => q.type === "auto")
  const homeQuotes = quotes.filter((q) => q.type === "homeowners")
  const totalQuotes = quotes.length

  const isTrainer = userRole === "trainer"

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* HEADER WITH LOGO */}
      <div className="flex items-center gap-4 mb-10">

        <Image
          src="/apple-icon.png1"
          alt="LAVA RATER Logo"
          width={60}
          height={60}
          className="rounded-xl shadow-md"
        />

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {vaName}
            </h1>
            {isTrainer && (
              <Badge className="lava-gradient-bg text-white border-0">
                <Shield className="h-3 w-3 mr-1" />
                Trainer
              </Badge>
            )}
          </div>

          <p className="text-muted-foreground">
            {vaEmail && <span className="text-sm">{vaEmail} &bull; </span>}
            Select a quote type to begin or review your previous submissions.
          </p>
        </div>

      </div>

      {/* QUICK ACTION CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

        <Link href="/pre-quote?type=auto" className="group">
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary/30 cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Car className="h-7 w-7 text-primary" />
              </div>

              <div>
                <CardTitle className="text-lg">New Auto Quote</CardTitle>
                <CardDescription className="mt-1">
                  Multi-vehicle auto insurance quoting with driver info
                </CardDescription>
              </div>

            </CardContent>
          </Card>
        </Link>

        <Link href="/pre-quote?type=homeowners" className="group">
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary/30 cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/20">
                <Home className="h-7 w-7 text-accent" />
              </div>

              <div>
                <CardTitle className="text-lg">New Homeowners Quote</CardTitle>
                <CardDescription className="mt-1">
                  Homeowners / renters / condo quoting wizard
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

      {/* TRAINER ADMIN PANEL */}
      {isTrainer && (
        <Card className="mb-8 border-primary/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Trainer Admin Panel
            </CardTitle>
            <CardDescription>
              View all VA students and their quoting activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="users" className="gap-2">
                  <Users className="h-4 w-4" />
                  VA Students
                </TabsTrigger>
                <TabsTrigger value="all-quotes" className="gap-2">
                  <FileText className="h-4 w-4" />
                  All Quotes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="users">
                {allUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No users registered yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2">Name</th>
                          <th className="text-left py-3 px-2 hidden sm:table-cell">Email</th>
                          <th className="text-left py-3 px-2">Logins</th>
                          <th className="text-left py-3 px-2 hidden md:table-cell">Last Login</th>
                          <th className="text-left py-3 px-2 hidden lg:table-cell">Registered</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers.map((user, idx) => (
                          <tr key={idx} className="border-b">
                            <td className="py-3 px-2 font-medium">{user.name}</td>
                            <td className="py-3 px-2 hidden sm:table-cell">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {user.email || "N/A"}
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <Badge variant="outline">{user.loginCount}</Badge>
                            </td>
                            <td className="py-3 px-2 hidden md:table-cell text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(user.lastLogin).toLocaleString()}
                              </div>
                            </td>
                            <td className="py-3 px-2 hidden lg:table-cell text-muted-foreground">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="all-quotes">
                {allQuotes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No quotes submitted yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2">VA Name</th>
                          <th className="text-left py-3 px-2">Type</th>
                          <th className="text-left py-3 px-2">Customer</th>
                          <th className="text-left py-3 px-2 hidden sm:table-cell">Date</th>
                          <th className="text-left py-3 px-2">Best Rate</th>
                          <th className="text-right py-3 px-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allQuotes.map((quote) => {
                          const bestQuote = quote.quotes.find((q) => q.isBestValue)
                          return (
                            <tr key={quote.id} className="border-b">
                              <td className="py-3 px-2 font-medium">{quote.vaName}</td>
                              <td className="py-3 px-2">
                                <Badge variant="secondary">
                                  {quote.type === "auto" ? "Auto" : "Home"}
                                </Badge>
                              </td>
                              <td className="py-3 px-2">{quote.customerName}</td>
                              <td className="py-3 px-2 hidden sm:table-cell text-muted-foreground">
                                {new Date(quote.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-2 font-medium">
                                ${bestQuote?.annualPremium.toLocaleString()}/yr
                              </td>
                              <td className="py-3 px-2 text-right">
                                <Link href={`/quote/results?id=${quote.id}`}>
                                  <Button variant="ghost" size="sm">View</Button>
                                </Link>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* QUOTE HISTORY */}

      <Card>

        <CardHeader>

          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {isTrainer ? "My Quote History" : "Quote History"}
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
                          ${bestQuote?.annualPremium.toLocaleString()}/yr
                        </td>

                        <td className="py-3 px-2 hidden md:table-cell">
                          {bestQuote?.carrierName}
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
