"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Upload, BarChart, MessageSquare, Settings, CreditCard, Users } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function CreatorSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <Link href="/creator/dashboard" className="flex items-center gap-2 px-4 py-3">
          <Package className="h-6 w-6" />
          <span className="font-semibold">Creator Dashboard</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/creator/dashboard")}>
              <Link href="/creator/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/creator/resources")}>
              <Link href="/creator/resources">
                <Package className="mr-2 h-4 w-4" />
                My Resources
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/creator/upload")}>
              <Link href="/creator/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload Resource
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/creator/analytics")}>
              <Link href="/creator/analytics">
                <BarChart className="mr-2 h-4 w-4" />
                Analytics
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/creator/messages")}>
              <Link href="/creator/messages">
                <MessageSquare className="mr-2 h-4 w-4" />
                Messages
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/creator/customers")}>
              <Link href="/creator/customers">
                <Users className="mr-2 h-4 w-4" />
                Customers
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/creator/payments")}>
              <Link href="/creator/payments">
                <CreditCard className="mr-2 h-4 w-4" />
                Payments
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/creator/settings")}>
              <Link href="/creator/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="text-xs text-muted-foreground">Creator Portal v1.0</div>
      </SidebarFooter>
    </Sidebar>
  )
}

// Also export as default for flexibility
export default CreatorSidebar

