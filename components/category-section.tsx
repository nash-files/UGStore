"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import type { Category } from "@/lib/types"
import { ArrowRight, Tag } from "lucide-react"

export function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const q = query(collection(db, "categories"), where("featured", "==", true), orderBy("name"), limit(8))
        const querySnapshot = await getDocs(q)
        const fetchedCategories: Category[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          fetchedCategories.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Category)
        })
        setCategories(fetchedCategories)
      } catch (error) {
        console.error("Error fetching categories:", error)
        // Fallback to default categories if there's an error
        setCategories([
          {
            id: "1",
            name: "Graphics",
            description: "Graphics and design resources",
            icon: "image",
            count: 0,
            createdAt: new Date(),
          },
          {
            id: "2",
            name: "Templates",
            description: "Website and document templates",
            icon: "file",
            count: 0,
            createdAt: new Date(),
          },
          {
            id: "3",
            name: "Photos",
            description: "Stock photos and images",
            icon: "image",
            count: 0,
            createdAt: new Date(),
          },
          {
            id: "4",
            name: "Videos",
            description: "Video templates and footage",
            icon: "video",
            count: 0,
            createdAt: new Date(),
          },
          {
            id: "5",
            name: "Audio",
            description: "Music and sound effects",
            icon: "music",
            count: 0,
            createdAt: new Date(),
          },
          { id: "6", name: "3D", description: "3D models and assets", icon: "cube", count: 0, createdAt: new Date() },
          {
            id: "7",
            name: "Fonts",
            description: "Typography and fonts",
            icon: "type",
            count: 0,
            createdAt: new Date(),
          },
          {
            id: "8",
            name: "Educational",
            description: "Courses and tutorials",
            icon: "book",
            count: 0,
            createdAt: new Date(),
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Browse by Category</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Find resources by category to match your specific needs.
            </p>
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-center h-24 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse"
              >
                <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/resources?category=${category.id}`}
                className="flex items-center justify-center h-24 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  <span className="font-medium">{category.name}</span>
                  {category.count > 0 && <span className="text-xs text-muted-foreground">({category.count})</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="flex justify-center mt-8">
          <Button asChild variant="outline">
            <Link href="/categories">
              View All Categories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

