import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  X,
  CheckCircle,
  Clock,
} from "lucide-react";

interface ActivityTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: {
    text: string;
    description?: string;
  };
  durationMinutes?: number; // Default to 30 minutes, but configurable
}

// Configuration - easy to change between seconds and minutes
const TIMER_CONFIG = {
  // Set to 0.5 for 30 seconds (for testing), 30 for 30 minutes (production)
  DURATION_MINUTES: 0.5, // 30 seconds for testing
  // Set to 50 for smooth animation (testing), 50 for smooth animation (production)
  INTERVAL_MS: 50, // 50ms intervals for smooth animation
  // Set to 5 for 5 seconds (testing), 5 for 5 minutes (production)
  EXTEND_MINUTES: 5, // 5 minutes extension
};

export default function ActivityTimerModal({
  isOpen,
  onClose,
  activity,
  durationMinutes = TIMER_CONFIG.DURATION_MINUTES,
}: ActivityTimerModalProps) {
  const [timeRemaining, setTimeRemaining] = useState(durationMinutes * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pausedTime, setPausedTime] = useState<number>(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [totalDuration, setTotalDuration] = useState(durationMinutes * 60); // Track total duration

  // Calculate smooth progress based on elapsed time
  const getSmoothProgress = () => {
    if (!isRunning || !startTime)
      return ((totalDuration - timeRemaining) / totalDuration) * 100;

    const now = Date.now();
    const elapsed = (now - startTime) / 1000; // elapsed time in seconds
    const actualElapsed = elapsed - pausedTime;
    const progress = Math.min((actualElapsed / totalDuration) * 100, 100);
    return progress;
  };

  const progress = getSmoothProgress();
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = Math.floor(timeRemaining % 60); // Remove decimal part

  // Format time display
  const formatTime = (mins: number, secs: number) => {
    if (TIMER_CONFIG.DURATION_MINUTES < 1) {
      // For testing with seconds
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    } else {
      // For production with minutes
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
  };

  // Start timer
  const startTimer = () => {
    const now = Date.now();
    setStartTime(now);
    setIsRunning(true);
    setIsPaused(false);
    setIsCompleted(false);
  };

  // Pause timer
  const pauseTimer = () => {
    if (startTime) {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;
      setPausedTime((prev) => prev + elapsed);
    }
    setIsRunning(false);
    setIsPaused(true);
  };

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsCompleted(false);
    setIsAnimating(false);
    setStartTime(null);
    setPausedTime(0);
    setTotalDuration(durationMinutes * 60); // Reset to original duration
    setTimeRemaining(durationMinutes * 60); // Reset to original duration
  };

  // Add 5 minutes
  const addTime = () => {
    const additionalSeconds = TIMER_CONFIG.EXTEND_MINUTES * 60;
    setIsAnimating(true);
    setTotalDuration((prev) => prev + additionalSeconds);
    setTimeRemaining((prev) => prev + additionalSeconds);

    // Reset timing when adding time
    if (isRunning) {
      const now = Date.now();
      setStartTime(now);
      setPausedTime(0);
    }

    // Stop animation after a short delay
    setTimeout(() => setIsAnimating(false), 500);
  };

  // End timer early
  const endTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsAnimating(true);

    // Animate progress to completion smoothly
    const startProgress = progress;
    const targetProgress = 100;
    const duration = 800; // 800ms animation
    const startTime = Date.now();

    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);
      const currentProgress =
        startProgress + (targetProgress - startProgress) * progressRatio;

      // Update time remaining based on progress
      const newTimeRemaining =
        totalDuration - (currentProgress / 100) * totalDuration;
      setTimeRemaining(Math.max(newTimeRemaining, 0));

      if (progressRatio < 1) {
        requestAnimationFrame(animateProgress);
      } else {
        setTimeRemaining(0);
        setTimeout(() => {
          setIsAnimating(false);
          setIsCompleted(true);
        }, 200);
      }
    };

    requestAnimationFrame(animateProgress);
  };

  // Timer effect for smooth updates
  useEffect(() => {
    if (isRunning && startTime) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = (now - startTime) / 1000;
        const actualElapsed = elapsed - pausedTime;
        const remaining = Math.max(totalDuration - actualElapsed, 0);

        setTimeRemaining(remaining);

        if (remaining <= 0) {
          setIsRunning(false);
          setIsAnimating(true);

          // Show completion after a brief animation
          setTimeout(() => {
            setIsAnimating(false);
            setIsCompleted(true);
          }, 500);
        }
      }, TIMER_CONFIG.INTERVAL_MS);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, startTime, pausedTime, totalDuration]);

  // Reset timer when modal opens
  useEffect(() => {
    if (isOpen) {
      setTotalDuration(durationMinutes * 60);
      setTimeRemaining(durationMinutes * 60);
      setIsRunning(false);
      setIsPaused(false);
      setIsCompleted(false);
      setIsAnimating(false);
      setStartTime(null);
      setPausedTime(0);
      setIsDescriptionExpanded(false);
    }
  }, [isOpen, durationMinutes]);

  // Circular Progress Bar Component
  const CircularProgressBar = ({
    progress,
    size = 200,
  }: {
    progress: number;
    size?: number;
  }) => {
    const radius = (size - 16) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    const normalizedProgress = Math.min(Math.max(progress, 0), 100);

    return (
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <div
          className="absolute inset-0 rounded-full border-8 border-gray-200"
          style={{ width: size, height: size }}
        />

        {/* Progress circle using conic-gradient for smooth animation */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-300 ${
            isAnimating
              ? "bg-gradient-to-r from-green-400 to-green-600"
              : isRunning
              ? "bg-gradient-to-r from-blue-400 to-blue-600"
              : "bg-gradient-to-r from-blue-400 to-blue-600"
          }`}
          style={{
            width: size,
            height: size,
            background: `conic-gradient(from 0deg, ${
              isAnimating ? "#10b981" : isRunning ? "#3b82f6" : "#3b82f6"
            } 0deg, ${
              isAnimating ? "#10b981" : isRunning ? "#3b82f6" : "#3b82f6"
            } ${normalizedProgress * 3.6}deg, #e5e7eb ${
              normalizedProgress * 3.6
            }deg, #e5e7eb 360deg)`,
            mask: "radial-gradient(circle, transparent 60%, black 60%)",
            WebkitMask: "radial-gradient(circle, transparent 60%, black 60%)",
          }}
        />

        {/* Time display in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`text-center transition-all ${
              isAnimating
                ? "scale-110 text-green-600"
                : "scale-100 text-gray-900"
            }`}
          >
            <div className="text-4xl font-bold">
              {formatTime(minutes, seconds)}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {TIMER_CONFIG.DURATION_MINUTES < 1 ? "seconds" : "minutes"}{" "}
              remaining
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {isCompleted ? "🎉 Congratulations!" : "Activity Timer"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isCompleted
              ? "You've completed your activity!"
              : "Focus on your activity and track your progress"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Activity Info */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {activity.text}
                </h3>
                {activity.description && (
                  <div className="text-sm text-gray-600">
                    <div
                      className={`transition-all duration-300 ${
                        isDescriptionExpanded
                          ? "max-h-none"
                          : "max-h-12 overflow-hidden"
                      }`}
                    >
                      <p className="leading-relaxed">{activity.description}</p>
                    </div>
                    {activity.description.length > 80 && (
                      <button
                        onClick={() =>
                          setIsDescriptionExpanded(!isDescriptionExpanded)
                        }
                        className="mt-2 text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors flex items-center gap-1 mx-auto"
                      >
                        {isDescriptionExpanded ? (
                          <>
                            <span>Show less</span>
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                          </>
                        ) : (
                          <>
                            <span>Show more</span>
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timer Circle */}
          <div className="flex justify-center">
            <CircularProgressBar progress={progress} size={200} />
          </div>

          {/* Completion Message */}
          {isCompleted && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-600 mb-2">
                  Great job! 🎉
                </h3>
                <p className="text-gray-600">
                  You've successfully completed your 30-minute activity!
                </p>
              </div>
            </div>
          )}

          {/* Timer Controls */}
          {!isCompleted && (
            <div className="space-y-4">
              {/* Main Controls */}
              <div className="flex justify-center space-x-3">
                {!isRunning && !isPaused && (
                  <Button
                    onClick={startTimer}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                )}

                {isRunning && (
                  <Button
                    onClick={pauseTimer}
                    variant="outline"
                    className="px-6 py-2"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                )}

                {isPaused && (
                  <Button
                    onClick={startTimer}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </Button>
                )}

                <Button
                  onClick={endTimer}
                  variant="outline"
                  className="px-6 py-2"
                >
                  <X className="w-4 h-4 mr-2" />
                  End
                </Button>
              </div>

              {/* Secondary Controls */}
              <div className="flex justify-center space-x-2">
                <Button
                  onClick={addTime}
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4 mr-1" />+
                  {TIMER_CONFIG.EXTEND_MINUTES} min
                </Button>

                <Button
                  onClick={resetTimer}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 border-gray-200 hover:bg-gray-50"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-center">
            <Button onClick={onClose} variant="outline" className="px-8 py-2">
              {isCompleted ? "Close" : "Cancel"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
