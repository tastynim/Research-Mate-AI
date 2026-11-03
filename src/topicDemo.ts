export const outputOptions = [
  {
    key: "topics",
    label: "Research Topic Ideas",
    description: "Three focused directions",
    icon: "compass",
  },
  {
    key: "questions",
    label: "Research Questions",
    description: "Questions worth asking",
    icon: "chat",
  },
  {
    key: "objectives",
    label: "Research Objectives",
    description: "A clear plan of inquiry",
    icon: "check",
  },
  {
    key: "keywords",
    label: "Research Keywords",
    description: "A starting point for literature",
    icon: "search",
  },
  {
    key: "scope",
    label: "Research Scope",
    description: "Boundaries that keep it feasible",
    icon: "gap",
  },
] as const

export type OutputKey = typeof outputOptions[number]["key"]
export type ResearchLevel = "" | "Undergraduate" | "Master's" | "PhD"
export type TopicDraft = {
  id: string
  title: string
  explanation: string
  rationale: string
  question: string
  objectives: string
  keywords: string
  scope: string
  outputs: OutputKey[]
  interest: string
  discipline: string
  level: ResearchLevel
  source: string
}
type TopicContent = Pick<TopicDraft, "title" | "explanation" | "rationale" | "question" | "objectives" | "keywords">

const activityTopics: TopicContent[] = [
  {
    title:
      "Evaluating the Reliability of SHAP Explanations in Wearable Human Activity Recognition",
    explanation:
      "Compare feature-attribution explanations for sensor-based activity classifiers, focusing on how consistently they identify relevant movement signals.",
    rationale:
      "A convincing explanation is not necessarily a reliable one. Testing attribution stability can help establish when wearable activity predictions deserve trust.",
    question:
      "How stable are SHAP feature attributions across sensor noise levels and activity classes in a wearable human activity recognition model?",
    objectives:
      "Train a baseline activity classifier on a public wearable-sensor dataset.\nMeasure attribution stability under controlled sensor perturbations.\nCompare explanation fidelity across common activity classes.",
    keywords:
      "Explainable AI, Human activity recognition, SHAP, Wearable sensors, Explanation stability",
  },
  {
    title:
      "Interpretable Activity Recognition: Comparing Transparent Models with Post-hoc Explanations",
    explanation:
      "Investigate the balance between classification performance and interpretability by comparing decision trees with a neural model explained using feature attribution.",
    rationale:
      "More complex models may offer better predictions, but their explanations can be harder to validate. A controlled comparison can make this trade-off explicit.",
    question:
      "What accuracy–interpretability trade-offs emerge when transparent models and post-hoc explanation methods are applied to the same activity recognition dataset?",
    objectives:
      "Implement a transparent baseline and a neural activity classifier.\nEvaluate predictive performance with participant-aware data splits.\nCompare model complexity, explanation fidelity, and computational cost.",
    keywords:
      "Interpretable machine learning, Decision trees, Post-hoc explanation, Activity classification, Model comparison",
  },
  {
    title:
      "Designing Human-Centered Explanations for Everyday Activity Predictions",
    explanation:
      "Explore whether concise, sensor-grounded explanations help people understand the predictions and limitations of an activity recognition system.",
    rationale:
      "Technical feature importance does not automatically translate into user understanding. Evaluating explanation formats can support more responsible use of wearable AI.",
    question:
      "How do visual feature attributions and plain-language explanations affect users’ understanding of correct and incorrect activity predictions?",
    objectives:
      "Develop two explanation formats for a fixed set of activity predictions.\nDesign an ethically reviewed user study with comprehension tasks.\nCompare understanding, calibrated trust, and perceived usefulness.",
    keywords:
      "Human-centered AI, Explainability, User evaluation, Calibrated trust, Wearable computing",
  },
]

