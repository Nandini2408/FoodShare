import { DefaultToggle } from "@/components/ui/demo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Helmet } from "react-helmet";

export default function ThemeDemoPage() {
  return (
    <>
      <Helmet>
        <title>Theme Toggle Demo - FoodShare</title>
      </Helmet>
      
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold text-center mb-8 dark:text-white">Theme Toggle Demo</h1>
        
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6 dark:text-white">Default Theme Toggle</h2>
          <div className="mb-10">
            <DefaultToggle />
          </div>
          
          <h2 className="text-xl font-semibold mb-6 dark:text-white">Theme Toggle Variations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4 dark:text-white">Standard Toggle</h3>
              <div className="flex justify-center">
                <ThemeToggle />
              </div>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4 dark:text-white">Custom Class Toggle</h3>
              <div className="flex justify-center">
                <ThemeToggle className="shadow-lg" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto mt-12 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6 dark:text-white">Usage Information</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>The ThemeToggle component is a stylish switch that allows users to toggle between light and dark themes.</p>
            <p>It integrates with the theme context in the application and automatically updates the theme when clicked.</p>
            
            <h3>Features:</h3>
            <ul>
              <li>Smooth animations during theme transition</li>
              <li>Visual indicators for current theme</li>
              <li>Accessible with keyboard navigation</li>
              <li>Customizable through className prop</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
} 