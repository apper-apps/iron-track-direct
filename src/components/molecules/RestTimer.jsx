import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const RestTimer = ({ duration = 120, onComplete, isActive = false }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isActive && !isRunning) {
      setTimeLeft(duration);
      setIsRunning(true);
    }
  }, [isActive, duration]);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  if (!isActive && !isRunning) return null;

  return (
    <div className="fixed top-4 right-4 bg-surface rounded-lg p-4 border border-gray-600 z-50">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 32 32">
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="currentColor"
              strokeWidth="2"
              fill="transparent"
              className="text-gray-600"
            />
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="currentColor"
              strokeWidth="2"
              fill="transparent"
              strokeDasharray={`${progress} ${100 - progress}`}
              className="text-primary timer-ring"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-white">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-300">Rest Time</span>
          <div className="flex gap-2">
            {isRunning ? (
              <Button
                onClick={() => setIsRunning(false)}
                size="sm"
                variant="secondary"
              >
                <ApperIcon name="Pause" size={16} />
              </Button>
            ) : (
              <Button
                onClick={() => setIsRunning(true)}
                size="sm"
                variant="primary"
              >
                <ApperIcon name="Play" size={16} />
              </Button>
            )}
            <Button
              onClick={() => {
                setIsRunning(false);
                setTimeLeft(duration);
              }}
              size="sm"
              variant="outline"
            >
              <ApperIcon name="RotateCcw" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestTimer;