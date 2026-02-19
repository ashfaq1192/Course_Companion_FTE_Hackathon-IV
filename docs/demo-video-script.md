# Demo Video Script — Course Companion FTE
## Hackathon IV Submission | Target: 5 minutes

---

## PRE-RECORDING SETUP

Before hitting record:
- Browser open to ChatGPT with Course Companion FTE GPT loaded
- Custom GPT conversation cleared (fresh session)
- Zoom level: 125% so text is readable
- Mic check done
- Close all notifications (Do Not Disturb on)

---

## [0:00 – 0:30] INTRO — What We Built

**Screen:** Custom GPT landing page / intro slide

**Say:**
> "This is Course Companion FTE — a full AI-powered educational platform built for Hackathon IV. The core idea: the backend does zero LLM calls. It's completely deterministic — fast, cheap, and scalable. ChatGPT is the intelligence layer. The backend is the data layer. Let me show you what that looks like in practice."

**Talking points to hit:**
- "Zero-Backend-LLM" architecture
- Backend on Railway (FastAPI + PostgreSQL + Cloudflare R2)
- Custom GPT as the student-facing UI

---

## [0:30 – 1:00] FEATURE 1 — Content Delivery

**Screen:** Type in Custom GPT

**Type:**
> "What courses do you have?"

**Wait for response** (GPT calls API, lists 5 chapters of Generative AI Fundamentals)

**Say:**
> "The GPT just made a live API call to our Railway backend. No LLM touched that data — it came straight from PostgreSQL. Now let's go deeper."

**Type:**
> "Teach me about Large Language Models."

**While response streams, say:**
> "The backend retrieves the raw chapter content from Cloudflare R2 storage verbatim. The GPT then explains it at the student's level — that's the architecture in action. Backend: dumb and fast. GPT: smart and engaging."

---

## [1:00 – 1:30] FEATURE 2 — Navigation

**Screen:** Continue in same GPT conversation

**Type:**
> "What's the next chapter after this one?"

**Wait for response**

**Say:**
> "Navigation is fully deterministic — the backend calculates next and previous content by chapter and section number. No AI involved, no hallucination possible. The GPT presents it naturally."

---

## [1:30 – 2:00] FEATURE 3 — Grounded Q&A

**Screen:** Continue in same GPT conversation

**Type:**
> "What is the difference between RAG and fine-tuning?"

**Wait for response**

**Say:**
> "This is grounded Q&A. The backend's search endpoint finds the most relevant content sections by keyword matching, then returns them to the GPT. The GPT answers using only that content — it cannot hallucinate because it's grounded in what we gave it. No vector DB, no embeddings — pure rule-based retrieval. Zero LLM cost on the backend."

---

## [2:00 – 2:40] FEATURE 4 — Rule-Based Quizzes

**Screen:** Continue in same GPT conversation

**Type:**
> "Quiz me on Chapter 2 — Prompt Engineering."

**Wait for GPT to start the quiz and show a question**

**Answer the question** (pick an answer, type it)

**Wait for result**

**Say:**
> "The quiz engine is entirely rule-based. The backend grades answers against a stored answer key — no LLM, no ambiguity, deterministic results every time. The GPT presents the questions, encourages the student, and explains why answers are right or wrong. Classic separation of concerns."

---

## [2:40 – 3:00] FEATURES 5 & 6 — Progress Tracking + Freemium Gate

**Screen:** Continue in same GPT conversation

**Type:**
> "What's my progress on the course so far?"

**Wait for response**

**Say:**
> "Progress is tracked in PostgreSQL — completion percentage, time spent, streak data. The backend stores it, the GPT celebrates it."

**Type:**
> "What premium features do I have access to?"

**Wait for response**

**Say:**
> "The freemium gate is enforced server-side. Free users see a helpful explanation of what premium unlocks. Premium users get two AI-powered features — let me show you."

---

## [3:00 – 3:45] PHASE 2 — Hybrid Intelligence (Premium)

**Screen:** Continue in same GPT conversation

**Type:**
> "I'm a visual learner and want a moderate pace. Can you build me a personalised study plan?"

**Wait for response** (GPT calls /hybrid/adaptive-path, LLM generates the plan)

**Say:**
> "This is Phase 2 — Hybrid Intelligence. This call hits the `/hybrid/adaptive-path` endpoint, which makes an actual GPT-4o-mini call server-side to analyse the student's learning style and generate a personalised path. This is the only endpoint in Phase 1 that uses an LLM — and it's explicitly gated to premium users only."

**Type:**
> "Let me write a detailed answer about what RAG is and grade it. RAG, or Retrieval-Augmented Generation, is a technique that connects LLMs to external knowledge bases to reduce hallucinations and keep answers grounded in real data."

**While response streams, say:**
> "LLM-graded assessment — the second premium hybrid feature. Free-form written answers evaluated by an LLM with detailed feedback. Rule-based grading can't do this. That's exactly why it's a premium, user-initiated feature."

---

## [3:45 – 4:15] PHASE 3 — Web App (Optional: show frontend)

**Screen:** Switch to browser with frontend running (localhost:3000 or deployed URL)

**Say:**
> "The same backend powers a full Next.js web application — Phase 3. Dashboard with progress visualisation, course catalog, quiz interface, and admin tools. All connected to the same API, same auth, same data."

*(Quickly scroll through: dashboard, course list, quiz page — 20 seconds max)*

---

## [4:15 – 4:45] ARCHITECTURE SUMMARY

**Screen:** Switch to `docs/architecture-diagram.html` in browser (or a simple slide)

**Say:**
> "Let me close with the architecture. The backend is a zero-LLM FastAPI service — every response is deterministic, sub-200ms, scales to thousands of users with zero per-request AI cost. ChatGPT sits on top as the intelligent tutor — it explains, motivates, guides. The two hybrid premium features are the only LLM calls in the system, and they're user-initiated and cost-tracked. This is how you build AI products responsibly: minimise LLM surface area, maximise deterministic reliability, and use AI exactly where it earns its cost."

---

## [4:45 – 5:00] CLOSE

**Screen:** Custom GPT conversation

**Say:**
> "Course Companion FTE — Zero-Backend-LLM Phase 1, Hybrid Intelligence Phase 2, full web app Phase 3. Built for Hackathon IV. Thanks for watching."

---

## RECORDING TIPS

- **Pace:** Speak slower than feels natural — viewers need time to read the screen
- **Pauses:** Pause for 1-2 seconds after each GPT response loads before speaking
- **Mistakes:** If GPT gives an unexpected response, narrate through it ("interesting, the GPT is exploring a different angle here — let me redirect it")
- **Editing:** Record in sections if needed; cut between Feature 5 and Phase 2 is the cleanest edit point
- **Resolution:** Record at 1920×1080, export at 1080p

## KEY PHRASES TO HIT FOR JUDGES

- "Zero LLM calls on the backend" (Phase 1 compliance)
- "Deterministic, rule-based" (quiz grading, navigation)
- "Premium-gated, user-initiated" (hybrid features)
- "Cost-tracked" (Phase 2 compliance)
- "Separation of concerns — backend is data, GPT is intelligence"
