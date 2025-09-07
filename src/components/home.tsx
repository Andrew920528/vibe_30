import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, User } from "lucide-react";

function Home() {
  const [isShaking, setIsShaking] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const { user, signOut } = useAuth();

  const activities = [
    "Take a mindful walk",
    "Try a new recipe",
    "Write in your journal",
    "Do a quick workout",
    "Call a friend",
    "Learn something new",
    "Organize your space",
    "Practice meditation",
  ];

  const handleBucketClick = () => {
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      setShowActivity(true);
      setTimeout(() => setShowActivity(false), 3000);
    }, 1000);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Header with User Info */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-900">
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

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Animated Slogan */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-6"
          >
            30 minutes. Infinite vibes.
          </motion.h1>

          {/* App Name and Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
              Vibe-30
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Create buckets of 30-minute activities and let chance decide your
              next adventure. Turn everyday moments into meaningful experiences.
            </p>
          </motion.div>

          {/* Interactive Bucket Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12 relative"
          >
            <div className="flex justify-center items-center relative">
              {/* Bucket */}
              <motion.div
                animate={
                  isShaking
                    ? {
                        rotate: [-2, 2, -2, 2, 0],
                        x: [-5, 5, -5, 5, 0],
                      }
                    : {}
                }
                transition={{ duration: 0.5, repeat: isShaking ? 2 : 0 }}
                onClick={handleBucketClick}
                className="cursor-pointer"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-b from-yellow-200 to-yellow-400 rounded-2xl shadow-lg flex items-center justify-center border-4 border-yellow-300 hover:shadow-xl transition-shadow duration-300">
                  <div className="text-4xl md:text-5xl">🪣</div>
                </div>
              </motion.div>

              {/* Activity Card */}
              {showActivity && (
                <motion.div
                  initial={{ opacity: 0, scale: 0, y: 0 }}
                  animate={{ opacity: 1, scale: 1, y: -100 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg p-4 border-2 border-purple-200 min-w-48"
                >
                  <p className="text-purple-700 font-medium text-center">
                    {activities[Math.floor(Math.random() * activities.length)]}
                  </p>
                </motion.div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Click the bucket to see the magic! ✨
            </p>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-16"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </Button>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Create Buckets
            </h3>
            <p className="text-gray-600">
              Organize your activities into themed buckets for different moods
              and moments.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="text-3xl mb-4">🎲</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Random Draw
            </h3>
            <p className="text-gray-600">
              Let chance decide your next 30-minute adventure. No more decision
              fatigue!
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="text-3xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Share & Discover
            </h3>
            <p className="text-gray-600">
              Share your buckets with friends and discover new activities from
              the community.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;
