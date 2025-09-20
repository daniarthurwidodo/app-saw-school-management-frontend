import fs from 'fs';
import path from 'path';
import type { Task, Subtask } from '../components/kanban';

interface TasksData {
  tasks: Task[];
  summary: {
    totalTasks: number;
    totalSubtasks: number;
    byStatus: {
      todo: { tasks: number; subtasks: number };
      in_progress: { tasks: number; subtasks: number };
      done: { tasks: number; subtasks: number };
    };
    byPriority: {
      high: number;
      medium: number;
      low: number;
    };
    totalEstimatedHours: number;
    completedHours: number;
  };
  settings: {
    statuses: string[];
    priorities: string[];
    defaultStatus: string;
    defaultPriority: string;
  };
}

const TASKS_FILE_PATH = path.join(process.cwd(), 'public', 'data', 'tasks.json');

// Helper function to calculate summary statistics
function calculateSummary(tasks: Task[]): TasksData['summary'] {
  const summary = {
    totalTasks: tasks.length,
    totalSubtasks: tasks.reduce((acc, task) => acc + task.subtasks.length, 0),
    byStatus: {
      todo: { tasks: 0, subtasks: 0 },
      in_progress: { tasks: 0, subtasks: 0 },
      done: { tasks: 0, subtasks: 0 }
    },
    byPriority: {
      high: 0,
      medium: 0,
      low: 0
    },
    totalEstimatedHours: 0,
    completedHours: 0
  };

  tasks.forEach(task => {
    // Count tasks by status
    summary.byStatus[task.status].tasks++;

    // Count tasks by priority
    summary.byPriority[task.priority]++;

    // Count subtasks by status
    task.subtasks.forEach(subtask => {
      summary.byStatus[subtask.status].subtasks++;
    });

    // Calculate hours
    summary.totalEstimatedHours += task.estimatedHours;
    if (task.completedDate) {
      summary.completedHours += task.actualHours || task.estimatedHours;
    }
  });

  return summary;
}

export async function readTasksData(): Promise<TasksData> {
  try {
    console.log('Reading tasks from:', TASKS_FILE_PATH);

    // Check if file exists
    try {
      await fs.promises.access(TASKS_FILE_PATH);
    } catch (accessError) {
      console.error('Tasks file does not exist:', TASKS_FILE_PATH);
      throw new Error(`Tasks file not found: ${TASKS_FILE_PATH}`);
    }

    const fileContent = await fs.promises.readFile(TASKS_FILE_PATH, 'utf-8');
    console.log('File content length:', fileContent.length);

    const data: TasksData = JSON.parse(fileContent);
    console.log('Parsed tasks count:', data.tasks?.length || 0);

    return data;
  } catch (error) {
    console.error('Error reading tasks file:', error);
    console.error('File path attempted:', TASKS_FILE_PATH);
    throw new Error(`Failed to read tasks data: ${error.message}`);
  }
}

export async function writeTasksData(tasks: Task[]): Promise<void> {
  try {
    console.log('Writing tasks to:', TASKS_FILE_PATH);
    console.log('Tasks to write:', tasks.length);

    const existingData = await readTasksData();
    const updatedData: TasksData = {
      ...existingData,
      tasks,
      summary: calculateSummary(tasks)
    };

    const jsonContent = JSON.stringify(updatedData, null, 2);
    console.log('JSON content length:', jsonContent.length);

    await fs.promises.writeFile(TASKS_FILE_PATH, jsonContent, 'utf-8');
    console.log('Successfully wrote tasks file');

    // Verify the write by reading it back
    const verification = await fs.promises.readFile(TASKS_FILE_PATH, 'utf-8');
    const verifiedData = JSON.parse(verification);
    console.log('Verification: tasks count after write:', verifiedData.tasks.length);

  } catch (error) {
    console.error('Error writing tasks file:', error);
    console.error('File path attempted:', TASKS_FILE_PATH);
    throw new Error(`Failed to write tasks data: ${error.message}`);
  }
}

export async function createTask(task: Task): Promise<Task> {
  const data = await readTasksData();
  const newTask = {
    ...task,
    id: `task-${data.tasks.length + 1}`,
    createdDate: new Date().toISOString().split('T')[0]
  };

  data.tasks.push(newTask);
  await writeTasksData(data.tasks);
  return newTask;
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
  const data = await readTasksData();
  const taskIndex = data.tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return null;
  }

  data.tasks[taskIndex] = { ...data.tasks[taskIndex], ...updates };
  await writeTasksData(data.tasks);
  return data.tasks[taskIndex];
}

export async function deleteTask(taskId: string): Promise<boolean> {
  const data = await readTasksData();
  const initialLength = data.tasks.length;
  data.tasks = data.tasks.filter(t => t.id !== taskId);

  if (data.tasks.length === initialLength) {
    return false; // Task not found
  }

  await writeTasksData(data.tasks);
  return true;
}

export async function addSubtask(taskId: string, subtask: Subtask): Promise<Subtask | null> {
  const data = await readTasksData();
  const taskIndex = data.tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return null;
  }

  const task = data.tasks[taskIndex];
  const newSubtask = {
    ...subtask,
    id: `subtask-${taskId.split('-')[1]}-${task.subtasks.length + 1}`
  };

  task.subtasks.push(newSubtask);
  await writeTasksData(data.tasks);
  return newSubtask;
}

export async function updateSubtask(taskId: string, subtaskId: string, updates: Partial<Subtask>): Promise<Subtask | null> {
  const data = await readTasksData();
  const taskIndex = data.tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return null;
  }

  const task = data.tasks[taskIndex];
  const subtaskIndex = task.subtasks.findIndex(st => st.id === subtaskId);

  if (subtaskIndex === -1) {
    return null;
  }

  task.subtasks[subtaskIndex] = { ...task.subtasks[subtaskIndex], ...updates };
  await writeTasksData(data.tasks);
  return task.subtasks[subtaskIndex];
}

export async function deleteSubtask(taskId: string, subtaskId: string): Promise<boolean> {
  const data = await readTasksData();
  const taskIndex = data.tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return false;
  }

  const task = data.tasks[taskIndex];
  const initialLength = task.subtasks.length;
  task.subtasks = task.subtasks.filter(st => st.id !== subtaskId);

  if (task.subtasks.length === initialLength) {
    return false; // Subtask not found
  }

  await writeTasksData(data.tasks);
  return true;
}