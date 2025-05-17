
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Edit, Bell, Send, Image, Paperclip, X, ArrowLeft, VolumeX } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMessageRequests } from "@/hooks/useMessageRequests";
import { supabase } from "@/integrations/supabase/client";
import {
  getUserConversations,
  getConversationMessages,
  sendMessage,
  checkMutualFollowForMessages,
} from "@/integrations/supabase/client";

const ACTION_WIDTH = 120; // px, width of the revealed action area

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobileDevice = useIsMobile();
  const isAthlete = user?.role === "athlete";
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [canMessage, setCanMessage] = useState(false);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [swipedConvoId, setSwipedConvoId] = useState(null);
  const [pinnedConversations, setPinnedConversations] = useState<string[]>(() => {
    const stored = localStorage.getItem('pinnedConversations');
    return stored ? JSON.parse(stored) : [];
  });
  const [mutedConversations, setMutedConversations] = useState<string[]>(() => {
    const stored = localStorage.getItem('mutedConversations');
    return stored ? JSON.parse(stored) : [];
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const TABS = ["All"];
  const [activeTab, setActiveTab] = useState("All");
  const { pendingRequests, sentRequests, loading, error, sendMessageRequest, respondToRequest } = useMessageRequests();
  const [profileCache, setProfileCache] = useState<Record<string, { name: string; avatar_url: string | null }>>({});
  const [unreadConversations, setUnreadConversations] = useState<string[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    setLoadingConvos(true);
    getUserConversations(user.id).then(({ data, error }) => {
      if (!error && data) {
        setConversations(data);
      }
      setLoadingConvos(false);
    });
  }, [user?.id]);

  useEffect(() => {
    if (!activeConversation) return;
    // Subscribe to real-time updates for messages in this conversation
    const channel = supabase.channel('messages-' + activeConversation.id)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${activeConversation.id}`
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
        setTimeout(() => {
          if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }, 100);
        // Mark as read if the conversation is open and the message is from the other user
        if (payload.new.sender_id !== user.id) {
          setUnreadConversations((prev) => prev.filter((id) => id !== activeConversation.id));
        }
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversation, user.id]);

  const openConversation = async (convo: any) => {
    setActiveConversation(convo);
    setLoadingMessages(true);
    const otherUserId = convo.user1_id === user.id ? convo.user2_id : convo.user1_id;
    const { data, error } = await checkMutualFollowForMessages(user.id, otherUserId);
    setCanMessage(data || false);
    getConversationMessages(convo.id).then(({ data }) => {
      setMessages(data || []);
      setLoadingMessages(false);
      setTimeout(() => {
        if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });
    // Mark as read (remove from unreadConversations)
    setUnreadConversations((prev) => prev.filter((id) => id !== convo.id));
  };

  const handleSendMessage = async () => {
    if (!canMessage || !newMessage.trim() || !activeConversation) return;
    await sendMessage(activeConversation.id, user.id, newMessage);
    setNewMessage("");
    // Re-fetch messages
    getConversationMessages(activeConversation.id).then(({ data }) => {
      setMessages(data || []);
      setTimeout(() => {
        if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });
  };

  // Swipe and mute/pin/delete logic (optional, can be added later)
  const handleSwipe = (convoId: string) => {
    setSwipedConvoId(swipedConvoId === convoId ? null : convoId);
  };
  // Pin conversation: move to top
  const handlePin = (convoId: string) => {
    setPinnedConversations((prev) => [convoId, ...prev.filter((id) => id !== convoId)]);
  };
  // Mute conversation: toggle mute
  const handleMute = (convoId: string) => {
    setMutedConversations((prev) =>
      prev.includes(convoId)
        ? prev.filter((id) => id !== convoId)
        : [...prev, convoId]
    );
  };
  // Delete conversation: remove from UI and Supabase
  const handleDelete = async (convoId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== convoId));
    await supabase.from('conversations').delete().eq('id', convoId);
  };

  // Helper to fetch and cache a user's profile
  const fetchProfile = async (userId: string) => {
    if (profileCache[userId]) return profileCache[userId];
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', userId)
      .maybeSingle();
    if (data) {
      setProfileCache((prev) => ({ ...prev, [userId]: { name: data.full_name, avatar_url: data.avatar_url } }));
      return { name: data.full_name, avatar_url: data.avatar_url };
    }
    return { name: userId, avatar_url: null };
  };

  // Fetch all other user profiles for conversations
  useEffect(() => {
    if (!user?.id || !conversations.length) return;
    const fetchAll = async () => {
      for (const convo of conversations) {
        const otherUserId = convo.user1_id === user.id ? convo.user2_id : convo.user1_id;
        await fetchProfile(otherUserId);
      }
    };
    fetchAll();
    // eslint-disable-next-line
  }, [conversations, user?.id]);

  // Check for unread messages in each conversation
  useEffect(() => {
    if (!user?.id || !conversations.length) return;
    const checkUnread = async () => {
      const unread: string[] = [];
      for (const convo of conversations) {
        const { data: msgs } = await supabase
          .from('messages')
          .select('id,sender_id')
          .eq('conversation_id', convo.id)
          .order('created_at', { ascending: false })
          .limit(1);
        if (msgs && msgs.length > 0 && msgs[0].sender_id !== user.id) {
          unread.push(convo.id);
        }
      }
      setUnreadConversations(unread);
    };
    checkUnread();
  }, [conversations, user?.id, messages]);

  // Sort conversations: pinned first
  const sortedConversations = [
    ...pinnedConversations
      .map((id) => conversations.find((c) => c.id === id))
      .filter(Boolean),
    ...conversations.filter((c) => !pinnedConversations.includes(c.id)),
  ];

  // Add helpers for pin/mute state in Supabase
  const getUserConversationSettings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      // Initialize default settings if they don't exist yet
      return { pinned: [], muted: [] };
    } catch (error) {
      console.error("Error fetching conversation settings:", error);
      return { pinned: [], muted: [] };
    }
  };
  
  const updateUserConversationSettings = async (userId: string, settings: { pinned: string[]; muted: string[] }) => {
    try {
      // Store settings in local storage instead
      localStorage.setItem('pinnedConversations', JSON.stringify(settings.pinned));
      localStorage.setItem('mutedConversations', JSON.stringify(settings.muted));
    } catch (error) {
      console.error("Error updating conversation settings:", error);
    }
  };

  // On mount, load pin/mute state from Supabase
  useEffect(() => {
    if (!user?.id) return;
    getUserConversationSettings(user.id).then((settings) => {
      setPinnedConversations(settings.pinned || []);
      setMutedConversations(settings.muted || []);
    });
    // eslint-disable-next-line
  }, [user?.id]);
  // On change, update pin/mute state in Supabase
  useEffect(() => {
    if (!user?.id) return;
    updateUserConversationSettings(user.id, {
      pinned: pinnedConversations,
      muted: mutedConversations,
    });
    // eslint-disable-next-line
  }, [pinnedConversations, mutedConversations, user?.id]);

  // Only show unread dot if there are unread conversations not currently open
  const showUnreadDot = unreadConversations.some((id) => id !== activeConversation?.id);

  return (
    <div className={`min-h-screen pb-16 ${isAthlete ? "athlete-theme" : "scout-theme"}`}>
      {/* Header and Recent Contacts */}
      {!activeConversation ? (
        <>
          <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-border shadow-sm">
            <div className="container px-4 h-16 flex items-center justify-between">
              <h1 className="text-xl font-bold dark:text-white">Messages</h1>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5 dark:text-white" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Edit className="h-5 w-5 dark:text-white" />
                </Button>
              </div>
            </div>
          </header>
          {/* Tabs */}
          <div className="flex justify-between px-4 py-2 bg-white dark:bg-gray-900 border-b border-border">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${activeTab === tab ? "bg-blue-500 text-white" : "text-gray-600 dark:text-gray-300"}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Conversation List */}
          <div className="flex flex-col flex-1 min-h-[60vh] divide-y divide-gray-200 dark:divide-gray-800">
            {loadingConvos ? (
              <div className="p-4 text-center">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No conversations yet.</div>
            ) : (
              sortedConversations.map((convo) => {
                const isSwipedConvo = swipedConvoId === convo.id;
                const otherUserId = convo.user1_id === user.id ? convo.user2_id : convo.user1_id;
                const otherProfile = profileCache[otherUserId];
                const isUnread = unreadConversations.includes(convo.id);
                const isMuted = mutedConversations.includes(convo.id);
                return (
                  <div
                    key={convo.id}
                    className="relative group"
                    style={{ height: '72px' }}
                  >
                    <div
                      className={`flex items-center px-4 py-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer group transition-transform duration-200`}
                      onClick={() => openConversation(convo)}
                    >
                      <Avatar className="h-12 w-12 mr-3">
                        {otherProfile?.avatar_url ? (
                          <AvatarImage src={otherProfile.avatar_url} alt={otherProfile.name} />
                        ) : (
                          <AvatarFallback>{otherProfile?.name?.[0] || otherUserId[0]}</AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900 dark:text-white truncate flex items-center">
                            {otherProfile?.name || otherUserId}
                            {isUnread && <span className="ml-2 w-2 h-2 rounded-full bg-blue-500 inline-block" />}
                            {isMuted && <span title="Muted"><VolumeX className="ml-2 w-4 h-4 text-gray-400" /></span>}
                          </span>
                          {/* Pin, Mute, Delete actions */}
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" className="hover:bg-gray-200 dark:hover:bg-gray-700" onClick={e => { e.stopPropagation(); handlePin(convo.id); }}><span className="text-xs">Pin</span></Button>
                            <Button size="icon" variant="ghost" className="hover:bg-gray-200 dark:hover:bg-gray-700" onClick={e => { e.stopPropagation(); handleMute(convo.id); }}><span className="text-xs">{isMuted ? 'Unmute' : 'Mute'}</span></Button>
                            <Button size="icon" variant="destructive" className="hover:bg-red-100 dark:hover:bg-red-900" onClick={e => { e.stopPropagation(); handleDelete(convo.id); }}><span className="text-xs">Delete</span></Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div className="flex-1 flex flex-col justify-center items-center">
              <span className="text-gray-400 text-sm text-center">
                Add more friends and start new conversations to grow your network!
              </span>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Chat Header */}
          <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-border shadow-sm">
            <div className="container px-4 h-16 flex items-center">
              <Button variant="ghost" size="icon" onClick={() => setActiveConversation(null)} className="mr-2">
                <ArrowLeft className="h-5 w-5 dark:text-white" />
              </Button>
              <Avatar className="h-8 w-8 mr-3">
                {(() => {
                  const otherUserId = activeConversation.user1_id === user.id ? activeConversation.user2_id : activeConversation.user1_id;
                  const otherProfile = profileCache[otherUserId];
                  if (otherProfile?.avatar_url) {
                    return <AvatarImage src={otherProfile.avatar_url} alt={otherProfile.name} />;
                  }
                  return <AvatarFallback>{otherProfile?.name?.[0] || otherUserId[0]}</AvatarFallback>;
                })()}
              </Avatar>
              <span className="font-semibold text-gray-900 dark:text-white flex-1">
                {(() => {
                  const otherUserId = activeConversation.user1_id === user.id ? activeConversation.user2_id : activeConversation.user1_id;
                  const otherProfile = profileCache[otherUserId];
                  return otherProfile?.name || otherUserId;
                })()}
              </span>
              <Button variant="ghost" size="icon"><Bell className="h-5 w-5 dark:text-white" /></Button>
              <Button variant="ghost" size="icon"><Edit className="h-5 w-5 dark:text-white" /></Button>
            </div>
          </header>
          {/* Chat Messages */}
          <div className="flex flex-col px-4 py-4 space-y-2 overflow-y-auto" style={{ height: "calc(100vh - 200px)" }}>
            {loadingMessages ? (
              <div className="text-center py-8 text-gray-500">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No messages yet.</div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}>
                  <div className={`rounded-2xl px-4 py-2 max-w-xs ${msg.sender_id === user.id ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"}`}>
                    {msg.text}
                    <div className="text-xs text-right mt-1 opacity-70">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Message Input Bar */}
          <div className="sticky bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-border px-4 py-3 flex items-center gap-2">
            <Button variant="ghost" size="icon"><Image className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5" /></Button>
            <Input
              className="flex-1 rounded-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500"
              placeholder={canMessage ? "Type a message..." : "You can only message mutual followers."}
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSendMessage(); }}
              disabled={!canMessage}
            />
            <Button
              className="rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2"
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !canMessage}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </>
      )}
      <BottomNavigation
        unreadMessages={showUnreadDot}
      />
    </div>
  );
};

export default Messages;
