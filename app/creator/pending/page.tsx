"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { MainHeader } from "@/components/main-header"

export default function CreatorPendingPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      router.push("/login")
      return
    }

    // Redirect if not a creator or if already approved
    if (user.role !== "creator" || user.approvalStatus !== "pending") {
      router.push("/")
    }
  }, [user, router])

  if (!user || user.role !== "creator" || user.approvalStatus !== "pending") {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      <div className="flex flex-1 flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-md space-y-6 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center dark:bg-yellow-900">
            <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-300" />
          </div>
          <h1 className="text-3xl font-bold">Application Pending</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Your creator application is currently under review. This process typically takes 1-3 business days.
          </p>
          <div className="bg-muted p-4 rounded-lg text-left">
            <h2 className="font-medium mb-2">What happens next?</h2>
            <ul className="space-y-2 text-sm">
              <li>Our team will review your application</li>
              <li>You'll receive an email notification once your application is approved or rejected</li>
              <li>If approved, you'll gain access to the creator dashboard and be able to upload resources</li>
              <li>If rejected, you'll receive feedback on why and can reapply after addressing the issues</li>
            </ul>
          </div>
          <div className="pt-4">
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

