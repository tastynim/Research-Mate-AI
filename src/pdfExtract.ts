import { getDocument, GlobalWorkerOptions } from "pdfjs-dist"
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url"

const MAX_STORE_CHARS = 220_000

let workerReady = false

function ensureWorker() {
  if (workerReady) return
  GlobalWorkerOptions.workerSrc = workerUrl
  workerReady = true
}

export type ExtractedPdf = {
  pages: number
  text: string
  preview: string
  wordCount: number
  charCount: number
  truncated: boolean
}

export async function extractPdfText(file: File): Promise<ExtractedPdf> {
  ensureWorker()
  const data = await file.arrayBuffer()
  const pdf = await getDocument({ data }).promise
  const pageTexts: string[] = []
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()
    const line = content.items
      .map((item) => ("str" in item ? String(item.str) : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim()
    pageTexts.push(`--- page ${pageNumber} ---\n${line}`)
  }
  const full = pageTexts.join("\n\n")
  const truncated = full.length > MAX_STORE_CHARS
  const text = truncated ? full.slice(0, MAX_STORE_CHARS) : full
  const readable = text.replace(/--- page \d+ ---/g, " ").replace(/\s+/g, " ").trim()
  return {
    pages: pdf.numPages,
    text,
    preview: readable.slice(0, 1200),
    wordCount: readable ? readable.split(/\s+/).length : 0,
    charCount: readable.length,
    truncated,
  }
}
