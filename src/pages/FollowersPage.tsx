import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import { getFollowers, getFollowing } from "@/integrations/supabase/modules/followers";
import { toast } from "@/components/ui/use-toast";

interface FollowUser {
  id: string;
  full_name: string;
  avatar_url: string;
  role: string;
}

const FollowersPage = () => {
  const { userId, type } = useParams<{ userId: string; type: 'followers' | 'following' }>();
  const navigate = useNavigate();
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isFollowersPage = type === 'followers';
  const pageTitle = isFollowersPage ? 'Followers' : 'Following';

  useEffect(() => {
    const fetchUsers = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        const { data, error } = isFollowersPage 
          ? await getFollowers(userId)
          : await getFollowing(userId);
        
        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        toast({
          description: `Failed to load ${type}`,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [userId, type, isFollowersPage]);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  const handleUserClick = (id: string) => {
    navigate(`/user/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-full px-4 pt-8 pb-4 flex items-center border-b bg-white dark:bg-gray-900">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold ml-4">{pageTitle}</h1>
        </div>
        <div className="flex items-center justify-center pt-20">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full px-4 pt-8 pb-4 flex items-center border-b bg-white dark:bg-gray-900">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold ml-4">{pageTitle}</h1>
      </div>
      
      <div className="container px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {users.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400">
                No {type} yet
              </p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border"
                onClick={() => handleUserClick(user.id)}
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {user.full_name || 'Unknown User'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersPage;