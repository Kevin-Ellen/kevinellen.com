# Architecture

KevinEllen.com is a small, edge-native personal publishing platform.

It is designed to support wildlife photography, technical writing, journal content, and transparent engineering without becoming a heavy CMS or framework-driven application.

The core goal is simple:

> keep authored content, request resolution, render preparation, and final markup generation clearly separated.

Like a decent bird hide, the structure should quietly do its job without getting in the way of the thing you came to see.

---

## 🧭 Architectural principles

This project is built around a few non-negotiable ideas:

- Cloudflare Workers first
- strongly typed content shapes
- deterministic rendering
- clear separation of concerns
- no unnecessary client-side hydration
- no GUI CMS
- no business logic in the render layer
- infrastructure managed through Terraform
- published content stored in Cloudflare KV
- binary media delivered through Cloudflare Images

The site is intentionally small, but not casual.

It is a personal platform, not a disposable website.

---

## 🏗️ High-level flow

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

Each layer has a specific responsibility.

Data should move forward through the pipeline.

Later layers should not reach backwards into earlier concerns.

---

## ✍️ Authored content

Authored content is the source material for the site.

This can include:

- journal entries
- notes
- photo metadata
- image references
- page definitions
- featured lists
- structured editorial content

Authored content should remain clear, intentional, and strongly shaped.

It should not contain render-specific decisions unless those decisions are genuinely editorial.

For example:

Good authored data:

```txt
This photo belongs in the homepage strip.
```

Bad authored data:

```txt
This image should render with this exact srcset and layout behaviour.
```

Authored content describes meaning.

It should not control low-level rendering mechanics.

---

## 🗃️ AppState

AppState represents the deterministic application state.

It is where authored or published data becomes normalised into stable internal structures.

AppState is responsible for:

- loading known page definitions
- representing site configuration
- exposing content registries
- preserving deterministic content shapes
- keeping published content predictable

AppState should not know about the current request beyond what is required to build the application state.

It should not perform final render shaping.

It should not decide visible layout output.

It should not contain TSX or markup concerns.

AppState is the organised pond.

Nothing should be splashing around randomly in here.

---

## 🧠 AppContext

AppContext is request-aware.

This is where the site resolves what a specific request needs.

AppContext is responsible for:

- route-aware page resolution
- request-composed page content
- resolving dynamic pages from KV
- merging static and KV-backed page registries
- resolving internal references
- applying page-level context
- preparing content for render shaping

Typical AppContext work includes:

- resolving a journal page by slug
- resolving a note page by slug
- composing homepage content from featured KV entries
- mapping page definitions into request-specific content
- handling fallback behaviour before render preparation

AppContext may know that a request is for `/journal/example`.

It may resolve which content belongs to that page.

It should not decide final image `srcset`, formatted date labels, or markup structure.

---

## 🎛️ AppRenderContext

AppRenderContext, often shortened to ARC, is the render-ready layer.

This is the final preparation stage before TSX rendering.

ARC is responsible for turning resolved content into exactly what the render layer needs.

This includes:

- formatted dates
- final metadata labels
- resolved image delivery data
- image `src`, `srcset`, `sizes`, width, height, and aspect ratio
- final visible or null render states
- response policy
- document head data
- body header data
- body content data
- footer data
- scripts and styles required by the document

ARC is allowed to make presentation-facing decisions.

The render layer should not need to infer them.

For example, Render should receive:

```txt
publishedLabel: "18 May 2026"
```

not:

```txt
publishedAt: "2026-05-18"
```

and then format it itself.

ARC is the last responsible adult before markup happens.

---

## 🖨️ Render layer

The render layer is intentionally dumb.

It receives render-ready data and produces markup.

It is built with TSX and rendered through `renderToStaticMarkup`.

There is no client-side hydration.

Render is responsible for:

- document templates
- page templates
- block templates
- shared render components
- semantic HTML output
- consistent class naming
- structured markup

Render is not responsible for:

- reading KV
- resolving routes
- resolving slugs
- formatting dates
- choosing image variants
- looking up page config
- applying business rules
- deciding fallback behaviour
- interpreting authored content

If Render has to ask “what does this mean?”, the wrong layer is doing the work.

Render should only ask:

> how do I print this?

---

## 🧱 Content model

The site uses structured content blocks rather than arbitrary markup blobs.

Content types include areas such as:

- journal content
- notes
- photography pages
- homepage modules
- article sections
- image-led modules
- metadata groups

Content shapes should be:

- typed
- predictable
- explicit
- composable
- easy to validate

Dynamic page shapes should remain deterministic.

A page can be composed from KV content, but its structure should still be knowable and testable.

This avoids turning KV into a loose database or a hidden CMS.

---

## 🪣 Cloudflare KV

Cloudflare KV is used as a published content layer.

It stores structured content that has already passed through the authoring and publishing process.

KV may contain:

- journal entries
- notes
- photo metadata
- page registry entries
- featured content lists
- dynamic page content

KV should not be treated as:

