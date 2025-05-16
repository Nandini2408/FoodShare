import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Sprout, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "./mobile-menu";
import { useAuth } from "@/hooks/use-auth";
import { NotificationsDropdown } from "@/components/notifications/notifications-dropdown";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <header className="bg-white dark:bg-[hsl(215,35%,18%)] shadow-soft sticky top-0 z-50 transition-colors duration-300 backdrop-blur-sm bg-white/90 dark:bg-[hsl(215,35%,18%)]/90">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="FoodShare Home">
          <div className="bg-[hsl(210,80%,55%)] dark:bg-[hsl(210,80%,40%)] p-2 rounded-full flex items-center justify-center transition-colors duration-300 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M12 6c0-2.2-1.8-4-4-4S4 3.8 4 6s1.8 4 4 4c1.5 0 2.8-.7 3.6-1.7" />
              <path d="M12 6c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4c-1.5 0-2.8-.7-3.6-1.7" />
              <path d="M6 14h12c2.2 0 4 1.8 4 4s-1.8 4-4 4H6c-2.2 0-4-1.8-4-4s1.8-4 4-4z" />
            </svg>
          </div>
          <span className="font-montserrat font-bold text-xl text-[hsl(20,14.3%,20%)] dark:text-white transition-colors duration-300">FoodShare</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden sm:flex space-x-6 items-center">
          <Link 
            href="/" 
            className={`text-base font-montserrat ${location === '/' ? 'text-[hsl(210,80%,55%)] dark:text-[hsl(210,80%,75%)] font-semibold' : 'text-[hsl(20,14.3%,30%)] dark:text-gray-300'} hover:text-[hsl(210,80%,55%)] dark:hover:text-[hsl(210,80%,75%)] transition-colors`}
          >
            Home
          </Link>
          <Link 
            href="/dashboard" 
            className={`text-base font-montserrat ${location === '/dashboard' ? 'text-[hsl(210,80%,55%)] dark:text-[hsl(210,80%,75%)] font-semibold' : 'text-[hsl(20,14.3%,30%)] dark:text-gray-300'} hover:text-[hsl(210,80%,55%)] dark:hover:text-[hsl(210,80%,75%)] transition-colors`}
          >
            Dashboard
          </Link>
          <Link 
            href="/feed" 
            className={`text-base font-montserrat ${location === '/feed' ? 'text-[hsl(210,80%,55%)] dark:text-[hsl(210,80%,75%)] font-semibold' : 'text-[hsl(20,14.3%,30%)] dark:text-gray-300'} hover:text-[hsl(210,80%,55%)] dark:hover:text-[hsl(210,80%,75%)] transition-colors`}
          >
            Feed
          </Link>
          <Link 
            href="/activity" 
            className={`text-base font-montserrat ${location === '/activity' ? 'text-[hsl(210,80%,55%)] dark:text-[hsl(210,80%,75%)] font-semibold' : 'text-[hsl(20,14.3%,30%)] dark:text-gray-300'} hover:text-[hsl(210,80%,55%)] dark:hover:text-[hsl(210,80%,75%)] transition-colors`}
          >
            My Activity
          </Link>
          
          <div className="ml-2 flex items-center">
            <ThemeToggle />
          </div>
          
          {user ? (
            <div className="flex space-x-3 items-center">
              {/* Add notifications dropdown */}
              <NotificationsDropdown />
              
              <Button 
                variant="outline" 
                className="px-4 py-2 text-[hsl(210,100%,40%)] dark:text-[hsl(210,100%,80%)] border border-[hsl(210,100%,80%)] dark:border-[hsl(210,100%,80%)] rounded-soft hover:bg-[hsl(210,100%,90%)] dark:hover:bg-[hsl(210,100%,20%)] hover:text-[hsl(210,100%,30%)] transition-colors"
                asChild
              >
                <Link href="/profile">
                  Profile
                </Link>
              </Button>
              <Button 
                variant="outline"
                className="px-4 py-2 text-[hsl(210,100%,40%)] dark:text-[hsl(210,100%,80%)] border border-[hsl(210,100%,80%)] dark:border-[hsl(210,100%,80%)] rounded-soft hover:bg-[hsl(210,100%,90%)] dark:hover:bg-[hsl(210,100%,20%)] hover:text-[hsl(210,100%,30%)] transition-colors"
                onClick={() => logoutMutation.mutate()}
              >
                Log Out
              </Button>
            </div>
          ) : (
            <div className="flex space-x-3 items-center">
              <Button 
                variant="outline" 
                className="px-4 py-2 text-[hsl(210,100%,40%)] dark:text-[hsl(210,100%,80%)] border border-[hsl(210,100%,80%)] dark:border-[hsl(210,100%,80%)] rounded-soft hover:bg-[hsl(210,100%,90%)] dark:hover:bg-[hsl(210,100%,20%)] hover:text-[hsl(210,100%,30%)] transition-colors"
                asChild
              >
                <Link href="/auth?tab=login">
                  Log In
                </Link>
              </Button>
              <Button 
                variant="outline"
                className="px-4 py-2 text-[hsl(210,100%,40%)] dark:text-[hsl(210,100%,80%)] border border-[hsl(210,100%,80%)] dark:border-[hsl(210,100%,80%)] rounded-soft hover:bg-[hsl(210,100%,90%)] dark:hover:bg-[hsl(210,100%,20%)] hover:text-[hsl(210,100%,30%)] transition-colors"
                asChild
              >
                <Link href="/auth?tab=signup">
                  Sign Up
                </Link>
              </Button>
            </div>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMobileMenu}
          className="sm:hidden text-[#424242] dark:text-white text-2xl p-2 transition-colors duration-300" 
          aria-label="Toggle menu"
        >
          {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
    </header>
  );
}
