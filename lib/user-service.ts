import { doc, getDoc, updateDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { db, storage, auth } from "./firebase"
import { updateProfile } from "firebase/auth"
import { trackEvent, AnalyticsEvents } from "./analytics"

export type UserSettings = {
  emailNotifications: boolean
  marketingEmails: boolean
  resourceUpdates: boolean
  theme: "light" | "dark" | "system"
  language: string
  displayName?: string
  profileVisibility?: "public" | "private" | "creators-only"
}

export type UserProfile = {
  id: string
  name: string
  email: string
  role: "user" | "creator" | "admin"
  plan?: "free" | "basic" | "premium" | "professional"
  bio?: string
  website?: string
  avatar?: string
  settings?: UserSettings
  createdAt?: Date
  lastLogin?: Date
}

/**
 * Get a user's profile by ID
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", userId))

    if (!userDoc.exists()) {
      return null
    }

    const userData = userDoc.data()
    return {
      id: userId,
      name: userData.name || "",
      email: userData.email || "",
      role: userData.role || "user",
      plan: userData.plan,
      bio: userData.bio || "",
      website: userData.website || "",
      avatar: userData.avatar || "",
      settings: userData.settings || {},
      createdAt: userData.createdAt?.toDate(),
      lastLogin: userData.lastLogin?.toDate(),
    }
  } catch (error) {
    console.error("Error getting user profile:", error)
    throw error
  }
}

/**
 * Update a user's profile
 */
export async function updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<void> {
  try {
    const userRef = doc(db, "users", userId)

    // Remove id from the data to be updated
    const { id, ...dataToUpdate } = profileData

    await updateDoc(userRef, {
      ...dataToUpdate,
      updatedAt: new Date(),
    })

    // If name is updated, also update in Firebase Auth
    if (profileData.name && auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: profileData.name,
      })
    }

    trackEvent(AnalyticsEvents.UPDATE_PROFILE, {
      user_id: userId,
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

/**
 * Update user settings
 */
export async function updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<void> {
  try {
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      throw new Error("User not found")
    }

    const currentSettings = userDoc.data().settings || {}

    await updateDoc(userRef, {
      settings: {
        ...currentSettings,
        ...settings,
      },
      updatedAt: new Date(),
    })

    trackEvent(AnalyticsEvents.UPDATE_SETTINGS, {
      user_id: userId,
    })
  } catch (error) {
    console.error("Error updating user settings:", error)
    throw error
  }
}

/**
 * Upload a user avatar
 */
export async function uploadUserAvatar(userId: string, file: File): Promise<string> {
  try {
    // Delete existing avatar if it exists
    const userDoc = await getDoc(doc(db, "users", userId))
    if (userDoc.exists() && userDoc.data().avatar) {
      try {
        const oldAvatarRef = ref(storage, userDoc.data().avatar)
        await deleteObject(oldAvatarRef)
      } catch (error) {
        console.warn("Error deleting old avatar:", error)
      }
    }

    // Upload new avatar
    const avatarRef = ref(storage, `avatars/${userId}_${Date.now()}_${file.name}`)
    await uploadBytes(avatarRef, file)
    const avatarUrl = await getDownloadURL(avatarRef)

    // Update user document
    await updateDoc(doc(db, "users", userId), {
      avatar: avatarUrl,
      updatedAt: new Date(),
    })

    // Update Firebase Auth profile
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        photoURL: avatarUrl,
      })
    }

    return avatarUrl
  } catch (error) {
    console.error("Error uploading avatar:", error)
    throw error
  }
}

/**
 * Get user purchases
 */
export async function getUserPurchases(userId: string) {
  try {
    const purchasesQuery = query(collection(db, "purchases"), where("userId", "==", userId))

    const querySnapshot = await getDocs(purchasesQuery)
    const purchases = []

    for (const doc of querySnapshot.docs) {
      const purchaseData = doc.data()

      // Get resource details
      const resourceDoc = await getDoc(doc(db, "resources", purchaseData.resourceId))

      if (resourceDoc.exists()) {
        purchases.push({
          id: doc.id,
          ...purchaseData,
          resource: {
            id: resourceDoc.id,
            title: resourceDoc.data().title,
            thumbnail: resourceDoc.data().thumbnail,
            price: resourceDoc.data().price,
          },
          purchaseDate: purchaseData.createdAt.toDate(),
        })
      }
    }

    return purchases
  } catch (error) {
    console.error("Error getting user purchases:", error)
    throw error
  }
}

/**
 * Record a new purchase
 */
export async function recordPurchase(userId: string, resourceId: string, amount: number) {
  try {
    const purchaseRef = doc(collection(db, "purchases"))

    await setDoc(purchaseRef, {
      userId,
      resourceId,
      amount,
      createdAt: new Date(),
      status: "completed",
    })

    // Add to user's purchases collection for quick access
    await setDoc(doc(db, `users/${userId}/purchases`, purchaseRef.id), {
      purchaseId: purchaseRef.id,
      resourceId,
      amount,
      createdAt: new Date(),
    })

    // Increment resource downloads
    await incrementResourceDownloads(resourceId)

    trackEvent(AnalyticsEvents.PURCHASE_RESOURCE, {
      resource_id: resourceId,
      user_id: userId,
      amount,
    })

    return purchaseRef.id
  } catch (error) {
    console.error("Error recording purchase:", error)
    throw error
  }
}

/**
 * Increment resource downloads
 */
async function incrementResourceDownloads(resourceId: string) {
  try {
    const resourceRef = doc(db, "resources", resourceId)
    const resourceDoc = await getDoc(resourceRef)

    if (resourceDoc.exists()) {
      await updateDoc(resourceRef, {
        downloads: (resourceDoc.data().downloads || 0) + 1,
      })
    }
  } catch (error) {
    console.error("Error incrementing downloads:", error)
  }
}

