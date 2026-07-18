# PerkCommons Data

The canonical, version-controlled public dataset behind PerkCommons. The site is
one consumer; anyone may reuse the published facts under CC0 1.0.

## Contribute

1. Copy `opportunities/_template.json` to `opportunities/<stable-id>.json`.
2. Use an immutable lowercase ID such as `provider-program`.
3. Cite the provider's official page wherever possible.
4. Run `npm ci && npm test`.
5. Open a pull request and explain the evidence checked.

Publication means that a reviewer found credible evidence on the stated review
date. It does not guarantee eligibility, acceptance, value, or continuing
availability.

See [CONTRIBUTING.md](CONTRIBUTING.md) and
[schema/opportunity.schema.json](schema/opportunity.schema.json).
