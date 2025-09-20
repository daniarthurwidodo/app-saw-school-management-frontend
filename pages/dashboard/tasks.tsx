import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Card, Button, Loading } from '../../components/ui';
import Sidebar from '../../components/layout/Sidebar';
import { ProtectedRoute } from '../../components/auth';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
} from '@dnd-kit/core';
import {
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
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

interface Subtask {
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

interface Task {
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

export default function TasksPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<{ type: 'task' | 'subtask'; id: string; parentId?: string } | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedSubtask, setSelectedSubtask] = useState<{ subtask: Subtask; parentTask: Task } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    assigneeId: 1,
    dueDate: '',
    estimatedHours: 8,
    labels: [] as string[]
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/data/tasks.json');
      const data: TasksData = await response.json();
      setTasks(data.tasks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: 'todo' | 'in_progress' | 'done', isSubtask = false, parentTaskId?: string) => {
    console.log('UpdateTaskStatus called:', { taskId, newStatus, isSubtask, parentTaskId });

    // Add animation class before updating
    const cardElement = document.querySelector(`[data-task-id="${taskId}"]`) as HTMLElement;
    if (cardElement) {
      cardElement.classList.add('leaving');

      // Wait for animation before updating state
      setTimeout(() => {
        const updatedTasks = tasks.map(task => {
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

        setTasks(updatedTasks);
        console.log('Tasks updated successfully');

        // Add entering animation to new position
        setTimeout(() => {
          const newCardElement = document.querySelector(`[data-task-id="${taskId}"]`) as HTMLElement;
          if (newCardElement) {
            newCardElement.classList.add('entering');
            setTimeout(() => {
              newCardElement.classList.remove('entering');
            }, 400);
          }
        }, 50);

      }, 300);
    } else {
      // Fallback for immediate update if element not found
      const updatedTasks = tasks.map(task => {
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

      setTasks(updatedTasks);
    }

    // Here you would typically save to backend/file
    // For now, we'll just update the state
    console.log('Saving updated tasks to backend...', { taskId, newStatus, isSubtask, parentTaskId });
  };

  const handleDragStart = (event: DragStartEvent) => {
    console.log('Drag start event:', event);
    const { active } = event;
    setActiveId(active.id as string);

    // Parse the draggable ID to get item info
    const activeId = active.id as string;
    console.log('Dragging item with ID:', activeId);

    if (activeId.startsWith('task-')) {
      setDraggedItem({
        type: 'task',
        id: activeId,
        parentId: undefined
      });
      console.log('Started dragging task:', activeId);
    } else if (activeId.startsWith('subtask-')) {
      // For subtasks like "subtask-1-2", extract parent task ID
      const parts = activeId.split('-');
      const parentTaskId = `task-${parts[1]}`;
      setDraggedItem({
        type: 'subtask',
        id: activeId,
        parentId: parentTaskId
      });
      console.log('Started dragging subtask:', activeId, 'parent:', parentTaskId);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !draggedItem) {
      setActiveId(null);
      setDraggedItem(null);
      return;
    }

    const newStatus = over.id as 'todo' | 'in_progress' | 'done';

    // Find current task and status
    let currentStatus: string;
    let taskId = draggedItem.id;
    let isSubtask = draggedItem.type === 'subtask';
    let parentTaskId = draggedItem.parentId;

    if (isSubtask) {
      // For subtasks, find the parent task and the subtask
      const parentTask = tasks.find(t => t.id === parentTaskId);
      if (parentTask) {
        const subtask = parentTask.subtasks.find(st => st.id === taskId);
        currentStatus = subtask?.status || '';
      }
    } else {
      // For tasks, find the task directly
      const task = tasks.find(t => t.id === taskId);
      currentStatus = task?.status || '';
    }

    if (currentStatus !== newStatus) {
      updateTaskStatus(taskId, newStatus, isSubtask, parentTaskId);
    }

    setActiveId(null);
    setDraggedItem(null);
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

  const handleFormChange = (field: string, value: any) => {
    setNewTaskForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const createNewTask = () => {
    if (!newTaskForm.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    // Generate new task ID
    const newTaskId = `task-${tasks.length + 1}`;

    const newTask: Task = {
      id: newTaskId,
      title: newTaskForm.title,
      description: newTaskForm.description,
      status: 'todo',
      priority: newTaskForm.priority,
      assignee: getAssigneeName(newTaskForm.assigneeId),
      assigneeId: newTaskForm.assigneeId,
      reporter: 'Current User', // Would come from auth context
      reporterId: 99,
      createdDate: new Date().toISOString().split('T')[0],
      dueDate: newTaskForm.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 7 days from now
      estimatedHours: newTaskForm.estimatedHours,
      labels: newTaskForm.labels,
      subtasks: []
    };

    // Add to tasks list
    setTasks(prev => [...prev, newTask]);

    // Close modal
    closeNewTaskModal();

    console.log('New task created:', newTask);
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
      // TODO: Open edit subtask modal
      alert('Edit subtask functionality coming soon!');
    }
  };

  const handleAddSubtask = () => {
    if (selectedTask) {
      console.log('Add subtask to:', selectedTask.title);
      // TODO: Open add subtask modal
      alert('Add subtask functionality coming soon!');
    }
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      const confirmed = confirm(`Are you sure you want to delete the task "${selectedTask.title}"? This action cannot be undone.`);
      if (confirmed) {
        setTasks(prev => prev.filter(task => task.id !== selectedTask.id));
        closeModal();
        console.log('Deleted task:', selectedTask.title);
      }
    }
  };

  const handleDeleteSubtask = () => {
    if (selectedSubtask) {
      const confirmed = confirm(`Are you sure you want to delete the subtask "${selectedSubtask.subtask.title}"? This action cannot be undone.`);
      if (confirmed) {
        setTasks(prev => prev.map(task => {
          if (task.id === selectedSubtask.parentTask.id) {
            return {
              ...task,
              subtasks: task.subtasks.filter(st => st.id !== selectedSubtask.subtask.id)
            };
          }
          return task;
        }));
        closeModal();
        console.log('Deleted subtask:', selectedSubtask.subtask.title);
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

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === 'all' || task.assigneeId.toString() === assigneeFilter;

    return matchesSearch && matchesPriority && matchesAssignee;
  });

  const getTasksByStatus = (status: 'todo' | 'in_progress' | 'done') => {
    return filteredTasks.filter(task => task.status === status);
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
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      isDragging,
    } = useDraggable({
      id: task.id,
    });

    const style = transform ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      opacity: isDragging ? 0.5 : 1,
    } : undefined;

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="card task-card mb-3"
        data-task-id={task.id}
      >

        <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="d-flex align-items-center">
            {getPriorityIcon(task.priority)}
            <span className="ms-2 badge bg-secondary small">{task.id.split('-')[1]}</span>
          </div>
          <div className="dropdown">
            <button
              className="btn btn-sm btn-link text-muted"
              data-bs-toggle="dropdown"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal size={14} />
            </button>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="#" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedTask(task);
                setSelectedSubtask(null);
                setShowModal(true);
              }}><Edit size={14} className="me-2" />Edit</a></li>
              <li><a className="dropdown-item text-danger" href="#"><Trash2 size={14} className="me-2" />Delete</a></li>
            </ul>
          </div>
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
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      isDragging,
    } = useDraggable({
      id: subtask.id,
    });

    const style = transform ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      opacity: isDragging ? 0.5 : 1,
    } : undefined;

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="card subtask-card mb-2"
        data-task-id={subtask.id}
      >
        <div className="card-body p-2">
          <div className="d-flex justify-content-between align-items-start mb-1">
            <div className="d-flex align-items-center">
              {getStatusIcon(subtask.status)}
              <span className="ms-2 badge bg-light text-dark small">{subtask.id.split('-')[2]}</span>
            </div>
            <div className="dropdown">
              <button
                className="btn btn-sm btn-link text-muted p-0"
                data-bs-toggle="dropdown"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal size={12} />
              </button>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#" onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const parentTask = tasks.find(t => t.id === parentId);
                  if (parentTask) {
                    setSelectedSubtask({ subtask, parentTask });
                    setSelectedTask(null);
                    setShowModal(true);
                  }
                }}><Edit size={12} className="me-2" />Edit</a></li>
                <li><a className="dropdown-item text-danger" href="#"><Trash2 size={12} className="me-2" />Delete</a></li>
              </ul>
            </div>
          </div>

          <h6 className="card-title small mb-1">{subtask.title}</h6>
          <p className="card-text small text-muted mb-2">{subtask.description}</p>

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
    const { isOver, setNodeRef } = useDroppable({
      id: status,
    });

    return (
      <div className="kanban-column-wrapper">
        <div
          ref={setNodeRef}
          className={`kanban-column h-100 ${bgClass} ${isOver ? 'drag-over' : ''}`}
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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
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
                <DragOverlay>
                  {activeId && draggedItem ? (
                    <div className="drag-overlay-item">
                      {draggedItem.type === 'task' ? (
                        (() => {
                          const task = tasks.find(t => t.id === draggedItem.id);
                          return task ? (
                            <div className="card task-card dragging">
                              <div className="card-body p-3">
                                <div className="d-flex align-items-center mb-2">
                                  {getPriorityIcon(task.priority)}
                                  <span className="ms-2 badge bg-secondary small">{task.id.split('-')[1]}</span>
                                </div>
                                <h6 className="card-title mb-1">{task.title}</h6>
                                <p className="card-text small text-muted mb-0 text-truncate">{task.description}</p>
                              </div>
                            </div>
                          ) : null;
                        })()
                      ) : (
                        (() => {
                          let subtask = null;
                          tasks.forEach(task => {
                            const found = task.subtasks.find(st => st.id === draggedItem.id);
                            if (found) subtask = found;
                          });
                          return subtask ? (
                            <div className="card subtask-card dragging">
                              <div className="card-body p-2">
                                <div className="d-flex align-items-center mb-1">
                                  {getStatusIcon(subtask.status)}
                                  <span className="ms-2 badge bg-light text-dark small">{subtask.id.split('-')[2]}</span>
                                </div>
                                <h6 className="card-title small mb-1">{subtask.title}</h6>
                                <p className="card-text small text-muted mb-0 text-truncate">{subtask.description}</p>
                              </div>
                            </div>
                          ) : null;
                        })()
                      )}
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
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
                  {selectedSubtask && (
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
                            <div key={subtask.id} className="list-group-item">
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

                {selectedSubtask && (
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
                  {selectedSubtask && (
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
    </ProtectedRoute>
  );
}