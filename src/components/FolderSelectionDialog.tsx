import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Folder, Plus, Check } from "lucide-react";
import { toast } from "sonner";

interface Folder {
  id: string;
  name: string;
  color: string;
}

interface FolderSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFolderSelect: (folderId: string) => void;
  postId: string;
}

const FolderSelectionDialog: React.FC<FolderSelectionDialogProps> = ({
  open,
  onOpenChange,
  onFolderSelect,
  postId,
}) => {
  const { user } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3B82F6");

  const predefinedColors = [
    "#3B82F6", // Blue
    "#EF4444", // Red
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#8B5CF6", // Purple
    "#F97316", // Orange
    "#6B7280", // Gray
    "#EC4899", // Pink
  ];

  useEffect(() => {
    if (open && user) {
      fetchFolders();
    }
  }, [open, user]);

  const fetchFolders = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Use direct query for bookmark_folders table
      const { data, error } = await supabase
        .rpc('get_user_bookmark_folders', { p_user_id: user.id }) as any;

      if (error) {
        // If RPC doesn't exist, create default folder
        await createDefaultFolder();
        return;
      }

      if (!data || data.length === 0) {
        await createDefaultFolder();
        return;
      }

      setFolders(data);
    } catch (error) {
      // Fallback: create default folder if query fails
      await createDefaultFolder();
    } finally {
      setLoading(false);
    }
  };

  const createDefaultFolder = async () => {
    if (!user?.id) return;

    try {
      // Use direct SQL query to create folder
      const { data, error } = await supabase
        .rpc('create_bookmark_folder', {
          p_user_id: user.id,
          p_name: 'General',
          p_color: '#6B7280'
        }) as any;

      if (error) throw error;

      setFolders([{ id: data, name: 'General', color: '#6B7280' }]);
    } catch (error) {
      console.error('Error creating default folder:', error);
      toast.error('Failed to create default folder');
    }
  };

  const handleCreateFolder = async () => {
    if (!user?.id || !newFolderName.trim()) return;

    try {
      const { data, error } = await supabase
        .rpc('create_bookmark_folder', {
          p_user_id: user.id,
          p_name: newFolderName.trim(),
          p_color: selectedColor
        }) as any;

      if (error) throw error;

      const newFolder = { id: data, name: newFolderName.trim(), color: selectedColor };
      setFolders(prev => [...prev, newFolder]);
      setNewFolderName("");
      setShowCreateForm(false);
      toast.success("Folder created successfully");
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    }
  };

  const handleFolderSelect = async (folderId: string) => {
    try {
      onFolderSelect(folderId);
      onOpenChange(false);
    } catch (error) {
      console.error('Error selecting folder:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save to Folder</DialogTitle>
          <DialogDescription>
            Choose a folder to save this post, or create a new one.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Existing folders */}
          <div className="grid gap-2 max-h-60 overflow-y-auto">
            {folders.map((folder) => (
              <Button
                key={folder.id}
                variant="outline"
                className="justify-start h-auto p-3"
                onClick={() => handleFolderSelect(folder.id)}
              >
                <div className="flex items-center gap-2 w-full">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: folder.color }}
                  />
                  <span className="flex-1 text-left">{folder.name}</span>
                  <Check className="w-4 h-4 opacity-50" />
                </div>
              </Button>
            ))}
          </div>

          {/* Create new folder section */}
          {!showCreateForm ? (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Folder
            </Button>
          ) : (
            <div className="space-y-3 p-3 border rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="folder-name">Folder Name</Label>
                <Input
                  id="folder-name"
                  placeholder="Enter folder name..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color
                          ? "border-gray-400 scale-110"
                          : "border-gray-200"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="flex-1"
                >
                  Create
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewFolderName("");
                    setSelectedColor("#3B82F6");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FolderSelectionDialog;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save to Folder</DialogTitle>
          <DialogDescription>
            Choose a folder to save this post, or create a new one.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Existing folders */}
          <div className="grid gap-2 max-h-60 overflow-y-auto">
            {folders.map((folder) => (
              <Button
                key={folder.id}
                variant="outline"
                className="justify-start h-auto p-3"
                onClick={() => handleFolderSelect(folder.id)}
              >
                <div className="flex items-center gap-2 w-full">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: folder.color }}
                  />
                  <span className="flex-1 text-left">{folder.name}</span>
                  <Check className="w-4 h-4 opacity-50" />
                </div>
              </Button>
            ))}
          </div>

          {/* Create new folder section */}
          {!showCreateForm ? (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Folder
            </Button>
          ) : (
            <div className="space-y-3 p-3 border rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="folder-name">Folder Name</Label>
                <Input
                  id="folder-name"
                  placeholder="Enter folder name..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color
                          ? "border-gray-400 scale-110"
                          : "border-gray-200"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="flex-1"
                >
                  Create
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewFolderName("");
                    setSelectedColor("#3B82F6");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FolderSelectionDialog;
