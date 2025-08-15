import React, { useEffect, useState } from "react";
import WorkoutHeader from "@/components/molecules/WorkoutHeader";
import WorkoutTracker from "@/components/organisms/WorkoutTracker";
import RoutineBuilder from "@/components/organisms/RoutineBuilder";
import ProgressChart from "@/components/organisms/ProgressChart";
import ExerciseSelector from "@/components/organisms/ExerciseSelector";
import { workoutService } from "@/services/api/workoutService";
import { toast } from 'react-toastify'
import { cn } from "@/utils/cn";
import ApperIcon from '@/components/ApperIcon'
const Dashboard = () => {
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [activeTab, setActiveTab] = useState("routines");
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);

  useEffect(() => {
    let interval;
    if (isWorkoutActive) {
      interval = setInterval(() => {
        setWorkoutDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive]);

  const handleStartWorkout = (routine) => {
    const workout = {
      id: Date.now(),
      routineName: routine?.name || "Quick Workout",
      date: new Date().toISOString(),
      exercises: routine?.exercises ? routine.exercises.map(id => {
        // In a real app, we'd fetch the full exercise data
        return { Id: id, name: `Exercise ${id}`, muscleGroup: "Mixed", equipment: "Various" };
      }) : [],
      duration: 0
    };
    setActiveWorkout(workout);
    setIsWorkoutActive(true);
    setWorkoutDuration(0);
    setActiveTab("workout");
    toast.success("Workout started!");
  };

  const handleEndWorkout = async () => {
    if (activeWorkout) {
      try {
        const completedWorkout = {
          ...activeWorkout,
          duration: workoutDuration,
          sets: [] // In a real app, we'd collect the actual sets
        };
        await workoutService.create(completedWorkout);
        toast.success("Workout completed!");
      } catch (err) {
        toast.error("Failed to save workout");
      }
    }
    setActiveWorkout(null);
    setIsWorkoutActive(false);
    setWorkoutDuration(0);
    setActiveTab("routines");
  };

  const handlePauseWorkout = () => {
    setIsWorkoutActive(!isWorkoutActive);
    toast.info(isWorkoutActive ? "Workout paused" : "Workout resumed");
  };

  const handleAddExerciseToWorkout = (exercise) => {
    if (activeWorkout) {
      setActiveWorkout(prev => ({
        ...prev,
        exercises: [...prev.exercises, exercise]
      }));
      setShowExerciseSelector(false);
      toast.success(`Added ${exercise.name} to workout`);
    }
  };

  const tabs = [
    { id: "routines", label: "Routines", icon: "ListTodo" },
    { id: "workout", label: "Workout", icon: "Dumbbell" },
    { id: "progress", label: "Progress", icon: "TrendingUp" }
  ];

  return (
    <div className="min-h-screen bg-background bodybuilder-bg workout-pattern">
      <div className="min-h-screen bg-background/80">
        <div className="container mx-auto px-4 py-6">
          {/* Active Workout Header */}
          {activeWorkout && (
            <div className="mb-6">
              <WorkoutHeader
                workout={activeWorkout}
                isActive={isWorkoutActive}
                duration={workoutDuration}
                onStart={() => setIsWorkoutActive(true)}
                onEnd={handleEndWorkout}
                onPause={handlePauseWorkout}
              />
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex items-center gap-4 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all btn-hover",
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "bg-surface text-gray-300 hover:bg-gray-600"
                )}
              >
                <ApperIcon name={tab.icon} size={20} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Primary Content */}
            <div className="lg:col-span-2">
              {activeTab === "routines" && (
                <RoutineBuilder onStartWorkout={handleStartWorkout} />
              )}
              {activeTab === "workout" && (
                <WorkoutTracker
                  workout={activeWorkout}
                  onUpdateWorkout={setActiveWorkout}
                  onAddExercise={() => setShowExerciseSelector(true)}
                />
              )}
              {activeTab === "progress" && <ProgressChart />}
            </div>

            {/* Right Column - Secondary Content */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-surface rounded-lg border border-gray-600 p-6">
                <h3 className="text-lg font-display font-bold text-white mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">This Week</span>
                    <span className="text-xl font-bold text-white">3 workouts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Volume</span>
                    <span className="text-xl font-bold text-warning">12,450 lbs</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">PRs This Month</span>
                    <span className="text-xl font-bold text-success">5 PRs</span>
                  </div>
                </div>
              </div>

              {/* Motivational Quote */}
              <div className="bg-gradient-to-br from-primary/20 to-warning/20 rounded-lg border border-primary/30 p-6">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/30 p-2 rounded-lg">
                    <ApperIcon name="Zap" size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-2">
                      "The iron never lies to you. It will always tell you exactly what you are."
                    </p>
                    <p className="text-sm text-gray-400">- Henry Rollins</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-surface rounded-lg border border-gray-600 p-6">
                <h3 className="text-lg font-display font-bold text-white mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                    <div className="bg-success/20 p-2 rounded-lg">
                      <ApperIcon name="CheckCircle" size={16} className="text-success" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">Completed Push Day</p>
                      <p className="text-xs text-gray-400">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                    <div className="bg-warning/20 p-2 rounded-lg">
                      <ApperIcon name="Trophy" size={16} className="text-warning" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">New PR: Bench Press 225lbs</p>
                      <p className="text-xs text-gray-400">Yesterday</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <ApperIcon name="Target" size={16} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">Created new routine</p>
                      <p className="text-xs text-gray-400">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Selector Modal */}
      <ExerciseSelector
        isOpen={showExerciseSelector}
        onClose={() => setShowExerciseSelector(false)}
        onSelect={handleAddExerciseToWorkout}
      />
    </div>
  );
};

export default Dashboard;