import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "./firebase"

// Default categories
const defaultCategories = [
  {
    id: "educational",
    name: "Educational",
    description: "Resources for learning and teaching",
    icon: "book-open",
    count: 0,
  },
  {
    id: "photography",
    name: "Photography",
    description: "High-quality images and photos",
    icon: "image",
    count: 0,
  },
  {
    id: "graphic-design",
    name: "Graphic Design",
    description: "Templates, mockups, and UI kits",
    icon: "layers",
    count: 0,
  },
  {
    id: "video",
    name: "Video",
    description: "Stock footage and motion graphics",
    icon: "video",
    count: 0,
  },
  {
    id: "audio",
    name: "Audio",
    description: "Music, sound effects, and audio files",
    icon: "music",
    count: 0,
  },
  {
    id: "templates",
    name: "Templates",
    description: "Ready-to-use templates for various purposes",
    icon: "file-text",
    count: 0,
  },
  {
    id: "software",
    name: "Software",
    description: "Applications, plugins, and code snippets",
    icon: "code",
    count: 0,
  },
  {
    id: "ebooks",
    name: "eBooks",
    description: "Digital books and publications",
    icon: "book",
    count: 0,
  },
  {
    id: "courses",
    name: "Courses",
    description: "Online courses and tutorials",
    icon: "graduation-cap",
    count: 0,
  },
]

/**
 * Initialize the database with default data
 */
export async function initializeDatabase() {
  try {
    // Check if categories already exist
    const categoriesRef = collection(db, "categories")
    const firstCategoryRef = doc(categoriesRef, "educational")
    const categoryDoc = await getDoc(firstCategoryRef)

    // If categories don't exist, create them
    if (!categoryDoc.exists()) {
      console.log("Initializing database with default categories...")

      // Create categories
      for (const category of defaultCategories) {
        await setDoc(doc(categoriesRef, category.id), {
          ...category,
          createdAt: new Date(),
        })
      }

      console.log("Database initialized successfully!")
    }
  } catch (error) {
    console.error("Error initializing database:", error)
  }
}

