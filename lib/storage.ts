import type { VAUser, QuoteResult } from "./types"

const KEYS = {
  currentUser: "lava_current_user",
  users: "lava_users",
  quotes: "lava_quotes",
}

// --- Current User ---
export function getCurrentUser(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(KEYS.currentUser)
}

export function setCurrentUser(name: string): void {
  localStorage.setItem(KEYS.currentUser, name)
  // Upsert VA user record
  const users = getUsers()
  const existing = users.find((u) => u.name === name)
  if (existing) {
    existing.loginCount += 1
    existing.lastLogin = new Date().toISOString()
  } else {
    users.push({
      name,
      loginCount: 1,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    })
  }
  localStorage.setItem(KEYS.users, JSON.stringify(users))
}

export function clearCurrentUser(): void {
  localStorage.removeItem(KEYS.currentUser)
}

// --- VA Users ---
export function getUsers(): VAUser[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEYS.users)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// --- Quotes ---
export function getQuotes(): QuoteResult[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEYS.quotes)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function getQuotesByUser(vaName: string): QuoteResult[] {
  return getQuotes().filter((q) => q.vaName === vaName)
}

export function saveQuote(quote: QuoteResult): void {
  const quotes = getQuotes()
  quotes.unshift(quote)
  localStorage.setItem(KEYS.quotes, JSON.stringify(quotes))
}

export function getQuoteById(id: string): QuoteResult | null {
  return getQuotes().find((q) => q.id === id) || null
}

export function generateQuoteId(): string {
  return `Q-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
}
