import type { NextApiRequest, NextApiResponse } from 'next';

interface DashboardStats {
  totalUsers: number;
  totalDocuments: number;
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardStats>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' } as any);
  }

  // Mock data for demonstration
  const stats: DashboardStats = {
    totalUsers: 1335,
    totalDocuments: 485,
    totalTasks: 127,
    activeTasks: 45,
    completedTasks: 82
  };

  res.status(200).json(stats);
}