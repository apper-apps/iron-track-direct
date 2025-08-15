import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { workoutService } from "@/services/api/workoutService";
import { exerciseService } from "@/services/api/exerciseService";

const ProgressChart = () => {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("30"); // days

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [workoutData, exerciseData] = await Promise.all([
        workoutService.getAll(),
        exerciseService.getAll()
      ]);
      setWorkouts(workoutData);
      setExercises(exerciseData);
      if (exerciseData.length > 0 && !selectedExercise) {
        setSelectedExercise(exerciseData[0].Id);
      }
    } catch (err) {
      setError("Failed to load progress data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getProgressData = () => {
    if (!selectedExercise || workouts.length === 0) return [];

    const exerciseWorkouts = workouts
      .filter(workout => {
        const exerciseSet = workout.sets?.find(set => set.exerciseId === selectedExercise);
        return exerciseSet && workout.date;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeRange));

    const filteredWorkouts = exerciseWorkouts.filter(workout => 
      new Date(workout.date) >= cutoffDate
    );

    return filteredWorkouts.map(workout => {
      const exerciseSets = workout.sets.filter(set => set.exerciseId === selectedExercise);
      const maxWeight = Math.max(...exerciseSets.map(set => set.weight || 0));
      const totalVolume = exerciseSets.reduce((sum, set) => sum + (set.weight || 0) * (set.reps || 0), 0);
      
      return {
        x: new Date(workout.date).getTime(),
        weight: maxWeight,
        volume: totalVolume,
        sets: exerciseSets.length
      };
    });
  };

  const progressData = getProgressData();
  const selectedExerciseData = exercises.find(e => e.Id === selectedExercise);

  const chartOptions = {
    chart: {
      type: "line",
      background: "transparent",
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    theme: { mode: "dark" },
    colors: ["#DC2626", "#F59E0B"],
    stroke: {
      curve: "smooth",
      width: 3
    },
    grid: {
      borderColor: "#374151",
      strokeDashArray: 0,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } }
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: { colors: "#9CA3AF" },
        format: "MMM dd"
      },
      axisBorder: { color: "#374151" },
      axisTicks: { color: "#374151" }
    },
    yaxis: [
      {
        title: {
          text: "Max Weight (lbs)",
          style: { color: "#DC2626" }
        },
        labels: { style: { colors: "#9CA3AF" } },
        axisBorder: { show: true, color: "#374151" },
        axisTicks: { show: true, color: "#374151" }
      },
      {
        opposite: true,
        title: {
          text: "Volume (lbs × reps)",
          style: { color: "#F59E0B" }
        },
        labels: { style: { colors: "#9CA3AF" } },
        axisBorder: { show: true, color: "#374151" },
        axisTicks: { show: true, color: "#374151" }
      }
    ],
    legend: {
      labels: { colors: "#9CA3AF" },
      position: "top",
      horizontalAlign: "right"
    },
    tooltip: {
      theme: "dark",
      shared: true,
      intersect: false
    },
    dataLabels: { enabled: false }
  };

  const chartSeries = [
    {
      name: "Max Weight",
      type: "line",
      yAxisIndex: 0,
      data: progressData.map(d => ({ x: d.x, y: d.weight }))
    },
    {
      name: "Volume",
      type: "line",
      yAxisIndex: 1,
      data: progressData.map(d => ({ x: d.x, y: d.volume }))
    }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-white">
          Progress Tracking
        </h2>
      </div>

      {/* Controls */}
      <div className="bg-surface rounded-lg border border-gray-600 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Exercise
            </label>
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-surface rounded-lg text-gray-100 focus:outline-none focus:border-primary"
            >
              {exercises.map((exercise) => (
                <option key={exercise.Id} value={exercise.Id}>
                  {exercise.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Time Range
            </label>
            <div className="flex gap-2">
              {["7", "30", "90"].map((days) => (
                <Button
                  key={days}
                  onClick={() => setTimeRange(days)}
                  variant={timeRange === days ? "primary" : "outline"}
                  size="sm"
                >
                  {days}d
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {selectedExerciseData && progressData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface rounded-lg border border-gray-600 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary/20 p-2 rounded-lg">
                <ApperIcon name="TrendingUp" size={20} className="text-primary" />
              </div>
              <span className="text-sm text-gray-400">Current Max</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {Math.max(...progressData.map(d => d.weight))} lbs
            </div>
          </div>

          <div className="bg-surface rounded-lg border border-gray-600 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-warning/20 p-2 rounded-lg">
                <ApperIcon name="BarChart3" size={20} className="text-warning" />
              </div>
              <span className="text-sm text-gray-400">Best Volume</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {Math.max(...progressData.map(d => d.volume)).toLocaleString()}
            </div>
          </div>

          <div className="bg-surface rounded-lg border border-gray-600 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-success/20 p-2 rounded-lg">
                <ApperIcon name="Calendar" size={20} className="text-success" />
              </div>
              <span className="text-sm text-gray-400">Workouts</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {progressData.length}
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-surface rounded-lg border border-gray-600 p-6">
        {progressData.length === 0 ? (
          <Empty
            title="No Progress Data"
            description={`No workout data found for ${selectedExerciseData?.name || "this exercise"} in the selected time range`}
            icon="BarChart3"
          />
        ) : (
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              {selectedExerciseData?.name} Progress
            </h3>
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="line"
              height={300}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressChart;