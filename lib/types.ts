export interface User {
  id: string
  email: string | null
  name: string | null
  avatar: string | null
  role: "user" | "creator" | "admin"
  createdAt?: Date
  updatedAt?: Date
  approvalStatus?: "pending" | "approved" | "rejected"
  bio?: string
  website?: string
  social?: {
    twitter?: string
    instagram?: string
    facebook?: string
    linkedin?: string
  }
}

export interface Resource {
  id: string
  title: string
  description: string
  price: number
  category: string
  creatorId: string
  creatorName: string
  tags: string[]
  thumbnail: string
  fileUrl: string
  fileName: string
  fileType: string
  fileSize: number
  status: "pending" | "approved" | "rejected"
  createdAt: Date
  updatedAt: Date
  downloads: number
  views: number
  featured: boolean
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  count: number
  featured?: boolean
  createdAt: Date
  updatedAt?: Date
}

export interface Review {
  id: string
  resourceId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  createdAt: Date
  updatedAt?: Date
}

export interface Order {
  id: string
  userId: string
  resourceId: string
  resourceTitle: string
  creatorId: string
  amount: number
  status: "pending" | "completed" | "failed"
  paymentMethod: string
  paymentId?: string
  createdAt: Date
  updatedAt?: Date
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  recipientId: string
  recipientName: string
  content: string
  read: boolean
  createdAt: Date
}

export interface Report {
  id: string
  userId: string
  resourceId?: string
  creatorId?: string
  type: "resource" | "user" | "other"
  reason: string
  description: string
  status: "pending" | "resolved" | "dismissed"
  createdAt: Date
  updatedAt?: Date
}

