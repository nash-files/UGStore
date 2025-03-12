import { supabase } from "@/lib/supabase"

export type Resource = {
  id: string
  title: string
  description: string
  price: number
  category: string
  creatorId: string
  creatorName: string
  tags?: string[]
  thumbnail?: string
  fileUrl?: string
  fileName?: string
  fileType?: string
  fileSize?: number
  status: "pending" | "approved" | "rejected"
  createdAt: Date
  updatedAt: Date
  downloads?: number
  views?: number
  featured?: boolean
}

// Helper to convert database rows to Resource type
const convertResource = (data: any): Resource => {
  return {
    id: data.id,
    title: data.title || "",
    description: data.description || "",
    price: data.price || 0,
    category: data.category || "Other",
    creatorId: data.creator_id || "",
    creatorName: data.creator_name || data.profiles?.name || "Unknown Creator",
    tags: data.tags || [],
    thumbnail: data.thumbnail || null,
    fileUrl: data.file_url || null,
    fileName: data.file_name || "",
    fileType: data.file_type || "",
    fileSize: data.file_size || 0,
    status: data.status || "pending",
    createdAt: new Date(data.created_at) || new Date(),
    updatedAt: new Date(data.updated_at) || new Date(),
    downloads: data.downloads || 0,
    views: data.views || 0,
    featured: data.featured || false,
  }
}

// Get all resources
export const getResources = async (options?: {
  status?: "pending" | "approved" | "rejected"
  category?: string
  featured?: boolean
}) => {
  try {
    let query = supabase.from("resource_with_creator").select("*")

    // Apply filters if provided
    if (options?.status) {
      query = query.eq("status", options.status)
    }

    if (options?.category) {
      query = query.eq("category", options.category)
    }

    if (options?.featured !== undefined) {
      query = query.eq("featured", options.featured)
    }

    // Order by created_at
    query = query.order("created_at", { ascending: false })

    const { data, error } = await query

    if (error) throw error

    const resources: Resource[] = (data || []).map((item) => convertResource(item))

    return { resources }
  } catch (error) {
    console.error("Error getting resources:", error)
    throw error
  }
}

// Get resources by creator ID
export const getResourcesByCreator = async (
  creatorId: string,
  options?: {
    status?: "pending" | "approved" | "rejected"
  },
) => {
  try {
    let query = supabase.from("resources").select("*, profiles(name)").eq("creator_id", creatorId)

    if (options?.status) {
      query = query.eq("status", options.status)
    }

    query = query.order("created_at", { ascending: false })

    const { data, error } = await query

    if (error) throw error

    const resources: Resource[] = (data || []).map((item) =>
      convertResource({
        ...item,
        creator_name: item.profiles?.name,
      }),
    )

    return { resources }
  } catch (error) {
    console.error("Error getting creator resources:", error)
    throw error
  }
}

// Get a single resource by ID
export const getResourceById = async (resourceId: string) => {
  try {
    // First try to increment views
    try {
      await supabase.rpc("increment_resource_views", { resource_id: resourceId })
    } catch (error) {
      console.error("Error incrementing views:", error)
      // Continue even if this fails
    }

    const { data, error } = await supabase.from("resources").select("*, profiles(name)").eq("id", resourceId).single()

    if (error) throw error

    return convertResource({
      ...data,
      creator_name: data.profiles?.name,
    })
  } catch (error) {
    console.error("Error getting resource:", error)
    throw error
  }
}

