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

