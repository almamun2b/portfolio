"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Category {
  name: string
  count: number
}

interface CategoriesSidebarProps {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoriesSidebar({ categories, selectedCategory, onCategoryChange }: CategoriesSidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => onCategoryChange(category.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedCategory === category.name ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <span>{category.name}</span>
                <Badge variant="secondary">{category.count}</Badge>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}
