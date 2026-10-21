# Live Infrastructure

As of 2026-10-20/21, source GLHC-001/GLHC-002R6 is merged to main via PR #1 (`1524431cc33723bfeb063ac96fededfb77f575dc`). GLHC-003 is implemented separately on `feat/glhc-003-storytelling`, based on organizer setup commit `0ae92345220313fa9132639d4d82f47a76c85aa5`.

- Local source `/` contains the complete student-first GLHC-003 story. This is not proof of a public deployment.
- `/prototype/glhc-002` is retained as the R6 regression reference.
- Local production preview used for UAT: `http://127.0.0.1:4334`.
- Official supplied Luma destination: `https://luma.com/pz0iw2m7`. Browser link checks reached “Great Lakes Hackathon Challenge · Luma” with a new tab and no opener. No form submitted; event dates, fees and current registration availability are not asserted.
- Hosting/public site URL: not verified. No GLHC-003 merge or deployment performed.
- No database, authentication provider, payment service, secrets or new production infrastructure configured.
- Physical-mobile GPU, representative network and 10-second readiness target remain unverified.
- Supplied image publication rights remain a launch check.

See `docs/GLHC-003-UAT.md` for local production evidence and limitations.
