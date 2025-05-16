import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { SparklesCore } from "@/components/ui/sparkles";

export function HeroSection() {
  const { user } = useAuth();
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[hsl(142,60%,95%)] to-[hsl(142,60%,90%)] dark:from-[hsl(215,35%,18%)] dark:to-[hsl(220,40%,13%)] py-10 md:py-16 transition-colors duration-300">
      {/* Sparkles background effect */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="heroSparkles"
          background="transparent"
          minSize={0.4}
          maxSize={1.2}
          particleDensity={70}
          className="w-full h-full"
          particleColor="hsl(142, 60%, 65%)"
          speed={0.5}
        />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="md:w-1/2 space-y-6">
            <div className="relative">
              <h1 className="font-montserrat font-bold text-3xl md:text-5xl text-[hsl(20,14.3%,20%)] dark:text-white leading-tight transition-colors duration-300">
                Share Food, <span className="text-[hsl(142,60%,65%)] dark:text-[hsl(142,60%,80%)] transition-colors duration-300">Build Community</span>
              </h1>
              
              {/* Subtle gradient line under heading */}
              <div className="absolute -bottom-2 left-0 bg-gradient-to-r from-transparent via-[hsl(142,60%,65%)] to-transparent h-[1px] w-3/4 opacity-70" />
            </div>
            
            <p className="font-opensans text-base md:text-lg text-[hsl(20,14.3%,30%)] dark:text-gray-300 max-w-lg transition-colors duration-300">
              Connect with neighbors to share surplus food, reduce waste, and strengthen your local community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                className="px-6 py-6 bg-[hsl(142,60%,85%)] hover:bg-[hsl(142,60%,75%)] dark:bg-[hsl(142,60%,70%)] dark:hover:bg-[hsl(142,60%,80%)] text-[hsl(142,60%,30%)] rounded-soft font-montserrat font-semibold shadow-soft dark:shadow-md transition-colors duration-300"
                asChild
              >
                <Link href={user ? "/donate" : "/auth"}>
                  Donate Food
                </Link>
              </Button>
              <Button 
                className="px-6 py-6 bg-[hsl(210,100%,85%)] hover:bg-[hsl(210,100%,75%)] dark:bg-[hsl(210,100%,70%)] dark:hover:bg-[hsl(210,100%,80%)] text-[hsl(210,100%,30%)] rounded-soft font-montserrat font-semibold shadow-soft dark:shadow-md transition-colors duration-300"
                asChild
              >
                <Link href={user ? "/find" : "/auth"}>
                  Find Food
                </Link>
              </Button>
            </div>
            
            <div className="pt-4 flex items-center text-[hsl(0,0%,45%)] dark:text-gray-400 transition-colors duration-300 backdrop-blur-sm bg-white/10 dark:bg-black/10 p-2 rounded-md inline-block">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5 mr-2"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="font-montserrat font-semibold">
                4,782 neighbors sharing in your area
              </span>
            </div>
          </div>
          
          <div className="md:w-1/2 rounded-soft overflow-hidden shadow-medium relative group">
            {/* Image container with sparkle overlay */}
            <div className="relative">
              <img 
                src="https://t3.ftcdn.net/jpg/04/55/42/74/360_F_455427402_zJ5MBm6BZNY998X6eFCu8M1miwgJciWG.jpg" 
                alt="People sharing food together" 
                className="w-full h-auto object-cover rounded-soft transition-transform duration-700 group-hover:scale-110" 
              />
              
              {/* Subtle sparkle overlay for the image */}
              <div className="absolute inset-0 opacity-30">
                <SparklesCore
                  id="imageSparkles"
                  background="transparent"
                  minSize={0.2}
                  maxSize={0.8}
                  particleDensity={40}
                  className="w-full h-full"
                  particleColor="#FFFFFF"
                  speed={0.3}
                />
              </div>
              
              {/* Gradient overlay to enhance text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/30 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
