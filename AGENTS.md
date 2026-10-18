# Agent Entry Point

This repository uses a shared-context workflow so multiple AI runtimes can work on the same project without losing decisions, duplicating discovery, or overwriting each other.

## Read this first

Before planning, coding, database work, deployment work, or substantial review:

1. Sync with GitHub `main`.
2. Read:
   - `AGENT-WORKFLOW.md`
   - `PROJECT.md`
   - `NOW.md`
   - `TASKS.md`
   - `LIVE-STATE.md`
   - the newest relevant entries in `LOG.md`
3. Inspect only the files needed for the active task.
4. Confirm the active initiative in `NOW.md` before editing.

GitHub `main` is the shared source of truth after reviewed changes are merged between agents.

## Roles

### Terra — planner / architect / reviewer
Terra owns:
- requirements clarification;
- architecture and implementation planning;
- research and tradeoff analysis;
- sequencing work;
- defining acceptance criteria;
- reviewing implementation handoffs;
- deciding whether verification is sufficient;
- maintaining durable project context when Terra is the active writer.

Terra may implement bounded changes when appropriate, but must not claim local tests, browser UAT, or deployment verification that were not actually run.

### Sol — implementation / verification agent
Sol owns:
- local repository execution;
- targeted code exploration;
- implementation of the approved scope;
- tests, lint, type checking, builds, browser checks, and local debugging;
- deployment/database actions when authorized;
- exact verification evidence;
- updating durable context at the end of the implementation pass;
- committing and pushing the verified handoff to `main`.

## One-writer rule

Do not let Terra and Sol edit the same durable context files concurrently.

The agent actively executing a task owns the context files until that task is committed and pushed. The other agent must then resync from `main` before continuing.

## Durable context files

- `PROJECT.md` — stable project purpose, architecture, constraints, stack, and long-lived decisions.
- `NOW.md` — exactly one active initiative, current state, scope, decisions, blockers, verification boundary, and one next action.
- `TASKS.md` — prioritized backlog and task statuses.
- `LIVE-STATE.md` — verified facts about deployed infrastructure, databases, environments, cron jobs, functions, secrets-by-name, and current live versions. Never store secret values.
- `LOG.md` — append-only concise history of meaningful planning, implementation, decisions, failures, and verification.
- `AGENT-WORKFLOW.md` — operating protocol shared by all agents.

## Core rules

- Never treat an authored migration, function, config file, or deployment script as proof that it is live.
- Never commit secrets, raw credentials, private keys, access tokens, or sensitive user/customer data.
- Do not silently broaden scope.
- After two materially different failed approaches, stop and record evidence, hypotheses, and the decision needed.
- Do not force-push or reset away another agent's work.
- Every completed task ends with verification evidence and a durable handoff.
