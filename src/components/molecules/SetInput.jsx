import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const SetInput = ({ set, onUpdate, onComplete, setNumber, showPR = false }) => {
  const [reps, setReps] = useState(set.reps || "");
  const [weight, setWeight] = useState(set.weight || "");

  const handleRepsChange = (value) => {
    setReps(value);
    onUpdate({ ...set, reps: parseInt(value) || 0 });
  };

  const handleWeightChange = (value) => {
    setWeight(value);
    onUpdate({ ...set, weight: parseFloat(value) || 0 });
  };

  const handleComplete = () => {
    if (reps && weight) {
      onComplete();
    }
  };

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 bg-background rounded-lg border transition-all",
      set.completed ? "border-success bg-success/10" : "border-surface"
    )}>
      <div className="flex items-center gap-1 min-w-[40px]">
        <span className="text-sm font-medium text-gray-300">#{setNumber}</span>
        {showPR && (
          <Badge variant="pr" className="text-xs">
            PR
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <div className="weight-plate px-3 py-2 rounded-lg min-w-[80px] text-center">
          <input
            type="number"
            placeholder="lbs"
            value={weight}
            onChange={(e) => handleWeightChange(e.target.value)}
            className="w-full bg-transparent text-center text-white font-bold focus:outline-none"
            disabled={set.completed}
          />
        </div>
        
        <ApperIcon name="X" size={16} className="text-gray-400" />
        
        <div className="px-3 py-2 bg-surface rounded-lg min-w-[60px] text-center">
          <input
            type="number"
            placeholder="reps"
            value={reps}
            onChange={(e) => handleRepsChange(e.target.value)}
            className="w-full bg-transparent text-center text-white focus:outline-none"
            disabled={set.completed}
          />
        </div>
      </div>
      
      {set.completed ? (
        <div className="flex items-center gap-2 text-success">
          <ApperIcon name="CheckCircle" size={20} />
          <span className="text-sm font-medium">Complete</span>
        </div>
      ) : (
        <Button
          onClick={handleComplete}
          disabled={!reps || !weight}
          size="sm"
          variant="success"
          className="ml-auto"
        >
          <ApperIcon name="Check" size={16} />
        </Button>
      )}
    </div>
  );
};

export default SetInput;