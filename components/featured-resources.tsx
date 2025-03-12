"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { collection, getDocs, limit, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ResourceCard } from "@/components/resource-card"
import type { Resource } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function FeaturedResources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedResources() {
      try {
        const q = query(
          collection(db, "resources"),
          where("status", "==", "approved"),
          where("featured", "==", true),
          limit(4),
        )
        const querySnapshot = await getDocs(q)
        const fetchedResources: Resource[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          fetchedResources.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Resource)
        })
        setResources(fetchedResources)
      } catch (error) {
        console.error("Error fetching featured resources:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedResources()
  }, [])

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Featured Resources</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Explore our handpicked selection of premium digital resources.
            </p>
          </div>
        </div>
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm animate-pulse">
                <div className="h-48 rounded-t-lg bg-gray-200 dark:bg-gray-800" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded" />
                  <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : resources.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured resources available at the moment.</p>
          </div>
        )}
        <div className="flex justify-center mt-8">
          <Button asChild>
            <Link href="/resources">
              View All Resources
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

