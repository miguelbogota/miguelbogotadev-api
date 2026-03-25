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

### Step 2: Build the Index

After adding/modifying projects, regenerate the aggregated index:

```bash
node build.js
```

✅ Output: `/index.json` (ready to be consumed by frontend apps)

### Step 3: Commit and Push

```bash
git add -A
git commit -m "Add/update project: my-project"
git push
```

Frontend applications will automatically consume the latest data from the updated index.

---

## 🎯 Consuming the Data

Frontend and Node applications can now read all projects from a single file:

```javascript
const branch = 'production'; // or the branch you want to read from
const res = await fetch(
  `https://api.github.com/repos/miguelbogota/miguelbogotadev-api/contents/index.json?ref=${branch}`,
);
const data = await res.json();
const content = atob(data.content);
const decoded = new TextDecoder().decode(
  Uint8Array.from(content, (c) => c.charCodeAt(0)),
);

console.log(JSON.parse(decoded));
```

For the content of a specific project:

```javascript
const branch = 'production'; // or the branch you want to read from
const version = 'v01'; // or the version you want to read

const res = await fetch(
  `https://api.github.com/repos/miguelbogota/miguelbogotadev-api/contents/content/${version}.json?ref=${branch}`,
);

const data = await res.json();
const content = atob(data.content);
const decoded = new TextDecoder().decode(
  Uint8Array.from(content, (c) => c.charCodeAt(0)),
);

console.log(JSON.parse(decoded));
```