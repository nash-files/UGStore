"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { getAnalyticsInstance } from "@/lib/firebase"
import { logEvent } from "firebase/analytics"

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      const analytics = getAnalyticsInstance()
      if (analytics) {
        logEvent(analytics, "page_view", {
          page_path: pathname,
          page_search: searchParams?.toString() || "",
          page_location: window.location.href,
        })
      }
    }
  }, [pathname, searchParams])

  return <>{children}</>
}

