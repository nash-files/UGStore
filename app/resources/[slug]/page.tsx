import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  Download,
  Eye,
  FileText,
  MessageSquare,
  Package,
  ShoppingCart,
  Star,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export default function ResourcePage({ params }: { params: { slug: string } }) {
  // This would normally fetch data based on the slug
  const resource = {
    title: "Professional Photo Pack",
    description:
      "50 high-resolution photos for commercial use. Perfect for websites, marketing materials, and social media. This collection includes a variety of subjects including nature, business, technology, and lifestyle.",
    price: 29.99,
    category: "Photography",
    creator: "PhotoPro Studios",
    creatorAvatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.svg?height=400&width=600",
    rating: 4.8,
    reviews: 124,
    downloads: 1250,
    dateAdded: "March 1, 2025",
    fileFormat: "JPG, PNG",
    fileSize: "1.2 GB",
    license: "Commercial Use",
    tags: ["photography", "high-resolution", "commercial", "stock photos"],
    preview: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Package className="h-6 w-6" />
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
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/resources">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Resources
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge>{resource.category}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      Added on {resource.dateAdded}
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold">{resource.title}</h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-medium">{resource.rating}</span>
                      <span className="text-muted-foreground">({resource.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Download className="h-4 w-4" />
                      <span>{resource.downloads} downloads</span>
                    </div>
                  </div>
                </div>
                <div className="relative aspect-video overflow-hidden rounded-lg border">
                  <Image
                    src={resource.thumbnail || "/placeholder.svg"}
                    alt={resource.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="sm" className="gap-1">
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                  </div>
                </div>
                <Tabs defaultValue="description">
                  <TabsList>
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  <TabsContent value="description" className="space-y-4">
                    <div className="prose max-w-none">
                      <p>{resource.description}</p>
                      <h3>Features</h3>
                      <ul>
                        <li>50 high-resolution photos (4K resolution)</li>
                        <li>Commercial license included</li>
                        <li>Variety of subjects and themes</li>
                        <li>Professionally edited and color-graded</li>
                        <li>Regular updates with new content</li>
                      </ul>
                      <h3>Usage Rights</h3>
                      <p>
                        This resource includes a commercial license that allows you to use the photos in both personal
                        and commercial projects. You may not resell or redistribute these photos as stock photography.
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="preview">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {resource.preview.map((image, index) => (
                        <div key={index} className="relative aspect-square overflow-hidden rounded-md border">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Button variant="secondary" size="sm">
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-4 bg-muted rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">
                        These are preview images. Purchase to access all 50 high-resolution photos.
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="reviews">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                          <div className="text-3xl font-bold">{resource.rating}</div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(resource.rating) ? "fill-primary text-primary" : "text-muted"}`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">{resource.reviews} reviews</div>
                        </div>
                        <div className="flex-1">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="text-sm">5 stars</div>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-[85%]"></div>
                              </div>
                              <div className="text-sm text-muted-foreground">85%</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm">4 stars</div>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-[10%]"></div>
                              </div>
                              <div className="text-sm text-muted-foreground">10%</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm">3 stars</div>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-[3%]"></div>
                              </div>
                              <div className="text-sm text-muted-foreground">3%</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm">2 stars</div>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-[1%]"></div>
                              </div>
                              <div className="text-sm text-muted-foreground">1%</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm">1 star</div>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-[1%]"></div>
                              </div>
                              <div className="text-sm text-muted-foreground">1%</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage src="/placeholder-user.jpg" alt="@user1" />
                              <AvatarFallback>U1</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">John Smith</div>
                              <div className="text-sm text-muted-foreground">2 weeks ago</div>
                            </div>
                            <div className="ml-auto flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm">
                            These photos are absolutely stunning! The quality is exceptional and they work perfectly for
                            my website. Highly recommended for anyone looking for professional stock photography.
                          </p>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage src="/placeholder-user.jpg" alt="@user2" />
                              <AvatarFallback>U2</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">Sarah Johnson</div>
                              <div className="text-sm text-muted-foreground">1 month ago</div>
                            </div>
                            <div className="ml-auto flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < 4 ? "fill-primary text-primary" : "text-muted"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm">
                            Great collection of photos. I use them for my marketing materials and they look very
                            professional. Would love to see more variety in the business category.
                          </p>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage src="/placeholder-user.jpg" alt="@user3" />
                              <AvatarFallback>U3</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">Michael Chen</div>
                              <div className="text-sm text-muted-foreground">2 months ago</div>
                            </div>
                            <div className="ml-auto flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm">
                            Excellent value for money. The photos are high quality and versatile. I've used them across
                            multiple projects and they always look great.
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-center mt-4">
                        <Button variant="outline">Load More Reviews</Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">${resource.price}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Format:</span>
                        <span>{resource.fileFormat}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Size:</span>
                        <span>{resource.fileSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">License:</span>
                        <span>{resource.license}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>Instant digital download</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>Creator support included</span>
                    </div>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Creator</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={resource.creatorAvatar} alt={resource.creator} />
                        <AvatarFallback>PC</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{resource.creator}</div>
                        <div className="text-sm text-muted-foreground">Premium Creator</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        <span>42 resources</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span>4.9 avg rating</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full gap-2">
                      <User className="h-4 w-4" />
                      View Profile
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Contact Creator
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Similar Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-md overflow-hidden relative">
                        <Image
                          src="/placeholder.svg?height=64&width=64"
                          alt="Similar resource"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Nature Photography Bundle</div>
                        <div className="text-sm text-muted-foreground">$34.99</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-md overflow-hidden relative">
                        <Image
                          src="/placeholder.svg?height=64&width=64"
                          alt="Similar resource"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Urban Photography Collection</div>
                        <div className="text-sm text-muted-foreground">$24.99</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-md overflow-hidden relative">
                        <Image
                          src="/placeholder.svg?height=64&width=64"
                          alt="Similar resource"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Business Stock Photos</div>
                        <div className="text-sm text-muted-foreground">$19.99</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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

