"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ClipboardList, Calendar, Users, UserCheck } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppHeader } from "@/components/app-header"

import { createClient } from "@/lib/supabase/client"
import { TRAINERS, TEAM_LEADERS, type PreQuoteForm } from "@/lib/types"
import type { User } from "@supabase/supabase-js"

export default function PreQuotePage() {
  const [user, setUser] = useState<User | null>(null)
  const [vaName, setVaName] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [existingForm, setExistingForm] = useState<PreQuoteForm | null>(null)
  
  const [form, setForm] = useState<PreQuoteForm>({
    vaName: "",
    quoteDate: new Date().toISOString().split("T")[0],
    trainer: "",
    teamLeader: "",
  })

  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        router.replace("/")
        return
      }

      setUser(authUser)
      const name = authUser.user_metadata?.va_name || authUser.email?.split("@")[0] || "VA"
      setVaName(name)
      setForm(prev => ({ ...prev, vaName: name }))

      // Check for existing pre-quote form for today
      const today = new Date().toISOString().split("T")[0]
      const { data: existingForms } = await supabase
        .from("pre_quote_forms")
        .select("*")
        .eq("user_id", authUser.id)
        .eq("quote_date", today)
        .limit(1)

      if (existingForms && existingForms.length > 0) {
        setExistingForm(existingForms[0])
        setForm({
          id: existingForms[0].id,
          vaName: existingForms[0].va_name,
          quoteDate: existingForms[0].quote_date,
          trainer: existingForms[0].trainer,
          teamLeader: existingForms[0].team_leader,
        })
      }

      setLoading(false)
    }

    checkAuth()
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!form.trainer) {
      setError("Please select your trainer.")
      return
    }

    if (!form.teamLeader) {
      setError("Please select your team leader.")
      return
    }

    setSubmitting(true)

    try {
      const supabase = createClient()

      if (existingForm) {
        // Update existing form
        const { error: updateError } = await supabase
          .from("pre_quote_forms")
          .update({
            trainer: form.trainer,
            team_leader: form.teamLeader,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingForm.id)

        if (updateError) {
          setError(updateError.message)
          setSubmitting(false)
          return
        }
      } else {
        // Create new form
        const { error: insertError } = await supabase
          .from("pre_quote_forms")
          .insert({
            user_id: user?.id,
            va_name: form.vaName,
            quote_date: form.quoteDate,
            trainer: form.trainer,
            team_leader: form.teamLeader,
          })

        if (insertError) {
          setError(insertError.message)
          setSubmitting(false)
          return
        }
      }

      // Redirect to dashboard
      router.push("/dashboard")
    } catch {
      setError("An unexpected error occurred. Please try again.")
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="lava-spinner" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader vaName={vaName} />
      
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-lg shadow-xl border-border/50">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <ClipboardList className="h-8 w-8 text-primary" />
              </div>
            </div>
            
            <CardTitle className="text-2xl">Pre-Quote Form</CardTitle>
            <CardDescription className="text-base mt-2">
              {existingForm 
                ? "Update your pre-quote information for today's session."
                : "Complete this form before starting any quotes today."
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* VA Name - Read only */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="va-name" className="text-sm font-medium flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  VA Name
                </Label>
                <Input
                  id="va-name"
                  type="text"
                  value={form.vaName}
                  disabled
                  className="h-11 bg-muted"
                />
              </div>

              {/* Quote Date - Read only */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="quote-date" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Quote Date
                </Label>
                <Input
                  id="quote-date"
                  type="date"
                  value={form.quoteDate}
                  disabled
                  className="h-11 bg-muted"
                />
              </div>

              {/* Trainer Selection */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="trainer" className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Trainer <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.trainer}
                  onValueChange={(value) => setForm({ ...form, trainer: value as PreQuoteForm["trainer"] })}
                >
                  <SelectTrigger id="trainer" className="h-11">
                    <SelectValue placeholder="Select your trainer" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRAINERS.map((trainer) => (
                      <SelectItem key={trainer.value} value={trainer.value}>
                        {trainer.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Team Leader Selection */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="team-leader" className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Team Leader <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.teamLeader}
                  onValueChange={(value) => setForm({ ...form, teamLeader: value as PreQuoteForm["teamLeader"] })}
                >
                  <SelectTrigger id="team-leader" className="h-11">
                    <SelectValue placeholder="Select your team leader" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAM_LEADERS.map((leader) => (
                      <SelectItem key={leader.value} value={leader.value}>
                        {leader.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="h-11 lava-gradient-bg text-white font-medium hover:opacity-90 transition-opacity border-0 mt-2"
              >
                {submitting 
                  ? (existingForm ? "Updating..." : "Submitting...") 
                  : (existingForm ? "Update & Continue" : "Submit & Continue")
                }
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                This information helps track your training progress and assigns your quotes to the correct trainer and team leader.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
