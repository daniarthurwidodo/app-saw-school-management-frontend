import type { NextApiRequest, NextApiResponse } from 'next';
import { updateSubtask, deleteSubtask } from '../../../../../lib/taskStorage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { taskId, subtaskId } = req.query;

  if (!taskId || typeof taskId !== 'string' || !subtaskId || typeof subtaskId !== 'string') {
    return res.status(400).json({ error: 'Task ID and Subtask ID are required' });
  }

  try {
    switch (req.method) {
      case 'PUT':
        await handlePut(taskId, subtaskId, req, res);
        break;
      case 'DELETE':
        await handleDelete(taskId, subtaskId, res);
        break;
      default:
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handlePut(taskId: string, subtaskId: string, req: NextApiRequest, res: NextApiResponse) {
  const updates = req.body;

  // Remove id from updates to prevent modification
  delete updates.id;

  const updatedSubtask = await updateSubtask(taskId, subtaskId, updates);

  if (!updatedSubtask) {
    return res.status(404).json({ error: 'Task or subtask not found' });
  }

  res.status(200).json(updatedSubtask);
}

async function handleDelete(taskId: string, subtaskId: string, res: NextApiResponse) {
  const success = await deleteSubtask(taskId, subtaskId);

  if (!success) {
    return res.status(404).json({ error: 'Task or subtask not found' });
  }

  res.status(204).end();
}