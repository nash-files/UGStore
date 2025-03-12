"use client"

import type React from "react"

import { Filter, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ResourceCard from "@/components/resource-card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth-provider"
import { getResources, type Resource } from "@/lib/resource-service"
import { useToast } from "@/hooks/use-toast"
// Import the analytics utility
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

// Define the same constant as in resource-service.ts
const RESOURCES_PER_PAGE = 12

export default function ResourcesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastVisible, setLastVisible] = useState<any>(null)
  const [hasMore, setHasMore] = useState(true)
  const [showBuyOptions, setShowBuyOptions] = useState(false)

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    // Enable buy options for logged-in users
    if (user) {
      setShowBuyOptions(true)
    }

    // Load initial resources
    loadResources()
  }, [user])

  const loadResources = async (loadMore = false) => {
    setIsLoading(true)
    try {
      const result = await getResources(
        loadMore ? lastVisible : null,
        selectedCategory || undefined,
        priceRange || undefined,
        searchTerm || undefined,
        sortBy,
      )

      if (loadMore) {
        setResources((prev) => [...prev, ...(result.resources || [])])
      } else {
        setResources(result.resources || [])
      }

      setLastVisible(result.lastVisible)
      setHasMore(result.resources?.length === RESOURCES_PER_PAGE) // Use the same constant
    } catch (error) {
      console.error("Error loading resources:", error)
      toast({
        title: "Error",
        description: "Failed to load resources. Please try again later.",
        variant: "destructive",
      })
      // Set empty resources on error
      if (!loadMore) {
        setResources([])
      }
      setHasMore(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Add analytics tracking to handleSearch function
    // Inside the handleSearch function, before calling loadResources():
    if (searchTerm) {
      trackEvent(AnalyticsEvents.SEARCH_RESOURCES, {
        search_term: searchTerm,
      })
    }
    loadResources()
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category)
  }

  const handlePriceRangeChange = (min?: number, max?: number) => {
    if (min === undefined && max === undefined) {
      setPriceRange(null)
    } else {
      setPriceRange({ min, max })
    }
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    loadResources()
  }

  const handleLoadMore = () => {
    loadResources(true)
  }

  const applyFilters = () => {
    // Add analytics tracking to applyFilters function
    // Inside the applyFilters function, before calling loadResources():
    trackEvent(AnalyticsEvents.FILTER_RESOURCES, {
      category: selectedCategory,
      price_range: priceRange,
      sort_by: sortBy,
    })
    loadResources()
  }

  const resetFilters = () => {
    setSelectedCategory(null)
    setPriceRange(null)
    setSearchTerm("")
    setSortBy("newest")
    loadResources()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
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
                {user.role === "creator" ? (
                  <Link href="/creator/dashboard">
                    <Button variant="outline" size="sm">
                      Creator Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/profile">
                    <Button variant="outline" size="sm">
                      My Profile
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={() => router.push("/profile")}>
                  {user.name}
                </Button>
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
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">Resources</h1>
              <p className="text-muted-foreground">
                Browse and discover high-quality digital resources from our creators.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-full md:w-64 bg-card rounded-lg border p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  <Button variant="ghost" size="sm" className="h-8 px-2" onClick={resetFilters}>
                    Reset
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Categories</h4>
                    <div className="space-y-2">
                      {["Educational", "Photography", "Graphic Design", "Video", "Audio"].map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={category.toLowerCase().replace(" ", "-")}
                            checked={selectedCategory === category}
                            onCheckedChange={() => handleCategoryChange(category)}
                          />
                          <label
                            htmlFor={category.toLowerCase().replace(" ", "-")}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium mb-2">Price Range</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="free"
                          checked={priceRange?.max === 0}
                          onCheckedChange={(checked) =>
                            handlePriceRangeChange(checked ? 0 : undefined, checked ? 0 : undefined)
                          }
                        />
                        <label
                          htmlFor="free"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Free
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="paid"
                          checked={priceRange?.min === 0.01}
                          onCheckedChange={(checked) => handlePriceRangeChange(checked ? 0.01 : undefined, undefined)}
                        />
                        <label
                          htmlFor="paid"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Paid
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="under-10"
                          checked={priceRange?.min === 0.01 && priceRange?.max === 10}
                          onCheckedChange={(checked) =>
                            handlePriceRangeChange(checked ? 0.01 : undefined, checked ? 10 : undefined)
                          }
                        />
                        <label
                          htmlFor="under-10"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Under $10
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="10-50"
                          checked={priceRange?.min === 10 && priceRange?.max === 50}
                          onCheckedChange={(checked) =>
                            handlePriceRangeChange(checked ? 10 : undefined, checked ? 50 : undefined)
                          }
                        />
                        <label
                          htmlFor="10-50"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          $10 - $50
                        </label>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <Button className="w-full" onClick={applyFilters}>
                    Apply Filters
                  </Button>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search resources..."
                        className="w-full sm:w-[300px] pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </form>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button variant="outline" size="sm" className="h-9 lg:hidden">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                      <Select value={sortBy} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-full sm:w-[180px] h-9">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest</SelectItem>
                          <SelectItem value="popular">Most Popular</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {isLoading && resources.length === 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="h-[300px] rounded-md bg-muted animate-pulse" />
                      ))}
                    </div>
                  ) : resources.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resources.map((resource) => (
                          <ResourceCard
                            key={resource.id}
                            title={resource.title}
                            description={resource.description}
                            price={resource.price}
                            category={resource.category}
                            creator={resource.creatorName}
                            thumbnail={resource.thumbnail}
                            showBuyOptions={showBuyOptions}
                            views={resource.views}
                            downloads={resource.downloads}
                          />
                        ))}
                      </div>

                      {hasMore && (
                        <div className="flex justify-center mt-6">
                          <Button variant="outline" onClick={handleLoadMore} disabled={isLoading}>
                            {isLoading ? "Loading..." : "Load More"}
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No resources found matching your criteria.</p>
                      <Button variant="outline" className="mt-4" onClick={resetFilters}>
                        Reset Filters
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
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

