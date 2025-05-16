import { Link } from "wouter";
import { FoodPost, FoodPostImage } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, CalendarDays, ImageIcon } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { ClaimButton } from "@/components/post/claim-button";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface PostCardProps {
  post: FoodPost;
}

export function PostCard({ post }: PostCardProps) {
  // Format dates for display
  const formattedDate = post.createdAt ? formatDistanceToNow(
    new Date(post.createdAt),
    { addSuffix: true }
  ) : 'Recently';

  // Calculate time until expiry
  const calculateExpiryTime = () => {
    if (!post.expiryTime) return "No expiry set";
    
    const expiryDate = new Date(post.expiryTime);
    const now = new Date();
    
    if (expiryDate < now) {
      return "Expired";
    }
    
    return `Expires ${formatDistanceToNow(expiryDate, { addSuffix: true })}`;
  };

  // Fetch post images
  const { data: postImages, isLoading: imagesLoading } = useQuery<FoodPostImage[]>({
    queryKey: [`/api/posts/${post.id}/images`],
    queryFn: async () => {
      const res = await fetch(`/api/posts/${post.id}/images`);
      if (!res.ok) throw new Error('Failed to fetch post images');
      return res.json();
    },
  });

  // Get the first image URL or use a placeholder
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (postImages && postImages.length > 0) {
      setImageUrl(postImages[0].imageUrl);
    }
  }, [postImages]);
  
  // Placeholder image when no images are available
  const defaultImage = post.type === 'donation' 
    ? "https://images.unsplash.com/photo-1592424002053-21f369ad7fdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    : "https://images.unsplash.com/photo-1546552768-9e3a5c5a8ffd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80";

  // Status colors and badges
  const getStatusColor = () => {
    switch (post.status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'claimed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Mapbox reverse geocoding for location name
  const [locationName, setLocationName] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  useEffect(() => {
    if (post.latitude && post.longitude) {
      setLocationLoading(true);
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${post.longitude},${post.latitude}.json?access_token=pk.eyJ1IjoibmFuaS0wMDciLCJhIjoiY21hYnppcDlrMjYwZzJ3c2JqOHdhYmVpbCJ9.f2Ok8ZFGgkuAJyIYlQZxNA&limit=1`)
        .then(res => res.json())
        .then(data => {
          if (data.features && data.features.length > 0) {
            setLocationName(data.features[0].place_name);
          } else {
            setLocationName(null);
          }
        })
        .catch(() => setLocationName(null))
        .finally(() => setLocationLoading(false));
    }
  }, [post.latitude, post.longitude]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-3px] border border-[#F0F0F0] dark:border-gray-700 group flex flex-col justify-between h-[320px]" style={{ pointerEvents: 'none' }}>
      <div className="flex flex-col h-full">
      <div className="relative">
        {imagesLoading ? (
          <div className="w-full h-36 bg-gray-200 dark:bg-gray-800 flex items-center justify-center transition-colors duration-300">
            <ImageIcon className="w-6 h-6 text-gray-400 dark:text-gray-500 animate-pulse transition-colors duration-300" />
          </div>
        ) : (
          <img 
            src={imageUrl || defaultImage} 
            alt={post.title} 
            className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        )}
          <div className="absolute top-2 right-2 z-10">
          <span 
            className={`
                text-xs font-montserrat font-semibold px-2 py-0.5 rounded-full shadow-sm transition-colors duration-300
              ${post.type === 'donation' 
                  ? 'bg-[hsl(210,80%,90%)] text-[hsl(210,80%,40%)] dark:bg-[hsl(210,80%,30%)] dark:text-[hsl(210,80%,90%)]' 
                  : 'bg-[#FFF3E0] text-[#FF9800] dark:bg-[#E65100] dark:text-[#FFE0B2]'}
            `}
          >
            {post.type === 'donation' ? 'Donation' : 'Request'}
            </span>
          </div>
      </div>

        <div className="p-3 flex flex-col gap-1 flex-grow">
          <div className="flex justify-between items-center">
            <h3 className="font-montserrat font-bold text-base text-[#222] dark:text-white leading-tight truncate transition-colors duration-300">
            <Link href={`/posts/${post.id}`} className="hover:text-[hsl(210,80%,45%)] dark:hover:text-[hsl(210,80%,75%)] transition-colors">
              {post.title}
            </Link>
          </h3>
        </div>
          <div className="flex items-center gap-1 text-[hsl(210,80%,45%)] dark:text-[hsl(210,80%,75%)] text-xs font-medium transition-colors duration-300">
            <MapPin className="inline-block w-3 h-3" />
            <span className="truncate" title={locationName || undefined}>
              {locationLoading ? 'Loading location...' : (locationName || 'Location unavailable')}
            </span>
          </div>
          <div className="border-t border-[#F0F0F0] dark:border-gray-800 my-1.5 transition-colors duration-300" />
          <p className="font-opensans text-xs text-[#424242] dark:text-gray-300 line-clamp-2 flex-grow transition-colors duration-300">
          {post.description}
        </p>
          <div className="flex flex-row items-center justify-between mt-1 text-[10px]">
            <span className="inline-flex items-center bg-[#FFF8E1] dark:bg-amber-900/20 text-[#FF9800] dark:text-amber-400 px-2 py-0.5 rounded-full font-medium transition-colors duration-300">
              <CalendarDays className="w-2.5 h-2.5 mr-1" />
              {calculateExpiryTime()}
            </span>
            <span className="flex items-center text-[#9E9E9E] dark:text-gray-400 transition-colors duration-300">
          <Clock className="w-2.5 h-2.5 mr-1" />
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-[#F8F9FA] dark:bg-gray-800 px-3 py-2 flex flex-col gap-1 border-t border-[#F0F0F0] dark:border-gray-700 transition-colors duration-300">
        {/* Rich claimed/completed message */}
        {post.status === 'claimed' && post.updatedAt && (
          <div className="flex items-center mb-1">
            <span className="inline-flex items-center text-xs font-medium text-[hsl(210,80%,30%)] dark:text-[hsl(210,80%,85%)] bg-[hsl(210,80%,95%)] dark:bg-[hsl(210,80%,20%)] rounded-md px-2 py-1 transition-colors duration-300">
              <Clock className="w-3 h-3 mr-1" />
              Claimed {format(new Date(post.updatedAt), 'MMM d')}
            </span>
          </div>
        )}
        {post.status === 'completed' && post.updatedAt && (
          <div className="flex items-center mb-1">
            <span className="inline-flex items-center text-xs font-medium text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 rounded-md px-2 py-1 transition-colors duration-300">
              <Clock className="w-3 h-3 mr-1" />
              Completed {format(new Date(post.updatedAt), 'MMM d')}
            </span>
          </div>
        )}
        <div>
          <ClaimButton post={post} />
        </div>
      </div>
    </div>
  );
}