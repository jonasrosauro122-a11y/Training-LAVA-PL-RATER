"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { GraduationCap, UserCog } from "lucide-react"

import { getCurrentUser, setCurrentUser, setUserRole, getUserRole } from "@/lib/storage"

const TRAINER_PASSWORD = "LavaTrainer2025!"

export default function LoginPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"student" | "trainer">("student")
  const [error, setError] = useState("")
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [trainerPassword, setTrainerPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      router.replace("/dashboard")
    }
  }, [router])

  function handleRoleChange(value: string) {
    if (value === "trainer") {
      setShowPasswordDialog(true)
    } else if (value === "student") {
      setRole("student")
    }
  }

  function handlePasswordSubmit() {
    if (trainerPassword === TRAINER_PASSWORD) {
      setRole("trainer")
      setShowPasswordDialog(false)
      setTrainerPassword("")
      setPasswordError("")
    } else {
      setPasswordError("Incorrect password. Access denied.")
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const trimmedName = name.trim()
    const trimmedEmail = email.trim().toLowerCase()

    if (!trimmedName) {
      setError("Please enter your full name.")
      return
    }

    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters.")
      return
    }

    if (!trimmedEmail) {
      setError("Please enter your email address.")
      return
    }

    if (!trimmedEmail.endsWith("@lavatraining.com")) {
      setError("Email must end with @lavatraining.com")
      return
    }

    setCurrentUser(trimmedName, trimmedEmail)
    setUserRole(role)
    router.push("/dashboard")
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
                src="/apple-icon.png1"
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
            Insurance quoting training simulator. Enter your credentials to get started.
          </CardDescription>

        </CardHeader>

        <CardContent className="pb-8">

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">

            {/* Role Toggle */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Role</Label>
              <ToggleGroup
                type="single"
                value={role}
                onValueChange={handleRoleChange}
                className="justify-start"
              >
                <ToggleGroupItem value="student" aria-label="VA Student" className="gap-2 flex-1">
                  <GraduationCap className="h-4 w-4" />
                  VA Student
                </ToggleGroupItem>
                <ToggleGroupItem value="trainer" aria-label="Trainer" className="gap-2 flex-1">
                  <UserCog className="h-4 w-4" />
                  Trainer
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="flex flex-col gap-2">

              <Label htmlFor="va-name" className="text-sm font-medium">
                Full Name *
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

            </div>

            <div className="flex flex-col gap-2">

              <Label htmlFor="va-email" className="text-sm font-medium">
                Email *
              </Label>

              <Input
                id="va-email"
                type="email"
                placeholder="e.g. jonasrosauro123@lavatraining.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError("")
                }}
                className="h-11"
              />

              <p className="text-xs text-muted-foreground">
                Must be a @lavatraining.com email address
              </p>

            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

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

      {/* Trainer Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trainer Access</DialogTitle>
            <DialogDescription>
              Enter the trainer password to access trainer mode.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="trainer-password">Password</Label>
              <Input
                id="trainer-password"
                type="password"
                value={trainerPassword}
                onChange={(e) => {
                  setTrainerPassword(e.target.value)
                  if (passwordError) setPasswordError("")
                }}
                placeholder="Enter trainer password"
              />
              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowPasswordDialog(false)
              setTrainerPassword("")
              setPasswordError("")
            }}>
              Cancel
            </Button>
            <Button onClick={handlePasswordSubmit} className="lava-gradient-bg text-white border-0">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </main>
  )
}
