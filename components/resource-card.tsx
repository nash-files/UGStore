"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, Edit, Star } from "lucide-react"

interface ResourceCardProps {
  title: string
  description: string
  price: number
  category: string
  creator: string
  thumbnail: string
  showBuyOptions?: boolean
  status?: "pending" | "approved" | "rejected"
  views?: number
  downloads?: number
  rating?: number
  onEdit?: () => void
}

export default function ResourceCard({
  title,
  description,
  price,
  category,
  creator,
  thumbnail,
  showBuyOptions = true,
  status,
  views,
  downloads,
  rating,
  onEdit,
}: ResourceCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={thumbnail || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={price === 0 ? "outline" : "default"} className="bg-primary text-primary-foreground">
            {price === 0 ? "Free" : `$${price.toFixed(2)}`}
          </Badge>
        </div>
        {status && (
          <div className="absolute top-2 left-2">
            <Badge variant={status === "approved" ? "default" : status === "pending" ? "outline" : "destructive"}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
        )}
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="space-y-1">
          <h3 className="font-semibold leading-none">{title}</h3>
          <p className="text-sm text-muted-foreground">By {creator}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>

        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="secondary">{category}</Badge>

          {(views !== undefined || downloads !== undefined || rating !== undefined) && (
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              {views !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{views}</span>
                </div>
              )}

              {downloads !== undefined && (
                <div className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  <span>{downloads}</span>
                </div>
              )}

              {rating !== undefined && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current text-yellow-500" />
                  <span>{rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {showBuyOptions ? (
          <div className="flex w-full gap-2">
            <Button variant="outline" className="w-full">
              Preview
            </Button>
            <Button className="w-full">{price === 0 ? "Download" : "Buy Now"}</Button>
          </div>
        ) : onEdit ? (
          <Button variant="outline" className="w-full" onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Resource
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  )
}

