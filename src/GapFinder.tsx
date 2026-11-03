import { useState } from "react"
import { Icon } from "./ui"
import type { PaperDoc } from "./workspace"
import { topTerms } from "./workspace"
import "./tools.css"
import "./topic-explorer.css"

type Props = {
  papers: PaperDoc[]
}

type Comparison = {
  ids: string[]
  shared: string[]
  unique: Record<string, string[]>
}

export default function GapFinder({ papers }: Props) {
  const [selected, setSelected] = useState<string[]>([])
  const [comparison, setComparison] = useState<Comparison | null>(null)
  const [error, setError] = useState("")

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
    setError("")
  }

  function compare() {
    if (selected.length < 2) {
      setError("Select at least two uploaded papers to compare.")
      return
    }
    const chosen = papers.filter((paper) => selected.includes(paper.id))
    const termSets = chosen.map((paper) => ({
      id: paper.id,
      terms: new Set(topTerms(paper.text, 20).map((item) => item.term)),
    }))
    const shared = [...termSets[0].terms].filter((term) =>
      termSets.every((set) => set.terms.has(term)),
    )
    const unique: Record<string, string[]> = {}
    for (const set of termSets) {
      unique[set.id] = [...set.terms].filter((term) =>
        termSets.every((other) => other.id === set.id || !other.terms.has(term)),
      )
    }
    setComparison({ ids: chosen.map((paper) => paper.id), shared, unique })
  }

  const compared = comparison
    ? papers.filter((paper) => comparison.ids.includes(paper.id))
    : []

  return (
    <div className="tool-page">
      <div className="page-heading te-page-heading">
        <div>
          <div className="te-breadcrumb">
            <span>AI research toolkit</span>
            <Icon name="chevron" size={10} />
            <span>Research Gap Finder</span>
          </div>
          <h1>Research Gap Finder</h1>
          <p>
            Select papers and compare extracted vocabulary. This is a document
            comparison, not an AI literature-gap analysis.
          </p>
        </div>
        <span className="te-demo-label">
          <span />
          DEMONSTRATION RESULTS
        </span>
      </div>
      <div className="te-intro-strip">
        <span className="te-intro-icon">
          <Icon name="gap" size={21} />
        </span>
        <div>
          <strong>Compare what the PDFs actually say.</strong>
          <p>
            Shared and unique terms come from extracted text frequencies. They
            are labelled demonstration results, not claimed research gaps.
          </p>
        </div>
      </div>
      <div className="tool-card-panel" style={{ marginBottom: 22 }}>
        <div className="te-card-heading">
          <span className="te-step-number">01</span>
          <div>
            <h2>Select papers to compare</h2>
            <p>Choose two or more uploads from your library.</p>
          </div>
        </div>
        {papers.length === 0 ? (
          <div className="empty-state">
            <Icon name="book" size={26} />
            <h3>No papers to compare yet</h3>
            <p>Upload PDFs in Literature Review, then return here.</p>
          </div>
        ) : (
          <div className="te-output-grid">
            {papers.map((paper) => (
              <label
                key={paper.id}
                className={`te-output-option ${selected.includes(paper.id) ? "is-checked" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(paper.id)}
                  onChange={() => toggle(paper.id)}
                />
                <span className="te-checkbox">
                  <Icon name="check" size={11} />
                </span>
                <span>
                  {paper.name}
                  <small>
                    {paper.pages} pages · {paper.wordCount.toLocaleString()} words
                  </small>
                </span>
              </label>
            ))}
          </div>
        )}
        {error && (
          <div className="te-form-error" role="alert">
            <Icon name="help" size={17} />
            <span>{error}</span>
          </div>
        )}
        <div className="te-generate-row">
          <span>
            <Icon name="sparkles" size={14} />
            Demonstration comparison uses word counts from extracted text.
          </span>
          <button type="button" className="primary-button" onClick={compare}>
            Compare selected papers
            <Icon name="arrow" size={15} />
          </button>
        </div>
      </div>
      {comparison && (
        <section className="tool-card-panel">
          <div className="te-card-heading">
            <span className="te-demo-label">
              <span />
              DEMONSTRATION RESULTS
            </span>
            <div>
              <h2>Lexical overlap from extracted text</h2>
              <p>
                These lists are frequent terms, not verified research gaps or
                citations.
              </p>
            </div>
          </div>
          <div className="gap-compare">
            {compared.map((paper) => (
              <div className="tool-meta" key={paper.id}>
                <span>{paper.name}</span>
                <strong>{paper.wordCount.toLocaleString()} words</strong>
                <p className="form-note" style={{ marginTop: 8 }}>
                  Unique frequent terms
                </p>
                <div className="gap-terms unique">
                  {(comparison.unique[paper.id] || []).slice(0, 8).map((term) => (
                    <span key={term}>{term}</span>
                  ))}
                  {!comparison.unique[paper.id]?.length && <span>None detected</span>}
                </div>
              </div>
            ))}
          </div>
          <h3 style={{ fontSize: 13, marginBottom: 10 }}>Shared frequent terms</h3>
          <div className="gap-terms">
            {comparison.shared.length ? (
              comparison.shared.map((term) => <span key={term}>{term}</span>)
            ) : (
              <span>No shared frequent terms in the extracted text samples.</span>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
