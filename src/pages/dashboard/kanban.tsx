import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const KanbanBoard = () => {
  const [Board, setBoard] = useState(null);
  const [boardData, setBoardData] = useState({
    lanes: [
      {
        id: 'lane1',
        title: 'To Do',
        label: '2/2',
        cards: [
          {
            id: 'Card1',
            title: 'Math Homework',
            description: 'Chapter 5 exercises',
            label: '30 mins',
            metadata: { assignedTo: 'John Doe' }
          },
          {
            id: 'Card2',
            title: 'Science Project',
            description: 'Research on climate change',
            label: '2 days',
            metadata: { assignedTo: 'Jane Smith' }
          }
        ]
      },
      {
        id: 'lane2',
        title: 'In Progress',
        label: '1/1',
        cards: [
          {
            id: 'Card3',
            title: 'English Essay',
            description: 'Shakespeare analysis',
            label: '2 hours',
            metadata: { assignedTo: 'Mike Johnson' }
          }
        ]
      },
      {
        id: 'lane3',
        title: 'Review',
        label: '1/1',
        cards: [
          {
            id: 'Card4',
            title: 'History Presentation',
            description: 'World War II impact',
            label: 'Ready',
            metadata: { assignedTo: 'Sarah Williams' }
          }
        ]
      },
      {
        id: 'lane4',
        title: 'Completed',
        label: '3/3',
        cards: [
          {
            id: 'Card5',
            title: 'Physics Lab Report',
            description: 'Experiment on motion',
            label: 'Done',
            metadata: { assignedTo: 'Tom Brown' }
          },
          {
            id: 'Card6',
            title: 'Art Project',
            description: 'Renaissance artists study',
            label: 'Done',
            metadata: { assignedTo: 'Lisa Garcia' }
          }
        ]
      }
    ]
  });

  useEffect(() => {
    // Dynamically import the Board component on the client side
    import('react-trello').then((module) => {
      setBoard(() => module.default);
    });
  }, []);

  const handleCardMove = (cardId, sourceLaneId, targetLaneId) => {
    console.log(`Card ${cardId} moved from ${sourceLaneId} to ${targetLaneId}`);
    // In a real application, you would update your backend here
  };

  const handleCardAdd = (card, laneId) => {
    console.log(`Card added to lane ${laneId}:`, card);
    // In a real application, you would add to your backend here
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Kanban Board</h1>
        <p className="text-gray-600">Manage assignments and tasks using the Kanban board.</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">Assignment Tracking</h2>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md">
            + Add New Task
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-full" style={{ minHeight: '500px' }}>
            {Board ? (
              <Board
                data={boardData}
                draggable
                collapsibleLanes
                onCardMoveAcrossLanes={handleCardMove}
                onCardAdd={handleCardAdd}
                style={{ backgroundColor: 'white' }}
              />
            ) : (
              <div className="flex items-center justify-center h-64">
                <p>Loading Kanban board...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KanbanBoard;