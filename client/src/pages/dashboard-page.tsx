import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Package, HandHeart, Star, Clock, PlusCircle, MessageCircle, Calendar, Settings, AlertTriangle, CheckCircle2, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ClaimStatus } from "@shared/schema";

export default function DashboardPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Fetch user's activity data
  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ["/api/users", user?.id, "activity"],
    queryFn: async () => {
      if (!user?.id) return null;
      const res = await apiRequest("GET", `/api/users/${user.id}/activity`);
      return await res.json();
    },
    enabled: !!user?.id,
  });

  // Mock data for development - will be replaced with real API data
  const mockActivityData = {
    donationsMade: 12,
    donationsReceived: 8,
    activeListings: 3,
    averageRating: 4.7,
    totalRatings: 23
  };

  // Use real data if available, otherwise use mock data
  const data = activityData || mockActivityData;

  // Copy of ClaimCard and helpers from claims-page.tsx
  function getStatusBadgeVariant(status: ClaimStatus) {
    switch (status) {
      case "pending":
        return "outline";
      case "approved":
        return "secondary";
      case "rejected":
        return "destructive";
      case "cancelled":
        return "outline";
      case "completed":
        return "default";
      default:
        return "outline";
    }
  }

  function getStatusText(status: ClaimStatus) {
    switch (status) {
      case "pending":
        return "Pending Approval";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "cancelled":
        return "Cancelled";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  }

  function ClaimCard({ claim, type }: { claim: any; type: 'my-claim' | 'post-claim' }) {
    const { toast } = useToast();
    const { user } = useAuth();
    const updateClaimMutation = useMutation({
      mutationFn: async ({ status }: { status: ClaimStatus }) => {
        const res = await apiRequest("PATCH", `/api/claims/${claim.id}`, { status });
        return await res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/claims"] });
        queryClient.invalidateQueries({ queryKey: ["/api/posts/claims"] });
        toast({
          title: "Claim updated",
          description: "The claim status has been updated successfully.",
        });
      },
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to update claim",
          variant: "destructive",
        });
      },
    });
    const handleApprove = () => updateClaimMutation.mutate({ status: "approved" });
    const handleReject = () => updateClaimMutation.mutate({ status: "rejected" });
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle>
              {type === 'my-claim' ? 'Claim for ' : 'Claim by '}
              <span className="font-normal">{claim.post?.title || 'Loading...'}</span>
            </CardTitle>
            <Badge variant={getStatusBadgeVariant(claim.status as ClaimStatus)}>
              {getStatusText(claim.status as ClaimStatus)}
            </Badge>
          </div>
          <CardDescription>
            {type === 'my-claim'
              ? 'Your request to claim this item'
              : `A user wants to claim your ${claim.post?.type === 'donation' ? 'donation' : 'requested item'}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium">Note:</p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {claim.message || "No note provided"}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Created on {format(new Date(claim.createdAt), 'PPp')}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {type === 'post-claim' && claim.status === 'pending' && (
            <div className="flex w-full space-x-2 mb-2">
              <Button 
                variant="default" 
                className="flex-1" 
                onClick={handleApprove}
                disabled={updateClaimMutation.isPending}
              >
                {updateClaimMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : 'Approve'}
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1" 
                onClick={handleReject}
                disabled={updateClaimMutation.isPending}
              >
                {updateClaimMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : 'Reject'}
              </Button>
            </div>
          )}
          <Link href={`/claims/${claim.id}`} className="w-full">
            <Button variant="outline" className="w-full">View Details</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  // Fetch user's claims
  const { data: myClaims, isLoading: myClaimsLoading } = useQuery({
    queryKey: ["/api/claims"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/claims");
      return await res.json();
    },
    enabled: !!user,
  });

  if (activityLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900 transition-colors duration-300">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(210,80%,55%)] dark:text-[hsl(210,80%,75%)] transition-colors duration-300" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | FoodShare</title>
        <meta 
          name="description" 
          content="View your FoodShare activity, manage your listings, and find new opportunities to share food in your community."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="font-montserrat font-bold text-3xl md:text-4xl text-[hsl(210,80%,45%)] dark:text-[hsl(210,80%,75%)] mb-8 transition-colors duration-300">
          Dashboard
        </h1>

        {/* User Activity Summary Section */}
        <section className="mb-10">
          <h2 className="font-montserrat font-semibold text-xl text-[hsl(20,14.3%,20%)] dark:text-white mb-4 transition-colors duration-300">
            Activity Summary
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Donations Made Card */}
            <Card className={`border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} rounded-xl shadow-md overflow-hidden transition-colors duration-300`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Donations Made
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'} transition-colors duration-300`}>
                    <HandHeart className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'} transition-colors duration-300`} />
                  </div>
                  <div className="ml-4">
                    <div className="font-bold text-2xl text-[hsl(210,80%,45%)] dark:text-[hsl(210,80%,75%)] transition-colors duration-300">
                      {data.donationsMade}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                      Total shared
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Donations Received Card */}
            <Card className={`border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} rounded-xl shadow-md overflow-hidden transition-colors duration-300`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Donations Received
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${isDark ? 'bg-green-900/30' : 'bg-green-100'} transition-colors duration-300`}>
                    <Package className={`h-5 w-5 ${isDark ? 'text-green-400' : 'text-green-600'} transition-colors duration-300`} />
                  </div>
                  <div className="ml-4">
                    <div className="font-bold text-2xl text-[hsl(142,76%,36%)] dark:text-[hsl(142,76%,56%)] transition-colors duration-300">
                      {data.donationsReceived}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                      Total received
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Listings Card */}
            <Card className={`border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} rounded-xl shadow-md overflow-hidden transition-colors duration-300`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Active Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'} transition-colors duration-300`}>
                    <Clock className={`h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-600'} transition-colors duration-300`} />
                  </div>
                  <div className="ml-4">
                    <div className="font-bold text-2xl text-[hsl(265,83%,45%)] dark:text-[hsl(265,83%,65%)] transition-colors duration-300">
                      {data.activeListings}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                      Current active
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rating Overview Card */}
            <Card className={`border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} rounded-xl shadow-md overflow-hidden transition-colors duration-300`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Rating Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${isDark ? 'bg-amber-900/30' : 'bg-amber-100'} transition-colors duration-300`}>
                    <Star className={`h-5 w-5 ${isDark ? 'text-amber-400' : 'text-amber-600'} transition-colors duration-300`} />
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <div className="font-bold text-2xl text-amber-500 dark:text-amber-400 transition-colors duration-300">
                        {data.averageRating}
                      </div>
                      <div className="flex ml-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < Math.floor(data.averageRating) 
                              ? 'text-amber-500 fill-amber-500' 
                              : i < data.averageRating 
                                ? 'text-amber-500 fill-amber-500 opacity-50' 
                                : 'text-gray-300 dark:text-gray-600'} transition-colors duration-300`} 
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                      From {data.totalRatings} ratings
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Actions Panel Section */}
        <section className="mb-10">
          <h2 className="font-montserrat font-semibold text-xl text-[hsl(20,14.3%,20%)] dark:text-white mb-4 transition-colors duration-300">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Post New Donation Button */}
            <Link href="/posts/new?type=donation">
              <Button 
                className={`w-full h-20 flex items-center justify-center gap-3 rounded-xl shadow-md ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors duration-300`}
              >
                <PlusCircle className="h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span className="font-semibold">Post Donation</span>
                  <span className="text-xs opacity-80">Share food with others</span>
                </div>
              </Button>
            </Link>

            {/* Post New Request Button */}
            <Link href="/posts/new?type=request">
              <Button 
                className={`w-full h-20 flex items-center justify-center gap-3 rounded-xl shadow-md ${isDark ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors duration-300`}
              >
                <PlusCircle className="h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span className="font-semibold">Post Request</span>
                  <span className="text-xs opacity-80">Ask for what you need</span>
                </div>
              </Button>
            </Link>

            {/* View My Claims Button */}
            <Link href="/claims">
              <Button 
                className={`w-full h-20 flex items-center justify-center gap-3 rounded-xl shadow-md ${isDark ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white transition-colors duration-300`}
              >
                <Calendar className="h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span className="font-semibold">My Claims</span>
                  <span className="text-xs opacity-80">View items you've claimed</span>
                </div>
              </Button>
            </Link>

            {/* View Messages Button */}
            <Link href="/notifications">
              <Button 
                className={`w-full h-20 flex items-center justify-center gap-3 rounded-xl shadow-md ${isDark ? 'bg-amber-600 hover:bg-amber-700' : 'bg-amber-500 hover:bg-amber-600'} text-white transition-colors duration-300`}
              >
                <MessageCircle className="h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span className="font-semibold">Messages</span>
                  <span className="text-xs opacity-80">Check your notifications</span>
                </div>
              </Button>
            </Link>
          </div>
        </section>

        {/* My Claims Section */}
        <section className="mb-10">
          <h2 className="font-montserrat font-semibold text-xl text-[hsl(20,14.3%,20%)] dark:text-white mb-4 transition-colors duration-300">
            My Claims
          </h2>
          {myClaimsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : myClaims?.length > 0 ? (
            <div className="space-y-4">
              {myClaims.map((claim: any) => (
                <ClaimCard key={claim.id} claim={claim} type="my-claim" />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border rounded-lg">
              <h3 className="text-xl font-medium mb-2">No Claims Yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't claimed any items yet. Browse the available items and make a claim!
              </p>
              <Button asChild>
                <Link href="/feed">Browse Food Posts</Link>
              </Button>
            </div>
          )}
        </section>

        {/* Status Tracking Section */}
        <section className="mb-10">
          <h2 className="font-montserrat font-semibold text-xl text-[hsl(20,14.3%,20%)] dark:text-white mb-4 transition-colors duration-300">
            Status Tracking
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Pickups Card */}
            <Card className={`border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} rounded-xl shadow-md overflow-hidden transition-colors duration-300`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[hsl(210,80%,45%)] dark:text-[hsl(210,80%,75%)] transition-colors duration-300">
                  <Calendar className="h-5 w-5" />
                  Upcoming Pickups
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Items you need to pick up or provide soon
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Mock data for upcoming pickups */}
                {[
                  { id: 1, title: "Fresh Vegetables", type: "donation", status: "claimed", expiryDate: new Date(Date.now() + 86400000) },
                  { id: 2, title: "Canned Goods", type: "request", status: "claimed", expiryDate: new Date(Date.now() + 172800000) },
                ].length > 0 ? (
                  <ul className="space-y-3">
                    {[
                      { id: 1, title: "Fresh Vegetables", type: "donation", status: "claimed", expiryDate: new Date(Date.now() + 86400000) },
                      { id: 2, title: "Canned Goods", type: "request", status: "claimed", expiryDate: new Date(Date.now() + 172800000) },
                    ].map(item => (
                      <li key={item.id} className={`p-3 rounded-lg flex items-center justify-between ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors duration-300`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${item.type === 'donation' ? (isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600') : (isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600')} transition-colors duration-300`}>
                            {item.type === 'donation' ? <Package className="h-4 w-4" /> : <HandHeart className="h-4 w-4" />}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-300">{item.title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                              {item.type === 'donation' ? 'Pickup from donor' : 'Provide to requester'}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <Badge className={`${isDark ? 'bg-amber-700 hover:bg-amber-600' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'} transition-colors duration-300`}>
                            <Timer className="h-3 w-3 mr-1" />
                            {formatDistanceToNow(item.expiryDate, { addSuffix: true })}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
                            {format(item.expiryDate, 'MMM d, yyyy')}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No upcoming pickups scheduled</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Expiring Soon Card */}
            <Card className={`border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} rounded-xl shadow-md overflow-hidden transition-colors duration-300`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-500 dark:text-amber-400 transition-colors duration-300">
                  <AlertTriangle className="h-5 w-5" />
                  Expiring Soon
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Your posts that are about to expire
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Mock data for expiring posts */}
                {[
                  { id: 3, title: "Bread and Pastries", type: "donation", status: "active", expiryDate: new Date(Date.now() + 43200000) },
                  { id: 4, title: "Fresh Fruit", type: "donation", status: "active", expiryDate: new Date(Date.now() + 21600000) },
                ].length > 0 ? (
                  <ul className="space-y-3">
                    {[
                      { id: 3, title: "Bread and Pastries", type: "donation", status: "active", expiryDate: new Date(Date.now() + 43200000) },
                      { id: 4, title: "Fresh Fruit", type: "donation", status: "active", expiryDate: new Date(Date.now() + 21600000) },
                    ].map(item => (
                      <li key={item.id} className={`p-3 rounded-lg flex items-center justify-between ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors duration-300`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'} transition-colors duration-300`}>
                            <Clock className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-300">{item.title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                              {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <Badge className={`${isDark ? 'bg-red-700 hover:bg-red-600' : 'bg-red-100 text-red-800 hover:bg-red-200'} transition-colors duration-300`}>
                            Expires {formatDistanceToNow(item.expiryDate, { addSuffix: true })}
                          </Badge>
                          <Link href={`/posts/${item.id}`}>
                            <Button variant="link" className="text-xs p-0 h-auto mt-1 text-blue-500 dark:text-blue-400 transition-colors duration-300">
                              View Post
                            </Button>
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No posts expiring soon</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
