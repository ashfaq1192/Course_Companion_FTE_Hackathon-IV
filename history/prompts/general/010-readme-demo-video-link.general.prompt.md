---
id: "010"
title: "README Demo Video Link"
stage: general
date: 2026-03-02
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: ashfaq
command: "add demo video link to README.md"
labels: ["readme", "documentation", "demo-video", "hackathon"]
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

In previous session you updated readme.md with the link of our frontend vercel deployment. I am giving you the link of our youtube demo video for this project please amend that in appropriate place of our readme.md so that anyone visits our repo can see the demo video. Here is the link: https://youtu.be/3IopphHBdQY

## Response

Added the YouTube demo video link `https://youtu.be/3IopphHBdQY` to two locations in README.md:

1. **Live Deployments table** (near top) — added a `| Demo Video | YouTube |` row
2. **Hackathon IV Final Submission table** (bottom) — added `| Demo Video (5 min) | ✅ Complete | ... |` row

## Outcome

README.md updated. Demo video is now prominently visible to repo visitors in both the deployments section and the final deliverables checklist.
