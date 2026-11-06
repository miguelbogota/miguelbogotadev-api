/**
 * Project Builder Script
 *
 * Consolidates project Markdown frontmatter into a single metadata index.
 *
 * Process:
 * 1. Reads and validates every .md file in ./projects.
 * 2. Extracts YAML frontmatter and excludes the Markdown body.
 * 3. Sorts metadata by current status, company grouping, and start date.
 * 4. Writes the aggregated metadata to ./index.json.
 *
 * Output Format:
 * The resulting index.json is an array of project objects in portfolio display
 * order. General site wording in content/v03.json is served separately and is not
 * included in this output:
 * [
 *   { id: "project-1", name: "Project 1", ... },
 *   { id: "project-2", name: "Project 2", ... },
 *   ...
 * ]
 *
 * Usage:
 * Run this script from the repository root to regenerate the aggregated index:
 *   node scripts/build.js
 *
 * The script should be run whenever project Markdown files are changed.
 */

import fs from 'node:fs';
import { PROJECT_INDEX_FILE, PROJECTS_DIRECTORY } from './constants.js';
import { readProjects } from './project-reader.js';
import { validateProjects } from './project-validator.js';

try {
  const projectSources = readProjects(PROJECTS_DIRECTORY);
  const projectFiles = validateProjects(projectSources);
  const projects = projectFiles.map(({ metadata }) => metadata);

  console.log(
    `Found ${projects.length} Markdown project(s) in ${PROJECTS_DIRECTORY}`,
  );

  const sortedProjects = sortProjects(projects);

  sortedProjects.forEach((project) =>
    console.log(`✓ Aggregated: ${project.id}`),
  );

  // Write aggregated data to index.json
  const output = JSON.stringify(sortedProjects, null, 2);
  fs.writeFileSync(PROJECT_INDEX_FILE, output, 'utf8');

  console.log(
    `\n✓ Successfully aggregated ${sortedProjects.length} project(s)`,
  );
  console.log(`✓ Index file created: ${PROJECT_INDEX_FILE}`);
  console.log(`  Size: ${Math.round(output.length / 1024)} KB`);
} catch (error) {
  console.error('✗ Aggregation failed:', error.message);
  process.exit(1);
}

/**
 * Sorts projects by aggregation, current status, and dates.
 *
 * Sorting priority:
 * 1. Projects are grouped by ID prefix only when aggregate === true.
 * 2. Groups containing isCurrent === true come first.
 * 3. Groups containing endedAt === null come next.
 * 4. Groups are sorted by their latest startedAt date.
 * 5. Within each group, endedAt === null always comes first.
 * 6. Remaining projects are sorted by startedAt descending.
 *
 * Projects without aggregate === true are treated individually.
 * The original array is not modified.
 *
 * @param {import('../types/project.js').ProjectMetadata[]} projects
 *   Validated project metadata. The input array is not modified.
 * @returns {import('../types/project.js').ProjectMetadata[]}
 *   Projects in portfolio display order.
 */
function sortProjects(projects) {
  /** @type {Map<string, import('../types/project.js').ProjectMetadata[]>} */
  const groups = new Map();

  for (const project of projects) {
    const groupId =
      project.aggregate === true ? project.id.split('-')[0] : project.id;

    // Prevent non-aggregated projects from sharing a group
    // with aggregated projects that have the same ID.
    const groupKey =
      project.aggregate === true
        ? `aggregate:${groupId}`
        : `project:${groupId}`;

    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }

    groups.get(groupKey).push(project);
  }

  const grouped = Array.from(groups.values()).map((items) => {
    const sorted = [...items].sort((a, b) => {
      // Ongoing projects always come first.
      if (a.endedAt === null && b.endedAt !== null) return -1;
      if (b.endedAt === null && a.endedAt !== null) return 1;

      // Otherwise, sort by most recent start date.
      return b.startedAt.localeCompare(a.startedAt);
    });

    return {
      items: sorted,
      isCurrent: items.some((item) => item.isCurrent === true),
      isOngoing: items.some((item) => item.endedAt === null),
      startedAt: items.reduce(
        (latest, item) => (item.startedAt > latest ? item.startedAt : latest),
        items[0].startedAt,
      ),
    };
  });

  grouped.sort((a, b) => {
    if (a.isCurrent !== b.isCurrent) {
      return a.isCurrent ? -1 : 1;
    }

    if (a.isOngoing !== b.isOngoing) {
      return a.isOngoing ? -1 : 1;
    }

    return b.startedAt.localeCompare(a.startedAt);
  });

  return grouped.flatMap((group) => group.items);
}
