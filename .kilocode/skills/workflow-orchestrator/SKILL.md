---
name: workflow-orchestrator
description: Central orchestration skill that routes all tasks through a pipeline manager. Use for complex multi-step tasks, feature implementation, or when the task requires coordinating multiple agents. The orchestrator analyzes the request, selects the right specialists, and manages the workflow from spec to ship.
---

# Workflow Orchestrator

## Overview

This is the central orchestration skill. All complex tasks should be evaluated through this orchestrator before being delegated to specialized agents or skills. The orchestrator acts as a conductor — it analyzes the task, determines the appropriate workflow, and coordinates the right specialists.

## When to Use

- Complex feature implementation requiring multiple specialists
- Multi-step tasks that span different domains (design + development + testing)
- Projects requiring specification, planning, implementation, and validation
- Any task where the correct path isn't obvious and requires analysis
- When quality gates and validation loops are needed

## Orchestration Modes

### Mode 1: Simple Routing (Single Agent/Skill)

For straightforward tasks that map to a single domain:

```
User Request → Orchestrator Analysis → Single Agent/Skill → Result
```

Examples:
- "Fix this bug" → `debugging-and-error-recovery`
- "Review this code" → `code-review-and-quality`
- "Design an API" → `api-and-interface-design`
- "Optimize performance" → `performance-optimization`

### Mode 2: Pipeline Orchestration (Multi-Agent)

For complex tasks requiring multiple phases and specialists:

```
User Request → Orchestrator Analysis → Pipeline Execution
                                        │
                                        ▼
                    ┌───────────────────────────────────┐
                    │  Phase 1: Analysis & Planning     │
                    │  → PM → Spec → Task Breakdown    │
                    ├───────────────────────────────────┤
                    │  Phase 2: Architecture            │
                    │  → Architect → Design             │
                    ├───────────────────────────────────┤
                    │  Phase 3: Dev ↔ QA Loop           │
                    │  → Dev → QA → Fix → QA → ...     │
                    ├───────────────────────────────────┤
                    │  Phase 4: Integration & Ship      │
                    │  → Integration → Deploy           │
                    └───────────────────────────────────┘
```

Examples:
- "Build a new feature" → Full pipeline from spec to ship
- "Redesign the dashboard" → Design → Implement → Test → Deploy
- "Add authentication" → Spec → Architecture → Implement → QA → Ship

## Decision Logic

### Complexity Assessment

Evaluate the user's request against these criteria:

**Simple (Mode 1):**
- Single domain (e.g., just SEO, just debugging)
- Clear requirements with minimal ambiguity
- Can be completed by one specialist
- No architectural decisions needed

**Complex (Mode 2):**
- Multiple domains involved (e.g., design + development + testing)
- Requirements need clarification or decomposition
- Architectural decisions required
- Quality validation loops needed
- Multi-file/multi-component changes

### Domain Detection

Analyze the request for domain keywords:

| Domain | Keywords | Specialist |
|--------|----------|------------|
| SEO/Search | SEO, search optimization, keywords, SERP | `marketing-seo-specialist` |
| Video/YouTube | video optimization, youtube, thumbnail | `marketing-video-optimization-specialist` |
| Design/Visual | visual storytelling, brand, multimedia | `design-visual-storyteller` |
| UI/UX | UI design, interface, UX, usability | `design-ui-designer`, `design-ux-researcher` |
| Frontend | component, responsive, accessibility, WCAG | `frontend-ui-engineering` |
| API/Backend | API, endpoint, REST, GraphQL, database | `api-and-interface-design` |
| Code Quality | code review, PR, merge, refactor | `code-review-and-quality` |
| Debugging | bug, error, test failure, build error | `debugging-and-error-recovery` |
| Implementation | feature, implement, build, develop | `incremental-implementation` |
| Testing | TDD, test-driven, write tests, prove fix | `test-driven-development` |
| Spec/Planning | spec, requirements, plan, architecture | `spec-driven-development` |
| Performance | slow, optimize, bundle, LCP, Core Web Vitals | `performance-optimization` |
| Security | security, vulnerability, auth, OWASP | `security-and-hardening` |
| CI/CD | pipeline, GitHub Actions, deploy, automation | `ci-cd-and-automation` |
| Git/Version | git, commit, branch, versioning, release | `git-workflow-and-versioning` |
| Launch | deploy, production, rollout, rollback | `shipping-and-launch` |
| Documentation | ADR, documentation, README, changelog | `documentation-and-adrs` |

## Execution Rules

### For Simple Tasks (Mode 1)

1. Identify the single best matching agent/skill
2. Load that agent/skill's instructions
3. Execute the task following that agent's workflow
4. Report results

