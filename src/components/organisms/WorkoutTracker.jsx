import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SetInput from "@/components/molecules/SetInput";
import RestTimer from "@/components/molecules/RestTimer";
import Empty from "@/components/ui/Empty";

const WorkoutTracker = ({ workout, onUpdateWorkout, onAddExercise }) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [exerciseData, setExerciseData] = useState({});

  useEffect(() => {
    if (workout?.exercises) {
      const initialData = {};
      workout.exercises.forEach((exercise, exerciseIndex) => {
        initialData[exercise.Id] = {
          sets: Array.from({ length: 3 }, (_, setIndex) => ({
            id: `${exercise.Id}-${setIndex}`,
            exerciseId: exercise.Id,
            reps: 0,
            weight: 0,
            completed: false
          }))
        };
      });
      setExerciseData(initialData);
    }
  }, [workout]);

  const handleSetUpdate = (exerciseId, setIndex, updatedSet) => {
    setExerciseData(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        sets: prev[exerciseId].sets.map((set, index) => 
          index === setIndex ? updatedSet : set
        )
      }
    }));
  };

  const handleSetComplete = (exerciseId, setIndex) => {
    const updatedData = { ...exerciseData };
    updatedData[exerciseId].sets[setIndex].completed = true;
    setExerciseData(updatedData);
    setShowRestTimer(true);
  };

  const addSet = (exerciseId) => {
    const currentSets = exerciseData[exerciseId]?.sets || [];
    const newSetIndex = currentSets.length;
    setExerciseData(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        sets: [
          ...currentSets,
          {
            id: `${exerciseId}-${newSetIndex}`,
            exerciseId,
            reps: 0,
            weight: 0,
            completed: false
          }
        ]
      }
    }));
  };

  if (!workout?.exercises || workout.exercises.length === 0) {
    return (
      <div className="bg-surface rounded-lg border border-gray-600 p-6">
        <Empty
          title="No Exercises"
          description="Add exercises to start your workout"
          actionLabel="Add Exercise"
          onAction={onAddExercise}
          icon="Plus"
        />
      </div>
    );
  }

  const currentExerciseData = workout.exercises[currentExercise];
  const currentSets = exerciseData[currentExerciseData?.Id]?.sets || [];

  return (
    <div className="space-y-6">
      <RestTimer
        duration={120}
        isActive={showRestTimer}
        onComplete={() => setShowRestTimer(false)}
      />

      {/* Exercise Navigation */}
      <div className="bg-surface rounded-lg border border-gray-600 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-bold text-white">
            Exercise {currentExercise + 1} of {workout.exercises.length}
          </h3>
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
              disabled={currentExercise === 0}
              variant="outline"
              size="sm"
            >
              <ApperIcon name="ChevronLeft" size={16} />
            </Button>
            <Button
              onClick={() => setCurrentExercise(Math.min(workout.exercises.length - 1, currentExercise + 1))}
              disabled={currentExercise === workout.exercises.length - 1}
              variant="outline"
              size="sm"
            >
              <ApperIcon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="bg-primary/20 p-3 rounded-lg">
            <ApperIcon name="Dumbbell" size={24} className="text-primary" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-white">
              {currentExerciseData?.name}
            </h4>
            <p className="text-gray-400">
              {currentExerciseData?.muscleGroup} • {currentExerciseData?.equipment}
            </p>
          </div>
        </div>
      </div>

      {/* Sets */}
      <div className="bg-surface rounded-lg border border-gray-600 p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-white">Sets</h4>
          <Button
            onClick={() => addSet(currentExerciseData.Id)}
            variant="outline"
            size="sm"
          >
            <ApperIcon name="Plus" size={16} />
            Add Set
          </Button>
        </div>

        <div className="space-y-3">
          {currentSets.map((set, index) => (
            <SetInput
              key={set.id}
              set={set}
              setNumber={index + 1}
              onUpdate={(updatedSet) => handleSetUpdate(currentExerciseData.Id, index, updatedSet)}
              onComplete={() => handleSetComplete(currentExerciseData.Id, index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutTracker;