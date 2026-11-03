import { useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import { Icon, Modal } from "./ui"
import type { IconName } from "./ui"
import TopicExplorer from "./TopicExplorer"
import LiteratureReview from "./LiteratureReview"
import ChatWithPapers from "./ChatWithPapers"
import GapFinder from "./GapFinder"
import ResearchWorkspace from "./ResearchWorkspace"
import type { TopicDraft } from "./topicDemo"
import {
  type ActivityItem,
  type AppPage,
  type ChatMessage,
  type PaperDoc,
  type Project,
  type ResearchNote,
  PAGE_HASH,
  loadWorkspace,
  pageFromHash,
  relativeTime,
  saveWorkspace,
} from "./workspace"

const tools: {
  title: string
  short: string
  description: string
  action: string
  icon: IconName
  color: string
}[] = [
  {
    title: "Topic Explorer",
    short: "Topic Explorer",
    description:
      "Discover research topics, shape meaningful questions, and define your objectives.",
    action: "Explore Topics",
    icon: "compass",
    color: "violet",
  },
  {
    title: "Literature Review Assistant",
    short: "Literature Review",
    description:
      "Summarize papers, understand methodologies, and connect research findings.",
    action: "Analyze Papers",
    icon: "book",
    color: "blue",
  },
  {
    title: "Research Gap Finder",
    short: "Research Gap Finder",
    description:
      "Uncover gaps in existing literature and find your next research opportunity.",
    action: "Find Research Gaps",
    icon: "gap",
    color: "orange",
  },
  {
    title: "Chat with Research Papers",
    short: "Chat with Papers",
    description:
      "Go beyond the abstract. Ask questions and get insights from your papers.",
    action: "Start Chatting",
    icon: "chat",
    color: "green",
  },
]

const toolPages: AppPage[] = [
  "topic-explorer",
  "literature",
  "gaps",
  "chat",
]

function ActivityText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/g).map((part, index) =>
        part.startsWith("*") ? (
          <strong key={index}>{part.slice(1, -1)}</strong>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  )
}

