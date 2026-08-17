---
name: claude-agent-router
description: Routes specialized Claude agent definitions from .claude/agents/ based on task intent. Use when a task matches a domain-specific agent (SEO, design, content, testing, product, marketing, etc.).
---

# Claude Agent Router

Automatically load and apply specialized agent definitions from `.claude/agents/` based on the user's task intent.

## How to Use

1. Analyze the user's request for domain keywords.
2. Match the request to the appropriate agent file in `.claude/agents/`.
3. Read the matched agent file.
4. Adopt that agent's identity, rules, workflow, and communication style for the remainder of the task.
5. Do not mix multiple agents in a single response unless explicitly requested.

## Agent Routing Map

### Marketing
- `seo`, `search engine optimization`, `technical SEO`, `on-page SEO`, `keyword research`, `SERP`, `cannibalization` → `marketing-seo-specialist`
- `video optimization`, `youtube optimization`, `video SEO`, `thumbnail optimization` → `marketing-video-optimization-specialist`
- `content creation`, `content strategy`, `copywriting`, `blog post`, `social media content` → `marketing-content-creator`
- `email marketing`, `email campaign`, `newsletter` → `marketing-email-strategist`
- `linkedin`, `linkedin content`, `linkedin post` → `marketing-linkedin-content-creator`
- `instagram`, `instagram post`, `reels` → `marketing-instagram-curator`
- `tiktok`, `tiktok strategy`, `short video` → `marketing-tiktok-strategist`
- `twitter`, `x.com`, `tweet`, `engagement` → `marketing-twitter-engager`
- `reddit`, `community building`, `subreddit` → `marketing-reddit-community-builder`
- `podcast`, `podcast strategy`, `audio content` → `marketing-podcast-strategist`
- `ecommerce`, `shopify`, `online store`, `conversion` → `marketing-cross-border-ecommerce`
- `pr`, `public relations`, `communications` → `marketing-pr-communications-manager`
- `growth hacking`, `viral growth`, `acquisition` → `marketing-growth-hacker`
- `app store optimization`, `aso`, `app store` → `marketing-app-store-optimizer`
- `baidu SEO`, `chinese SEO` → `marketing-baidu-seo-specialist`
- `bilibili`, `chinese video` → `marketing-bilibili-content-strategist`
- `douyin`, `chinese short video` → `marketing-douyin-strategist`
- `kuaishou`, `chinese video platform` → `marketing-kuaishou-strategist`
- `weibo`, `chinese social media` → `marketing-weibo-strategist`
- `wechat`, `wechat official account` → `marketing-wechat-official-account`
- `xiaohongshu`, `little red book`, `chinese lifestyle` → `marketing-xiaohongshu-specialist`
- `zhihu`, `chinese q&a` → `marketing-zhihu-strategist`
- `carousel`, `carousel post`, `linkedin carousel` → `marketing-carousel-growth-engine`
- `livestream`, `live commerce`, `streaming` → `marketing-livestream-commerce-coach`
- `short video editing`, `video editing coach` → `marketing-short-video-editing-coach`
- `multi-platform`, `cross-platform publishing` → `marketing-multi-platform-publisher`
- `agentic search`, `ai search`, `perplexity`, `searchGPT` → `marketing-agentic-search-optimizer`
- `aeo`, `answer engine optimization`, `ai overview` → `marketing-aeo-foundations`
- `ai citation`, `brand citation`, `llm citation` → `marketing-ai-citation-strategist`

### Design
- `visual storytelling`, `visual narrative`, `brand storytelling`, `multimedia content` → `design-visual-storyteller`
- `UI design`, `interface design`, `app design`, `web design` → `design-ui-designer`
- `UX`, `user experience`, `usability`, `user research` → `design-ux-researcher`
- `brand guardian`, `brand guidelines`, `brand consistency` → `design-brand-guardian`
- `image prompt`, `prompt engineering`, `midjourney`, `dall-e`, `flux`, `stable diffusion` → `design-image-prompt-engineer`
- `inclusive design`, `accessibility`, `a11y`, `wcag` → `design-inclusive-visuals-specialist`
- `persona`, `user persona`, `walkthrough`, `user journey` → `design-persona-walkthrough`
- `UI finish`, `pixel perfect`, `design review`, `UI audit` → `design-ui-finish-gate-reviewer`
- `whimsy`, `delight`, `micro-interactions`, `animation personality` → `design-whimsy-injector`
- `UX architecture`, `design system`, `information architecture` → `design-ux-architect`

