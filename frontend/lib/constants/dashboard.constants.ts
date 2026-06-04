import {
  BookOpenText,
  CheckCircle2,
  Database,
  FileText,
  LayoutDashboard,
  LibraryBig,
  MessageSquareText,
  WandSparkles,
} from "lucide-react";

export const sidebarItems = [
  { label: "Overview", href: "#overview", icon: LayoutDashboard },
  { label: "Courses", href: "#courses", icon: LibraryBig },
  { label: "Planner", href: "#planner", icon: WandSparkles },
  { label: "Lessons", href: "#lessons", icon: BookOpenText },
  { label: "Tutor", href: "#tutor", icon: MessageSquareText },
  { label: "Documents", href: "#documents", icon: Database },
];

export const courses = [
  {
    title: "Practical Machine Learning",
    status: "Active",
    chapters: "8 chapters",
    progress: 64,
    next: "Attention mechanisms lab",
  },
  {
    title: "Backend Systems With FastAPI",
    status: "Draft",
    chapters: "6 chapters",
    progress: 28,
    next: "Internal gateway routes",
  },
  {
    title: "Research Writing Sprint",
    status: "Indexed docs",
    chapters: "5 chapters",
    progress: 42,
    next: "Citation-backed outline",
  },
];

export const buildFlow = [
  "Authenticated Course Workspace",
  "Agentic Course Planner",
  "Lesson Builder With Quiz Generation",
  "Course-Aware Tutor Chat",
  "Document RAG For Personalized Learning",
];

export const agentSteps = [
  "Validate topic",
  "Profile learner",
  "Plan curriculum",
  "Review",
  "Persist course",
];

export const lessonPipeline = [
  { label: "Draft lesson", value: "Ready", icon: BookOpenText },
  { label: "Generate quiz", value: "12 questions", icon: CheckCircle2 },
  { label: "Citations", value: "4 sources", icon: FileText },
];

export const documentRows = [
  { name: "Lecture notes.pdf", status: "Indexed", chunks: "18 chunks" },
  { name: "Project brief.md", status: "Processing", chunks: "7 chunks" },
  { name: "Personal notes.txt", status: "Course-wide", chunks: "11 chunks" },
];

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
};

export const transition = {
  duration: 0.55,
  ease: [0.16, 1, 0.3, 1] as const,
};
