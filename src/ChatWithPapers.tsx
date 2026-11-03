import { useState } from "react"
import type { FormEvent } from "react"
import { Icon } from "./ui"
import type { ChatMessage, PaperDoc } from "./workspace"
import { findPassages, isAiConfigured } from "./workspace"
import "./tools.css"
import "./topic-explorer.css"

type Props = {
  papers: PaperDoc[]
  chats: ChatMessage[]
  onAsk: (messages: ChatMessage[]) => void
}

export default function ChatWithPapers({ papers, chats, onAsk }: Props) {
  const [paperId, setPaperId] = useState(papers[0]?.id ?? "")
  const [question, setQuestion] = useState("")
  const selected = papers.find((paper) => paper.id === paperId) || null
  const thread = chats.filter((message) => message.paperId === paperId)
  const aiAvailable = isAiConfigured()

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!selected || !question.trim()) return
    const asked = question.trim()
    const userMessage: ChatMessage = {
      id: `q-${Date.now()}`,
      paperId: selected.id,
      role: "user",
      text: asked,
      aiAvailable,
      createdAt: Date.now(),
    }
    const excerpts = findPassages(selected.text, asked)
    const assistant: ChatMessage = {
      id: `a-${Date.now()}`,
      paperId: selected.id,
      role: "assistant",
      aiAvailable,
      createdAt: Date.now() + 1,
      excerpts,
      text: aiAvailable
        ? "An AI API key is present, but this preview does not send paper text to an external model yet."
        : "AI answers are unavailable. No AI service is connected, so ResearchMate will not invent a reply.",
    }
    onAsk([userMessage, assistant])
    setQuestion("")
  }

  return (
    <div className="tool-page">
      <div className="page-heading te-page-heading">
        <div>
          <div className="te-breadcrumb">
            <span>AI research toolkit</span>
            <Icon name="chevron" size={10} />
            <span>Chat with Papers</span>
          </div>
          <h1>Chat with Research Papers</h1>
          <p>
            Ask a question about an uploaded PDF. Answers from an AI model are
            shown only when a real service is connected.
          </p>
        </div>
      </div>
      <div className="tool-unavailable" role="status">
        <Icon name="sparkles" size={18} />
        <span>
          {aiAvailable
            ? "An API key is configured, but this MVP does not call a model yet. No generated paper answers are shown as if they were real."
            : "AI answers are unavailable. Add a VITE_AI_API_KEY and a real model integration later — this screen will not fabricate citations or replies."}
        </span>
      </div>
      <div className="tool-layout" style={{ marginTop: 18 }}>
        <section className="tool-card-panel">
          {!selected ? (
            <div className="empty-state">
              <Icon name="chat" size={26} />
              <h3>Upload a paper first</h3>
              <p>Chat needs extracted text from the Literature Review tool.</p>
            </div>
          ) : (
            <>
              <div className="te-card-heading">
                <span className="te-step-number">02</span>
                <div>
                  <h2>{selected.name}</h2>
                  <p>
                    {selected.pages} pages · {selected.wordCount.toLocaleString()}{" "}
                    extracted words
                  </p>
                </div>
              </div>
              <div className="chat-log">
                {thread.length === 0 && (
                  <p className="te-result-explanation">
                    Ask about methods, definitions, or a phrase you expect in
                    this file. Matching passages are searched locally.
                  </p>
                )}
                {thread.map((message) => (
                  <div key={message.id} className={`chat-bubble ${message.role}`}>
                    <p>{message.text}</p>
                    {message.role === "assistant" && message.excerpts?.length ? (
                      <div className="chat-excerpt">
                        <strong>Passages found in the PDF</strong>
                        {message.excerpts.map((excerpt, index) => (
                          <p key={index}>
                            p.{excerpt.page}: {excerpt.quote}
                          </p>
                        ))}
                      </div>
                    ) : null}
                    {message.role === "assistant" &&
                      !message.aiAvailable &&
                      !message.excerpts?.length && (
                        <div className="chat-excerpt">
                          <p>No matching extractable passage was found for those words.</p>
                        </div>
                      )}
                  </div>
                ))}
              </div>
              <form className="chat-form" onSubmit={submit}>
                <textarea
                  value={question}
                  maxLength={500}
                  placeholder="Ask a question grounded in this paper…"
                  onChange={(event) => setQuestion(event.target.value)}
                />
                <button className="primary-button" type="submit" disabled={!question.trim()}>
                  Ask
                  <Icon name="arrow" size={15} />
                </button>
              </form>
            </>
          )}
        </section>
        <aside>
          <div className="te-guide-card">
            <span className="te-guide-eyebrow">SELECT A PAPER</span>
            <div className="tool-list" style={{ marginTop: 14 }}>
              {papers.map((paper) => (
                <button
                  type="button"
                  key={paper.id}
                  className={`tool-select-item ${paper.id === paperId ? "is-active" : ""}`}
                  onClick={() => setPaperId(paper.id)}
                >
                  <Icon name="file" size={16} />
                  <span>
                    <strong>{paper.name}</strong>
                    <small>{paper.wordCount.toLocaleString()} words</small>
                  </span>
                </button>
              ))}
              {papers.length === 0 && <p>No papers uploaded yet.</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
