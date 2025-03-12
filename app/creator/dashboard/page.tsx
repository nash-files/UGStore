"use client"

import Link from "next/link"
import {
  ArrowUpRight,
  BarChart3,
  Download,
  FileText,
  MessageSquare,
  Package,
  Plus,
  Settings,
  User,
  LogOut,
  Bell,
} from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import CreatorSidebar from "@/components/creator-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useAuth } from "@/components/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { getResourcesByCreator, type Resource } from "@/lib/resource-service"
import { useToast } from "@/hooks/use-toast"

export default function CreatorDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Redirect if not logged in or not a creator
    if (user && user.role !== "creator") {
      router.push("/")
      return
    }

    // Load creator resources
    if (user) {
      loadCreatorResources()
    }
  }, [user, router])

  const loadCreatorResources = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const creatorResources = await getResourcesByCreator(user.id)
      setResources(creatorResources)
    } catch (error) {
      console.error("Error loading resources:", error)
      toast({
        title: "Error",
        description: "Failed to load your resources. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Get counts for different resource statuses
  const activeCount = resources.filter((r) => r.status === "approved").length
  const pendingCount = resources.filter((r) => r.status === "pending").length
  const draftCount = resources.filter((r) => r.status === "rejected").length

  // Calculate total revenue (simplified example)
  const totalRevenue = resources.reduce((sum, resource) => {
    return sum + (resource.downloads || 0) * resource.price
  }, 0)

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
              <h1 className="text-lg font-semibold">Creator Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                <span className="hidden sm:inline-block">Messages</span>
                <Badge className="ml-1 rounded-full px-1">3</Badge>
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
                    <div className="flex items-start gap-4 p-3 hover:bg-muted/50 rounded-md">
                      <div className="flex-shrink-0">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src="/placeholder-user.jpg" alt="User" />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New message received</p>
                        <p className="text-xs text-muted-foreground">John Doe sent you a message</p>
                        <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button variant="outline" size="sm" className="w-full">
                      View all notifications
                    </Button>
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
                  <DropdownMenuItem onClick={() => router.push("/creator/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
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
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{resources.length}</div>
                  <p className="text-xs text-muted-foreground">+3 new this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {resources.reduce((sum, resource) => sum + (resource.downloads || 0), 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">+180 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customer Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">3 unread messages</p>
                </CardContent>
              </Card>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Resources</h2>
                <p className="text-muted-foreground">Manage your digital resources and track their performance.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => router.push("/creator/upload")}>
                  <Plus className="mr-2 h-4 w-4" /> Add New Resource
                </Button>
              </div>
            </div>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Resources ({resources.length})</TabsTrigger>
                <TabsTrigger value="active">Active ({activeCount})</TabsTrigger>
                <TabsTrigger value="pending">Pending Approval ({pendingCount})</TabsTrigger>
                <TabsTrigger value="draft">Drafts ({draftCount})</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                <Card>
                  <CardContent className="p-0">
                    {isLoading ? (
                      <div className="flex justify-center items-center p-8">
                        <p>Loading resources...</p>
                      </div>
                    ) : resources.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Downloads</TableHead>
                            <TableHead>Revenue</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {resources.map((resource) => (
                            <TableRow key={resource.id}>
                              <TableCell className="font-medium">{resource.title}</TableCell>
                              <TableCell>{resource.category}</TableCell>
                              <TableCell>${resource.price.toFixed(2)}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    resource.status === "approved"
                                      ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                                      : resource.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800"
                                        : "bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800"
                                  }
                                >
                                  {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{resource.downloads || 0}</TableCell>
                              <TableCell>${((resource.downloads || 0) * resource.price).toFixed(2)}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="icon" asChild>
                                  <Link href={`/creator/resources/edit/${resource.id}`}>
                                    <FileText className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Link>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <p className="mb-4 text-muted-foreground">You haven't uploaded any resources yet.</p>
                        <Button onClick={() => router.push("/creator/upload")}>
                          <Plus className="mr-2 h-4 w-4" /> Upload Your First Resource
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="active" className="space-y-4">
                <Card>
                  <CardContent className="p-0">
                    {isLoading ? (
                      <div className="flex justify-center items-center p-8">
                        <p>Loading resources...</p>
                      </div>
                    ) : resources.filter((r) => r.status === "approved").length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Downloads</TableHead>
                            <TableHead>Revenue</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {resources
                            .filter((r) => r.status === "approved")
                            .map((resource) => (
                              <TableRow key={resource.id}>
                                <TableCell className="font-medium">{resource.title}</TableCell>
                                <TableCell>{resource.category}</TableCell>
                                <TableCell>${resource.price.toFixed(2)}</TableCell>
                                <TableCell>{resource.downloads || 0}</TableCell>
                                <TableCell>${((resource.downloads || 0) * resource.price).toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="icon" asChild>
                                    <Link href={`/creator/resources/edit/${resource.id}`}>
                                      <FileText className="h-4 w-4" />
                                      <span className="sr-only">Edit</span>
                                    </Link>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="flex justify-center items-center p-8">
                        <p className="text-muted-foreground">No active resources found.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="pending" className="space-y-4">
                <Card>
                  <CardContent className="p-0">
                    {isLoading ? (
                      <div className="flex justify-center items-center p-8">
                        <p>Loading resources...</p>
                      </div>
                    ) : resources.filter((r) => r.status === "pending").length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {resources
                            .filter((r) => r.status === "pending")
                            .map((resource) => (
                              <TableRow key={resource.id}>
                                <TableCell className="font-medium">{resource.title}</TableCell>
                                <TableCell>{resource.category}</TableCell>
                                <TableCell>${resource.price.toFixed(2)}</TableCell>
                                <TableCell>{resource.createdAt.toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="icon" asChild>
                                    <Link href={`/creator/resources/edit/${resource.id}`}>
                                      <FileText className="h-4 w-4" />
                                      <span className="sr-only">Edit</span>
                                    </Link>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="flex justify-center items-center p-8">
                        <p className="text-muted-foreground">No pending resources found.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="draft" className="space-y-4">
                <Card>
                  <CardContent className="p-0">
                    {isLoading ? (
                      <div className="flex justify-center items-center p-8">
                        <p>Loading resources...</p>
                      </div>
                    ) : resources.filter((r) => r.status === "rejected").length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {resources
                            .filter((r) => r.status === "rejected")
                            .map((resource) => (
                              <TableRow key={resource.id}>
                                <TableCell className="font-medium">{resource.title}</TableCell>
                                <TableCell>{resource.category}</TableCell>
                                <TableCell>${resource.price.toFixed(2)}</TableCell>
                                <TableCell>{resource.updatedAt.toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="icon" asChild>
                                    <Link href={`/creator/resources/edit/${resource.id}`}>
                                      <FileText className="h-4 w-4" />
                                      <span className="sr-only">Edit</span>
                                    </Link>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="flex justify-center items-center p-8">
                        <p className="text-muted-foreground">No draft resources found.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your resource activity for the past 30 days.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[200px] w-full bg-muted rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Activity chart will appear here</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                  <CardDescription>You have 3 unread messages.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/placeholder-user.jpg" alt="@user1" />
                        <AvatarFallback>U1</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold">John Doe</div>
                          <div className="text-xs text-muted-foreground">2 hours ago</div>
                          <Badge className="h-1.5 w-1.5 rounded-full p-0 bg-primary" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          I have a question about your UI Component Library...
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/placeholder-user.jpg" alt="@user2" />
                        <AvatarFallback>U2</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold">Jane Smith</div>
                          <div className="text-xs text-muted-foreground">5 hours ago</div>
                          <Badge className="h-1.5 w-1.5 rounded-full p-0 bg-primary" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Can you create a custom package for my business?
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/placeholder-user.jpg" alt="@user3" />
                        <AvatarFallback>U3</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold">Alex Johnson</div>
                          <div className="text-xs text-muted-foreground">Yesterday</div>
                          <Badge className="h-1.5 w-1.5 rounded-full p-0 bg-primary" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Thanks for the quick response! I'll check out the...
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Button variant="outline" size="sm" className="gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      View All Messages
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

