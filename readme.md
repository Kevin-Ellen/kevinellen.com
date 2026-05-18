# 🦆 KevinEllen.com

_A small edge-native platform for wildlife photography, technical writing, and overly complicated thoughts about birds._

---

## 🪶 What is this?

Personal website and publishing platform built on:

- Cloudflare Workers
- Cloudflare KV
- Cloudflare Images
- TypeScript
- Terraform
- SASS
- TSX server-side rendering

The project intentionally avoids:

- heavyweight CMS platforms
- client-side hydration
- framework sprawl
- unnecessary runtime complexity

Everything is designed around deterministic rendering, authored content, and edge delivery.

Like a kingfisher: small, fast, and occasionally difficult to track.

---

## 🌿 Project philosophy

This repository is intentionally transparent.

It contains:

- rendering architecture
- infrastructure definitions
- content pipeline tooling
- testing strategy
- styling system
- publishing flow

The goal is not to build “the next platform”.

The goal is to build:

- a calm
- maintainable
- edge-native
- personal system

that can evolve slowly over time without collapsing under its own abstraction layers.

---

## 🏗️ Architecture

High-level flow:

```txt
Authored Content
    ↓
AppState
    ↓
AppContext
    ↓
AppRenderContext
    ↓
TSX Render Layer
    ↓
Cloudflare Worker Response
```

Key principles:

- Render layer stays dumb
- Content remains strongly typed
- Request composition happens before rendering
- KV stores published structured content
- Images and metadata remain separate concerns

---

## ⚡ Features

- Edge-rendered TSX templates
- Typed content pipeline
- KV-backed dynamic content
- Responsive Cloudflare Images delivery
- Deterministic render architecture
- SCSS token system
- Terraform-managed infrastructure
- CI validation
- Photography-heavy editorial workflows
- Probably too many coot photos

---

## 🛠️ Development

Install dependencies:

```bash
npm install
```

Start local development:

```bash
npm run dev
```

Run validation:

```bash
npm run validate
```

Run the content CLI:

```bash
npm run content
```

---

## 📜 Licensing

Source code is licensed under the MIT License.

Photography, written content, branding, and media assets remain © Kevin Ellen unless otherwise stated.

---

## 🤝 Contributions

This repository is published primarily for transparency and architectural reference.

External contributions are not currently being accepted.

---

## 🧭 Credits & external services

This project uses:

- [Font Awesome](https://fontawesome.com/) for iconography
- [OpenStreetMap Nominatim Reverse Geocoding API](https://nominatim.openstreetmap.org/ui/search.html) for location and timezone enrichment support
- Cloudflare Workers, KV, and Images for edge infrastructure
- Additional tooling and dependencies can be found in [`package.json`](./package.json)

---

## 🐦 Final note

If you are here looking for:

- perfect abstractions
- trendy framework discourse
- twelve layers of hydration

you may be in the wrong marshland.

If you like:

- typed systems
- calm architecture
- birds
- edge runtimes
- deterministic rendering

welcome aboard.
