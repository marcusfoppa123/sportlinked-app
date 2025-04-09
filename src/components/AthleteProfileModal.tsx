
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MessageSquare, UserPlus, MapPin, Calendar, Award } from "lucide-react";
import { X } from "lucide-react";

interface AthleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  athlete: {
    name: string;
    profilePic?: string;
    sport: string;
    position: string;
    stats: Record<string, string | number>;
    location?: string;
    experience?: string;
    achievements?: string[];
    about?: string;
  };
}

const AthleteProfileModal = ({ isOpen, onClose, athlete }: AthleteProfileModalProps) => {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="relative">
          <div className="h-40 bg-athlete"></div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white z-10"
          >
            <X className="h-5 w-5" />
          </Button>
          
          <div className="px-6">
            <div className="relative -top-20 flex flex-col md:flex-row">
              <Avatar className="h-32 w-32 border-4 border-white">
                <AvatarImage src={athlete.profilePic} />
                <AvatarFallback className="text-3xl bg-blue-100">
                  {getInitials(athlete.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="mt-4 md:mt-0 md:ml-6">
                <h2 className="text-2xl font-bold">{athlete.name}</h2>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant="outline" className="athlete-badge">Athlete</Badge>
                  <Badge variant="outline" className="bg-gray-100">
                    {athlete.sport} • {athlete.position}
                  </Badge>
                </div>
                
                {athlete.location && (
                  <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{athlete.location}</span>
                  </div>
                )}
                
                {athlete.experience && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{athlete.experience} Experience</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <section>
                <h3 className="text-lg font-semibold mb-3">Stats</h3>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(athlete.stats).map(([key, value]) => (
                    <div key={key} className="text-center p-3 bg-gray-50 rounded-md">
                      <p className="text-xs text-gray-500">{key}</p>
                      <p className="font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
                
                {athlete.about && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">About</h3>
                    <p className="text-gray-700">{athlete.about}</p>
                  </div>
                )}
              </section>
              
              <section>
                {athlete.achievements && athlete.achievements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Achievements</h3>
                    <ul className="space-y-2">
                      {athlete.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Award className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            </div>
            
            <div className="flex gap-3 mb-6">
              <Button className="flex-1 bg-athlete hover:bg-athlete/90" size="lg">
                <UserPlus className="mr-2 h-5 w-5" />
                Connect
              </Button>
              <Button variant="outline" className="flex-1" size="lg">
                <MessageSquare className="mr-2 h-5 w-5" />
                Message
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AthleteProfileModal;
