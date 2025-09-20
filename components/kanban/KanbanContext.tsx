import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Utility function to move items in an array
function arrayMove<T>(array: T[], oldIndex: number, newIndex: number): T[] {
  const result = Array.from(array);
  const [removed] = result.splice(oldIndex, 1);
  result.splice(newIndex, 0, removed);
  return result;
}

export interface Subtask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  assignee: string;
  assigneeId: number;
  estimatedHours: number;
  actualHours?: number;
  startedDate?: string;
  completedDate?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  assigneeId: number;
  reporter: string;
  reporterId: number;
  createdDate: string;
  dueDate: string;
  completedDate?: string;
  estimatedHours: number;
  actualHours?: number;
  labels: string[];
  subtasks: Subtask[];
}

export interface TaskOrder {
  todo: string[];
  in_progress: string[];
  done: string[];
}

export interface KanbanState {
  tasks: Task[];
  taskOrder: TaskOrder;
  loading: boolean;
  activeId: string | null;
  draggedItem: { type: 'task' | 'subtask'; id: string; parentId?: string } | null;
  selectedTask: Task | null;
  selectedSubtask: { subtask: Subtask; parentTask: Task } | null;
}

type KanbanAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'SET_TASK_ORDER'; payload: TaskOrder }
  | { type: 'SET_ACTIVE_ID'; payload: string | null }
  | { type: 'SET_DRAGGED_ITEM'; payload: { type: 'task' | 'subtask'; id: string; parentId?: string } | null }
  | { type: 'SET_SELECTED_TASK'; payload: Task | null }
  | { type: 'SET_SELECTED_SUBTASK'; payload: { subtask: Subtask; parentTask: Task } | null }
  | { type: 'UPDATE_TASK_STATUS'; payload: { taskId: string; newStatus: 'todo' | 'in_progress' | 'done'; isSubtask?: boolean; parentTaskId?: string } }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'ADD_SUBTASK'; payload: { parentTaskId: string; subtask: Subtask } }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'UPDATE_SUBTASK'; payload: { parentTaskId: string; subtask: Subtask } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'DELETE_SUBTASK'; payload: { parentTaskId: string; subtaskId: string } }
  | { type: 'REORDER_TASKS'; payload: { status: 'todo' | 'in_progress' | 'done'; oldIndex: number; newIndex: number } }
  | { type: 'MOVE_TASK_BETWEEN_COLUMNS'; payload: { taskId: string; fromStatus: 'todo' | 'in_progress' | 'done'; toStatus: 'todo' | 'in_progress' | 'done' } };

const initialState: KanbanState = {
  tasks: [],
  taskOrder: {
    todo: [],
    in_progress: [],
    done: []
  },
  loading: true,
  activeId: null,
  draggedItem: null,
  selectedTask: null,
  selectedSubtask: null
};

