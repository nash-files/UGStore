"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package, Bell, MessageSquare, User, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import CreatorSidebar from "@/components/creator-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function CreatorSettings() {
  const { user, logout, updateUserSettings } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    marketingEmails: false,
    resourceUpdates: true,
    theme: "light",
    language: "en",
    profileVisibility: "public",
  })

  // Payment settings
  const [paymentSettings, setPaymentSettings] = useState({
    paypalEmail: "",
    bankAccount: "",
    taxId: "",
  })

  useEffect(() => {
    // Redirect if not logged in or not a creator
    if (user && user.role !== "creator") {
      router.push("/")
      return
    }

    // Load user settings
    if (user && user.settings) {
      setSettings({
        emailNotifications: user.settings.emailNotifications ?? true,
        marketingEmails: user.settings.marketingEmails ?? false,
        resourceUpdates: user.settings.resourceUpdates ?? true,
        theme: user.settings.theme ?? "light",
        language: user.settings.language ?? "en",
        profileVisibility: user.settings.profileVisibility ?? "public",
      })
    }
  }, [user, router])

  const handleToggleSetting = async (setting: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [setting]: value }))
  }

  const handleSelectChange = (setting: string, value: string) => {
    setSettings((prev) => ({ ...prev, [setting]: value }))
  }

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPaymentSettings((prev) => ({ ...prev, [name]: value }))
  }

  const saveSettings = async () => {
    setIsLoading(true)
    try {
      await updateUserSettings(settings)
      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const savePaymentSettings = async () => {
    setIsLoading(true)
    try {
      // This would be implemented with a server action to update payment settings
      toast({
        title: "Payment Settings Saved",
        description: "Your payment information has been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving payment settings:", error)
      toast({
        title: "Error",
        description: "Failed to save payment settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <CreatorSidebar />
        <div className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <div className="flex flex-1 items-center gap-4">
              <Link href="/" className="lg:hidden">
                <Package className="h-6 w-6" />
                <span className="sr-only">ResourceHub</span>
              </Link>
              <h1 className="text-lg font-semibold">Account Settings</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                <span className="hidden sm:inline-block">Messages</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Bell className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline-block">Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-auto">
                    <div className="flex items-start gap-4 p-3 hover:bg-muted/50 rounded-md">
                      <div className="flex-shrink-0">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src="/placeholder-user.jpg" alt="User" />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Your resource was approved</p>
                        <p className="text-xs text-muted-foreground">Professional Photo Pack is now live</p>
                        <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar || "/placeholder-user.jpg"} alt={user?.name || "User"} />
                      <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/creator/dashboard")}>
                    <Package className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <div className="mx-auto max-w-4xl">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="payments">Payments</TabsTrigger>
                  <TabsTrigger value="subscription">Subscription</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <Card>
                    <CardHeader>
                      <CardTitle>General Settings</CardTitle>
                      <CardDescription>Manage your account preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select
                          value={settings.language}
                          onValueChange={(value) => handleSelectChange("language", value)}
                        >
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <Select value={settings.theme} onValueChange={(value) => handleSelectChange("theme", value)}>
                          <SelectTrigger id="theme">
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="profile-visibility">Profile Visibility</Label>
                        <Select
                          value={settings.profileVisibility}
                          onValueChange={(value) => handleSelectChange("profileVisibility", value)}
                        >
                          <SelectTrigger id="profile-visibility">
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="creators-only">Creators Only</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">Control who can see your creator profile</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={saveSettings} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Control how you receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive email notifications about your account
                          </p>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={settings.emailNotifications}
                          onCheckedChange={(checked) => handleToggleSetting("emailNotifications", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="marketing-emails">Marketing Emails</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive emails about new features and promotions
                          </p>
                        </div>
                        <Switch
                          id="marketing-emails"
                          checked={settings.marketingEmails}
                          onCheckedChange={(checked) => handleToggleSetting("marketingEmails", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="resource-updates">Resource Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified when your resources receive comments or reviews
                          </p>
                        </div>
                        <Switch
                          id="resource-updates"
                          checked={settings.resourceUpdates}
                          onCheckedChange={(checked) => handleToggleSetting("resourceUpdates", checked)}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={saveSettings} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="payments">
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Settings</CardTitle>
                      <CardDescription>Manage how you receive payments for your resources</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="paypal-email">PayPal Email</Label>
                        <Input
                          id="paypal-email"
                          name="paypalEmail"
                          type="email"
                          placeholder="your-email@example.com"
                          value={paymentSettings.paypalEmail}
                          onChange={handlePaymentChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bank-account">Bank Account (Optional)</Label>
                        <Input
                          id="bank-account"
                          name="bankAccount"
                          placeholder="Enter your bank account details"
                          value={paymentSettings.bankAccount}
                          onChange={handlePaymentChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tax-id">Tax ID (Optional)</Label>
                        <Input
                          id="tax-id"
                          name="taxId"
                          placeholder="Enter your tax ID"
                          value={paymentSettings.taxId}
                          onChange={handlePaymentChange}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={savePaymentSettings} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Payment Settings"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="subscription">
                  <Card>
                    <CardHeader>
                      <CardTitle>Subscription Plan</CardTitle>
                      <CardDescription>Manage your creator subscription</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="rounded-lg border p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {user?.plan?.charAt(0).toUpperCase() + user?.plan?.slice(1) || "Free"} Plan
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {user?.plan === "free" && "Up to 5 resources, 1GB storage"}
                              {user?.plan === "basic" && "Up to 20 resources, 5GB storage"}
                              {user?.plan === "premium" && "Up to 100 resources, 25GB storage"}
                              {user?.plan === "professional" && "Unlimited resources, 100GB storage"}
                            </p>
                          </div>
                          <Badge className="text-sm">
                            {user?.plan === "free" && "Free"}
                            {user?.plan === "basic" && "$9.99/month"}
                            {user?.plan === "premium" && "$24.99/month"}
                            {user?.plan === "professional" && "$49.99/month"}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-semibold">Plan Features</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                            <span>
                              {user?.plan === "free" && "25% commission rate"}
                              {user?.plan === "basic" && "20% commission rate"}
                              {user?.plan === "basic" && "20% commission rate"}
                              {user?.plan === "premium" && "15% commission rate"}
                              {user?.plan === "professional" && "10% commission rate"}
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                            <span>
                              {user?.plan === "free" && "Basic analytics"}
                              {user?.plan === "basic" && "Standard analytics"}
                              {user?.plan === "premium" && "Advanced analytics"}
                              {user?.plan === "professional" && "Premium analytics"}
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                            <span>
                              {user?.plan === "free" && "Email support"}
                              {user?.plan === "basic" && "Standard support"}
                              {user?.plan === "premium" && "Priority support"}
                              {user?.plan === "professional" && "Dedicated support"}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => router.push("/pricing")}>Upgrade Plan</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

