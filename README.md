# Miguel Bogota Dev API

A centralized content repository that serves as the source of truth for my portfolio projects. Projects are authored as Markdown, validated at build time, and published as a lightweight JSON metadata index that multiple portfolio applications can consume.

## How it works

Each project lives in `projects/<id>.md` and contains two parts:

1. YAML frontmatter with the structured metadata used by portfolio cards, filters, and sorting.
2. A Markdown body with the complete project story, available to project detail pages.

Running the build reads every Markdown file, validates its frontmatter with Zod, applies the portfolio sorting rules, and generates `index.json`. The Markdown body is intentionally excluded from the generated index.

```text
projects/*.md
      │
      ├─ @11ty/gray-matter parses metadata and content
      ├─ Zod validates project metadata
      ├─ Existing portfolio sorting is applied
      │
      └─ index.json contains metadata for every project
```

## Setup

Install the project dependencies:

```bash
npm install
```

The npm `prepare` script installs the Husky Git hook automatically.

## Adding or editing a project

Create or update a Markdown file inside `projects`. The filename must match its frontmatter `id`:

```text
projects/mercadolibre-summary.md
         └───────┬──────────┘
                 id: mercadolibre-summary
```

A project follows this format:

```md
---
id: 'example-project'
startedAt: '2026-01-01'
endedAt: null
isCurrent: true
isArchived: false
aggregate: false
displayName: 'Example Project'
summary: 'A short description used by project cards and previews.'
role: 'Senior Software Engineer'
companyName: 'Personal Project'
industry: 'Software Development'
tags:
  - 'React'
  - 'TypeScript'
images:
  - src: 'https://example.com/project.png'
    alt: 'Example project interface'
links:
  - label: 'Source code'
    icon: 'bx bxl-github'
    url: 'https://github.com/example/project'
---

## Challenge

Explain the problem, constraints, and context behind the project.

## Solution

Explain the implementation, architectural decisions, tradeoffs, and outcome.
```

Use empty arrays when a project has no images or links:

```yaml
images: []
links: []
```

### Required metadata

Every project must define the same metadata fields:

- `id`: lowercase letters, numbers, and hyphens; must match the filename.
- `startedAt`: start date using `YYYY-MM-DD`.
- `endedAt`: end date using `YYYY-MM-DD`, or `null` for ongoing work.
- `isCurrent`: whether the project belongs to the current professional experience.
- `isArchived`: whether the project should be treated as archived.
- `aggregate`: whether related projects should be grouped by their ID prefix.
- `displayName`: user-facing project name.
- `summary`: short preview shown before opening the full project.
- `role`: role held during the project.
- `companyName`: company or organization associated with the project.
- `industry`: project industry or category.
- `tags`: non-empty list of technologies and relevant keywords.
- `images`: project gallery entries containing a valid `src` URL and accessible `alt` text.
- `links`: external resources containing a `label`, icon class, and valid URL.

The runtime schema lives in `types/project.js`. The corresponding consumer declaration lives in `types/project.d.ts`.

## Building the index

Generate `index.json` with:

```bash
npm run build
```

The build performs these steps in order:

1. Reads every `projects/*.md` file.
2. Separates YAML frontmatter from Markdown content.
3. Calls `validateProjects()` before processing any metadata.
4. Stops with simple `filename: field - message` errors when metadata is invalid.
5. Sorts all validated projects using the existing portfolio ordering.
6. Writes metadata only to `index.json`.

The build also rejects duplicate IDs and IDs that do not match their Markdown filename.

### Sorting behavior

Projects are sorted using these rules:

1. Projects with `aggregate: true` are grouped by the first segment of their ID.
2. Groups containing a current project appear first.
3. Groups containing ongoing work appear next.
4. Groups are ordered by their latest start date.
5. Ongoing projects appear first within a group.
6. Remaining projects are ordered by start date, newest first.

## Pre-commit workflow

Husky runs `scripts/pre-commit.js` before every commit. The script builds an isolated snapshot of the staged project, script, and type files so partially staged work is handled correctly.

The hook:

- Refuses to overwrite unstaged changes in `index.json`.
- Builds from staged Markdown and source files.
- Validates projects before generating the index.
- Copies the generated `index.json` back into the repository.
- Stages `index.json` as part of the same commit.
- Blocks the commit when parsing, validation, or generation fails.

When manually running `npm run build`, remember to stage the updated `index.json` before committing.

## Consuming the metadata

Portfolio applications can load all project previews from the generated index:

```js
const response = await fetch(
  'https://miguelbogota.github.io/miguelbogotadev-api/index.json',
);

const projects = await response.json();
```

The index includes the full validated frontmatter for each project but does not include its Markdown body. A project source can be fetched separately when a detail page needs the long-form content:

```js
const response = await fetch(
  'https://miguelbogota.github.io/miguelbogotadev-api/projects/mercadolibre-summary.md',
);

const markdown = await response.text();
```

## Project structure

```text
.
├── .husky/
│   └── pre-commit
├── projects/
│   └── *.md
├── scripts/
│   ├── build.js
│   ├── constants.js
│   ├── pre-commit.js
│   ├── project-reader.js
│   └── project-validator.js
├── types/
│   ├── project.d.ts
│   └── project.js
├── index.json
└── package.json
```

## Main dependencies

- [`@11ty/gray-matter`](https://github.com/11ty/gray-matter) parses YAML frontmatter and separates it from Markdown content.
- [`zod`](https://zod.dev/) validates project metadata before it reaches the generated index.
- [`husky`](https://typicode.github.io/husky/) keeps the generated index synchronized during commits.

Publishing continues through the repository's existing GitHub Pages workflow. Once a change is published, portfolio applications can consume the updated index and Markdown project sources.
