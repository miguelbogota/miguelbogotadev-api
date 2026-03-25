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

  // Write aggregated data to index.json
  const output = JSON.stringify(projects, null, 2);
  fs.writeFileSync(INDEX_FILE, output, 'utf8');

  console.log(`\n✓ Successfully aggregated ${projects.length} project(s)`);
  console.log(`✓ Index file created: ${INDEX_FILE}`);
  console.log(`  Size: ${Math.round(output.length / 1024)} KB`);
} catch (error) {
  console.error('✗ Aggregation failed:', error.message);
  process.exit(1);
}