function kanbanReducer(state: KanbanState, action: KanbanAction): KanbanState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_TASKS':
      return { ...state, tasks: action.payload };

    case 'SET_TASK_ORDER':
      return { ...state, taskOrder: action.payload };

    case 'SET_ACTIVE_ID':
      return { ...state, activeId: action.payload };

    case 'SET_DRAGGED_ITEM':
      return { ...state, draggedItem: action.payload };

    case 'SET_SELECTED_TASK':
      return { ...state, selectedTask: action.payload };

    case 'SET_SELECTED_SUBTASK':
      return { ...state, selectedSubtask: action.payload };

    case 'UPDATE_TASK_STATUS': {
      const { taskId, newStatus, isSubtask, parentTaskId } = action.payload;

      const updatedTasks = state.tasks.map(task => {
        if (isSubtask && task.id === parentTaskId) {
          return {
            ...task,
            subtasks: task.subtasks.map(subtask =>
              subtask.id === taskId
                ? {
                    ...subtask,
                    status: newStatus,
                    startedDate: newStatus === 'in_progress' && !subtask.startedDate ? new Date().toISOString().split('T')[0] : subtask.startedDate,
                    completedDate: newStatus === 'done' ? new Date().toISOString().split('T')[0] : undefined
                  }
                : subtask
            )
          };
        } else if (!isSubtask && task.id === taskId) {
          return {
            ...task,
            status: newStatus,
            completedDate: newStatus === 'done' ? new Date().toISOString().split('T')[0] : undefined
          };
        }
        return task;
      });

      return { ...state, tasks: updatedTasks };
    }

    case 'ADD_TASK': {
      const newTask = action.payload;
      return {
        ...state,
        tasks: [...state.tasks, newTask],
        taskOrder: {
          ...state.taskOrder,
          todo: [...state.taskOrder.todo, newTask.id]
        }
      };
    }

    case 'ADD_SUBTASK': {
      const { parentTaskId, subtask } = action.payload;
      const updatedTasks = state.tasks.map(task => {
        if (task.id === parentTaskId) {
          return {
            ...task,
            subtasks: [...task.subtasks, subtask]
          };
        }
        return task;
      });

      return { ...state, tasks: updatedTasks };
    }

    case 'UPDATE_TASK': {
      const updatedTask = action.payload;
      const updatedTasks = state.tasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      );

      return { ...state, tasks: updatedTasks };
    }

    case 'UPDATE_SUBTASK': {
      const { parentTaskId, subtask } = action.payload;
      const updatedTasks = state.tasks.map(task => {
        if (task.id === parentTaskId) {
          return {
            ...task,
            subtasks: task.subtasks.map(st =>
              st.id === subtask.id ? subtask : st
            )
          };
        }
        return task;
      });

      return { ...state, tasks: updatedTasks };
    }

    case 'DELETE_TASK': {
      const taskIdToDelete = action.payload;
      const updatedTasks = state.tasks.filter(task => task.id !== taskIdToDelete);

      // Remove from task order as well
      const updatedTaskOrder = {
        todo: state.taskOrder.todo.filter(id => id !== taskIdToDelete),
        in_progress: state.taskOrder.in_progress.filter(id => id !== taskIdToDelete),
        done: state.taskOrder.done.filter(id => id !== taskIdToDelete)
      };

      return {
        ...state,
        tasks: updatedTasks,
        taskOrder: updatedTaskOrder
      };
    }

    case 'DELETE_SUBTASK': {
      const { parentTaskId, subtaskId } = action.payload;
      const updatedTasks = state.tasks.map(task => {
        if (task.id === parentTaskId) {
          return {
            ...task,
            subtasks: task.subtasks.filter(st => st.id !== subtaskId)
          };
        }
        return task;
      });

      return { ...state, tasks: updatedTasks };
    }

    case 'REORDER_TASKS': {
      const { status, oldIndex, newIndex } = action.payload;
      const updatedTaskOrder = {
        ...state.taskOrder,
        [status]: arrayMove(state.taskOrder[status], oldIndex, newIndex)
      };

      return { ...state, taskOrder: updatedTaskOrder };
    }

    case 'MOVE_TASK_BETWEEN_COLUMNS': {
      const { taskId, fromStatus, toStatus } = action.payload;
      const updatedTaskOrder = { ...state.taskOrder };

      // Remove from old column
      updatedTaskOrder[fromStatus] = updatedTaskOrder[fromStatus].filter(id => id !== taskId);

      // Add to new column
      updatedTaskOrder[toStatus] = [...updatedTaskOrder[toStatus], taskId];

      return { ...state, taskOrder: updatedTaskOrder };
    }

    default:
      return state;
  }
}

