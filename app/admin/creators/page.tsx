"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  X,
  Eye,
  ArrowUpDown,
  ShieldCheck,
  Mail,
  Calendar,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import AdminSidebar from "@/components/admin-sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { doc, collection, getDocs, updateDoc, query, where, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Define the Creator type
type Creator = {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  bio?: string
  category?: string
  approvalStatus?: "pending" | "approved" | "rejected"
  createdAt: Date
  resourceCount?: number
  totalDownloads?: number
  totalRevenue?: number
}

export default function AdminCreatorsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [creators, setCreators] = useState<Creator[]>([])
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([])
  const [isLoadingCreators, setIsLoadingCreators] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [creatorResources, setCreatorResources] = useState<any[]>([])

  useEffect(() => {
    // Redirect if not logged in or not an admin
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login")
      return
    }

    loadCreators()
  }, [user, isLoading, router])

  const loadCreators = async () => {
    setIsLoadingCreators(true)
    try {
      // Get all users with role "creator"
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("role", "==", "creator"))
      const querySnapshot = await getDocs(q)

      const creatorsList: Creator[] = []
      const uniqueCategories = new Set<string>()

      // Process each creator
      for (const docSnapshot of querySnapshot.docs) {
        const data = docSnapshot.data()

        // Add category to unique categories
        if (data.category) {
          uniqueCategories.add(data.category)
        }

        // Get resource count for this creator
        let resourceCount = 0
        let totalDownloads = 0
        let totalRevenue = 0

        try {
          const resourcesRef = collection(db, "resources")
          const resourcesQuery = query(resourcesRef, where("creatorId", "==", docSnapshot.id))
          const resourcesSnapshot = await getDocs(resourcesQuery)

          resourceCount = resourcesSnapshot.size

          resourcesSnapshot.forEach((doc) => {
            const resourceData = doc.data()
            totalDownloads += resourceData.downloads || 0
            totalRevenue += (resourceData.downloads || 0) * (resourceData.price || 0)
          })
        } catch (error) {
          console.error("Error getting creator resources:", error)
        }

        creatorsList.push({
          id: docSnapshot.id,
          name: data.name || "Unknown",
          email: data.email || "",
          role: data.role || "creator",
          avatar: data.avatar || "",
          bio: data.bio || "",
          category: data.category || "Not specified",
          approvalStatus: data.approvalStatus || "pending",
          createdAt: data.createdAt?.toDate() || new Date(),
          resourceCount,
          totalDownloads,
          totalRevenue,
        })
      }

      setCreators(creatorsList)
      setCategories(Array.from(uniqueCategories))

      // Initial filtering
      applyFilters(creatorsList, searchQuery, statusFilter, categoryFilter, sortBy)
    } catch (error) {
      console.error("Error loading creators:", error)
      toast({
        title: "Error",
        description: "Failed to load creators. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingCreators(false)
    }
  }

  const applyFilters = (creators: Creator[], search: string, status: string, category: string, sort: string) => {
    let filtered = [...creators]

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (creator) =>
          creator.name.toLowerCase().includes(searchLower) ||
          creator.email.toLowerCase().includes(searchLower) ||
          (creator.bio && creator.bio.toLowerCase().includes(searchLower)),
      )
    }

    // Apply status filter
    if (status !== "all") {
      filtered = filtered.filter((creator) => creator.approvalStatus === status)
    }

    // Apply category filter
    if (category !== "all") {
      filtered = filtered.filter((creator) => creator.category === category)
    }

    // Apply sorting
    switch (sort) {
      case "newest":
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case "oldest":
        filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        break
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "resources":
        filtered.sort((a, b) => (b.resourceCount || 0) - (a.resourceCount || 0))
        break
      case "downloads":
        filtered.sort((a, b) => (b.totalDownloads || 0) - (a.totalDownloads || 0))
        break
      case "revenue":
        filtered.sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0))
        break
    }

    setFilteredCreators(filtered)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    applyFilters(creators, query, statusFilter, categoryFilter, sortBy)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    applyFilters(creators, searchQuery, value, categoryFilter, sortBy)
  }

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value)
    applyFilters(creators, searchQuery, statusFilter, value, sortBy)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    applyFilters(creators, searchQuery, statusFilter, categoryFilter, value)
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

      // Reload creators after approval
      loadCreators()
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

      // Reload creators after rejection
      loadCreators()
    } catch (error) {
      console.error("Error rejecting creator:", error)
      toast({
        title: "Error",
        description: "Failed to reject the creator. Please try again.",
        variant: "destructive",
      })
    }
  }

  const loadCreatorResources = async (creatorId: string) => {
    try {
      const resourcesRef = collection(db, "resources")
      const q = query(resourcesRef, where("creatorId", "==", creatorId), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)

      const resources: any[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        resources.push({
          id: doc.id,
          title: data.title,
          thumbnail: data.thumbnail,
          status: data.status,
          price: data.price,
          downloads: data.downloads || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
        })
      })

      setCreatorResources(resources)
    } catch (error) {
      console.error("Error loading creator resources:", error)
      setCreatorResources([])
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">Approved</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="text-amber-600 dark:text-amber-400">
            Pending
          </Badge>
        )
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleViewCreatorDetails = async (creator: Creator) => {
    setSelectedCreator(creator)
    await loadCreatorResources(creator.id)
    setShowDetailsDialog(true)
  }

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!user || user.role !== "admin") {
    return null
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
              <h1 className="text-lg font-semibold">Creator Management</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => router.push("/admin/dashboard")}>
                Dashboard
              </Button>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight">Creators</h2>
                <p className="text-muted-foreground">Manage creator accounts and applications</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={() => router.push("/admin/creators/invite")}>
                  <Users className="mr-2 h-4 w-4" />
                  Invite Creator
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all" className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <TabsList>
                  <TabsTrigger value="all" onClick={() => handleStatusFilter("all")}>
                    All Creators
                  </TabsTrigger>
                  <TabsTrigger value="pending" onClick={() => handleStatusFilter("pending")}>
                    Pending
                  </TabsTrigger>
                  <TabsTrigger value="approved" onClick={() => handleStatusFilter("approved")}>
                    Approved
                  </TabsTrigger>
                  <TabsTrigger value="rejected" onClick={() => handleStatusFilter("rejected")}>
                    Rejected
                  </TabsTrigger>
                </TabsList>
                <div className="flex flex-1 items-center gap-2 md:max-w-sm">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search creators..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={categoryFilter} onValueChange={handleCategoryFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    <Select value={sortBy} onValueChange={handleSortChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                        <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                        <SelectItem value="resources">Most Resources</SelectItem>
                        <SelectItem value="downloads">Most Downloads</SelectItem>
                        <SelectItem value="revenue">Highest Revenue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground w-full md:w-auto text-center md:text-right">
                  Showing {filteredCreators.length} of {creators.length} creators
                </div>
              </div>

              <TabsContent value="all" className="space-y-4">
                <Card>
                  <CardContent className="p-0">
                    {isLoadingCreators ? (
                      <div className="flex justify-center items-center p-8">
                        <p>Loading creators...</p>
                      </div>
                    ) : filteredCreators.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Creator</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Resources</TableHead>
                            <TableHead>Downloads</TableHead>
                            <TableHead>Revenue</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredCreators.map((creator) => (
                            <TableRow key={creator.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-9 w-9">
                                    <AvatarImage src={creator.avatar || "/placeholder-user.jpg"} alt={creator.name} />
                                    <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{creator.name}</div>
                                    <div className="text-sm text-muted-foreground">{creator.email}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{creator.category}</TableCell>
                              <TableCell>{creator.resourceCount || 0}</TableCell>
                              <TableCell>{creator.totalDownloads || 0}</TableCell>
                              <TableCell>${(creator.totalRevenue || 0).toFixed(2)}</TableCell>
                              <TableCell>{getStatusBadge(creator.approvalStatus || "pending")}</TableCell>
                              <TableCell>{creator.createdAt.toLocaleDateString()}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon" onClick={() => handleViewCreatorDetails(creator)}>
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">View</span>
                                  </Button>
                                  {creator.approvalStatus === "pending" && (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                        onClick={() => handleApproveCreator(creator.id)}
                                      >
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span className="sr-only">Approve</span>
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleRejectCreator(creator.id)}
                                      >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Reject</span>
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="flex justify-center items-center p-8">
                        <p className="text-muted-foreground">No creators found matching your filters.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="pending" className="space-y-4">
                {/* Content is controlled by the filter state */}
              </TabsContent>
              <TabsContent value="approved" className="space-y-4">
                {/* Content is controlled by the filter state */}
              </TabsContent>
              <TabsContent value="rejected" className="space-y-4">
                {/* Content is controlled by the filter state */}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      {/* Creator Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Creator Details</DialogTitle>
            <DialogDescription>Detailed information about the selected creator</DialogDescription>
          </DialogHeader>
          {selectedCreator && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={selectedCreator.avatar || "/placeholder-user.jpg"} alt={selectedCreator.name} />
                      <AvatarFallback className="text-2xl">{selectedCreator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">{selectedCreator.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{selectedCreator.email}</p>
                    <div className="mb-4">{getStatusBadge(selectedCreator.approvalStatus || "pending")}</div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        <span>Email</span>
                      </Button>
                      {selectedCreator.approvalStatus === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => {
                              handleApproveCreator(selectedCreator.id)
                              setShowDetailsDialog(false)
                            }}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Approve</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => {
                              handleRejectCreator(selectedCreator.id)
                              setShowDetailsDialog(false)
                            }}
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Reject</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Resources</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedCreator.resourceCount || 0}</div>
                        <p className="text-xs text-muted-foreground">Total resources uploaded</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Downloads</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedCreator.totalDownloads || 0}</div>
                        <p className="text-xs text-muted-foreground">Total resource downloads</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">${(selectedCreator.totalRevenue || 0).toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Total revenue generated</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Joined</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          <Calendar className="h-5 w-5 inline-block mr-1" />
                          {selectedCreator.createdAt.toLocaleDateString()}
                        </div>
                        <p className="text-xs text-muted-foreground">Account creation date</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Bio</h4>
                    <p className="text-sm">{selectedCreator.bio || "No bio provided."}</p>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Category</h4>
                    <Badge variant="outline">{selectedCreator.category}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Creator Resources</h4>
                {creatorResources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {creatorResources.slice(0, 6).map((resource) => (
                      <Card key={resource.id} className="overflow-hidden">
                        <div className="h-32 w-full overflow-hidden">
                          <img
                            src={resource.thumbnail || "/placeholder.svg?height=128&width=256"}
                            alt={resource.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium truncate" title={resource.title}>
                              {resource.title}
                            </h5>
                            {getStatusBadge(resource.status)}
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>${resource.price.toFixed(2)}</span>
                            <span>{resource.downloads} downloads</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No resources uploaded yet</p>
                  </div>
                )}
                {creatorResources.length > 6 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" size="sm">
                      View All Resources
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}

