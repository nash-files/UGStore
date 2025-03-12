"use client"

import type React from "react"

import Link from "next/link"
import { ArrowUpDown, ShieldCheck, User, LogOut, Search, Plus, Edit, Trash, Tag } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AdminSidebar from "@/components/admin-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Define Category type
type Category = {
  id: string
  name: string
  description: string
  icon: string
  count: number
  featured?: boolean
  createdAt: Date
  updatedAt?: Date
}

export default function AdminCategoriesPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "tag",
    featured: false,
  })
  const [sortOrder, setSortOrder] = useState<{ field: string; direction: "asc" | "desc" }>({
    field: "name",
    direction: "asc",
  })

  // Available icons for categories
  const availableIcons = ["tag", "image", "file-text", "folder", "book", "music", "video", "code", "bookmark"]

  useEffect(() => {
    // Redirect if not logged in or not an admin
    if (user && user.role !== "admin") {
      router.push("/")
      return
    }

    // Load categories
    if (user) {
      loadCategories()
    }
  }, [user, router])

  useEffect(() => {
    // Apply filters when categories or search term changes
    filterCategories()
  }, [categories, searchTerm, sortOrder])

  const loadCategories = async () => {
    setIsLoading(true)
    try {
      const categoriesRef = collection(db, "categories")
      const querySnapshot = await getDocs(categoriesRef)

      const loadedCategories: Category[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        loadedCategories.push({
          id: doc.id,
          name: data.name || "",
          description: data.description || "",
          icon: data.icon || "tag",
          count: data.count || 0,
          featured: data.featured || false,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate(),
        })
      })

      setCategories(loadedCategories)
    } catch (error) {
      console.error("Error loading categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterCategories = () => {
    let filtered = [...categories]

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (category) => category.name.toLowerCase().includes(term) || category.description.toLowerCase().includes(term),
      )
    }

    // Sort categories
    filtered.sort((a, b) => {
      if (sortOrder.field === "name") {
        return sortOrder.direction === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortOrder.field === "count") {
        return sortOrder.direction === "asc" ? a.count - b.count : b.count - a.count
      } else if (sortOrder.field === "createdAt") {
        return sortOrder.direction === "asc"
          ? a.createdAt.getTime() - b.createdAt.getTime()
          : b.createdAt.getTime() - a.createdAt.getTime()
      }
      return 0
    })

    setFilteredCategories(filtered)
  }

  const handleToggleSort = (field: string) => {
    setSortOrder((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
      featured: category.featured || false,
    })
    setShowEditDialog(true)
  }

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category)
    setShowDeleteDialog(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveCategory = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required.",
        variant: "destructive",
      })
      return
    }

    try {
      if (selectedCategory) {
        // Update existing category
        await updateDoc(doc(db, "categories", selectedCategory.id), {
          name: formData.name,
          description: formData.description,
          icon: formData.icon,
          featured: formData.featured,
          updatedAt: new Date(),
        })

        toast({
          title: "Category Updated",
          description: "The category has been updated successfully.",
        })

        // Update local state
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === selectedCategory.id
              ? {
                  ...cat,
                  name: formData.name,
                  description: formData.description,
                  icon: formData.icon,
                  featured: formData.featured,
                  updatedAt: new Date(),
                }
              : cat,
          ),
        )
      } else {
        // Create new category
        const newCategoryRef = doc(collection(db, "categories"))
        const newCategory: Category = {
          id: newCategoryRef.id,
          name: formData.name,
          description: formData.description,
          icon: formData.icon,
          count: 0,
          featured: formData.featured,
          createdAt: new Date(),
        }

        await setDoc(newCategoryRef, newCategory)

        toast({
          title: "Category Created",
          description: "The new category has been created successfully.",
        })

        // Update local state
        setCategories((prev) => [...prev, newCategory])
      }

      // Reset form and close dialog
      setFormData({
        name: "",
        description: "",
        icon: "tag",
        featured: false,
      })
      setSelectedCategory(null)
      setShowEditDialog(false)
    } catch (error) {
      console.error("Error saving category:", error)
      toast({
        title: "Error",
        description: "Failed to save the category. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return

    try {
      await deleteDoc(doc(db, "categories", selectedCategory.id))

      toast({
        title: "Category Deleted",
        description: "The category has been permanently deleted.",
      })

      // Update local state
      setCategories((prev) => prev.filter((cat) => cat.id !== selectedCategory.id))

      setShowDeleteDialog(false)
      setSelectedCategory(null)
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "Failed to delete the category. Please try again.",
        variant: "destructive",
      })
    }
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
              <h1 className="text-lg font-semibold">Categories Management</h1>
            </div>
            <div className="flex items-center gap-4">
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
                  <DropdownMenuItem onClick={() => router.push("/admin/dashboard")}>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Admin Dashboard
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
                <p className="text-muted-foreground">Manage resource categories for the platform.</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setSelectedCategory(null)
                      setFormData({
                        name: "",
                        description: "",
                        icon: "tag",
                        featured: false,
                      })
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Category</DialogTitle>
                    <DialogDescription>Add a new category for resources on the platform.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Category Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Photography"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe this category..."
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Icon</Label>
                      <div className="flex flex-wrap gap-2">
                        {availableIcons.map((icon) => (
                          <Button
                            key={icon}
                            type="button"
                            variant={formData.icon === icon ? "default" : "outline"}
                            size="sm"
                            className="h-10 w-10 p-0"
                            onClick={() => setFormData((prev) => ({ ...prev, icon }))}
                          >
                            <Tag className="h-5 w-5" />
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: !!checked }))}
                      />
                      <label
                        htmlFor="featured"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Featured Category
                      </label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleSaveCategory}>
                      Create Category
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Categories</CardTitle>
                <CardDescription>
                  {filteredCategories.length} {filteredCategories.length === 1 ? "category" : "categories"} available.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search categories..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <div
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => handleToggleSort("name")}
                          >
                            Category Name
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>
                          <div
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => handleToggleSort("count")}
                          >
                            Resources
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => handleToggleSort("createdAt")}
                          >
                            Created
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            Loading categories...
                          </TableCell>
                        </TableRow>
                      ) : filteredCategories.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No categories found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCategories.map((category) => (
                          <TableRow key={category.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4" />
                                <span>{category.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                            <TableCell>{category.count}</TableCell>
                            <TableCell>{category.createdAt.toLocaleDateString()}</TableCell>
                            <TableCell>{category.featured ? "Yes" : "No"}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditClick(category)}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(category)}>
                                  <Trash className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the details of this category.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Category Name</Label>
              <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>Icon</Label>
              <div className="flex flex-wrap gap-2">
                {availableIcons.map((icon) => (
                  <Button
                    key={icon}
                    type="button"
                    variant={formData.icon === icon ? "default" : "outline"}
                    size="sm"
                    className="h-10 w-10 p-0"
                    onClick={() => setFormData((prev) => ({ ...prev, icon }))}
                  >
                    <Tag className="h-5 w-5" />
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: !!checked }))}
              />
              <label htmlFor="edit-featured" className="text-sm font-medium leading-none">
                Featured Category
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSaveCategory}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the "{selectedCategory?.name}" category. This action cannot be undone.
              {selectedCategory && selectedCategory.count > 0 && (
                <p className="mt-2 text-red-500 font-semibold">
                  Warning: This category contains {selectedCategory.count} resources that will be affected.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  )
}

