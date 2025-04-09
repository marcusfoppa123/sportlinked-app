
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

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadType, setUploadType] = useState<"highlight" | "stats" | "video" | null>(null);

  const handleOpenUpload = () => {
    setIsOpen(true);
  };

  const handleCloseUpload = () => {
    setIsOpen(false);
    setUploadType(null);
  };

  const handleSelectUploadType = (type: "highlight" | "stats" | "video") => {
    setUploadType(type);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`${uploadType} uploaded successfully!`);
    handleCloseUpload();
  };

  return (
    <>
      <Button 
        onClick={handleOpenUpload}
        className="fixed right-5 bottom-20 z-40 rounded-full h-14 w-14 p-0 bg-athlete hover:bg-athlete/90 shadow-lg"
      >
        <Upload className="h-6 w-6" />
      </Button>

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
              <Card>
                <CardHeader className="relative bg-athlete-light">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-2 top-2" 
                    onClick={handleCloseUpload}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <CardTitle>Upload Content</CardTitle>
                </CardHeader>

                {!uploadType ? (
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-3 gap-4">
                      <Button 
                        variant="outline" 
                        className="flex flex-col h-24 p-2"
                        onClick={() => handleSelectUploadType("highlight")}
                      >
                        <Image className="h-8 w-8 mb-2 text-athlete" />
                        <span className="text-xs">Highlight</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="flex flex-col h-24 p-2"
                        onClick={() => handleSelectUploadType("video")}
                      >
                        <Video className="h-8 w-8 mb-2 text-athlete" />
                        <span className="text-xs">Video</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="flex flex-col h-24 p-2"
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
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" placeholder={`${uploadType} title`} />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          placeholder="Add details about your content..." 
                          rows={3}
                        />
                      </div>
                      
                      {uploadType === "stats" ? (
                        <div className="space-y-2">
                          <Label>Game/Event Stats</Label>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <Label htmlFor="stat1" className="text-xs">Points</Label>
                              <Input id="stat1" type="number" />
                            </div>
                            <div>
                              <Label htmlFor="stat2" className="text-xs">Assists</Label>
                              <Input id="stat2" type="number" />
                            </div>
                            <div>
                              <Label htmlFor="stat3" className="text-xs">Rebounds</Label>
                              <Input id="stat3" type="number" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <Label htmlFor="media">Upload {uploadType}</Label>
                          <div className="border border-dashed rounded-md p-4 text-center">
                            <Input 
                              id="media" 
                              type="file" 
                              className="hidden"
                              accept={uploadType === "video" ? "video/*" : "image/*"}
                            />
                            <Label 
                              htmlFor="media" 
                              className="flex flex-col items-center cursor-pointer"
                            >
                              <Upload className="h-8 w-8 mb-2 text-gray-400" />
                              <span className="text-sm text-gray-500">
                                Click to upload {uploadType === "video" ? "a video" : "an image"}
                              </span>
                            </Label>
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-1">
                        <Label htmlFor="sport">Sport</Label>
                        <Select>
                          <SelectTrigger id="sport">
                            <SelectValue placeholder="Select sport" />
                          </SelectTrigger>
                          <SelectContent>
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
                        className="flex-1"
                        onClick={() => setUploadType(null)}
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
    </>
  );
};

export default UploadButton;
