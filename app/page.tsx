import Link from "next/link"
import { ArrowRight, BookOpen, FileImage, FileVideo, Layers, Search, User, LogOut, Bell } from 'lucide-react'
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ResourceCard from "@/components/resource-card"
import CategoryCard from "@/components/category-card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth-provider"

export default function Home() {
  // Client-side component for user authentication
  return (
    <div className="flex flex-col min-h-screen">
      <ClientHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge variant="outline" className="w-fit bg-primary/10 text-primary border-primary/20">
                    New Platform
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    <span className="gradient-text">Discover & Share</span> Digital Resources
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    A marketplace for creators to share their digital resources and for users to discover high-quality
                    content.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/resources">
                    <Button className="w-full gradient-bg">
                      Browse Resources
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/creator/register">
                    <Button variant="outline" className="w-full">
                      Become a Creator
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full h-[350px] bg-gradient-to-br from-purple-600/20 to-blue-500/20 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Layers className="h-24 w-24 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Browse by Category</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explore our wide range of digital resources across various categories.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
              <CategoryCard
                title="Educational"
                description="Resources for learning and teaching"
                icon={BookOpen}
                count={120}
              />
              <CategoryCard
                title="Photography"
                description="High-quality images and photos"
                icon={FileImage}
                count={85}
              />
              <CategoryCard
                title="Graphic Design"
                description="Templates, mockups, and UI kits"
                icon={Layers}
                count={210}
              />
              <CategoryCard title="Video" description="Stock footage and motion graphics" icon={FileVideo} count={64} />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-purple-50 dark:from-background dark:to-purple-950/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Resources</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover our most popular and trending resources.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search resources..."
                    className="w-full bg-background pl-8 rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
              <ResourceCard
                title="Professional Photo Pack"
                description="50 high-resolution photos for commercial use"
                price={29.99}
                category="Photography"
                creator="PhotoPro Studios"
                thumbnail="/placeholder.svg?height=200&width=300"
              />
              <ResourceCard
                title="UI Component Library"
                description="200+ ready-to-use UI components for web design"
                price={49.99}
                category="Graphic Design"
                creator="DesignMaster"
                thumbnail="/placeholder.svg?height=200&width=300"
              />
              <ResourceCard
                title="Educational Worksheets Bundle"
                description="100 printable worksheets for elementary education"
                price={19.99}
                category="Educational"
                creator="TeachSmart"
                thumbnail="/placeholder.svg?height=200&width=300"
              />
              <ResourceCard
                title="Stock Video Collection"
                description="25 HD video clips for your projects"
                price={39.99}
                category="Video"
                creator="VideoArtists"
                thumbnail="/placeholder.svg?height=200&width=300"
              />
            </div>
            <div className="flex justify-center mt-10">
              <Link href="/resources">
                <Button variant="outline">View All Resources</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex items-center justify-center">
                <div className="relative w-full h-[350px] bg-gradient-to-br from-purple-600/20 to-blue-500/20 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Layers className="h-24 w-24 text-primary" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Become a Creator</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Share your digital resources with our community and earn money from your creations.
                  </p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <ArrowRight className="h-3 w-3" />
                    </div>
                    <span>Upload and manage your digital resources</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <ArrowRight className="h-3 w-3" />
                    </div>
                    <span>Set your own prices and earn up to 80% commission</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <ArrowRight className="h-3 w-3" />
                    </div>
                    <span>Connect with customers through our messaging system</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <ArrowRight className="h-3 w-3" />
                    </div>
                    <span>Track downloads, earnings, and analytics</span>
                  </li>
                </ul>
                <div>
                  <Link href="/creator/register">
                    <Button className="gradient-bg">Start Selling Today</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
          <p className="text-sm text-muted-foreground">© 2025 ResourceHub. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
// Client component for header
;("use client")
function ClientHeader() {
  const { user, signOut } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder with the same structure to prevent layout shift
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ResourceHub</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span className="text-sm font-medium">Home</span>
            <span className="text-sm font-medium">Resources</span>
            <span className="text-sm font-medium">Pricing</span>
            <span className="text-sm font-medium">About</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-8"></div>
            <div className="w-16 h-8"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ResourceHub</span>
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium">
            Home
          </Link>
          <Link href="/resources" className="text-sm font-medium">
            Resources
          </Link>
          <Link href="/pricing" className="text-sm font-medium">
            Pricing
          </Link>
          <Link href="/about" className="text-sm font-medium">
            About
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
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
                        <p className="text-sm font-medium">New resources available</p>
                        <p className="text-xs text-muted-foreground">Check out the latest uploads</p>
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
                      <AvatarImage src={user?.avatarUrl || "/placeholder-user.jpg"} alt={user?.name || "User"} />
                      <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.location.href = "/profile"}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  {user?.role === "creator" && (
                    <DropdownMenuItem onClick={() => window.location.href = "/creator/dashboard"}>
                      <Layers className="mr-2 h-4 w-4" />
                      Creator Dashboard
                    </DropdownMenuItem>
                  )}
                  {user?.role === "admin" && (
                    <DropdownMenuItem onClick={() => window.location.href = "/admin/dashboard"}>
                      <Layers className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