function ResearchIllustration() {
  return (
    <div className="research-illustration" aria-hidden="true">
      <svg viewBox="0 0 420 220" fill="none">
        <defs>
          <linearGradient
            id="orb"
            x1="182"
            y1="50"
            x2="272"
            y2="169"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#AD8FF4" />
            <stop offset="1" stopColor="#6D40D1" />
          </linearGradient>
          <linearGradient
            id="paper"
            x1="150"
            y1="43"
            x2="259"
            y2="178"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="#F2EAFF" />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow
              dx="0"
              dy="8"
              stdDeviation="9"
              floodColor="#764DC9"
              floodOpacity=".16"
            />
          </filter>
        </defs>
        <ellipse
          cx="232"
          cy="116"
          rx="146"
          ry="64"
          stroke="#D7C5F7"
          strokeDasharray="4 5"
          transform="rotate(-17 232 116)"
        />
        <ellipse
          cx="232"
          cy="116"
          rx="113"
          ry="88"
          stroke="#DFD1F7"
          transform="rotate(21 232 116)"
        />
        <circle cx="235" cy="116" r="62" fill="#E7DBFB" fillOpacity=".65" />
        <g transform="rotate(-12 204 111)" filter="url(#shadow)">
          <rect
            x="151"
            y="43"
            width="102"
            height="134"
            rx="11"
            fill="url(#paper)"
            stroke="#E6DDF4"
          />
          <rect x="168" y="61" width="31" height="7" rx="3.5" fill="#B59AE7" />
          <rect x="168" y="80" width="67" height="4" rx="2" fill="#DAD0ED" />
          <rect x="168" y="90" width="54" height="4" rx="2" fill="#DAD0ED" />
          <rect x="168" y="100" width="62" height="4" rx="2" fill="#DAD0ED" />
          <path
            d="m171 149 15-20 14 8 16-21 18 9"
            stroke="#9671DC"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M169 117v35h67" stroke="#E3D9F2" strokeWidth="2" />
        </g>
        <g filter="url(#shadow)">
          <rect
            x="235"
            y="80"
            width="72"
            height="78"
            rx="19"
            fill="url(#orb)"
            transform="rotate(10 235 80)"
          />
          <path
            d="m265 100 4.7 13.2 13.3 4.8-13.3 4.7L265 136l-4.8-13.3L247 118l13.2-4.8L265 100Z"
            fill="white"
          />
          <path
            d="m283 96 1.6 4.4 4.4 1.6-4.4 1.6L283 108l-1.6-4.4-4.4-1.6 4.4-1.6L283 96Z"
            fill="#E0D0FF"
          />
        </g>
        <g filter="url(#shadow)">
          <rect x="82" y="130" width="121" height="32" rx="9" fill="white" />
          <circle cx="99" cy="146" r="7" fill="#E8F5EE" />
          <path
            d="m96 146 2 2 4-4"
            stroke="#62A889"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <text
            x="112"
            y="150"
            fontFamily="Inter, sans-serif"
            fontSize="9"
            fontWeight="600"
            fill="#625775"
          >
            Connecting ideas
          </text>
        </g>
        <g filter="url(#shadow)">
          <rect x="279" y="40" width="94" height="32" rx="9" fill="white" />
          <circle cx="295" cy="56" r="7" fill="#F0E9FC" />
          <path
            d="m295 51 1.3 3.7 3.7 1.3-3.7 1.3L295 61l-1.3-3.7L290 56l3.7-1.3L295 51Z"
            fill="#9166DB"
          />
          <text
            x="308"
            y="59"
            fontFamily="Inter, sans-serif"
            fontSize="9"
            fontWeight="600"
            fill="#625775"
          >
            AI-powered
          </text>
        </g>
        <circle cx="114" cy="73" r="5" fill="#B69AE6" />
        <circle cx="329" cy="159" r="5" fill="#B69AE6" />
        <circle cx="251" cy="29" r="3" fill="#CCB9ED" />
        <circle cx="178" cy="196" r="3" fill="#CCB9ED" />
        <path
          d="M337 98v9m-4.5-4.5h9M136 178v8m-4-4h8"
          stroke="#AF90DD"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

export default function App() {
  const [workspace] = useState(loadWorkspace)
  const [page, setPage] = useState<AppPage>(pageFromHash)
  const [savedTopics, setSavedTopics] = useState<Record<number, TopicDraft[]>>(
    workspace.savedTopics,
  )
  const [projects, setProjects] = useState<Project[]>(workspace.projects)
  const [papers, setPapers] = useState<PaperDoc[]>(workspace.papers)
  const [notes, setNotes] = useState<ResearchNote[]>(workspace.notes)
  const [activities, setActivities] = useState<ActivityItem[]>(workspace.activities)
  const [chats, setChats] = useState<ChatMessage[]>(workspace.chats)
  const [search, setSearch] = useState("")
  const [modal, setModal] =
    useState<"new" | "settings" | "upgrade" | "help" | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMobileNav, setShowMobileNav] = useState(false)
  const [showAllProjects, setShowAllProjects] = useState(false)
  const [showAllActivity, setShowAllActivity] = useState(false)
  const [toast, setToast] = useState("")
  const [weeklyDigest, setWeeklyDigest] = useState(workspace.weeklyDigest)
  const [ready, setReady] = useState(false)
  const projectSection = useRef<HTMLElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    setReady(true)
  }, [])
  useEffect(() => {
    if (!ready) return
    saveWorkspace({
      projects,
      papers,
      notes,
      savedTopics,
      activities,
      chats,
      weeklyDigest,
    })
  }, [projects, papers, notes, savedTopics, activities, chats, weeklyDigest, ready])
  useEffect(() => {
    const onHashChange = () => {
      setPage(pageFromHash())
      setShowMobileNav(false)
    }
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])
  function logActivity(
    icon: IconName,
    color: string,
    text: string,
  ) {
    setActivities((previous) => [
      {
        id: `act-${Date.now()}`,
        icon,
        color,
        text,
        time: "Just now",
        timestamp: Date.now(),
      },
      ...previous,
    ])
  }
  function navigate(nextPage: AppPage, toProjects = false) {
    setPage(nextPage)
    window.location.hash = PAGE_HASH[nextPage]
    setShowMobileNav(false)
    requestAnimationFrame(() => {
      if (toProjects)
        projectSection.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      else window.scrollTo({ top: 0, behavior: "smooth" })
    })
  }
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(""), 4500)
    return () => clearTimeout(timer)
  }, [toast])
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])
  function openTool(index: number) {
    const next = toolPages[index]
    if (next) navigate(next)
  }
  function addProject(title: string, description: string, field: string) {
    const id = Date.now()
    setProjects((prev) => [
      {
        id,
        title,
        description,
        field,
        papers: 0,
        progress: 0,
        updated: "Just now",
        color: "violet",
      },
      ...prev,
    ])
    logActivity("folder", "violet", `Created a new project *${title}*`)
    return id
  }
  function createProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const title = String(form.get("title")).trim()
    if (!title) return
    addProject(
      title,
      String(form.get("description")).trim() ||
        "A new research journey, ready to explore.",
      String(form.get("field")),
    )
    setModal(null)
    setSearch("")
    setToast("Your new research project is ready.")
    setShowAllProjects(true)
  }
  const filteredProjects = projects.filter((p) =>
    `${p.title} ${p.field} ${p.description}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  )
  const visibleProjects =
    showAllProjects || search ? filteredProjects : filteredProjects.slice(0, 3)
  return (
    <div className="app-shell">
      {showMobileNav && (
        <div
          className="sidebar-backdrop"
          onClick={() => setShowMobileNav(false)}
        />
      )}
      <aside className={`sidebar ${showMobileNav ? "is-open" : ""}`}>
        <a
          href="#/dashboard"
          className="brand"
          aria-label="ResearchMate AI dashboard"
          onClick={(e) => {
            e.preventDefault()
            navigate("dashboard")
          }}
        >
          <span className="brand-symbol">
            <Icon name="book" size={23} />
            <span className="brand-spark">
              <Icon name="sparkles" size={12} />
            </span>
          </span>
          <span>
            ResearchMate<span className="brand-ai">AI</span>
          </span>
        </a>
        <div className="workspace-switch">
          <span className="workspace-avatar">AW</span>
          <span>
            Academic Workspace<small>Personal workspace</small>
          </span>
          <span className="workspace-dot" />
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav aria-label="Main navigation">
          <button
            className={`nav-item ${page === "dashboard" ? "active" : ""}`}
            aria-current={page === "dashboard" ? "page" : undefined}
            onClick={() => {
              setShowMobileNav(false)
              setSearch("")
              navigate("dashboard")
            }}
          >
            <Icon name="grid" />
            <span>Dashboard</span>
            {page === "dashboard" && <span className="active-dot" />}
          </button>
          {tools.map((tool, i) => (
            <button
              key={tool.title}
              className={`nav-item ${
                page === toolPages[i] ? "active" : ""
              }`}
              aria-current={page === toolPages[i] ? "page" : undefined}
              onClick={() => openTool(i)}
            >
              <Icon name={tool.icon} />
              <span>{tool.short}</span>
              {page === toolPages[i] && <span className="active-dot" />}
              {i === 2 && page !== toolPages[i] && (
                <span className="new-badge">NEW</span>
              )}
            </button>
          ))}
          <button
            className={`nav-item ${page === "workspace" ? "active" : ""}`}
            aria-current={page === "workspace" ? "page" : undefined}
            onClick={() => {
              setShowAllProjects(true)
              navigate("workspace")
            }}
          >
            <Icon name="folder" />
            <span>My Research Workspace</span>
          </button>
        </nav>
        <div className="sidebar-divider" />
        <button
          className="nav-item"
          onClick={() => {
            setModal("settings")
            setShowMobileNav(false)
          }}
        >
          <Icon name="settings" />
          <span>Settings</span>
        </button>
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <span className="upgrade-icon">
              <Icon name="sparkles" size={20} />
            </span>
            <h3>A little more possibility.</h3>
            <p>
              Big ideas deserve fewer limits.
              <br />
              Unlock your full research potential.
            </p>
            <button onClick={() => setModal("upgrade")}>
              Explore ResearchMate Pro <Icon name="arrow" size={16} />
            </button>
          </div>
          <button className="help-button" onClick={() => setModal("help")}>
            <Icon name="help" size={18} />
            Help & getting started
            <Icon name="external" size={14} />
          </button>
          <div className="sidebar-footer">
            <span className="status-dot" />
            All systems operational<span>v.1.0</span>
          </div>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            aria-label="Open navigation"
            onClick={() => setShowMobileNav(true)}
          >
            <Icon name="menu" />
          </button>
          <div className="search-wrap">
            <Icon name="search" size={19} />
            <input
              ref={searchRef}
              aria-label="Search research projects"
              placeholder="Search your research projects..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                if (e.target.value) navigate("dashboard", true)
              }}
            />
            <kbd>⌘ K</kbd>
            {search && (
              <button
                className="search-clear"
                aria-label="Clear search"
                onClick={() => setSearch("")}
              >
                <Icon name="close" size={15} />
              </button>
            )}
          </div>
          <div className="topbar-actions">
            <button
              className="primary-button new-project"
              aria-label="New Research Project"
              onClick={() => setModal("new")}
            >
              <Icon name="plus" size={17} />
              <span>New Research Project</span>
            </button>
            <div className="notification-wrap">
              <button
                className={`icon-button notification-button ${
                  showNotifications ? "selected" : ""
                }`}
                aria-label="Notifications"
                aria-expanded={showNotifications}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Icon name="bell" size={20} />
                <span />
              </button>
              {showNotifications && (
                <>
                  <div
                    className="popover-dismiss"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="notification-popover">
                    <div className="popover-title">
                      You're all caught up{" "}
                      <span className="soft-badge">1 new</span>
                    </div>
                    <div className="notification-item">
                      <span className="activity-icon violet">
                        <Icon name="sparkles" size={18} />
                      </span>
                      <div>
                        <strong>Welcome to your research space</strong>
                        <p>
                          Start a project and turn your next idea into something
                          meaningful.
                        </p>
                        <small>Today</small>
                      </div>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => {
                        setShowNotifications(false)
                        setModal("new")
                      }}
                    >
                      Start your next project <Icon name="arrow" size={15} />
                    </button>
                  </div>
                </>
              )}
            </div>
            <span className="topbar-divider" />
            <button
              className="profile-button"
              onClick={() => setModal("settings")}
            >
              <span className="avatar">AC</span>
              <span className="profile-text">
                <strong>Alex Carter</strong>
                <small>Researcher</small>
              </span>
              <Icon name="chevron" size={14} />
            </button>
          </div>
        </header>

        <main hidden={page !== "topic-explorer"} className="topic-page">
          <TopicExplorer
            projects={projects}
            savedTopics={savedTopics}
            onSave={(projectId, topic) => {
              setSavedTopics((previous) => ({
                ...previous,
                [projectId]: [
                  ...(previous[projectId] || []).filter(
                    (item) => item.id !== topic.id,
                  ),
                  structuredClone(topic),
                ],
              }))
              logActivity(
                "note",
                "green",
                `Saved research idea *${topic.title}*`,
              )
              setToast("Research idea saved to your project in this browser.")
            }}
            onCreateProject={(title) =>
              addProject(
                title,
                "Research directions developed in Topic Explorer.",
                "Topic Exploration",
              )
            }
          />
        </main>
        <main hidden={page !== "literature"} className="topic-page">
          <LiteratureReview
            projects={projects}
            papers={papers}
            onAddPaper={(paper) => {
              setPapers((previous) => [paper, ...previous])
              if (paper.projectId) {
                setProjects((previous) =>
                  previous.map((project) =>
                    project.id === paper.projectId
                      ? {
                          ...project,
                          papers: project.papers + 1,
                          updated: "Just now",
                        }
                      : project,
                  ),
                )
              }
              logActivity("book", "blue", `Uploaded paper *${paper.name}*`)
              setToast("PDF text extracted and stored in this browser.")
            }}
          />
        </main>
        <main hidden={page !== "gaps"} className="topic-page">
          <GapFinder papers={papers} />
        </main>
        <main hidden={page !== "chat"} className="topic-page">
          <ChatWithPapers
            papers={papers}
            chats={chats}
            onAsk={(messages) => setChats((previous) => [...previous, ...messages])}
          />
        </main>
        <main hidden={page !== "workspace"} className="topic-page">
          <ResearchWorkspace
            projects={projects}
            papers={papers}
            notes={notes}
            savedTopics={savedTopics}
            onAddNote={(note) => {
              setNotes((previous) => [note, ...previous])
              logActivity("note", "green", `Saved note *${note.title}*`)
              setToast("Note saved in this browser.")
            }}
            onDeleteNote={(id) =>
              setNotes((previous) => previous.filter((note) => note.id !== id))
            }
            onAssignPaper={(paperId, projectId) => {
              setPapers((previous) =>
                previous.map((paper) =>
                  paper.id === paperId ? { ...paper, projectId } : paper,
                ),
              )
            }}
          />
        </main>
        <main hidden={page !== "dashboard"}>
          <div className="page-heading">
            <div>
              <span className="eyebrow">YOUR RESEARCH HQ</span>
              <h1>Dashboard</h1>
            </div>
            <div className="date-label">
              <Icon name="clock" size={15} />
              Monday, May 19, 2025
            </div>
          </div>
          <section className="welcome-banner">
            <div className="welcome-content">
              <div className="welcome-kicker">
                <span />A little curiosity. A world of possibilities.
              </div>
              <h2>
                Welcome back, Researcher
                <span className="greeting-period">!</span>
              </h2>
              <p>
                Your next research breakthrough starts here.
                <br className="welcome-break" /> What would you like to explore
                today?
              </p>
              <div className="welcome-tagline">
                <span />
                From Research Ideas to Research Insights.
              </div>
            </div>
            <ResearchIllustration />
          </section>

          <section className="stats-grid" aria-label="Research statistics">
            {[
              {
                label: "Active Projects",
                value: String(projects.length).padStart(2, "0"),
                icon: "folder" as IconName,
                color: "violet",
                detail: "Stored in this browser",
                trend: true,
              },
              {
                label: "Saved Research Papers",
                value: String(papers.length).padStart(2, "0"),
                icon: "book" as IconName,
                color: "blue",
                detail: papers.length ? "Uploaded PDFs" : "Upload from Literature Review",
                trend: true,
              },
              {
                label: "Research Notes",
                value: String(notes.length).padStart(2, "0"),
                icon: "note" as IconName,
                color: "orange",
                detail: "Your ideas, organized",
                trend: false,
              },
              {
                label: "Completed Analyses",
                value: String(chats.filter((item) => item.role === "assistant").length).padStart(2, "0"),
                icon: "sparkles" as IconName,
                color: "green",
                detail: "Paper questions asked",
                trend: true,
              },
            ].map((stat) => (
              <div className="stat-card" key={stat.label}>
                <div className="stat-top">
                  <span>{stat.label}</span>
                  <span className={`stat-icon ${stat.color}`}>
                    <Icon name={stat.icon} size={19} />
                  </span>
                </div>
                <div className="stat-bottom">
                  <strong>{stat.value}</strong>
                  <span className={stat.trend ? "stat-trend" : "stat-detail"}>
                    {stat.trend && <span>↗</span>}
                    {stat.detail}
                  </span>
                </div>
              </div>
            ))}
          </section>

          <section className="tools-section">
            <div className="section-heading">
              <div>
                <h2>
                  Your AI research toolkit{" "}
                  <span className="ai-label">
                    <Icon name="sparkles" size={12} />
                    POWERED BY AI
                  </span>
                </h2>
                <p>Less busywork. More breakthroughs.</p>
              </div>
              <span className="section-note">
                Built for every step of your research
              </span>
            </div>
            <div className="tools-grid">
              {tools.map((tool, i) => (
                <article className={`tool-card ${tool.color}`} key={tool.title}>
                  <div className="tool-card-top">
                    <span className={`tool-icon ${tool.color}`}>
                      <Icon name={tool.icon} size={23} />
                    </span>
                    <span className="tool-number">0{i + 1}</span>
                  </div>
                  <h3>{tool.title}</h3>
                  <p>{tool.description}</p>
                  <button className="tool-button" onClick={() => openTool(i)}>
                    {tool.action}
                    <Icon name="arrow" size={16} />
                  </button>
                </article>
              ))}
            </div>
          </section>

          <div className="lower-grid">
            <section className="projects-section" ref={projectSection}>
              <div className="section-heading">
                <div>
                  <h2>
                    {showAllProjects
                      ? "My Research Workspace"
                      : "Recent Research Projects"}
                    <span className="count-badge">{projects.length}</span>
                  </h2>
                  <p>Pick up where your curiosity left off.</p>
                </div>
                <button
                  className="text-button"
                  onClick={() => setShowAllProjects(!showAllProjects)}
                >
                  {showAllProjects ? "Show recent" : "View all"}
                  <Icon name="arrow" size={15} />
                </button>
              </div>
              <div className="projects-grid">
                {visibleProjects.map((project) => (
                  <article
                    className="project-card"
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="project-top">
                      <span className={`project-category ${project.color}`}>
                        <span />
                        {project.field}
                      </span>
                      <button
                        className="icon-button project-more"
                        aria-label={`Open ${project.title}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedProject(project)
                        }}
                      >
                        <Icon name="more" size={19} />
                      </button>
                    </div>
                    <button
                      className="project-title"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedProject(project)
                      }}
                    >
                      {project.title}
                    </button>
                    <p className="project-description">{project.description}</p>
                    <div className="project-progress-label">
                      <span>Research progress</span>
                      <strong>{project.progress}%</strong>
                    </div>
                    <div className="progress-track">
                      <span
                        className={project.color}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="project-meta">
                      <span>
                        <Icon name="file" size={13} />
                        {project.papers} papers
                      </span>
                      <span>{project.updated}</span>
                    </div>
                  </article>
                ))}
              </div>
              {!visibleProjects.length && (
                <div className="empty-state">
                  <Icon name="search" size={26} />
                  <h3>No matching research projects</h3>
                  <p>Try a different title or research field.</p>
                  <button className="text-button" onClick={() => setSearch("")}>
                    Clear search
                  </button>
                </div>
              )}
            </section>
            <section className="activity-section">
              <div className="section-heading">
                <h2>Recent Activity</h2>
                <span
                  className="activity-live"
                  title="Latest workspace activity"
                />
              </div>
              <div className="activity-list">
                {(showAllActivity ? activities : activities.slice(0, 4)).map(
                  (activity) => (
                    <div className="activity-item" key={activity.id}>
                      <span className={`activity-icon ${activity.color}`}>
                        <Icon name={activity.icon} size={15} />
                      </span>
                      <div>
                        <p>
                          <ActivityText text={activity.text} />
                        </p>
                        <time>
                          {activity.timestamp
                            ? relativeTime(activity.timestamp)
                            : activity.time}
                        </time>
                      </div>
                    </div>
                  ),
                )}
              </div>
              <button
                className="activity-view"
                onClick={() => setShowAllActivity(!showAllActivity)}
              >
                {showAllActivity ? "Show recent activity" : "View all activity"}
                <Icon name="arrow" size={14} />
              </button>
            </section>
          </div>
          <footer className="main-footer">
            <span>Made for curious minds. Built for meaningful research.</span>
            <span>
              <Icon name="sparkles" size={13} />
              Your next insight is closer than you think.
            </span>
          </footer>
        </main>
      </div>

      {modal === "new" && (
        <Modal
          title="Start something meaningful."
          subtitle="Give your next research idea a place to grow."
          onClose={() => setModal(null)}
        >
          <form onSubmit={createProject} className="project-form">
            <label>
              Project name
              <input
                autoFocus
                name="title"
                placeholder="e.g. AI for sustainable urban planning"
                required
                maxLength={120}
              />
            </label>
            <label>
              Research field
              <select name="field">
                <option>Artificial Intelligence</option>
                <option>Healthcare & AI</option>
                <option>Machine Learning</option>
                <option>Social Sciences</option>
                <option>Environmental Science</option>
                <option>Other Research</option>
              </select>
            </label>
            <label>
              What are you exploring? <span>(optional)</span>
              <textarea
                name="description"
                placeholder="A brief description of your research direction..."
                rows={3}
                maxLength={500}
              />
            </label>
            <div className="form-note">
              <Icon name="help" size={15} />
              Saved in this browser with localStorage.
            </div>
            <button className="primary-button form-submit" type="submit">
              <Icon name="plus" size={17} />
              Create Research Project
            </button>
          </form>
        </Modal>
      )}
      {selectedProject && (
        <Modal
          title={selectedProject.title}
          subtitle={selectedProject.description}
          onClose={() => setSelectedProject(null)}
        >
          <div className="project-detail">
            <span className={`project-category ${selectedProject.color}`}>
              {selectedProject.field}
            </span>
            <div className="detail-stats">
              <div>
                <strong>{selectedProject.papers}</strong>
                <span>Saved papers</span>
              </div>
              <div>
                <strong>{selectedProject.progress}%</strong>
                <span>Research progress</span>
              </div>
              <div>
                <strong>{selectedProject.updated}</strong>
                <span>Last updated</span>
              </div>
            </div>
            <div className="progress-track">
              <span
                className={selectedProject.color}
                style={{ width: `${selectedProject.progress}%` }}
              />
            </div>
            {papers.some((paper) => paper.projectId === selectedProject.id) && (
              <section className="te-saved-project-ideas">
                <h3>Uploaded documents</h3>
                {papers
                  .filter((paper) => paper.projectId === selectedProject.id)
                  .map((paper) => (
                    <article key={paper.id}>
                      <strong>{paper.name}</strong>
                      <p>
                        {paper.pages} pages · {paper.wordCount.toLocaleString()}{" "}
                        extracted words
                      </p>
                    </article>
                  ))}
              </section>
            )}
            {notes.some((note) => note.projectId === selectedProject.id) && (
              <section className="te-saved-project-ideas">
                <h3>Notes</h3>
                {notes
                  .filter((note) => note.projectId === selectedProject.id)
                  .map((note) => (
                    <article key={note.id}>
                      <strong>{note.title}</strong>
                      <p>{note.body}</p>
                    </article>
                  ))}
              </section>
            )}
            {!!savedTopics[selectedProject.id]?.length && (
              <section className="te-saved-project-ideas">
                <h3>
                  Saved research ideas{" "}
                  <span className="soft-badge">SESSION ONLY</span>
                </h3>
                {savedTopics[selectedProject.id].map((topic) => (
                  <article key={topic.id}>
                    <strong>{topic.title}</strong>
                    <p>{topic.explanation}</p>
                    <details>
                      <summary>View saved draft · Demo content</summary>
                      <p>
                        <b>Rationale:</b> {topic.rationale}
                      </p>
                      {topic.outputs.includes("questions") && (
                        <p>
                          <b>Question:</b> {topic.question}
                        </p>
                      )}
                      {topic.outputs.includes("objectives") && (
                        <p>
                          <b>Objectives:</b>
                          {"\n"}
                          {topic.objectives}
                        </p>
                      )}
                      {topic.outputs.includes("keywords") && (
                        <p>
                          <b>Keywords:</b> {topic.keywords}
                        </p>
                      )}
                      {topic.outputs.includes("scope") && (
                        <p>
                          <b>Scope:</b> {topic.scope}
                        </p>
                      )}
                    </details>
                  </article>
                ))}
              </section>
            )}
            <h3>Keep your research moving</h3>
            <p>
              Your dedicated workspace for papers, notes, and AI analyses is
              coming soon. Explore the toolkit to see what’s next.
            </p>
            <button
              className="primary-button form-submit"
              onClick={() => {
                setSelectedProject(null)
                openTool(1)
              }}
            >
              Explore Literature Review
              <Icon name="arrow" size={16} />
            </button>
          </div>
        </Modal>
      )}
      {modal === "settings" && (
        <Modal
          title="Your workspace settings"
          subtitle="A space that works the way you do."
          onClose={() => setModal(null)}
        >
          <div className="settings-profile">
            <span className="avatar">AC</span>
            <div>
              <strong>Alex Carter</strong>
              <p>Researcher · Personal workspace</p>
            </div>
            <span className="soft-badge">FREE PLAN</span>
          </div>
          <div className="setting-row">
            <div>
              <strong>Weekly research digest</strong>
              <p>Demo preference for your weekly activity summary.</p>
            </div>
            <button
              className={`toggle ${weeklyDigest ? "on" : ""}`}
              role="switch"
              aria-checked={weeklyDigest}
              aria-label="Weekly research digest"
              onClick={() => setWeeklyDigest(!weeklyDigest)}
            >
              <span />
            </button>
          </div>
          <p className="settings-note">
            Preferences are saved for this preview session only.
          </p>
          <button
            className="primary-button form-submit"
            onClick={() => {
              setModal(null)
              setToast("Workspace preferences updated for this session.")
            }}
          >
            Done
            <Icon name="check" size={17} />
          </button>
        </Modal>
      )}
      {modal === "upgrade" && (
        <Modal
          title="Make room for your next big idea."
          subtitle="Meet ResearchMate Pro. More space to explore, connect, and discover."
          onClose={() => setModal(null)}
        >
          <div className="pro-features">
            {[
              "Unlimited research projects",
              "Deeper, AI-powered paper analyses",
              "Larger paper library and longer conversations",
              "Advanced research gap discovery",
            ].map((feature) => (
              <div key={feature}>
                <span>
                  <Icon name="check" size={15} />
                </span>
                {feature}
              </div>
            ))}
          </div>
          <div className="preview-note">
            <Icon name="sparkles" size={18} />
            <span>
              ResearchMate Pro is coming soon. Your free workspace is ready to
              explore today.
            </span>
          </div>
          <button
            className="primary-button form-submit"
            onClick={() => setModal(null)}
          >
            Back to my research
            <Icon name="arrow" size={16} />
          </button>
        </Modal>
      )}
      {modal === "help" && (
        <Modal
          title="Great research starts with a question."
          subtitle="Here’s how to make yourself at home."
          onClose={() => setModal(null)}
        >
          <div className="help-steps">
            {[
              [
                "Create a research project",
                "Give your idea a title, choose a field, and set a direction.",
              ],
              [
                "Explore your AI toolkit",
                "Preview the tools designed to support every step of your research.",
              ],
              [
                "Keep your ideas connected",
                "Return to your workspace to find your projects and track your progress.",
              ],
            ].map(([title, desc], i) => (
              <div key={title}>
                <span>{i + 1}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            className="primary-button form-submit"
            onClick={() => {
              setModal(null)
              setModal("new")
            }}
          >
            Create my first project
            <Icon name="arrow" size={16} />
          </button>
        </Modal>
      )}
      {toast && (
        <div className="toast" role="status">
          <span>
            <Icon name="check" size={17} />
          </span>
          {toast}
          <button
            className="icon-button"
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
