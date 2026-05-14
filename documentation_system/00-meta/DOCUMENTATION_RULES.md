# DOCUMENTATION RULES

## Principle

Documentation is part of the product system, not an afterthought.

Every meaningful change in:
- architecture,
- product logic,
- pricing,
- AI behavior,
- research findings,
- workflows,
must update corresponding documentation.

## Rules

1. No undocumented architectural decisions
2. Every feature has:
   - owner
   - status
   - dependencies
3. Deprecated files are archived, never deleted
4. Research findings must reference source interviews
5. Canonical documents override all conflicting notes
6. AI-generated code must reference current architecture docs
7. All major decisions require ADR