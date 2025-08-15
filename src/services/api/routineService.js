import routineData from "@/services/mockData/routines.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const routineService = {
  async getAll() {
    await delay(300);
    return [...routineData];
  },

  async getById(id) {
    await delay(200);
    const routine = routineData.find(item => item.Id === parseInt(id));
    if (!routine) {
      throw new Error("Routine not found");
    }
    return { ...routine };
  },

  async create(routine) {
    await delay(400);
    const newRoutine = {
      ...routine,
      Id: Math.max(...routineData.map(r => r.Id)) + 1
    };
    routineData.push(newRoutine);
    return { ...newRoutine };
  },

  async update(id, routineUpdate) {
    await delay(300);
    const index = routineData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Routine not found");
    }
    const updatedRoutine = { ...routineData[index], ...routineUpdate };
    routineData[index] = updatedRoutine;
    return { ...updatedRoutine };
  },

  async delete(id) {
    await delay(250);
    const index = routineData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Routine not found");
    }
    routineData.splice(index, 1);
    return true;
  }
};