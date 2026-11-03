import { useState } from "react"
import type { FormEvent } from "react"
import { Icon } from "./ui"
import type { PaperDoc, Project, ResearchNote, TopicDraft } from "./workspace"
import { formatBytes } from "./workspace"
import "./tools.css"
import "./topic-explorer.css"

type Props = {
  projects: Project[]
  papers: PaperDoc[]
  notes: ResearchNote[]
  savedTopics: Record<number, TopicDraft[]>
  onAddNote: (note: ResearchNote) => void
  onDeleteNote: (id: string) => void
  onAssignPaper: (paperId: string, projectId: number | null) => void
}

export default function ResearchWorkspace({
  projects,
  papers,
  notes,
  savedTopics,
  onAddNote,
  onDeleteNote,
  onAssignPaper,
}: Props) {
  const [projectId, setProjectId] = useState(String(projects[0]?.id ?? ""))
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const selectedId = Number(projectId)
  const projectNotes = notes.filter((note) => note.projectId === selectedId)
  const projectPapers = papers.filter((paper) => paper.projectId === selectedId)
  const ideas = savedTopics[selectedId] || []

  function saveNote(event: FormEvent) {
    event.preventDefault()
    if (!title.trim() || !projectId) return
    onAddNote({
      id: `note-${Date.now()}`,
      projectId: selectedId,
      title: title.trim(),
      body: body.trim(),
      updatedAt: new Date().toISOString(),
    })
    setTitle("")
    setBody("")
  }

  return (
    <div className="tool-page">
      <div className="page-heading te-page-heading">
        <div>
          <div className="te-breadcrumb">
            <span>Workspace</span>
            <Icon name="chevron" size={10} />
            <span>My Research</span>
          </div>
          <h1>My Research Workspace</h1>
          <p>
            Projects, notes, and uploaded documents are stored in this browser
            with localStorage.
          </p>
        </div>
      </div>
      <label className="te-field-label">
        Active project
        <select
          className="tool-select"
          value={projectId}
          onChange={(event) => setProjectId(event.target.value)}
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </label>
      <div className="workspace-split">
        <section className="tool-card-panel">
          <div className="te-card-heading">
            <span className="te-step-number">
              <Icon name="note" size={14} />
            </span>
            <div>
              <h2>Research notes</h2>
              <p>Keep a working note for the selected project.</p>
            </div>
          </div>
          <form className="project-form" onSubmit={saveNote}>
            <label>
              Note title
              <input
                value={title}
                maxLength={120}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Methods to revisit"
                required
              />
            </label>
            <label>
              Note
              <textarea
                value={body}
                rows={4}
                maxLength={2000}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Write a note to store with this project…"
              />
            </label>
            <button className="primary-button form-submit" type="submit">
              <Icon name="plus" size={16} />
              Save note
            </button>
          </form>
          <div className="note-grid" style={{ marginTop: 18 }}>
            {projectNotes.map((note) => (
              <article className="note-card" key={note.id}>
                <h3>{note.title}</h3>
                <p>{note.body || "No additional text."}</p>
                <div className="tool-inline-actions">
                  <small className="form-note">{new Date(note.updatedAt).toLocaleString()}</small>
                  <button className="text-button" type="button" onClick={() => onDeleteNote(note.id)}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
            {!projectNotes.length && (
              <p className="te-result-explanation">No notes in this project yet.</p>
            )}
          </div>
        </section>
        <section className="tool-card-panel">
          <div className="te-card-heading">
            <span className="te-step-number">
              <Icon name="file" size={14} />
            </span>
            <div>
              <h2>Uploaded documents</h2>
              <p>Assign library PDFs to this project.</p>
            </div>
          </div>
          <div className="tool-list">
            {papers.map((paper) => (
              <div className="tool-list-item" key={paper.id}>
                <Icon name="file" size={16} />
                <span style={{ flex: 1 }}>
                  <strong>{paper.name}</strong>
                  <small>
                    {formatBytes(paper.size)} · {paper.pages} pages
                    {paper.projectId === selectedId ? " · in this project" : ""}
                  </small>
                </span>
                <button
                  type="button"
                  className="text-button"
                  onClick={() =>
                    onAssignPaper(
                      paper.id,
                      paper.projectId === selectedId ? null : selectedId,
                    )
                  }
                >
                  {paper.projectId === selectedId ? "Unassign" : "Assign"}
                </button>
              </div>
            ))}
            {!papers.length && (
              <p className="te-result-explanation">
                Upload PDFs in Literature Review to see them here.
              </p>
            )}
          </div>
          <h3 style={{ fontSize: 13, margin: "22px 0 10px" }}>
            Documents in this project ({projectPapers.length})
          </h3>
          {ideas.length > 0 && (
            <div className="te-saved-project-ideas">
              <h3>
                Saved Topic Explorer ideas{" "}
                <span className="soft-badge">LOCAL</span>
              </h3>
              {ideas.map((topic) => (
                <article key={topic.id}>
                  <strong>{topic.title}</strong>
                  <p>{topic.explanation}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
