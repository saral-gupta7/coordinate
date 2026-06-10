const experienceOptions = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
] as const;

const learningModeOptions = [
  { label: "Guided path", value: "guided path" },
  { label: "Concept mastery", value: "concept mastery" },
  { label: "Practical application", value: "practical application" },
  { label: "Reading focused", value: "reading focused" },
  { label: "Discussion based", value: "discussion based" },
  { label: "Exam preparation", value: "exam preparation" },
];

const preferredStyleOptions = [
  { label: "Step by step", value: "step by step" },
  { label: "Visual examples", value: "visual examples" },
  { label: "Story driven", value: "story driven" },
  { label: "Practice based", value: "practice based" },
  { label: "Theory first", value: "theory first" },
  { label: "Case studies", value: "case studies" },
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
