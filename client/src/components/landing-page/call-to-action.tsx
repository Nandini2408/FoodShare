import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function CallToAction() {
  return (
    <section className="py-16 bg-gradient-to-r from-[hsl(210,100%,45%)] to-[hsl(210,100%,30%)] dark:from-[hsl(210,100%,25%)] dark:to-[hsl(210,100%,15%)] text-white transition-colors duration-300">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-montserrat font-bold text-2xl md:text-4xl mb-6">Ready to join our food-sharing community?</h2>
        <p className="font-opensans text-lg mb-8 max-w-2xl mx-auto">
          Sign up today to start sharing or finding food in your neighborhood.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline"
            className="px-8 py-6 text-[hsl(210,100%,40%)] dark:text-[hsl(210,100%,80%)] border border-[hsl(210,100%,80%)] dark:border-[hsl(210,100%,80%)] rounded-soft hover:bg-[hsl(210,100%,90%)] dark:hover:bg-[hsl(210,100%,20%)] hover:text-[hsl(210,100%,30%)] transition-colors font-montserrat font-semibold"
            asChild
          >
            <Link href="/auth">
              Create Account
            </Link>
          </Button>
          <Button 
            variant="outline"
            className="px-8 py-6 text-[hsl(210,100%,40%)] dark:text-[hsl(210,100%,80%)] border border-[hsl(210,100%,80%)] dark:border-[hsl(210,100%,80%)] rounded-soft hover:bg-[hsl(210,100%,90%)] dark:hover:bg-[hsl(210,100%,20%)] hover:text-[hsl(210,100%,30%)] transition-colors font-montserrat font-semibold"
            asChild
          >
            <Link href="/browse">
              Browse as Guest
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
