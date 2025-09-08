import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ArrowLeft,
  Plus,
  X,
  Edit3,
  Trash2,
  Share2,
  Shuffle,
  MoreVertical,
  GripVertical,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { bucketService, Bucket, Activity } from "../services/bucketService";
import ActivityTimerModal from "./ActivityTimerModal";

// Remove local interfaces since we're importing from bucketService

interface BucketDetailPageProps {
  bucket: Bucket;
  onUpdateBucket: (bucket: Bucket) => void;
  onDeleteBucket: (bucketId: string) => void;
  onBackToDashboard?: () => void;
}

export default function BucketDetailPage({
  bucket,
  onUpdateBucket,
  onDeleteBucket,
  onBackToDashboard,
}: BucketDetailPageProps) {
  const navigate = useNavigate();
  const [isEditingName, setIsEditingName] = useState(false);
  const [bucketName, setBucketName] = useState(bucket.name);
  const [newActivity, setNewActivity] = useState("");
  const [newActivityDescription, setNewActivityDescription] = useState("");
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );

  const handleNameSave = () => {
    if (bucketName.trim()) {
      onUpdateBucket({
        ...bucket,
        name: bucketName.trim(),
      });
      setIsEditingName(false);
    }
  };

  const handleAddActivity = async () => {
    if (newActivity.trim()) {
      try {
        setIsLoading(true);
        setError(null);
        const newActivityObj = await bucketService.addActivity(
          bucket.id,
          newActivity.trim(),
          newActivityDescription.trim() || undefined
        );
        onUpdateBucket({
          ...bucket,
          activities: [...bucket.activities, newActivityObj],
        });
        setNewActivity("");
        setNewActivityDescription("");
      } catch (err) {
        console.error("Error adding activity:", err);
        setError("Failed to add activity. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRemoveActivity = async (activityId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await bucketService.removeActivity(activityId);
      onUpdateBucket({
        ...bucket,
        activities: bucket.activities.filter(
          (activity) => activity.id !== activityId
        ),
      });
    } catch (err) {
      console.error("Error removing activity:", err);
      setError("Failed to remove activity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrawActivity = () => {
    if (bucket.activities.length > 0) {
      const randomIndex = Math.floor(Math.random() * bucket.activities.length);
      const selectedActivity = bucket.activities[randomIndex];
      setSelectedActivity(selectedActivity);
      setIsTimerModalOpen(true);
    }
  };

  const handleDeleteBucket = () => {
    if (
      confirm(
        `Are you sure you want to delete "${bucket.name}"? This action cannot be undone.`
      )
    ) {
      onDeleteBucket(bucket.id);
      if (onBackToDashboard) {
        onBackToDashboard();
      } else {
        navigate("/dashboard");
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, activityId: string) => {
    setDraggedItem(activityId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", activityId);
  };

  const handleDragOver = (e: React.DragEvent, activityId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverItem(activityId);
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();

    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = bucket.activities.findIndex(
      (activity) => activity.id === draggedItem
    );
    const targetIndex = bucket.activities.findIndex(
      (activity) => activity.id === targetId
    );

    if (draggedIndex === -1 || targetIndex === -1) return;

    try {
      setIsLoading(true);
      setError(null);

      const newActivities = [...bucket.activities];
      const draggedActivity = newActivities[draggedIndex];

      // Remove dragged item
      newActivities.splice(draggedIndex, 1);

      // Insert at new position
      newActivities.splice(targetIndex, 0, draggedActivity);

      // Update positions in the database
      const updatedActivities = newActivities.map((activity, index) => ({
        ...activity,
        position: index,
      }));

      await bucketService.updateBucket(bucket.id, {
        activities: updatedActivities,
      });

      onUpdateBucket({
        ...bucket,
        activities: updatedActivities,
      });

      setDraggedItem(null);
      setDragOverItem(null);
    } catch (err) {
      console.error("Error reordering activities:", err);
      setError("Failed to reorder activities. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddActivity();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (onBackToDashboard) {
                    onBackToDashboard();
                  } else {
                    navigate("/dashboard");
                  }
                }}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>

              <div className="h-6 w-px bg-gray-300" />

              {isEditingName ? (
                <div className="flex items-center space-x-2">
                  <Input
                    value={bucketName}
                    onChange={(e) => setBucketName(e.target.value)}
                    onBlur={handleNameSave}
                    onKeyPress={(e) => e.key === "Enter" && handleNameSave()}
                    className="text-xl font-bold border-none shadow-none p-0 h-auto"
                    autoFocus
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold text-gray-900">
                    {bucket.name}
                  </h1>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingName(true)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={handleDrawActivity}
                disabled={bucket.activities.length === 0}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Draw Activity
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Bucket
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDeleteBucket}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Bucket
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="mb-8">
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <span>{bucket.activities.length} activities</span>
            <span>Created {bucket.createdAt.toLocaleDateString()}</span>
          </div>
        </div>

        {/* Add Activity */}
        <Card className="mb-6 bg-white/70 backdrop-blur-sm border border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add New Activity</span>
            </CardTitle>
            <CardDescription>
              Add a new 30-minute activity to your bucket
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Take a mindful walk, Try a new recipe..."
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddActivity}
                  disabled={!newActivity.trim() || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <Textarea
                placeholder="Add a description (optional)..."
                value={newActivityDescription}
                onChange={(e) => setNewActivityDescription(e.target.value)}
                className="min-h-[60px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Activities List */}
        <Card className="bg-white/70 backdrop-blur-sm border border-white/20">
          <CardHeader>
            <CardTitle>Activities</CardTitle>
            <CardDescription>
              Drag and drop to reorder activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bucket.activities.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No activities yet</p>
                <p className="text-sm">
                  Add your first activity to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {bucket.activities.map((activity, index) => (
                  <div
                    key={activity.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, activity.id)}
                    onDragOver={(e) => handleDragOver(e, activity.id)}
                    onDragLeave={handleDragLeave}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, activity.id)}
                    className={`flex items-center gap-3 p-4 rounded-lg border transition-all cursor-move group ${
                      draggedItem === activity.id
                        ? "opacity-50 bg-gray-100"
                        : dragOverItem === activity.id
                        ? "bg-blue-50 border-blue-300 shadow-md"
                        : "bg-white border-gray-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-500">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-900 font-medium">
                        {activity.text}
                      </div>
                      {activity.description && (
                        <div className="text-sm text-gray-600 mt-1">
                          {activity.description}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveActivity(activity.id)}
                      disabled={isLoading}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Timer Modal */}
      {selectedActivity && (
        <ActivityTimerModal
          isOpen={isTimerModalOpen}
          onClose={() => {
            setIsTimerModalOpen(false);
            setSelectedActivity(null);
          }}
          activity={{
            text: selectedActivity.text,
            description: selectedActivity.description,
          }}
        />
      )}
    </div>
  );
}
