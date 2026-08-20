'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import styles from './project-board.module.css';
import { Project, Task } from '@/data/projectsData';
import ThemeToggle from '@/components/ThemeToggle';
import { taskService } from '@/services/taskService';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectBoardPage({ params }: PageProps) {
  const { id } = use(params);

  const [project, setProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);

  // Drag over states to highlight columns
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  // Form states per column
  const [activeFormCol, setActiveFormCol] = useState<'pending' | 'in-progress' | 'completed' | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newAssigneeName, setNewAssigneeName] = useState('Alex Mercer');
  const [newAssigneeAvatar, setNewAssigneeAvatar] = useState('👨‍💻');
  const [newDueDate, setNewDueDate] = useState('');

  useEffect(() => {
    setMounted(true);
    const fetchProject = async () => {
      try {
        const found = await taskService.getProject(id);
        setProject(found);
      } catch (e) {
        console.error("Failed to fetch project detail from backend:", e);
      }
    };
    fetchProject();
  }, [id]);

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, columnStatus: string) => {
    e.preventDefault();
    setDragOverCol(columnStatus);
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: 'pending' | 'in-progress' | 'completed') => {
    e.preventDefault();
    setDragOverCol(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId || !project) return;

    moveTask(taskId, targetStatus);
  };

  const moveTask = async (taskId: string, targetStatus: 'pending' | 'in-progress' | 'completed') => {
    if (!project) return;
    try {
      const updatedTask = await taskService.updateTask(project.id, taskId, { status: targetStatus });
      setProject({
        ...project,
        tasks: project.tasks.map(t => t.id === taskId ? updatedTask : t)
      });
    } catch (e) {
      console.error("Failed to move/update task status:", e);
    }
  };

  const handleAddTask = async (e: React.FormEvent, columnStatus: 'pending' | 'in-progress' | 'completed') => {
    e.preventDefault();
    if (!newTitle.trim() || !project) return;

    try {
      const newTask = await taskService.createTask(project.id, {
        title: newTitle,
        description: newDesc,
        status: columnStatus,
        priority: newPriority,
        dueDate: newDueDate || new Date().toISOString().split('T')[0],
        assignee: {
          name: newAssigneeName,
          avatar: newAssigneeAvatar
        }
      });

      setProject({
        ...project,
        tasks: [...project.tasks, newTask]
      });

      // Reset Form
      setNewTitle('');
      setNewDesc('');
      setNewPriority('medium');
      setNewAssigneeName('Alex Mercer');
      setNewAssigneeAvatar('👨‍💻');
      setNewDueDate('');
      setActiveFormCol(null);
    } catch (e) {
      console.error("Failed to create and add task:", e);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!project) return;
    try {
      await taskService.deleteTask(project.id, taskId);
      setProject({
        ...project,
        tasks: project.tasks.filter(t => t.id !== taskId)
      });
    } catch (e) {
      console.error("Failed to delete task:", e);
    }
  };

  if (!mounted) {
    return (
      <div className={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div style={{ animation: 'pulseGlow 2s infinite', padding: '16px', borderRadius: '8px', color: 'var(--text-secondary)' }}>
            Loading board...
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={styles.container} style={{ textAlign: 'center', paddingTop: '100px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🔍</div>
        <h2>Project Board Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '12px 0 24px' }}>
          The project ID you requested doesn't exist or has been removed.
        </p>
        <Link href="/" className={styles.backBtn} style={{ justifyContent: 'center' }}>
          ← Return to Dashboard
        </Link>
      </div>
    );
  }

  // Filter project tasks by search input
  const filteredTasks = project.tasks.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingTasks = filteredTasks.filter(t => t.status === 'pending');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in-progress');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');

  const progressPct = project.tasks.length > 0
    ? Math.round((project.tasks.filter(t => t.status === 'completed').length / project.tasks.length) * 100)
    : 0;

  const renderColumn = (
    title: string,
    status: 'pending' | 'in-progress' | 'completed',
    tasks: Task[]
  ) => {
    const isDragOver = dragOverCol === status;
    const isFormOpen = activeFormCol === status;

    return (
      <div
        className={`${styles.column} ${
          status === 'pending'
            ? styles.columnPending
            : status === 'in-progress'
            ? styles.columnInprogress
            : styles.columnCompleted
        } ${isDragOver ? styles.columnDragOver : ''}`}
        onDragOver={(e) => handleDragOver(e, status)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, status)}
      >
        <div className={styles.columnHeader}>
          <div className={styles.columnTitle}>
            <span
              className={`${styles.dot} ${
                status === 'pending'
                  ? styles.dotPending
                  : status === 'in-progress'
                  ? styles.dotInprogress
                  : styles.dotCompleted
              }`}
            ></span>
            <span>{title}</span>
            <span className={styles.countBadge}>{tasks.length}</span>
          </div>
          <button
            className={styles.addTaskBtn}
            onClick={() => setActiveFormCol(isFormOpen ? null : status)}
          >
            {isFormOpen ? 'Cancel' : '+ Task'}
          </button>
        </div>

        {/* Create Task Form */}
        {isFormOpen && (
          <div className={styles.quickAddCard}>
            <form onSubmit={(e) => handleAddTask(e, status)} className={styles.quickForm}>
              <input
                type="text"
                required
                placeholder="Task Title..."
                className={styles.quickInput}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Description..."
                className={styles.quickInput}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
              <div className={styles.quickFormRow}>
                <select
                  className={styles.quickSelect}
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <input
                  type="date"
                  className={styles.quickInput}
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                />
              </div>
              <div className={styles.quickFormRow}>
                <select
                  className={styles.quickSelect}
                  value={newAssigneeName}
                  onChange={(e) => {
                    setNewAssigneeName(e.target.value);
                    const avatars: Record<string, string> = {
                      'Alex Mercer': '👨‍💻',
                      'Sarah Connor': '👩‍💻',
                      'Elena Rostova': '👩‍🎨',
                      'Marcus Vance': '🧙‍♂️'
                    };
                    setNewAssigneeAvatar(avatars[e.target.value] || '👤');
                  }}
                >
                  <option value="Alex Mercer">Alex Mercer</option>
                  <option value="Sarah Connor">Sarah Connor</option>
                  <option value="Elena Rostova">Elena Rostova</option>
                  <option value="Marcus Vance">Marcus Vance</option>
                </select>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                  {newAssigneeAvatar}
                </div>
              </div>
              <div className={styles.quickFormActions}>
                <button
                  type="button"
                  className={`${styles.btnText} ${styles.btnTextCancel}`}
                  onClick={() => setActiveFormCol(null)}
                >
                  Cancel
                </button>
                <button type="submit" className={`${styles.btnText} ${styles.btnTextSubmit}`}>
                  Add Task
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tasks list */}
        <div className={styles.taskList}>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className={styles.taskCard}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
              >
                <div className={styles.cardHeader}>
                  <span className={`${styles.priorityBadge} ${styles[`priority${task.priority}`]}`}>
                    {task.priority}
                  </span>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    style={{ color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
                    title="Delete Task"
                  >
                    🗑️
                  </button>
                </div>
                <h4 className={styles.taskTitle}>{task.title}</h4>
                {task.description && <p className={styles.taskDesc}>{task.description}</p>}
                
                {/* Mobile/Accessibility Move Controls */}
                <div className={styles.taskActions}>
                  {status !== 'pending' && (
                    <button
                      className={styles.actionBtn}
                      onClick={() => moveTask(task.id, status === 'completed' ? 'in-progress' : 'pending')}
                    >
                      ← Move
                    </button>
                  )}
                  {status !== 'completed' && (
                    <button
                      className={styles.actionBtn}
                      onClick={() => moveTask(task.id, status === 'pending' ? 'in-progress' : 'completed')}
                    >
                      Move →
                    </button>
                  )}
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.dueDate}>📅 {task.dueDate}</span>
                  <span className={styles.assignee}>
                    <span className={styles.assigneeAvatar}>{task.assignee.avatar}</span>
                    <span>{task.assignee.name.split(' ')[0]}</span>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyColumnState}>
              <div className={styles.emptyColumnIcon}>
                {status === 'pending' ? '📥' : status === 'in-progress' ? '⚡' : '🎉'}
              </div>
              <p>No tasks here</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Header section */}
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn}>
          ← Back to Projects
        </Link>
        <div className={styles.projectInfo}>
          <div className={styles.infoLeft}>
            <div className={styles.iconWrapper}>{project.icon}</div>
            <div className={styles.details}>
              <div className={styles.titleRow}>
                <h1 className={styles.projectName}>{project.name}</h1>
                <span className={styles.categoryTag}>{project.category}</span>
                <span className={styles.categoryTag} style={{ background: 'var(--color-completed-glow)', color: 'var(--color-completed)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                  {progressPct}% Done
                </span>
              </div>
              <p className={styles.projectDesc}>{project.description}</p>
            </div>
          </div>
          <div className={styles.infoRight}>
            <ThemeToggle />
            <div className={styles.searchBar}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search tasks..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* 3-Column Kanban Board */}
      <main className={styles.board}>
        {renderColumn('Pending', 'pending', pendingTasks)}
        {renderColumn('In Progress', 'in-progress', inProgressTasks)}
        {renderColumn('Completed', 'completed', completedTasks)}
      </main>
    </div>
  );
}