// Approve a resource
export const approveResource = async (resourceId: string) => {
  try {
    const { error } = await supabase
      .from("resources")
      .update({
        status: "approved",
        updated_at: new Date().toISOString(),
      })
      .eq("id", resourceId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error approving resource:", error)
    throw error
  }
}

// Reject a resource
export const rejectResource = async (resourceId: string) => {
  try {
    const { error } = await supabase
      .from("resources")
      .update({
        status: "rejected",
        updated_at: new Date().toISOString(),
      })
      .eq("id", resourceId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error rejecting resource:", error)
    throw error
  }
}

// Delete a resource
export const deleteResource = async (resourceId: string) => {
  try {
    // Get the resource data first to get file paths
    const { data, error: fetchError } = await supabase.from("resources").select("*").eq("id", resourceId).single()

    if (fetchError) throw fetchError

    // Delete files from storage if they exist
    if (data.thumbnail) {
      const thumbnailPath = data.thumbnail.split("/").pop()
      if (thumbnailPath) {
        const { error: thumbnailError } = await supabase.storage.from("thumbnails").remove([thumbnailPath])

        if (thumbnailError) {
          console.error("Error deleting thumbnail:", thumbnailError)
          // Continue with deletion even if file deletion fails
        }
      }
    }

    if (data.file_url) {
      const filePath = data.file_url.split("/").pop()
      if (filePath) {
        const { error: fileError } = await supabase.storage.from("resources").remove([filePath])

        if (fileError) {
          console.error("Error deleting resource file:", fileError)
          // Continue with deletion even if file deletion fails
        }
      }
    }

    // Delete the resource record
    const { error: deleteError } = await supabase.from("resources").delete().eq("id", resourceId)

    if (deleteError) throw deleteError

    return { success: true }
  } catch (error) {
    console.error("Error deleting resource:", error)
    throw error
  }
}

// Upload a resource
export const uploadResource = async (resourceData: any, thumbnailFile: File | null, resourceFile: File | null) => {
  try {
    // First upload the files to storage
    let thumbnailUrl = null
    let fileUrl = null

    if (thumbnailFile) {
      const fileExt = thumbnailFile.name.split(".").pop()
      const thumbnailFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`

      const { data: thumbnailData, error: thumbnailError } = await supabase.storage
        .from("thumbnails")
        .upload(thumbnailFileName, thumbnailFile, {
          cacheControl: "3600",
          upsert: false,
        })

      if (thumbnailError) throw thumbnailError

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from("thumbnails").getPublicUrl(thumbnailFileName)

      thumbnailUrl = publicUrlData.publicUrl
    }

    if (resourceFile) {
      const fileExt = resourceFile.name.split(".").pop()
      const resourceFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`

      const { data: fileData, error: fileError } = await supabase.storage
        .from("resources")
        .upload(resourceFileName, resourceFile, {
          cacheControl: "3600",
          upsert: false,
        })

      if (fileError) throw fileError

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from("resources").getPublicUrl(resourceFileName)

      fileUrl = publicUrlData.publicUrl
    }

    // Now insert the resource record
    const { data, error } = await supabase
      .from("resources")
      .insert([
        {
          title: resourceData.title,
          description: resourceData.description,
          price: resourceData.price,
          category: resourceData.category,
          creator_id: resourceData.creatorId,
          tags: resourceData.tags,
          thumbnail: thumbnailUrl,
          file_url: fileUrl,
          file_name: resourceFile?.name,
          file_type: resourceFile?.type,
          file_size: resourceFile?.size,
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          downloads: 0,
          views: 0,
          featured: false,
        },
      ])
      .select()

    if (error) throw error

    return { resource: data[0], success: true }
  } catch (error) {
    console.error("Error uploading resource:", error)
    throw error
  }
}

// Download a resource
export const downloadResource = async (resourceId: string) => {
  try {
    // First increment download count
    try {
      await supabase.rpc("increment_resource_downloads", { resource_id: resourceId })
    } catch (error) {
      console.error("Error incrementing downloads:", error)
      // Continue even if this fails
    }

    // Get the resource
    const { data, error } = await supabase.from("resources").select("file_url, file_name").eq("id", resourceId).single()

    if (error) throw error

    if (!data.file_url) {
      throw new Error("Resource has no file")
    }

    return {
      fileUrl: data.file_url,
      fileName: data.file_name,
    }
  } catch (error) {
    console.error("Error downloading resource:", error)
    throw error
  }
}

// Feature or unfeature a resource
export const toggleResourceFeatured = async (resourceId: string, featured: boolean) => {
  try {
    const { error } = await supabase
      .from("resources")
      .update({
        featured,
        updated_at: new Date().toISOString(),
      })
      .eq("id", resourceId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error toggling resource featured status:", error)
    throw error
  }
}

