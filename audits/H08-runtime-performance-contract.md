# H08 — Performance and Worker Runtime Hygiene

**Purpose:** Identify measurable request-path inefficiencies, Worker incompatibilities, and operational cache correctness risks without speculative optimization or new infrastructure.

## Expected contract

| Concern | Contract |
|---|---|
| Request retrieval | Routing and App-Resolve own storage reads. Repeated reads of the same key within one request need a reason. |
| Content composition | App-Resolve composes published content; ARC prepares deterministic render data; React SSR presents it. |
| KV semantics | Published KV is the content source; no assumption of immediate cross-location consistency after publication. |
| Caching | Cache keys distinguish meaningful variants and exclude arbitrary query parameters. Freshness and invalidation follow a documented publication policy. |
| Media | Cloudflare Images owns binaries; the media Worker owns variant delivery and best-effort response caching. Failed upstream responses must not become successful cached content. |
| Runtime compatibility | Worker-reachable runtime code uses Workers-compatible APIs and configured bindings. Publishing CLI remains Node-only and outside the Worker bundle. |
| Bundle | Build output is measured using the real build process; no conclusions about bytes or cold starts from source-file count alone. |
| Observability | Performance conclusions use measured request traces, relevant metrics, or demonstrable correctness risks. |

## Review sequence

1. Run `node audits/run-h08-audit.cjs` and classify its findings and observations.
2. Trace one normal homepage request and one published journal request through routing, App-Resolve, ARC and SSR. Identify repeated KV reads, duplicate photo reads, and work independent of the request.
3. Inspect media caching and HTML/XML caching. Document key dimensions, cache-control values, error behaviour and freshness expectations for published content.
4. Inspect the actual Worker build configuration and generated artifacts for unexpected Node dependencies, CLI tooling and large dependencies.
5. Apply targeted fixes only for verified operational costs or correctness issues; add targeted Jest tests if behaviour changes.

## Acceptance

- Reviewed request path and Worker bundle with evidence.
- Caching and published-content freshness expectations recorded.
- Every actionable finding resolved, or an intentional exception documented with rationale.
- TypeScript, lint and targeted Jest suites pass after any remediation.
- No new performance framework, infrastructure, or speculative memoisation introduced.

**Note:** The AST audit is a discovery tool, not a benchmark or certification of Worker compatibility.
