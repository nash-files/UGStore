import { supabase } from "@/lib/supabase"

export enum AnalyticsEvents {
  PAGE_VIEW = "page_view",
  RESOURCE_VIEW = "resource_view",
  RESOURCE_DOWNLOAD = "resource_download",
  RESOURCE_PURCHASE = "resource_purchase",
  SEARCH = "search",
  UPLOAD_RESOURCE = "upload_resource",
  CREATOR_APPLICATION = "creator_application",
  USER_REGISTRATION = "user_registration",
  USER_LOGIN = "user_login",
}

export const trackEvent = async (
  eventType: AnalyticsEvents | string,
  data: Record<string, any> = {},
  userId?: string | null,
  resourceId?: string | null,
) => {
  try {
    // Don't track events in development unless explicitly enabled
    if (process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_ENABLE_DEV_ANALYTICS) {
      console.log("Analytics event (dev mode):", { eventType, data, userId, resourceId })
      return
    }

    const { error } = await supabase.from("analytics_events").insert([
      {
        event_type: eventType,
        user_id: userId || null,
        resource_id: resourceId || null,
        data,
        created_at: new Date().toISOString(),
      },
    ])

    if (error) {
      console.error("Error tracking analytics event:", error)
    }
  } catch (error) {
    console.error("Error in trackEvent:", error)
  }
}

// Get analytics for a creator
export const getCreatorAnalytics = async (creatorId: string, period: "day" | "week" | "month" | "year" = "month") => {
  try {
    // Get date range based on period
    const now = new Date()
    const startDate = new Date()

    switch (period) {
      case "day":
        startDate.setDate(now.getDate() - 1)
        break
      case "week":
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "year":
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    // Format dates for Supabase
    const startDateStr = startDate.toISOString()
    const endDateStr = now.toISOString()

    // Get resource views
    const { data: viewsData, error: viewsError } = await supabase
      .from("resources")
      .select("id, title, views")
      .eq("creator_id", creatorId)

    if (viewsError) throw viewsError

    // Get resource downloads
    const { data: downloadsData, error: downloadsError } = await supabase
      .from("resources")
      .select("id, title, downloads")
      .eq("creator_id", creatorId)

    if (downloadsError) throw downloadsError

    // Get recent purchases
    const { data: purchasesData, error: purchasesError } = await supabase
      .from("purchases")
      .select("*, resources(title)")
      .eq("resources.creator_id", creatorId)
      .gte("created_at", startDateStr)
      .lte("created_at", endDateStr)
      .order("created_at", { ascending: false })

    if (purchasesError) throw purchasesError

    // Get recent events
    const { data: eventsData, error: eventsError } = await supabase
      .from("analytics_events")
      .select("*")
      .eq("user_id", creatorId)
      .gte("created_at", startDateStr)
      .lte("created_at", endDateStr)
      .order("created_at", { ascending: false })

    if (eventsError) throw eventsError

    return {
      views: viewsData || [],
      downloads: downloadsData || [],
      purchases: purchasesData || [],
      events: eventsData || [],
    }
  } catch (error) {
    console.error("Error getting creator analytics:", error)
    throw error
  }
}

// Get admin analytics
export const getAdminAnalytics = async (period: "day" | "week" | "month" | "year" = "month") => {
  try {
    // Get date range based on period
    const now = new Date()
    const startDate = new Date()

    switch (period) {
      case "day":
        startDate.setDate(now.getDate() - 1)
        break
      case "week":
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "year":
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    // Format dates for Supabase
    const startDateStr = startDate.toISOString()
    const endDateStr = now.toISOString()

    // Get total users
    const { count: userCount, error: userError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })

    if (userError) throw userError

    // Get new users in period
    const { count: newUserCount, error: newUserError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDateStr)
      .lte("created_at", endDateStr)

    if (newUserError) throw newUserError

    // Get total resources
    const { count: resourceCount, error: resourceError } = await supabase
      .from("resources")
      .select("*", { count: "exact", head: true })

    if (resourceError) throw resourceError

    // Get new resources in period
    const { count: newResourceCount, error: newResourceError } = await supabase
      .from("resources")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDateStr)
      .lte("created_at", endDateStr)

    if (newResourceError) throw newResourceError

    // Get total purchases
    const { count: purchaseCount, error: purchaseError } = await supabase
      .from("purchases")
      .select("*", { count: "exact", head: true })

    if (purchaseError) throw purchaseError

    // Get new purchases in period
    const { count: newPurchaseCount, error: newPurchaseError } = await supabase
      .from("purchases")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDateStr)
      .lte("created_at", endDateStr)

    if (newPurchaseError) throw newPurchaseError

    // Get recent events
    const { data: eventsData, error: eventsError } = await supabase
      .from("analytics_events")
      .select("*")
      .gte("created_at", startDateStr)
      .lte("created_at", endDateStr)
      .order("created_at", { ascending: false })
      .limit(100)

    if (eventsError) throw eventsError

    return {
      users: {
        total: userCount || 0,
        new: newUserCount || 0,
      },
      resources: {
        total: resourceCount || 0,
        new: newResourceCount || 0,
      },
      purchases: {
        total: purchaseCount || 0,
        new: newPurchaseCount || 0,
      },
      events: eventsData || [],
    }
  } catch (error) {
    console.error("Error getting admin analytics:", error)
    throw error
  }
}

