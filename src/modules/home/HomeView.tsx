import { useState } from "react";
import { Button } from "@/components/ui/button";
import HeroSection from "./chunks/HeroSection";
import { Badge } from "@/components/ui/badge";
import FoodCard from "@/components/FoodCard";
import { mockCategories, mockFoods } from "@/lib/mockData";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFoods = mockFoods.filter((food) => {
    const matchesCategory = !selectedCategory || food.catId === selectedCategory;
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.foodDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && food.activeFlag;
  });

  // ...existing code...

  return (
    <div className="min-h-screen">
      {/* Hero Section modularized */}
      <HeroSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Categories */}
      <section className="py-4 bg-muted/30 w-full rounded-2xl border-b">
        <div className="container">
          <div className="flex gap-3 ml-2 overflow-x-auto scrollbar-hide pb-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "gradient-primary" : "text-black"}
            >
              All
            </Button>
            {mockCategories.filter(c => c.activeFlag).map((category) => (
              <Button
                key={category.catId}
                variant={selectedCategory === category.catId ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.catId)}
                className={selectedCategory === category.catId ? "gradient-primary" : "text-black"}
              >
                {category.catName}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Food Grid */}
      <section className="py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">
              {selectedCategory 
                ? mockCategories.find(c => c.catId === selectedCategory)?.catName 
                : "All Foods"}
            </h2>
            <Badge variant="secondary" className="text-sm">
              {filteredFoods.length} items
            </Badge>
          </div>
          {filteredFoods.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No items found. Try a different search or category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFoods.map((food) => (
                <FoodCard key={food.foodId} food={food} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
