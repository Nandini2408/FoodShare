'use client'
import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { User, Eye, EyeOff, ArrowRight, MapPin } from 'lucide-react';

import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/contexts/theme-context";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export function Component() {
  const { registerMutation } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // For 3D card effect - increased rotation range for more pronounced 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]); // Increased from 5/-5 to 10/-10
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]); // Increased from -5/5 to -10/10

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Contains number
    if (/[0-9]/.test(password)) strength += 1;
    
    // Contains special character
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    
    return Math.min(strength, 4);
  };

  const getStrengthText = (strength: number) => {
    if (strength === 0) return "Very Weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  const getStrengthColor = (strength: number) => {
    if (strength === 0) return "bg-red-500";
    if (strength === 1) return "bg-orange-500";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!firstName) newErrors.firstName = "First name is required";
    else if (firstName.length < 2) newErrors.firstName = "First name must be at least 2 characters";
    
    if (!lastName) newErrors.lastName = "Last name is required";
    else if (lastName.length < 2) newErrors.lastName = "Last name must be at least 2 characters";
    
    if (!username) newErrors.username = "Username is required";
    else if (username.length < 3) newErrors.username = "Username must be at least 3 characters";
    
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    
    if (!zipCode) newErrors.zipCode = "ZIP/Postal code is required";
    else if (zipCode.length < 5) newErrors.zipCode = "ZIP/Postal code must be at least 5 characters";
    
    if (!agreeTerms) newErrors.agreeTerms = "You must agree to the terms and conditions";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    registerMutation.mutate({
      username,
      password,
      // Additional fields could be saved to user metadata in a real application
    }, {
      onSettled: () => {
        setIsLoading(false);
      }
    });
  };

  return (
    <div className={cn(
      "min-h-screen w-screen relative overflow-hidden flex items-center justify-center",
      isDark ? "bg-black" : "bg-gray-50"
    )}>
      {/* Background gradient effect - theme aware */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-b",
        isDark 
          ? "from-blue-900/40 via-blue-950/50 to-black" 
          : "from-green-400/20 via-green-500/10 to-white"
      )} />
      
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />

      {/* Top radial glow */}
      <div className={cn(
        "absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] blur-[80px]",
        isDark ? "bg-blue-600/20" : "bg-green-500/20"
      )} />
      <motion.div 
        className={cn(
          "absolute top-0 left-1/2 transform -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full blur-[60px]",
          isDark ? "bg-blue-500/20" : "bg-green-400/20"
        )}
        animate={{ 
          opacity: [0.15, 0.3, 0.15],
          scale: [0.98, 1.02, 0.98]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              "absolute w-1 h-1 rounded-full",
              isDark ? "bg-blue-300/40" : "bg-green-500/40"
            )}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * -100 - 50],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0, 0.8, 0],
              scale: [0, Math.random() * 3 + 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main card container with 3D effect */}
      <motion.div
        className="relative z-10 w-full max-w-md mx-auto"
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1000,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Card glow effect */}
        <motion.div
          className={cn(
            "absolute -inset-0.5 rounded-2xl bg-gradient-to-r opacity-30 blur-xl",
            isDark 
              ? "from-blue-600 to-blue-400" 
              : "from-green-500 to-green-400"
          )}
          animate={{
            opacity: [0.2, 0.3, 0.2],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Card content */}
        <motion.div
          className={cn(
            "relative overflow-hidden backdrop-blur-sm rounded-2xl",
            isDark 
              ? "bg-black/40 border border-white/10" 
              : "bg-white/90 border border-green-100/50 shadow-lg"
          )}
          whileHover={{
            boxShadow: isDark 
              ? "0 0 40px 5px rgba(59, 130, 246, 0.15)" 
              : "0 0 40px 5px rgba(34, 197, 94, 0.15)"
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Card inner content */}
          <div className="p-6 md:p-8">
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-2 text-center">
                <motion.div
                  className={cn(
                    "mx-auto w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center",
                    isDark 
                      ? "from-blue-500 to-blue-700" 
                      : "from-green-400 to-green-600"
                  )}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <User className="w-6 h-6 text-white" />
                </motion.div>
                <motion.h1
                  className={cn(
                    "text-xl font-bold tracking-tight",
                    isDark ? "text-white" : "text-gray-800"
                  )}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Create your account
                </motion.h1>
                <motion.p
                  className={cn(
                    "text-sm",
                    isDark ? "text-white/60" : "text-gray-600"
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Join our community and start sharing food today
                </motion.p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label htmlFor="firstName" className={cn(
                      "text-xs font-medium",
                      isDark ? "text-white/70" : "text-gray-700"
                    )}>
                      First Name
                    </label>
                    <div className="relative">
                      <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className={cn(
                          "h-10 w-full",
                          isDark 
                            ? "bg-white/5 border-white/10 text-white placeholder:text-white/30" 
                            : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400",
                          errors.firstName 
                            ? "border-red-500" 
                            : isDark ? "focus:border-blue-500" : "focus:border-green-500"
                        )}
                        onFocus={() => setFocusedInput("firstName")}
                        onBlur={() => setFocusedInput(null)}
                        disabled={isLoading}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>
                      )}
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label htmlFor="lastName" className={cn(
                      "text-xs font-medium",
                      isDark ? "text-white/70" : "text-gray-700"
                    )}>
                      Last Name
                    </label>
                    <div className="relative">
                      <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className={cn(
                          "h-10 w-full",
                          isDark 
                            ? "bg-white/5 border-white/10 text-white placeholder:text-white/30" 
                            : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400",
                          errors.lastName 
                            ? "border-red-500" 
                            : isDark ? "focus:border-blue-500" : "focus:border-green-500"
                        )}
                        onFocus={() => setFocusedInput("lastName")}
                        onBlur={() => setFocusedInput(null)}
                        disabled={isLoading}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label htmlFor="username" className={cn(
                    "text-xs font-medium",
                    isDark ? "text-white/70" : "text-gray-700"
                  )}>
                    Username
                  </label>
                  <div className="relative">
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="johndoe"
                      className={cn(
                        "h-10 w-full",
                        isDark 
                          ? "bg-white/5 border-white/10 text-white placeholder:text-white/30" 
                          : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400",
                        errors.username 
                          ? "border-red-500" 
                          : isDark ? "focus:border-blue-500" : "focus:border-green-500"
                      )}
                      onFocus={() => setFocusedInput("username")}
                      onBlur={() => setFocusedInput(null)}
                      disabled={isLoading}
                    />
                    {errors.username && (
                      <p className="mt-1 text-xs text-red-400">{errors.username}</p>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className={cn(
                    "text-xs font-medium",
                    isDark ? "text-white/70" : "text-gray-700"
                  )}>
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      className={cn(
                        "h-10 w-full",
                        isDark 
                          ? "bg-white/5 border-white/10 text-white placeholder:text-white/30" 
                          : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400",
                        errors.password 
                          ? "border-red-500" 
                          : isDark ? "focus:border-blue-500" : "focus:border-green-500"
                      )}
                      onFocus={() => setFocusedInput("password")}
                      onBlur={() => setFocusedInput(null)}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className={cn(
                        "absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors",
                        isDark 
                          ? "text-white/50 hover:text-white/80" 
                          : "text-gray-500 hover:text-gray-700"
                      )}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-400">{errors.password}</p>
                    )}
                    <div className="mt-2">
                      <div className={cn(
                        "h-1 rounded-full overflow-hidden",
                        isDark ? "bg-white/10" : "bg-gray-200"
                      )}>
                        <div
                          className={`h-full ${getStrengthColor(passwordStrength)}`}
                          style={{ width: `${(passwordStrength / 4) * 100}%` }}
                        ></div>
                      </div>
                      <p className={cn(
                        "text-xs mt-1",
                        isDark ? "text-white/40" : "text-gray-500"
                      )}>
                        Password strength: {getStrengthText(passwordStrength)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className={cn(
                    "text-xs font-medium",
                    isDark ? "text-white/70" : "text-gray-700"
                  )}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={cn(
                        "h-10 w-full",
                        isDark 
                          ? "bg-white/5 border-white/10 text-white placeholder:text-white/30" 
                          : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400",
                        errors.confirmPassword 
                          ? "border-red-500" 
                          : isDark ? "focus:border-blue-500" : "focus:border-green-500"
                      )}
                      onFocus={() => setFocusedInput("confirmPassword")}
                      onBlur={() => setFocusedInput(null)}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className={cn(
                        "absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors",
                        isDark 
                          ? "text-white/50 hover:text-white/80" 
                          : "text-gray-500 hover:text-gray-700"
                      )}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* ZIP Code */}
                <div className="space-y-2">
                  <label htmlFor="zipCode" className={cn(
                    "text-xs font-medium",
                    isDark ? "text-white/70" : "text-gray-700"
                  )}>
                    ZIP/Postal Code
                  </label>
                  <div className="relative">
                    <div className={cn(
                      "absolute left-3 top-1/2 transform -translate-y-1/2",
                      isDark ? "text-white/50" : "text-gray-500"
                    )}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <Input
                      id="zipCode"
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="90210"
                      className={cn(
                        "h-10 w-full pl-10",
                        isDark 
                          ? "bg-white/5 border-white/10 text-white placeholder:text-white/30" 
                          : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400",
                        errors.zipCode 
                          ? "border-red-500" 
                          : isDark ? "focus:border-blue-500" : "focus:border-green-500"
                      )}
                      onFocus={() => setFocusedInput("zipCode")}
                      onBlur={() => setFocusedInput(null)}
                      disabled={isLoading}
                    />
                    {errors.zipCode && (
                      <p className="mt-1 text-xs text-red-400">{errors.zipCode}</p>
                    )}
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3">
                  <div className="flex items-center h-5">
                    <input
                      id="agreeTerms"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="text-sm">
                    <label htmlFor="agreeTerms" className={cn(
                      "text-xs",
                      isDark ? "text-white/70" : "text-gray-700"
                    )}>
                      I agree to the{" "}
                      <Link href="/terms" className={cn(
                        isDark ? "text-blue-400 hover:text-blue-300" : "text-green-600 hover:text-green-700"
                      )}>
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className={cn(
                        isDark ? "text-blue-400 hover:text-blue-300" : "text-green-600 hover:text-green-700"
                      )}>
                        Privacy Policy
                      </Link>
                    </label>
                    {errors.agreeTerms && (
                      <p className="mt-1 text-xs text-red-400">{errors.agreeTerms}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full group/button overflow-hidden"
                >
                  <div className={cn(
                    "absolute inset-0 rounded-lg opacity-100",
                    isDark 
                      ? "bg-gradient-to-r from-blue-700 to-blue-600" 
                      : "bg-gradient-to-r from-green-700 to-green-600"
                  )} />
                  
                  {/* Button shine effect */}
                  <motion.div 
                    className={cn(
                      "absolute inset-0 bg-gradient-to-r from-transparent to-transparent",
                      isDark ? "via-blue-400/20" : "via-green-400/20"
                    )}
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  />
                  
                  <div className="relative h-10 flex items-center justify-center text-white font-medium">
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center"
                        >
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Creating account...
                        </motion.div>
                      ) : (
                        <motion.span
                          key="button-text"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-1 text-sm font-medium"
                        >
                          Sign Up
                          <ArrowRight className="w-3 h-3 group-hover/button:translate-x-1 transition-transform duration-300" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>



                {/* Sign in link */}
                <motion.p 
                  className={cn(
                    "text-center text-xs mt-4",
                    isDark ? "text-white/60" : "text-gray-600"
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Already have an account?{' '}
                  <Link 
                    href="/auth?tab=login" 
                    className="relative inline-block group/signin"
                  >
                    <span className={cn(
                      "relative z-10 transition-colors duration-300 font-medium",
                      isDark 
                        ? "text-white group-hover/signin:text-white/70" 
                        : "text-green-600 group-hover/signin:text-green-700"
                    )}>
                      Sign in
                    </span>
                    <span className={cn(
                      "absolute bottom-0 left-0 w-0 h-[1px] group-hover/signin:w-full transition-all duration-300",
                      isDark ? "bg-white" : "bg-green-600"
                    )} />
                  </Link>
                </motion.p>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
