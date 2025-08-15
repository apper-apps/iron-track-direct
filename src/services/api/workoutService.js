import workoutData from "@/services/mockData/workouts.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const workoutService = {
  async getAll() {
    await delay(350);
    return [...workoutData];
  },

  async getById(id) {
    await delay(200);
    const workout = workoutData.find(item => item.Id === parseInt(id));
    if (!workout) {
      throw new Error("Workout not found");
    }
    return { ...workout };
  },

  async getByDateRange(startDate, endDate) {
    await delay(300);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return workoutData.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= start && workoutDate <= end;
    }).map(workout => ({ ...workout }));
  },

  async create(workout) {
    await delay(400);
    const newWorkout = {
      ...workout,
      Id: Math.max(...workoutData.map(w => w.Id)) + 1
    };
    workoutData.push(newWorkout);
    return { ...newWorkout };
  },

  async update(id, workoutUpdate) {
    await delay(300);
    const index = workoutData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Workout not found");
    }
    const updatedWorkout = { ...workoutData[index], ...workoutUpdate };
    workoutData[index] = updatedWorkout;
    return { ...updatedWorkout };
  },

  async delete(id) {
    await delay(250);
    const index = workoutData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Workout not found");
    }
    workoutData.splice(index, 1);
    return true;
  }
};