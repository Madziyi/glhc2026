# Shared Agent Workflow

This is the default operating protocol for every AI runtime working on this repository.

## 1. GitHub sync preflight

Before repo-specific work:

```bash
git fetch origin
git status --short
git rev-parse HEAD
git rev-parse origin/main
```

Then:
- If the working tree is clean and `origin/main` is ahead, fast-forward.
- If local and remote diverged, stop and inspect deliberately.
- If the working tree is dirty, do not reset or overwrite it.
- Never use force push unless the human explicitly authorizes it for a specific reason.
- If remote state cannot be checked, say that the baseline is unconfirmed.

After syncing, reread the durable context files.

## 2. Read context in this order

1. `AGENTS.md`
2. `AGENT-WORKFLOW.md`
3. `PROJECT.md`
4. `NOW.md`
5. `TASKS.md`
6. `LIVE-STATE.md`
7. newest relevant `LOG.md` entries

Do not remap the entire repository by default. Explore only the subsystem needed for the active initiative.

## 3. Clarify before implementation

The planning agent should resolve material questions before coding.

A good plan records:
- goal;
- in-scope behavior;
- explicit non-goals;
- affected files/subsystems;
- data/API contracts;
- security constraints;
- ordered implementation steps;
- acceptance criteria;
- verification commands;
- risks/blockers;
- one next action.

If requirements materially change, update the plan before continuing.

## 4. One active initiative

`NOW.md` must contain exactly one active initiative.

Do not begin unrelated work while another initiative is active unless the human explicitly reprioritizes.

## 5. Bounded implementation

The implementation agent should:
- inspect only relevant files;
- make the smallest coherent change;
- avoid unrelated cleanup;
- preserve established contracts unless the plan explicitly changes them;
- add tests proportional to risk.

## 6. Verification

Use risk-proportionate verification.

Typical code/UI task:

```bash
npm test -- <relevant tests>
npx eslint <changed files>
npx tsc --noEmit -p tsconfig.json
npm run build
git diff --check
```

For UI work, also perform browser UAT at the relevant desktop and narrow/mobile widths.

For database/deployment work:
- apply the change deliberately;
- verify the live object directly;
- verify version/configuration;
- verify a safe invocation or query;
- update `LIVE-STATE.md` with exact observed facts;
- never record secret values.

A source file is not proof of deployment.

## 7. Failure budget

After two materially different focused attempts fail:
- stop;
- record exact evidence;
- list current hypotheses;
- state the decision/blocker required;
- do not keep circling.

## 8. Handoff

Every implementation pass ends with a handoff in this format:

```text
Task: <ID — goal>
Status: done | partial | blocked
Changed: <files/subsystems and behavior>
Decisions: <important contracts future agents must preserve>
Verification: <commands/checks + exact results>
Live state: <only if relevant>
Known issues: <risks, failures, or none>
Next action: <one concrete next step>
Commit: <sha if published>
```

Update `NOW.md`, `TASKS.md`, `LOG.md`, and `LIVE-STATE.md` as appropriate before the final commit/push.

## 9. Context ownership

Only one agent should own durable context at a time.

Recommended loop:

```text
Terra plans
   ↓
Terra commits/pushes plan OR gives Sol the approved plan
   ↓
Sol syncs main
   ↓
Sol implements + verifies
   ↓
Sol updates context + commits/pushes
   ↓
Human sends Sol handoff to Terra
   ↓
Terra resyncs main and reviews
   ↓
Terra closes, revises, or plans next task
```

If Terra implements directly, the same rule applies in reverse: Sol must sync before verification.

## 10. Live-state rule

Any action involving database schema, migrations, Edge/serverless functions, secrets, cron/schedulers, production/staging configuration, or external-provider deployment must update `LIVE-STATE.md` with verified facts.

Use secret names only, never values.

## 11. Completion standard

A task is complete only when:
- acceptance criteria are satisfied;
- relevant tests/checks pass;
- live state is verified if applicable;
- durable context is updated;
- the implementation and handoff are published;
- another agent can continue without rediscovering the work.
