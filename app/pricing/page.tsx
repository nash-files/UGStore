import Link from "next/link"
import { Check, Package, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PricingPage() {
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
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2 max-w-[800px]">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Choose the Perfect Plan for Your Needs
                </h1>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Whether you're just starting out or an established creator, we have a plan that fits your needs.
                </p>
              </div>
            </div>
            <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center space-y-4">
              <Tabs defaultValue="creator" className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                  <TabsTrigger value="creator">Creator Plans</TabsTrigger>
                  <TabsTrigger value="customer">Customer Plans</TabsTrigger>
                </TabsList>
                <TabsContent value="creator" className="mt-8">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                    <Card className="flex flex-col">
                      <CardHeader className="flex flex-col space-y-1.5 pb-4">
                        <CardTitle className="text-xl">Free</CardTitle>
                        <CardDescription>For creators just getting started</CardDescription>
                        <div className="mt-2">
                          <span className="text-3xl font-bold">$0</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 pb-6">
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Upload up to 5 resources</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>1GB storage</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Basic analytics</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Email support</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>25% commission rate</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <X className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Featured placement</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <X className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Priority review</span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Link href="/creator/register" className="w-full">
                          <Button variant="outline" className="w-full">
                            Get Started
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                    <Card className="flex flex-col">
                      <CardHeader className="flex flex-col space-y-1.5 pb-4">
                        <CardTitle className="text-xl">Basic</CardTitle>
                        <CardDescription>For individual creators building their catalog</CardDescription>
                        <div className="mt-2">
                          <span className="text-3xl font-bold">$9.99</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 pb-6">
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Upload up to 20 resources</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>5GB storage</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Basic analytics</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Standard support</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>20% commission rate</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <X className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Featured placement</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <X className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Priority review</span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Link href="/creator/register" className="w-full">
                          <Button className="w-full">Get Started</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                    <Card className="flex flex-col relative border-primary/50 shadow-md">
                      <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                        Most Popular
                      </div>
                      <CardHeader className="flex flex-col space-y-1.5 pb-4">
                        <CardTitle className="text-xl">Premium</CardTitle>
                        <CardDescription>For professional creators with growing catalogs</CardDescription>
                        <div className="mt-2">
                          <span className="text-3xl font-bold">$24.99</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 pb-6">
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Upload up to 100 resources</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>25GB storage</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Advanced analytics</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Priority support</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>15% commission rate</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Featured placement</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <X className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Priority review</span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Link href="/creator/register" className="w-full">
                          <Button className="w-full">Get Started</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                    <Card className="flex flex-col">
                      <CardHeader className="flex flex-col space-y-1.5 pb-4">
                        <CardTitle className="text-xl">Professional</CardTitle>
                        <CardDescription>For established creators and businesses</CardDescription>
                        <div className="mt-2">
                          <span className="text-3xl font-bold">$49.99</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 pb-6">
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Unlimited resource uploads</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>100GB storage</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Premium analytics</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Dedicated support</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>10% commission rate</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Featured placement</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Priority review</span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Link href="/creator/register" className="w-full">
                          <Button className="w-full">Get Started</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="customer" className="mt-8">
                  <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
                    <Card className="flex flex-col">
                      <CardHeader className="flex flex-col space-y-1.5 pb-4">
                        <CardTitle className="text-xl">Free</CardTitle>
                        <CardDescription>Basic access to resources</CardDescription>
                        <div className="mt-2">
                          <span className="text-3xl font-bold">$0</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 pb-6">
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Access to free resources</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Resource previews</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Basic search</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <X className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Download credits</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <X className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Advanced filters</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <X className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Early access</span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Link href="/signup" className="w-full">
                          <Button className="w-full">Sign Up Free</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                    <Card className="flex flex-col relative border-primary/50 shadow-md">
                      <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                        Most Popular
                      </div>
                      <CardHeader className="flex flex-col space-y-1.5 pb-4">
                        <CardTitle className="text-xl">Plus</CardTitle>
                        <CardDescription>Enhanced access with monthly credits</CardDescription>
                        <div className="mt-2">
                          <span className="text-3xl font-bold">$14.99</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 pb-6">
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>All Free features</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>10 download credits/month</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Advanced filters</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>10% discount on purchases</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <X className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Unlimited downloads</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <X className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Early access</span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Link href="/signup" className="w-full">
                          <Button className="w-full">Get Started</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                    <Card className="flex flex-col">
                      <CardHeader className="flex flex-col space-y-1.5 pb-4">
                        <CardTitle className="text-xl">Pro</CardTitle>
                        <CardDescription>Unlimited access for power users</CardDescription>
                        <div className="mt-2">
                          <span className="text-3xl font-bold">$29.99</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 pb-6">
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>All Plus features</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Unlimited downloads</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Early access to new resources</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>20% discount on purchases</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Priority customer support</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Exclusive Pro resources</span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Link href="/signup" className="w-full">
                          <Button className="w-full">Get Started</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-purple-50 dark:from-background dark:to-purple-950/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Get Started?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of creators and customers on ResourceHub today.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button size="lg" className="w-full">
                    Sign Up Now
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="w-full">
                    Contact Sales
                  </Button>
                </Link>
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

