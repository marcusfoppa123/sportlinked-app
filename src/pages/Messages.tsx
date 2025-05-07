import React, { useState, useRef } from "react";
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

// Mock data for conversations
const mockConversations = [
  {
    id: "1",
    name: "Coach Wilson",
    avatar: "",
    lastMessage: "I watched your highlight reel. Can we schedule a call?",
    time: "2h ago",
    unread: true,
    messages: [
      {
        id: "msg1",
        sender: "Coach Wilson",
        text: "Hey there! I watched your highlight reel from last season.",
        time: "2h ago",
        isMe: false
      },
      {
        id: "msg2",
        sender: "Coach Wilson",
        text: "I was really impressed with your three-point shooting and defensive awareness.",
        time: "2h ago",
        isMe: false
      },
      {
        id: "msg3",
        sender: "Coach Wilson",
        text: "I watched your highlight reel. Can we schedule a call?",
        time: "2h ago",
        isMe: false
      }
    ]
  },
  {
    id: "2",
    name: "Alex Thompson",
    avatar: "",
    lastMessage: "Great game yesterday! Your three-pointer in the 4th quarter was clutch.",
    time: "1d ago",
    unread: false,
    messages: [
      {
        id: "msg4",
        sender: "Me",
        text: "Thanks for coming to the game!",
        time: "2d ago",
        isMe: true
      },
      {
        id: "msg5",
        sender: "Alex Thompson",
        text: "Of course! Wouldn't miss it.",
        time: "1d ago",
        isMe: false
      },
      {
        id: "msg6",
        sender: "Alex Thompson",
        text: "Great game yesterday! Your three-pointer in the 4th quarter was clutch.",
        time: "1d ago",
        isMe: false
      }
    ]
  },
  {
    id: "3",
    name: "Michigan State",
    avatar: "",
    lastMessage: "We'd like to invite you for a campus visit next month.",
    time: "2d ago",
    unread: false,
    messages: [
      {
        id: "msg7",
        sender: "Michigan State",
        text: "Hello! We've been following your career and are very impressed.",
        time: "3d ago",
        isMe: false
      },
      {
        id: "msg8",
        sender: "Michigan State",
        text: "We'd like to invite you for a campus visit next month.",
        time: "2d ago",
        isMe: false
      }
    ]
  },
  {
    id: "4",
    name: "Sarah Williams",
    avatar: "",
    lastMessage: "Thanks for connecting! Looking forward to seeing more of your games.",
    time: "1w ago",
    unread: false,
    messages: [
      {
        id: "msg9",
        sender: "Sarah Williams",
        text: "Hi! I'm a scout for the regional league.",
        time: "1w ago",
        isMe: false
      },
      {
        id: "msg10",
        sender: "Sarah Williams",
        text: "Thanks for connecting! Looking forward to seeing more of your games.",
        time: "1w ago",
        isMe: false
      }
    ]
  }
];

