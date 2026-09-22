# Miguel Bogota Dev API

A centralized data repository serving as the single source of truth for portfolio, project, and professional experience information. This repository enables multiple portfolio frontends and applications to consume consistent, well-structured project data through a unified API and aggregated index.

## 🎯 Purpose

This repository solves a critical problem: **data inconsistency across multiple portfolio applications**.

Previously, project information was duplicated across different portfolio versions (v1, v2, v3), causing synchronization issues and making updates a nightmare. When a project changed, you'd need to update it in multiple places.

**Solution**: Build a single source of truth where all portfolio data lives, versioned and structured, with a simple aggregation pipeline that keeps everything synchronized.

---

## ⚡ Quick Start: Development Workflow

### Step 1: Add or Modify a Project/Content

Create or edit a JSON file in `/projects` following the defined schema. For example:

```json
{
  "$schema": "../types/project-schema.json",
  ...
}
```

### Step 2: Enable the automatic build (once per clone)

With Node.js installed, configure the tracked Git hook:

```bash
git config core.hooksPath .githooks
```

### Step 3: Commit and Push

```bash
git add projects/ content/ types/
git commit -m "Add/update project: my-project"
git push
```

Before each commit, the hook runs the staged `scripts/build.js` against staged project data, then stages the resulting `index.json` in the same commit. No extra commit or amend is needed. A build failure blocks the commit. Partially staged source files are supported: unstaged edits stay out of the generated index. If `index.json` itself has unstaged edits, stage or restore it first; the hook will not overwrite them. The hook requires Node.js on PATH and must be enabled separately in each clone.

For a local preview, you can still run `node scripts/build.js` manually. Stage the generated `index.json` before committing if you do so.

The hook also runs for content-only or documentation commits. Wording changes in `projects/*.json` update the generated index. General site copy in `content/v03.json` is served directly, so those changes are committed normally and do not change the project index. If the generated index is identical, Git adds no extra file change.

Publishing still follows the existing production-branch GitHub Pages setup. Once the updated index is published, portfolio frontends consume the new data.

### Project content conventions

Each project uses the existing JSON schema, including summary, role, technology tags, challenge, solution, images, and links. The six projects added in September 2026 use repository creation dates as start-date estimates (LINE53 uses the first commit available in its local checkout). Their descriptions are based on repository READMEs and source; LINE53 was inspected locally because GitHub returned 404. `isCurrent` remains reserved for the existing featured project. New entries use `aggregate: false` so personal projects remain individually visible.

Screenshot galleries are empty until real project screenshots are available. The portfolio supports these entries without rendering an empty gallery. Deploy that frontend change before publishing entries with empty `images` arrays.

---

## 🎯 Consuming the Data

Frontend and Node applications can now read all projects from a single file:

```javascript
const res = await fetch(
  'https://miguelbogota.github.io/miguelbogotadev-api/index.json',
);
const projects = await res.json();
console.log(projects);
```

You can also grab specific project data by its `id`:

```javascript
const res = await fetch(
  'https://miguelbogota.github.io/miguelbogotadev-api/projects/brownie-n-friends.json',
);
const project = await res.json();
console.log(project);
```

For the content of a specific project:

```javascript
const res = await fetch(
  'https://miguelbogota.github.io/miguelbogotadev-api/content/v03.json',
);

const content = await res.json();
console.log(content);
```
