import {
  BookOpenText,
  Database,
  MessageSquareText,
  WandSparkles,
} from "lucide-react";

export const plannerSteps = [
  {
    label: "01",
    title: "Profile",
    body: "Topic, goal, level, learning style, and weekly commitment become the first signal.",
  },
  {
    label: "02",
    title: "Map",
    body: "Coordinate drafts chapters, milestones, quizzes, and a final project as one coherent path.",
  },
  {
    label: "03",
    title: "Study",
    body: "Lessons, tutor answers, and document references stay tied to the course you are taking.",
  },
];

export const agentTrace = [
  "Validate topic",
  "Profile learner",
  "Plan curriculum",
  "Review outline",
  "Persist course",
];

export const metrics = [
  { value: "5", label: "MVP workflows" },
  { value: "1", label: "course-aware workspace" },
  { value: "0", label: "generic lessons" },
];

export const featureCards = [
  {
    icon: WandSparkles,
    title: "Agentic course planner",
    body: "Generate a structured path from a topic and learner profile, with an inspectable run trace.",
  },
  {
    icon: BookOpenText,
    title: "Lesson and quiz builder",
    body: "Turn chapters into study-ready explanations, checkpoint quizzes, and project-oriented next steps.",
  },
  {
    icon: MessageSquareText,
    title: "Course-aware tutor",
    body: "Ask questions inside the course and get answers that understand chapters, progress, and context.",
  },
  {
    icon: Database,
    title: "Document-grounded learning",
    body: "Attach private documents so lessons and tutor answers can retrieve relevant source material.",
  },
];

export const documentSources = [
  "Lecture notes",
  "Research PDF",
  "Project brief",
  "Personal notes",
];

export const viewport = { once: true, margin: "-90px" };

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const revealTransition = {
  duration: 0.6,
  ease: [0.16, 1, 0.3, 1] as const,
};
