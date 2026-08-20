import { Project, Task } from '@/data/projectsData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const taskService = {
  // ==========================================
  // Projects APIs
  // ==========================================

  async getProjects(): Promise<Project[]> {
    const res = await fetch(`${API_BASE_URL}/projects`); 
    if (!res.ok) {
      throw new Error('Failed to fetch projects');
    }
    return res.json();
  },

  async getProject(id: string): Promise<Project> {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch project with id: ${id}`);
    }
    return res.json();
  },

  async createProject(project: Omit<Project, 'id' | 'tasks'>): Promise<Project> {
    const res = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    if (!res.ok) {
      throw new Error('Failed to create project');
    }
    return res.json();
  },

  async updateProject(id: string, project: Partial<Omit<Project, 'id' | 'tasks'>>): Promise<Project> {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    if (!res.ok) {
      throw new Error(`Failed to update project with id: ${id}`);
    }
    return res.json();
  },

  async deleteProject(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error(`Failed to delete project with id: ${id}`);
    }
  },

  // ==========================================
  // Tasks APIs
  // ==========================================

  async createTask(projectId: string, task: Omit<Task, 'id'>): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!res.ok) {
      throw new Error('Failed to create task');
    }
    return res.json();
  },

  async updateTask(projectId: string, taskId: string, task: Partial<Task>): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!res.ok) {
      throw new Error('Failed to update task');
    }
    return res.json();
  },

  async deleteTask(projectId: string, taskId: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('Failed to delete task');
    }
  }
};
