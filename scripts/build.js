/**
 * Project Builder Script
 *
 * This script consolidates all individual project JSON files from the 'projects' directory
 * into a single index.json file. This enables efficient bulk loading and serving of all
 * project data through a single API endpoint or data source.
 *
 * Process:
 * 1. Reads all .json files from the ./projects directory
 * 2. Filters out the index.json file to prevent circular references
 * 3. Parses each JSON file and removes the $schema property (only needed for individual files)
 * 4. Aggregates all projects into an array
 * 5. Sorts projects by current status, company grouping, and start date
 * 6. Writes the aggregated data to ./index.json with formatted output
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
 * The script should be run whenever project JSON files are added, modified, or removed.
 */

const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = './projects';
const INDEX_FILE = 'index.json';

try {
  // Verify projects directory exists
  if (!fs.existsSync(PROJECTS_DIR)) {
    throw new Error(`Projects directory not found: ${PROJECTS_DIR}`);
  }

  // Read all files from projects directory
  const files = fs.readdirSync(PROJECTS_DIR);
  console.log(`Found ${files.length} files in ${PROJECTS_DIR}`);

  // Filter, read, and aggregate project files (excluding index.json and removing $schema)
  const projects = files
    .filter((f) => f.endsWith('.json') && f !== INDEX_FILE)
    .map((filename) => {
      const data = JSON.parse(
        fs.readFileSync(path.join(PROJECTS_DIR, filename), 'utf8'),
      );
      delete data.$schema;
      return data;
    });

  const sortedProjects = sortProjects(projects);

  sortedProjects.forEach((project) =>
    console.log(`✓ Aggregated: ${project.id}`),
  );

  // Write aggregated data to index.json
  const output = JSON.stringify(sortedProjects, null, 2);
  fs.writeFileSync(INDEX_FILE, output, 'utf8');

  console.log(
    `\n✓ Successfully aggregated ${sortedProjects.length} project(s)`,
  );
  console.log(`✓ Index file created: ${INDEX_FILE}`);
  console.log(`  Size: ${Math.round(output.length / 1024)} KB`);
} catch (error) {
  console.error('✗ Aggregation failed:', error.message);
  process.exit(1);
}

/**
 * Sorts projects by their ID prefix, current status, and dates.
 *
 * Sorting priority:
 * 1. Groups containing isCurrent === true come first.
 * 2. Groups containing endedAt === null come next.
 * 3. Groups are sorted by their latest startedAt date.
 * 4. Within each group, endedAt === null always comes first.
 * 5. Remaining projects are sorted by startedAt descending.
 *
 * The original array is not modified.
 *
 * @param {Object[]} projects - Array of projects to sort.
 * @returns {Object[]} The sorted projects.
 */
function sortProjects(projects) {
  const groups = new Map();

  for (const project of projects) {
    const groupId = project.id.split("-")[0];

    if (!groups.has(groupId)) {
      groups.set(groupId, []);
    }

    groups.get(groupId).push(project);
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
        (latest, item) => item.startedAt > latest ? item.startedAt : latest,
        items[0].startedAt
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
