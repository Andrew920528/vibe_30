import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Plus,
  X,
  Sparkles,
  Coffee,
  Dumbbell,
  BookOpen,
  Music,
  Heart,
} from "lucide-react";

interface BucketTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  activities: Array<{ text: string; description?: string }>;
  color: string;
}

const BUCKET_TEMPLATES: BucketTemplate[] = [
  {
    id: "morning-routine",
    name: "Morning Routine",
    description: "Start your day with energy and purpose",
    icon: <Coffee className="w-5 h-5" />,
    color: "from-orange-400 to-yellow-500",
    activities: [
      {
        text: "Drink a glass of water",
        description: "Hydrate your body after a night's rest",
      },
      {
        text: "Do 10 minutes of stretching",
        description: "Wake up your muscles and improve flexibility",
      },
      {
        text: "Write in your journal",
        description: "Reflect on your thoughts and set intentions",
      },
      {
        text: "Plan your day",
        description: "Organize your tasks and priorities",
      },
      {
        text: "Take a quick walk outside",
        description: "Get fresh air and natural light",
      },
    ],
  },
  {
    id: "fitness",
    name: "Fitness & Health",
    description: "Stay active and healthy",
    icon: <Dumbbell className="w-5 h-5" />,
    color: "from-green-400 to-blue-500",
    activities: [
      {
        text: "Do a 20-minute workout",
        description: "Get your heart pumping with a quick exercise session",
      },
      {
        text: "Go for a run",
        description: "Enjoy the outdoors while improving cardiovascular health",
      },
      {
        text: "Practice yoga",
        description: "Find balance and flexibility through mindful movement",
      },
      {
        text: "Take the stairs",
        description: "Incorporate movement into your daily routine",
      },
      {
        text: "Do some push-ups",
        description: "Build upper body strength with this classic exercise",
      },
    ],
  },
  {
    id: "learning",
    name: "Learning & Growth",
    description: "Expand your knowledge and skills",
    icon: <BookOpen className="w-5 h-5" />,
    color: "from-purple-400 to-pink-500",
    activities: [
      {
        text: "Read a chapter of a book",
        description: "Expand your knowledge through reading",
      },
      {
        text: "Watch an educational video",
        description: "Learn something new through visual content",
      },
      {
        text: "Practice a new language",
        description: "Improve your language skills with daily practice",
      },
      {
        text: "Learn a new skill online",
        description: "Take advantage of online learning resources",
      },
      {
        text: "Write down what you learned",
        description: "Reinforce learning through note-taking",
      },
    ],
  },
  {
    id: "creativity",
    name: "Creative Expression",
    description: "Unleash your creative potential",
    icon: <Sparkles className="w-5 h-5" />,
    color: "from-pink-400 to-rose-500",
    activities: [
      {
        text: "Draw or sketch something",
        description: "Express yourself through visual art",
      },
      {
        text: "Write a short story",
        description: "Let your imagination flow through words",
      },
      {
        text: "Play a musical instrument",
        description: "Create melodies and rhythms",
      },
      {
        text: "Take creative photos",
        description: "Capture moments from a new perspective",
      },
      {
        text: "Try a new art technique",
        description: "Experiment with different creative methods",
      },
    ],
  },
  {
    id: "mindfulness",
    name: "Mindfulness & Wellness",
    description: "Find peace and balance",
    icon: <Heart className="w-5 h-5" />,
    color: "from-teal-400 to-cyan-500",
    activities: [
      {
        text: "Practice meditation",
        description: "Find inner peace and clarity",
      },
      {
        text: "Do breathing exercises",
        description: "Calm your mind and reduce stress",
      },
      {
        text: "Take a mindful walk",
        description: "Connect with nature and your surroundings",
      },
      {
        text: "Practice gratitude",
        description: "Reflect on the positive aspects of your life",
      },
      {
        text: "Listen to calming music",
        description: "Soothe your mind with peaceful sounds",
      },
    ],
  },
  {
    id: "entertainment",
    name: "Fun & Entertainment",
    description: "Relax and have a good time",
    icon: <Music className="w-5 h-5" />,
    color: "from-indigo-400 to-purple-500",
    activities: [
      {
        text: "Listen to your favorite music",
        description: "Enjoy your favorite songs and discover new ones",
      },
      { text: "Watch a funny video", description: "Laugh and boost your mood" },
      {
        text: "Play a board game",
        description: "Have fun with friends or family",
      },
      {
        text: "Call a friend",
        description: "Connect with someone you care about",
      },
      {
        text: "Try a new hobby",
        description: "Explore a new interest or skill",
      },
    ],
  },
];

interface BucketCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBucket: (bucket: {
    name: string;
    activities: Array<{ text: string; description?: string }>;
  }) => void;
}

export default function BucketCreationModal({
  isOpen,
  onClose,
  onCreateBucket,
}: BucketCreationModalProps) {
  const [bucketName, setBucketName] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<BucketTemplate | null>(null);
  const [customActivities, setCustomActivities] = useState<
    Array<{ text: string; description?: string }>
  >([]);
  const [newActivity, setNewActivity] = useState("");
  const [newActivityDescription, setNewActivityDescription] = useState("");

  const handleTemplateSelect = (template: BucketTemplate) => {
    setSelectedTemplate(template);
    setBucketName(template.name);
    setCustomActivities([...template.activities]);
  };

  const handleAddActivity = () => {
    if (newActivity.trim()) {
      setCustomActivities([
        ...customActivities,
        {
          text: newActivity.trim(),
          description: newActivityDescription.trim() || undefined,
        },
      ]);
      setNewActivity("");
      setNewActivityDescription("");
    }
  };

  const handleRemoveActivity = (index: number) => {
    setCustomActivities(customActivities.filter((_, i) => i !== index));
  };

  const handleCreateBucket = () => {
    if (bucketName.trim() && customActivities.length > 0) {
      onCreateBucket({
        name: bucketName.trim(),
        activities: customActivities,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setBucketName("");
    setSelectedTemplate(null);
    setCustomActivities([]);
    setNewActivity("");
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddActivity();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create New Bucket
          </DialogTitle>
          <DialogDescription>
            Choose a template or create your own bucket of 30-minute activities
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bucket Name */}
          <div className="space-y-2">
            <Label htmlFor="bucket-name" className="text-sm font-medium">
              Bucket Name
            </Label>
            <Input
              id="bucket-name"
              placeholder="e.g., My Morning Routine"
              value={bucketName}
              onChange={(e) => setBucketName(e.target.value)}
              className="text-lg"
            />
          </div>

          {/* Template Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Choose a Template (Optional)
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {BUCKET_TEMPLATES.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedTemplate?.id === template.id
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardHeader className="pb-2">
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-r ${template.color} flex items-center justify-center text-white mb-2`}
                    >
                      {template.icon}
                    </div>
                    <CardTitle className="text-sm">{template.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Activities Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Activities ({customActivities.length})
            </Label>

            {/* Add New Activity */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a new activity..."
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddActivity}
                  disabled={!newActivity.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <Textarea
                placeholder="Add a description (optional)..."
                value={newActivityDescription}
                onChange={(e) => setNewActivityDescription(e.target.value)}
                className="min-h-[60px]"
              />
            </div>

            {/* Activities List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {customActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium">{activity.text}</div>
                    {activity.description && (
                      <div className="text-xs text-gray-600 mt-1">
                        {activity.description}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveActivity(index)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-500 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {customActivities.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No activities yet</p>
                <p className="text-sm">Add some activities to get started!</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateBucket}
              disabled={!bucketName.trim() || customActivities.length === 0}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Create Bucket
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
