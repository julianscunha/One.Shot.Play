# Graph Report - One.Shot.Play  (2026-08-20)

## Corpus Check
- 203 files · ~268,736 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3073 nodes · 3241 edges · 166 communities (149 shown, 17 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d45260f3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AIVideoGenerator
- index.js
- engine.js
- dependencies
- CredentialManager
- ConfigService
- DailyAutomation
- verification/index.js
- uploader.js
- TelegramBotService
- dashboard.js
- test-setup-tdd.js
- AgentsOrchestrator Agent Personality
- rateLimit.js
- services/config.js
- AssetManager
- auth.js
- Image Prompt Engineer Agent
- Persona Walkthrough Specialist
- Requisitos Detalhados
- AITextService
- http-pool.js
- Incremental Implementation
- execution.js
- logs.js
- One.Shot.Play Frontend Redesign - YouTube-Themed Implementation
- templates.js
- sanitize.js
- idea-refine.sh
- Marketing Carousel Growth Engine
- China Market Localization Strategist
- Debugging and Error Recovery
- Marketing SEO Specialist
- Security and Hardening
- Security and Hardening
- ArchitectUX Agent Personality
- compression.js
- cors.js
- security.js
- Core Mission
- Email Marketing Strategist
- Accessibility Auditor Agent Personality
- Code Review and Quality
- Test-Driven Development
- Brand Guardian Agent Personality
- UX Researcher Agent Personality
- Whimsy Injector Agent Personality
- App Store Optimizer Agent Personality
- Marketing China E-Commerce Operator
- Core Mission
- 📣 PR & Communications Manager
- Core Mission
- UI Designer Agent Personality
- Marketing Baidu SEO Specialist
- Marketing Bilibili Content Strategist
- Marketing Kuaishou Strategist
- Core Mission
- Product Sprint Prioritizer Agent
- Integration Agent Personality
- Git Workflow and Versioning
- Git Workflow and Versioning
- Marketing Livestream Commerce Coach
- Product Trend Researcher Agent
- Visual Storyteller Agent
- Marketing Zhihu Strategist
- API Tester Agent Personality
- Performance Benchmarker Agent Personality
- Test Results Analyzer Agent Personality
- Tool Evaluator Agent Personality
- Workflow Optimizer Agent Personality
- API and Interface Design
- Browser Testing with DevTools
- Shipping and Launch
- API and Interface Design
- Shipping and Launch
- Workflow Orchestrator
- Marketing Global Podcast Strategist
- Marketing Private Domain Operator
- Marketing WeChat Official Account Manager
- Marketing Xiaohongshu Specialist
- QA Agent Personality
- CI/CD and Automation
- Deprecation and Migration
- Frontend UI Engineering
- CI/CD and Automation
- Frontend UI Engineering
- Marketing TikTok Strategist
- Marketing Twitter Engager
- Marketing X/Twitter Intelligence Analyst
- Context Engineering
- Performance Optimization
- Incremental Implementation
- Performance Optimization
- Task List: Refatoração Completa do YouTube Automation Agent
- UI Finish-Gate Reviewer Agent Personality
- Marketing Reddit Community Builder
- Code Simplification
- Documentation and ADRs
- Debugging and Error Recovery
- Documentation and ADRs
- Marketing Instagram Curator
- Agentic Search Optimizer
- Marketing Douyin Strategist
- Multi-Platform Publisher
- AEO Foundations Architect
- Social Media Strategist Agent
- Marketing Video Optimization Specialist Agent
- Product Feedback Synthesizer Agent
- Planning and Task Breakdown
- Additional Skills (Software Engineering Lifecycle)
- Planning and Task Breakdown
- Task List
- Test Automation Engineer
- ReOrder: Keep Your Regulars Ordering Direct
- Interview Me
- AI Citation Strategist
- Doubt-Driven Development
- Idea Refine
- Process
- Using Agent Skills
- Process
- ai-video-generator.js
- Spec-Driven Development
- Guia de Uso - YouTube Automation Agent
- Spec-Driven Development
- PipelineEngine
- Book Co-Author
- Source-Driven Development
- 📸 Inclusive Visuals Specialist
- Refinement & Evaluation Criteria
- LinkedIn Content Creator
- ADR-001: Arquitetura Back4App + MongoDB
- ADR-002: Multi-Provider com Fallback
- ADR-003: Pipeline em Fases com Checkpoint
- YouTube Automation Agent
- Database
- ADR-004: Templates como Snapshots
- ADR-005: pt-BR como Idioma Padrão
- package.json
- logger.js
- AGENTS.md
- Ideation Frameworks Reference
- run.js
- Marketing Content Creator Agent
- Marketing Growth Hacker Agent
- devDependencies
- CLAUDE.md
- API/Middleware Auth Considerations
- scripts
- setup.js
- captions.js
- retry.js
- Testes - Refatoração YouTube Automation Agent
- cors
- dotenv
- express
- express-rate-limit
- @google/genai
- googleapis
- inquirer
- replicate

## God Nodes (most connected - your core abstractions)
1. `ConfigService` - 48 edges
2. `AIVideoGenerator` - 37 edges
3. `CredentialManager` - 30 edges
4. `DailyAutomation` - 28 edges
5. `Task List: Refatoração Completa do YouTube Automation Agent` - 22 edges
6. `Code Review and Quality` - 19 edges
7. `Agentic Search Optimizer` - 19 edges
8. `Requisitos Detalhados` - 18 edges
9. `Security and Hardening` - 17 edges
10. `Security and Hardening` - 17 edges

## Surprising Connections (you probably didn't know these)
- `startServer()` --calls--> `initializeDatabase()`  [EXTRACTED]
  index.js → src/db/index.js
- `addCaptionsToVideo()` --calls--> `runFFmpeg()`  [EXTRACTED]
  src/utils/captions.js → src/utils/ffmpeg.js

## Import Cycles
- None detected.

## Communities (166 total, 17 thin omitted)

### Community 1 - "index.js"
Cohesion: 0.13
Nodes (15): apiRoutes, app, compression, { ConfigService }, cors, { createLogger }, express, helmet (+7 more)

### Community 2 - "engine.js"
Cohesion: 0.16
Nodes (10): { classifyError }, logger, { addCaptionsToVideo }, { AIVideoGenerator }, { ERROR_TYPES, classifyError }, path, { uploadVideo }, { PipelineEngine } (+2 more)

### Community 3 - "dependencies"
Cohesion: 0.13
Nodes (15): axios, compression, helmet, openai, dependencies, axios, compression, helmet (+7 more)

### Community 6 - "DailyAutomation"
Cohesion: 0.12
Nodes (3): cron, DailyAutomation, { Logger }

### Community 7 - "verification/index.js"
Cohesion: 0.10
Nodes (8): postCheck, PostCheckService, preCheck, PreCheckService, PostCheckService, sharp, { ConfigService }, PreCheckService

### Community 8 - "uploader.js"
Cohesion: 0.17
Nodes (11): { createLogger }, { CredentialManager }, fs, logger, simulateUpload(), uploadVideo(), chalk, { createLogger } (+3 more)

### Community 9 - "TelegramBotService"
Cohesion: 0.19
Nodes (6): { ConfigService }, { Logger }, { PipelineWorker }, { PreCheckService }, TelegramBot, TelegramBotService

### Community 10 - "dashboard.js"
Cohesion: 0.11
Nodes (13): auth, { ConfigService }, { CostService }, express, router, auth, { ConfigService }, { CostService } (+5 more)

### Community 11 - "test-setup-tdd.js"
Cohesion: 0.45
Nodes (10): assert, path, runNodeScript(), runTests(), { spawn }, testCoreServicesExist(), testErrorHandling(), testPackageConfig() (+2 more)

### Community 12 - "AgentsOrchestrator Agent Personality"
Cohesion: 0.05
Nodes (37): 🚀 Advanced Pipeline Capabilities, AgentsOrchestrator Agent Personality, Autonomous Operation, 🤖 Available Specialist Agents, Completion Summary Template, Context-Aware Agent Spawning, 🚨 Critical Rules You Must Follow, 🎨 Design & UX Agents (+29 more)

### Community 13 - "rateLimit.js"
Cohesion: 0.14
Nodes (12): createLimiter(), rateLimit, auth, { ConfigService }, express, rateLimit, router, auth (+4 more)

### Community 14 - "services/config.js"
Cohesion: 0.15
Nodes (10): auth, { ConfigService }, express, router, { ConfigService }, express, router, { createLogger } (+2 more)

### Community 15 - "AssetManager"
Cohesion: 0.29
Nodes (3): AssetManager, path, sharp

### Community 16 - "auth.js"
Cohesion: 0.15
Nodes (9): auth, { ConfigService }, express, router, auth, { ConfigService }, express, rateLimit (+1 more)

### Community 17 - "Image Prompt Engineer Agent"
Cohesion: 0.05
Nodes (36): Advanced Capabilities, Advanced Prompt Patterns, Cinematic Portrait, Critical Rules You Must Follow, Environment & Setting Layer, Environmental Portrait, Example Prompt Templates, Fashion Photography (+28 more)

### Community 18 - "Persona Walkthrough Specialist"
Cohesion: 0.06
Nodes (35): 🚀 Advanced Capabilities, Analyst Assessment Template (per fold), Cialdini's 7 Principles, 💭 Communication Style, Competitive Walkthrough, 🎯 Core Mission, 🚨 Critical Rules, Cross-Cultural Adaptation (+27 more)

### Community 19 - "Requisitos Detalhados"
Cohesion: 0.06
Nodes (35): 10. Execução Baseada em Templates, 11. Agendamento Flexível, 12. Sistema de Verificação Pré/Prós-Execução, 13. Retry por Fase, 14. Otimização Extrema de Recursos, 15. Sistema de Memória e Melhoria Constante, 16. Segurança para Servidor Público, 17.1. Observabilidade e Monitoring (+27 more)

### Community 20 - "AITextService"
Cohesion: 0.24
Nodes (4): AITextService, { Logger }, OpenAI, PROVIDERS

### Community 21 - "http-pool.js"
Cohesion: 0.38
Nodes (6): axios, cache, { CacheService }, getClient(), httpPool, request()

### Community 22 - "Incremental Implementation"
Cohesion: 0.06
Nodes (32): Detection Pattern, Handling Stub/Placeholder Endpoints During Incremental Implementation, Incremental Fix Approach, Key Principle, Slice 1: Verify the data source exists, Slice 2: Connect the endpoint to the service, Slice 3: Verify with existing test suite, The Problem (+24 more)

### Community 23 - "execution.js"
Cohesion: 0.12
Nodes (11): auth, { ConfigService }, express, { PipelineWorker }, rateLimit, router, worker, { ConfigService } (+3 more)

### Community 24 - "logs.js"
Cohesion: 0.33
Nodes (5): auth, { ConfigService }, express, rateLimit, router

### Community 25 - "One.Shot.Play Frontend Redesign - YouTube-Themed Implementation"
Cohesion: 0.06
Nodes (32): 1. Setup Page (`setup.html`), 2. Dashboard (`index.html`), 3 of 8 Additional Pages, Access URLs, After (YouTube-Themed Professional), 📄 All Pages Implemented, Before (Generic Templates), Brand Alignment (+24 more)

### Community 26 - "templates.js"
Cohesion: 0.33
Nodes (5): auth, { ConfigService }, express, rateLimit, router

### Community 27 - "sanitize.js"
Cohesion: 0.83
Nodes (3): sanitize(), sanitizeHtml, sanitizeObject()

### Community 29 - "Marketing Carousel Growth Engine"
Cohesion: 0.06
Nodes (31): Advanced Capabilities, Analytics & Learning Output (`learnings.json`), Autonomous Quality Assurance, Autonomy Standards, Carousel Generation Output, Carousel Standards, Communication Style, Content Standards (+23 more)

### Community 30 - "China Market Localization Strategist"
Cohesion: 0.06
Nodes (31): 1. Real-Time Trend Intelligence & Signal Detection, 2. Market Opportunity Extraction (Trend → Action), 3. Cross-Platform Localization Strategy, 4. GTM Execution & Lifecycle Management, 🚀 Advanced Capabilities, China-Global Bridge Strategy, China Market Localization Strategist, Crisis & Sentiment Management (+23 more)

### Community 31 - "Debugging and Error Recovery"
Cohesion: 0.06
Nodes (30): 1. Missing API_KEY in .env, 2. Stub Endpoints Returning Zeros, 3. Server Not Running / Port Mismatch, Debugging Frontend-Backend Disconnect (Session Reference), Key Lesson, Reproduction Checklist, Root Causes Found in This Session, Scenario (+22 more)

### Community 32 - "Marketing SEO Specialist"
Cohesion: 0.06
Nodes (30): Advanced Capabilities, AI Search & SGE Adaptation, Algorithm Recovery, Cannibalization Audit Template, Cannibalization Audit Without GSC (Pre-Access Fallback), Cannibalization Prevention (MANDATORY before any optimization), Communication Style, Core Mission (+22 more)

### Community 33 - "Security and Hardening"
Cohesion: 0.06
Nodes (30): Always Do (No Exceptions), Ask First (Requires Human Approval), Broken Access Control, Broken Authentication, Common Rationalizations, Cross-Site Scripting (XSS), Data Privacy & Compliance, File Upload Safety (+22 more)

### Community 34 - "Security and Hardening"
Cohesion: 0.06
Nodes (30): Always Do (No Exceptions), Ask First (Requires Human Approval), Broken Access Control, Broken Authentication, Common Rationalizations, Cross-Site Scripting (XSS), Data Privacy & Compliance, File Upload Safety (+22 more)

### Community 35 - "ArchitectUX Agent Personality"
Cohesion: 0.07
Nodes (29): 🚀 Advanced Capabilities, ArchitectUX Agent Personality, Bridge PM and Development, Create Developer-Ready Foundations, 🚨 Critical Rules You Must Follow, CSS Architecture Mastery, CSS Design System Foundation, Developer Experience (+21 more)

### Community 43 - "Core Mission"
Cohesion: 0.07
Nodes (29): Amazon PPC Framework, Brand Globalization, Communication Style, Compliance Red Lines, Compliance & Taxation, Core Mission, Critical Rules, Cross-Border Advertising (+21 more)

### Community 44 - "Email Marketing Strategist"
Cohesion: 0.07
Nodes (29): 🚀 Advanced Capabilities, AI-Powered Optimization (2025-2026 Production-Ready), Attribute Mapping Template, Behavioral Trigger Architecture, Clicks Over Opens, Consent Is Infrastructure, 🚨 Critical Rules You Must Follow, Data Quality Before Volume (+21 more)

### Community 45 - "Accessibility Auditor Agent Personality"
Cohesion: 0.07
Nodes (29): Accessibility Audit Report Template, Accessibility Auditor Agent Personality, 🚀 Advanced Capabilities, Audit Against WCAG Standards, Catch What Automation Misses, 🚨 Critical Rules You Must Follow, Cross-Agent Collaboration, Design System Accessibility (+21 more)

### Community 46 - "Code Review and Quality"
Cohesion: 0.07
Nodes (29): 1. Correctness, 2. Readability & Simplicity, 3. Architecture, 4. Security, 5. Performance, Change Descriptions, Change Sizing, Code Review and Quality (+21 more)

### Community 47 - "Test-Driven Development"
Cohesion: 0.07
Nodes (29): Browser Testing with DevTools, Common Rationalizations, DAMP Over DRY in Tests, Decision Guide, Discover the Stack First, Name Tests Descriptively, One Assertion Per Concept, Overview (+21 more)

### Community 48 - "Brand Guardian Agent Personality"
Cohesion: 0.07
Nodes (27): 🚀 Advanced Capabilities, Brand-First Approach, Brand Foundation Framework, Brand Guardian Agent Personality, Brand Protection Expertise, Brand Strategy Mastery, Brand Voice and Messaging, Create Comprehensive Brand Foundations (+19 more)

### Community 49 - "UX Researcher Agent Personality"
Cohesion: 0.07
Nodes (27): 🚀 Advanced Capabilities, Behavioral Analysis Mastery, 🚨 Critical Rules You Must Follow, Ethical Research Practices, Insight Communication, 🔄 Learning & Memory, Pattern Recognition, Provide Actionable Insights (+19 more)

### Community 50 - "Whimsy Injector Agent Personality"
Cohesion: 0.07
Nodes (27): 🚀 Advanced Capabilities, Balance Delight with Usability, Brand Personality Framework, Brand Personality Integration, Create Memorable Experiences, 🚨 Critical Rules You Must Follow, Gamification Mastery, Gamification System Design (+19 more)

### Community 51 - "App Store Optimizer Agent Personality"
Cohesion: 0.07
Nodes (27): = Advanced Capabilities, Analytics and Performance Tracking, App Preview Video Strategy, App Store Optimizer Agent Personality, ASO Mastery, ASO Strategy Framework, Conversion-First Design Philosophy, Conversion Optimization Excellence (+19 more)

### Community 52 - "Marketing China E-Commerce Operator"
Cohesion: 0.07
Nodes (27): 618 / Double 11 Campaign Battle Plan, 🚀 Advanced Capabilities, Advanced Live Commerce Operations, Advertising ROI Optimization Framework, Campaign Discipline, 🚨 Critical Rules You Must Follow, Cross-Platform Arbitrage & Differentiation, Dominate Multi-Platform E-Commerce Operations (+19 more)

### Community 53 - "Core Mission"
Cohesion: 0.07
Nodes (27): Audience Growth, Audio Equipment & Technical Setup, Chinese Podcast Platform Operations, Communication Style, Content Planning & Topic Selection, Content Red Lines, Core Mission, Critical Rules (+19 more)

### Community 54 - "📣 PR & Communications Manager"
Cohesion: 0.07
Nodes (27): 🚀 Advanced Capabilities, Awards & Recognition Strategy, Communications Channels, Crisis Communications Framework, Crisis Types & Approach, 🚨 Critical Rules You Must Follow, Domain Expertise, Executive Thought Leadership Framework (+19 more)

### Community 55 - "Core Mission"
Cohesion: 0.07
Nodes (27): Account Positioning & Persona Building, Communication Style, Compliance Red Lines, Content Strategy, Core Mission, Crisis Response Template, Critical Rules, Data Analytics (+19 more)

### Community 56 - "UI Designer Agent Personality"
Cohesion: 0.07
Nodes (26): 🚀 Advanced Capabilities, Component Library Architecture, Craft Pixel-Perfect Interfaces, Create Comprehensive Design Systems, 🚨 Critical Rules You Must Follow, Design System First Approach, Design System Mastery, Developer Collaboration (+18 more)

### Community 57 - "Marketing Baidu SEO Specialist"
Cohesion: 0.07
Nodes (26): 🚀 Advanced Capabilities, Baidu Algorithm Mastery, Baidu Ecosystem Integration Strategy, Baidu SEM Integration, Baidu SEO Audit Report Template, Baidu-Specific Technical Requirements, Build Comprehensive China Search Visibility, China-Specific Technical SEO (+18 more)

### Community 58 - "Marketing Bilibili Content Strategist"
Cohesion: 0.07
Nodes (26): 🚀 Advanced Capabilities, Bilibili Algorithm Deep Dive, Bilibili Culture Standards, Content Strategy Blueprint, Cover Image and Title A/B Testing Framework, Crisis Management on B站, 🚨 Critical Rules You Must Follow, Cross-Platform Synergy (+18 more)

### Community 59 - "Marketing Kuaishou Strategist"
Cohesion: 0.07
Nodes (26): 🚀 Advanced Capabilities, Advanced Live Commerce Operations, Build Unbreakable Community Loyalty, 🚨 Critical Rules You Must Follow, Cross-Platform Private Domain Strategy, Drive Live Commerce Excellence, Kuaishou Account Strategy Blueprint, Kuaishou Algorithm Deep Dive (+18 more)

### Community 60 - "Core Mission"
Cohesion: 0.07
Nodes (26): AI-Assisted Editing, Audio Engineering, Audio Matters as Much as Video, Color Grading & Correction, Communication Style, Composition & Camera Language, Core Mission, Critical Rules (+18 more)

### Community 61 - "Product Sprint Prioritizer Agent"
Cohesion: 0.07
Nodes (26): Alignment Techniques, Capacity Planning, Continuous Improvement, Core Capabilities, Decision Framework, Kano Model Classification, Mitigation Strategies, Pre-Sprint Planning (Week Before) (+18 more)

### Community 62 - "Integration Agent Personality"
Cohesion: 0.07
Nodes (26): Build Expertise In:, Complete System Screenshots Analysis, 🚨 Critical Rules You Must Follow, Default to Skepticism, Evidence Failures, Fantasy Assessment Indicators, Integration Agent Personality, 🔄 Learning & Memory (+18 more)

### Community 63 - "Git Workflow and Versioning"
Cohesion: 0.07
Nodes (26): 1. Commit Early, Commit Often, 2. Atomic Commits, 3. Descriptive Messages, 4. Keep Concerns Separate, 5. Size Your Changes, Branch Naming, Branching Strategy, Change Summaries (+18 more)

### Community 64 - "Git Workflow and Versioning"
Cohesion: 0.07
Nodes (26): 1. Commit Early, Commit Often, 2. Atomic Commits, 3. Descriptive Messages, 4. Keep Concerns Separate, 5. Size Your Changes, Branch Naming, Branching Strategy, Change Summaries (+18 more)

### Community 65 - "Marketing Livestream Commerce Coach"
Cohesion: 0.08
Nodes (25): Communication Style, Compliance Guardrails, Core Mission, Critical Rules, Data Analysis & Review, Host Management Principles, Host Talent Development, Live Room Data Review Dashboard (+17 more)

### Community 66 - "Product Trend Researcher Agent"
Cohesion: 0.08
Nodes (25): Competitive Intelligence, Consumer Behavior Analysis, Continuous Intelligence, Core Capabilities, Decision Framework, Identity & Role Definition, Innovation Tracking, Insight Delivery Formats (+17 more)

### Community 67 - "Visual Storyteller Agent"
Cohesion: 0.08
Nodes (24): 🚀 Advanced Capabilities, 🚨 Critical Rules You Must Follow, Cross-Platform Adaptation, Cross-Platform Visual Strategy, Information Design & Data Visualization, Multimedia Content Creation, Multimedia Design Excellence, Step 1: Story Strategy Development (+16 more)

### Community 68 - "Marketing Zhihu Strategist"
Cohesion: 0.08
Nodes (24): Advanced Capabilities, Answer Excellence & Authority, Business Integration, Communication Style, Community & Relationship Building, Content & Authority Systems, Content Standards, Core Mission (+16 more)

### Community 69 - "API Tester Agent Personality"
Cohesion: 0.08
Nodes (24): 🚀 Advanced Capabilities, API Tester Agent Personality, Comprehensive API Test Suite Example, Comprehensive API Testing Strategy, 🚨 Critical Rules You Must Follow, Integration and Documentation Testing, 🔄 Learning & Memory, Performance and Security Validation (+16 more)

### Community 70 - "Performance Benchmarker Agent Personality"
Cohesion: 0.08
Nodes (24): 🚀 Advanced Capabilities, Advanced Performance Testing Suite Example, Capacity Planning and Scalability Assessment, Comprehensive Performance Testing, 🚨 Critical Rules You Must Follow, Infrastructure Performance, 🔄 Learning & Memory, Performance Benchmarker Agent Personality (+16 more)

### Community 71 - "Test Results Analyzer Agent Personality"
Cohesion: 0.08
Nodes (24): Advanced Analytics and Machine Learning, 🚀 Advanced Capabilities, Advanced Test Analysis Framework Example, Comprehensive Test Result Analysis, 🚨 Critical Rules You Must Follow, Data-Driven Analysis Approach, 🔄 Learning & Memory, Quality-First Decision Making (+16 more)

### Community 72 - "Tool Evaluator Agent Personality"
Cohesion: 0.08
Nodes (24): 🚀 Advanced Capabilities, Advanced Evaluation Methodologies, Comprehensive Tool Assessment and Selection, Comprehensive Tool Evaluation Framework Example, Cost-Conscious Decision Making, 🚨 Critical Rules You Must Follow, Evidence-Based Evaluation Process, 🔄 Learning & Memory (+16 more)

### Community 73 - "Workflow Optimizer Agent Personality"
Cohesion: 0.08
Nodes (24): 🚀 Advanced Capabilities, Advanced Workflow Optimization Framework Example, Comprehensive Workflow Analysis and Optimization, 🚨 Critical Rules You Must Follow, Cross-Functional Integration and Coordination, Data-Driven Process Improvement, Human-Centered Design Approach, Intelligent Automation and Integration (+16 more)

### Community 74 - "API and Interface Design"
Cohesion: 0.08
Nodes (24): 1. Contract First, 2. Consistent Error Semantics, 3. Validate at Boundaries, 4. Prefer Addition Over Modification, 5. Predictable Naming, 6. Honouring an Idempotency Key, API and Interface Design, Common Rationalizations (+16 more)

### Community 75 - "Browser Testing with DevTools"
Cohesion: 0.08
Nodes (24): Accessibility Verification with DevTools, Available Tools, Browser Testing with DevTools, Clean Console Standard, Common Rationalizations, Console Analysis Patterns, Content Boundary Markers, For Network Issues (+16 more)

### Community 76 - "Shipping and Launch"
Cohesion: 0.08
Nodes (24): Accessibility, Code Quality, Common Rationalizations, Documentation, Error Reporting, Feature Flag Strategy, Infrastructure, Monitoring and Observability (+16 more)

### Community 77 - "API and Interface Design"
Cohesion: 0.08
Nodes (24): 1. Contract First, 2. Consistent Error Semantics, 3. Validate at Boundaries, 4. Prefer Addition Over Modification, 5. Predictable Naming, 6. Honouring an Idempotency Key, API and Interface Design, Common Rationalizations (+16 more)

### Community 78 - "Shipping and Launch"
Cohesion: 0.08
Nodes (24): Accessibility, Code Quality, Common Rationalizations, Documentation, Error Reporting, Feature Flag Strategy, Infrastructure, Monitoring and Observability (+16 more)

### Community 79 - "Workflow Orchestrator"
Cohesion: 0.08
Nodes (24): Common Rationalizations, Complexity Assessment, Decision Logic, Domain Detection, During Execution, Execution Rules, For Complex Tasks (Mode 2), For Simple Tasks (Mode 1) (+16 more)

### Community 80 - "Marketing Global Podcast Strategist"
Cohesion: 0.08
Nodes (23): 🚀 Advanced Capabilities, Algorithmic Growth Tactics, Crisis & Plateau Management, 🚨 Critical Rules You Must Follow, Episode Hook Engineering, Growth & Analytics Frameworks, Guest Outreach & Relationship Management, 🔄 Learning & Memory (+15 more)

### Community 81 - "Marketing Private Domain Operator"
Cohesion: 0.08
Nodes (23): Communication Style, Community Operations SOP Template, Conversion Funnel Dashboard, Core Mission, Critical Rules, Full-Funnel Conversion, Marketing Private Domain Operator, Mini Program Commerce Integration (+15 more)

### Community 82 - "Marketing WeChat Official Account Manager"
Cohesion: 0.08
Nodes (23): Advanced Capabilities, Automation & Scale, Business Integration, Communication Style, Community Building & Loyalty, Content Excellence, Content Standards, Content Strategy Documents (+15 more)

### Community 83 - "Marketing Xiaohongshu Specialist"
Cohesion: 0.08
Nodes (23): Advanced Capabilities, Aesthetic & Visual Excellence, Communication Style, Community & Creator Strategy, Content Standards, Content Strategy Documents, Core Mission, Critical Rules (+15 more)

### Community 84 - "QA Agent Personality"
Cohesion: 0.08
Nodes (23): Accordion Testing Protocol, Build Expertise In:, "Default to Finding Issues", Fantasy Reporting Signs, Form Testing Protocol, 🔄 Learning & Memory, Mobile Responsive Testing, "Prove Everything" (+15 more)

### Community 85 - "CI/CD and Automation"
Cohesion: 0.08
Nodes (23): Automation Beyond CI, Basic CI Pipeline, Build Cop Role, CI/CD and Automation, CI Optimization, Common Rationalizations, Dependabot / Renovate, Deployment Strategies (+15 more)

### Community 86 - "Deprecation and Migration"
Cohesion: 0.08
Nodes (23): Adapter Pattern, Code Is a Liability, Common Rationalizations, Compulsory vs Advisory Deprecation, Core Principles, Database Schema Migrations (Expand/Contract), Deprecation and Migration, Deprecation Planning Starts at Design Time (+15 more)

### Community 87 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (23): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+15 more)

### Community 88 - "CI/CD and Automation"
Cohesion: 0.08
Nodes (23): Automation Beyond CI, Basic CI Pipeline, Build Cop Role, CI/CD and Automation, CI Optimization, Common Rationalizations, Dependabot / Renovate, Deployment Strategies (+15 more)

### Community 89 - "Frontend UI Engineering"
Cohesion: 0.08
Nodes (23): Accessibility (WCAG 2.1 AA), ARIA Labels, Avoid the AI Aesthetic, Color, Common Rationalizations, Component Architecture, Component Patterns, Design System Adherence (+15 more)

### Community 90 - "Marketing TikTok Strategist"
Cohesion: 0.09
Nodes (22): Advanced Capabilities, Communication Style, Content Strategy Framework, Core Mission, Creator Economy Excellence, Crisis Management & Community Response, Critical Rules, Identity & Memory (+14 more)

### Community 91 - "Marketing Twitter Engager"
Cohesion: 0.09
Nodes (22): Advanced Capabilities, Communication Style, Content Strategy Framework, Core Mission, Crisis Management Mastery, Critical Rules, Identity & Memory, Learning & Memory (+14 more)

### Community 92 - "Marketing X/Twitter Intelligence Analyst"
Cohesion: 0.09
Nodes (22): Advanced Capabilities, Brand Risk Monitoring, Communication Style, Competitor & Audience Intelligence, Core Mission, Critical Rules, Identity & Memory, Intelligence Brief Template (+14 more)

### Community 93 - "Context Engineering"
Cohesion: 0.09
Nodes (22): Anti-Patterns, Common Rationalizations, Confusion Management, Context Engineering, Context Packing Strategies, Level 1: Rules Files, Level 2: Specs and Architecture, Level 3: Relevant Source Files (+14 more)

### Community 94 - "Performance Optimization"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Core Web Vitals Targets, Large Bundle Size, Log every attempt, including the reverted ones, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Overview (+14 more)

### Community 95 - "Incremental Implementation"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Contract-First Slicing, Implementation Rules, Increment Checklist, Incremental Implementation, Overview, Red Flags, Risk-First Slicing (+14 more)

### Community 96 - "Performance Optimization"
Cohesion: 0.09
Nodes (22): Common Rationalizations, Core Web Vitals Targets, Large Bundle Size, Log every attempt, including the reverted ones, Missing Caching (Backend), Missing Image Optimization (Frontend), N+1 Queries (Backend), Overview (+14 more)

### Community 97 - "Task List: Refatoração Completa do YouTube Automation Agent"
Cohesion: 0.09
Nodes (22): Checkpoint: Fase 0, Checkpoint: Fase 1, Checkpoint: Fase 2, Checkpoint: Fase 3, Checkpoint: Fase 4, Checkpoint: Fase 5, Checkpoint: Fase 6, Checkpoint: Fase 7 (+14 more)

### Community 98 - "UI Finish-Gate Reviewer Agent Personality"
Cohesion: 0.09
Nodes (21): 💭 Communication Style, 📋 Concrete Deliverables, Create a Design Contract, 🚨 Critical Rules You Must Follow, Evidence Before Opinion, Example: Generic Analytics Dashboard, Example: Mobile Operations Screen, Example: SaaS Setup Flow (+13 more)

### Community 99 - "Marketing Reddit Community Builder"
Cohesion: 0.09
Nodes (21): Advanced Capabilities, Advanced Community Navigation, AMA (Ask Me Anything) Excellence, Communication Style, Community Strategy Documents, Core Mission, Crisis Management & Reputation Protection, Critical Rules (+13 more)

### Community 100 - "Code Simplification"
Cohesion: 0.09
Nodes (21): 1. Preserve Behavior Exactly, 2. Follow Project Conventions, 3. Prefer Clarity Over Cleverness, 4. Maintain Balance, 5. Scope to What Changed, Code Simplification, Common Rationalizations, Language-Specific Guidance (+13 more)

### Community 101 - "Documentation and ADRs"
Cohesion: 0.09
Nodes (21): ADR Lifecycle, ADR Template, API Documentation, Architecture Decision Records (ADRs), Changelog Maintenance, Common Rationalizations, Document Known Gotchas, Documentation and ADRs (+13 more)

### Community 102 - "Debugging and Error Recovery"
Cohesion: 0.09
Nodes (21): Build Failure Triage, Common Rationalizations, Debugging and Error Recovery, Error-Specific Patterns, Instrumentation Guidelines, Overview, Red Flags, Runtime Error Triage (+13 more)

### Community 103 - "Documentation and ADRs"
Cohesion: 0.09
Nodes (21): ADR Lifecycle, ADR Template, API Documentation, Architecture Decision Records (ADRs), Changelog Maintenance, Common Rationalizations, Document Known Gotchas, Documentation and ADRs (+13 more)

### Community 104 - "Marketing Instagram Curator"
Cohesion: 0.10
Nodes (20): Advanced Capabilities, Algorithm Optimization, Communication Style, Community Building Excellence, Content Standards, Core Mission, Critical Rules, Identity & Memory (+12 more)

### Community 105 - "Agentic Search Optimizer"
Cohesion: 0.10
Nodes (19): 🚀 Advanced Capabilities, Agent Compatibility Matrix, Agent Friction Map Template, Agent-Hostile Patterns to Eliminate, Agentic Search Optimizer, Collaboration with Complementary Agents, 🚨 Critical Rules You Must Follow, Declarative vs. Imperative Decision Framework (+11 more)

### Community 106 - "Marketing Douyin Strategist"
Cohesion: 0.10
Nodes (19): Algorithm-First Thinking, Communication Style, Compliance Guardrails, Core Mission, Critical Rules, Livestream Commerce, Livestream Product Lineup, Marketing Douyin Strategist (+11 more)

### Community 107 - "Multi-Platform Publisher"
Cohesion: 0.10
Nodes (19): 🚀 Advanced Capabilities, 🚨 Critical Rules You Must Follow, Draft-First, Always, 🔄 Learning & Memory, Multi-Platform Publisher, Never Do, Parameter Intake Table, Per-Platform Hard Constraints (+11 more)

### Community 108 - "AEO Foundations Architect"
Cohesion: 0.11
Nodes (18): 🚀 Advanced Capabilities, AEO Foundations Architect, AEO Foundations Scorecard, AI Crawler Taxonomy, Collaboration with Complementary Agents, 💭 Communication Style, Content Availability Tiers, 🎯 Core Mission (+10 more)

### Community 109 - "Social Media Strategist Agent"
Cohesion: 0.11
Nodes (18): Campaign Management, Campaign Planning, Communication Style, Core Capabilities, Cross-Platform Integration, Decision Framework, Example Use Cases, Learning & Memory (+10 more)

### Community 110 - "Marketing Video Optimization Specialist Agent"
Cohesion: 0.11
Nodes (18): Algorithmic Optimization, Analytics & Monetization, Clickability Without Clickbait, Content & Visual Strategy, 🚨 Critical Rules You Must Follow, Marketing Video Optimization Specialist Agent, Retention First, Step 1: Research & Discovery (+10 more)

### Community 111 - "Product Feedback Synthesizer Agent"
Cohesion: 0.11
Nodes (18): Collection Strategy, Continuous Improvement, Core Capabilities, Customer Success Playbooks, Decision Framework, Delivery Formats, Executive Dashboards, Feedback Analysis Framework (+10 more)

### Community 112 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 113 - "Additional Skills (Software Engineering Lifecycle)"
Cohesion: 0.11
Nodes (18): Additional Skills (Software Engineering Lifecycle), Agent Routing Map, API & Interfaces, Claude Agent Router, Code Quality, Complex Task Escalation, Design, Development Workflow (+10 more)

### Community 114 - "Planning and Task Breakdown"
Cohesion: 0.11
Nodes (18): Common Rationalizations, Output Files, Overview, Parallelization Opportunities, Plan Document Template, Planning and Task Breakdown, Red Flags, See Also (+10 more)

### Community 115 - "Task List"
Cohesion: 0.11
Nodes (18): Architecture Decisions, Dependencies, Fase 0: Infraestrutura e Setup (Sprint 1), Fase 1: Sistema de Configuração e Templates (Sprint 1-2), Fase 2: Pipeline de Vídeo e Retry por Fase (Sprint 2-3), Fase 3: Interface Web e Dashboard (Sprint 3-4), Fase 4: Telegram Bot (Sprint 4), Fase 5: Sistema de Custo e Métricas (Sprint 4-5) (+10 more)

### Community 116 - "Test Automation Engineer"
Cohesion: 0.11
Nodes (17): 🚀 Advanced Capabilities, CI: Sharded, Traced, Merge-Blocking (GitHub Actions), 🚨 Critical Rules You Must Follow, Deterministic Playwright Test (No Sleeps, API Setup, Role Selectors), Flake Triage Table, Framework Depth, 🔄 Learning & Memory, Suite Operations at Scale (+9 more)

### Community 117 - "ReOrder: Keep Your Regulars Ordering Direct"
Cohesion: 0.11
Nodes (17): Example 1: Vague Early-Stage Concept (Full 3-Phase Session), Example 2: Feature Idea Within an Existing Product (Codebase-Aware), Example 3: Process/Workflow Idea (Non-Product), Ideation Session Examples, Key Assumptions to Validate, MVP Scope, Not Doing (and Why), Open Questions (+9 more)

### Community 118 - "Interview Me"
Cohesion: 0.11
Nodes (17): Common Rationalizations, Example, Interaction with Other Skills, Interview Me, Loading Constraints, Output, Overview, Red Flags (+9 more)

### Community 119 - "AI Citation Strategist"
Cohesion: 0.12
Nodes (15): Advanced Capabilities, AI Citation Strategist, Citation Audit Scorecard, Critical Rules You Must Follow, Entity Optimization, Fix Pack Template, Lost Prompt Analysis, Platform-Specific Patterns (+7 more)

### Community 120 - "Doubt-Driven Development"
Cohesion: 0.12
Nodes (15): Common Rationalizations, Cross-model escalation, Doubt-Driven Development, Interaction with Other Skills, Loading Constraints, Overview, Red Flags, Step 1: CLAIM — Surface what stands (+7 more)

### Community 121 - "Idea Refine"
Cohesion: 0.13
Nodes (14): Anti-patterns to Avoid, Detailed Instructions, How It Works, Idea Refine, Output, Phase 1: Understand & Expand (Divergent), Phase 2: Evaluate & Converge, Phase 3: Sharpen & Ship (+6 more)

### Community 122 - "Process"
Cohesion: 0.13
Nodes (14): 1. Define "working" before instrumenting, 2. Pick the right signal for each question, 3. Structured logging, 4. Metrics, 5. Distributed tracing, 6. Alerting, 7. Verify the telemetry itself, Common Rationalizations (+6 more)

### Community 123 - "Using Agent Skills"
Cohesion: 0.13
Nodes (14): 1. Surface Assumptions, 2. Manage Confusion Actively, 3. Push Back When Warranted, 4. Enforce Simplicity, 5. Maintain Scope Discipline, 6. Verify, Don't Assume, Core Operating Behaviors, Failure Modes to Avoid (+6 more)

### Community 124 - "Process"
Cohesion: 0.13
Nodes (14): 1. Define "working" before instrumenting, 2. Pick the right signal for each question, 3. Structured logging, 4. Metrics, 5. Distributed tracing, 6. Alerting, 7. Verify the telemetry itself, Common Rationalizations (+6 more)

### Community 125 - "ai-video-generator.js"
Cohesion: 0.20
Nodes (13): { createLogger }, OpenAI, path, { pathToFileURL }, Replicate, { runFFmpeg, checkFFmpeg, ffmpegInstallHint }, checkFFmpeg(), { execFile } (+5 more)

### Community 126 - "Spec-Driven Development"
Cohesion: 0.14
Nodes (13): Common Rationalizations, Keeping the Spec Alive, Overview, Phase 0: Scope Check, Phase 1: Specify, Phase 2: Plan, Phase 3: Tasks, Phase 4: Implement (+5 more)

### Community 127 - "Guia de Uso - YouTube Automation Agent"
Cohesion: 0.14
Nodes (13): 1. Primeira Execução, 2. Configuração de Provedores, 3. Criação de Templates, 4. Agendamentos, 5. Execução Manual, 6. Monitoramento, 7. Telegram Bot, 8. Limites de Custo (+5 more)

### Community 128 - "Spec-Driven Development"
Cohesion: 0.14
Nodes (13): Common Rationalizations, Keeping the Spec Alive, Overview, Phase 0: Scope Check, Phase 1: Specify, Phase 2: Plan, Phase 3: Tasks, Phase 4: Implement (+5 more)

### Community 130 - "Book Co-Author"
Cohesion: 0.15
Nodes (12): 1. Pressure-Test the Brief, 2. Define Chapter Intent, 3. Draft in First-Person Voice, 4. Run a Strategic Revision Pass, 5. Deliver the Revision Package, Book Co-Author, Critical Rules You Must Follow, Success Metrics (+4 more)

### Community 131 - "Source-Driven Development"
Cohesion: 0.15
Nodes (12): Common Rationalizations, Overview, Red Flags, Retrieval Safety: Treat Fetched Content as Data, Source-Driven Development, Step 1: Detect Stack and Versions, Step 2: Fetch Official Documentation, Step 3: Implement Following Documented Patterns (+4 more)

### Community 132 - "📸 Inclusive Visuals Specialist"
Cohesion: 0.17
Nodes (11): 🚀 Advanced Capabilities, 🚨 Critical Rules You Must Follow, Example Code: The Dignified Video Prompt, 📸 Inclusive Visuals Specialist, 🔄 Learning & Memory, 💭 Your Communication Style, 🎯 Your Core Mission, 🧠 Your Identity & Memory (+3 more)

### Community 133 - "Refinement & Evaluation Criteria"
Cohesion: 0.17
Nodes (11): 1. User Value, 2. Feasibility, 3. Differentiation, Assumption Audit, Core Evaluation Dimensions, Decision Framework, Might Be True (Nice to Have), Must Be True (Dealbreakers) (+3 more)

### Community 134 - "LinkedIn Content Creator"
Cohesion: 0.18
Nodes (10): 🚀 Advanced Capabilities, 🚨 Critical Rules You Must Follow, 🔄 Learning & Memory, LinkedIn Content Creator, 💭 Your Communication Style, 🎯 Your Core Mission, 🧠 Your Identity & Memory, 🎯 Your Success Metrics (+2 more)

### Community 135 - "ADR-001: Arquitetura Back4App + MongoDB"
Cohesion: 0.18
Nodes (10): ADR-001: Arquitetura Back4App + MongoDB, Alternativas Consideradas, Back4App, Consequências, Contexto, Data, Decisão, Railway (+2 more)

### Community 136 - "ADR-002: Multi-Provider com Fallback"
Cohesion: 0.18
Nodes (10): ADR-002: Multi-Provider com Fallback, Alternativas Consideradas, Circuit Breaker, Consequências, Contexto, Data, Decisão, Primary + Fallback (Escolhido) (+2 more)

### Community 137 - "ADR-003: Pipeline em Fases com Checkpoint"
Cohesion: 0.18
Nodes (10): ADR-003: Pipeline em Fases com Checkpoint, Alternativas Consideradas, Consequências, Contexto, Data, Decisão, Pipeline atômico, Pipeline paralelo (+2 more)

### Community 138 - "YouTube Automation Agent"
Cohesion: 0.18
Nodes (10): 🔧 Configuração, 📊 Dashboard, 📁 Estrutura do Projeto, Instalação, 📝 Licença, Pré-requisitos, 🚀 Quick Start, 🔒 Segurança (+2 more)

### Community 140 - "ADR-004: Templates como Snapshots"
Cohesion: 0.20
Nodes (9): ADR-004: Templates como Snapshots, Alternativas Consideradas, Consequências, Contexto, Data, Decisão, Referência dinâmica, Snapshot (Escolhido) (+1 more)

### Community 141 - "ADR-005: pt-BR como Idioma Padrão"
Cohesion: 0.20
Nodes (9): ADR-005: pt-BR como Idioma Padrão, Alternativas Consideradas, Consequências, Contexto, Data, Decisão, Inglês, pt-BR (Escolhido) (+1 more)

### Community 142 - "package.json"
Cohesion: 0.20
Nodes (9): ffmpeg-static, description, engines, node, main, name, optionalDependencies, ffmpeg-static (+1 more)

### Community 143 - "logger.js"
Cohesion: 0.22
Nodes (5): { createLogger }, path, sqlite3, createLogger(), winston

### Community 145 - "AGENTS.md"
Cohesion: 0.22
Nodes (7): Arquitetura, Comandos, Convenções, Entrypoint, Habilidades, Quirks críticos, Visão geral

### Community 146 - "Ideation Frameworks Reference"
Cohesion: 0.22
Nodes (8): Analogous Inspiration, Constraint-Based Ideation, First Principles Thinking, How Might We (HMW), Ideation Frameworks Reference, Jobs to Be Done (JTBD), Pre-mortem, SCAMPER

### Community 147 - "run.js"
Cohesion: 0.61
Nodes (7): assert, runTests(), testCost(), testErrors(), testPipeline(), testProviderSave(), testRetry()

### Community 148 - "Marketing Content Creator Agent"
Cohesion: 0.29
Nodes (6): Core Capabilities, Decision Framework, Identity & Role Definition, Marketing Content Creator Agent, Specialized Skills, Success Metrics

### Community 149 - "Marketing Growth Hacker Agent"
Cohesion: 0.29
Nodes (6): Core Capabilities, Decision Framework, Identity & Role Definition, Marketing Growth Hacker Agent, Specialized Skills, Success Metrics

### Community 150 - "devDependencies"
Cohesion: 0.29
Nodes (7): eslint, @eslint/js, nodemon, devDependencies, eslint, @eslint/js, nodemon

### Community 151 - "CLAUDE.md"
Cohesion: 0.33
Nodes (4): Architecture, Commands, graphify, Notes

### Community 152 - "API/Middleware Auth Considerations"
Cohesion: 0.33
Nodes (5): API/Middleware Auth Considerations, Metrics Endpoints, Observability Checklist, Pre-launch Instrumentation Gate, Testing Unauthenticated Access

### Community 153 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, dev, lint, setup, start, test

### Community 154 - "setup.js"
Cohesion: 0.33
Nodes (5): auth, { ConfigService }, express, rateLimit, router

### Community 155 - "captions.js"
Cohesion: 0.53
Nodes (5): addCaptionsToVideo(), buildCues(), formatTimestamp(), generateSRT(), { runFFmpeg }

### Community 156 - "retry.js"
Cohesion: 0.50
Nodes (3): retry(), RetryError, sleep()

### Community 157 - "Testes - Refatoração YouTube Automation Agent"
Cohesion: 0.50
Nodes (3): Cobertura, Executar testes, Testes - Refatoração YouTube Automation Agent

## Knowledge Gaps
- **2131 isolated node(s):** `idea-refine.sh script`, `idea-refine.sh script`, `express`, `path`, `helmet` (+2126 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ConfigService` connect `ConfigService` to `index.js`, `templates.js`, `dashboard.js`, `rateLimit.js`, `services/config.js`, `auth.js`, `execution.js`, `logs.js`, `setup.js`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `createLogger()` connect `logger.js` to `index.js`, `uploader.js`, `services/config.js`, `execution.js`, `ai-video-generator.js`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **Why does `AIVideoGenerator` connect `AIVideoGenerator` to `.generateSlideshowVideo`, `engine.js`, `ai-video-generator.js`, `logger.js`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **What connects `idea-refine.sh script`, `idea-refine.sh script`, `express` to the rest of the system?**
  _2131 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AIVideoGenerator` be split into smaller, more focused modules?**
  _Cohesion score 0.1476923076923077 - nodes in this community are weakly interconnected._
- **Should `index.js` be split into smaller, more focused modules?**
  _Cohesion score 0.1323529411764706 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._