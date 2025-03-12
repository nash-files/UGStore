"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"

export default function CreatorRegistration() {
  const [step, setStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState<"free" | "basic" | "premium" | "professional" | null>(null)
  const { user, updateUserPlan } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // If user is not a creator, redirect to signup
  useEffect(() => {
    if (user && user.role !== "creator") {
      router.push("/signup")
    }
  }, [user, router])

  // Pre-select the user's current plan if they have one
  useEffect(() => {
    if (user?.plan) {
      setSelectedPlan(user.plan)
    } else {
      setSelectedPlan("free") // Default to free plan
    }
  }, [user])

  const handlePlanSelect = (plan: "free" | "basic" | "premium" | "professional") => {
    setSelectedPlan(plan)
  }

  const handleNextStep = () => {
    setStep(step + 1)
  }

  const handlePrevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = () => {
    if (selectedPlan) {
      updateUserPlan(selectedPlan)
    }

    toast({
      title: "Registration complete",
      description: "Your creator account has been set up successfully.",
    })
    router.push("/creator/dashboard")
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
            {user ? (
              <span className="text-sm">Welcome, {user.name}</span>
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
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Become a Creator</h1>
              <p className="text-muted-foreground mt-2">
                Join our community of creators and start selling your digital resources.
              </p>
            </div>
            <div className="mb-8">
              <div className="flex justify-between items-center relative">
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-muted" />
                <div
                  className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {step > 1 ? <Check className="h-5 w-5" /> : 1}
                </div>
                <div
                  className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {step > 2 ? <Check className="h-5 w-5" /> : 2}
                </div>
                <div
                  className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {step > 3 ? <Check className="h-5 w-5" /> : 3}
                </div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <div className="text-center w-10">Plan</div>
                <div className="text-center w-10">Profile</div>
                <div className="text-center w-10">Submit</div>
              </div>
            </div>
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Choose a Creator Plan</h2>
                <p className="text-muted-foreground">
                  Select a plan that best fits your needs. You can upgrade or downgrade at any time.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card
                    className={`cursor-pointer ${selectedPlan === "free" ? "border-primary" : ""}`}
                    onClick={() => handlePlanSelect("free")}
                  >
                    <CardHeader>
                      <CardTitle>Free</CardTitle>
                      <CardDescription>For creators just getting started</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">
                        $0<span className="text-sm font-normal text-muted-foreground">/month</span>
                      </div>
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
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant={selectedPlan === "free" ? "default" : "outline"} className="w-full">
                        {selectedPlan === "free" ? "Selected" : "Select Plan"}
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card
                    className={`cursor-pointer ${selectedPlan === "basic" ? "border-primary" : ""}`}
                    onClick={() => handlePlanSelect("basic")}
                  >
                    <CardHeader>
                      <CardTitle>Basic</CardTitle>
                      <CardDescription>For individual creators building their catalog</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">
                        $9.99<span className="text-sm font-normal text-muted-foreground">/month</span>
                      </div>
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
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant={selectedPlan === "basic" ? "default" : "outline"} className="w-full">
                        {selectedPlan === "basic" ? "Selected" : "Select Plan"}
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card
                    className={`cursor-pointer ${selectedPlan === "premium" ? "border-primary" : ""}`}
                    onClick={() => handlePlanSelect("premium")}
                  >
                    <CardHeader>
                      <CardTitle>Premium</CardTitle>
                      <CardDescription>For professional creators with growing catalogs</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">
                        $24.99<span className="text-sm font-normal text-muted-foreground">/month</span>
                      </div>
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
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant={selectedPlan === "premium" ? "default" : "outline"} className="w-full">
                        {selectedPlan === "premium" ? "Selected" : "Select Plan"}
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card
                    className={`cursor-pointer ${selectedPlan === "professional" ? "border-primary" : ""}`}
                    onClick={() => handlePlanSelect("professional")}
                  >
                    <CardHeader>
                      <CardTitle>Professional</CardTitle>
                      <CardDescription>For established creators and businesses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">
                        $49.99<span className="text-sm font-normal text-muted-foreground">/month</span>
                      </div>
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
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant={selectedPlan === "professional" ? "default" : "outline"} className="w-full">
                        {selectedPlan === "professional" ? "Selected" : "Select Plan"}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                <div className="flex justify-end mt-6">
                  <Button onClick={handleNextStep} disabled={!selectedPlan}>
                    Continue
                  </Button>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Creator Profile</h2>
                <p className="text-muted-foreground">
                  Tell us about yourself and your work. This information will be visible to users browsing your
                  resources.
                </p>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input
                          id="first-name"
                          placeholder="Enter your first name"
                          defaultValue={user?.name.split(" ")[0] || ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input
                          id="last-name"
                          placeholder="Enter your last name"
                          defaultValue={user?.name.split(" ")[1] || ""}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="display-name">Display Name / Brand</Label>
                      <Input id="display-name" placeholder="How you'll appear to users" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        defaultValue={user?.email || ""}
                        disabled={!!user?.email}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell users about yourself and your work"
                        className="min-h-[120px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website (Optional)</Label>
                      <Input id="website" placeholder="https://yourwebsite.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Primary Category</Label>
                      <Select>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select your primary category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="educational">Educational</SelectItem>
                          <SelectItem value="photography">Photography</SelectItem>
                          <SelectItem value="graphic-design">Graphic Design</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="audio">Audio</SelectItem>
                          <SelectItem value="document">Document</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-image">Profile Image</Label>
                      <Input id="profile-image" type="file" />
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={handlePrevStep}>
                    Back
                  </Button>
                  <Button onClick={handleNextStep}>Continue</Button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Review & Submit</h2>
                <p className="text-muted-foreground">
                  Review your information before submitting your creator application.
                </p>
                <Card>
                  <CardHeader>
                    <CardTitle>Application Summary</CardTitle>
                    <CardDescription>
                      Your application will be reviewed by our team within 1-2 business days.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Selected Plan</h3>
                      <div className="p-3 bg-muted rounded-md">
                        <div className="font-medium">
                          {selectedPlan === "free"
                            ? "Free"
                            : selectedPlan === "basic"
                              ? "Basic"
                              : selectedPlan === "premium"
                                ? "Premium"
                                : "Professional"}{" "}
                          Plan
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {selectedPlan === "free"
                            ? "$0/month"
                            : selectedPlan === "basic"
                              ? "$9.99/month"
                              : selectedPlan === "premium"
                                ? "$24.99/month"
                                : "$49.99/month"}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Profile Information</h3>
                      <div className="p-3 bg-muted rounded-md space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-sm text-muted-foreground">Display Name</div>
                            <div>{user?.name || "John Smith"}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Email</div>
                            <div>{user?.email || "john.smith@example.com"}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Bio</div>
                          <div className="text-sm">
                            Professional photographer with over 10 years of experience specializing in nature and
                            landscape photography.
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Primary Category</div>
                          <div>Photography</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Terms & Conditions</h3>
                      <div className="p-3 bg-muted rounded-md space-y-2 text-sm">
                        <p>By submitting this application, you agree to our:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Creator Terms of Service</li>
                          <li>Content Guidelines</li>
                          <li>Commission Structure</li>
                          <li>Privacy Policy</li>
                        </ul>
                        <p>
                          You confirm that all information provided is accurate and that you have the rights to sell the
                          content you plan to upload.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full" onClick={handleSubmit}>
                      Submit Application
                    </Button>
                    <p className="text-sm text-muted-foreground text-center">
                      Need help?{" "}
                      <Link href="/contact" className="text-primary hover:underline">
                        Contact our support team
                      </Link>
                    </p>
                  </CardFooter>
                </Card>
                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={handlePrevStep}>
                    Back
                  </Button>
                </div>
              </div>
            )}
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

