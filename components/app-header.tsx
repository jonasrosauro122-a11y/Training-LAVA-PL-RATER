"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, LayoutDashboard, Car, Home, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LavaLogo } from "@/components/lava-logo"
import { createClient } from "@/lib/supabase/client"

export function AppHeader({ vaName }: { vaName: string }) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <LavaLogo size="sm" />
            <span className="font-bold text-lg lava-gradient-text hidden sm:inline">LAVA</span>
          </Link>

          <nav className="flex items-center gap-1" aria-label="Main navigation">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2 text-foreground">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </Link>
            <Link href="/pre-quote">
              <Button variant="ghost" size="sm" className="gap-2 text-foreground">
                <ClipboardList className="h-4 w-4" />
                <span className="hidden sm:inline">Pre-Quote</span>
              </Button>
            </Link>
            <Link href="/quote/auto">
              <Button variant="ghost" size="sm" className="gap-2 text-foreground">
                <Car className="h-4 w-4" />
                <span className="hidden sm:inline">Auto</span>
              </Button>
            </Link>
            <Link href="/quote/homeowners">
              <Button variant="ghost" size="sm" className="gap-2 text-foreground">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Homeowners</span>
              </Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            Signed in as <span className="font-medium text-foreground">{vaName}</span>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
