"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category } from "@/types";

interface CategoriesSidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoriesSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoriesSidebarProps) {
  // Add "All" option to the beginning
  const allCategories = [
    {
      id: 0,
      name: "All",
      slug: "all",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    ...categories,
  ];

  return (
    <aside className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {allCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => onCategoryChange(category.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedCategory === category.name
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <span>{category.name}</span>
                <Badge variant="secondary" className="hidden">
                  0
                </Badge>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
