import exerciseData from "@/services/mockData/exercises.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const exerciseService = {
  async getAll() {
    await delay(300);
    return [...exerciseData];
  },

  async getById(id) {
    await delay(200);
    const exercise = exerciseData.find(item => item.Id === parseInt(id));
    if (!exercise) {
      throw new Error("Exercise not found");
    }
    return { ...exercise };
  },

  async getByMuscleGroup(muscleGroup) {
    await delay(250);
    return exerciseData.filter(exercise => 
      exercise.muscleGroup.toLowerCase() === muscleGroup.toLowerCase()
    ).map(exercise => ({ ...exercise }));
  },

  async create(exercise) {
    await delay(300);
    const newExercise = {
      ...exercise,
      Id: Math.max(...exerciseData.map(e => e.Id)) + 1
    };
    exerciseData.push(newExercise);
    return { ...newExercise };
  },

  async update(id, exerciseData) {
    await delay(250);
    const index = exerciseData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Exercise not found");
    }
    const updatedExercise = { ...exerciseData[index], ...exerciseData };
    exerciseData[index] = updatedExercise;
    return { ...updatedExercise };
  },

  async delete(id) {
    await delay(200);
    const index = exerciseData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Exercise not found");
    }
    exerciseData.splice(index, 1);
    return true;
  }
};