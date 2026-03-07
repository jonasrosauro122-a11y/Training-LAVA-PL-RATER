// Admin Monitoring System Types

export type UserRole = "admin" | "manager" | "va"

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
  last_login_at: string | null
}

export type ActivityAction = 
  | "login"
  | "logout"
  | "quote_created"
  | "quote_updated"
  | "quote_deleted"
  | "quote_exported"
  | "user_created"
  | "user_updated"
  | "user_deactivated"
  | "settings_changed"

export interface ActivityLog {
  id: string
  user_id: string
  action: ActivityAction
  resource_type: string | null
  resource_id: string | null
  details: Record<string, unknown> | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
  // Joined fields
  user_profile?: UserProfile
}

export interface UserSession {
  id: string
  user_id: string
  started_at: string
  last_activity_at: string
  ended_at: string | null
  ip_address: string | null
  user_agent: string | null
  is_active: boolean
  // Joined fields
  user_profile?: UserProfile
}

export interface QuoteAuditTrail {
  id: string
  quote_id: string
  user_id: string
  action: "created" | "updated" | "deleted" | "exported"
  changes: Record<string, unknown> | null
  created_at: string
  // Joined fields
  user_profile?: UserProfile
}

// Dashboard Stats
export interface AdminDashboardStats {
  totalUsers: number
  activeUsers: number
  totalQuotesToday: number
  totalQuotesThisWeek: number
  recentActivity: ActivityLog[]
  activeSessions: UserSession[]
}

// Filter options for activity logs
export interface ActivityLogFilters {
  userId?: string
  action?: ActivityAction
  startDate?: string
  endDate?: string
  limit?: number
}
