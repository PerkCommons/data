# PerkCommons data repository migration record

The experimental fork phase ended on 2026-10-06. The canonical data repository
is now <https://github.com/PerkCommons/data>.

The official `main` branch was fast-forwarded to
`56b4ea62db2977c2d83b638b0b59ebb702a0d87b`, the previously verified
`CodWasTaken/data` head. The official branch was a strict ancestor, so the
migration preserved the complete history without a force push or rewritten
commits.

The personal `CodWasTaken/data` fork remains available as a historical
fork-network reference, but it is no longer the canonical publication, build,
or release source. Local clones should use `PerkCommons/data` as `origin`;
a separate `fork` remote may fetch the personal fork with its push URL
disabled.

## Current safety commitments

- Publication automation targets reviewed branches and pull requests in
  `PerkCommons/data`.
- Site releases pin an exact 40-character data commit SHA.
- Production credentials remain in protected platform secrets and are never
  copied into repository files, logs, fixtures, screenshots, or documentation.
- Historical fork-era documents may retain the old repository names when they
  describe the state that existed at the time.
