"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Suspense } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AuthGuard } from "@/components/auth-guard"
import { ClipboardList, ArrowRight } from "lucide-react"

import { getCurrentUser, savePreQuoteForm, setCurrentPreQuoteForm } from "@/lib/storage"

const TRAINERS = [
  { value: "nash", label: "Nash" },
  { value: "au", label: "Au" },
  { value: "kyle", label: "Kyle" },
  { value: "chanie", label: "Chanie" },
]

const TEAM_LEADERS = [
  { value: "rj", label: "RJ" },
  { value: "martin", label: "Martin" },
  { value: "ed", label: "Ed" },
  { value: "rezyl", label: "Rezyl" },
]

function PreQuoteFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const quoteType = searchParams.get("type") || "auto"
  
  const [vaName, setVaName] = useState("")
  const [date, setDate] = useState("")
  const [trainerName, setTrainerName] = useState("")
  const [teamLeaderName, setTeamLeaderName] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setVaName(user)
    }
    // Set current date
    setDate(new Date().toISOString().split("T")[0])
  }, [])

  function validate(): boolean {
    const errs: Record<string, string> = {}
    
    if (!vaName.trim()) errs.vaName = "Required"
    if (!date) errs.date = "Required"
    if (!trainerName) errs.trainerName = "Required"
    if (!teamLeaderName) errs.teamLeaderName = "Required"
    
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!validate()) {
      toast.error("Please fill in all required fields.")
      return
    }

    const selectedTrainer = TRAINERS.find((t) => t.value === trainerName)
    const selectedTeamLeader = TEAM_LEADERS.find((t) => t.value === teamLeaderName)

    const formData = {
      id: `PQ-${Date.now()}`,
      vaName,
      date,
      trainerName: selectedTrainer ? `${selectedTrainer.label} > ${selectedTrainer.assistant}` : trainerName,
      teamLeaderName: selectedTeamLeader?.label || teamLeaderName,
      createdAt: new Date().toISOString(),
    }

    // Save form and set it as current session
    savePreQuoteForm(formData)
    setCurrentPreQuoteForm(formData)
    
    toast.success("Pre-quote form saved!")
    
    // Route to the appropriate quote page
    if (quoteType === "homeowners") {
      router.push("/quote/homeowners")
    } else {
      router.push("/quote/auto")
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ClipboardList className="h-6 w-6" />
          Pre-Quote Form
        </h1>
        <p className="text-muted-foreground mt-1">
          Complete this form before starting your {quoteType === "homeowners" ? "Homeowners" : "Auto"} quote.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Information</CardTitle>
          <CardDescription>
            This information will be linked to your quote session for tracking purposes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* VA Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="vaName">Full Name of VA *</Label>
              <Input
                id="vaName"
                value={vaName}
                onChange={(e) => setVaName(e.target.value)}
                placeholder="Your full name"
              />
              {errors.vaName && <p className="text-xs text-destructive">{errors.vaName}</p>}
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
            </div>

            {/* Trainer Name */}
            <div className="flex flex-col gap-1.5">
              <Label>{"Trainer's Name *"}</Label>
              <Select value={trainerName} onValueChange={setTrainerName}>
                <SelectTrigger>
                  <SelectValue placeholder="Select trainer" />
                </SelectTrigger>
                <SelectContent>
                  {TRAINERS.map((trainer) => (
                    <SelectItem key={trainer.value} value={trainer.value}>
                      {trainer.label} {">"} {trainer.assistant}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.trainerName && <p className="text-xs text-destructive">{errors.trainerName}</p>}
            </div>

            {/* Team Leader Name */}
            <div className="flex flex-col gap-1.5">
              <Label>{"Team Leader's Name *"}</Label>
              <Select value={teamLeaderName} onValueChange={setTeamLeaderName}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team leader" />
                </SelectTrigger>
                <SelectContent>
                  {TEAM_LEADERS.map((leader) => (
                    <SelectItem key={leader.value} value={leader.value}>
                      {leader.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.teamLeaderName && <p className="text-xs text-destructive">{errors.teamLeaderName}</p>}
            </div>

            <Button
              type="submit"
              className="h-11 lava-gradient-bg text-white font-medium hover:opacity-90 transition-opacity border-0 gap-2 mt-4"
            >
              Continue to {quoteType === "homeowners" ? "Homeowners" : "Auto"} Quote
              <ArrowRight className="h-4 w-4" />
            </Button>

          </form>
        </CardContent>
      </Card>
    </main>
  )
}

export default function PreQuotePage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="lava-spinner" /></div>}>
        <PreQuoteFormContent />
      </Suspense>
    </AuthGuard>
  )
}
