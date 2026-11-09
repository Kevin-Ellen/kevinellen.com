# Architecture

KevinEllen.com is a small, edge-native publishing application supporting a wildlife and nature photography website. Its architecture should stay understandable, reproducible, and intentionally separate from the editorial subject of the site.

This document describes the intended boundaries. Exact module names and command names must be checked against the current source tree as the rebuild progresses.

## Principles

- **Edge-first:** Cloudflare Workers is the application runtime, not an afterthought.
- **Strongly typed:** authored content, published content, and intermediate representations use explicit types and validation.
- **Deterministic:** page shapes and rendering behaviour are predictable and testable.
- **Separate responsibilities:** authored content, request resolution, render preparation, and markup do different jobs.
- **Minimal client runtime:** render on the server; add browser-side behaviour only when needed.
- **No GUI CMS:** content is authored and published through controlled tooling.
- **Infrastructure as code:** Terraform describes infrastructure and Spacelift executes the workflow.

## Ownership of data

| Concern | Owner |
| --- | --- |
| Routes, schemas, application logic, rendering | TypeScript codebase |
| Published journal entries, image metadata, featured selections, dynamic content | Cloudflare KV |
| Image binaries and delivery variants | Cloudflare Images |
| Workers, KV namespaces, bindings, routes, domains | Terraform |
| Infrastructure execution and review | Spacelift |
| Code quality and build validation | GitHub Actions |

KV is a published content store, **not** a relational database, a draft store, or an editorial workflow engine. Image metadata and image files are separate concerns.

## Request and rendering pipeline

Conceptually, the pipeline is:

```text
Authored definitions + published KV content
                    │
                    ▼
        Application initialization
                    │
                    ▼
           Request resolution
                    │
                    ▼
          Render-ready context
                    │
                    ▼
           TSX render layer
                    │
                    ▼
          Response construction
```

The rebuild has used the terms **App-Init**, **App-Resolve**, and **App-Render-Context (ARC)**. Treat these as distinct responsibilities; check current code for the authoritative types and implementation details.

### Authored content

Authored content describes editorial meaning: text, journal structure, image references, captions, subject information, and placement decisions. It should not contain HTML rendering mechanics, responsive `srcset` calculations, or environment-specific delivery URLs.

### Application initialization (App-Init)

Builds stable, typed application inputs from configuration and authored definitions. It may prepare registries and reusable definitions. It must not decide the final markup for a request.

### Request resolution (App-Resolve)

Resolves the requested resource or page, obtains relevant published content, and assembles the request-specific representation. Route and content resolution belong here rather than in TSX templates.

### Render-ready context (ARC)

Transforms resolved content into what templates need to render: formatted labels, image sources and dimensions, optional/visible states, document metadata, and the data required by layout components. It should not perform KV lookups or independently re-resolve routes.

### Render layer

TSX templates generate semantic HTML from render-ready input. They must not read KV, choose image delivery policies, interpret content references, or implement routing and fallback logic. Server-side rendering does not imply client-side hydration.

### Response boundary

The Worker response boundary owns HTTP response construction, including status, headers, and body. Non-page responses do not need to pass through TSX rendering.

## Render classes

**Bundled static rendering** is appropriate for stable content that can deploy with code: legal, fallback, or error pages.

**Request-composed rendering** is appropriate where routing, KV data, entity resolution, or aggregation determines the page: the homepage, journal entries and listings, topic listings, photography pages, and galleries.

The **homepage is always request-composed**. Avoid mixing bundled and KV-owned content without a clear ownership decision.

## Resource endpoints

Distinguish **pages** from **non-page resources**. A page such as `/about` belongs to page resolution; resources such as `/robots.txt` belong to response-oriented resource handling. Worker-generated resources should have explicit dispatch and response policies rather than accumulating special cases in the main request handler.

This is a design boundary, not a claim that a particular resource registry has already been implemented. Bundled CSS, fonts, and images should not be forced through Worker-generated resource handlers.

## Content and media

1. Author structured content manually.
2. Validate it against the project's typed schemas.
3. Publish the approved content into KV.
4. Resolve the published content per request.
5. Prepare image delivery details in the render-ready context.
6. Produce semantic markup with TSX.

Cloudflare Images stores binary files and variants; KV holds editorial metadata such as subject, caption, location, and context. Do not couple editorial records to presentation-specific image delivery decisions.

## Styling

SASS provides design tokens, layouts, and modular component rules. The styling system should support photography-led editorial layouts without introducing an unnecessary utility framework. Prefer meaningful component boundaries and consistent naming over one-off overrides.

## Testing and CI

Jest and React Testing Library cover rendering, conditional output, content mapping, resolvers, and utilities. The tests should reinforce layer boundaries as well as observable behaviour.

GitHub Actions runs validation: linting, type checks, tests, and build checks, as configured in the repository. Deployment remains infrastructure-driven through Terraform and Spacelift. Cloudflare provider versions should be pinned and manual dashboard drift avoided.

## Guardrails

- **Render** does not fetch data, resolve routes, or interpret authored meaning.
- **ARC** does not query KV or perform route lookup.
- **Request resolution** does not generate final HTML.
- **KV** does not become an editorial CMS or relational model.
- **Image storage** does not become the authoritative source for editorial metadata.
- **Terraform** remains the source of truth for supported infrastructure resources.
- **GitHub Actions** validates application changes; it does not silently replace the infrastructure deployment workflow.

Move a decision to the **earliest responsible layer**, not simply the earliest possible layer.

## Intentional scope

This is not a reusable CMS, a universal rendering framework, or a large-scale distributed platform. The goal is a personal website with clearly owned data, predictable output, and a codebase that remains pleasant to maintain.
