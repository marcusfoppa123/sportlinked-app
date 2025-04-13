
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ContentFeedCard from "@/components/ContentFeedCard";
import BottomNavigation from "@/components/BottomNavigation";

// Mock saved posts data
const mockSavedPosts = [
  {
    id: "post1",
    user: {
      id: "user1",
      name: "Alex Johnson",
      role: "athlete",
      profilePic: "",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    content: {
      text: "Just had an amazing practice session today. Working on my three-point shots has really paid off!",
      image: "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    stats: {
      likes: 123,
      comments: 15,
      shares: 5,
    },
    userLiked: true,
    userBookmarked: true,
  },
  {
    id: "post2",
    user: {
      id: "user2",
      name: "Michigan Tigers",
      role: "team",
      profilePic: "",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    content: {
      text: "We're excited to announce open tryouts for the upcoming season! If you think you have what it takes, sign up through the link in our bio.",
    },
    stats: {
      likes: 89,
      comments: 32,
      shares: 12,
    },
    userLiked: false,
    userBookmarked: true,
  },
  {
    id: "post3",
    user: {
      id: "user3",
      name: "Sarah Williams",
      role: "athlete",
      profilePic: "",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    content: {
      text: "New personal best today! So proud of the progress I've been making.",
      image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    stats: {
      likes: 156,
      comments: 23,
      shares: 7,
    },
    userLiked: true,
    userBookmarked: true,
  },
  {
    id: "post4",
    user: {
      id: "user4",
      name: "Elite Scout Network",
      role: "scout",
      profilePic: "",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 48 hours ago
    content: {
      text: "What qualities do you look for in a point guard? Comment below 👇",
      image: "https://images.unsplash.com/photo-1518650451241-a7ceeac45fe9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    stats: {
      likes: 67,
      comments: 45,
      shares: 2,
    },
    userLiked: false,
    userBookmarked: true,
  },
];

const SavedItems = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const isAthlete = user?.role === "athlete";
  
  // Function to render saved post in grid view
  const renderSavedPostCard = (post) => {
    return (
      <Card key={post.id} className="overflow-hidden h-full flex flex-col dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-3 flex flex-col h-full">
          <div className="flex items-center space-x-2 mb-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.user.profilePic} />
              <AvatarFallback className="text-xs">
                {post.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium truncate dark:text-white">{post.user.name}</span>
          </div>
          
          {post.content.image && (
            <div className="relative pt-[100%] bg-gray-100 dark:bg-gray-700 rounded overflow-hidden mb-2">
              <img 
                src={post.content.image} 
                alt="Post" 
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            </div>
          )}
          
          <p className="text-xs line-clamp-2 mb-2 dark:text-gray-300">{post.content.text}</p>
          
          <div className="mt-auto flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{post.stats.likes} likes</span>
            <span>{post.stats.comments} comments</span>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className={`min-h-screen pb-16 ${isAthlete ? "athlete-theme" : "scout-theme"}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-border shadow-sm">
        <div className="container px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold dark:text-white">Saved Items</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 py-4">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="mb-4 dark:bg-gray-800">
            <TabsTrigger value="posts" className="dark:text-gray-300 dark:data-[state=active]:text-white">Posts</TabsTrigger>
            <TabsTrigger value="profiles" className="dark:text-gray-300 dark:data-[state=active]:text-white">Profiles</TabsTrigger>
            <TabsTrigger value="videos" className="dark:text-gray-300 dark:data-[state=active]:text-white">Videos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts">
            {mockSavedPosts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {mockSavedPosts.map(post => renderSavedPostCard(post))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No saved posts yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Bookmark posts to save them for later
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="profiles">
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No saved profiles yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Save athlete or scout profiles to view them later
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="videos">
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No saved videos yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Save videos from posts to watch them later
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SavedItems;
