import fs from 'node:fs';
import path from 'node:path';
import matter from '@11ty/gray-matter';

/**
 * Reads one Markdown project and separates its frontmatter from its content.
 * Validation is intentionally handled by validateProjects so reading and
 * validation remain explicit steps in the build process.
 *
 * @param {string} filePath - Path to a project Markdown file.
 * @returns {{ filename: string, metadata: unknown, content: string }} Parsed project source.
 * @throws {Error} When the file or its YAML frontmatter cannot be parsed.
 */
export function readProject(filePath) {
  const filename = path.basename(filePath);

  try {
    const parsed = matter(fs.readFileSync(filePath, 'utf8'));

    return {
      filename,
      metadata: parsed.data,
      content: parsed.content.trim(),
    };
  } catch (error) {
    throw new Error(`${filename}: could not read frontmatter`);
  }
}

/**
 * Reads every Markdown project in a directory.
 *
 * @param {string} directory - Directory containing project Markdown files.
 * @returns {Array<{ filename: string, metadata: unknown, content: string }>} Parsed sources.
 * @throws {Error} When the directory is missing, empty, or a file cannot be read.
 */
export function readProjects(directory) {
  if (!fs.existsSync(directory)) {
    throw new Error(`Projects directory not found: ${directory}`);
  }

  const files = fs
    .readdirSync(directory)
    .filter((file) => file.endsWith('.md'))
    .sort();

  if (files.length === 0) {
    throw new Error(`No Markdown project files found in ${directory}`);
  }

  return files.map((filename) => readProject(path.join(directory, filename)));
}
