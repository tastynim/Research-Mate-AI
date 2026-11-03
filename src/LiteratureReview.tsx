import { useRef, useState } from "react"
import type { DragEvent, FormEvent } from "react"
import { Icon } from "./ui"
import { extractPdfText } from "./pdfExtract"
import type { PaperDoc, Project } from "./workspace"
import { formatBytes } from "./workspace"
import "./tools.css"
import "./topic-explorer.css"

type Props = {
  projects: Project[]
  papers: PaperDoc[]
  onAddPaper: (paper: PaperDoc) => void
}

export default function LiteratureReview({
  projects,
  papers,
  onAddPaper,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [projectId, setProjectId] = useState(String(projects[0]?.id ?? ""))
  const [selectedId, setSelectedId] = useState(papers[0]?.id ?? "")
  const selected =
    papers.find((paper) => paper.id === selectedId) || papers[0] || null

  async function ingest(file: File) {
    setError("")
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Upload a PDF file. Other formats are not extracted.")
      return
    }
    if (file.size > 15 * 1024 * 1024) {
      setError("Please choose a PDF smaller than 15 MB.")
      return
    }
    setBusy(true)
    try {
      const extracted = await extractPdfText(file)
      const paper: PaperDoc = {
        id: `paper-${Date.now()}`,
        name: file.name,
        size: file.size,
        pages: extracted.pages,
        wordCount: extracted.wordCount,
        charCount: extracted.charCount,
        uploadedAt: new Date().toISOString(),
        projectId: projectId ? Number(projectId) : null,
        text: extracted.text,
        preview: extracted.preview,
        truncated: extracted.truncated,
      }
      onAddPaper(paper)
      setSelectedId(paper.id)
    } catch {
      setError("This file could not be read as a PDF. Try another document.")
    } finally {
      setBusy(false)
    }
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setDragging(false)
    const file = event.dataTransfer.files[0]
    if (file) void ingest(file)
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const file = inputRef.current?.files?.[0]
    if (file) void ingest(file)
    else setError("Choose a PDF to extract readable text.")
  }

  return (
    <div className="tool-page">
      <div className="page-heading te-page-heading">
        <div>
          <div className="te-breadcrumb">
            <span>AI research toolkit</span>
            <Icon name="chevron" size={10} />
            <span>Literature Review</span>
          </div>
          <h1>Literature Review Assistant</h1>
          <p>
            Upload a paper, extract the readable text, and inspect document
            information. No generated summaries.
          </p>
        </div>
      </div>
      <div className="te-intro-strip">
        <span className="te-intro-icon">
          <Icon name="book" size={21} />
        </span>
        <div>
          <strong>Read what is actually in the file.</strong>
          <p>
            Text is extracted on your device. ResearchMate does not invent a
            literature review from this upload.
          </p>
        </div>
      </div>
      <div className="tool-layout">
        <form className="tool-card-panel" onSubmit={onSubmit}>
          <div className="te-card-heading">
            <span className="te-step-number">01</span>
            <div>
              <h2>Add a research PDF</h2>
              <p>Extraction uses the text layer of the file, not an AI model.</p>
            </div>
          </div>
          <label className="te-field-label">
            Save into project <span>Optional</span>
            <select
              className="tool-select"
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
            >
              <option value="">Unassigned</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </label>
          <label
            className={`tool-dropzone ${dragging ? "is-dragging" : ""}`}
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <Icon name="file" size={22} />
            <strong>{busy ? "Extracting readable text…" : "Drop a PDF here"}</strong>
            <p>or click to browse · PDF only · max 15 MB</p>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              disabled={busy}
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) void ingest(file)
              }}
            />
          </label>
          {error && (
            <div className="te-form-error" role="alert">
              <Icon name="help" size={17} />
              <span>{error}</span>
            </div>
          )}
          {selected && (
            <>
              <div className="tool-meta-grid">
                <div className="tool-meta">
                  <span>File</span>
                  <strong>{selected.name}</strong>
                </div>
                <div className="tool-meta">
                  <span>Size</span>
                  <strong>{formatBytes(selected.size)}</strong>
                </div>
                <div className="tool-meta">
                  <span>Pages</span>
                  <strong>{selected.pages}</strong>
                </div>
                <div className="tool-meta">
                  <span>Extracted words</span>
                  <strong>{selected.wordCount.toLocaleString()}</strong>
                </div>
              </div>
              <h3 className="te-card-heading" style={{ marginBottom: 10 }}>
                Extracted text preview
              </h3>
              {selected.wordCount === 0 ? (
                <p className="te-result-explanation">
                  No readable text layer was found. This PDF may be a scan or
                  image-only file.
                </p>
              ) : (
                <pre className="tool-preview">{selected.preview}</pre>
              )}
              {selected.truncated && (
                <p className="form-note">
                  <Icon name="help" size={15} />
                  Only the first portion of a very long PDF is stored in this
                  browser.
                </p>
              )}
            </>
          )}
        </form>
        <aside className="te-guidance">
          <div className="te-guide-card">
            <span className="te-guide-eyebrow">YOUR LIBRARY</span>
            <h3 style={{ fontSize: 18, margin: "10px 0 12px" }}>
              {papers.length} uploaded
            </h3>
            <p>Documents stay in this browser with localStorage.</p>
            <div className="tool-list" style={{ marginTop: 16 }}>
              {papers.length === 0 && (
                <p>Upload a PDF to inspect its pages, size, and extracted text.</p>
              )}
              {papers.map((paper) => (
                <button
                  type="button"
                  key={paper.id}
                  className={`tool-select-item ${paper.id === selected?.id ? "is-active" : ""}`}
                  onClick={() => setSelectedId(paper.id)}
                >
                  <Icon name="file" size={16} />
                  <span>
                    <strong>{paper.name}</strong>
                    <small>
                      {paper.pages} pages · {paper.wordCount.toLocaleString()} words
                    </small>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
