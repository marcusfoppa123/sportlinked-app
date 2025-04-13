
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Share2, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ContentFeedCard from "./ContentFeedCard";
import ProfileCard from "./ProfileCard";
import ImageModal from "./ImageModal";
import AthleteProfileModal from "./AthleteProfileModal";

// Mock data for athlete suggestions
const suggestedAthletes = [
  {
    id: "a1",
    name: "Alex Thompson",
    role: "athlete" as UserRole,
    profilePic: "",
    sport: "Basketball",
    position: "Center",
    stats: { "PPG": "18.7", "RPG": "12.3", "BPG": "2.8" },
    location: "Chicago, IL",
    experience: "College",
    about: "Center with strong defensive skills and developing post moves. Looking to improve my shooting range.",
    achievements: ["All-Conference First Team 2023", "Defensive Player of the Year 2022"]
  },
  {
    id: "a2",
    name: "Maria Garcia",
    role: "athlete" as UserRole,
    profilePic: "",
    sport: "Volleyball",
    position: "Outside Hitter",
    stats: { "Kills": "285", "Blocks": "42", "Aces": "37" },
    location: "San Diego, CA",
    experience: "College",
    about: "Outside hitter with 4 years of college experience. Strong all-around player with excellent serving and defense.",
    achievements: ["NCAA Tournament Qualifier 2023", "Team Captain"]
  },
  {
    id: "a3",
    name: "Jamal Wilson",
    role: "athlete" as UserRole,
    profilePic: "",
    sport: "Basketball",
    position: "Small Forward",
    stats: { "PPG": "16.5", "RPG": "5.7", "SPG": "1.9" },
    location: "Atlanta, GA",
    experience: "College",
    about: "Athletic wing player with good defensive instincts and improving three-point shot.",
    achievements: ["Rising Stars Invitational MVP", "Conference All-Defensive Team"]
  },
  {
    id: "a4",
    name: "Emma Rodriguez",
    role: "athlete" as UserRole,
    profilePic: "",
    sport: "Soccer",
    position: "Goalkeeper",
    stats: { "Clean Sheets": "14", "Saves": "87", "Save %": "83%" },
    location: "Portland, OR",
    experience: "Professional",
    about: "Professional goalkeeper with quick reflexes and excellent command of the box.",
    achievements: ["League Best Goalkeeper 2023", "National Team Call-up"]
  }
];

// Mock data for the feed
const initialPosts = [
  {
    id: "1",
    user: {
      id: "a1",
      name: "Michael Johnson",
      role: "athlete",
      profilePic: ""
    },
    sport: "Basketball",
    position: "Shooting Guard",
    content: {
      text: "Just broke my career high with 38 points last night! 🏀🔥 Check out the highlights!",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2070&auto=format&fit=crop",
      video: ""
    },
    stats: {
      likes: 128,
      comments: 24,
      shares: 15
    },
    timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    userLiked: false,
    userBookmarked: false
  },
  {
    id: "2",
    user: {
      id: "a2",
      name: "Sarah Williams",
      role: "athlete",
      profilePic: ""
    },
    sport: "Soccer",
    position: "Forward",
    content: {
      text: "Perfect free kick at practice today. Working on consistency for the upcoming tournament next month. Any scouts in the New York area should come check out our game on the 15th!",
      image: "",
      video: ""
    },
    stats: {
      likes: 95,
      comments: 12,
      shares: 8
    },
    timestamp: new Date(Date.now() - 3600000 * 5), // 5 hours ago
    userLiked: false,
    userBookmarked: false
  },
  {
    id: "3",
    user: {
      id: "a3",
      name: "Carlos Rodriguez",
      role: "athlete",
      profilePic: ""
    },
    sport: "Baseball",
    position: "Pitcher",
    content: {
      text: "New personal best! 98 mph fastball during today's training session. 🔥⚾",
      image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop",
      video: ""
    },
    stats: {
      likes: 211,
      comments: 43,
      shares: 29
    },
    timestamp: new Date(Date.now() - 3600000 * 24), // 1 day ago
    userLiked: false,
    userBookmarked: false
  }
];

