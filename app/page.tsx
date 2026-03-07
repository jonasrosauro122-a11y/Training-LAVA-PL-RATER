"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [vaName, setVaName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<"login" | "signup">("login")
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      router.push("/dashboard")
    } catch {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    const trimmedName = vaName.trim()
    const trimmedEmail = email.trim()

    if (!trimmedName || trimmedName.length < 2) {
      setError("Please enter your full name (at least 2 characters).")
      return
    }

    if (!trimmedEmail) {
      setError("Please enter your email address.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/dashboard`,
          data: {
            va_name: trimmedName,
          },
        },
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      // Show success message
      setError("")
      setTab("login")
      alert("Account created! Please check your email to confirm your account, then log in.")
    } catch {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 20%, var(--lava-red) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, var(--lava-orange) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      <Card className="w-full max-w-md relative z-10 shadow-xl border-border/50">
        <CardHeader className="text-center pb-2 pt-8">
          {/* LOGO */}
          <div className="flex justify-center mb-4">
            <div className="flex flex-col items-center gap-3">
              <Image
                src="/apple-icon.png"
                alt="LAVA Logo"
                width={90}
                height={90}
                priority
                className="rounded-2xl shadow-lg"
              />
              <span className="text-2xl font-bold text-orange-600 tracking-wide">
                LAVA RATER
              </span>
            </div>
          </div>

          <CardDescription className="text-base text-muted-foreground mt-3">
            Insurance quoting training simulator for VAs
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-8">
          <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "signup")} className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="login-email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError("")
                    }}
                    autoFocus
                    className="h-11"
                    disabled={loading}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="login-password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (error) setError("")
                    }}
                    className="h-11"
                    disabled={loading}
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive" role="alert">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 lava-gradient-bg text-white font-medium hover:opacity-90 transition-opacity border-0"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="flex flex-col gap-4 mt-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="signup-name" className="text-sm font-medium">
                    Your Full Name
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="e.g. Maria Santos"
                    value={vaName}
                    onChange={(e) => {
                      setVaName(e.target.value)
                      if (error) setError("")
                    }}
                    className="h-11"
                    disabled={loading}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError("")
                    }}
                    className="h-11"
                    disabled={loading}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="signup-password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (error) setError("")
                    }}
                    className="h-11"
                    disabled={loading}
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive" role="alert">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 lava-gradient-bg text-white font-medium hover:opacity-90 transition-opacity border-0"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Practice quoting Auto and Homeowners insurance across 7 carriers.
              Track your progress and export PDF summaries.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
