import { useState } from "react";
import { Helmet } from "react-helmet";
import { FeedView } from "@/components/feed/feed-view";
import { MapView } from "@/components/feed/map-view";
import { CreatePostButton } from "@/components/feed/create-post-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterPanel } from "@/components/feed/filter-panel";
import { Link } from "wouter";

// We'll handle the react-helmet types by ignoring them for now
// In a production app, you'd install @types/react-helmet

export default function FeedPage() {
  const [activeView, setActiveView] = useState<"feed" | "map">("feed");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [filterType, setFilterType] = useState<"all" | "donations" | "requests">("all");
  
  // State for all filter values
  const [activeFilters, setActiveFilters] = useState({
    distance: 5,
    category: [] as string[],
    dietary: [] as string[],
    expiryWithin: 7,
    type: 'all' as 'all' | 'donation' | 'request'
  });
  
  // Function to update filters safely with type checking
  const updateFilters = (filters: {
    distance: number;
    category: string[];
    dietary: string[];
    expiryWithin?: number;
    type?: 'all' | 'donation' | 'request';
  }) => {
    setActiveFilters({
      ...activeFilters,
      distance: filters.distance,
      category: filters.category,
      dietary: filters.dietary,
      expiryWithin: filters.expiryWithin ?? activeFilters.expiryWithin,
      type: filters.type ?? activeFilters.type
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Here you would trigger the actual search
  };

  return (
    <>
      <Helmet>
        <title>Find Food | FoodShare</title>
        <meta 
          name="description" 
          content="Browse available food donations and requests in your area. Connect with neighbors and reduce food waste."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-row items-center justify-between mb-8 w-full gap-4">
          <h1 className="font-montserrat font-bold text-3xl md:text-4xl text-[hsl(210,80%,45%)] dark:text-[hsl(210,80%,75%)] text-left transition-colors duration-300">
            Find Food
          </h1>
          <div className="flex flex-row items-center gap-4 justify-end">
            <form onSubmit={handleSearch} className="relative flex w-full md:w-auto md:mr-2">
              <Input
                type="text"
                placeholder="Search for food items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 w-full md:w-64 lg:w-80 border border-[#E0E0E0] dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-soft focus:outline-none focus:border-[hsl(210,80%,55%)] dark:focus:border-[hsl(210,80%,75%)] transition-colors duration-300"
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 text-[#9E9E9E] dark:text-gray-400 hover:text-[hsl(210,80%,55%)] dark:hover:text-[hsl(210,80%,75%)] transition-colors duration-300"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
            <Button
              variant="default"
              className="bg-[hsl(210,80%,85%)] dark:bg-[hsl(210,80%,30%)] text-[hsl(210,80%,30%)] dark:text-white font-bold px-6 py-2 rounded-lg shadow-md text-base hover:bg-[hsl(210,80%,75%)] dark:hover:bg-[hsl(210,80%,40%)] focus:ring-2 focus:ring-[hsl(210,80%,55%)] dark:focus:ring-[hsl(210,80%,70%)] focus:outline-none transition-all duration-200"
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
          </div>
        </div>

        {showFilters && 
          <FilterPanel 
            onClose={() => setShowFilters(false)} 
            onApplyFilters={(filters) => {
              updateFilters(filters);
              setShowFilters(false);
            }}
          />}

        <Tabs 
          value={activeView}
          onValueChange={(value) => setActiveView(value as "feed" | "map")}
          className="w-full mb-6"
        >
          <div className="flex justify-between items-center mb-8 mt-6">
            <TabsList className="grid w-[200px] grid-cols-2 dark:bg-gray-800 transition-colors duration-300">
              <TabsTrigger 
                value="feed"
                className="font-montserrat font-semibold dark:data-[state=active]:bg-gray-950 dark:data-[state=active]:text-white dark:text-gray-300 transition-colors duration-300"
              >
                List View
              </TabsTrigger>
              <TabsTrigger 
                value="map"
                className="font-montserrat font-semibold dark:data-[state=active]:bg-gray-950 dark:data-[state=active]:text-white dark:text-gray-300 transition-colors duration-300"
              >
                Map View
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="feed" className="mt-4">
            <FeedView filters={activeFilters} />
          </TabsContent>

          <TabsContent value="map" className="mt-0">
            <MapView filters={activeFilters} />
          </TabsContent>
        </Tabs>
      </div>

      <CreatePostButton />
    </>
  );
}