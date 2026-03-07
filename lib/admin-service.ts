import { createClient } from "@/lib/supabase/client"
import type { 
  UserProfile, 
  ActivityLog, 
  UserSession, 
  QuoteAuditTrail,
  ActivityAction,
  UserRole,
  ActivityLogFilters 
} from "@/lib/admin-types"

const supabase = createClient()

// ============ USER PROFILES ============

export async function getUserProfiles(): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .order("created_at", { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single()
  
  if (error) return null
  return data
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return getUserProfile(user.id)
}

export async function updateUserProfile(
  userId: string, 
  updates: Partial<Pick<UserProfile, "full_name" | "role" | "is_active">>
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("user_profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deactivateUser(userId: string): Promise<void> {
  await updateUserProfile(userId, { is_active: false })
  await logActivity({
    action: "user_deactivated",
    resourceType: "user",
    resourceId: userId,
    details: { deactivated_at: new Date().toISOString() }
  })
}

// ============ ACTIVITY LOGGING ============

export async function logActivity(params: {
  action: ActivityAction
  resourceType?: string
  resourceId?: string
  details?: Record<string, unknown>
}): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase
    .from("activity_logs")
    .insert({
      user_id: user.id,
      action: params.action,
      resource_type: params.resourceType || null,
      resource_id: params.resourceId || null,
      details: params.details || null,
      ip_address: null, // Would be set server-side
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null
    })

  if (error) console.error("Failed to log activity:", error)
}

export async function getActivityLogs(filters?: ActivityLogFilters): Promise<ActivityLog[]> {
  let query = supabase
    .from("activity_logs")
    .select(`
      *,
      user_profile:user_profiles(*)
    `)
    .order("created_at", { ascending: false })

  if (filters?.userId) {
    query = query.eq("user_id", filters.userId)
  }
  if (filters?.action) {
    query = query.eq("action", filters.action)
  }
  if (filters?.startDate) {
    query = query.gte("created_at", filters.startDate)
  }
  if (filters?.endDate) {
    query = query.lte("created_at", filters.endDate)
  }
  if (filters?.limit) {
    query = query.limit(filters.limit)
  } else {
    query = query.limit(100)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

// ============ USER SESSIONS ============

export async function startSession(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // End any existing active sessions
  await supabase
    .from("user_sessions")
    .update({ 
      is_active: false, 
      ended_at: new Date().toISOString() 
    })
    .eq("user_id", user.id)
    .eq("is_active", true)

  // Create new session
  const { data, error } = await supabase
    .from("user_sessions")
    .insert({
      user_id: user.id,
      ip_address: null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      is_active: true
    })
    .select()
    .single()

  if (error) {
    console.error("Failed to start session:", error)
    return null
  }

  // Update last login
  await supabase
    .from("user_profiles")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", user.id)

  return data?.id || null
}

export async function endSession(sessionId?: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  let query = supabase
    .from("user_sessions")
    .update({ 
      is_active: false, 
      ended_at: new Date().toISOString() 
    })
    .eq("user_id", user.id)
    .eq("is_active", true)

  if (sessionId) {
    query = query.eq("id", sessionId)
  }

  await query
}

export async function updateSessionActivity(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from("user_sessions")
    .update({ last_activity_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .eq("is_active", true)
}

export async function getActiveSessions(): Promise<UserSession[]> {
  const { data, error } = await supabase
    .from("user_sessions")
    .select(`
      *,
      user_profile:user_profiles(*)
    `)
    .eq("is_active", true)
    .order("last_activity_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getUserSessions(userId: string): Promise<UserSession[]> {
  const { data, error } = await supabase
    .from("user_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("started_at", { ascending: false })
    .limit(50)

  if (error) throw error
  return data || []
}

// ============ QUOTE AUDIT TRAIL ============

export async function logQuoteAction(params: {
  quoteId: string
  action: "created" | "updated" | "deleted" | "exported"
  changes?: Record<string, unknown>
}): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase
    .from("quote_audit_trail")
    .insert({
      quote_id: params.quoteId,
      user_id: user.id,
      action: params.action,
      changes: params.changes || null
    })

  if (error) console.error("Failed to log quote action:", error)

  // Also log to activity logs
  await logActivity({
    action: params.action === "created" ? "quote_created" : 
           params.action === "updated" ? "quote_updated" :
           params.action === "deleted" ? "quote_deleted" : "quote_exported",
    resourceType: "quote",
    resourceId: params.quoteId,
    details: params.changes
  })
}

export async function getQuoteAuditTrail(quoteId: string): Promise<QuoteAuditTrail[]> {
  const { data, error } = await supabase
    .from("quote_audit_trail")
    .select(`
      *,
      user_profile:user_profiles(*)
    `)
    .eq("quote_id", quoteId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

// ============ DASHBOARD STATS ============

export async function getAdminDashboardStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  weekAgo.setHours(0, 0, 0, 0)

  // Get user counts
  const { data: allUsers } = await supabase
    .from("user_profiles")
    .select("id, is_active")

  const totalUsers = allUsers?.length || 0
  const activeUsers = allUsers?.filter(u => u.is_active).length || 0

  // Get quote counts from audit trail
  const { data: todayQuotes } = await supabase
    .from("quote_audit_trail")
    .select("id")
    .eq("action", "created")
    .gte("created_at", today.toISOString())

  const { data: weekQuotes } = await supabase
    .from("quote_audit_trail")
    .select("id")
    .eq("action", "created")
    .gte("created_at", weekAgo.toISOString())

  // Get recent activity
  const recentActivity = await getActivityLogs({ limit: 10 })

  // Get active sessions
  const activeSessions = await getActiveSessions()

  return {
    totalUsers,
    activeUsers,
    totalQuotesToday: todayQuotes?.length || 0,
    totalQuotesThisWeek: weekQuotes?.length || 0,
    recentActivity,
    activeSessions
  }
}

// ============ ROLE CHECKS ============

export async function isAdmin(): Promise<boolean> {
  const profile = await getCurrentUserProfile()
  return profile?.role === "admin"
}

export async function isManager(): Promise<boolean> {
  const profile = await getCurrentUserProfile()
  return profile?.role === "admin" || profile?.role === "manager"
}

export async function canManageUsers(): Promise<boolean> {
  return isManager()
}
