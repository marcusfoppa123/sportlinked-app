import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/LanguageContext";

const NotificationSettings = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [settings, setSettings] = React.useState({
    pushNotifications: true,
    emailNotifications: true,
    newMessages: true,
    newFollowers: true,
    newLikes: true,
    newComments: true,
    mentions: true,
    offers: true,
    updates: false
  });

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#102a37' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center bg-[#102a37] px-4 py-4">
        <button
          onClick={() => navigate('/settings')}
          className="mr-4 text-white hover:text-blue-300"
          aria-label="Back"
        >
          <ArrowLeft size={32} />
        </button>
        <h1 className="text-2xl font-bold text-white">Notification Settings</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-semibold dark:text-white">Push Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="text-gray-700 dark:text-gray-300">
                Enable Push Notifications
              </Label>
              <Switch
                id="push-notifications"
                checked={settings.pushNotifications}
                onCheckedChange={() => handleToggle('pushNotifications')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="text-gray-700 dark:text-gray-300">
                Email Notifications
              </Label>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle('emailNotifications')}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-semibold dark:text-white">Notification Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="new-messages" className="text-gray-700 dark:text-gray-300">
                New Messages
              </Label>
              <Switch
                id="new-messages"
                checked={settings.newMessages}
                onCheckedChange={() => handleToggle('newMessages')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="new-followers" className="text-gray-700 dark:text-gray-300">
                New Followers
              </Label>
              <Switch
                id="new-followers"
                checked={settings.newFollowers}
                onCheckedChange={() => handleToggle('newFollowers')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="new-likes" className="text-gray-700 dark:text-gray-300">
                New Likes
              </Label>
              <Switch
                id="new-likes"
                checked={settings.newLikes}
                onCheckedChange={() => handleToggle('newLikes')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="new-comments" className="text-gray-700 dark:text-gray-300">
                New Comments
              </Label>
              <Switch
                id="new-comments"
                checked={settings.newComments}
                onCheckedChange={() => handleToggle('newComments')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="mentions" className="text-gray-700 dark:text-gray-300">
                Mentions
              </Label>
              <Switch
                id="mentions"
                checked={settings.mentions}
                onCheckedChange={() => handleToggle('mentions')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="offers" className="text-gray-700 dark:text-gray-300">
                Offers & Opportunities
              </Label>
              <Switch
                id="offers"
                checked={settings.offers}
                onCheckedChange={() => handleToggle('offers')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="updates" className="text-gray-700 dark:text-gray-300">
                App Updates
              </Label>
              <Switch
                id="updates"
                checked={settings.updates}
                onCheckedChange={() => handleToggle('updates')}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationSettings; 