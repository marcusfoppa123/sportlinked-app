
import React from "react";
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
  
  const filteredPosts = filterSport 
    ? mockPosts.filter(post => post.sport.toLowerCase() === filterSport.toLowerCase())
    : mockPosts;

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
            <ProfileCard 
              user={{ name: "Alex Thompson", role: "athlete" }} 
              sport="Basketball"
              position="Center"
            />
            <ProfileCard 
              user={{ name: "Maria Garcia", role: "athlete" }} 
              sport="Volleyball"
              position="Outside Hitter"
            />
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button variant="link" className="w-full text-athlete">See More</Button>
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
                <div className="rounded-md overflow-hidden">
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
                <Button variant="ghost" size="sm" className="flex-1">
                  <Heart className="mr-1 h-4 w-4" />
                  Like
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
    </div>
  );
};

export default AthleteContent;
