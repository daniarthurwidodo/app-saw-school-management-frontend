import type { NextApiRequest, NextApiResponse } from 'next';
import { addSubtask } from '../../../../../lib/taskStorage';
import type { Subtask } from '../../../../../components/kanban';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { taskId } = req.query;

  if (!taskId || typeof taskId !== 'string') {
    return res.status(400).json({ error: 'Task ID is required' });
  }

  try {
    switch (req.method) {
      case 'POST':
        await handlePost(taskId, req, res);
        break;
      default:
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handlePost(taskId: string, req: NextApiRequest, res: NextApiResponse) {
  const subtaskData = req.body as Partial<Subtask>;

  // Validate required fields
  if (!subtaskData.title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  // Create the subtask with default values
  const newSubtask: Subtask = {
    id: '', // Will be set by addSubtask
    title: subtaskData.title,
    description: subtaskData.description || '',
    status: subtaskData.status || 'todo',
    assignee: subtaskData.assignee || 'Unassigned',
    assigneeId: subtaskData.assigneeId || 1,
    estimatedHours: subtaskData.estimatedHours || 4
  };

  const createdSubtask = await addSubtask(taskId, newSubtask);

  if (!createdSubtask) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(201).json(createdSubtask);
}