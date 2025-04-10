
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Upload, Save } from "lucide-react";
import { toast } from "sonner";

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAthlete = user?.role === "athlete";
  const isScout = user?.role === "scout";
  const isTeam = user?.role === "team";
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: "Point guard with 5 years of college experience. Looking for professional opportunities.",
    location: "New York, NY",
    sport: "Basketball",
    position: "Point Guard",
    experience: "College",
    teamSize: "34",
    foundedYear: "2015",
    homeVenue: "Brooklyn Sports Center",
    email: user?.email || "",
    phone: "(123) 456-7890",
    website: "sportlinked.com/profile"
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Get initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return isTeam ? "T" : isAthlete ? "A" : "S";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };
  
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Profile updated successfully");
      
      // Navigate back based on role
      if (isTeam) {
        navigate("/team-profile");
      } else {
        navigate("/profile");
      }
    }, 1000);
  };
  
  const handleBack = () => {
    // Navigate back based on role
    if (isTeam) {
      navigate("/team-profile");
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className={`min-h-screen pb-8 ${
      isAthlete ? "athlete-theme" : isScout ? "scout-theme" : "team-theme"
    }`}>
      {/* Header */}
      <header className={`p-4 flex items-center shadow-sm ${
        isAthlete ? "bg-athlete" : isScout ? "bg-scout" : "bg-team"
      } text-white`}>
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold ml-4">Edit Profile</h1>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={user?.profilePic} />
                <AvatarFallback className={`text-3xl ${
                  isAthlete ? "bg-blue-100" : isScout ? "bg-green-100" : "bg-yellow-100"
                }`}>
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  rows={4} 
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          {isAthlete && (
            <Card>
              <CardHeader>
                <CardTitle>Athletic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sport">Sport</Label>
                  <Select 
                    value={formData.sport} 
                    onValueChange={(value) => handleChange("sport", value)}
                  >
                    <SelectTrigger id="sport">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Football">Football</SelectItem>
                      <SelectItem value="Soccer">Soccer</SelectItem>
                      <SelectItem value="Baseball">Baseball</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input 
                    id="position" 
                    value={formData.position}
                    onChange={(e) => handleChange("position", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select 
                    value={formData.experience} 
                    onValueChange={(value) => handleChange("experience", value)}
                  >
                    <SelectTrigger id="experience">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High School">High School</SelectItem>
                      <SelectItem value="College">College</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Amateur">Amateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}
          
          {isTeam && (
            <Card>
              <CardHeader>
                <CardTitle>Team Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sport">Sport</Label>
                  <Select 
                    value={formData.sport} 
                    onValueChange={(value) => handleChange("sport", value)}
                  >
                    <SelectTrigger id="sport">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Football">Football</SelectItem>
                      <SelectItem value="Soccer">Soccer</SelectItem>
                      <SelectItem value="Baseball">Baseball</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Input 
                    id="teamSize" 
                    type="number" 
                    value={formData.teamSize}
                    onChange={(e) => handleChange("teamSize", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="foundedYear">Founded Year</Label>
                  <Input 
                    id="foundedYear" 
                    type="number" 
                    value={formData.foundedYear}
                    onChange={(e) => handleChange("foundedYear", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="homeVenue">Home Venue</Label>
                  <Input 
                    id="homeVenue" 
                    value={formData.homeVenue}
                    onChange={(e) => handleChange("homeVenue", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          )}
          
          {isScout && (
            <Card>
              <CardHeader>
                <CardTitle>Scout Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sport">Sport</Label>
                  <Select 
                    value={formData.sport} 
                    onValueChange={(value) => handleChange("sport", value)}
                  >
                    <SelectTrigger id="sport">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Football">Football</SelectItem>
                      <SelectItem value="Soccer">Soccer</SelectItem>
                      <SelectItem value="Baseball">Baseball</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization/Team</Label>
                  <Input 
                    id="organization" 
                    value={formData.position}
                    onChange={(e) => handleChange("position", e.target.value)}
                    placeholder="Michigan Wolverines, Lakers, etc."
                  />
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website/Social Media</Label>
                <Input 
                  id="website" 
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={handleBack}>
              Cancel
            </Button>
            <Button type="submit" className={`${
              isAthlete ? "bg-athlete hover:bg-athlete/90" : 
              isScout ? "bg-scout hover:bg-scout/90" : 
              "bg-team hover:bg-team/90"
            }`} disabled={isLoading}>
              {isLoading ? "Saving..." : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditProfile;
