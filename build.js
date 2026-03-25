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
 * 5. Sorts the projects accordingly...
 * 5. Writes the aggregated data to ./index.json with formatted output
 *
 * Output Format:
 * The resulting index.json is an object containing the current content and an array of project
 * objects sorted by filename order:
 * [
 *   { id: "project-1", name: "Project 1", ... },
 *   { id: "project-2", name: "Project 2", ... },
 *   ...
 * ]
 *
 * Usage:
 * Run this script to regenerate the aggregated index:
 *   node build.js
 *
 * The script should be run whenever project JSON files are added, modified, or removed.
 */

const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = './projects';
const INDEX_FILE = 'index.json';
const CONTENT_FILE = './content/v03.json';

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
      console.log(`✓ Aggregated: ${filename}`);
      return data;
    });

  const sortedProjects = sortProjects(projects);

  // Write aggregated data to index.json
  const output = JSON.stringify(sortedProjects, null, 2);
  fs.writeFileSync(INDEX_FILE, output, 'utf8');

  console.log(`\n✓ Successfully aggregated ${sortedProjects.length} project(s)`);
  console.log(`✓ Index file created: ${INDEX_FILE}`);
  console.log(`  Size: ${Math.round(output.length / 1024)} KB`);
} catch (error) {
  console.error('✗ Aggregation failed:', error.message);
  process.exit(1);
}


/**
 * Sorts projects based on current status and aggregation logic.
 *
 * Sorting Strategy:
 * ─────────────────
 * 1. **Current Project First**: If a project has isCurrent: true, it appears first.
 *
 * 2. **Company Grouping (if current is aggregate)**:
 *    - Projects from the current project's company appear next (sorted by date, newest first)
 *    - Projects from other companies appear after, grouped by company
 *    - All company groups are sorted by the newest project's date
 *
 * 3. **Standard Grouping (if current is not aggregate or doesn't exist)**:
 *    - Aggregate projects are grouped by company, with only the newest representing each company
 *      to sort the date of the company group
 *    - Non-aggregate projects appear alongside aggregate representatives
 *    - Everything is sorted by date (newest first)
 *
 * @param {Array<Object>} projects - Array of project objects with at least: id, isCurrent, aggregate, companyName, startedAt
 * @returns {Array<Object>} Sorted array with current project first, then grouped and sorted by date
 */
function sortProjects(projects) {
  // 1. Find and prioritize current project
  const currentProject = projects.find((p) => p.isCurrent);
  const remainingProjects = projects.filter((p) => !p.isCurrent);

  let sortedRemaining;

  if (currentProject && currentProject.aggregate) {
    // 2. If current project is aggregate, sort its company together, then others
    const sameCompanyProjects = remainingProjects.filter(
      (p) => p.companyName === currentProject.companyName,
    );
    const otherCompanyProjects = remainingProjects.filter(
      (p) => p.companyName !== currentProject.companyName,
    );

    // Sort same company by date
    sameCompanyProjects.sort((a, b) => {
      const dateA = new Date(a.startedAt);
      const dateB = new Date(b.startedAt);
      return dateB.getTime() - dateA.getTime();
    });

    // 3. For other companies: handle aggregate projects by using newest as representative
    const aggregateProjects = otherCompanyProjects.filter((p) => p.aggregate);
    const nonAggregateProjects = otherCompanyProjects.filter(
      (p) => !p.aggregate,
    );

    // Group aggregate projects by company and get newest from each
    const groupedByCompany = aggregateProjects.reduce((acc, project) => {
      const company = project.companyName;
      if (!acc[company]) {
        acc[company] = [];
      }
      acc[company].push(project);
      return acc;
    }, {});

    const aggregateRepresentatives = Object.values(groupedByCompany).map(
      (group) => {
        return group.sort((a, b) => {
          const dateA = new Date(a.startedAt);
          const dateB = new Date(b.startedAt);
          return dateB.getTime() - dateA.getTime();
        })[0];
      },
    );

    // Combine and sort all remaining (aggregate representatives + non-aggregates)
    const allOthers = [...aggregateRepresentatives, ...nonAggregateProjects];
    allOthers.sort((a, b) => {
      const dateA = new Date(a.startedAt);
      const dateB = new Date(b.startedAt);
      return dateB.getTime() - dateA.getTime();
    });

    sortedRemaining = [...sameCompanyProjects, ...allOthers];
  } else {
    // Current is not aggregate or doesn't exist
    // 3. Group aggregate projects by company and use newest as representative
    const aggregateProjects = remainingProjects.filter((p) => p.aggregate);
    const nonAggregateProjects = remainingProjects.filter((p) => !p.aggregate);

    const groupedByCompany = aggregateProjects.reduce((acc, project) => {
      const company = project.companyName;
      if (!acc[company]) {
        acc[company] = [];
      }
      acc[company].push(project);
      return acc;
    }, {});

    const aggregateRepresentatives = Object.values(groupedByCompany).map(
      (group) => {
        return group.sort((a, b) => {
          const dateA = new Date(a.startedAt);
          const dateB = new Date(b.startedAt);
          return dateB.getTime() - dateA.getTime();
        })[0];
      },
    );

    // 4. Sort all remaining by date
    const allProjects = [...aggregateRepresentatives, ...nonAggregateProjects];
    allProjects.sort((a, b) => {
      const dateA = new Date(a.startedAt);
      const dateB = new Date(b.startedAt);
      return dateB.getTime() - dateA.getTime();
    });

    sortedRemaining = allProjects;
  }

  // Combine current (if exists) with sorted remaining
  const sortedProjects = currentProject
    ? [currentProject, ...sortedRemaining]
    : sortedRemaining;

  return sortedProjects;
}
