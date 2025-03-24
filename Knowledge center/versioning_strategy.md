# Versioning Strategy

## Git Branch Strategy
- **main**: Stable version of the game.
- **dev**: Development version with ongoing work.
- **feature/**: Feature-specific branches (e.g., `feature/enemies`).
- **hotfix/**: Emergency fixes for bugs on production (e.g., `hotfix/bug-fix`).

## Version Numbering Scheme
- **Major.Minor.Patch** (e.g., `1.0.0`)
  - **Major**: Large updates or breaking changes.
  - **Minor**: New features, improvements, and non-breaking changes.
  - **Patch**: Bug fixes and minor updates.

## Update Deployment Process
1. Merge feature branch into `dev` and test thoroughly.
2. Once verified, merge `dev` into `main` and tag the release (e.g., `1.1.0`).
3. Deploy the new build to production.

## Rollback Procedures
- If a new build causes issues, revert to the previous stable version on the `main` branch.
- Re-deploy the older version and investigate the bug.
