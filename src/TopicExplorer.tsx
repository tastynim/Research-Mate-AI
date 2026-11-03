import { useCallback, useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import { Icon, Modal } from "./ui"
import {
  generateDemoTopics,
  outputOptions,
  validateResearchInput,
} from "./topicDemo"
import type { OutputKey, ResearchLevel, TopicDraft } from "./topicDemo"
import "./topic-explorer.css"

const examples = [
  {
    label: "Explainable AI",
    interest:
      "Explainable Artificial Intelligence in Human Activity Recognition",
    discipline: "Computer Science",
  },
  {
    label: "AI in education",
    interest: "The role of AI-assisted tools in undergraduate student learning",
    discipline: "Education",
  },
  {
    label: "Sustainability",
    interest:
      "Sustainability and low-carbon practices in university communities",
    discipline: "Environmental Science",
  },
]
type Props = {
  projects: {
    id: number
    title: string
  }[]
  savedTopics: Record<number, TopicDraft[]>
  onSave: (projectId: number, topic: TopicDraft) => void
  onCreateProject: (title: string) => number
}
type EditableKey = "title" | "explanation" | "rationale" | "question" | "objectives" | "keywords" | "scope"

function DraftField({
  label,
  value,
  editing,
  multiline,
  onChange,
}: {
  label: string
  value: string
  editing: boolean
  multiline?: boolean
  onChange: (value: string) => void
}) {
  return (
    <div className="te-draft-field">
      {editing ? (
        <label>
          {label}
          {multiline ? (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              rows={3}
              maxLength={1500}
            />
          ) : (
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              maxLength={250}
            />
          )}
        </label>
      ) : (
        <>
          <h4>{label}</h4>
          <p>{value}</p>
        </>
      )}
    </div>
  )
}

function ResultCard({
  draft,
  index,
  onChange,
  onSave,
  savedCount,
}: {
  draft: TopicDraft
  index: number
  onChange: (draft: TopicDraft) => void
  onSave: () => void
  savedCount: number
}) {
  const [expanded, setExpanded] = useState(index === 0)
  const [editing, setEditing] = useState(false)
  const [original, setOriginal] = useState(draft)
  const [editError, setEditError] = useState("")
  const update = (key: EditableKey, value: string) => {
    onChange({ ...draft, [key]: value })
    setEditError("")
  }
  const has = (key: OutputKey) => draft.outputs.includes(key)
  function finishEditing() {
    if (!draft.title.trim() || !draft.explanation.trim()) {
      setEditError(
        "Keep a title and a short explanation for this research idea.",
      )
      return
    }
    setEditing(false)
  }
  return (
    <article className={`te-result-card ${editing ? "te-is-editing" : ""}`}>
      <div className="te-result-top">
        <span className="te-result-number">
          DIRECTION {String(index + 1).padStart(2, "0")}
        </span>
        <span className="te-result-source">
          <Icon name="sparkles" size={12} />
          {draft.source} · Demo
        </span>
      </div>
      {editing ? (
        <DraftField
          label="Research title"
          value={draft.title}
          editing
          onChange={(value) => update("title", value)}
        />
      ) : (
        <h3>{draft.title}</h3>
      )}
      {editing ? (
        <DraftField
          label="Short explanation"
          value={draft.explanation}
          editing
          multiline
          onChange={(value) => update("explanation", value)}
        />
      ) : (
        <p className="te-result-explanation">{draft.explanation}</p>
      )}
      <div className="te-result-meta">
        <span>
          <Icon name="book" size={12} />
          {draft.discipline || "Interdisciplinary"}
        </span>
        {draft.level && <span>{draft.level}</span>}
        <span>
          {draft.outputs.length} output{draft.outputs.length !== 1 ? "s" : ""}{" "}
          included
        </span>
      </div>
      {(expanded || editing) && (
        <div id={`details-${draft.id}`} className="te-result-details">
          <DraftField
            label="Research rationale"
            value={draft.rationale}
            editing={editing}
            multiline
            onChange={(value) => update("rationale", value)}
          />
          {has("questions") && (
            <div className="te-question">
              <Icon name="chat" size={17} />
              <DraftField
                label="Possible research question"
                value={draft.question}
                editing={editing}
                multiline
                onChange={(value) => update("question", value)}
              />
            </div>
          )}
          {has("objectives") &&
            (editing ? (
              <DraftField
                label="Research objectives · one per line"
                value={draft.objectives}
                editing
                multiline
                onChange={(value) => update("objectives", value)}
              />
            ) : (
              <div className="te-draft-field">
                <h4>Research objectives</h4>
                <ol className="te-objectives">
                  {draft.objectives
                    .split("\n")
                    .filter(Boolean)
                    .map((objective, i) => (
                      <li key={i}>
                        <span>{String(i + 1).padStart(2, "0")}</span>
                        {objective}
                      </li>
                    ))}
                </ol>
              </div>
            ))}
          {has("keywords") &&
            (editing ? (
              <DraftField
                label="Suggested keywords · comma-separated"
                value={draft.keywords}
                editing
                onChange={(value) => update("keywords", value)}
              />
            ) : (
              <div className="te-draft-field">
                <h4>Suggested keywords</h4>
                <div className="te-keywords">
                  {draft.keywords
                    .split(",")
                    .map((word) => word.trim())
                    .filter(Boolean)
                    .map((word, i) => (
                      <span key={i}>{word}</span>
                    ))}
                </div>
              </div>
            ))}
          {has("scope") && (
            <DraftField
              label="Suggested research scope"
              value={draft.scope}
              editing={editing}
              multiline
              onChange={(value) => update("scope", value)}
            />
          )}
        </div>
      )}
      {editError && (
        <p className="te-error-inline" role="alert">
          {editError}
        </p>
      )}
      <div className="te-result-actions">
        {editing ? (
          <div className="te-edit-actions">
            <button className="text-button" onClick={finishEditing}>
              <Icon name="check" size={14} />
              Done editing
            </button>
            <button
              className="text-button te-muted"
              onClick={() => {
                onChange(original)
                setEditing(false)
                setEditError("")
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <button
              className="text-button te-detail-toggle"
              aria-expanded={expanded}
              aria-controls={`details-${draft.id}`}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Hide details" : "Explore this direction"}
              <Icon name="chevron" size={13} />
            </button>
            <div className="te-result-action-right">
              <button
                className="te-edit-button"
                onClick={() => {
                  setOriginal(structuredClone(draft))
                  setEditing(true)
                  setExpanded(true)
                }}
              >
                <Icon name="note" size={14} />
                Edit result
              </button>
              <button className="te-save-button" onClick={onSave}>
                <Icon name={savedCount ? "check" : "folder"} size={14} />
                {savedCount
                  ? `Saved to ${savedCount} project${savedCount > 1 ? "s" : ""}`
                  : "Save to Project"}
                <Icon name="plus" size={12} />
              </button>
            </div>
          </>
        )}
      </div>
    </article>
  )
}

export default function TopicExplorer({
  projects,
  savedTopics,
  onSave,
  onCreateProject,
}: Props) {
  const [interest, setInterest] = useState("")
  const [discipline, setDiscipline] = useState("")
  const [level, setLevel] = useState<ResearchLevel>("")
  const [outputs, setOutputs] = useState<OutputKey[]>(
    outputOptions.map((option) => option.key),
  )
  const [drafts, setDrafts] = useState<TopicDraft[]>([])
  const [status, setStatus] =
    useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState("")
  const [generatedInterest, setGeneratedInterest] = useState("")
  const [saveDraft, setSaveDraft] = useState<TopicDraft | null>(null)
  const [projectId, setProjectId] = useState("")
  const [newProjectName, setNewProjectName] = useState("")
  const [createNew, setCreateNew] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [showReplace, setShowReplace] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const resultsRef = useRef<HTMLElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )
  const closeSave = useCallback(() => setSaveDraft(null), [])
  const closeReplace = useCallback(() => setShowReplace(false), [])
  const loading = status === "loading"
  function useExample(index: number) {
    const example = examples[index]
    setInterest(example.interest)
    setDiscipline(example.discipline)
    setError("")
    if (status === "error") setStatus(drafts.length ? "success" : "idle")
    inputRef.current?.focus()
  }
  function beginGeneration() {
    const validation = validateResearchInput(interest, outputs)
    if (validation) {
      setError(validation)
      setStatus("error")
      inputRef.current?.focus()
      return
    }
    setShowReplace(false)
    setStatus("loading")
    setError("")
    const snapshot = { interest, discipline, level, outputs: [...outputs] }
    timer.current = setTimeout(() => {
      try {
        const next = generateDemoTopics(
          snapshot.interest,
          snapshot.discipline,
          snapshot.level,
          snapshot.outputs,
          String(Date.now()),
        )
        setDrafts(next)
        setGeneratedInterest(snapshot.interest)
        setStatus("success")
        requestAnimationFrame(() =>
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        )
      } catch {
        setError(
          "The demo draft could not be prepared. Check your research interest and try again.",
        )
        setStatus("error")
      }
      timer.current = null
    }, 1100)
  }
  function submit(event: FormEvent) {
    event.preventDefault()
    const validation = validateResearchInput(interest, outputs)
    if (validation) {
      setError(validation)
      setStatus("error")
      inputRef.current?.focus()
      return
    }
    if (drafts.length) setShowReplace(true)
    else beginGeneration()
  }
  function openSave(draft: TopicDraft) {
    setSaveDraft(draft)
    setProjectId(projects.length ? String(projects[0].id) : "")
    setCreateNew(!projects.length)
    setNewProjectName("")
    setSaveError("")
  }
  function save(event: FormEvent) {
    event.preventDefault()
    if (!saveDraft) return
    let id = Number(projectId)
    if (createNew) {
      if (!newProjectName.trim()) {
        setSaveError("Give your new project a name.")
        return
      }
      id = onCreateProject(newProjectName.trim())
    } else if (!projects.some((project) => project.id === id)) {
      setSaveError("Choose a project to save this idea.")
      return
    }
    onSave(id, saveDraft)
    setSaveDraft(null)
  }
  const selectedProjectHasDraft =
    saveDraft &&
    (savedTopics[Number(projectId)] || []).some(
      (topic) => topic.id === saveDraft.id,
    )
  return (
    <>
      <div className="page-heading te-page-heading">
        <div>
          <div className="te-breadcrumb">
            <span>AI research toolkit</span>
            <Icon name="chevron" size={10} />
            <span>Topic Explorer</span>
          </div>
          <h1>Topic Explorer</h1>
          <p>
            Turn a spark of curiosity into a research direction worth pursuing.
          </p>
        </div>
        <span className="te-demo-label">
          <span />
          INTERACTIVE DEMO
        </span>
      </div>
      <div className="te-intro-strip">
        <span className="te-intro-icon">
          <Icon name="compass" size={21} />
        </span>
        <div>
          <strong>Big ideas start with a focused question.</strong>
          <p>
            Share your interest. Shape your outputs. Find your starting point.
          </p>
        </div>
        <div className="te-flow">
          <span>Interest</span>
          <Icon name="arrow" size={13} />
          <span>Ideas</span>
          <Icon name="arrow" size={13} />
          <span className="te-flow-final">
            Direction
            <Icon name="sparkles" size={12} />
          </span>
        </div>
      </div>
      <div className="te-input-layout">
        <form className="te-input-card" onSubmit={submit} noValidate>
          <div className="te-card-heading">
            <span className="te-step-number">01</span>
            <div>
              <h2>What would you like to research?</h2>
              <p>A broad interest is a great place to start.</p>
            </div>
          </div>
          <fieldset disabled={loading} className="te-interest-fieldset">
            <label className="te-field-label" htmlFor="research-interest">
              Your research interest <span className="te-required">*</span>
            </label>
            <div
              className={`te-textarea-wrap ${error ? "te-input-error" : ""}`}
            >
              <textarea
                ref={inputRef}
                id="research-interest"
                value={interest}
                maxLength={600}
                aria-invalid={!!error}
                aria-describedby={error ? "te-form-error" : "te-interest-hint"}
                placeholder="e.g. Explainable Artificial Intelligence in Human Activity Recognition"
                onChange={(event) => {
                  setInterest(event.target.value)
                  setError("")
                  if (status === "error")
                    setStatus(drafts.length ? "success" : "idle")
                }}
              />
              <div className="te-textarea-footer">
                <span>
                  <Icon name="note" size={12} />
                  Be curious. You don't need the perfect question yet.
                </span>
                <span>{interest.length}/600</span>
              </div>
            </div>
            <div className="te-examples" id="te-interest-hint">
              <span>Try an example:</span>
              {examples.map((example, i) => (
                <button
                  key={example.label}
                  type="button"
                  onClick={() => useExample(i)}
                >
                  {example.label}
                  <Icon name="plus" size={10} />
                </button>
              ))}
            </div>
            <div className="te-select-grid">
              <label className="te-field-label">
                Academic discipline <span>Optional</span>
                <select
                  value={discipline}
                  onChange={(event) => setDiscipline(event.target.value)}
                >
                  <option value="">Select a discipline</option>
                  {[
                    "Computer Science",
                    "Education",
                    "Healthcare & Medicine",
                    "Engineering",
                    "Business & Economics",
                    "Social Sciences",
                    "Environmental Science",
                    "Arts & Humanities",
                    "Other / Interdisciplinary",
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="te-field-label">
                Research level <span>Optional</span>
                <select
                  value={level}
                  onChange={(event) =>
                    setLevel(event.target.value as ResearchLevel)
                  }
                >
                  <option value="">Select your level</option>
                  {["Undergraduate", "Master's", "PhD"].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>
          </fieldset>
          <fieldset disabled={loading} className="te-outputs-fieldset">
            <legend>
              <span className="te-step-number">02</span>
              <span>
                What would you like to explore?
                <small>Select the outputs that support your next step.</small>
              </span>
              <span className="te-selection-count">
                {outputs.length} selected
              </span>
            </legend>
            <div className="te-output-grid">
              {outputOptions.map((option) => (
                <label
                  key={option.key}
                  className={`te-output-option ${
                    outputs.includes(option.key) ? "is-checked" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={outputs.includes(option.key)}
                    onChange={(event) => {
                      setOutputs((previous) =>
                        event.target.checked
                          ? [...previous, option.key]
                          : previous.filter((key) => key !== option.key),
                      )
                      setError("")
                      if (status === "error")
                        setStatus(drafts.length ? "success" : "idle")
                    }}
                  />
                  <span className="te-checkbox">
                    <Icon name="check" size={11} />
                  </span>
                  <span className="te-output-option-icon">
                    <Icon name={option.icon} size={16} />
                  </span>
                  <span>
                    {option.label}
                    <small>{option.description}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          {error && (
            <div className="te-form-error" id="te-form-error" role="alert">
              <Icon name="help" size={17} />
              <span>{error}</span>
              <button
                type="button"
                onClick={() => {
                  setError("")
                  setStatus(drafts.length ? "success" : "idle")
                  inputRef.current?.focus()
                }}
              >
                Try again
              </button>
            </div>
          )}
          <div className="te-generate-row">
            <span>
              <Icon name="sparkles" size={14} />A starting point, not a final
              answer.
            </span>
            <button
              type="submit"
              className="primary-button te-generate-button"
              disabled={loading}
            >
              {loading ? (
                <span className="te-spinner" />
              ) : (
                <Icon name="sparkles" size={16} />
              )}
              {loading
                ? "Exploring research directions…"
                : "Generate Research Ideas"}
              {!loading && <Icon name="arrow" size={15} />}
            </button>
          </div>
          <div className="te-disclosure">
            <Icon name="help" size={12} />
            Demo mode uses curated examples and templates, not live AI. No data
            is uploaded.
          </div>
        </form>
        <aside className="te-guidance">
          <div className="te-guide-card">
            <div className="te-guide-graphic" aria-hidden="true">
              <div className="te-guide-orbit" />
              <span className="te-guide-node one">
                <Icon name="compass" size={15} />
              </span>
              <span className="te-guide-node two">
                <Icon name="book" size={15} />
              </span>
              <span className="te-guide-center">
                <Icon name="sparkles" size={30} />
              </span>
              <span className="te-guide-node three">
                <Icon name="note" size={15} />
              </span>
              <span className="te-guide-dot" />
            </div>
            <span className="te-guide-eyebrow">A BETTER STARTING POINT</span>
            <h3>
              From “what if”
              <br />
              to “what’s next.”
            </h3>
            <p>
              You bring the curiosity. We help you give it a little structure.
            </p>
            <ol>
              <li>
                <span>1</span>
                <div>
                  <strong>Start with your interest</strong>
                  <p>
                    A subject, a challenge, or an idea you keep coming back to.
                  </p>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <strong>Find your angle</strong>
                  <p>
                    Explore questions, objectives, and a scope that feels
                    achievable.
                  </p>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <strong>Make it your own</strong>
                  <p>
                    Refine your draft and save promising directions to a
                    project.
                  </p>
                </div>
              </li>
            </ol>
          </div>
          <div className="te-tip-card">
            <span>
              <Icon name="note" size={18} />
            </span>
            <div>
              <h3>A researcher’s tip</h3>
              <p>
                Add a population, context, or challenge to your interest. A
                little detail goes a long way.
              </p>
              <blockquote>
                “Explainable AI for recognizing daily activities using wearable
                sensors.”
              </blockquote>
            </div>
          </div>
        </aside>
      </div>
      <section
        className="te-results-section"
        ref={resultsRef}
        aria-labelledby="te-results-heading"
        aria-busy={loading}
      >
        <div className="section-heading">
          <div>
            <h2 id="te-results-heading">
              Your research directions
              {drafts.length > 0 && !loading && (
                <span className="count-badge">{drafts.length}</span>
              )}
            </h2>
            <p>
              {drafts.length
                ? "Explore the possibilities. Refine what resonates."
                : "A little exploration can open up a whole new direction."}
            </p>
          </div>
          <span className="te-results-badge">
            <Icon name="sparkles" size={12} />
            DEMO CONTENT
          </span>
        </div>
        <div aria-live="polite" className="te-sr-only">
          {loading
            ? "Preparing simulated research ideas."
            : status === "success"
              ? `${drafts.length} demo research directions are ready.`
              : ""}
        </div>
        {loading ? (
          <div className="te-loading-state" role="status">
            <span className="te-loading-mark">
              <Icon name="sparkles" size={24} />
            </span>
            <h3>Giving your curiosity some direction…</h3>
            <p>
              Preparing a simulated academic draft. No live AI is being called.
            </p>
            <div className="te-loading-bars">
              <span />
              <span />
              <span />
            </div>
            <button
              className="text-button"
              onClick={() => {
                if (timer.current) clearTimeout(timer.current)
                timer.current = null
                setStatus(drafts.length ? "success" : "idle")
              }}
            >
              Cancel generation
            </button>
          </div>
        ) : drafts.length ? (
          <>
            <div className="te-results-context">
              <Icon name="compass" size={16} />
              <span>
                Exploring: <strong>{generatedInterest}</strong>
              </span>
            </div>
            <div className="te-results-notice">
              <Icon name="help" size={15} />
              <p>
                These are{" "}
                {drafts[0].source === "Curated academic example"
                  ? "curated examples for this broad subject area, not personalized AI findings"
                  : "rule-based templates using your research interest"}
                . Verify relevance and novelty through a literature review.
                Edited drafts and saved ideas last only for this session.
              </p>
            </div>
            <div className="te-results-list">
              {drafts.map((draft, i) => (
                <ResultCard
                  key={draft.id}
                  draft={draft}
                  index={i}
                  onChange={(updated) =>
                    setDrafts((previous) =>
                      previous.map((item) =>
                        item.id === updated.id ? updated : item,
                      ),
                    )
                  }
                  onSave={() => openSave(draft)}
                  savedCount={
                    Object.values(savedTopics).filter((items) =>
                      items.some((item) => item.id === draft.id),
                    ).length
                  }
                />
              ))}
            </div>
          </>
        ) : (
          <div className="te-empty-state">
            <div className="te-empty-art">
              <span className="te-empty-sheet">
                <Icon name="note" size={31} />
              </span>
              <span className="te-empty-spark">
                <Icon name="sparkles" size={17} />
              </span>
              <span className="te-empty-line one" />
              <span className="te-empty-line two" />
            </div>
            <h3>Your next research idea starts here.</h3>
            <p>
              Tell us what interests you and choose your outputs.
              <br />
              Your research directions will appear right here.
            </p>
            <button
              className="text-button"
              onClick={() => {
                useExample(0)
                inputRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                })
              }}
            >
              Start with an example
              <Icon name="arrow" size={14} />
            </button>
          </div>
        )}
      </section>
      <footer className="main-footer">
        <span>Made for curious minds. Built for meaningful research.</span>
        <span>
          <Icon name="sparkles" size={13} />
          From Research Ideas to Research Insights.
        </span>
      </footer>
      {saveDraft && (
        <Modal
          title="Give this idea a home."
          subtitle="Save your research direction, edits, and selected outputs to a project."
          onClose={closeSave}
        >
          <form
            className="project-form te-save-form"
            onSubmit={save}
            noValidate
          >
            <div className="te-save-preview">
              <Icon name="compass" size={20} />
              <div>
                <span>RESEARCH DIRECTION · DEMO</span>
                <strong>{saveDraft.title}</strong>
              </div>
            </div>
            <label>
              Save to project
              <select
                value={createNew ? "new" : projectId}
                onChange={(event) => {
                  setCreateNew(event.target.value === "new")
                  if (event.target.value !== "new")
                    setProjectId(event.target.value)
                  setSaveError("")
                }}
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
                <option value="new">+ Create a new project</option>
              </select>
            </label>
            {createNew && (
              <label>
                New project name
                <input
                  value={newProjectName}
                  onChange={(event) => {
                    setNewProjectName(event.target.value)
                    setSaveError("")
                  }}
                  maxLength={120}
                  placeholder="e.g. Explainable AI for wearable systems"
                  required
                />
              </label>
            )}
            {saveError && (
              <p className="te-error-inline" role="alert">
                {saveError}
              </p>
            )}
            <div className="form-note">
              <Icon name="help" size={15} />
              Saved in this demo session only. Refreshing clears your workspace.
            </div>
            <button className="primary-button form-submit" type="submit">
              <Icon name="folder" size={16} />
              {createNew
                ? "Create Project & Save Idea"
                : selectedProjectHasDraft
                  ? "Update Saved Idea"
                  : "Save Research Idea"}
            </button>
          </form>
        </Modal>
      )}
      {showReplace && (
        <Modal
          title="Explore a fresh direction?"
          subtitle="New demo results will replace the drafts currently on this page. Any unsaved edits will be lost; saved project ideas will stay for this session."
          onClose={closeReplace}
        >
          <div className="te-confirm-buttons">
            <button className="te-secondary-button" onClick={closeReplace}>
              Keep my drafts
            </button>
            <button className="primary-button" onClick={beginGeneration}>
              Generate New Ideas
              <Icon name="arrow" size={15} />
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}