interface AthleteContentProps {
  filterSport?: string;
  contentType?: "posts" | "profiles";
}

const AthleteContent = ({ filterSport, contentType = "posts" }: AthleteContentProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [postsData, setPostsData] = useState(initialPosts);
  const [displayedAthletes, setDisplayedAthletes] = useState(4);
  const [selectedAthlete, setSelectedAthlete] = useState<(typeof suggestedAthletes)[0] | null>(null);
  const [postText, setPostText] = useState("");
  
  const filteredPosts = filterSport 
    ? postsData.filter(post => post.sport?.toLowerCase() === filterSport.toLowerCase())
    : postsData;

  const handleNewPost = () => {
    if (!postText.trim()) return;
    
    const newPost = {
      id: `post-${Date.now()}`,
      user: {
        id: user?.id || "current-user",
        name: user?.name || "You",
        role: user?.role || "athlete",
        profilePic: user?.profilePic
      },
      sport: user?.sport || "Basketball",
      position: user?.position || "Player",
      content: {
        text: postText,
        image: "",
        video: ""
      },
      stats: {
        likes: 0,
        comments: 0,
        shares: 0
      },
      timestamp: new Date(),
      userLiked: false,
      userBookmarked: false
    };
    
    setPostsData([newPost, ...postsData]);
    setPostText("");
  };

  const handleLike = (postId: string) => {
    // Toggle liked state
    const newLikedPosts = { ...likedPosts, [postId]: !likedPosts[postId] };
    setLikedPosts(newLikedPosts);
    
    // Update likes count
    setPostsData(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            stats: {
              ...post.stats,
              likes: likedPosts[postId] ? post.stats.likes - 1 : post.stats.likes + 1
            }
          };
        }
        return post;
      })
    );
  };

  const handleSeeMore = () => {
    setDisplayedAthletes(Math.min(displayedAthletes + 4, suggestedAthletes.length));
  };

  const handleViewProfile = (athlete: (typeof suggestedAthletes)[0]) => {
    setSelectedAthlete(athlete);
  };

  const handleCreatePostClick = () => {
    navigate("/create-post");
  };

  // Render profiles only (for Athletes page)
  if (contentType === "profiles") {
    return (
      <div className="space-y-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestedAthletes.map((athlete) => (
            <ProfileCard 
              key={athlete.id}
              user={{ name: athlete.name, role: athlete.role }} 
              sport={athlete.sport}
              position={athlete.position}
              onViewProfile={() => handleViewProfile(athlete)}
            />
          ))}
        </div>

        {/* Athlete profile modal */}
        {selectedAthlete && (
          <AthleteProfileModal
            isOpen={!!selectedAthlete}
            onClose={() => setSelectedAthlete(null)}
            athlete={selectedAthlete}
          />
        )}
      </div>
    );
  }

  // Render posts (for ForYou page)
  return (
    <div className="space-y-4 pb-16">
      {/* New post input */}
      {user?.role === "athlete" && (
        <Card className="athlete-card dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-blue-100">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <Input 
                placeholder="Share your latest highlights or stats..." 
                className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
              />
            </div>
            <div className="flex justify-between mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="dark:border-gray-600 dark:text-gray-300"
                onClick={handleCreatePostClick}
              >
                Photo/Video
              </Button>
              <Button 
                size="sm" 
                className="bg-athlete hover:bg-athlete/90"
                onClick={handleNewPost}
                disabled={!postText.trim()}
              >
                Post
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts feed */}
      {filteredPosts.map((post) => (
        <ContentFeedCard
          key={post.id}
          id={post.id}
          user={post.user}
          timestamp={post.timestamp}
          content={post.content}
          stats={post.stats}
          userLiked={likedPosts[post.id] || false}
          userBookmarked={false}
        />
      ))}

      {/* Image modal for expanded view */}
      {selectedImage && (
        <ImageModal 
          isOpen={!!selectedImage} 
          onClose={() => setSelectedImage(null)} 
          imageSrc={selectedImage} 
        />
      )}
    </div>
  );
};

export default AthleteContent;
