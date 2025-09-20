import type { NextApiRequest, NextApiResponse } from 'next';
import { readTasksData, writeTasksData, createTask } from '../../../lib/taskStorage';
import type { Task } from '../../../components/kanban';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        await handleGet(req, res);
        break;
      case 'POST':
        await handlePost(req, res);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { search, priority, assignee, status } = req.query;

  // Set cache headers to prevent caching
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const data = await readTasksData();
  let tasks = data.tasks;

  // Apply filters
  if (search && typeof search === 'string') {
    const searchLower = search.toLowerCase();
    tasks = tasks.filter(task =>
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower)
    );
  }

  if (priority && priority !== 'all' && typeof priority === 'string') {
    tasks = tasks.filter(task => task.priority === priority);
  }

  if (assignee && assignee !== 'all' && typeof assignee === 'string') {
    tasks = tasks.filter(task => task.assigneeId.toString() === assignee);
  }

  if (status && status !== 'all' && typeof status === 'string') {
    tasks = tasks.filter(task => task.status === status);
  }

  res.status(200).json({
    tasks,
    summary: data.summary,
    settings: data.settings,
    totalCount: data.tasks.length,
    filteredCount: tasks.length
  });
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const taskData = req.body as Partial<Task>;

  // Validate required fields
  if (!taskData.title || !taskData.description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  // Create the task with default values
  const newTask: Task = {
    id: '', // Will be set by createTask
    title: taskData.title,
    description: taskData.description,
    status: taskData.status || 'todo',
    priority: taskData.priority || 'medium',
    assignee: taskData.assignee || 'Unassigned',
    assigneeId: taskData.assigneeId || 1,
    reporter: taskData.reporter || 'System',
    reporterId: taskData.reporterId || 99,
    createdDate: new Date().toISOString().split('T')[0],
    dueDate: taskData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estimatedHours: taskData.estimatedHours || 8,
    labels: taskData.labels || [],
    subtasks: []
  };

  const createdTask = await createTask(newTask);
  res.status(201).json(createdTask);
}