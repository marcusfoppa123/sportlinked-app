
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Share2, MoreHorizontal } from "lucide-react";
import ProfileCard from "./ProfileCard";
import ImageModal from "./ImageModal";
import AthleteProfileModal from "./AthleteProfileModal";

// Mock data for athlete suggestions
const suggestedAthletes = [
  {
    id: "a1",
    name: "Alex Thompson",
    role: "athlete",
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
    role: "athlete",
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
    role: "athlete",
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
    role: "athlete",
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
const mockPosts = [
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
    content: "Just broke my career high with 38 points last night! 🏀🔥 Check out the highlights!",
    media: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2070&auto=format&fit=crop",
    likes: 128,
    comments: 24,
    time: "2h ago"
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
    content: "Perfect free kick at practice today. Working on consistency for the upcoming tournament next month. Any scouts in the New York area should come check out our game on the 15th!",
    media: "",
    likes: 95,
    comments: 12,
    time: "5h ago"
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
    content: "New personal best! 98 mph fastball during today's training session. 🔥⚾",
    media: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop",
    likes: 211,
    comments: 43,
    time: "1d ago"
  }
];

interface AthleteContentProps {
  filterSport?: string;
}

const AthleteContent = ({ filterSport }: AthleteContentProps) => {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [postsData, setPostsData] = useState(mockPosts);
  const [displayedAthletes, setDisplayedAthletes] = useState(2);
  const [selectedAthlete, setSelectedAthlete] = useState<(typeof suggestedAthletes)[0] | null>(null);
  
  const filteredPosts = filterSport 
    ? postsData.filter(post => post.sport.toLowerCase() === filterSport.toLowerCase())
    : postsData;

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
            likes: likedPosts[postId] ? post.likes - 1 : post.likes + 1
          };
        }
        return post;
      })
    );
  };

  const handleSeeMore = () => {
    setDisplayedAthletes(Math.min(displayedAthletes + 2, suggestedAthletes.length));
  };

  const handleViewProfile = (athlete: (typeof suggestedAthletes)[0]) => {
    setSelectedAthlete(athlete);
  };

  return (
    <div className="space-y-4 pb-16">
      {/* New post input */}
      <Card className="athlete-card">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-blue-100">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <Input 
              placeholder="Share your latest highlights or stats..." 
              className="flex-1"
            />
          </div>
          <div className="flex justify-between mt-4">
            <Button variant="outline" size="sm">Photo/Video</Button>
            <Button size="sm" className="bg-athlete hover:bg-athlete/90">Post</Button>
          </div>
        </CardContent>
      </Card>

      {/* Athlete suggestions */}
      <Card className="athlete-card">
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold">Athletes to follow</h3>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestedAthletes.slice(0, displayedAthletes).map((athlete) => (
              <ProfileCard 
                key={athlete.id}
                user={{ name: athlete.name, role: athlete.role }} 
                sport={athlete.sport}
                position={athlete.position}
                onViewProfile={() => handleViewProfile(athlete)}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          {displayedAthletes < suggestedAthletes.length ? (
            <Button 
              variant="link" 
              className="w-full text-athlete"
              onClick={handleSeeMore}
            >
              See More
            </Button>
          ) : (
            <Button 
              variant="link" 
              className="w-full text-athlete"
              onClick={() => setDisplayedAthletes(2)}
            >
              Show Less
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Posts feed */}
      {filteredPosts.map((post) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="athlete-card">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-blue-100">
                      {post.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{post.user.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{post.sport} • {post.position}</span>
                      <span className="mx-1">•</span>
                      <span>{post.time}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pb-3">
              <p className="text-sm mb-3">{post.content}</p>
              {post.media && (
                <div 
                  className="rounded-md overflow-hidden cursor-pointer transition-transform hover:opacity-95"
                  onClick={() => setSelectedImage(post.media)}
                >
                  <img 
                    src={post.media} 
                    alt="Post media" 
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
            </CardContent>
            
            <CardFooter className="pt-0 flex-col">
              <div className="flex items-center w-full text-sm text-gray-500 mb-2">
                <span>{post.likes} likes</span>
                <span className="mx-2">•</span>
                <span>{post.comments} comments</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between w-full pt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleLike(post.id)}
                >
                  <Heart 
                    className={`mr-1 h-4 w-4 ${likedPosts[post.id] ? 'fill-red-500 text-red-500' : ''}`} 
                  />
                  {likedPosts[post.id] ? 'Liked' : 'Like'}
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  <MessageSquare className="mr-1 h-4 w-4" />
                  Comment
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  <Share2 className="mr-1 h-4 w-4" />
                  Share
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}

      {/* Image modal for expanded view */}
      {selectedImage && (
        <ImageModal 
          isOpen={!!selectedImage} 
          onClose={() => setSelectedImage(null)} 
          imageSrc={selectedImage} 
        />
      )}

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
};

export default AthleteContent;
