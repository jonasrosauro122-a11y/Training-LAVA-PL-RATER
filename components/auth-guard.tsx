"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/storage"
import { AppHeader } from "@/components/app-header"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [vaName, setVaName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.replace("/")
    } else {
      setVaName(user)
      setLoading(false)
    }
  }, [router])

  if (loading || !vaName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="lava-spinner" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader vaName={vaName} />
      <div className="flex-1">{children}</div>
    </div>
  )
}
