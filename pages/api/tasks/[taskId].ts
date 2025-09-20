import type { NextApiRequest, NextApiResponse } from 'next';
import { readTasksData, updateTask, deleteTask } from '../../../lib/taskStorage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { taskId } = req.query;

  if (!taskId || typeof taskId !== 'string') {
    return res.status(400).json({ error: 'Task ID is required' });
  }

  try {
    switch (req.method) {
      case 'GET':
        await handleGet(taskId, res);
        break;
      case 'PUT':
        await handlePut(taskId, req, res);
        break;
      case 'DELETE':
        await handleDelete(taskId, res);
        break;
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGet(taskId: string, res: NextApiResponse) {
  const data = await readTasksData();
  const task = data.tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(200).json(task);
}

async function handlePut(taskId: string, req: NextApiRequest, res: NextApiResponse) {
  const updates = req.body;

  // Remove id from updates to prevent modification
  delete updates.id;

  const updatedTask = await updateTask(taskId, updates);

  if (!updatedTask) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(200).json(updatedTask);
}

async function handleDelete(taskId: string, res: NextApiResponse) {
  const success = await deleteTask(taskId);

  if (!success) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(204).end();
}