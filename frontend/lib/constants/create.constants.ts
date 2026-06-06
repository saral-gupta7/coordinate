const experienceOptions = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
] as const;

const learningModeOptions = [
  "skill-building",
  "project-based",
  "interview-prep",
  "exam-prep",
  "research",
  "standard",
];

const preferredStyleOptions = [
  "project-based",
  "visual examples",
  "step-by-step",
  "hands-on labs",
  "concept-first",
  "challenge-driven",
];

const agentPreview = [
  "Clean topic",
  "Validate topic",
  "Profile learner",
  "Plan curriculum",
];

export {
  experienceOptions,
  learningModeOptions,
  preferredStyleOptions,
  agentPreview,
};
