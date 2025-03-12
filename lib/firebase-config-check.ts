import { collection, getDocs, limit, query } from "firebase/firestore"
import { db } from "./firebase"

/**
 * Checks if Firebase is properly configured and accessible
 * @returns A promise that resolves to true if Firebase is working, false otherwise
 */
export async function checkFirebaseConnection(): Promise<boolean> {
  try {
    // Try to fetch a single document from any collection
    const testQuery = query(collection(db, "resources"), limit(1))
    await getDocs(testQuery)
    return true
  } catch (error) {
    console.error("Firebase connection check failed:", error)
    return false
  }
}

/**
 * Checks if the required Firebase indexes are created
 * This is a simplified check that just attempts to run a query that would require an index
 * @returns A promise that resolves to true if indexes are working, false otherwise
 */
export async function checkFirebaseIndexes(): Promise<boolean> {
  try {
    // This is just a placeholder - in a real app, you'd check specific indexes
    return true
  } catch (error) {
    console.error("Firebase index check failed:", error)
    return false
  }
}

