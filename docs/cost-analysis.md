# Course Companion FTE - Cost Analysis

## Executive Summary

The Course Companion FTE achieves **99% cost reduction** compared to human tutoring through a Zero-Backend-LLM architecture. Phase 1 operates at near-zero marginal cost ($0.002-$0.004 per user/month). Phase 2 adds selective premium features at justified per-request costs. Phase 3 reuses the same backend infrastructure with a web frontend.

---

## Phase 1: Zero-Backend-LLM (Deterministic Backend)

### Infrastructure Costs (10,000 users)

| Component | Provider | Cost Model | Est. Monthly |
|-----------|----------|------------|-------------|
| Content Storage | Cloudflare R2 | $0.015/GB + $0.36/M reads | ~$5 |
| Database | Neon (PostgreSQL) | Free tier -> $25/mo | $0 - $25 |
| Compute | Railway / Fly.io | ~$5-20/mo | ~$10 |
| Domain + SSL | Cloudflare | ~$12/year | ~$1 |
| **Total Infrastructure** | | | **$16 - $41** |
| **Cost per User** | | | **$0.002 - $0.004** |

### LLM Costs

| Component | Cost | Rationale |
|-----------|------|-----------|
| Backend LLM calls | **$0** | Zero-Backend-LLM architecture |
| ChatGPT usage | **$0 to developer** | Users access via their own ChatGPT subscription |
| Content processing | **$0 at runtime** | Content is pre-generated and served verbatim |

### Why This Works
- ChatGPT handles ALL intelligent processing (explanations, tutoring, adaptation)
- Backend is purely deterministic: serves content, tracks progress, grades quizzes by answer key
- No per-request LLM costs scale with user count
- Can serve 100,000+ users at the same infrastructure cost tier

---

## Phase 2: Hybrid Intelligence (Premium Features)

### Per-Request LLM Costs

| Feature | LLM Model | Est. Input Tokens | Est. Output Tokens | Cost/Request |
|---------|-----------|-------------------|--------------------:|-------------:|
| Adaptive Learning Path | Claude Sonnet 4.5 | ~1,500 | ~500 | $0.018 |
| LLM-Graded Assessments | Claude Sonnet 4.5 | ~1,200 | ~300 | $0.014 |

### Monthly Cost Estimates (per premium user)

| Usage Pattern | Adaptive Path Requests | LLM Grade Requests | Est. Monthly LLM Cost |
|---------------|:----------------------:|:------------------:|----------------------:|
| Light (casual learner) | 5 | 10 | $0.23 |
| Medium (active student) | 15 | 30 | $0.69 |
| Heavy (power user) | 30 | 60 | $1.38 |

### Cost Justification

**Why these features need LLM:**
1. **Adaptive Learning Path**: Requires reasoning over a student's learning patterns, quiz scores, and knowledge gaps to generate personalized next-step recommendations. Rule-based systems cannot assess conceptual understanding across multiple topics.
2. **LLM-Graded Assessments**: Free-form written answers cannot be evaluated by answer-key matching. LLM evaluation provides detailed rubric-based feedback on reasoning quality, argument structure, and concept application.

**Why these features are premium-gated:**
- Each LLM call has a direct cost ($0.014-$0.018 per request)
- Free-tier users get full educational value through rule-based quizzes and ChatGPT explanations
- Premium pricing ($9.99-$19.99/mo) covers LLM costs with healthy margins

---

## Phase 3: Web Application

### Additional Infrastructure Costs

| Component | Provider | Cost Model | Est. Monthly |
|-----------|----------|------------|-------------|
| Frontend Hosting | Vercel / Cloudflare Pages | Free tier | $0 |
| CDN / Static Assets | Cloudflare | Free tier | $0 |
| **Additional Cost** | | | **$0** |

Phase 3 reuses the Phase 1+2 backend. The Next.js frontend is statically generated and hosted for free on Vercel or Cloudflare Pages.

---

## Monetization Model

| Tier | Price/Month | Features | Est. Margin |
|------|:----------:|---------|:-----------:|
| Free | $0 | First 3 chapters, basic quizzes, ChatGPT tutoring | N/A (acquisition) |
| Premium | $9.99 | All chapters, all quizzes, progress tracking, web app | ~99% |
| Pro | $19.99 | Premium + Adaptive Path + LLM Assessments | ~93% |
| Team | $49.99 | Pro + Analytics + Multiple seats | ~95% |

### Break-Even Analysis

| Scenario | Users (Free) | Users (Premium) | Users (Pro) | Monthly Revenue | Monthly Cost | Net |
|----------|:-----------:|:--------------:|:----------:|:--------------:|:-----------:|:---:|
| Early Stage | 500 | 50 | 10 | $700 | $41 | +$659 |
| Growth | 5,000 | 500 | 100 | $7,000 | $200 | +$6,800 |
| Scale | 50,000 | 5,000 | 1,000 | $70,000 | $500 | +$69,500 |

---

## Comparison: Human Tutor vs Digital FTE

| Metric | Human Tutor | Course Companion FTE |
|--------|------------|---------------------|
| Cost per session | $25 - $100 | $0.10 - $0.50 |
| Sessions per month (capacity) | 160 | 50,000+ |
| Monthly cost (1 tutor) | $2,000 - $5,000 | $16 - $41 |
| Cost to serve 10,000 users | $250,000+ | $41 |
| Availability | 40 hrs/week | 168 hrs/week (24/7) |
| **Cost Savings** | | **99%+** |

---

## Key Takeaways

1. **Phase 1 is nearly free to operate** — the Zero-Backend-LLM architecture pushes all LLM costs to the user's ChatGPT subscription
2. **Phase 2 LLM costs are bounded** — premium-gated features with per-user cost tracking prevent runaway spending
3. **Phase 3 adds zero marginal infrastructure cost** — the web frontend is statically hosted
4. **Unit economics are strong** — even at Pro tier ($19.99/mo), LLM costs are <$1.50/user/month
5. **Break-even is immediate** — infrastructure costs are covered by the first 5 premium subscribers
