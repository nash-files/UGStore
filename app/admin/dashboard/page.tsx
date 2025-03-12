"use client"

import Link from "next/link"
import {
  BarChart3,
  CheckCircle2,
  Package,
  Settings,
  ShieldCheck,
  Users,
  User,
  LogOut,
  Bell,
  X,
  ArrowRight,
  Tag,
  Download,
  DollarSign,
} from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AdminSidebar from "@/components/admin-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { getResources, type Resource, approveResource, rejectResource } from "@/lib/resource-service"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { doc, collection, getDocs, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Define the Creator Application type
type CreatorApplication = {
  id: string
  name: string
  email: string
  category: string
  status: "pending" | "approved" | "rejected"
  createdAt: Date
}

// Define the Report type
type Report = {
  id: string
  title: string
  type: "resource" | "user" | "other"
  reason: string
  reportedId: string
  reportedBy: string
  status: "pending" | "resolved" | "dismissed"
  createdAt: Date
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [pendingResources, setPendingResources] = useState<Resource[]>([])
  const [creatorApplications, setCreatorApplications] = useState<CreatorApplication[]>([])
  const [recentReports, setRecentReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalResources: 0,
    totalCreators: 0,
    pendingApprovals: 0,
    platformRevenue: 0,
    totalUsers: 0,
    totalDownloads: 0,
    totalReports: 0,
  })

  // For analytics chart data
  const [analyticsData, setAnalyticsData] = useState({
    revenueByDay: [] as { date: string; revenue: number }[],
    downloadsThisWeek: 0,
    resourcesThisWeek: 0,
    topCategories: [] as { category: string; count: number }[],
  })

  useEffect(() => {
    // Redirect if not logged in or not an admin
    if (user && user.role !== "admin") {
      router.push("/")
      return
    }

    // Load dashboard data
    if (user) {
      loadPendingResources()
      loadCreatorApplications()
      loadRecentReports()
      loadStats()
      loadAnalyticsData()
    }
  }, [user, router])

  const loadStats = async () => {
    try {
      // Get all resources
      const resourcesCollection = collection(db, "resources")
      const resourcesSnapshot = await getDocs(resourcesCollection)

      let totalResources = 0
      let pendingApprovals = 0
      let platformRevenue = 0
      let totalDownloads = 0

      resourcesSnapshot.forEach((doc) => {
        const data = doc.data()
        totalResources++

        if (data.status === "pending") {
          pendingApprovals++
        }

        if (data.downloads && data.price) {
          platformRevenue += data.downloads * data.price
          totalDownloads += data.downloads
        }
      })

      // Get users count
      const usersCollection = collection(db, "users")
      const usersSnapshot = await getDocs(usersCollection)

      let totalUsers = 0
      let totalCreators = 0
      usersSnapshot.forEach((doc) => {
        const data = doc.data()
        totalUsers++

        if (data.role === "creator") {
          totalCreators++
        }
      })

      // Get reports count
      const reportsCollection = collection(db, "reports")
      const reportsSnapshot = await getDocs(reportsCollection)
      const totalReports = reportsSnapshot.size

      setStats({
        totalResources,
        totalCreators,
        pendingApprovals,
        platformRevenue,
        totalUsers,
        totalDownloads,
        totalReports,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const loadPendingResources = async () => {
    setIsLoading(true)
    try {
      // Get resources with pending status
      const result = await getResources(undefined, undefined, undefined, undefined, "newest", "pending")
      setPendingResources(result.resources)
    } catch (error) {
      console.error("Error loading resources:", error)
      toast({
        title: "Error",
        description: "Failed to load pending resources. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadCreatorApplications = async () => {
    try {
      // Get all users
      const usersCollection = collection(db, "users")
      const querySnapshot = await getDocs(usersCollection)

      const applications: CreatorApplication[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        // Only include creators with pending approval status
        if (data.role === "creator" && (!data.approvalStatus || data.approvalStatus === "pending")) {
          applications.push({
            id: doc.id,
            name: data.name || "Unknown",
            email: data.email || "",
            category: data.category || "Not specified",
            status: data.approvalStatus || "pending",
            createdAt: data.createdAt?.toDate() || new Date(),
          })
        }
      })

      setCreatorApplications(applications)
    } catch (error) {
      console.error("Error loading creator applications:", error)
    }
  }

  const loadRecentReports = async () => {
    try {
      // Get recent reports (mocked for now)
      // In a real implementation, you would fetch this from Firestore
      const mockReports: Report[] = [
        {
          id: "report1",
          title: "Inappropriate content in resource",
          type: "resource",
          reason: "This resource contains inappropriate content for all ages",
          reportedId: "resource1",
          reportedBy: "user123",
          status: "pending",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        },
        {
          id: "report2",
          title: "Copyright violation",
          type: "resource",
          reason: "This resource violates copyright of my original work",
          reportedId: "resource2",
          reportedBy: "user456",
          status: "pending",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        },
      ]

      setRecentReports(mockReports)
    } catch (error) {
      console.error("Error loading reports:", error)
    }
  }

  const loadAnalyticsData = async () => {
    // This would typically come from Firestore or an analytics service
    // For now we'll mock some data

    // Generate mock revenue data for the last 7 days
    const revenueByDay = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      revenueByDay.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        revenue: Math.floor(Math.random() * 500) + 100,
      })
    }

    setAnalyticsData({
      revenueByDay,
      downloadsThisWeek: Math.floor(Math.random() * 500) + 100,
      resourcesThisWeek: Math.floor(Math.random() * 20) + 5,
      topCategories: [
        { category: "Photography", count: 25 },
        { category: "Educational", count: 18 },
        { category: "Design", count: 15 },
        { category: "Software", count: 12 },
      ],
    })
  }

  const handleApproveResource = async (resourceId: string) => {
    try {
      await approveResource(resourceId)

      toast({
        title: "Resource Approved",
        description: "The resource has been approved and is now live.",
      })

      // Reload resources after approval
      loadPendingResources()
      loadStats()
    } catch (error) {
      console.error("Error approving resource:", error)
      toast({
        title: "Error",
        description: "Failed to approve the resource. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRejectResource = async (resourceId: string) => {
    try {
      await rejectResource(resourceId)

      toast({
        title: "Resource Rejected",
        description: "The resource has been rejected.",
      })

      // Reload resources after rejection
      loadPendingResources()
      loadStats()
    } catch (error) {
      console.error("Error rejecting resource:", error)
      toast({
        title: "Error",
        description: "Failed to reject the resource. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleApproveCreator = async (creatorId: string) => {
    try {
      await updateDoc(doc(db, "users", creatorId), {
        approvalStatus: "approved",
        updatedAt: new Date(),
      })

      toast({
        title: "Creator Approved",
        description: "The creator application has been approved.",
      })

      // Reload applications after approval
      loadCreatorApplications()
    } catch (error) {
      console.error("Error approving creator:", error)
      toast({
        title: "Error",
        description: "Failed to approve the creator. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRejectCreator = async (creatorId: string) => {
    try {
      await updateDoc(doc(db, "users", creatorId), {
        approvalStatus: "rejected",
        updatedAt: new Date(),
      })

      toast({
        title: "Creator Rejected",
        description: "The creator application has been rejected.",
      })

      // Reload applications after rejection
      loadCreatorApplications()
    } catch (error) {
      console.error("Error rejecting creator:", error)
      toast({
        title: "Error",
        description: "Failed to reject the creator. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleResolveReport = async (reportId: string) => {
    // In a real implementation, this would update Firestore
    toast({
      title: "Report Resolved",
      description: "The report has been marked as resolved.",
    })

    // Update local state for now
    setRecentReports((prevReports) =>
      prevReports.map((report) => (report.id === reportId ? { ...report, status: "resolved" } : report)),
    )
  }

  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <AdminSidebar />
        <div className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <div className="flex flex-1 items-center gap-4">
              <Link href="/" className="lg:hidden">
                <ShieldCheck className="h-6 w-6" />
                <span className="sr-only">ResourceHub Admin</span>
              </Link>
              <h1 className="text-lg font-semibold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Bell className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline-block">Notifications</span>
                    {(pendingResources.length > 0 || creatorApplications.length > 0) && (
                      <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                        {pendingResources.length + creatorApplications.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-auto">
                    {pendingResources.length > 0 && (
                      <div className="flex items-start gap-4 p-3 hover:bg-muted/50 rounded-md">
                        <div className="flex-shrink-0">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src="/placeholder-user.jpg" alt="User" />
                            <AvatarFallback>R</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{pendingResources.length} resources pending approval</p>
                          <p className="text-xs text-muted-foreground">Resources are waiting for your review</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {pendingResources[0]?.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                    {creatorApplications.length > 0 && (
                      <div className="flex items-start gap-4 p-3 hover:bg-muted/50 rounded-md">
                        <div className="flex-shrink-0">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src="/placeholder-user.jpg" alt="User" />
                            <AvatarFallback>C</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{creatorApplications.length} creator applications</p>
                          <p className="text-xs text-muted-foreground">Creators waiting for approval</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {creatorApplications[0]?.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                    {recentReports.length > 0 && (
                      <div className="flex items-start gap-4 p-3 hover:bg-muted/50 rounded-md">
                        <div className="flex-shrink-0">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src="/placeholder-user.jpg" alt="User" />
                            <AvatarFallback>F</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{recentReports.length} unresolved reports</p>
                          <p className="text-xs text-muted-foreground">Recent reports need attention</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {recentReports[0]?.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                    {pendingResources.length === 0 &&
                      creatorApplications.length === 0 &&
                      recentReports.length === 0 && (
                        <div className="p-3 text-center text-sm text-muted-foreground">No new notifications</div>
                      )}
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
                      <AvatarImage src={user?.avatar || "/placeholder-user.jpg"} alt={user?.name || "Admin"} />
                      <AvatarFallback>{user?.name?.charAt(0) || "A"}</AvatarFallback>
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
                  <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Admin Settings
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
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
                  <Package className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalResources}</div>
                  <p className="text-xs text-muted-foreground">+{analyticsData.resourcesThisWeek} this week</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">Including {stats.totalCreators} creators</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
                  <Download className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalDownloads}</div>
                  <p className="text-xs text-muted-foreground">+{analyticsData.downloadsThisWeek} this week</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.platformRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    +${analyticsData.revenueByDay.reduce((sum, day) => sum + day.revenue, 0).toFixed(2)} this week
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Resources Pending Approval</CardTitle>
                  <CardDescription>Review and approve resources uploaded by creators.</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center p-8">
                      <p>Loading pending resources...</p>
                    </div>
                  ) : pendingResources.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Resource</TableHead>
                          <TableHead>Creator</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingResources.slice(0, 3).map((resource) => (
                          <TableRow key={resource.id}>
                            <TableCell className="font-medium">{resource.title}</TableCell>
                            <TableCell>{resource.creatorName}</TableCell>
                            <TableCell>{resource.category}</TableCell>
                            <TableCell>{resource.createdAt.toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 gap-1"
                                  onClick={() => handleApproveResource(resource.id)}
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  <span>Approve</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 gap-1"
                                  onClick={() => handleRejectResource(resource.id)}
                                >
                                  <X className="h-3.5 w-3.5" />
                                  <span>Reject</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex justify-center items-center p-8">
                      <p className="text-muted-foreground">No pending resources to approve.</p>
                    </div>
                  )}
                  <div className="mt-4 flex justify-center">
                    <Button variant="outline" size="sm" onClick={() => router.push("/admin/resources")}>
                      View All Resources
                      <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Creator Applications</CardTitle>
                  <CardDescription>New creator accounts awaiting approval.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {creatorApplications.slice(0, 4).map((creator) => (
                      <div key={creator.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="/placeholder-user.jpg" alt={`@${creator.name}`} />
                            <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{creator.name}</div>
                            <div className="text-sm text-muted-foreground">{creator.category}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleApproveCreator(creator.id)}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span className="sr-only">Approve</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleRejectCreator(creator.id)}
                          >
                            <X className="h-3.5 w-3.5" />
                            <span className="sr-only">Reject</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                    {creatorApplications.length === 0 && (
                      <div className="flex justify-center items-center p-4">
                        <p className="text-muted-foreground">No pending creator applications.</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Button variant="outline" size="sm" onClick={() => router.push("/admin/creators")}>
                      View All Creators
                      <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Revenue Over Time</CardTitle>
                  <CardDescription>Weekly revenue from resource sales</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] relative">
                    {/* Bar chart visualization */}
                    <div className="absolute inset-0 flex items-end">
                      {analyticsData.revenueByDay.map((day, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center justify-end h-full p-1">
                          <div
                            className="w-full bg-primary/80 rounded-t-sm"
                            style={{ height: `${(day.revenue / 500) * 100}%` }}
                          ></div>
                          <div className="mt-2 text-xs">{day.date}</div>
                        </div>
                      ))}
                    </div>
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-muted-foreground">
                      <div>$500</div>
                      <div>$375</div>
                      <div>$250</div>
                      <div>$125</div>
                      <div>$0</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" onClick={() => router.push("/admin/analytics")}>
                    View Detailed Analytics
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Top Categories</CardTitle>
                  <CardDescription>Most popular resource categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.topCategories.map((category, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-full flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{category.category}</span>
                            <span className="text-sm text-muted-foreground">{category.count} resources</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${(category.count / analyticsData.topCategories[0].count) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" onClick={() => router.push("/admin/categories")}>
                    Manage Categories
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                  <CardDescription>Latest user and content reports</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentReports.length > 0 ? (
                    <div className="space-y-4">
                      {recentReports.map((report) => (
                        <div key={report.id} className="rounded-lg border p-4">
                          <div className="flex justify-between">
                            <div className="font-medium">{report.title}</div>
                            <Badge variant={report.status === "pending" ? "outline" : "secondary"}>
                              {report.status}
                            </Badge>
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">{report.reason}</div>
                          <div className="mt-3 flex justify-between items-center">
                            <div className="text-xs text-muted-foreground">
                              Reported {report.createdAt.toLocaleDateString()}
                            </div>
                            {report.status === "pending" && (
                              <Button variant="outline" size="sm" onClick={() => handleResolveReport(report.id)}>
                                Resolve
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-center items-center p-8">
                      <p className="text-muted-foreground">No recent reports</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" onClick={() => router.push("/admin/reports")}>
                    View All Reports
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common admin tasks</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => router.push("/admin/resources/create")}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Add New Resource
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => router.push("/admin/categories/create")}
                  >
                    <Tag className="mr-2 h-4 w-4" />
                    Create Category
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => router.push("/admin/users/create")}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => router.push("/admin/analytics/export")}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Export Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

