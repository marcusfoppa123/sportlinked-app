import React from "react";
import { ArrowLeft, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

const notifications = [
  {
    id: 1,
    section: "Most recent",
    avatar: "",
    title: "Coach Wilson accepted your connection request.",
    date: "Just now",
    description: "You are now connected with Coach Wilson. Start a conversation!"
  },
  {
    id: 2,
    section: "Most recent",
    avatar: "",
    title: "Alex Thompson mentioned you in a comment.",
    date: "5m ago",
    description: '"@you Great game last night!"'
  },
  {
    id: 3,
    section: "Today",
    avatar: "",
    title: "Michigan State liked your highlight video.",
    date: "2h ago",
    description: "Your highlight video is getting noticed!"
  },
  {
    id: 4,
    section: "Today",
    avatar: "",
    title: "Sarah Williams viewed your profile.",
    date: "3h ago",
    description: "A scout is interested in your profile."
  },
  {
    id: 5,
    section: "Earlier",
    avatar: "",
    title: "Welcome to SportLinked!",
    date: "1d ago",
    description: "Complete your profile to get noticed by scouts and teams."
  }
];

// Order sections: Most recent, Today, Earlier, ...
const sectionOrder = ["Most recent", "Today", "Earlier"];
const grouped = notifications.reduce((acc, n) => {
  acc[n.section] = acc[n.section] || [];
  acc[n.section].push(n);
  return acc;
}, {} as Record<string, typeof notifications>);

const Notifications = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-50 py-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col min-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold flex-1 text-left ml-2">Notifications</h1>
          <button className="p-2">
            <Settings className="h-6 w-6" />
          </button>
        </div>
        {/* Notifications */}
        <div className="divide-y divide-gray-200 flex-1 flex flex-col">
          {sectionOrder.filter(section => grouped[section]).map(section => (
            <div key={section}>
              <div className="bg-white px-4 pt-6 pb-2 text-gray-500 font-semibold text-sm">
                {section}
              </div>
              {grouped[section].map((n, idx) => (
                <div key={n.id} className="flex items-start px-4 py-4 bg-white">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src={n.avatar} alt={n.title} />
                    <AvatarFallback>{n.title[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <span className="font-semibold text-base truncate mr-2">{n.title}</span>
                      <span className="text-xs text-gray-400">{n.date}</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1 truncate">
                      {n.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          {/* Blank space to fill the rest of the card */}
          <div className="flex-1" />
        </div>
      </div>
    </div>
  );
};

export default Notifications;
