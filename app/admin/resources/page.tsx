"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package, Search, Filter, CheckCircle2, X, Eye, Download, Trash2, ArrowUpDown, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import AdminSidebar from "@/components/admin-sidebar"
import { getResources, approveResource, rejectResource, type Resource } from "@/lib/resource-service"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function AdminResourcesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [resources, setResources] = useState<Resource[]>([])
  const [filteredResources, setFilteredResources] = useState<Resource[]>([])
  const [isLoadingResources, setIsLoadingResources] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [categories, setCategories] = useState<string[]>([])
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  useEffect(() => {
    // Redirect if not logged in or not an admin
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login")
      return
    }

    loadResources()
  }, [user, isLoading, router])

  const loadResources = async () => {
    setIsLoadingResources(true)
    try {
      const result = await getResources()
      setResources(result.resources || [])

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(result.resources.map((resource) => resource.category || "Other")))
      setCategories(uniqueCategories)

      // Initial filtering
      applyFilters(result.resources || [], searchQuery, statusFilter, categoryFilter, sortBy)
    } catch (error) {
      console.error("Error loading resources:", error)
      setResources([])
      toast({
        title: "Error",
        description: "Failed to load resources. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingResources(false)
    }
  }

  const applyFilters = (resources: Resource[], search: string, status: string, category: string, sort: string) => {
    let filtered = [...resources]

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(searchLower) ||
          resource.description.toLowerCase().includes(searchLower) ||
          resource.creatorName.toLowerCase().includes(searchLower),
      )
    }

    // Apply status filter
    if (status !== "all") {
      filtered = filtered.filter((resource) => resource.status === status)
    }

    // Apply category filter
    if (category !== "all") {
      filtered = filtered.filter((resource) => resource.category === category)
    }

    // Apply sorting
    switch (sort) {
      case "newest":
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case "oldest":
        filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        break
      case "title-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "title-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title))
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "downloads":
        filtered.sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
        break
    }

    setFilteredResources(filtered)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    applyFilters(resources, query, statusFilter, categoryFilter, sortBy)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    applyFilters(resources, searchQuery, value, categoryFilter, sortBy)
  }

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value)
    applyFilters(resources, searchQuery, statusFilter, value, sortBy)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    applyFilters(resources, searchQuery, statusFilter, categoryFilter, value)
  }

  const handleApproveResource = async (resourceId: string) => {
    try {
      await approveResource(resourceId)

      toast({
        title: "Resource Approved",
        description: "The resource has been approved and is now live.",
      })

      // Reload resources after approval
      loadResources()
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
      loadResources()
    } catch (error) {
      console.error("Error rejecting resource:", error)
      toast({
        title: "Error",
        description: "Failed to reject the resource. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteResource = async () => {
    if (!selectedResource) return

    try {
      // In a real app, you would call a function to delete the resource
      // For now, we'll just show a success message
      toast({
        title: "Resource Deleted",
        description: `"${selectedResource.title}" has been deleted.`,
      })

      // Close dialog and reload resources
      setShowDeleteDialog(false)
      loadResources()
    } catch (error) {
      console.error("Error deleting resource:", error)
      toast({
        title: "Error",
        description: "Failed to delete the resource. Please try again.",
        variant: "destructive",
      })
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
              <h1 className="text-lg font-semibold">Resource Management</h1>
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
                <h2 className="text-2xl font-bold tracking-tight">Resources</h2>
                <p className="text-muted-foreground">Manage all resources uploaded to the platform</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={() => router.push("/admin/resources/create")}>
                  <Package className="mr-2 h-4 w-4" />
                  Add Resource
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all" className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <TabsList>
                  <TabsTrigger value="all" onClick={() => handleStatusFilter("all")}>
                    All Resources
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
                    placeholder="Search resources..."
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
                        <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                        <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                        <SelectItem value="price-high">Price (High to Low)</SelectItem>
                        <SelectItem value="price-low">Price (Low to High)</SelectItem>
                        <SelectItem value="downloads">Most Downloads</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground w-full md:w-auto text-center md:text-right">
                  Showing {filteredResources.length} of {resources.length} resources
                </div>
              </div>

              <TabsContent value="all" className="space-y-4">
                <Card>
                  <CardContent className="p-0">
                    {isLoadingResources ? (
                      <div className="flex justify-center items-center p-8">
                        <p>Loading resources...</p>
                      </div>
                    ) : filteredResources.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Resource</TableHead>
                            <TableHead>Creator</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredResources.map((resource) => (
                            <TableRow key={resource.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="h-12 w-12 rounded-md overflow-hidden">
                                    <img
                                      src={resource.thumbnail || "/placeholder.svg?height=48&width=48"}
                                      alt={resource.title}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div className="font-medium max-w-[200px] truncate" title={resource.title}>
                                    {resource.title}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src="/placeholder-user.jpg" alt={resource.creatorName} />
                                    <AvatarFallback>{resource.creatorName.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span>{resource.creatorName}</span>
                                </div>
                              </TableCell>
                              <TableCell>{resource.category}</TableCell>
                              <TableCell>{resource.price > 0 ? `$${resource.price.toFixed(2)}` : "Free"}</TableCell>
                              <TableCell>{getStatusBadge(resource.status)}</TableCell>
                              <TableCell>{resource.createdAt.toLocaleDateString()}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setSelectedResource(resource)
                                      setShowDetailsDialog(true)
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">View</span>
                                  </Button>
                                  {(resource.status === "pending" || !resource.status) && (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                        onClick={() => handleApproveResource(resource.id)}
                                      >
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span className="sr-only">Approve</span>
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleRejectResource(resource.id)}
                                      >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Reject</span>
                                      </Button>
                                    </>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => {
                                      setSelectedResource(resource)
                                      setShowDeleteDialog(true)
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="flex justify-center items-center p-8">
                        <p className="text-muted-foreground">No resources found matching your filters.</p>
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

      {/* Resource Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Resource Details</DialogTitle>
            <DialogDescription>Detailed information about the selected resource</DialogDescription>
          </DialogHeader>
          {selectedResource && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedResource.thumbnail || "/placeholder.svg?height=300&width=400"}
                    alt={selectedResource.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedResource.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Uploaded by {selectedResource.creatorName} on {selectedResource.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{selectedResource.category}</Badge>
                    {selectedResource.tags?.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm font-medium">Price</p>
                      <p className="text-lg">
                        {selectedResource.price > 0 ? `$${selectedResource.price.toFixed(2)}` : "Free"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Downloads</p>
                      <p className="text-lg">{selectedResource.downloads || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <div>{getStatusBadge(selectedResource.status)}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Description</h4>
                <p className="text-sm">{selectedResource.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">File Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">File Name</p>
                    <p className="text-sm">{selectedResource.fileName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">File Type</p>
                    <p className="text-sm">{selectedResource.fileType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">File Size</p>
                    <p className="text-sm">
                      {selectedResource.fileSize
                        ? `${(selectedResource.fileSize / 1024 / 1024).toFixed(2)} MB`
                        : "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              {selectedResource?.status === "pending" && (
                <>
                  <Button
                    variant="outline"
                    className="text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => {
                      handleApproveResource(selectedResource.id)
                      setShowDetailsDialog(false)
                    }}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      handleRejectResource(selectedResource.id)
                      setShowDetailsDialog(false)
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                Close
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  // In a real app, this would download the resource
                  toast({
                    title: "Download Started",
                    description: "The resource download has started.",
                  })
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resource</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this resource? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedResource && (
            <div className="py-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-md overflow-hidden">
                  <img
                    src={selectedResource.thumbnail || "/placeholder.svg?height=48&width=48"}
                    alt={selectedResource.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{selectedResource.title}</p>
                  <p className="text-sm text-muted-foreground">Uploaded by {selectedResource.creatorName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="confirm-delete" />
                <Label htmlFor="confirm-delete">I understand this will permanently delete the resource</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteResource}>
              Delete Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}

