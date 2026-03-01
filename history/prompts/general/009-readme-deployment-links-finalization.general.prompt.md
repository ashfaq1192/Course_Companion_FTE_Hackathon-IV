---
id: "009"
title: "README Deployment Links Finalization"
stage: general
date: 2026-03-02
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: ashfaq1192
command: "Update README.md with deployment links and hackathon finalization status"
labels: ["readme", "deployment", "vercel", "finalization", "hackathon-iv"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - README.md
tests: []
---

## Prompt

so our frontend is deployed on vercel; https://frontend-web-six-theta.vercel.app/ do you update the Readme.md accordingly and added the deployment link with finalization status of hackathon-iv?

## Response

Updated `/mnt/d/projects/hackathon-iv/README.md` with the following changes:

1. **Status changed** from "COMPLETED" to "FINALIZED"
2. **Added `## 🌐 Live Deployments` section** immediately after the status banner, containing:
   - Frontend: https://frontend-web-six-theta.vercel.app (Vercel)
   - Backend API: https://ashfaq1192-course-companion-fte-api.hf.space (HF Spaces)
   - API Docs: https://ashfaq1192-course-companion-fte-api.hf.space/docs
   - HF Space: https://huggingface.co/spaces/ashfaq1192/course-companion-fte-api
   - Demo credentials table (student@example.com / demo123, test@test.com / test123456)
3. **Updated Table of Contents** to include the new Live Deployments section
4. **Added Production Environment** sub-section under Getting Started with the NEXT_PUBLIC_API_BASE_URL
5. **Added Final Submission table** at the bottom of the Conclusion section listing all deliverables with status and links

## Outcome

README.md fully updated. All production deployment links visible at the top of the document. Hackathon IV submission marked as finalized with a deliverable status table.