### Product
- `feedback synthesis`, `user feedback`, `feature request analysis` → `product-feedback-synthesizer`
- `sprint prioritization`, `backlog`, `roadmap`, `feature prioritization` → `product-sprint-prioritizer`
- `trend research`, `market trends`, `emerging trends`, `industry analysis` → `product-trend-researcher`

### Testing
- `accessibility audit`, `a11y audit`, `screen reader`, `keyboard navigation` → `testing-accessibility-auditor`
- `API testing`, `REST API`, `endpoint testing`, `postman` → `testing-api-tester`
- `evidence collection`, `bug evidence`, `reproduction steps` → `testing-evidence-collector`
- `performance benchmark`, `load testing`, `stress test`, `latency` → `testing-performance-benchmarker`
- `reality check`, `feasibility check`, `requirement validation` → `testing-reality-checker`
- `test automation`, `automated tests`, `CI tests`, `cypress`, `playwright` → `testing-test-automation-engineer`
- `test results`, `flaky tests`, `test analysis`, `coverage` → `testing-test-results-analyzer`
- `tool evaluation`, `testing tools`, `framework comparison` → `testing-tool-evaluator`
- `workflow optimization`, `CI optimization`, `pipeline optimization` → `testing-workflow-optimizer`

### Orchestration
- `orchestrate`, `multi-agent`, `agent workflow`, `task routing`, `coordinator` → `agents-orchestrator`

## Execution Rules

- Read the matched agent file from `.claude/agents/<agent-file>.md`.
- Follow that agent's identity, critical rules, deliverables, workflow, communication style, and success metrics.
- If multiple agents match, choose the one whose primary domain most closely aligns with the user's core objective.
- If no agent matches, proceed with general capabilities without a specialized agent persona.
- Do not expose agent selection logic unless asked.

### Complex Task Escalation

If the task meets any of these criteria, **do not route to a single agent**. Instead, invoke the `workflow-orchestrator` skill:
- Requires 3+ distinct steps or phases
- Spans multiple domains (e.g., design + development + testing)
- Needs architectural decisions before implementation
- Requires quality validation loops
- The user explicitly asked for a "complete" or "full" implementation

For complex tasks, the orchestrator will manage the pipeline and delegate to specialists as needed.

## Additional Skills (Software Engineering Lifecycle)

When the task matches software engineering domains, use the corresponding skill from `.kilocode/skills/`:

### API & Interfaces
- `design API`, `REST endpoint`, `GraphQL schema`, `module boundary`, `public interface` → `api-and-interface-design`
- `frontend UI`, `component`, `responsive`, `accessibility`, `WCAG`, `dashboard` → `frontend-ui-engineering`

### Code Quality
- `review code`, `code review`, `PR review`, `merge` → `code-review-and-quality`
- `debug`, `troubleshoot`, `fix bug`, `test failure`, `build error` → `debugging-and-error-recovery`
- `refactor`, `code smell`, `clean code`, `simplify` → `code-simplification`

### Development Workflow
- `implement feature`, `multi-file change`, `incremental`, `vertical slice` → `incremental-implementation`
- `TDD`, `test-driven`, `write tests first`, `prove the fix` → `test-driven-development`
- `spec`, `requirements`, `plan feature`, `architecture decision` → `spec-driven-development`
- `break down tasks`, `estimate`, `sprint planning`, `task list` → `planning-and-task-breakdown`
- `CI/CD`, `pipeline`, `GitHub Actions`, `deploy`, `automation` → `ci-cd-and-automation`

### Observability & Performance
- `logging`, `metrics`, `tracing`, `alerting`, `monitoring` → `observability-and-instrumentation`
- `performance`, `slow`, `optimize`, `bundle size`, `LCP`, `Core Web Vitals` → `performance-optimization`

### Security
- `security`, `vulnerability`, `authentication`, `authorization`, `input validation`, `OWASP` → `security-and-hardening`

### Documentation
- `ADR`, `architecture decision`, `document decision`, `README`, `changelog` → `documentation-and-adrs`

### Version Control & Release
- `git`, `commit`, `branch`, `versioning`, `semantic version`, `changelog` → `git-workflow-and-versioning`
- `deploy`, `production`, `release`, `rollout`, `rollback`, `staged rollout` → `shipping-and-launch`
