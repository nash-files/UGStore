"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  ShieldCheck,
  BarChart,
  MessageSquare,
  CreditCard,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <Link href="/admin/dashboard" className="flex items-center gap-2 px-4 py-3">
          <ShieldCheck className="h-6 w-6" />
          <span className="font-semibold">Admin Dashboard</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/admin/dashboard")}>
              <Link href="/admin/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/admin/resources")}>
              <Link href="/admin/resources">
                <Package className="mr-2 h-4 w-4" />
                Resources
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/admin/creators")}>
              <Link href="/admin/creators">
                <Users className="mr-2 h-4 w-4" />
                Creators
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/admin/users")}>
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Users
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/admin/analytics")}>
              <Link href="/admin/analytics">
                <BarChart className="mr-2 h-4 w-4" />
                Analytics
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/admin/messages")}>
              <Link href="/admin/messages">
                <MessageSquare className="mr-2 h-4 w-4" />
                Messages
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/admin/payments")}>
              <Link href="/admin/payments">
                <CreditCard className="mr-2 h-4 w-4" />
                Payments
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/admin/settings")}>
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="text-xs text-muted-foreground">Admin Portal v1.0</div>
      </SidebarFooter>
    </Sidebar>
  )
}

