import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  LogOut,
  User,
  Settings,
  BarChart3,
  Calendar,
  Target,
  Plus,
  Edit3,
  Trash2,
  Shuffle,
  Loader2,
} from "lucide-react";
import BucketCreationModal from "./BucketCreationModal";
import BucketDetailPage from "./BucketDetailPage";
import {
  bucketService,
  Bucket,
  CreateBucketData,
} from "../services/bucketService";

// Remove local interfaces since we're importing from bucketService

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState<Bucket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load buckets from database on component mount
  useEffect(() => {
    const loadBuckets = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);
        const userBuckets = await bucketService.getBuckets();
        setBuckets(userBuckets);
      } catch (err) {
        console.error("Error loading buckets:", err);
        setError("Failed to load buckets. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadBuckets();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const handleCreateBucket = async (bucketData: CreateBucketData) => {
    try {
      setError(null);
      const newBucket = await bucketService.createBucket(bucketData);
      setBuckets([newBucket, ...buckets]);
    } catch (err) {
      console.error("Error creating bucket:", err);
      setError("Failed to create bucket. Please try again.");
    }
  };

  const handleUpdateBucket = async (updatedBucket: Bucket) => {
    try {
      setError(null);
      await bucketService.updateBucket(updatedBucket.id, {
        name: updatedBucket.name,
        activities: updatedBucket.activities,
      });
      setBuckets(
        buckets.map((bucket) =>
          bucket.id === updatedBucket.id ? updatedBucket : bucket
        )
      );
    } catch (err) {
      console.error("Error updating bucket:", err);
      setError("Failed to update bucket. Please try again.");
    }
  };

  const handleDeleteBucket = async (bucketId: string) => {
    try {
      setError(null);
      await bucketService.deleteBucket(bucketId);
      setBuckets(buckets.filter((bucket) => bucket.id !== bucketId));
    } catch (err) {
      console.error("Error deleting bucket:", err);
      setError("Failed to delete bucket. Please try again.");
    }
  };

  const handleDrawRandomActivity = (bucket: Bucket) => {
    if (bucket.activities.length > 0) {
      const randomIndex = Math.floor(Math.random() * bucket.activities.length);
      const selectedActivity = bucket.activities[randomIndex];
      alert(
        `🎯 Your random activity from "${bucket.name}": ${selectedActivity.text}`
      );
    }
  };

  // If a bucket is selected, show the bucket detail page
  if (selectedBucket) {
    return (
      <BucketDetailPage
        bucket={selectedBucket}
        onUpdateBucket={(updatedBucket) => {
          handleUpdateBucket(updatedBucket);
          setSelectedBucket(updatedBucket);
        }}
        onDeleteBucket={(bucketId) => {
          handleDeleteBucket(bucketId);
          setSelectedBucket(null);
        }}
        onBackToDashboard={() => setSelectedBucket(null)}
      />
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
          <p className="text-gray-600">Loading your buckets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Welcome back,{" "}
                  {user?.user_metadata?.full_name || user?.email || "User"}
                </p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Your Vibe-30 Dashboard
          </h2>
          <p className="text-gray-600">
            Manage your activity buckets and track your 30-minute adventures.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Activities
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {buckets.reduce(
                  (total, bucket) => total + bucket.activities.length,
                  0
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Activities in your buckets
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Today
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                30-minute sessions completed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Buckets
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{buckets.length}</div>
              <p className="text-xs text-muted-foreground">
                Buckets ready to use
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Buckets Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Your Buckets
            </h3>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Bucket
            </Button>
          </div>

          {buckets.length === 0 ? (
            <Card className="bg-white/70 backdrop-blur-sm border border-white/20">
              <CardContent className="text-center py-12">
                <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No buckets yet
                </h4>
                <p className="text-gray-600 mb-6">
                  Create your first bucket to start organizing your 30-minute
                  activities!
                </p>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Bucket
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buckets.map((bucket) => (
                <Card
                  key={bucket.id}
                  className="bg-white/70 backdrop-blur-sm border border-white/20 hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => setSelectedBucket(bucket)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {bucket.name}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                          {bucket.activities.length} activities
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDrawRandomActivity(bucket);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Shuffle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {bucket.activities.slice(0, 3).map((activity, index) => (
                        <div
                          key={activity.id}
                          className="text-sm text-gray-600 truncate"
                        >
                          {index + 1}. {activity.text}
                        </div>
                      ))}
                      {bucket.activities.length > 3 && (
                        <div className="text-sm text-gray-500">
                          +{bucket.activities.length - 3} more activities
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          Created {bucket.createdAt.toLocaleDateString()}
                        </span>
                        <span className="text-purple-600 font-medium">
                          Click to manage
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">🚀 Coming Soon</CardTitle>
              <CardDescription className="text-blue-700">
                We're working on exciting new features for your Vibe-30
                experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Bucket sharing with friends</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Activity tracking and analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Custom activity categories</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Mobile app for iOS and Android</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bucket Creation Modal */}
      <BucketCreationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateBucket={handleCreateBucket}
      />
    </div>
  );
}
