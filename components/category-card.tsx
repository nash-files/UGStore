import Link from "next/link"
import type { LucideIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CategoryCardProps {
  title: string
  description: string
  icon: LucideIcon
  count: number
}

export default function CategoryCard({ title, description, icon: Icon, count }: CategoryCardProps) {
  return (
    <Link href={`/resources/category/${encodeURIComponent(title.toLowerCase())}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md hover:border-primary/50">
        <CardHeader className="p-4 pb-0">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-primary/10 p-2">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardDescription className="mb-2">{description}</CardDescription>
          <div className="text-sm text-muted-foreground">{count} resources</div>
        </CardContent>
      </Card>
    </Link>
  )
}