const ACTION_WIDTH = 120; // px, width of the revealed action area

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobileDevice = useIsMobile();
  const isAthlete = user?.role === "athlete";
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState(mockConversations);
  const [swipedConvoId, setSwipedConvoId] = useState(null);
  const TABS = ["All", "Messages", "Requests"];
  const [activeTab, setActiveTab] = useState("All");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const { pendingRequests, sentRequests, loading, error, sendMessageRequest, respondToRequest } = useMessageRequests();
  const [mutedConversations, setMutedConversations] = useState<string[]>([]);

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeConversation, conversations]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;
    try {
      // Check for message request status
      const { data: request, error: requestError } = await supabase
        .from('message_requests')
        .select('*')
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .single();

      if (requestError && requestError.code !== 'PGRST116') {
        throw requestError;
      }

      // If there is a pending request and it is not accepted, block sending and send a request if not already sent
      if (request && request.status === 'pending') {
        if (request.sender_id === user?.id) {
          // Already sent, just block
          return;
        } else {
          // Received, block
          return;
        }
      }
      // If no request exists, send a request and block sending
      if (!request) {
        await sendMessageRequest(activeConversation.id);
        return;
      }
      // If request is accepted or not needed, send the message
      const updatedConversations = conversations.map(convo => {
        if (convo.id === activeConversation.id) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            sender: "Me",
            text: newMessage,
            time: "Just now",
            isMe: true
          };
          return {
            ...convo,
            lastMessage: newMessage,
            time: "Just now",
            messages: [...convo.messages, newMsg]
          };
        }
        return convo;
      });
      setConversations(updatedConversations);
      const updatedActive = updatedConversations.find(c => c.id === activeConversation.id);
      setActiveConversation(updatedActive);
      setNewMessage("");
    } catch (err) {
      console.error('Error sending message:', err);
      // Handle error appropriately
    }
  };

  const navigateToNotifications = () => {
    navigate("/notifications");
  };

  // Handle swipe functionality
  const handleSwipe = (convoId) => {
    setSwipedConvoId(swipedConvoId === convoId ? null : convoId);
  };

  const handlePin = (convoId: string) => {
    setConversations(prev => {
      const idx = prev.findIndex(c => c.id === convoId);
      if (idx === -1) return prev;
      const pinned = prev[idx];
      const rest = prev.filter((_, i) => i !== idx);
      return [pinned, ...rest];
    });
    setSwipedConvoId(null);
  };

  const handleMute = (convoId: string) => {
    setMutedConversations(prev =>
      prev.includes(convoId)
        ? prev.filter(id => id !== convoId)
        : [...prev, convoId]
    );
    setSwipedConvoId(null);
  };

  const handleDelete = (convoId: string) => {
    setConversations(prev => prev.filter(c => c.id !== convoId));
    setSwipedConvoId(null);
  };

  return (
    <div className={`min-h-screen pb-16 ${isAthlete ? "athlete-theme" : "scout-theme"}`}>
      {/* Header and Recent Contacts */}
      {!activeConversation ? (
        <>
          <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-border shadow-sm">
            <div className="container px-4 h-16 flex items-center justify-between">
              <h1 className="text-xl font-bold dark:text-white">Messages</h1>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={navigateToNotifications}>
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
                {tab === "Requests" && pendingRequests.length > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {pendingRequests.length}
                  </span>
                )}
              </button>
            ))}
          </div>
          {/* Content based on active tab */}
          {activeTab === "Requests" ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                <div className="p-4 text-center">Loading...</div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
              ) : (
                <>
                  {pendingRequests.length > 0 && (
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">Pending Requests</h3>
                      {pendingRequests.map(request => (
                        <div key={request.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">User {request.sender_id}</p>
                              <p className="text-sm text-gray-500">Wants to message you</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => respondToRequest(request.id, false)}
                            >
                              Decline
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => respondToRequest(request.id, true)}
                            >
                              Accept
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {sentRequests.length > 0 && (
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">Sent Requests</h3>
                      {sentRequests.map(request => (
                        <div key={request.id} className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">User {request.receiver_id}</p>
                            <p className="text-sm text-gray-500">Request pending</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {pendingRequests.length === 0 && sentRequests.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      No message requests
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            // Conversation List
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {conversations.map((convo) => {
                const isSwipedConvo = swipedConvoId === convo.id;
                
                const handleTouchStart = (e) => {
                  if (!isMobileDevice) return;
                  touchStartX.current = e.touches[0].clientX;
                };
                
                const handleTouchMove = (e) => {
                  if (!isMobileDevice) return;
                  touchEndX.current = e.touches[0].clientX;
                };
                
                const handleTouchEnd = () => {
                  if (!isMobileDevice) return;
                  if (touchStartX.current - touchEndX.current > 60) {
                    handleSwipe(convo.id);
                  } else if (touchEndX.current - touchStartX.current > 60) {
                    handleSwipe(null);
                  }
                };
                
                return (
                  <div
                    key={convo.id}
                    className="relative"
                    style={{ height: '72px' }} // match your row height
                  >
                    {/* Action buttons area, absolutely positioned to the right */}
                    {isMobileDevice && isSwipedConvo && (
                      <div
                        className="absolute top-0 right-0 h-full flex flex-row justify-center items-center bg-white dark:bg-gray-900 z-10 shadow-lg"
                        style={{ width: ACTION_WIDTH }}
                      >
                        <Button size="icon" variant="ghost" className="mx-1" onClick={e => { e.stopPropagation(); handlePin(convo.id); }}><span className="text-xs">Pin</span></Button>
                        <Button size="icon" variant="ghost" className="mx-1" onClick={e => { e.stopPropagation(); handleMute(convo.id); }}><span className="text-xs">{mutedConversations.includes(convo.id) ? 'Unmute' : 'Mute'}</span></Button>
                        <Button size="icon" variant="destructive" className="mx-1" onClick={e => { e.stopPropagation(); handleDelete(convo.id); }}><span className="text-xs">Delete</span></Button>
                      </div>
                    )}
                    {/* Conversation bar, slides left when swiped */}
                    <div
                      className={`flex items-center px-4 py-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer group transition-transform duration-200 ${isSwipedConvo ? '' : ''}`}
                      style={
                        isMobileDevice && isSwipedConvo
                          ? { transform: `translateX(-${ACTION_WIDTH}px)`, zIndex: 2, background: 'inherit' }
                          : { background: 'inherit' }
                      }
                      onClick={() => !isSwipedConvo && setActiveConversation(convo)}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      <Avatar className="h-12 w-12 mr-3">
                        <AvatarImage src={convo.avatar} alt={convo.name} />
                        <AvatarFallback>{convo.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900 dark:text-white truncate flex items-center">
                            {convo.name}
                            {mutedConversations.includes(convo.id) && (
                              <span title="Muted">
                                <VolumeX className="ml-2 w-4 h-4 text-gray-400" />
                              </span>
                            )}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">{convo.time}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`truncate text-sm ${convo.unread ? "font-bold text-blue-600" : "text-gray-600 dark:text-gray-300"}`}>{convo.lastMessage}</span>
                          {convo.unread && <span className="ml-2 w-2 h-2 rounded-full bg-blue-500 inline-block" />}
                        </div>
                      </div>
                      {/* On desktop, show action buttons inline as before */}
                      {!isMobileDevice && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 bg-white dark:bg-gray-900 p-1 rounded-xl shadow-lg z-10">
                          <Button size="icon" variant="ghost" className="hover:bg-gray-200 dark:hover:bg-gray-700" onClick={e => { e.stopPropagation(); handlePin(convo.id); }}><span className="text-xs">Pin</span></Button>
                          <Button size="icon" variant="ghost" className="hover:bg-gray-200 dark:hover:bg-gray-700" onClick={e => { e.stopPropagation(); handleMute(convo.id); }}><span className="text-xs">{mutedConversations.includes(convo.id) ? 'Unmute' : 'Mute'}</span></Button>
                          <Button size="icon" variant="destructive" className="hover:bg-red-100 dark:hover:bg-red-900" onClick={e => { e.stopPropagation(); handleDelete(convo.id); }}><span className="text-xs">Delete</span></Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {/* Encouragement message for empty space */}
              <div className="flex-1 flex flex-col justify-center items-center">
                <span className="text-gray-400 text-sm text-center">
                  Add more friends and start new conversations to grow your network!
                </span>
              </div>
            </div>
          )}
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
                <AvatarImage src={activeConversation.avatar} alt={activeConversation.name} />
                <AvatarFallback>{activeConversation.name[0]}</AvatarFallback>
              </Avatar>
              <span className="font-semibold text-gray-900 dark:text-white flex-1">{activeConversation.name}</span>
              <Button variant="ghost" size="icon"><Bell className="h-5 w-5 dark:text-white" /></Button>
              <Button variant="ghost" size="icon"><Edit className="h-5 w-5 dark:text-white" /></Button>
            </div>
          </header>
          {/* Chat Messages */}
          <div className="flex flex-col px-4 py-4 space-y-2 overflow-y-auto" style={{ height: "calc(100vh - 200px)" }}>
            {activeConversation.messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                <div className={`rounded-2xl px-4 py-2 max-w-xs ${msg.isMe ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"}`}>
                  {msg.text}
                  <div className="text-xs text-right mt-1 opacity-70">{msg.time}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {/* Message Input Bar */}
          <div className="sticky bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-border px-4 py-3 flex items-center gap-2">
            <Button variant="ghost" size="icon"><Image className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5" /></Button>
            <Input
              className="flex-1 rounded-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSendMessage(); }}
            />
            <Button
              className="rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </>
      )}
      <BottomNavigation />
    </div>
  );
};

// We need to declare these refs outside of the component's render cycle
// to avoid hook inconsistency issues
const touchStartX = { current: 0 };
const touchEndX = { current: 0 };

export default Messages;
