"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { uploadResource } from "@/lib/resource-service"

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number" }),
  category: z.string().min(1, { message: "Please select a category" }),
  tags: z.string().optional(),
})

export default function UploadPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [resourceFile, setResourceFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      tags: "",
    },
  })

  const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
    },
  })

  const { getRootProps: getResourceRootProps, getInputProps: getResourceInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      setResourceFile(file)
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to upload resources",
        variant: "destructive",
      })
      return
    }

    if (!resourceFile) {
      toast({
        title: "Missing Resource File",
        description: "Please upload a resource file",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Process tags
      const tagsArray = values.tags ? values.tags.split(",").map((tag) => tag.trim()) : []

      // Prepare resource data
      const resourceData = {
        title: values.title,
        description: values.description,
        price: values.price,
        category: values.category,
        creatorId: user.id,
        tags: tagsArray,
      }

      // Upload resource
      await uploadResource(resourceData, thumbnailFile, resourceFile)

      toast({
        title: "Resource Uploaded",
        description: "Your resource has been uploaded and is pending approval",
      })

      // Redirect to creator dashboard
      router.push("/creator/dashboard")
    } catch (error) {
      console.error("Error uploading resource:", error)
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your resource. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Upload New Resource</CardTitle>
          <CardDescription>
            Share your digital resource with the community. All uploads will be reviewed before publishing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter resource title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your resource" className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (USD)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormDescription>Set to 0 for free resources</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="photography">Photography</SelectItem>
                          <SelectItem value="audio">Audio</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tags separated by commas" {...field} />
                    </FormControl>
                    <FormDescription>Example: design, template, photoshop</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div>
                  <FormLabel>Thumbnail Image</FormLabel>
                  <div
                    {...getThumbnailRootProps()}
                    className="border-2 border-dashed rounded-md p-6 mt-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 flex flex-col items-center justify-center"
                  >
                    <input {...getThumbnailInputProps()} />
                    {thumbnailPreview ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={thumbnailPreview || "/placeholder.svg"}
                          alt="Thumbnail preview"
                          className="w-40 h-40 object-cover rounded-md mb-2"
                        />
                        <p className="text-sm text-gray-500">Click or drag to replace</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Click or drag and drop to upload a thumbnail image</p>
                        <p className="text-xs text-gray-400 mt-1">Recommended size: 800x600px, JPG or PNG</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <FormLabel>Resource File</FormLabel>
                  <div
                    {...getResourceRootProps()}
                    className="border-2 border-dashed rounded-md p-6 mt-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <input {...getResourceInputProps()} />
                    <div className="text-center">
                      {resourceFile ? (
                        <div>
                          <p className="font-medium">{resourceFile.name}</p>
                          <p className="text-sm text-gray-500">{(resourceFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          <p className="text-xs text-gray-400 mt-1">Click or drag to replace</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-gray-500">Click or drag and drop to upload your resource file</p>
                          <p className="text-xs text-gray-400 mt-1">Supported formats: PDF, ZIP, images, and more</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Uploading..." : "Upload Resource"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

