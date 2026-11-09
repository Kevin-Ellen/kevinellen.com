# 🦆 KevinEllen.com

The source repository for [kevinellen.com](https://kevinellen.com), a personal wildlife and nature photography website featuring photographs, field journals, and observations from time spent outdoors.

The website is intentionally photography-first. This repository is public to make the implementation, infrastructure, and engineering decisions inspectable.

## What this repository contains

An edge-native publishing application built around:

- **Cloudflare Workers** — request handling and server-rendered responses
- **TypeScript and TSX** — application logic, typed content, and markup
- **Cloudflare KV** — published structured editorial content
- **Cloudflare Images** — image storage and delivery
- **SASS** — design tokens, layout, and modular component styles
- **Terraform and Spacelift** — reproducible infrastructure and execution workflow
- **Jest and React Testing Library** — validation of logic and rendered output
- **GitHub Actions** — code quality and build validation

The application favours deterministic output and separation of concerns over a heavyweight framework or GUI content-management system.

## Architecture at a glance

The application keeps authoring, request resolution, render preparation, and HTML generation distinct.

```text
Authored content / published content
                  │
                  ▼
       Application initialization
                  │
                  ▼
          Request resolution
                  │
                  ▼
         Render preparation
                  │
                  ▼
             TSX markup
                  │
                  ▼
         Cloudflare response
```

Published content belongs in KV; image binaries and variants belong in Cloudflare Images. The application code owns content types, routing, resolution, and rendering.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for boundaries and design decisions.

## Development

Install dependencies:

```bash
npm install
```

The previous repository exposed the following commands; confirm their presence in the current `package.json` before using them:

```bash
npm run dev
npm run validate
npm run content
```

Tests use Jest; lint, type checks, tests, and build validation belong in CI. Infrastructure deployment is handled through Terraform and Spacelift, not application CI.

## Content and publishing

Content is authored directly, validated against typed schemas, and published to KV. KV is a delivery layer, not a drafting system or relational database. Image assets are stored separately in Cloudflare Images, with their editorial metadata held in structured content.

There is deliberately no GUI CMS.

## Repository status and contributions

This is a personal project shared primarily for transparency and architectural reference. External pull requests are not currently accepted; see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Licence and credits

The software is released under the [MIT License](./LICENSE). Photography, editorial writing, branding, and other creative media remain © Kevin Ellen unless explicitly stated otherwise; the software licence does not grant rights to those works.

Third-party dependencies and services are documented in their respective manifests and configuration.

---

Small enough to understand. Structured enough to maintain. Hopefully with plenty of birds.
