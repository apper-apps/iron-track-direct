import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/lib/utils";
const ExerciseCard = ({ exercise, onClick, isSelected = false }) => {
  const getMuscleGroupColor = (muscleGroup) => {
    const colors = {
      chest: "muscle-chest",
      back: "muscle-back",
      shoulders: "muscle-shoulders",
      arms: "muscle-arms",
      legs: "muscle-legs",
      core: "muscle-core"
    };
    return colors[muscleGroup.toLowerCase()] || "bg-surface";
  };

  return (
    <div
      onClick={() => onClick?.(exercise)}
      className={cn(
        "p-4 bg-surface rounded-lg border transition-all cursor-pointer btn-hover",
        isSelected ? "border-primary bg-primary/10" : "border-gray-600 hover:border-gray-500"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", getMuscleGroupColor(exercise.muscleGroup))}>
            <ApperIcon name="Dumbbell" size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-100">{exercise.name}</h3>
            <p className="text-sm text-gray-400">{exercise.equipment}</p>
          </div>
        </div>
        <Badge variant="default">{exercise.muscleGroup}</Badge>
      </div>
    </div>
  );
};

export default ExerciseCard;