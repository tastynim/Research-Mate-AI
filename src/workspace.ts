import type { IconName } from "./ui"
import type { TopicDraft } from "./topicDemo"

export const STORAGE_KEY = "researchmate-ai-v1"

export type AppPage =
  | "dashboard"
  | "topic-explorer"
  | "literature"
  | "gaps"
  | "chat"
  | "workspace"

export type Project = {
  id: number
  title: string
  description: string
  field: string
  papers: number
  progress: number
  updated: string
  color: string
}

export type PaperDoc = {
  id: string
  name: string
  size: number
  pages: number
  wordCount: number
  charCount: number
  uploadedAt: string
  projectId: number | null
  text: string
  preview: string
  truncated: boolean
}

export type ResearchNote = {
  id: string
  projectId: number
  title: string
  body: string
  updatedAt: string
}

export type ActivityItem = {
  id: string
  icon: IconName
  color: string
  text: string
  time: string
  timestamp: number
}

export type ChatMessage = {
  id: string
  paperId: string
  role: "user" | "assistant"
  text: string
  excerpts?: { quote: string; page: number }[]
  aiAvailable: boolean
  createdAt: number
}

export type WorkspaceState = {
  projects: Project[]
  papers: PaperDoc[]
  notes: ResearchNote[]
  savedTopics: Record<number, TopicDraft[]>
  activities: ActivityItem[]
  chats: ChatMessage[]
  weeklyDigest: boolean
}

export const PAGE_HASH: Record<AppPage, string> = {
  dashboard: "#/dashboard",
  "topic-explorer": "#/topic-explorer",
  literature: "#/literature",
  gaps: "#/gaps",
  chat: "#/chat",
  workspace: "#/workspace",
}

const HASH_PAGE: Record<string, AppPage> = {
  "/dashboard": "dashboard",
  "/topic-explorer": "topic-explorer",
  "/literature": "literature",
  "/gaps": "gaps",
  "/chat": "chat",
  "/workspace": "workspace",
}

export function pageFromHash(hash = window.location.hash): AppPage {
  const path = hash.startsWith("#") ? hash.slice(1) : hash
  return HASH_PAGE[path] ?? "topic-explorer"
}

export const initialProjects: Project[] = [
  {
    id: 1,
    title: "AI-Driven Educational Video Summarization",
    description:
      "Exploring multimodal learning for more accessible educational content.",
    field: "Artificial Intelligence",
    papers: 12,
    progress: 68,
    updated: "2 hours ago",
    color: "violet",
  },
  {
    id: 2,
    title: "Large Language Models in Healthcare",
    description:
      "Evaluating clinical applications and the reliability of large language models.",
    field: "Healthcare & AI",
    papers: 9,
    progress: 42,
    updated: "Yesterday",
    color: "blue",
  },
  {
    id: 3,
    title: "Explainable AI for Financial Prediction",
    description:
      "Making financial forecasting transparent with explainable machine learning.",
    field: "Machine Learning",
    papers: 7,
    progress: 85,
    updated: "2 days ago",
    color: "orange",
  },
]

export const initialActivities: ActivityItem[] = [
  {
    id: "seed-1",
    icon: "sparkles",
    color: "violet",
    text: "Paper summarized *Attention Is All You Need*",
    time: "25 minutes ago",
    timestamp: Date.now() - 25 * 60 * 1000,
  },
  {
    id: "seed-2",
    icon: "folder",
    color: "blue",
    text: "Created a new project *LLMs in Healthcare*",
    time: "2 hours ago",
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    id: "seed-3",
    icon: "book",
    color: "orange",
    text: "Added *3 papers* to your literature review",
    time: "4 hours ago",
    timestamp: Date.now() - 4 * 60 * 60 * 1000,
  },
  {
    id: "seed-4",
    icon: "note",
    color: "green",
    text: "Updated notes in *Explainable AI*",
    time: "Yesterday",
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
  },
]

export function defaultWorkspace(): WorkspaceState {
  return {
    projects: initialProjects,
    papers: [],
    notes: [],
    savedTopics: {},
    activities: initialActivities,
    chats: [],
    weeklyDigest: true,
  }
}

export function loadWorkspace(): WorkspaceState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultWorkspace()
    const parsed = JSON.parse(raw) as Partial<WorkspaceState>
    const base = defaultWorkspace()
    return {
      projects: parsed.projects?.length ? parsed.projects : base.projects,
      papers: parsed.papers ?? [],
      notes: parsed.notes ?? [],
      savedTopics: parsed.savedTopics ?? {},
      activities: parsed.activities?.length ? parsed.activities : base.activities,
      chats: parsed.chats ?? [],
      weeklyDigest: parsed.weeklyDigest ?? true,
    }
  } catch {
    return defaultWorkspace()
  }
}

export function saveWorkspace(state: WorkspaceState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    try {
      const compact: WorkspaceState = {
        ...state,
        papers: state.papers.map((paper) => ({
          ...paper,
          text: paper.text.slice(0, 80_000),
          truncated: true,
        })),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compact))
    } catch {
      /* browser storage full — keep the in-memory session */
    }
  }
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function relativeTime(timestamp: number) {
  const delta = Date.now() - timestamp
  if (delta < 60_000) return "Just now"
  if (delta < 3_600_000) return `${Math.floor(delta / 60_000)} minutes ago`
  if (delta < 86_400_000) return `${Math.floor(delta / 3_600_000)} hours ago`
  if (delta < 172_800_000) return "Yesterday"
  return `${Math.floor(delta / 86_400_000)} days ago`
}

export function isAiConfigured() {
  return Boolean(import.meta.env.VITE_AI_API_KEY)
}

const STOPWORDS = new Set(
  `a an the and or of to in for on with from by as at is are was were be been being this that these those it its into over under about not no than then so such using use used via per also can may between within without which who what when where how their there here more most other into across after before during while both each few many much same own just only very into paper papers research study studies result results method methods model models data analysis based using using using`.split(
    /\s+/,
  ),
)

export function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !STOPWORDS.has(word) && !/^\d+$/.test(word))
}

export function topTerms(text: string, limit = 12) {
  const counts = new Map<string, number>()
  for (const word of tokenize(text)) counts.set(word, (counts.get(word) || 0) + 1)
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([term, count]) => ({ term, count }))
}

export function findPassages(text: string, query: string, limit = 3) {
  const terms = tokenize(query)
  if (!terms.length || !text.trim()) return []
  const blocks = text.split(/--- page (\d+) ---/g)
  const passages: { quote: string; page: number; score: number }[] = []
  for (let i = 1; i < blocks.length; i += 2) {
    const page = Number(blocks[i]) || 1
    const body = (blocks[i + 1] || "").replace(/\s+/g, " ").trim()
    if (!body) continue
    const lower = body.toLowerCase()
    const score = terms.reduce(
      (sum, term) => sum + (lower.includes(term) ? 1 : 0),
      0,
    )
    if (score === 0) continue
    const idx = Math.min(
      ...terms
        .map((term) => lower.indexOf(term))
        .filter((position) => position >= 0),
    )
    const start = Math.max(0, idx - 90)
    passages.push({
      page,
      score,
      quote: `${start > 0 ? "…" : ""}${body.slice(start, start + 280)}${start + 280 < body.length ? "…" : ""}`,
    })
  }
  return passages.sort((a, b) => b.score - a.score).slice(0, limit)
}
