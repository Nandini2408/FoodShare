import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { FoodPost, InsertClaim } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Gift, HandHelping, Loader2, Info } from "lucide-react";

interface ClaimButtonProps {
  post: FoodPost;
}

export function ClaimButton({ post }: ClaimButtonProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Check if the post belongs to the current user
  const isUsersPost = user?.id === post.userId;

  // Only allow claim if post is available
  const isClaimable = post.status === 'available';

  // Create claim mutation
  const createClaimMutation = useMutation({
    mutationFn: async () => {
      const claimData: Partial<InsertClaim> = {
        postId: post.id,
        claimerId: user?.id
      };
      
      const res = await apiRequest("POST", "/api/claims", claimData);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${post.id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/claims"] });
      toast({
        title: "Claim submitted!",
        description: post.type === "donation" 
          ? "Your claim has been submitted. You'll be notified when the donor responds." 
          : "Your response has been submitted. You'll be notified when the requester responds.",
      });
      setLocation(`/claims/${data.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit claim. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle claim button click
  const handleClaim = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in or create an account to claim this item.",
        variant: "destructive",
      });
      setLocation("/auth");
      return;
    }
    
    // If it's the user's own post, they can't claim it
    if (isUsersPost) {
      toast({
        title: "Cannot claim your own post",
        description: "You cannot claim your own post.",
        variant: "destructive",
      });
      return;
    }
    
    setShowConfirmDialog(true);
  };

  // Donation vs Request styling
  const buttonClassName = post.type === "donation"
    ? isUsersPost 
      ? "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed transition-colors duration-300"
      : "bg-[hsl(210,80%,85%)] dark:bg-[hsl(210,80%,30%)] text-[hsl(210,80%,30%)] dark:text-white hover:bg-[hsl(210,80%,75%)] dark:hover:bg-[hsl(210,80%,40%)] transition-colors duration-300"
    : isUsersPost
      ? "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed transition-colors duration-300"
      : "bg-[#42A5F5] dark:bg-[#1565c0] text-white hover:bg-[#1976D2] dark:hover:bg-[#0d47a1] transition-colors duration-300";
  
  const buttonIcon = post.type === "donation"
    ? <Gift className="h-4 w-4 mr-2" />
    : <HandHelping className="h-4 w-4 mr-2" />;
  
  const buttonText = post.type === "donation"
    ? isUsersPost ? "Your Donation" : "Claim This Item"
    : isUsersPost ? "Your Request" : "Respond to Request";

  const button = (
    <Button 
      className={`${buttonClassName} text-xs py-1.5 h-auto`}
      onClick={handleClaim}
      disabled={createClaimMutation.isPending || isUsersPost || !isClaimable}
      style={{ cursor: 'pointer', pointerEvents: 'auto' }}
    >
      {createClaimMutation.isPending ? (
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
      ) : (
        <span className="w-3 h-3 mr-1">{buttonIcon}</span>
      )}
      {buttonText}
      {isUsersPost && <Info className="h-3 w-3 ml-1" />}
    </Button>
  );

  return (
    <>
      {!isClaimable && (
        <div className="mb-1">
          <span className={`inline-block px-2 py-0.5 text-[10px] rounded-md font-medium transition-colors duration-300 ${
            post.status === 'claimed' ? 'bg-[hsl(210,80%,95%)] dark:bg-[hsl(210,80%,20%)] text-[hsl(210,80%,30%)] dark:text-[hsl(210,80%,85%)]' :
            post.status === 'completed' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
            'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}>
            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
          </span>
        </div>
      )}
      {isUsersPost ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {button}
            </TooltipTrigger>
            <TooltipContent>
              <p>You cannot claim your own {post.type === "donation" ? "donation" : "request"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        button
      )}

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {post.type === "donation" ? "Claim this item?" : "Respond to this request?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {post.type === "donation" 
                ? "By claiming this item, you're committing to pick it up during the specified pickup window. The donor will be notified of your claim." 
                : "By responding to this request, you're offering to provide the requested item. The requester will be notified of your response."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonClassName}
              onClick={() => createClaimMutation.mutate()}
              disabled={createClaimMutation.isPending}
            >
              {createClaimMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}