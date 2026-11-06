import path from 'node:path';
import { projectMetadataSchema } from '../types/project.js';

/**
 * Returns a short name for the metadata field that failed validation.
 *
 * @param {import('zod').core.$ZodIssue} issue - One Zod validation issue.
 * @returns {string} A field path such as `summary` or `images.0.src`.
 */
function getIssueField(issue) {
  return issue.path.length > 0 ? issue.path.join('.') : 'frontmatter';
}

/**
 * Validates parsed project frontmatter before it is used by the build.
 *
 * The returned projects contain metadata parsed by Zod, so callers receive the
 * validated values instead of the original unknown input. All validation errors
 * use a single, compact format: `filename: field - message`.
 *
 * @param {Array<{ filename: string, metadata: unknown, content: string }>} projects
 *   Project sources returned by readProjects.
 * @returns {Array<{
 *   filename: string,
 *   metadata: ProjectMetadata,
 *   content: string
 * }>} Validated projects.
 * @throws {Error} When any project contains invalid or duplicate metadata.
 */
export function validateProjects(projects) {
  const validatedProjects = [];
  const projectIds = new Map();
  const errors = [];

  for (const project of projects) {
    const result = projectMetadataSchema.safeParse(project.metadata);

    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push(
          `${project.filename}: ${getIssueField(issue)} - ${issue.message}`,
        );
      }
      continue;
    }

    const expectedId = path.basename(project.filename, '.md');
    if (result.data.id !== expectedId) {
      errors.push(`${project.filename}: id - must match the filename`);
    }

    const previousFilename = projectIds.get(result.data.id);
    if (previousFilename) {
      errors.push(
        `${project.filename}: id - already used by ${previousFilename}`,
      );
    } else {
      projectIds.set(result.data.id, project.filename);
    }

    validatedProjects.push({ ...project, metadata: result.data });
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }

  return validatedProjects;
}