- a relational database
- an editorial workflow system
- a draft CMS
- a place for arbitrary mutable application state

Content should be authored, validated, published, and then read predictably.

KV is the shelf, not the workshop.

---

## 🖼️ Cloudflare Images

Cloudflare Images handles binary media storage and delivery.

Image responsibilities are deliberately split:

```txt
Cloudflare Images → binary image storage and variants
KV                → editorial image metadata
ARC               → render-ready delivery shape
Render            → final image markup
```

This separation matters.

Image metadata such as subject, caption, location, species, and editorial context belongs in structured content.

The image file itself belongs in Cloudflare Images.

The final render delivery decision belongs in ARC.

The final `<img>` markup belongs in Render.

No single layer should secretly do all four jobs.

That way madness lies, and probably a slightly over-sharpened coot.

---

## 🧭 Rendering classes

The site has two broad render classes.

### Bundled static render

Used when content is stable and does not need runtime lookup.

Typical examples:

- legal pages
- fallback pages
- error pages
- static explanatory pages

These can deploy with the codebase.

### Request-composed render

Used when content depends on KV, routing, aggregation, or entity resolution.

Typical examples:

- homepage
- journal pages
- notes
- photography pages
- galleries
- listing pages

The homepage is always request-composed.

This distinction keeps the system honest.

Not everything needs KV.

Not everything should be bundled.

---

## 🎨 Styling architecture

Styling is handled with SASS.

The styling system is designed around:

- design tokens
- modular components
- shell/layout structure
- brand-aware configuration
- readable SCSS organisation
- accessibility-aware colour decisions

The goal is not to create a utility-class framework.

The goal is to maintain a visual system that supports editorial storytelling, photography, and technical clarity.

Sharp edges are welcome.

Unnecessary shadows are not invited.

---

## 🧪 Testing strategy

Testing focuses on confidence in boundaries and output.

The project uses:

- Jest
- React Testing Library where useful
- render tests
- resolver tests
- utility tests
- content mapping tests
- validation tests

Tests should protect:

- rendering output
- content transformations
- resolver behaviour
- conditional output
- boundary responsibilities
- regression-prone templates

Coverage is treated as a design signal.

If something is painful to test, the code may be carrying too much responsibility.

---

## 🚀 Infrastructure

Infrastructure is managed with Terraform.

Terraform owns:

- Cloudflare Workers
- KV namespaces
- bindings
- routes
- domains
- related Cloudflare configuration

Spacelift is used for Terraform execution and workflow alignment.

Manual dashboard drift should be avoided.

Infrastructure should be reproducible, reviewable, and boring in the best possible way.

---

## 🔁 CI and validation

GitHub Actions validates the codebase.

The validation flow includes:

- formatting checks
- Terraform formatting checks
- linting
- style linting
- TypeScript checks
- tests
- build validation

Deployment remains infrastructure-driven rather than hidden inside the application build.

The repository should fail loudly before production does.

---

## 🐦 Why no heavy CMS?

This site does not use a GUI CMS by design.

The content model is author-driven.

Content is written manually, validated, and published into KV.

That gives the project:

- simpler infrastructure
- stronger content shapes
- fewer moving parts
- better architectural transparency
- more control over editorial structure

The aim is not to make publishing effortless for everyone.

The aim is to make publishing controlled, predictable, and pleasant for the person who owns the site, especially when uploading content from a hide, a train, or a mountain somewhere with questionable signal.

---

## 🧯 Boundary rules

These rules protect the architecture from slow erosion.

### Render must not

- read KV
- resolve routes
- format business data
- infer missing content
- choose image delivery policy
- inspect authored fallback rules
- perform application logic

### ARC must not

- read directly from KV
- perform route lookup
- mutate authored content
- act as a database access layer

### AppContext must not

- emit final markup
- decide low-level image markup
- behave like Render
- hide presentation formatting inside route logic

### KV must not

- become a relational database
- become a draft CMS
- hold unclear mixed-responsibility blobs

### Authored content must not

- smuggle render implementation details into editorial structures
- depend on runtime-only behaviour
- become impossible to validate

When in doubt, move the decision to the earliest responsible layer.

Not the earliest possible layer.

The earliest responsible one.

---

## 🧩 Dependency philosophy

Dependencies are chosen carefully.

The project favours:

- boring tools
- clear responsibilities
- strong typing
- explicit build steps
- minimal runtime magic

It avoids adding packages simply to avoid writing small, understandable code.

A dependency should either:

- provide a meaningful capability
- reduce operational risk
- improve correctness
- improve maintainability

Otherwise, it can stay outside the nest.

For the full dependency list, see [`package.json`](./package.json).

---

## 🦆 Final thought

This architecture is intentionally modest.

It is not trying to be a universal framework.

It is a small, disciplined, edge-native personal platform with typed content, clear infrastructure, and enough personality to make the codebase feel alive.

The best version of this system should feel like good wildlife photography:

patient, structured, observant, and ready when something interesting happens.
