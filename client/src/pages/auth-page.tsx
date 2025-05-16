import { useEffect, useState } from "react";
import { useLocation, useSearch, Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { Component as SignInCard } from "@/components/ui/sign-in-card-2";
import { Component as SignUpCard } from "@/components/ui/sign-up-card";
import { Helmet } from "react-helmet";

export default function AuthPage() {
  const { user } = useAuth();
  const [location] = useLocation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const initialTab = searchParams.get("tab") === "signup" ? "signup" : "login";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "signup" || tab === "login") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Redirect to home if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>{activeTab === "login" ? "Sign In" : "Sign Up"} | FoodShare</title>
        <meta 
          name="description" 
          content={activeTab === "login" 
            ? "Sign in to your FoodShare account to start sharing food, reducing waste, and building connections." 
            : "Join the FoodShare community to start sharing food, reducing waste, and building meaningful connections with your neighbors."
          }
        />
      </Helmet>
    
      {activeTab === "login" ? (
        <SignInCard />
      ) : (
        <SignUpCard />
      )}
    </>
  );
}
