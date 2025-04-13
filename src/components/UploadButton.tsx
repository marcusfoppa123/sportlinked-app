
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, Image, Video, BarChart } from "lucide-react";
import { toast } from "sonner";

interface UploadButtonProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadButton = ({ isOpen, onClose }: UploadButtonProps) => {
  const [uploadType, setUploadType] = useState<"highlight" | "stats" | "video" | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileSelected, setFileSelected] = useState(false);

  const handleSelectUploadType = (type: "highlight" | "stats" | "video") => {
    setUploadType(type);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileSelected(true);
      
      // Create a preview URL for images or videos
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        setFilePreview(url);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`${uploadType} uploaded successfully!`);
    
    // Clean up and reset
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFilePreview(null);
    setFileSelected(false);
    setUploadType(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md"
          >
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="relative bg-athlete-light dark:bg-athlete dark:bg-opacity-20">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-2 dark:text-white" 
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardTitle className="dark:text-white">Create Post</CardTitle>
              </CardHeader>

              {!uploadType ? (
                <CardContent className="pt-6">
                  <div className="grid grid-cols-3 gap-4">
                    <Button 
                      variant="outline" 
                      className="flex flex-col h-24 p-2 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
                      onClick={() => handleSelectUploadType("highlight")}
                    >
                      <Image className="h-8 w-8 mb-2 text-athlete" />
                      <span className="text-xs">Photo</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex flex-col h-24 p-2 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
                      onClick={() => handleSelectUploadType("video")}
                    >
                      <Video className="h-8 w-8 mb-2 text-athlete" />
                      <span className="text-xs">Video</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex flex-col h-24 p-2 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
                      onClick={() => handleSelectUploadType("stats")}
                    >
                      <BarChart className="h-8 w-8 mb-2 text-athlete" />
                      <span className="text-xs">Stats</span>
                    </Button>
                  </div>
                </CardContent>
              ) : (
                <form onSubmit={handleSubmit}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="title" className="dark:text-white">Title</Label>
                      <Input id="title" placeholder={`${uploadType} title`} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="description" className="dark:text-white">Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Add details about your content..." 
                        rows={3}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    
                    {uploadType === "stats" ? (
                      <div className="space-y-2">
                        <Label className="dark:text-white">Game/Event Stats</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label htmlFor="stat1" className="text-xs dark:text-gray-300">Points</Label>
                            <Input id="stat1" type="number" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                          </div>
                          <div>
                            <Label htmlFor="stat2" className="text-xs dark:text-gray-300">Assists</Label>
                            <Input id="stat2" type="number" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                          </div>
                          <div>
                            <Label htmlFor="stat3" className="text-xs dark:text-gray-300">Rebounds</Label>
                            <Input id="stat3" type="number" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Label htmlFor="media" className="dark:text-white">Upload {uploadType}</Label>
                        <div className={`border border-dashed rounded-md p-4 text-center ${fileSelected ? 'border-athlete' : 'dark:border-gray-600'}`}>
                          {filePreview ? (
                            <div className="relative">
                              {uploadType === "video" ? (
                                <video 
                                  src={filePreview} 
                                  className="max-h-32 mx-auto" 
                                  controls
                                />
                              ) : (
                                <img 
                                  src={filePreview} 
                                  alt="Preview" 
                                  className="max-h-32 mx-auto" 
                                />
                              )}
                              <button 
                                type="button"
                                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full" 
                                onClick={() => {
                                  URL.revokeObjectURL(filePreview);
                                  setFilePreview(null);
                                  setFileSelected(false);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <Input 
                                id="media" 
                                type="file" 
                                className="hidden"
                                accept={uploadType === "video" ? "video/*" : "image/*"}
                                onChange={handleFileChange}
                              />
                              <Label 
                                htmlFor="media" 
                                className="flex flex-col items-center cursor-pointer"
                              >
                                <Upload className="h-8 w-8 mb-2 text-gray-400" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  Click to upload {uploadType === "video" ? "a video" : "an image"}
                                </span>
                              </Label>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      <Label htmlFor="sport" className="dark:text-white">Sport</Label>
                      <Select>
                        <SelectTrigger id="sport" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder="Select sport" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                          <SelectItem value="basketball">Basketball</SelectItem>
                          <SelectItem value="football">Football</SelectItem>
                          <SelectItem value="baseball">Baseball</SelectItem>
                          <SelectItem value="soccer">Soccer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                      onClick={() => {
                        if (filePreview) {
                          URL.revokeObjectURL(filePreview);
                          setFilePreview(null);
                        }
                        setFileSelected(false);
                        setUploadType(null);
                      }}
                    >
                      Back
                    </Button>
                    <Button type="submit" className="flex-1 bg-athlete hover:bg-athlete/90">
                      Upload
                    </Button>
                  </CardFooter>
                </form>
              )}
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadButton;
