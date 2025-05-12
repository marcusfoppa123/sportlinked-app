import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/LanguageContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const MessageSettings = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [settings, setSettings] = React.useState({
    messageNotifications: true,
    soundEnabled: true,
    readReceipts: true,
    typingIndicators: true,
    messagePrivacy: "everyone" as "everyone" | "followers" | "none"
  });

  const handleToggle = (setting: keyof typeof settings) => {
    if (setting === "messagePrivacy") return;
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handlePrivacyChange = (value: "everyone" | "followers" | "none") => {
    setSettings(prev => ({
      ...prev,
      messagePrivacy: value
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
        <h1 className="text-2xl font-bold text-white">Message Settings</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-semibold dark:text-white">Message Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="message-notifications" className="text-gray-700 dark:text-gray-300">
                Message Notifications
              </Label>
              <Switch
                id="message-notifications"
                checked={settings.messageNotifications}
                onCheckedChange={() => handleToggle('messageNotifications')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-enabled" className="text-gray-700 dark:text-gray-300">
                Message Sound
              </Label>
              <Switch
                id="sound-enabled"
                checked={settings.soundEnabled}
                onCheckedChange={() => handleToggle('soundEnabled')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="read-receipts" className="text-gray-700 dark:text-gray-300">
                Read Receipts
              </Label>
              <Switch
                id="read-receipts"
                checked={settings.readReceipts}
                onCheckedChange={() => handleToggle('readReceipts')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="typing-indicators" className="text-gray-700 dark:text-gray-300">
                Typing Indicators
              </Label>
              <Switch
                id="typing-indicators"
                checked={settings.typingIndicators}
                onCheckedChange={() => handleToggle('typingIndicators')}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-semibold dark:text-white">Message Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={settings.messagePrivacy}
              onValueChange={(value) => handlePrivacyChange(value as "everyone" | "followers" | "none")}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="everyone" id="everyone" />
                <Label htmlFor="everyone" className="text-gray-700 dark:text-gray-300">
                  Everyone can message me
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="followers" id="followers" />
                <Label htmlFor="followers" className="text-gray-700 dark:text-gray-300">
                  Only followers can message me
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none" className="text-gray-700 dark:text-gray-300">
                  No one can message me
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessageSettings; 