# Graph Report - One.Shot.Play  (2026-08-20)

## Corpus Check
- 218 files · ~267,498 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 491 nodes · 754 edges · 43 communities (27 shown, 16 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0 (49 nodes)
- Community 1 (43 nodes)
- Community 2 (40 nodes)
- Community 3 (38 nodes)
- Community 4 (33 nodes)
- Community 5 (31 nodes)
- Community 6 (28 nodes)
- Community 7 (26 nodes)
- Community 8 (17 nodes)
- Community 9 (14 nodes)
- Community 10 (13 nodes)
- Community 11 (11 nodes)
- Community 12 (10 nodes)
- Community 13 (9 nodes)
- Community 14 (8 nodes)
- Community 15 (8 nodes)
- Community 16 (7 nodes)
- Community 17 (7 nodes)
- Community 18 (7 nodes)
- Community 19 (7 nodes)
- Community 20 (7 nodes)
- Community 21 (7 nodes)
- Community 22 (6 nodes)
- Community 23 (6 nodes)
- Community 24 (6 nodes)
- Community 25 (6 nodes)
- Community 26 (6 nodes)
- Community 27 (4 nodes)
- Community 28 (3 nodes)
- Community 29 (3 nodes)
- Community 30 (3 nodes)
- Community 31 (3 nodes)
- Community 32 (3 nodes)
- Community 33 (3 nodes)
- Community 34 (3 nodes)
- Community 35 (3 nodes)
- Community 36 (2 nodes)
- Community 37 (2 nodes)
- Community 38 (2 nodes)

## God Nodes (most connected - your core abstractions)
1. `ConfigService` - 46 edges
2. `AIVideoGenerator` - 33 edges
3. `CredentialManager` - 29 edges
4. `DailyAutomation` - 28 edges
5. `TelegramBotService` - 14 edges
6. `Database` - 13 edges
7. `CostService` - 9 edges
8. `PipelineEngine` - 9 edges
9. `runFFmpeg()` - 8 edges
10. `PostCheckService` - 7 edges

## Surprising Connections (you probably didn't know these)
- `startServer()` --calls--> `initializeDatabase()`  [EXTRACTED]
  index.js → src/db/index.js

## Import Cycles
- None detected.

## Communities (43 total, 16 thin omitted)

### Community 0 - "Community 0 (49 nodes)"
Cohesion: 0.08
Nodes (15): AIVideoGenerator, axios, { Logger }, OpenAI, path, { pathToFileURL }, Replicate, { runFFmpeg, checkFFmpeg, ffmpegInstallHint } (+7 more)

### Community 1 - "Community 1 (43 nodes)"
Cohesion: 0.06
Nodes (26): apiRoutes, app, compression, { ConfigService }, cors, { createLogger }, express, helmet (+18 more)

### Community 2 - "Community 2 (40 nodes)"
Cohesion: 0.09
Nodes (23): { classifyError }, logger, { ERROR_TYPES, isRetryable, classifyError }, PipelineEngine, { retry, RetryError }, { PipelineEngine }, { ConfigService }, { Logger } (+15 more)

### Community 3 - "Community 3 (38 nodes)"
Cohesion: 0.05
Nodes (37): compression, cors, dotenv, eslint, @eslint/js, express, express-rate-limit, helmet (+29 more)

### Community 4 - "Community 4 (33 nodes)"
Cohesion: 0.13
Nodes (4): { Logger }, OpenAI, PROVIDERS, CredentialManager

### Community 7 - "Community 7 (26 nodes)"
Cohesion: 0.10
Nodes (8): postCheck, PostCheckService, preCheck, PreCheckService, PostCheckService, sharp, { ConfigService }, PreCheckService

### Community 8 - "Community 8 (17 nodes)"
Cohesion: 0.12
Nodes (13): { ConfigService }, { Logger }, { PipelineWorker }, { PreCheckService }, TelegramBot, chalk, { google }, inquirer (+5 more)

### Community 10 - "Community 10 (13 nodes)"
Cohesion: 0.17
Nodes (7): auth, { ConfigService }, { CostService }, express, router, { ConfigService }, CostService

### Community 11 - "Community 11 (11 nodes)"
Cohesion: 0.45
Nodes (10): assert, path, runNodeScript(), runTests(), { spawn }, testCoreServicesExist(), testErrorHandling(), testPackageConfig() (+2 more)

### Community 12 - "Community 12 (10 nodes)"
Cohesion: 0.20
Nodes (4): memorySchema, mongoose, CacheService, { Memory }

### Community 13 - "Community 13 (9 nodes)"
Cohesion: 0.25
Nodes (7): createLimiter(), rateLimit, auth, { ConfigService }, express, rateLimit, router

### Community 14 - "Community 14 (8 nodes)"
Cohesion: 0.25
Nodes (6): { ConfigService }, express, router, { createLogger }, _logger, STATUS_MAP

### Community 15 - "Community 15 (8 nodes)"
Cohesion: 0.29
Nodes (3): AssetManager, path, sharp

### Community 16 - "Community 16 (7 nodes)"
Cohesion: 0.29
Nodes (4): auth, { ConfigService }, express, router

### Community 17 - "Community 17 (7 nodes)"
Cohesion: 0.29
Nodes (6): auth, { ConfigService }, { CostService }, express, rateLimit, router

### Community 18 - "Community 18 (7 nodes)"
Cohesion: 0.29
Nodes (6): auth, { ConfigService }, { CostService }, express, rateLimit, router

### Community 21 - "Community 21 (7 nodes)"
Cohesion: 0.33
Nodes (6): axios, cache, { CacheService }, getClient(), httpPool, request()

### Community 22 - "Community 22 (6 nodes)"
Cohesion: 0.33
Nodes (5): auth, { ConfigService }, express, rateLimit, router

### Community 23 - "Community 23 (6 nodes)"
Cohesion: 0.33
Nodes (5): auth, { ConfigService }, express, rateLimit, router

### Community 24 - "Community 24 (6 nodes)"
Cohesion: 0.33
Nodes (5): auth, { ConfigService }, express, rateLimit, router

### Community 25 - "Community 25 (6 nodes)"
Cohesion: 0.33
Nodes (5): auth, { ConfigService }, express, rateLimit, router

### Community 26 - "Community 26 (6 nodes)"
Cohesion: 0.33
Nodes (5): auth, { ConfigService }, express, rateLimit, router

### Community 27 - "Community 27 (4 nodes)"
Cohesion: 0.83
Nodes (3): sanitize(), sanitizeHtml, sanitizeObject()

## Knowledge Gaps
- **168 isolated node(s):** `idea-refine.sh script`, `idea-refine.sh script`, `express`, `path`, `helmet` (+163 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ConfigService` connect `Community 5 (31 nodes)` to `Community 1 (43 nodes)`, `Community 2 (40 nodes)`, `Community 10 (13 nodes)`, `Community 13 (9 nodes)`, `Community 14 (8 nodes)`, `Community 16 (7 nodes)`, `Community 17 (7 nodes)`, `Community 18 (7 nodes)`, `Community 22 (6 nodes)`, `Community 23 (6 nodes)`, `Community 24 (6 nodes)`, `Community 25 (6 nodes)`, `Community 26 (6 nodes)`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `DailyAutomation` connect `Community 6 (28 nodes)` to `Community 8 (17 nodes)`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **What connects `idea-refine.sh script`, `idea-refine.sh script`, `express` to the rest of the system?**
  _168 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0 (49 nodes)` be split into smaller, more focused modules?**
  _Cohesion score 0.08078231292517007 - nodes in this community are weakly interconnected._
- **Should `Community 1 (43 nodes)` be split into smaller, more focused modules?**
  _Cohesion score 0.06090808416389812 - nodes in this community are weakly interconnected._
- **Should `Community 2 (40 nodes)` be split into smaller, more focused modules?**
  _Cohesion score 0.09102564102564102 - nodes in this community are weakly interconnected._
- **Should `Community 3 (38 nodes)` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._