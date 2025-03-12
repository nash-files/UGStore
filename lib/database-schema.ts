/**
 * This file documents the Firebase database schema
 * It's not used in the application but serves as documentation
 */

// Firestore Collections
interface FirestoreSchema {
  users: {
    [userId: string]: UserDocument
    // Subcollections
    resources: {
      [resourceId: string]: UserResourceDocument
    }
    purchases: {
      [purchaseId: string]: UserPurchaseDocument
    }
    settings: {
      [settingId: string]: UserSettingDocument
    }
  }
  resources: {
    [resourceId: string]: ResourceDocument
    // Subcollections
    reviews: {
      [reviewId: string]: ReviewDocument
    }
  }
  purchases: {
    [purchaseId: string]: PurchaseDocument
  }
  categories: {
    [categoryId: string]: CategoryDocument
  }
}

// User Document
interface UserDocument {
  id: string
  name: string
  email: string
  role: "user" | "creator" | "admin"
  plan?: "free" | "basic" | "premium" | "professional"
  bio?: string
  website?: string
  avatar?: string
  settings: {
    emailNotifications: boolean
    marketingEmails: boolean
    resourceUpdates: boolean
    theme: "light" | "dark" | "system"
    language: string
    profileVisibility: "public" | "private" | "creators-only"
  }
  createdAt: Date
  updatedAt?: Date
  lastLogin?: Date
}

// User Resource Document (subcollection)
interface UserResourceDocument {
  resourceId: string
  title: string
  createdAt: Date
  status: "pending" | "approved" | "rejected"
}

// User Purchase Document (subcollection)
interface UserPurchaseDocument {
  purchaseId: string
  resourceId: string
  amount: number
  createdAt: Date
}

// User Setting Document (subcollection)
interface UserSettingDocument {
  key: string
  value: any
  updatedAt: Date
}

// Resource Document
interface ResourceDocument {
  id: string
  title: string
  description: string
  price: number
  category: string
  creatorId: string
  creatorName: string
  thumbnail: string
  fileUrl: string
  fileName: string
  fileType: string
  fileSize: number
  tags: string[]
  status: "pending" | "approved" | "rejected"
  createdAt: Date
  updatedAt: Date
  downloads: number
  views: number
  featured: boolean
}

// Review Document (subcollection)
interface ReviewDocument {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  createdAt: Date
  updatedAt?: Date
}

// Purchase Document
interface PurchaseDocument {
  id: string
  userId: string
  resourceId: string
  amount: number
  status: "pending" | "completed" | "refunded"
  createdAt: Date
  completedAt?: Date
  refundedAt?: Date
}

// Category Document
interface CategoryDocument {
  id: string
  name: string
  description: string
  icon: string
  count: number
  createdAt: Date
  updatedAt?: Date
}

// Firebase Storage Structure
interface StorageSchema {
  avatars: {
    [userId_timestamp_filename: string]: File
  }
  thumbnails: {
    [resourceId_timestamp_filename: string]: File
  }
  resources: {
    [resourceId_timestamp_filename: string]: File
  }
}

