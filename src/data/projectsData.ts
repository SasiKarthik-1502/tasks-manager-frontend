export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignee: {
    name: string;
    avatar: string;
  };
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  tasks: Task[];
}

export const initialProjects: Project[] = [
  {
    id: "acme-redesign",
    name: "Acme Site Redesign",
    description: "Revamp Acme Corp's client-facing website with a modern design, improved performance, and a sleek dark mode interface.",
    category: "Development",
    icon: "💻",
    tasks: [
      {
        id: "task-1",
        title: "Setup Next.js 16 Boilerplate",
        description: "Initialize the project using TypeScript, App Router, and define standard CSS variables.",
        status: "completed",
        priority: "high",
        dueDate: "2026-08-10",
        assignee: { name: "Sarah Connor", avatar: "👩‍💻" }
      },
      {
        id: "task-2",
        title: "Implement Navigation Component",
        description: "Create a sticky, modern navigation bar with responsive mobile drawer menu and glassmorphism.",
        status: "in-progress",
        priority: "medium",
        dueDate: "2026-08-22",
        assignee: { name: "Alex Mercer", avatar: "👨‍💻" }
      },
      {
        id: "task-3",
        title: "Dark Mode Integration",
        description: "Configure CSS custom properties for full color scheme shifting support based on user preference.",
        status: "pending",
        priority: "medium",
        dueDate: "2026-08-28",
        assignee: { name: "Sarah Connor", avatar: "👩‍💻" }
      },
      {
        id: "task-4",
        title: "SEO Optimization & Meta Tags",
        description: "Add dynamic metadata support to all routes and include structured JSON-LD schemas.",
        status: "pending",
        priority: "low",
        dueDate: "2026-09-02",
        assignee: { name: "Elena Rostova", avatar: "👩‍🎨" }
      },
      {
        id: "task-5",
        title: "Audit & Fix Accessibility Issues",
        description: "Perform screen reader verification and fix contrast ratios on home page hero text.",
        status: "completed",
        priority: "high",
        dueDate: "2026-08-15",
        assignee: { name: "Marcus Vance", avatar: "🧙‍♂️" }
      }
    ]
  },
  {
    id: "fitness-tracker",
    name: "Pulse Fitness App",
    description: "Develop a mobile-first workout tracking dashboard featuring interactive charts, auth, and heart rate integration.",
    category: "Mobile",
    icon: "🏃‍♂️",
    tasks: [
      {
        id: "task-6",
        title: "Design Figma Mockups",
        description: "Create high-fidelity wireframes for the workout stats page, charts, and onboarding screen.",
        status: "completed",
        priority: "high",
        dueDate: "2026-08-05",
        assignee: { name: "Elena Rostova", avatar: "👩‍🎨" }
      },
      {
        id: "task-7",
        title: "User Authentication Flow",
        description: "Set up secure JWT-based email/password register, login, and Google OAuth flows.",
        status: "in-progress",
        priority: "high",
        dueDate: "2026-08-20",
        assignee: { name: "Alex Mercer", avatar: "👨‍💻" }
      },
      {
        id: "task-8",
        title: "ChartJS/Recharts Integration",
        description: "Build an interactive weekly workout progress chart with hover tooltips and dynamic filters.",
        status: "pending",
        priority: "medium",
        dueDate: "2026-08-25",
        assignee: { name: "Sarah Connor", avatar: "👩‍💻" }
      },
      {
        id: "task-9",
        title: "Apple Health API Sync",
        description: "Interface with health APIs to fetch active calories and resting heart rate data.",
        status: "pending",
        priority: "high",
        dueDate: "2026-09-10",
        assignee: { name: "Alex Mercer", avatar: "👨‍💻" }
      }
    ]
  },
  {
    id: "marketing-q3",
    name: "Q3 Launch Campaign",
    description: "Coordinate a multi-channel product marketing campaign including visual assets, social media copies, and a webinar.",
    category: "Marketing",
    icon: "📣",
    tasks: [
      {
        id: "task-10",
        title: "Launch Webinar Deck",
        description: "Draft presentation slides detailing product features, customer case studies, and Q&A timeline.",
        status: "in-progress",
        priority: "high",
        dueDate: "2026-08-24",
        assignee: { name: "Elena Rostova", avatar: "👩‍🎨" }
      },
      {
        id: "task-11",
        title: "Social Media Banner Assets",
        description: "Design promotional graphics for LinkedIn, Twitter, and Facebook campaign posts.",
        status: "completed",
        priority: "low",
        dueDate: "2026-08-12",
        assignee: { name: "Marcus Vance", avatar: "🧙‍♂️" }
      },
      {
        id: "task-12",
        title: "Email Newsletter Copywriting",
        description: "Write announcement email sequences for general audience, VIPs, and media contacts.",
        status: "pending",
        priority: "medium",
        dueDate: "2026-08-30",
        assignee: { name: "Sarah Connor", avatar: "👩‍💻" }
      }
    ]
  },
  {
    id: "devops-migration",
    name: "Cloud Migration",
    description: "Shift legacy physical database infrastructure to secure, scalable Kubernetes clusters on AWS.",
    category: "DevOps",
    icon: "☁️",
    tasks: [
      {
        id: "task-13",
        title: "Write Terraform Configs",
        description: "Define VPC, public/private subnets, Security Groups, and RDS Postgres configurations.",
        status: "completed",
        priority: "high",
        dueDate: "2026-08-10",
        assignee: { name: "Alex Mercer", avatar: "👨‍💻" }
      },
      {
        id: "task-14",
        title: "Setup CI/CD Actions Workflow",
        description: "Build GitHub Actions to automate Docker container builds, linting, and staging deployments.",
        status: "in-progress",
        priority: "high",
        dueDate: "2026-08-22",
        assignee: { name: "Marcus Vance", avatar: "🧙‍♂️" }
      },
      {
        id: "task-15",
        title: "Postgres Database Migration",
        description: "Migrate 2.5 TB production database with minimal downtime using replication streams.",
        status: "pending",
        priority: "high",
        dueDate: "2026-09-01",
        assignee: { name: "Alex Mercer", avatar: "👨‍💻" }
      },
      {
        id: "task-16",
        title: "Kubernetes Horizontal Pod Autoscaling",
        description: "Configure HPA based on CPU usage and setup custom Prometheus metrics alerting.",
        status: "pending",
        priority: "medium",
        dueDate: "2026-08-29",
        assignee: { name: "Marcus Vance", avatar: "🧙‍♂️" }
      }
    ]
  }
];
