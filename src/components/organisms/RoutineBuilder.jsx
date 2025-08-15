import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ExerciseSelector from "@/components/organisms/ExerciseSelector";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { routineService } from "@/services/api/routineService";
import { toast } from "react-toastify";

const RoutineBuilder = ({ onStartWorkout }) => {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showBuilder, setShowBuilder] = useState(false);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [newRoutine, setNewRoutine] = useState({ name: "", exercises: [] });

  const loadRoutines = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await routineService.getAll();
      setRoutines(data);
    } catch (err) {
      setError("Failed to load routines. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutines();
  }, []);

  const handleSaveRoutine = async () => {
    if (!newRoutine.name.trim()) {
      toast.error("Please enter a routine name");
      return;
    }
    if (newRoutine.exercises.length === 0) {
      toast.error("Please add at least one exercise");
      return;
    }

    try {
      const routine = {
        name: newRoutine.name,
        exercises: newRoutine.exercises.map(e => e.Id)
      };
      await routineService.create(routine);
      toast.success("Routine saved successfully!");
      setShowBuilder(false);
      setNewRoutine({ name: "", exercises: [] });
      loadRoutines();
    } catch (err) {
      toast.error("Failed to save routine");
    }
  };

  const handleExerciseSelect = (exercise) => {
    const isSelected = newRoutine.exercises.some(e => e.Id === exercise.Id);
    if (isSelected) {
      setNewRoutine(prev => ({
        ...prev,
        exercises: prev.exercises.filter(e => e.Id !== exercise.Id)
      }));
    } else {
      setNewRoutine(prev => ({
        ...prev,
        exercises: [...prev.exercises, exercise]
      }));
    }
  };

  const removeExercise = (exerciseId) => {
    setNewRoutine(prev => ({
      ...prev,
      exercises: prev.exercises.filter(e => e.Id !== exerciseId)
    }));
  };

  const handleStartRoutine = (routine) => {
    onStartWorkout(routine);
  };

  const handleDeleteRoutine = async (routineId) => {
    if (window.confirm("Are you sure you want to delete this routine?")) {
      try {
        await routineService.delete(routineId);
        toast.success("Routine deleted");
        loadRoutines();
      } catch (err) {
        toast.error("Failed to delete routine");
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadRoutines} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-white">
          Workout Routines
        </h2>
        <Button
          onClick={() => setShowBuilder(true)}
          variant="primary"
        >
          <ApperIcon name="Plus" size={20} />
          Create Routine
        </Button>
      </div>

      {/* Routines List */}
      {routines.length === 0 ? (
        <Empty
          title="No Routines"
          description="Create your first workout routine to get started"
          actionLabel="Create Routine"
          onAction={() => setShowBuilder(true)}
          icon="ListTodo"
        />
      ) : (
        <div className="grid gap-4">
          {routines.map((routine) => (
            <div
              key={routine.Id}
              className="bg-surface rounded-lg border border-gray-600 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/20 p-3 rounded-lg">
                    <ApperIcon name="ListTodo" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {routine.name}
                    </h3>
                    <p className="text-gray-400">
                      {routine.exercises.length} exercises
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleStartRoutine(routine)}
                    variant="primary"
                  >
                    <ApperIcon name="Play" size={16} />
                    Start
                  </Button>
                  <Button
                    onClick={() => handleDeleteRoutine(routine.Id)}
                    variant="error"
                    size="sm"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Routine Builder Modal */}
      {showBuilder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-surface rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-surface">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-display font-bold text-white">
                  Create New Routine
                </h3>
                <Button
                  onClick={() => setShowBuilder(false)}
                  variant="ghost"
                  size="sm"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <Input
                label="Routine Name"
                placeholder="Enter routine name..."
                value={newRoutine.name}
                onChange={(e) => setNewRoutine(prev => ({ ...prev, name: e.target.value }))}
              />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-300">
                    Exercises ({newRoutine.exercises.length})
                  </label>
                  <Button
                    onClick={() => setShowExerciseSelector(true)}
                    variant="outline"
                    size="sm"
                  >
                    <ApperIcon name="Plus" size={16} />
                    Add Exercise
                  </Button>
                </div>

                {newRoutine.exercises.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                    <ApperIcon name="Dumbbell" size={32} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400">No exercises added yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {newRoutine.exercises.map((exercise) => (
                      <div
                        key={exercise.Id}
                        className="flex items-center justify-between p-3 bg-surface rounded-lg border border-gray-600"
                      >
                        <div className="flex items-center gap-3">
                          <ApperIcon name="GripVertical" size={16} className="text-gray-400" />
                          <div>
                            <span className="font-medium text-white">
                              {exercise.name}
                            </span>
                            <p className="text-sm text-gray-400">
                              {exercise.muscleGroup}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => removeExercise(exercise.Id)}
                          variant="ghost"
                          size="sm"
                        >
                          <ApperIcon name="X" size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-surface">
                <Button
                  onClick={() => setShowBuilder(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveRoutine}
                  variant="primary"
                  className="flex-1"
                >
                  Save Routine
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exercise Selector */}
      <ExerciseSelector
        isOpen={showExerciseSelector}
        onClose={() => setShowExerciseSelector(false)}
        onSelect={handleExerciseSelect}
        selectedExercises={newRoutine.exercises}
      />
    </div>
  );
};

export default RoutineBuilder;