interface KanbanContextType {
  state: KanbanState;
  dispatch: React.Dispatch<KanbanAction>;
  // Convenience methods
  setLoading: (loading: boolean) => void;
  setTasks: (tasks: Task[]) => void;
  setTaskOrder: (taskOrder: TaskOrder) => void;
  setActiveId: (id: string | null) => void;
  setDraggedItem: (item: { type: 'task' | 'subtask'; id: string; parentId?: string } | null) => void;
  setSelectedTask: (task: Task | null) => void;
  setSelectedSubtask: (subtask: { subtask: Subtask; parentTask: Task } | null) => void;
  updateTaskStatus: (taskId: string, newStatus: 'todo' | 'in_progress' | 'done', isSubtask?: boolean, parentTaskId?: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdDate'>) => Promise<Task>;
  addSubtask: (parentTaskId: string, subtask: Omit<Subtask, 'id'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  updateSubtask: (parentTaskId: string, subtaskId: string, updates: Partial<Subtask>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  deleteSubtask: (parentTaskId: string, subtaskId: string) => Promise<void>;
  reorderTasks: (status: 'todo' | 'in_progress' | 'done', oldIndex: number, newIndex: number) => void;
  moveTaskBetweenColumns: (taskId: string, fromStatus: 'todo' | 'in_progress' | 'done', toStatus: 'todo' | 'in_progress' | 'done') => void;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (context === undefined) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
};

interface KanbanProviderProps {
  children: ReactNode;
}

export const KanbanProvider: React.FC<KanbanProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(kanbanReducer, initialState);

  // Convenience methods
  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setTasks = (tasks: Task[]) => {
    dispatch({ type: 'SET_TASKS', payload: tasks });
  };

  const setTaskOrder = (taskOrder: TaskOrder) => {
    dispatch({ type: 'SET_TASK_ORDER', payload: taskOrder });
  };

  const setActiveId = (id: string | null) => {
    dispatch({ type: 'SET_ACTIVE_ID', payload: id });
  };

  const setDraggedItem = (item: { type: 'task' | 'subtask'; id: string; parentId?: string } | null) => {
    dispatch({ type: 'SET_DRAGGED_ITEM', payload: item });
  };

  const setSelectedTask = (task: Task | null) => {
    dispatch({ type: 'SET_SELECTED_TASK', payload: task });
  };

  const setSelectedSubtask = (subtask: { subtask: Subtask; parentTask: Task } | null) => {
    dispatch({ type: 'SET_SELECTED_SUBTASK', payload: subtask });
  };

  const updateTaskStatus = async (taskId: string, newStatus: 'todo' | 'in_progress' | 'done', isSubtask?: boolean, parentTaskId?: string) => {
    try {
      if (isSubtask && parentTaskId) {
        // Update subtask status
        const response = await fetch(`/api/tasks/${parentTaskId}/subtasks/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: newStatus,
            ...(newStatus === 'in_progress' && { startedDate: new Date().toISOString().split('T')[0] }),
            ...(newStatus === 'done' && { completedDate: new Date().toISOString().split('T')[0] })
          })
        });

        if (!response.ok) throw new Error('Failed to update subtask status');
      } else {
        // Update task status
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: newStatus,
            ...(newStatus === 'done' && { completedDate: new Date().toISOString().split('T')[0] })
          })
        });

        if (!response.ok) throw new Error('Failed to update task status');
      }

      // Update local state
      dispatch({ type: 'UPDATE_TASK_STATUS', payload: { taskId, newStatus, isSubtask, parentTaskId } });
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'createdDate'>): Promise<Task> => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });

      if (!response.ok) throw new Error('Failed to create task');

      const newTask = await response.json();
      dispatch({ type: 'ADD_TASK', payload: newTask });
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const addSubtask = async (parentTaskId: string, subtask: Omit<Subtask, 'id'>) => {
    try {
      const response = await fetch(`/api/tasks/${parentTaskId}/subtasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subtask)
      });

      if (!response.ok) throw new Error('Failed to create subtask');

      const newSubtask = await response.json();
      dispatch({ type: 'ADD_SUBTASK', payload: { parentTaskId, subtask: newSubtask } });
    } catch (error) {
      console.error('Error creating subtask:', error);
      throw error;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update task');

      const updatedTask = await response.json();
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const updateSubtask = async (parentTaskId: string, subtaskId: string, updates: Partial<Subtask>) => {
    try {
      const response = await fetch(`/api/tasks/${parentTaskId}/subtasks/${subtaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update subtask');

      const updatedSubtask = await response.json();
      dispatch({ type: 'UPDATE_SUBTASK', payload: { parentTaskId, subtask: updatedSubtask } });
    } catch (error) {
      console.error('Error updating subtask:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete task');

      dispatch({ type: 'DELETE_TASK', payload: taskId });
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const deleteSubtask = async (parentTaskId: string, subtaskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${parentTaskId}/subtasks/${subtaskId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete subtask');

      dispatch({ type: 'DELETE_SUBTASK', payload: { parentTaskId, subtaskId } });
    } catch (error) {
      console.error('Error deleting subtask:', error);
      throw error;
    }
  };

  const reorderTasks = (status: 'todo' | 'in_progress' | 'done', oldIndex: number, newIndex: number) => {
    dispatch({ type: 'REORDER_TASKS', payload: { status, oldIndex, newIndex } });
  };

  const moveTaskBetweenColumns = (taskId: string, fromStatus: 'todo' | 'in_progress' | 'done', toStatus: 'todo' | 'in_progress' | 'done') => {
    dispatch({ type: 'MOVE_TASK_BETWEEN_COLUMNS', payload: { taskId, fromStatus, toStatus } });
  };

  const value: KanbanContextType = {
    state,
    dispatch,
    setLoading,
    setTasks,
    setTaskOrder,
    setActiveId,
    setDraggedItem,
    setSelectedTask,
    setSelectedSubtask,
    updateTaskStatus,
    addTask,
    addSubtask,
    updateTask,
    updateSubtask,
    deleteTask,
    deleteSubtask,
    reorderTasks,
    moveTaskBetweenColumns
  };

  return (
    <KanbanContext.Provider value={value}>
      {children}
    </KanbanContext.Provider>
  );
};