### For Complex Tasks (Mode 2)

1. **Analyze** the request and break it into phases
2. **Plan** the pipeline — which specialists are needed in which order
3. **Execute** phase by phase:
   - Each phase has clear inputs, outputs, and quality gates
   - Failed phases loop back for retry (max 3 attempts)
   - Passed phases advance to the next
4. **Validate** the final result
5. **Report** completion with metrics

### Orchestration Principles

- **Quality gates between phases**: No phase advances without meeting its criteria
- **Context preservation**: Pass relevant information between phases
- **Retry with feedback**: Failed tasks get specific feedback for improvement
- **Escalation**: Persistent failures (3+ retries) are escalated to the user
- **Transparent reporting**: Clear status updates throughout the pipeline

## Pipeline Phases (Mode 2)

### Phase 1: Analysis & Planning

**Goal:** Understand what needs to be built and break it into tasks.

**Specialists:**
- `spec-driven-development` — Write the spec if one doesn't exist
- `planning-and-task-breakdown` — Break the spec into implementable tasks

**Outputs:**
- Specification document (if needed)
- Task list with acceptance criteria
- Dependency graph

**Quality Gate:** Spec reviewed and approved; task list is complete and ordered.

### Phase 2: Architecture & Design

**Goal:** Design the technical foundation before writing code.

**Specialists:**
- `api-and-interface-design` — API contracts, module boundaries
- `frontend-ui-engineering` — UI architecture, component design
- `design-visual-storyteller` / `design-ui-designer` — Visual design (if applicable)

**Outputs:**
- API contracts / type definitions
- Component architecture
- Design system decisions

**Quality Gate:** Architecture is documented and approved; interfaces are defined.

### Phase 3: Development ↔ QA Loop

**Goal:** Implement each task and validate it before moving on.

**Specialists (Developer side):**
- `incremental-implementation` — Implement in vertical slices
- `test-driven-development` — Write tests alongside code
- Domain-specific agents (e.g., `marketing-seo-specialist` for SEO tasks)

**Specialists (QA side):**
- `code-review-and-quality` — Review each implementation
- `debugging-and-error-recovery` — Fix any issues found
- `testing-*` agents — Validate functionality

**Loop Logic:**
```
For each task in the task list:
  1. Implement the task
  2. QA review
  3. If PASS → mark complete, move to next task
  4. If FAIL → feedback to dev, retry (max 3 times)
  5. If 3 failures → escalate, continue pipeline
```

**Quality Gate:** All tasks pass QA validation.

### Phase 4: Integration & Ship

**Goal:** Validate the complete system and prepare for deployment.

**Specialists:**
- `code-review-and-quality` — Final review of all changes
- `shipping-and-launch` — Deployment strategy and rollback plan
- `observability-and-instrumentation` — Ensure monitoring is in place

**Outputs:**
- Final integration report
- Deployment plan
- Rollback strategy

**Quality Gate:** System passes integration tests; deployment plan is ready.

## Status Reporting

### During Execution

Keep the user informed with concise status updates:

```
🎛️ Orchestrator Status

Phase: [Current Phase]
Task: [Current Task] ([X] of [Y])
Status: [IN_PROGRESS / PASS / FAIL / RETRY]
Next: [What happens next]

Recent: [Last action taken]
```

### On Completion

Provide a summary of what was accomplished:

```
🎛️ Pipeline Complete

Phases completed: [X]/4
Tasks implemented: [X]/[Y]
QA cycles: [X]
Final status: [SUCCESS / NEEDS_WORK / BLOCKED]

Deliverables:
- [List of what was produced]

Recommendations:
- [Any follow-up actions]
```

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "I'll just implement this directly" | Complex tasks benefit from orchestration. Skipping phases leads to rework. |
| "The spec is obvious, I don't need planning" | Unclear specs cause the most rework. 10 minutes of planning saves hours. |
| "I can do this in one pass" | Multi-domain tasks require specialists. One pass misses edge cases. |
| "QA is overkill for this" | Quality gates catch issues before they compound. Cheap upfront, expensive later. |

## Red Flags

- Starting implementation without understanding the full scope
- Skipping architecture phase for complex features
- Not validating tasks before moving to the next
- Mixing concerns (implementation + refactoring + cleanup in one pass)
- No rollback plan for production changes

## Verification

After orchestrated completion:

- [ ] All phases completed in order
- [ ] Each phase passed its quality gate before advancing
- [ ] All tasks implemented and validated
- [ ] Final integration passed
- [ ] Deployment/rollback plan documented
- [ ] User has clear understanding of what was delivered
