import { TestimonialsSection } from "@/components/blocks/testimonials-with-marquee"

const testimonials = [
  {
    author: {
      name: "Emma Thompson",
      handle: "@emmadonates",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "FoodShare has transformed how our community shares resources. I've donated excess produce from my garden and connected with neighbors I never knew before.",
    href: "#"
  },
  {
    author: {
      name: "David Park",
      handle: "@davidcommunity",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "As a local restaurant owner, I've been able to share our surplus food instead of throwing it away. The platform is intuitive and the community is wonderful.",
    href: "#"
  },
  {
    author: {
      name: "Sofia Rodriguez",
      handle: "@sofiahelps",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    text: "I'm a student on a tight budget, and FoodShare has been a game-changer. I've received fresh food that would have otherwise gone to waste."
  },
  {
    author: {
      name: "Michael Chen",
      handle: "@michaelshares",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    text: "Our neighborhood has reduced food waste by 30% since we started using FoodShare. It's not just an app, it's a movement for sustainable communities."
  },
  {
    author: {
      name: "Aisha Johnson",
      handle: "@aishaconnects",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face"
    },
    text: "As a community organizer, I've seen firsthand how FoodShare bridges gaps between those with excess and those in need. It's empowering for everyone."
  }
]

export function CommunityVoices() {
  return (
    <TestimonialsSection
      title="Voices from our community"
      description="Join thousands of neighbors who are already building stronger, more sustainable communities through food sharing"
      testimonials={testimonials}
      className="bg-[#F5F5F5] dark:bg-gray-900 transition-colors duration-300"
    />
  )
}
