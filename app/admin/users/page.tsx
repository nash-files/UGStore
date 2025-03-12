"use client"

import Link from "next/link"
import {
  ArrowUpDown,
  ShieldCheck,
  User,
  LogOut,
  Bell,
  MoreHorizontal,
  UserPlus,
  Trash,
  Edit,
  ShieldAlert,
} from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Define the User type for this component
type UserData = {
  id: string
  name: string
  email: string
  role: "user" | "creator" | "admin"
  plan?: string
  status: "active" | "suspended" | "pending"
  createdAt: Date
  lastLogin?: Date
}

export default function UsersPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<UserData[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    // Redirect if not logged in or not an admin
    if (user && user.role !== "admin") {
      router.push("/")
      return
    }

    // Load users
    if (user) {
      loadUsers()
    }
  }, [user, router])

  useEffect(() => {
    // Filter users when filters or search term changes
    filterUsers()
  }, [users, searchTerm, roleFilter, statusFilter])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const usersCollection = collection(db, "users")
      const querySnapshot = await getDocs(usersCollection)

      const loadedUsers: UserData[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        loadedUsers.push({
          id: doc.id,
          name: data.name || "Unknown",
          email: data.email || "",
          role: data.role || "user",
          plan: data.plan || "N/A",
          status: data.status || "active",
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLogin: data.lastLogin?.toDate(),
        })
      })

      setUsers(loadedUsers)
      setFilteredUsers(loadedUsers)
    } catch (error) {
      console.error("Error loading users:", error)
      toast({
        title: "Error",
        description: "Failed to load users. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = [...users]

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => u.role === roleFilter)
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((u) => u.status === statusFilter)
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter((u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term))
    }

    setFilteredUsers(filtered)
  }

  const handleChangeRole = async (userId: string, newRole: "user" | "creator" | "admin") => {
    try {
      await updateDoc(doc(db, "users", userId), {
        role: newRole,
        updatedAt: new Date(),
      })

      toast({
        title: "Role Updated",
        description: `User role has been updated to ${newRole}.`,
      })

      // Update local state
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
    } catch (error) {
      console.error("Error updating user role:", error)
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleChangeStatus = async (userId: string, newStatus: "active" | "suspended" | "pending") => {
    try {
      await updateDoc(doc(db, "users", userId), {
        status: newStatus,
        updatedAt: new Date(),
      })

      toast({
        title: "Status Updated",
        description: `User status has been updated to ${newStatus}.`,
      })

      // Update local state
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)))
    } catch (error) {
      console.error("Error updating user status:", error)
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }

    try {
      await deleteDoc(doc(db, "users", userId))

      toast({
        title: "User Deleted",
        description: "The user has been permanently deleted.",
      })

      // Update local state
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
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
              <h1 className="text-lg font-semibold">User Management</h1>
            </div>
            <div className="flex items-center gap-4">
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
                        <p className="text-sm font-medium">New user registered</p>
                        <p className="text-xs text-muted-foreground">John Doe has joined the platform</p>
                        <p className="text-xs text-muted-foreground mt-1">10 minutes ago</p>
                      </div>
                    </div>
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
                <h2 className="text-2xl font-bold tracking-tight">Users</h2>
                <p className="text-muted-foreground">Manage your platform users, creators, and admins.</p>
              </div>
              <Button onClick={() => router.push("/admin/users/add")}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>View and manage all users on the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                    <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>

                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="creator">Creator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">
                          <div className="flex items-center gap-1">
                            User
                            <Button variant="ghost" size="sm" className="p-0 h-4 w-4">
                              <ArrowUpDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            Loading users...
                          </TableCell>
                        </TableRow>
                      ) : filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No users found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                  <AvatarImage src="/placeholder-user.jpg" alt={user.name} />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-sm text-muted-foreground">{user.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  user.role === "admin"
                                    ? "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800"
                                    : user.role === "creator"
                                      ? "bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800"
                                      : "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                                }
                              >
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              </Badge>
                              {user.role === "creator" && user.plan && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  user.status === "active"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                                    : user.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800"
                                      : "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800"
                                }
                              >
                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                            <TableCell>{user.lastLogin ? user.lastLogin.toLocaleDateString() : "Never"}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}`)}>
                                    <User className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}/edit`)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit User
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleChangeRole(user.id, "user")}>
                                    Make User
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleChangeRole(user.id, "creator")}>
                                    Make Creator
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleChangeRole(user.id, "admin")}>
                                    <ShieldAlert className="mr-2 h-4 w-4" />
                                    Make Admin
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleChangeStatus(user.id, "active")}>
                                    Activate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleChangeStatus(user.id, "suspended")}>
                                    Suspend
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="text-red-600 hover:text-red-700 focus:text-red-700"
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete User
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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
    </SidebarProvider>
  )
}

