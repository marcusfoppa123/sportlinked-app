import React from "react";
import { ArrowLeft, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

const notifications = [
  {
    id: 1,
    section: "Today",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Klarna_Payment_Badge.png",
    title: "Search, compare and shop.",
    date: "Yesterday",
    description: "Search for products, compare prices, and pay now, later, or over time—right in the Klarna app."
  },
  {
    id: 2,
    section: "Today",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Klarna_Payment_Badge.png",
    title: "Pay later. Anywhere. Any...",
    date: "Yesterday",
    description: "Heard of a little thing called a One-time card? Yes? No? Click to find out more."
  },
  {
    id: 3,
    section: "Most recent",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Klarna_Payment_Badge.png",
    title: "Fancy $200?",
    date: "Yesterday",
    description: "Refer friends and earn up to $200 in Amazon.com Gift Cards. Tap for details."
  }
];

const grouped = notifications.reduce((acc, n) => {
  acc[n.section] = acc[n.section] || [];
  acc[n.section].push(n);
  return acc;
}, {} as Record<string, typeof notifications>);

const Notifications = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-50 py-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg overflow-hidden">
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
        <div className="divide-y divide-gray-200">
          {Object.entries(grouped).map(([section, items]) => (
            <div key={section}>
              <div className="bg-white px-4 pt-6 pb-2 text-gray-500 font-semibold text-sm">
                {section}
              </div>
              {items.map((n, idx) => (
                <div key={n.id} className="flex items-start px-4 py-4 bg-white">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src={n.avatar} alt={n.title} />
                    <AvatarFallback>K</AvatarFallback>
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
        </div>
      </div>
    </div>
  );
};

export default Notifications;
