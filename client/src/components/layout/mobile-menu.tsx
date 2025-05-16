import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  if (!isOpen) return null;

  const handleLogout = () => {
    logoutMutation.mutate();
    onClose();
  };

  return (
    <div className="sm:hidden fixed inset-0 z-40 mt-[68px]">
      <div className="bg-black/50 h-full" onClick={onClose}></div>
      <div className="absolute top-0 right-0 w-4/5 h-screen bg-white dark:bg-gray-900 shadow-medium overflow-y-auto transition-colors duration-300">
        <div className="p-4 flex flex-col space-y-4">
          <Link 
            href="/" 
            className={`px-4 py-3 rounded-soft hover:bg-[#F5F5F5] dark:hover:bg-gray-800 ${location === '/' ? 'text-[#4CAF50] dark:text-[#6FCF7C]' : 'text-[#424242] dark:text-gray-300'} font-opensans transition-colors duration-300`}
            onClick={onClose}
          >
            Home
          </Link>
          <Link 
            href="/dashboard" 
            className={`px-4 py-3 rounded-soft hover:bg-[#F5F5F5] dark:hover:bg-gray-800 ${location === '/dashboard' ? 'text-[#4CAF50] dark:text-[#6FCF7C]' : 'text-[#424242] dark:text-gray-300'} font-opensans transition-colors duration-300`}
            onClick={onClose}
          >
            Dashboard
          </Link>
          <Link 
            href="/feed" 
            className={`px-4 py-3 rounded-soft hover:bg-[#F5F5F5] dark:hover:bg-gray-800 ${location === '/feed' ? 'text-[#4CAF50] dark:text-[#6FCF7C]' : 'text-[#424242] dark:text-gray-300'} font-opensans transition-colors duration-300`}
            onClick={onClose}
          >
            Feed
          </Link>
          <Link 
            href="/activity" 
            className={`px-4 py-3 rounded-soft hover:bg-[#F5F5F5] dark:hover:bg-gray-800 ${location === '/activity' ? 'text-[#4CAF50] dark:text-[#6FCF7C]' : 'text-[#424242] dark:text-gray-300'} font-opensans transition-colors duration-300`}
            onClick={onClose}
          >
            My Activity
          </Link>
          <div className="border-t border-[#E0E0E0] dark:border-gray-700 my-2"></div>
          
          <div className="flex justify-center my-2">
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full transition-colors duration-300">
              <ThemeToggle />
            </div>
          </div>
          
          {user ? (
            <>
              <Link 
                href="/profile" 
                className="px-4 py-3 text-center text-[hsl(210,100%,55%)] dark:text-[hsl(210,100%,70%)] border border-[hsl(210,100%,55%)] dark:border-[hsl(210,100%,70%)] rounded-soft hover:bg-[hsl(210,100%,55%)] dark:hover:bg-[hsl(210,100%,70%)] hover:text-white transition-colors"
                onClick={onClose}
              >
                Profile
              </Link>
              <Button 
                className="px-4 py-3 text-center bg-[hsl(210,100%,55%)] text-white rounded-soft hover:bg-[hsl(210,100%,45%)] dark:bg-[hsl(210,100%,45%)] dark:hover:bg-[hsl(210,100%,55%)] transition-colors"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link 
                href="/auth?tab=login" 
                className="px-4 py-3 text-center text-[hsl(210,100%,55%)] dark:text-[hsl(210,100%,70%)] border border-[hsl(210,100%,55%)] dark:border-[hsl(210,100%,70%)] rounded-soft hover:bg-[hsl(210,100%,55%)] dark:hover:bg-[hsl(210,100%,70%)] hover:text-white transition-colors"
                onClick={onClose}
              >
                Log In
              </Link>
              <Link 
                href="/auth?tab=signup" 
                className="px-4 py-3 text-center bg-[hsl(210,100%,55%)] dark:bg-[hsl(210,100%,45%)] text-white rounded-soft hover:bg-[hsl(210,100%,45%)] dark:hover:bg-[hsl(210,100%,55%)] transition-colors"
                onClick={onClose}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
