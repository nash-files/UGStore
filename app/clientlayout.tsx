"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { useEffect } from "react"
import { initializeDatabase } from "@/lib/initialize-database"

const inter = Inter({ subsets: ["latin"] })

// Client component to initialize the database
function DatabaseInitializer() {
  useEffect(() => {
    // Initialize the database on client-side
    initializeDatabase()
  }, [])

  return null
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <DatabaseInitializer />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

