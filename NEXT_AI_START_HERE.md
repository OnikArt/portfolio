# ONIKART — NEXT AI START HERE

Read `AI_HANDOFF.md` and `AI_HANDOFF.json` first, then run `git status` and the standard checks. Do not expose or commit credentials.

## Current verified state

- Production navigation workaround is stable: native anchors avoid the confirmed Vinext beta.5 `next/link` production failure.
- Mobile menu close control passes at 320×568, 360×640, 375×667, 390×844, 414×896, and 430×932.
- Mobile close paths pass: tap X, Escape, navigation link, focus return, body lock/unlock, chat suppression, and horizontal containment.
- Typecheck, 9/9 tests, lint (three image warnings), production build, production health/DB, the shared Fasadof accordion, and the Work Formats anchor pass.
- Read section 26 of `AI_HANDOFF.md` for the 2026-09-19 implementation and exact blockers.

## Start here

The project is not VPS-ready. Resolve P0 items before cosmetic expansion:

1. Implement database-backed users, roles, permissions, team, profile, and owner lockout protections.
2. Finish the remaining public/admin single source work: contacts, homepage/case copy, project blocks beyond system items, settings, media and complete CRUD.
3. Replace incomplete privacy/legal copy only after approved operator, retention, and consent details are supplied.
4. Replace the invalid configured Telegram token and run real event E2E; obtain owner login credentials securely and run login/session/restart E2E.
5. Implement a real VPS persistence adapter (the current runtime is D1/R2; `DATABASE_URL` is not wired), then complete chat/live delivery, weather persistence, security tests, and the full browser/responsive matrix.

Preserve the invariants and unresolved issue list in `AI_HANDOFF.md`. Do not claim VPS readiness while any P0 remains.
