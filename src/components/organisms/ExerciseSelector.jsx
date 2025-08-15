import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ExerciseCard from "@/components/molecules/ExerciseCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { exerciseService } from "@/services/api/exerciseService";

const ExerciseSelector = ({ isOpen, onClose, onSelect, selectedExercises = [] }) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("all");

  const muscleGroups = ["all", "chest", "back", "shoulders", "arms", "legs", "core"];

  const loadExercises = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await exerciseService.getAll();
      setExercises(data);
    } catch (err) {
      setError("Failed to load exercises. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadExercises();
    }
  }, [isOpen]);

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscleGroup = selectedMuscleGroup === "all" || 
      exercise.muscleGroup.toLowerCase() === selectedMuscleGroup;
    return matchesSearch && matchesMuscleGroup;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-background border border-surface rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface">
          <h2 className="text-2xl font-display font-bold text-white">
            Select Exercises
          </h2>
          <Button onClick={onClose} variant="ghost" size="sm">
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 space-y-4 border-b border-surface">
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          
          <div className="flex flex-wrap gap-2">
            {muscleGroups.map((group) => (
              <Button
                key={group}
                onClick={() => setSelectedMuscleGroup(group)}
                variant={selectedMuscleGroup === group ? "primary" : "outline"}
                size="sm"
              >
                {group.charAt(0).toUpperCase() + group.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Exercise List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && <Loading />}
          {error && <Error message={error} onRetry={loadExercises} />}
          {!loading && !error && filteredExercises.length === 0 && (
            <Empty
              title="No Exercises Found"
              description="Try adjusting your search or filter criteria"
              icon="Search"
            />
          )}
          {!loading && !error && filteredExercises.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.Id}
                  exercise={exercise}
                  onClick={onSelect}
                  isSelected={selectedExercises.some(e => e.Id === exercise.Id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseSelector;