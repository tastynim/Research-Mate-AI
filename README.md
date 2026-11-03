<div align="center">
  <img src="public/favicon.svg" alt="ResearchMate AI logo" width="84" />

  # ResearchMate AI

  **From Research Ideas to Research Insights.**

  *A focused workspace for the messy beginning of research.*

  [![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
  ![Status](https://img.shields.io/badge/Status-Interactive%20MVP-8B5CF6)
  ![AI mode](https://img.shields.io/badge/AI-Demo%20Mode-F59E0B)

  **[Explore features](#inside-the-workspace) · [Run locally](#run-it-locally) · [Current status](#what-works-today) · [Roadmap](#whats-next)**
</div>

---

## Why ResearchMate?

A research idea can start in one sentence. Turning that sentence into a focused question, a literature review, and an organized set of notes takes more work.

**ResearchMate AI** brings those early steps into a single academic workspace. It is designed for students and emerging researchers who want a clearer way to explore a topic, review papers, compare evidence, and keep their work together.

> **Guiding principle:** Assist the researcher. Never pretend an AI suggestion is verified evidence.

## Inside the workspace

| Area | What it's designed to help you do |
|:--|:--|
| **Dashboard** | See projects, saved papers, notes, and recent activity in one place. |
| **Topic Explorer** | Turn a broad interest into editable topic ideas, research questions, objectives, keywords, and scope. |
| **Literature Review Assistant** | Work with research PDFs and organize details such as methods, findings, and limitations. |
| **Research Gap Finder** | Compare papers and explore *possible* unanswered questions, without claiming proven novelty. |
| **Chat with Papers** | Ask document-focused questions; a future grounded-AI integration will supply source-backed answers. |
| **My Research Workspace** | Organize research projects, notes, documents, and selected outputs. |

The interface uses a calm violet-and-white visual style, responsive layouts, and straightforward navigation.

## What works today

ResearchMate is an **interactive MVP**, not a finished AI research platform.

| Capability | Current state |
|:--|:--|
| Application dashboard and navigation | Available |
| Topic Explorer | Interactive **demo** using sample/template-based results; not live model inference |
| Research workspace | Browser-based project and note workflows; storage is local to the browser where enabled |
| PDF tools and paper-oriented screens | Under active development; test extraction and document handling with your own PDFs |
| Research-gap and paper-chat experiences | UI/workflows in progress; no verified AI-grounded responses yet |
| Production build | Successfully built with Vite |
| Qwen on Cerebras | **Not connected** — API access has not been activated |
| Public hosting | Not offered; the Netlify deployment has been configured for private access |

**Please don't treat demo outputs as real literature findings or cite them in academic work.** Always check original papers, metadata, and page references.

## Run it locally

### Requirements

- Node.js and npm installed
- Git (or download the repository as a ZIP)

```bash
# Clone the repository
git clone https://github.com/tasnyim/Research-Mate-AI.git
cd Research-Mate-AI

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open the local URL printed in your terminal.

To check a production build:

```bash
npm run build
npm run preview
```

Vite creates the production files in `dist/`. That folder is generated output and does not need to be committed.

## Technology and build process

| Part | Technology / workflow |
|:--|:--|
| UI design | **Figma Make** — initial interface and visual direction |
| Frontend | **React**, **TypeScript**, **Vite**, and CSS |
| Development assistance | **Cursor with Grok** — continued development and fixes |
| Local data | Browser storage for demo-scale research workflows |
| PDF handling | Client-side PDF extraction work in the current development build |
| Code hosting | **GitHub** |
| Website deployment | **Netlify** (currently private) |
| Planned AI service | **Qwen via Cerebras**, behind a server-side endpoint |

The project started as a Figma Make prototype and was continued as a local React application. The current README lists tools actually used and distinguishes them from planned integrations.

## Research integrity by design

ResearchMate is built around a few simple rules:

1. **Show your sources.** A paper-specific claim should be traceable to the original document.
2. **Admit uncertainty.** If the evidence is missing, say so.
3. **Treat research gaps as hypotheses.** A suggested gap is not proof that nobody has studied it.
4. **Separate demo content from live results.** Example data should never look like verified research.
5. **Keep secrets off the client.** API keys belong in server-side environment variables, not frontend code or Git history.

## What's next

- [ ] Connect a secure server-side Qwen/Cerebras endpoint when API access becomes available.
- [ ] Ground paper summaries and answers in extracted passages with page references.
- [ ] Improve PDF handling, including difficult layouts and scanned documents.
- [ ] Add reliable cross-device storage and optional user accounts.
- [ ] Test every workflow across desktop and mobile before a broader release.

## Project background

ResearchMate AI was developed as an original academic-workspace project during the **OctoberFest 2026** build activities. The [MentorMatch example repository](https://github.com/mitul3737/mentor-match) helped explain the event's multi-tool workflow; ResearchMate is a separate product with a different purpose and interface.

## Feedback and licensing

Feedback, reproducible bug reports, and suggestions are welcome through this repository's Issues tab when available.

**License:** No license has been selected in this repository yet. Please do not assume that a public repository automatically grants permission to reuse its code.

---

<div align="center">
  <strong>ResearchMate AI</strong><br />
  <sub>Research starts with curiosity. Progress starts with a clear next step.</sub>
</div>