const educationTopics: TopicContent[] = [
  {
    title: "AI-Assisted Study Tools and Undergraduate Self-Regulated Learning",
    explanation:
      "Examine how students use AI-generated study support to plan, monitor, and reflect on their learning.",
    rationale:
      "Convenient AI assistance may support study habits or encourage over-reliance. Looking at specific learning behaviors can help distinguish these possibilities.",
    question:
      "How is the use of AI-assisted study tools associated with self-regulated learning strategies among undergraduate students?",
    objectives:
      "Define study-tool use and self-regulation measures using established literature.\nCollect a bounded survey sample with appropriate consent.\nExamine associations while accounting for study habits and prior attainment.",
    keywords:
      "AI in education, Self-regulated learning, Higher education, Study strategies, Student agency",
  },
  {
    title: "Comparing AI-Generated and Instructor-Written Formative Feedback",
    explanation:
      "Compare the specificity, actionability, and perceived usefulness of feedback on a defined academic writing task.",
    rationale:
      "Feedback quality depends on more than speed. A structured comparison can identify where AI feedback is helpful and where instructor judgment remains important.",
    question:
      "How do AI-generated and instructor-written comments differ in actionability and student-perceived usefulness for an academic writing task?",
    objectives:
      "Develop a feedback-quality rubric grounded in prior research.\nEvaluate a small, consented set of feedback examples.\nCompare rubric ratings and learner perceptions across feedback sources.",
    keywords:
      "Formative feedback, Generative AI, Academic writing, Feedback literacy, Higher education",
  },
  {
    title: "AI Literacy and Students’ Evaluation of Academic Information",
    explanation:
      "Explore how students identify unsupported claims and verify AI-generated academic content.",
    rationale:
      "Access to AI does not guarantee the ability to assess its output. Studying verification practices can inform practical AI-literacy teaching.",
    question:
      "What relationship exists between students’ AI literacy and their ability to identify unsupported claims in AI-generated academic summaries?",
    objectives:
      "Operationalize AI literacy and source-verification skills.\nDesign a task with verified and unsupported example claims.\nAnalyze verification accuracy and describe common reasoning strategies.",
    keywords:
      "AI literacy, Information evaluation, Academic integrity, Source verification, Critical thinking",
  },
]

const sustainabilityTopics: TopicContent[] = [
  {
    title:
      "Explaining Household Energy Demand with Interpretable Predictive Models",
    explanation:
      "Use an open energy dataset to examine which measured factors are associated with residential energy use.",
    rationale:
      "Understanding a model’s predictions can help separate plausible demand patterns from artifacts in the data, without implying causal effects.",
    question:
      "Which measured factors contribute most consistently to household energy demand predictions across seasonal conditions?",
    objectives:
      "Select an appropriately licensed public energy dataset.\nCompare baseline and interpretable prediction models.\nEvaluate feature contribution stability across seasonal subsets.",
    keywords:
      "Energy demand, Sustainability, Interpretable models, Seasonal patterns, Open data",
  },
  {
    title: "Barriers to Low-Carbon Travel Among University Students",
    explanation:
      "Investigate practical and perceived barriers to walking, cycling, and public transport in a single university setting.",
    rationale:
      "Travel choices are shaped by access, time, and perceived safety. A bounded study can identify locally relevant barriers rather than assuming motivation is the only factor.",
    question:
      "How do travel time, perceived safety, and transport availability relate to students’ choices of low-carbon travel modes?",
    objectives:
      "Review existing measures of sustainable travel barriers.\nSurvey a bounded university sample with informed consent.\nCompare reported barriers across commuting modes.",
    keywords:
      "Sustainable mobility, Student travel, Low-carbon transport, Survey research, Accessibility",
  },
  {
    title: "Assessing the Transparency of University Sustainability Reporting",
    explanation:
      "Compare how a small group of universities defines, reports, and supports claims about environmental performance.",
    rationale:
      "Sustainability reports can use different boundaries and indicators. A consistent assessment framework can reveal where comparability is limited.",
    question:
      "How consistently do selected universities disclose reporting boundaries, baseline years, and evidence for environmental performance claims?",
    objectives:
      "Define a transparent document-analysis rubric.\nCode a small set of public sustainability reports.\nCompare disclosure practices and identify limitations in comparability.",
    keywords:
      "Sustainability reporting, Higher education, Transparency, Document analysis, Environmental indicators",
  },
]

export function validateResearchInput(
  interest: string,
  outputs: OutputKey[],
): string {
  if (interest.trim().length < 15)
    return "Add a little more detail: describe your research interest in at least 15 characters."
  if (interest.trim().length > 600)
    return "Keep your research interest to 600 characters or fewer."
  if (outputs.length === 0)
    return "Choose at least one research output to continue."
  return ""
}

