# Working Protocol

1. Sync repo state (`git fetch origin`, `git status --short`, `git rev-parse HEAD`, `git rev-parse origin/main`), check for conflicts or dirty files; never reset/force-push someone's work.
2. Read `AGENTS.md`, `PROJECT.md`, `NOW.md`, `TASKS.md`, latest `LOG.md` entries, `LIVE-STATE.md`.
3. Work on exactly one active task; respect non-goals and one writer for durable files.
4. Verify code changes proportionally (`npm test`, `npm run build`, lint/types where available). For UI, use the real browser at multiple breakpoints and collect screenshots.
5. Do not infer successful deployment from source. No secrets in commits/logs.
6. Record accurate outcomes in NOW/TASKS/LOG/LIVE-STATE and provide commit SHA and one next action.
