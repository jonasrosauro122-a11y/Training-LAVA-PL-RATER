"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AppHeader } from "@/components/app-header"
import type { User } from "@supabase/supabase-js"

interface AuthGuardProps {
  children: React.ReactNode
  requirePreQuote?: boolean
}

export function AuthGuard({ children, requirePreQuote = false }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [vaName, setVaName] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [hasPreQuote, setHasPreQuote] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        router.replace("/")
        return
      }

      setUser(authUser)
      setVaName(authUser.user_metadata?.va_name || authUser.email?.split("@")[0] || "VA")

      // Check if user has an active pre-quote form for today
      if (requirePreQuote) {
        const today = new Date().toISOString().split("T")[0]
        const { data: preQuoteForms } = await supabase
          .from("pre_quote_forms")
          .select("id")
          .eq("user_id", authUser.id)
          .eq("quote_date", today)
          .limit(1)

        if (!preQuoteForms || preQuoteForms.length === 0) {
          // No pre-quote form for today, redirect to pre-quote page
          router.replace("/pre-quote")
          return
        }
        setHasPreQuote(true)
      }

      setLoading(false)
    }

    checkAuth()
  }, [router, requirePreQuote, pathname])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="lava-spinner" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requirePreQuote && !hasPreQuote) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader vaName={vaName} />
      <div className="flex-1">{children}</div>
    </div>
  )
}
