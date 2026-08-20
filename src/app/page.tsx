'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { Project } from '@/data/projectsData';
import ThemeToggle from '@/components/ThemeToggle';
import { taskService } from '@/services/taskService';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Development');
  const [icon, setIcon] = useState('📁');

  useEffect(() => {
    setMounted(true);
    const fetchProjects = async () => {
      try {
        const data = await taskService.getProjects();
        setProjects(data);
      } catch (e) {
        console.error("Failed to fetch projects from backend:", e);
      }
    };
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const newProject = await taskService.createProject({
        name,
        description,
        category,
        icon
      });
      setProjects([...projects, newProject]);

      // Reset form
      setName('');
      setDescription('');
      setCategory('Development');
      setIcon('📁');
      setIsModalOpen(false);
    } catch (e) {
      console.error("Failed to create project:", e);
    }
  };

  // Filter projects by name or category
  const filteredProjects = projects.filter(project => {
    const searchLower = searchTerm.toLowerCase();
    return (
      project.name.toLowerCase().includes(searchLower) ||
      project.category.toLowerCase().includes(searchLower)
    );
  });

  // Calculate high-level stats
  const totalProjects = projects.length;
  const totalTasks = projects.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasks = projects.reduce((acc, p) => acc + p.tasks.filter(t => t.status === 'completed').length, 0);
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (!mounted) {
    return (
      <div className={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div style={{ animation: 'pulseGlow 2s infinite', padding: '16px', borderRadius: '8px', color: 'var(--text-secondary)' }}>
            Loading workspace details...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>
            Workspace <span className="text-gradient">Projects</span>
          </h1>
          <p>Select a project to view its kanban board and tasks</p>
        </div>
        <div className={styles.actionsArea}>
          <ThemeToggle />
          <div className={styles.searchBar}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search project or category..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
            <span>+</span> Create Project
          </button>
        </div>
      </header>

      {/* Stats Summary Panel */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Projects</span>
          <span className={styles.statValue}>{totalProjects}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Active Tasks</span>
          <span className={styles.statValue}>{totalTasks}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Task Completion</span>
          <span className={styles.statValue}>{overallProgress}%</span>
        </div>
      </section>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className={styles.projectsGrid}>
          {filteredProjects.map((project) => {
            const pTasks = project.tasks;
            const pTotal = pTasks.length;
            const pCompleted = pTasks.filter(t => t.status === 'completed').length;
            const pPending = pTasks.filter(t => t.status === 'pending').length;
            const pInprogress = pTasks.filter(t => t.status === 'in-progress').length;
            const progressPct = pTotal > 0 ? Math.round((pCompleted / pTotal) * 100) : 0;

            return (
              <Link href={`/projects/${project.id}`} key={project.id}>
                <div className={styles.projectCard}>
                  <div className={styles.cardTop}>
                    <div className={styles.iconWrapper}>{project.icon}</div>
                    <span className={styles.categoryTag}>{project.category}</span>
                  </div>
                  <div>
                    <h3 className={styles.projectName}>{project.name}</h3>
                    <p className={styles.projectDesc}>{project.description}</p>
                  </div>

                  <div className={styles.progressSection}>
                    <div className={styles.progressHeader}>
                      <span>Progress</span>
                      <span>{progressPct}%</span>
                    </div>
                    <div className={styles.progressBarTrack}>
                      <div
                        className={styles.progressBarFill}
                        style={{ width: `${progressPct}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.taskCounts}>
                      <div className={styles.countItem}>
                        <span className={styles.dotPending}></span>
                        <span>{pPending} pending</span>
                      </div>
                      <div className={styles.countItem}>
                        <span className={styles.dotInprogress}></span>
                        <span>{pInprogress} active</span>
                      </div>
                      <div className={styles.countItem}>
                        <span className={styles.dotCompleted}></span>
                        <span>{pCompleted} done</span>
                      </div>
                    </div>
                    <span className={styles.arrowLink}>→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>📁</div>
          <p className={styles.emptyStateText}>No projects found matching "{searchTerm}"</p>
          <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
            Create New Project
          </button>
        </div>
      )}

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>New Project</h2>
              <button className={styles.btnClose} onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleCreateProject} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="projectName">Project Name</label>
                <input
                  id="projectName"
                  type="text"
                  required
                  placeholder="e.g. Sales Dashboard"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="projectDesc">Description</label>
                <textarea
                  id="projectDesc"
                  rows={3}
                  placeholder="Briefly describe the goals and details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="projectIcon">Icon (Emoji)</label>
                  <select
                    id="projectIcon"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                  >
                    <option value="📁">📁 Folder</option>
                    <option value="💻">💻 Code</option>
                    <option value="🏃‍♂️">🏃‍♂️ Sports</option>
                    <option value="📣">📣 Announcement</option>
                    <option value="☁️">☁️ Cloud</option>
                    <option value="🎨">🎨 Art</option>
                    <option value="📊">📊 Chart</option>
                    <option value="🚀">🚀 Rocket</option>
                    <option value="🔒">🔒 Security</option>
                    <option value="🧠">🧠 Science</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="projectCategory">Category</label>
                  <select
                    id="projectCategory"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.btnCancel} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
