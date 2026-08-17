# Project Agents

## Central Orchestration

For complex multi-step tasks, use the `workflow-orchestrator` skill from `.kilocode/skills/`. It acts as the central conductor that:
- Analyzes task complexity and selects the appropriate workflow mode
- Routes simple tasks to single agents/skills
- Orchestrates complex tasks through a full pipeline (spec → architecture → dev/QA loop → ship)
- Enforces quality gates between phases

## Specialized Agent Routing

When a task matches one of these domains, automatically load the `claude-agent-router` skill and apply the corresponding agent's rules and workflow.

### Agent Domains (`.claude/agents/`)
Domains that trigger specialized agent routing:
- SEO, search optimization, video optimization
- Visual design, UI/UX, brand storytelling
- Content creation, marketing campaigns
- Product management, trend research
- Testing, accessibility, performance benchmarking
- Multi-agent orchestration

### Software Engineering Skills (`.kilocode/skills/`)
When a task matches software engineering lifecycle domains, use the corresponding skill from `.kilocode/skills/`:
- API design, interfaces, frontend UI
- Code review, debugging, TDD, refactoring
- CI/CD, observability, performance, security
- Documentation, ADRs, git workflow, shipping

Do not ask the user to manually select an agent. Detect intent from the request and route to the appropriate specialized agent automatically.
