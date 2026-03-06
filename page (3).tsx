"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { LavaLogoWithText } from "@/components/lava-logo"
import { getCurrentUser, setCurrentUser } from "@/lib/storage"

export default function LoginPage() {
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      router.replace("/dashboard")
    }
  }, [router])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError("Please enter your name to continue.")
      return
    }
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters.")
      return
    }
    setCurrentUser(trimmed)
    router.push("/dashboard")
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, var(--lava-red) 0%, transparent 50%),
                            radial-gradient(circle at 70% 80%, var(--lava-orange) 0%, transparent 50%)`,
        }}
        aria-hidden="true"
      />

      <Card className="w-full max-w-md relative z-10 shadow-xl border-border/50">
        <CardHeader className="text-center pb-2 pt-8">
          <div className="flex justify-center mb-4">
            <LavaLogoWithText size="lg" />
          </div>
          <CardDescription className="text-base text-muted-foreground mt-3">
            Insurance quoting training simulator. Enter your name to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="va-name" className="text-sm font-medium">
                Your Name
              </Label>
              <Input
                id="va-name"
                type="text"
                placeholder="e.g. Maria Santos"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (error) setError("")
                }}
                autoFocus
                className="h-11"
              />
              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="h-11 lava-gradient-bg text-white font-medium hover:opacity-90 transition-opacity border-0"
            >
              Start Training
            </Button>
          </form>

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
