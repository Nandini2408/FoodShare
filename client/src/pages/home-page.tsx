import { HeroSection } from "@/components/landing-page/hero-section";
import { HowItWorks } from "@/components/landing-page/how-it-works";
import { FeaturedItems } from "@/components/landing-page/featured-items";
import { CommunityImpact } from "@/components/landing-page/community-impact";
import { CommunityVoices } from "@/components/landing-page/community-voices";
import { CallToAction } from "@/components/landing-page/call-to-action";
import { FAQ } from "@/components/landing-page/faq";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const { user } = useAuth();
  let welcomeName = "";
  if (user) {
    if (user.firstName && user.lastName) {
      welcomeName = `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      welcomeName = user.firstName;
    } else if (user.username) {
      welcomeName = user.username;
    }
  }
  // Add smile emoji after the name if user is logged in
  const nameWithEmoji = user ? `${welcomeName} 😊` : "";

  return (
    <>
      <Helmet>
        <title>FoodShare - Reducing food waste, building community</title>
        <meta 
          name="description" 
          content="Connect with neighbors to share surplus food, reduce waste, and build a stronger community with FoodShare's free platform."
        />
        <meta property="og:title" content="FoodShare - Reducing food waste, building community" />
        <meta 
          property="og:description" 
          content="Share food, make connections, and reduce waste in your local community with FoodShare."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://foodshare.community" />
        {/* Google Fonts for aesthetic style */}
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&display=swap" rel="stylesheet" />
      </Helmet>
      
      <main>
        <div
          style={{
            fontFamily: "'Montserrat', 'Quicksand', 'Poppins', Arial, sans-serif",
            textAlign: "center",
            margin: "2.5rem 0 2rem 0",
          }}
        >
          <div
            style={{
              fontSize: "2.7rem",
              fontWeight: 900,
              letterSpacing: "-1px",
              textShadow: "0 2px 16px rgba(0,0,0,0.10)",
              marginBottom: "0.5rem",
              lineHeight: 1.1,
            }}
          >
            {user ? (
              <>
                <span
                  style={{
                    background: "linear-gradient(90deg, #FFD700 0%, #FFFACD 50%, #FFD700 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "#FFD700",
                    fontWeight: 900,
                    display: "inline-block"
                  }}
                >
                  Welcome,
                </span>{' '}
                <span style={{ color: "var(--fc-welcome-username, #3f51b5)", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.08))" }}>{nameWithEmoji}</span>
              </>
            ) : (
              <span style={{ color: "var(--fc-welcome-main, #222)" }}>Welcome to FoodShare!</span>
            )}
          </div>
          <div
            style={{
              fontSize: "1.1rem",
              fontWeight: 500,
              color: "var(--fc-welcome-sub, #4bb6a7)",
              letterSpacing: "-0.5px",
              textShadow: "0 1px 8px rgba(0,0,0,0.06)",
              lineHeight: 1.2,
              textAlign: "center",
            }}
          >
            {user
              ? "We're glad to have you back and part of our food sharing community. Let's make a difference together!"
              : "Connect, share, and make a difference in your community!"}
          </div>
        </div>
        <HeroSection />
        <HowItWorks />
        <FeaturedItems />
        <CommunityImpact />
        <CommunityVoices />
        <CallToAction />
        <FAQ />
      </main>
    </>
  );
}