export function generateDemoTopics(
  interest: string,
  discipline: string,
  level: ResearchLevel,
  outputs: OutputKey[],
  runId: string,
): TopicDraft[] {
  const error = validateResearchInput(interest, outputs)
  if (error) throw new Error(error)
  const lower = interest.toLowerCase()
  const isActivity = /human activity|activity recognition|wearable|sensor/.test(
    lower,
  )
  const isEducation =
    /educat|student|learning|teaching|university|feedback/.test(lower)
  const isSustainability = /sustainab|climate|energy|carbon|environment/.test(
    lower,
  )
  const content = isActivity
    ? activityTopics
    : isEducation
      ? educationTopics
      : isSustainability
        ? sustainabilityTopics
        : null
  const subject = interest.trim().replace(/[.!?]+$/, "")
  const templates: TopicContent[] = [
    {
      title: `Mapping the Evidence on ${subject}`,
      explanation: `Develop a structured map of the methods, settings, and measures used to study ${subject}.`,
      rationale:
        "A bounded evidence map can establish what has been studied and where findings are not yet directly comparable. Any potential gap must be checked against the literature.",
      question: `What methods, contexts, and outcome measures are represented in recent research on ${subject}?`,
      objectives:
        "Define inclusion criteria and a reproducible search strategy.\nExtract methods, study contexts, and reported outcomes.\nCompare patterns and document evidence limitations.",
      keywords: `${subject}, Evidence mapping, Literature review, ${discipline || "Interdisciplinary research"}, Research methods`,
    },
    {
      title: `Comparing Research Approaches to ${subject}`,
      explanation:
        "Build a focused comparison of two established approaches using shared criteria drawn from relevant literature.",
      rationale:
        "Differences in study design can make apparently similar findings difficult to compare. Explicit comparison criteria can clarify the strengths and limitations of each approach.",
      question: `How do two established approaches to ${subject} compare in their assumptions, evidence requirements, and limitations?`,
      objectives:
        "Identify two relevant approaches through a preliminary literature review.\nDevelop explicit and justified comparison criteria.\nAssess the approaches and report the limits of the comparison.",
      keywords: `${subject}, Comparative analysis, Methodology, Evaluation framework, ${discipline || "Research design"}`,
    },
    {
      title: `Understanding Stakeholder Perspectives on ${subject}`,
      explanation:
        "Explore how a clearly defined stakeholder group experiences and evaluates this research area in one bounded setting.",
      rationale:
        "Stakeholder perspectives can reveal contextual constraints that technical or theoretical studies may overlook. Sampling and ethics need to be established before collecting data.",
      question: `How does a defined stakeholder group describe the opportunities and challenges associated with ${subject}?`,
      objectives:
        "Define the stakeholder group and a bounded study setting.\nDevelop an ethically reviewed interview or survey protocol.\nAnalyze recurring themes and discuss transferability.",
      keywords: `${subject}, Stakeholder perspectives, Qualitative research, Contextual inquiry, Research ethics`,
    },
  ]
  const scope =
    level === "Undergraduate"
      ? "An undergraduate-scale pilot: one public dataset, one institution, or a small document set. Prioritize a reproducible baseline and a clearly bounded question."
      : level === "Master's"
        ? "A master's-scale study: a justified comparison in one domain, with explicit evaluation criteria, appropriate validation, and a transparent discussion of limitations."
        : level === "PhD"
          ? "A potential doctoral direction: first establish novelty through a systematic literature review, then plan a multi-stage investigation with robust validation. This draft does not establish a research gap."
          : "Start with one setting or dataset, a defined population, and a feasible evaluation method. Agree on the boundaries with your supervisor."
  const selected = outputs.includes("topics")
    ? content || templates
    : (content || templates).slice(0, 1)
  return selected.map((topic, i) => ({
    ...topic,
    id: `${runId}-${i}`,
    outputs: [...outputs],
    interest: interest.trim(),
    discipline,
    level,
    scope: `${scope}${
      discipline ? ` Frame the work within ${discipline}.` : ""
    }`,
    source: content ? "Curated academic example" : "Template-based draft",
  }))
}
