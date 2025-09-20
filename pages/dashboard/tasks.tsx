import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { Card, Button, Loading } from '../../components/ui';
import Sidebar from '../../components/layout/Sidebar';
import { ProtectedRoute } from '../../components/auth';
import { DebugPanel, useDebug } from '../../components/debug';
import { KanbanProvider, useKanban } from '../../components/kanban';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { dropTargetForExternal } from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/reorder-with-edge';
import {
  Plus,
  Filter,
  Search,
  Menu,
  Calendar,
  User,
  Clock,
  Flag,
  CheckCircle,
  Circle,
  AlertCircle,
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react';

import type { Task, Subtask } from '../../components/kanban';

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

function TasksPageContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');

  // Use Kanban context
  const {
    state: { tasks, loading, taskOrder, selectedTask, selectedSubtask },
    setLoading,
    setTasks,
    setTaskOrder,
    setSelectedTask,
    setSelectedSubtask,
    updateTaskStatus,
    addTask,
    addSubtask,
    updateSubtask,
    deleteTask,
    deleteSubtask,
    moveTaskBetweenColumns,
    reorderTasks
  } = useKanban();
  const [showModal, setShowModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showAddSubtaskModal, setShowAddSubtaskModal] = useState(false);
  const [showEditSubtaskModal, setShowEditSubtaskModal] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    assigneeId: 1,
    dueDate: '',
    estimatedHours: 8,
    labels: [] as string[]
  });
  const [newSubtaskForm, setNewSubtaskForm] = useState({
    title: '',
    description: '',
    assigneeId: 1,
    estimatedHours: 4
  });
  const [editSubtaskForm, setEditSubtaskForm] = useState({
    title: '',
    description: '',
    assigneeId: 1,
    estimatedHours: 4
  });
  
  const { debugInfo, setDebugInfo, isDebugEnabled } = useDebug();

  // Drag state management for pragmatic-drag-and-drop
  const [draggedItem, setDraggedItem] = useState<{ type: 'task' | 'subtask'; id: string; parentId?: string } | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [searchTerm, priorityFilter, assigneeFilter]);


  const fetchTasks = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);
      if (assigneeFilter !== 'all') params.append('assignee', assigneeFilter);

      const apiUrl = `/api/tasks?${params.toString()}`;
      console.log('Fetching tasks from API:', apiUrl);
      setDebugInfo('apiRequest', apiUrl);

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API response received:', data);

      setTasks(data.tasks);

      // Initialize task order based on current task statuses
      const initialOrder = {
        todo: data.tasks.filter((t: any) => t.status === 'todo').map((t: any) => t.id),
        in_progress: data.tasks.filter((t: any) => t.status === 'in_progress').map((t: any) => t.id),
        done: data.tasks.filter((t: any) => t.status === 'done').map((t: any) => t.id)
      };
      setTaskOrder(initialOrder);

      setDebugInfo('apiSuccess', {
        totalCount: data.totalCount,
        filteredCount: data.filteredCount,
        summary: data.summary,
        tasksLoaded: data.tasks.length
      });
      setDebugInfo('dataSource', 'API');
      setLoading(false);
    } catch (error) {
      console.error('API request failed, falling back to static JSON:', error);
      setDebugInfo('apiError', error.message);

      // Fallback to static JSON if API fails
      try {
        console.log('Using fallback: /data/tasks.json');
        const fallbackResponse = await fetch('/data/tasks.json?t=' + Date.now()); // Add cache buster

        if (!fallbackResponse.ok) {
          throw new Error(`Fallback request failed: ${fallbackResponse.status}`);
        }

        const fallbackData: TasksData = await fallbackResponse.json();
        console.log('Fallback data loaded:', fallbackData);

        setTasks(fallbackData.tasks);

        const initialOrder = {
          todo: fallbackData.tasks.filter(t => t.status === 'todo').map(t => t.id),
          in_progress: fallbackData.tasks.filter(t => t.status === 'in_progress').map(t => t.id),
          done: fallbackData.tasks.filter(t => t.status === 'done').map(t => t.id)
        };
        setTaskOrder(initialOrder);

        setDebugInfo('fallbackSuccess', {
          tasksLoaded: fallbackData.tasks.length,
          source: 'static JSON'
        });
        setDebugInfo('dataSource', 'Static JSON (API failed)');
        setLoading(false);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        setDebugInfo('fallbackError', fallbackError.message);
        setDebugInfo('dataSource', 'Failed to load');
        setLoading(false);
      }
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: 'todo' | 'in_progress' | 'done', isSubtask = false, parentTaskId?: string) => {
    console.log('UpdateTaskStatus called:', { taskId, newStatus, isSubtask, parentTaskId });

    // Add animation class before updating
    const cardElement = document.querySelector(`[data-task-id="${taskId}"]`) as HTMLElement;
    if (cardElement) {
      cardElement.classList.add('leaving');

      // Wait for animation before updating state
      setTimeout(async () => {
        try {
          await updateTaskStatus(taskId, newStatus, isSubtask, parentTaskId);
          console.log('Tasks updated successfully');
          setDebugInfo('taskUpdateSuccess', { taskId, newStatus, isSubtask, parentTaskId });

          // Add entering animation to new position
          setTimeout(() => {
            const newCardElement = document.querySelector(`[data-task-id="${taskId}"]`) as HTMLElement;
            if (newCardElement) {
              newCardElement.classList.add('entering');
              setTimeout(() => {
                newCardElement.classList.remove('entering');

                // Add success feedback to the column
                const columnElement = newCardElement.closest('.kanban-column');
                if (columnElement) {
                  columnElement.classList.add('drop-success');
                  setTimeout(() => {
                    columnElement.classList.remove('drop-success');
                  }, 1000);
                }
              }, 400);
            }
          }, 50);
        } catch (error) {
          console.error('Failed to update task status:', error);
          setDebugInfo('taskUpdateError', { taskId, newStatus, isSubtask, parentTaskId, error: error.message });
          // Remove leaving class on error
          if (cardElement) {
            cardElement.classList.remove('leaving');
          }
        }
      }, 300);
    } else {
      // Fallback for immediate update if element not found
      try {
        await updateTaskStatus(taskId, newStatus, isSubtask, parentTaskId);
        console.log('Tasks updated successfully');
        setDebugInfo('taskUpdateSuccess', { taskId, newStatus, isSubtask, parentTaskId });
      } catch (error) {
        console.error('Failed to update task status:', error);
        setDebugInfo('taskUpdateError', { taskId, newStatus, isSubtask, parentTaskId, error: error.message });
      }
    }
  };

  // Handle drop events for pragmatic-drag-and-drop
  const handleDrop = (data: any) => {
    const { source, location } = data;

    if (!location.current.dropTargets.length) return;

    const itemId = source.data.id;
    const itemType = source.data.type;
    const parentId = source.data.parentId;
    const destinationColumnId = location.current.dropTargets[0].data.columnId;

    if (!destinationColumnId) return;

    // Find current status
    let currentStatus: string = '';
    let isSubtask = itemType === 'subtask';

    if (isSubtask) {
      tasks.forEach(t => {
        const subtask = t.subtasks.find(st => st.id === itemId);
        if (subtask) {
          currentStatus = subtask.status;
        }
      });
    } else {
      const task = tasks.find(t => t.id === itemId);
      if (task) {
        currentStatus = task.status;
      }
    }

    // If status is changing, update it
    if (currentStatus !== destinationColumnId) {
      handleUpdateTaskStatus(itemId, destinationColumnId as 'todo' | 'in_progress' | 'done', isSubtask, parentId);

      // Update task order when moving between columns
      if (!isSubtask) {
        moveTaskBetweenColumns(itemId, currentStatus as 'todo' | 'in_progress' | 'done', destinationColumnId as 'todo' | 'in_progress' | 'done');
      }
    }
  };


  const closeModal = () => {
    setShowModal(false);
    setSelectedTask(null);
    setSelectedSubtask(null);
  };

  const openNewTaskModal = () => {
    setShowNewTaskModal(true);
    // Reset form
    setNewTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      assigneeId: 1,
      dueDate: '',
      estimatedHours: 8,
      labels: []
    });
  };

  const closeNewTaskModal = () => {
    setShowNewTaskModal(false);
  };

  const closeAddSubtaskModal = () => {
    setShowAddSubtaskModal(false);
  };

  const closeEditSubtaskModal = () => {
    setShowEditSubtaskModal(false);
  };

  const handleFormChange = (field: string, value: any) => {
    setNewTaskForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubtaskFormChange = (field: string, value: any) => {
    setNewSubtaskForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditSubtaskFormChange = (field: string, value: any) => {
    setEditSubtaskForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const createNewTask = async () => {
    if (!newTaskForm.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    try {
      const newTask = {
        title: newTaskForm.title,
        description: newTaskForm.description,
        status: 'todo' as const,
        priority: newTaskForm.priority,
        assignee: getAssigneeName(newTaskForm.assigneeId),
        assigneeId: newTaskForm.assigneeId,
        reporter: 'Current User', // Would come from auth context
        reporterId: 99,
        dueDate: newTaskForm.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 7 days from now
        estimatedHours: newTaskForm.estimatedHours,
        labels: newTaskForm.labels,
        subtasks: []
      };

      // Add task using context API
      const createdTask = await addTask(newTask);

      // Close modal
      closeNewTaskModal();

      console.log('New task created:', createdTask);
      setDebugInfo('taskCreated', createdTask);
    } catch (error) {
      console.error('Failed to create task:', error);
      setDebugInfo('taskCreateError', error.message);
      alert('Failed to create task. Please try again.');
    }
  };

  const createNewSubtask = async () => {
    if (!newSubtaskForm.title.trim()) {
      alert('Please enter a subtask title');
      return;
    }

    if (!selectedTask) {
      alert('No task selected');
      return;
    }

    try {
      const newSubtask = {
        title: newSubtaskForm.title,
        description: newSubtaskForm.description,
        status: 'todo' as const,
        assignee: getAssigneeName(newSubtaskForm.assigneeId),
        assigneeId: newSubtaskForm.assigneeId,
        estimatedHours: newSubtaskForm.estimatedHours
      };

      // Add subtask using context API
      await addSubtask(selectedTask.id, newSubtask);

      // Close modal
      closeAddSubtaskModal();

      console.log('New subtask created:', newSubtask);
      setDebugInfo('subtaskCreated', newSubtask);
    } catch (error) {
      console.error('Failed to create subtask:', error);
      setDebugInfo('subtaskCreateError', error.message);
      alert('Failed to create subtask. Please try again.');
    }
  };

  const saveEditedSubtask = async () => {
    if (!editSubtaskForm.title.trim()) {
      alert('Please enter a subtask title');
      return;
    }

    if (!selectedSubtask) {
      alert('No subtask selected');
      return;
    }

    try {
      const updates = {
        title: editSubtaskForm.title,
        description: editSubtaskForm.description,
        assignee: getAssigneeName(editSubtaskForm.assigneeId),
        assigneeId: editSubtaskForm.assigneeId,
        estimatedHours: editSubtaskForm.estimatedHours
      };

      // Update the subtask using context API
      await updateSubtask(selectedSubtask.parentTask.id, selectedSubtask.subtask.id, updates);

      // Update selectedSubtask to reflect the changes
      if (selectedSubtask) {
        setSelectedSubtask({
          ...selectedSubtask,
          subtask: {
            ...selectedSubtask.subtask,
            ...updates
          }
        });
      }

      // Close modal
      closeEditSubtaskModal();

      console.log('Subtask updated:', updates);
      setDebugInfo('subtaskUpdated', updates);
    } catch (error) {
      console.error('Failed to update subtask:', error);
      setDebugInfo('subtaskUpdateError', error.message);
      alert('Failed to update subtask. Please try again.');
    }
  };

  const getAssigneeName = (assigneeId: number) => {
    const assignees = {
      1: 'John Smith',
      3: 'Michael Davis',
      8: 'Ashley Anderson'
    };
    return assignees[assigneeId] || 'Unknown';
  };

  const handleEditTask = () => {
    if (selectedTask) {
      console.log('Edit task:', selectedTask.title);
      // TODO: Open edit task modal
      alert('Edit task functionality coming soon!');
    }
  };

  const handleEditSubtask = () => {
    if (selectedSubtask) {
      console.log('Edit subtask:', selectedSubtask.subtask.title);
      setEditSubtaskForm({
        title: selectedSubtask.subtask.title,
        description: selectedSubtask.subtask.description,
        assigneeId: selectedSubtask.subtask.assigneeId,
        estimatedHours: selectedSubtask.subtask.estimatedHours
      });
      setShowEditSubtaskModal(true);
    }
  };

  const handleAddSubtask = () => {
    if (selectedTask) {
      console.log('Add subtask to:', selectedTask.title);
      setShowAddSubtaskModal(true);
      // Reset form
      setNewSubtaskForm({
        title: '',
        description: '',
        assigneeId: 1,
        estimatedHours: 4
      });
    }
  };

  const handleDeleteTask = async () => {
    if (selectedTask) {
      const confirmed = confirm(`Are you sure you want to delete the task "${selectedTask.title}"? This action cannot be undone.`);
      if (confirmed) {
        try {
          await deleteTask(selectedTask.id);
          closeModal();
          console.log('Deleted task:', selectedTask.title);
          setDebugInfo('taskDeleted', selectedTask.id);
        } catch (error) {
          console.error('Failed to delete task:', error);
          setDebugInfo('taskDeleteError', error.message);
          alert('Failed to delete task. Please try again.');
        }
      }
    }
  };

  const handleDeleteSubtask = async () => {
    if (selectedSubtask) {
      const confirmed = confirm(`Are you sure you want to delete the subtask "${selectedSubtask.subtask.title}"? This action cannot be undone.`);
      if (confirmed) {
        try {
          await deleteSubtask(selectedSubtask.parentTask.id, selectedSubtask.subtask.id);
          closeModal();
          console.log('Deleted subtask:', selectedSubtask.subtask.title);
          setDebugInfo('subtaskDeleted', selectedSubtask.subtask.id);
        } catch (error) {
          console.error('Failed to delete subtask:', error);
          setDebugInfo('subtaskDeleteError', error.message);
          alert('Failed to delete subtask. Please try again.');
        }
      }
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Flag className="text-danger" size={14} />;
      case 'medium': return <Flag className="text-warning" size={14} />;
      case 'low': return <Flag className="text-success" size={14} />;
      default: return <Flag className="text-muted" size={14} />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle className="text-success" size={16} />;
      case 'in_progress': return <AlertCircle className="text-warning" size={16} />;
      case 'todo': return <Circle className="text-muted" size={16} />;
      default: return <Circle className="text-muted" size={16} />;
    }
  };

  const handleTaskClick = (task: Task, e: React.MouseEvent) => {
    // Only trigger if not clicking a button
    if (!(e.target as HTMLElement).closest('button')) {
      console.log('Task card clicked:', task.id);
      setSelectedTask(task);
      setSelectedSubtask(null);
      setShowModal(true);
    }
  };

  const handleSubtaskClick = (subtask: Subtask, parentTask: Task, e: React.MouseEvent) => {
    // Only trigger if not clicking a button
    if (!(e.target as HTMLElement).closest('button')) {
      console.log('Subtask card clicked:', subtask.id);
      setSelectedSubtask({ subtask, parentTask });
      setSelectedTask(null);
      setEditSubtaskForm({
        title: subtask.title,
        description: subtask.description,
        assigneeId: subtask.assigneeId,
        estimatedHours: subtask.estimatedHours
      });
      setShowEditSubtaskModal(true);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === 'all' || task.assigneeId.toString() === assigneeFilter;

    return matchesSearch && matchesPriority && matchesAssignee;
  });
  
  // Update debug info when filters change
  useEffect(() => {
    setDebugInfo('tasksFilter', {
      searchTerm,
      priorityFilter,
      assigneeFilter,
      filteredCount: filteredTasks.length,
      totalCount: tasks.length
    });
  }, [searchTerm, priorityFilter, assigneeFilter, filteredTasks.length, tasks.length, setDebugInfo]);

  const getTasksByStatus = (status: 'todo' | 'in_progress' | 'done') => {
    const tasksInStatus = filteredTasks.filter(task => task.status === status);
    const orderedIds = taskOrder[status];

    // Sort tasks according to the stored order
    const orderedTasks = orderedIds
      .map(id => tasksInStatus.find(task => task.id === id))
      .filter(Boolean) as Task[];

    // Add any new tasks that aren't in the order yet
    const newTasks = tasksInStatus.filter(task => !orderedIds.includes(task.id));

    return [...orderedTasks, ...newTasks];
  };

  const getSubtasksByStatus = (status: 'todo' | 'in_progress' | 'done') => {
    const allSubtasks: (Subtask & { parentId: string })[] = [];
    filteredTasks.forEach(task => {
      task.subtasks.forEach(subtask => {
        if (subtask.status === status) {
          allSubtasks.push({ ...subtask, parentId: task.id });
        }
      });
    });
    return allSubtasks;
  };

  const DraggableTaskCard = ({ task }: { task: Task }) => {
    const [isDragging, setIsDragging] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const element = cardRef.current;
      if (!element) return;

      return draggable({
        element,
        getInitialData: () => ({ id: task.id, type: 'task' }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      });
    }, [task.id]);

    return (
      <div
        ref={cardRef}
        className={`card task-card mb-3 ${isDragging ? 'dragging' : ''}`}
        data-task-id={task.id}
        onClick={(e) => handleTaskClick(task, e)}
        style={{ opacity: isDragging ? 0.8 : 1 }}
      >

        <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="d-flex align-items-center">
            {getPriorityIcon(task.priority)}
            <span className="ms-2 badge bg-secondary small">{task.id.split('-')[1]}</span>
          </div>
          <button
            className="btn btn-sm btn-outline-primary"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              console.log('Edit button clicked for task:', task.id);
              e.stopPropagation();
              setSelectedTask(task);
              setSelectedSubtask(null);
              setShowModal(true);
            }}
            id={`editButton-${task.id}`}
          >
            <Edit size={14} className="me-1" />
            Edit
          </button>
        </div>

        <h6 className="card-title mb-2">{task.title}</h6>
        <p className="card-text small text-muted mb-3">{task.description}</p>

        <div className="d-flex flex-wrap gap-1 mb-2">
          {task.labels.map(label => (
            <span key={label} className="badge bg-light text-dark small">{label}</span>
          ))}
        </div>

        <div className="d-flex justify-content-between align-items-center small text-muted">
          <div className="d-flex align-items-center">
            <User size={12} className="me-1" />
            <span>{task.assignee.split(' ')[0]}</span>
          </div>
          <div className="d-flex align-items-center">
            <Calendar size={12} className="me-1" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        </div>

        {task.subtasks.length > 0 && (
          <div className="mt-2">
            <small className="text-muted">
              {task.subtasks.filter(st => st.status === 'done').length}/{task.subtasks.length} subtasks
            </small>
            <div className="progress mt-1" style={{ height: '4px' }}>
              <div
                className="progress-bar"
                style={{
                  width: `${(task.subtasks.filter(st => st.status === 'done').length / task.subtasks.length) * 100}%`
                }}
              ></div>
            </div>
          </div>
        )}
        </div>
      </div>
    );
  };

  const DraggableSubtaskCard = ({ subtask, parentId }: { subtask: Subtask & { parentId: string }; parentId: string }) => {
    const [isDragging, setIsDragging] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const element = cardRef.current;
      if (!element) return;

      return draggable({
        element,
        getInitialData: () => ({ id: subtask.id, type: 'subtask', parentId }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      });
    }, [subtask.id, parentId]);

    const handleSubtaskCardClick = (e: React.MouseEvent) => {
      // Only trigger if not clicking the edit button and not currently dragging
      if (!(e.target as HTMLElement).closest('button') && !isDragging) {
        console.log('Subtask card clicked:', subtask.id);
        e.stopPropagation();
        const parentTask = tasks.find(t => t.id === parentId);
        if (parentTask) {
          setSelectedSubtask({ subtask, parentTask });
          setSelectedTask(null);
          setShowModal(true);
        }
      }
    };

    return (
      <div
        ref={cardRef}
        className={`card subtask-card mb-2 ${isDragging ? 'dragging' : ''}`}
        data-task-id={subtask.id}
        onClick={handleSubtaskCardClick}
        style={{ opacity: isDragging ? 0.8 : 1 }}
      >
        <div
          className="card-body p-2"
          style={{ cursor: 'pointer' }}
        >
          <div className="d-flex justify-content-between align-items-start mb-1">
            <div className="d-flex align-items-center">
              {getStatusIcon(subtask.status)}
              <span className="ms-2 badge bg-light text-dark small">{subtask.id.split('-')[2]}</span>
            </div>
            <button
              className="btn btn-sm btn-outline-primary"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                console.log('Edit button clicked for subtask:', subtask.id);
                e.stopPropagation();
                const parentTask = tasks.find(t => t.id === parentId);
                if (parentTask) {
                  setSelectedSubtask({ subtask, parentTask });
                  setSelectedTask(null);
                  setShowModal(true);
                }
              }}
              id={`editButton-${subtask.id}`}
            >
              <Edit size={12} className="me-1" />
              Edit
            </button>
          </div>

          <div>
            <h6 className="card-title small mb-1">{subtask.title}</h6>
            <p className="card-text small text-muted mb-2">{subtask.description}</p>
          </div>

          <div className="d-flex justify-content-between align-items-center small text-muted">
            <div className="d-flex align-items-center">
              <User size={10} className="me-1" />
              <span>{subtask.assignee.split(' ')[0]}</span>
            </div>
            <div className="d-flex align-items-center">
              <Clock size={10} className="me-1" />
              <span>{subtask.estimatedHours}h</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DroppableKanbanColumn = ({
    title,
    status,
    tasks,
    subtasks,
    bgClass
  }: {
    title: string;
    status: 'todo' | 'in_progress' | 'done';
    tasks: Task[];
    subtasks: (Subtask & { parentId: string })[];
    bgClass: string;
  }) => {
    const [isOver, setIsOver] = useState(false);
    const columnRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const element = columnRef.current;
      if (!element) return;

      return dropTargetForElements({
        element,
        getData: () => ({ columnId: status }),
        onDragEnter: () => setIsOver(true),
        onDragLeave: () => setIsOver(false),
        onDrop: (data) => {
          setIsOver(false);
          handleDrop(data);
        },
      });
    }, [status]);

    return (
      <div className="kanban-column-wrapper">
        <div
          ref={columnRef}
          className={`kanban-column h-100 ${bgClass} ${isOver ? 'drag-over' : ''}`}
          data-column-id={status}
        >
          <div className="kanban-header p-3 border-bottom">
            <h5 className="mb-0 d-flex align-items-center">
              {getStatusIcon(status)}
              <span className="ms-2">{title}</span>
              <span className="badge bg-secondary ms-2">{tasks.length + subtasks.length}</span>
            </h5>
          </div>

          <div className="kanban-body p-3" style={{ minHeight: '500px', maxHeight: '70vh', overflowY: 'auto' }}>
            {tasks.map(task => (
              <DraggableTaskCard key={task.id} task={task} />
            ))}

            {subtasks.map(subtask => (
              <DraggableSubtaskCard key={subtask.id} subtask={subtask} parentId={subtask.parentId} />
            ))}

            {tasks.length === 0 && subtasks.length === 0 && (
              <div className="text-center text-muted py-4">
                <Circle size={48} className="mb-2 opacity-50" />
                <p className="mb-0">No {title.toLowerCase()} items</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Loading message="Loading tasks..." />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Tasks - School Management System</title>
        <meta name="description" content="Manage tasks and projects in the school management system" />
      </Head>
      <div className="dashboard-layout">
        <div className="dashboard-sidebar">
          <Sidebar
            activeItem="task"
            isMobileOpen={isMobileMenuOpen}
            setIsMobileOpen={setIsMobileMenuOpen}
          />
        </div>
        <div className="dashboard-main">
          <div className="main-content">
            <div className="container-fluid p-0">
              {/* Mobile Hamburger Button */}
              <button
                className="mobile-hamburger d-block d-md-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                <Menu size={24} />
              </button>

              {/* Header Section */}
              <div className="dashboard-header mb-4">
                <div className="row align-items-center">
                  <div className="col-12">
                    <h1 className="dashboard-title mb-2">Task Board</h1>
                    <p className="dashboard-subtitle mb-0">
                      Manage and track project tasks and subtasks
                    </p>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="row mb-4">
                <div className="col-12">
                  <Card title="" className="filter-card">
                    <div className="row g-3 align-items-center">
                      <div className="col-12 col-lg-5">
                        <div className="input-group">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => {
                              console.log('Manual refresh triggered');
                              fetchTasks();
                            }}
                            title="Refresh data from server"
                            disabled={loading}
                          >
                            🔄
                          </button>
                          <span className="input-group-text bg-light">
                            <Search size={16} className="text-muted" />
                          </span>
                          <input
                            type="text"
                            className="form-control task-search-input"
                            placeholder="Search tasks and subtasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-6 col-md-4 col-lg-2">
                        <select
                          className="form-select"
                          value={priorityFilter}
                          onChange={(e) => setPriorityFilter(e.target.value)}
                        >
                          <option value="all">All Priorities</option>
                          <option value="high">High Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="low">Low Priority</option>
                        </select>
                      </div>
                      <div className="col-6 col-md-4 col-lg-2">
                        <select
                          className="form-select"
                          value={assigneeFilter}
                          onChange={(e) => setAssigneeFilter(e.target.value)}
                        >
                          <option value="all">All Assignees</option>
                          <option value="1">John Smith</option>
                          <option value="3">Michael Davis</option>
                          <option value="8">Ashley Anderson</option>
                        </select>
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <div className="d-flex justify-content-md-end justify-content-start align-items-center">
                          <div className="badge bg-light text-dark px-3 py-2">
                            <strong>{filteredTasks.length}</strong> tasks • <strong>{filteredTasks.reduce((acc, task) => acc + task.subtasks.length, 0)}</strong> subtasks
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Action Bar */}
              <div className="row mb-3">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 text-muted">Kanban Board</h5>
                    <Button variant="primary" className="btn-sm" onClick={openNewTaskModal}>
                      <Plus size={16} className="me-1" />
                      New Task
                    </Button>
                  </div>
                </div>
              </div>

              {/* Kanban Board */}
              <div className="kanban-board">
                <DroppableKanbanColumn
                  title="To Do"
                  status="todo"
                  tasks={getTasksByStatus('todo')}
                  subtasks={getSubtasksByStatus('todo')}
                  bgClass="border border-secondary bg-light"
                />
                <DroppableKanbanColumn
                  title="In Progress"
                  status="in_progress"
                  tasks={getTasksByStatus('in_progress')}
                  subtasks={getSubtasksByStatus('in_progress')}
                  bgClass="border border-warning bg-warning bg-opacity-10"
                />
                <DroppableKanbanColumn
                  title="Done"
                  status="done"
                  tasks={getTasksByStatus('done')}
                  subtasks={getSubtasksByStatus('done')}
                  bgClass="border border-success bg-success bg-opacity-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Details Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={closeModal}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <div className="d-flex align-items-center">
                  {selectedTask && (
                    <>
                      {getPriorityIcon(selectedTask.priority)}
                      <h5 className="modal-title ms-2 mb-0">
                        {selectedTask.title}
                      </h5>
                      <span className="badge bg-secondary ms-2">{selectedTask.id.split('-')[1]}</span>
                    </>
                  )}
                  {selectedSubtask && selectedSubtask.subtask && (
                    <>
                      {getStatusIcon(selectedSubtask.subtask.status)}
                      <h5 className="modal-title ms-2 mb-0">
                        {selectedSubtask.subtask.title}
                      </h5>
                      <span className="badge bg-light text-dark ms-2">{selectedSubtask.subtask.id.split('-')[2]}</span>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>

              <div className="modal-body">
                {selectedTask && (
                  <div>
                    <div className="row mb-3">
                      <div className="col-md-8">
                        <h6 className="text-muted mb-2">Description</h6>
                        <p className="mb-3">{selectedTask.description}</p>
                      </div>
                      <div className="col-md-4">
                        <div className="card bg-light">
                          <div className="card-body p-3">
                            <h6 className="card-title">Details</h6>
                            <div className="mb-2">
                              <small className="text-muted">Status:</small>
                              <span className={`badge ms-2 ${
                                selectedTask.status === 'done' ? 'bg-success' :
                                selectedTask.status === 'in_progress' ? 'bg-warning' : 'bg-secondary'
                              }`}>
                                {selectedTask.status.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                            <div className="mb-2">
                              <small className="text-muted">Priority:</small>
                              <span className={`badge ms-2 ${
                                selectedTask.priority === 'high' ? 'bg-danger' :
                                selectedTask.priority === 'medium' ? 'bg-warning' : 'bg-success'
                              }`}>
                                {selectedTask.priority.toUpperCase()}
                              </span>
                            </div>
                            <div className="mb-2">
                              <small className="text-muted">Assignee:</small>
                              <div className="d-flex align-items-center mt-1">
                                <User size={14} className="me-1" />
                                <span>{selectedTask.assignee}</span>
                              </div>
                            </div>
                            <div className="mb-2">
                              <small className="text-muted">Reporter:</small>
                              <div className="d-flex align-items-center mt-1">
                                <User size={14} className="me-1" />
                                <span>{selectedTask.reporter}</span>
                              </div>
                            </div>
                            <div className="mb-2">
                              <small className="text-muted">Due Date:</small>
                              <div className="d-flex align-items-center mt-1">
                                <Calendar size={14} className="me-1" />
                                <span>{new Date(selectedTask.dueDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="mb-2">
                              <small className="text-muted">Estimated Hours:</small>
                              <div className="d-flex align-items-center mt-1">
                                <Clock size={14} className="me-1" />
                                <span>{selectedTask.estimatedHours}h</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedTask.labels.length > 0 && (
                      <div className="mb-3">
                        <h6 className="text-muted mb-2">Labels</h6>
                        <div className="d-flex flex-wrap gap-1">
                          {selectedTask.labels.map(label => (
                            <span key={label} className="badge bg-light text-dark">{label}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedTask.subtasks.length > 0 && (
                      <div className="mb-3">
                        <h6 className="text-muted mb-2">
                          Subtasks ({selectedTask.subtasks.filter(st => st.status === 'done').length}/{selectedTask.subtasks.length})
                        </h6>
                        <div className="progress mb-3" style={{ height: '8px' }}>
                          <div
                            className="progress-bar"
                            style={{
                              width: `${(selectedTask.subtasks.filter(st => st.status === 'done').length / selectedTask.subtasks.length) * 100}%`
                            }}
                          ></div>
                        </div>
                        <div className="list-group">
                          {selectedTask.subtasks.map(subtask => (
                            <div key={subtask.id} className="list-group-item" id={`subtaskItem-${subtask.id}`} onClick={(e) => handleSubtaskClick(subtask, selectedTask, e)} style={{ cursor: 'pointer' }}>
                              <div className="d-flex align-items-center">
                                {getStatusIcon(subtask.status)}
                                <div className="ms-2 flex-grow-1">
                                  <h6 className="mb-1">{subtask.title}</h6>
                                  <p className="mb-1 text-muted small">{subtask.description}</p>
                                  <div className="d-flex align-items-center small text-muted">
                                    <User size={12} className="me-1" />
                                    <span className="me-3">{subtask.assignee}</span>
                                    <Clock size={12} className="me-1" />
                                    <span>{subtask.estimatedHours}h</span>
                                  </div>
                                </div>
                                <span className={`badge ${
                                  subtask.status === 'done' ? 'bg-success' :
                                  subtask.status === 'in_progress' ? 'bg-warning' : 'bg-secondary'
                                }`}>
                                  {subtask.status.replace('_', ' ')}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedSubtask && selectedSubtask.subtask && selectedSubtask.parentTask && (
                  <div>
                    <div className="row mb-3">
                      <div className="col-md-8">
                        <h6 className="text-muted mb-2">Description</h6>
                        <p className="mb-3">{selectedSubtask.subtask.description}</p>

                        <div className="alert alert-info">
                          <h6 className="alert-heading d-flex align-items-center">
                            <Flag size={16} className="me-2" />
                            Parent Task
                          </h6>
                          <p className="mb-0">
                            <strong>{selectedSubtask.parentTask.title}</strong><br />
                            <small className="text-muted">{selectedSubtask.parentTask.description}</small>
                          </p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card bg-light">
                          <div className="card-body p-3">
                            <h6 className="card-title">Details</h6>
                            <div className="mb-2">
                              <small className="text-muted">Status:</small>
                              <span className={`badge ms-2 ${
                                selectedSubtask.subtask.status === 'done' ? 'bg-success' :
                                selectedSubtask.subtask.status === 'in_progress' ? 'bg-warning' : 'bg-secondary'
                              }`}>
                                {selectedSubtask.subtask.status.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                            <div className="mb-2">
                              <small className="text-muted">Assignee:</small>
                              <div className="d-flex align-items-center mt-1">
                                <User size={14} className="me-1" />
                                <span>{selectedSubtask.subtask.assignee}</span>
                              </div>
                            </div>
                            <div className="mb-2">
                              <small className="text-muted">Estimated Hours:</small>
                              <div className="d-flex align-items-center mt-1">
                                <Clock size={14} className="me-1" />
                                <span>{selectedSubtask.subtask.estimatedHours}h</span>
                              </div>
                            </div>
                            {selectedSubtask.subtask.startedDate && (
                              <div className="mb-2">
                                <small className="text-muted">Started:</small>
                                <div className="d-flex align-items-center mt-1">
                                  <Calendar size={14} className="me-1" />
                                  <span>{new Date(selectedSubtask.subtask.startedDate).toLocaleDateString()}</span>
                                </div>
                              </div>
                            )}
                            {selectedSubtask.subtask.completedDate && (
                              <div className="mb-2">
                                <small className="text-muted">Completed:</small>
                                <div className="d-flex align-items-center mt-1">
                                  <Calendar size={14} className="me-1" />
                                  <span>{new Date(selectedSubtask.subtask.completedDate).toLocaleDateString()}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer d-flex justify-content-between">
                <div className="d-flex gap-2">
                  {selectedTask && (
                    <>
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        title="Edit Task"
                        onClick={handleEditTask}
                      >
                        <Edit size={16} className="me-1" />
                        Edit Task
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-success"
                        title="Add Subtask"
                        onClick={handleAddSubtask}
                      >
                        <Plus size={16} className="me-1" />
                        Add Subtask
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        title="Delete Task"
                        onClick={handleDeleteTask}
                      >
                        <Trash2 size={16} className="me-1" />
                        Delete
                      </button>
                    </>
                  )}
                  {selectedSubtask && selectedSubtask.subtask && (
                    <>
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        title="Edit Subtask"
                        onClick={handleEditSubtask}
                      >
                        <Edit size={16} className="me-1" />
                        Edit Subtask
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        title="Delete Subtask"
                        onClick={handleDeleteSubtask}
                      >
                        <Trash2 size={16} className="me-1" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={closeNewTaskModal}
        >
          <div
            className="modal-dialog modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <div className="d-flex align-items-center">
                  <Plus size={20} className="text-primary me-2" />
                  <h5 className="modal-title mb-0">Create New Task</h5>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeNewTaskModal}
                ></button>
              </div>

              <div className="modal-body">
                <form>
                  <div className="row">
                    <div className="col-md-8">
                      <div className="mb-3">
                        <label htmlFor="taskTitle" className="form-label">
                          <strong>Task Title *</strong>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="taskTitle"
                          placeholder="Enter task title..."
                          value={newTaskForm.title}
                          onChange={(e) => handleFormChange('title', e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="taskDescription" className="form-label">
                          <strong>Description</strong>
                        </label>
                        <textarea
                          className="form-control"
                          id="taskDescription"
                          rows={3}
                          placeholder="Describe the task in detail..."
                          value={newTaskForm.description}
                          onChange={(e) => handleFormChange('description', e.target.value)}
                        ></textarea>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="taskLabels" className="form-label">
                          <strong>Labels</strong>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="taskLabels"
                          placeholder="Enter labels separated by commas (e.g., backend, api, urgent)"
                          value={newTaskForm.labels.join(', ')}
                          onChange={(e) => handleFormChange('labels', e.target.value.split(',').map(l => l.trim()).filter(l => l))}
                        />
                        <div className="form-text">Separate multiple labels with commas</div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="card bg-light h-100">
                        <div className="card-body">
                          <h6 className="card-title">Task Details</h6>

                          <div className="mb-3">
                            <label htmlFor="taskPriority" className="form-label">
                              <strong>Priority</strong>
                            </label>
                            <select
                              className="form-select"
                              id="taskPriority"
                              value={newTaskForm.priority}
                              onChange={(e) => handleFormChange('priority', e.target.value)}
                            >
                              <option value="low">Low Priority</option>
                              <option value="medium">Medium Priority</option>
                              <option value="high">High Priority</option>
                            </select>
                          </div>

                          <div className="mb-3">
                            <label htmlFor="taskAssignee" className="form-label">
                              <strong>Assignee</strong>
                            </label>
                            <select
                              className="form-select"
                              id="taskAssignee"
                              value={newTaskForm.assigneeId}
                              onChange={(e) => handleFormChange('assigneeId', parseInt(e.target.value))}
                            >
                              <option value={1}>John Smith</option>
                              <option value={3}>Michael Davis</option>
                              <option value={8}>Ashley Anderson</option>
                            </select>
                          </div>

                          <div className="mb-3">
                            <label htmlFor="taskDueDate" className="form-label">
                              <strong>Due Date</strong>
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              id="taskDueDate"
                              value={newTaskForm.dueDate}
                              onChange={(e) => handleFormChange('dueDate', e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="taskEstimatedHours" className="form-label">
                              <strong>Estimated Hours</strong>
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="taskEstimatedHours"
                              min="1"
                              max="200"
                              value={newTaskForm.estimatedHours}
                              onChange={(e) => handleFormChange('estimatedHours', parseInt(e.target.value) || 1)}
                            />
                          </div>

                          <div className="alert alert-info small">
                            <strong>Note:</strong> The task will be created in the "To Do" column and can be moved later.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeNewTaskModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={createNewTask}
                  disabled={!newTaskForm.title.trim()}
                >
                  <Plus size={16} className="me-1" />
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Subtask Modal */}
      {showAddSubtaskModal && selectedTask && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={closeAddSubtaskModal}
        >
          <div
            className="modal-dialog modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <div className="d-flex align-items-center">
                  <Plus size={20} className="text-success me-2" />
                  <h5 className="modal-title mb-0">Add Subtask to "{selectedTask.title}"</h5>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeAddSubtaskModal}
                ></button>
              </div>

              <div className="modal-body">
                <form>
                  <div className="row">
                    <div className="col-md-8">
                      <div className="mb-3">
                        <label htmlFor="subtaskTitle" className="form-label">
                          <strong>Subtask Title *</strong>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="subtaskTitle"
                          placeholder="Enter subtask title..."
                          value={newSubtaskForm.title}
                          onChange={(e) => handleSubtaskFormChange('title', e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="subtaskDescription" className="form-label">
                          <strong>Description</strong>
                        </label>
                        <textarea
                          className="form-control"
                          id="subtaskDescription"
                          rows={3}
                          placeholder="Describe the subtask in detail..."
                          value={newSubtaskForm.description}
                          onChange={(e) => handleSubtaskFormChange('description', e.target.value)}
                        ></textarea>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="card bg-light h-100">
                        <div className="card-body">
                          <h6 className="card-title">Subtask Details</h6>

                          <div className="mb-3">
                            <label htmlFor="subtaskAssignee" className="form-label">
                              <strong>Assignee</strong>
                            </label>
                            <select
                              className="form-select"
                              id="subtaskAssignee"
                              value={newSubtaskForm.assigneeId}
                              onChange={(e) => handleSubtaskFormChange('assigneeId', parseInt(e.target.value))}
                            >
                              <option value={1}>John Smith</option>
                              <option value={3}>Michael Davis</option>
                              <option value={8}>Ashley Anderson</option>
                            </select>
                          </div>

                          <div className="mb-3">
                            <label htmlFor="subtaskEstimatedHours" className="form-label">
                              <strong>Estimated Hours</strong>
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="subtaskEstimatedHours"
                              min="1"
                              max="40"
                              value={newSubtaskForm.estimatedHours}
                              onChange={(e) => handleSubtaskFormChange('estimatedHours', parseInt(e.target.value) || 1)}
                            />
                          </div>

                          <div className="alert alert-info small">
                            <strong>Parent Task:</strong> {selectedTask.title}<br />
                            <strong>Note:</strong> The subtask will be created in the "To Do" status and can be moved later.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeAddSubtaskModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={createNewSubtask}
                  disabled={!newSubtaskForm.title.trim()}
                >
                  <Plus size={16} className="me-1" />
                  Add Subtask
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Subtask Modal */}
      {showEditSubtaskModal && selectedSubtask && selectedSubtask.subtask && selectedSubtask.parentTask && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={closeEditSubtaskModal}
        >
          <div
            className="modal-dialog modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <div className="d-flex align-items-center">
                  <Edit size={20} className="text-primary me-2" />
                  <h5 className="modal-title mb-0">Edit Subtask</h5>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeEditSubtaskModal}
                ></button>
              </div>

              <div className="modal-body">
                <form>
                  <div className="row">
                    <div className="col-md-8">
                      <div className="mb-3">
                        <label htmlFor="editSubtaskTitle" className="form-label">
                          <strong>Subtask Title *</strong>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="editSubtaskTitle"
                          placeholder="Enter subtask title..."
                          value={editSubtaskForm.title}
                          onChange={(e) => handleEditSubtaskFormChange('title', e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="editSubtaskDescription" className="form-label">
                          <strong>Description</strong>
                        </label>
                        <textarea
                          className="form-control"
                          id="editSubtaskDescription"
                          rows={3}
                          placeholder="Describe the subtask in detail..."
                          value={editSubtaskForm.description}
                          onChange={(e) => handleEditSubtaskFormChange('description', e.target.value)}
                        ></textarea>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="card bg-light h-100">
                        <div className="card-body">
                          <h6 className="card-title">Subtask Details</h6>

                          <div className="mb-3">
                            <label htmlFor="editSubtaskStatus" className="form-label">
                              <strong>Current Status</strong>
                            </label>
                            <div className="d-flex align-items-center">
                              {getStatusIcon(selectedSubtask.subtask.status)}
                              <span className="ms-2 badge bg-secondary">
                                {selectedSubtask.subtask.status.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                            <small className="text-muted">Status can be changed by dragging the subtask to different columns</small>
                          </div>

                          <div className="mb-3">
                            <label htmlFor="editSubtaskAssignee" className="form-label">
                              <strong>Assignee</strong>
                            </label>
                            <select
                              className="form-select"
                              id="editSubtaskAssignee"
                              value={editSubtaskForm.assigneeId}
                              onChange={(e) => handleEditSubtaskFormChange('assigneeId', parseInt(e.target.value))}
                            >
                              <option value={1}>John Smith</option>
                              <option value={3}>Michael Davis</option>
                              <option value={8}>Ashley Anderson</option>
                            </select>
                          </div>

                          <div className="mb-3">
                            <label htmlFor="editSubtaskEstimatedHours" className="form-label">
                              <strong>Estimated Hours</strong>
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="editSubtaskEstimatedHours"
                              min="1"
                              max="40"
                              value={editSubtaskForm.estimatedHours}
                              onChange={(e) => handleEditSubtaskFormChange('estimatedHours', parseInt(e.target.value) || 1)}
                            />
                          </div>

                          <div className="alert alert-info small">
                            <strong>Parent Task:</strong> {selectedSubtask.parentTask.title}<br />
                            <strong>Subtask ID:</strong> {selectedSubtask.subtask.id}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeEditSubtaskModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={saveEditedSubtask}
                  disabled={!editSubtaskForm.title.trim()}
                >
                  <Edit size={16} className="me-1" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDebugEnabled && (
        <DebugPanel 
          debugInfo={debugInfo} 
          isOpen={false}
        />
      )}
    </ProtectedRoute>
  );
}

export default function TasksPage() {
  return (
    <KanbanProvider>
      <TasksPageContent />
    </KanbanProvider>
  );
}