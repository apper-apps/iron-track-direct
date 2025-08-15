import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const WorkoutHeader = ({ 
  workout, 
  isActive, 
  duration, 
  onStart, 
  onEnd, 
  onPause 
}) => {
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-surface border border-gray-600 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary/20 p-3 rounded-lg">
            <ApperIcon name="Dumbbell" size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-white">
              {workout?.routineName || "Quick Workout"}
            </h2>
            <div className="flex items-center gap-4 mt-1">
              {isActive && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">
                    {formatDuration(duration)}
                  </span>
                </div>
              )}
              <Badge variant="default">
                {workout?.sets?.length || 0} exercises
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          {!isActive ? (
            <Button onClick={onStart} variant="primary">
              <ApperIcon name="Play" size={20} />
              Start Workout
            </Button>
          ) : (
            <>
              <Button onClick={onPause} variant="secondary">
                <ApperIcon name="Pause" size={20} />
              </Button>
              <Button onClick={onEnd} variant="error">
                <ApperIcon name="Square" size={20} />
                End
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutHeader;