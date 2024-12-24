"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchHomeCategories } from "@/apis/home";


export function CategoryFilter() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const getData = async () => {
      const landingPageData = await fetchHomeCategories();
      if (landingPageData) {
        const categoryNames = extractCategoryNames(landingPageData);
        setCategories(categoryNames);
      }
    };

    getData();
  }, []);

  function extractCategoryNames(data: any) {
    if (data && data.data && Array.isArray(data.data)) {
      const categoryNames = data.data.map((category: any) => category.name);
      return ["All", ...categoryNames];
    } else {
      console.error("Invalid data format");
      return [];
    }
  }
 console.log("checking categories",categories)
  return (
    <div className="border-b sticky top-16 bg-background z-40">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex p-4 gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant="secondary"
              className="rounded-full"
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
