
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";

const EditProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isAthlete = user?.role === "athlete";
  const isScout = user?.role === "scout";
  const isTeam = user?.role === "team";
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "Point guard with 5 years of college experience. Looking for professional opportunities.",
    location: user?.location || "New York, NY",
    sport: user?.sport || "Basketball",
    position: user?.position || "Point Guard",
    experience: user?.experience || "College",
    teamSize: user?.teamSize || "34",
    foundedYear: user?.foundedYear || "2015",
    homeVenue: user?.homeVenue || "Brooklyn Sports Center",
    email: user?.email || "",
    phone: user?.phone || "(123) 456-7890",
    website: user?.website || "sportlinked.com/profile",
    profilePic: user?.profilePic
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
  
  const handleProfilePicChange = (image: string | undefined) => {
    setFormData({ ...formData, profilePic: image });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Update user profile
    if (updateUserProfile) {
      updateUserProfile(formData);
    }
    
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
    } dark:bg-gray-900`}>
      {/* Header */}
      <header className={`p-4 flex items-center shadow-sm ${
        isAthlete ? "bg-athlete" : isScout ? "bg-scout" : "bg-team"
      } text-white`}>
        <Button variant="ghost" size="icon" onClick={handleBack} className="text-white hover:bg-white/20">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold ml-4">{t("profile.editProfile")}</h1>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">{t("profile.changePicture")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ProfilePictureUpload
                profilePic={formData.profilePic}
                name={formData.name}
                role={user?.role}
                onImageChange={handleProfilePicChange}
                triggerComponent={
                  <Avatar className="h-32 w-32 mb-4 cursor-pointer hover:opacity-90 transition-opacity border-4 border-white dark:border-gray-700">
                    <AvatarImage src={formData.profilePic} />
                    <AvatarFallback className={`text-3xl ${
                      isAthlete ? "bg-blue-100" : isScout ? "bg-green-100" : "bg-yellow-100"
                    }`}>
                      {getInitials(formData.name)}
                    </AvatarFallback>
                  </Avatar>
                }
              />
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">{t("settings.profileInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="dark:text-gray-200">{t("auth.fullName")}</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio" className="dark:text-gray-200">{t("profile.about")}</Label>
                <Textarea 
                  id="bio" 
                  rows={4} 
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="dark:text-gray-200">{t("profile.location")}</Label>
                <Input 
                  id="location" 
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </CardContent>
          </Card>
          
          {isAthlete && (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">{t("auth.iAmA")} {t("auth.athlete")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sport" className="dark:text-gray-200">{t("auth.sport")}</Label>
                  <Select 
                    value={formData.sport} 
                    onValueChange={(value) => handleChange("sport", value)}
                  >
                    <SelectTrigger id="sport" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Football">Football</SelectItem>
                      <SelectItem value="Soccer">Soccer</SelectItem>
                      <SelectItem value="Baseball">Baseball</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position" className="dark:text-gray-200">{t("auth.position")}</Label>
                  <Input 
                    id="position" 
                    value={formData.position}
                    onChange={(e) => handleChange("position", e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience" className="dark:text-gray-200">{t("auth.experience")}</Label>
                  <Select 
                    value={formData.experience} 
                    onValueChange={(value) => handleChange("experience", value)}
                  >
                    <SelectTrigger id="experience" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
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
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">{t("auth.iAmA")} {t("auth.team")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sport" className="dark:text-gray-200">{t("auth.sport")}</Label>
                  <Select 
                    value={formData.sport} 
                    onValueChange={(value) => handleChange("sport", value)}
                  >
                    <SelectTrigger id="sport" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Football">Football</SelectItem>
                      <SelectItem value="Soccer">Soccer</SelectItem>
                      <SelectItem value="Baseball">Baseball</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="teamSize" className="dark:text-gray-200">{t("auth.teamSize")}</Label>
                  <Input 
                    id="teamSize" 
                    type="number" 
                    value={formData.teamSize}
                    onChange={(e) => handleChange("teamSize", e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="foundedYear" className="dark:text-gray-200">{t("auth.foundedYear")}</Label>
                  <Input 
                    id="foundedYear" 
                    type="number" 
                    value={formData.foundedYear}
                    onChange={(e) => handleChange("foundedYear", e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="homeVenue" className="dark:text-gray-200">{t("auth.homeVenue")}</Label>
                  <Input 
                    id="homeVenue" 
                    value={formData.homeVenue}
                    onChange={(e) => handleChange("homeVenue", e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </CardContent>
            </Card>
          )}
          
          {isScout && (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">{t("auth.iAmA")} {t("auth.scout")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sport" className="dark:text-gray-200">{t("auth.sport")}</Label>
                  <Select 
                    value={formData.sport} 
                    onValueChange={(value) => handleChange("sport", value)}
                  >
                    <SelectTrigger id="sport" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Football">Football</SelectItem>
                      <SelectItem value="Soccer">Soccer</SelectItem>
                      <SelectItem value="Baseball">Baseball</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="organization" className="dark:text-gray-200">{t("auth.organization")}</Label>
                  <Input 
                    id="organization" 
                    value={formData.position}
                    onChange={(e) => handleChange("position", e.target.value)}
                    placeholder="Michigan Wolverines, Lakers, etc."
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">{t("profile.contact")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-gray-200">{t("auth.email")}</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="dark:text-gray-200">{t("auth.phone")}</Label>
                <Input 
                  id="phone" 
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website" className="dark:text-gray-200">{t("auth.website")}</Label>
                <Input 
                  id="website" 
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleBack}
              className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              {t("content.cancel")}
            </Button>
            <Button 
              type="submit" 
              className={`${
                isAthlete ? "bg-athlete hover:bg-athlete/90" : 
                isScout ? "bg-scout hover:bg-scout/90" : 
                "bg-team hover:bg-team/90"
              } text-white`} 
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {t("content.save")}
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
