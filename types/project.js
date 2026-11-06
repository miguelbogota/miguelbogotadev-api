import { z } from 'zod';

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Creates a required, non-empty string schema with a field-specific error.
 *
 * @param {string} name - Human-readable field name used in errors.
 * @returns {z.ZodString} String schema.
 */
const requiredText = (name) =>
  z
    .string({ error: `${name} must be a string` })
    .trim()
    .min(1, `${name} cannot be empty`);

/**
 * Creates a schema for a real calendar date written as YYYY-MM-DD.
 *
 * @param {string} name - Frontmatter field name used in errors.
 * @returns {z.ZodString} Date string schema.
 */
const projectDate = (name) =>
  requiredText(name)
    .regex(datePattern, `${name} must use the YYYY-MM-DD format`)
    .refine((value) => {
      const date = new Date(`${value}T00:00:00.000Z`);
      return (
        !Number.isNaN(date.valueOf()) && date.toISOString().startsWith(value)
      );
    }, `${name} must be a valid calendar date`);

/**
 * Runtime contract for the YAML frontmatter in every project Markdown file.
 * Keep types/project.d.ts synchronized with this schema for API consumers.
 */
export const projectMetadataSchema = z
  .object({
    id: requiredText('Project id').regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Project id must contain lowercase letters, numbers, and hyphens only',
    ),
    startedAt: projectDate('startedAt'),
    endedAt: projectDate('endedAt').nullable(),
    isCurrent: z.boolean({ error: 'isCurrent must be true or false' }),
    isArchived: z.boolean({ error: 'isArchived must be true or false' }),
    aggregate: z.boolean({ error: 'aggregate must be true or false' }),
    displayName: requiredText('displayName'),
    summary: requiredText('summary'),
    role: requiredText('role'),
    companyName: requiredText('companyName'),
    industry: requiredText('industry'),
    tags: z
      .array(requiredText('Tag'), { error: 'tags must be an array of strings' })
      .min(1, 'tags must contain at least one item'),
    images: z.array(
      z
        .object({
          src: z.url({ error: 'Image src must be a valid URL' }),
          alt: requiredText('Image alt text'),
        })
        .strict(),
      { error: 'images must be an array' },
    ),
    links: z.array(
      z
        .object({
          label: requiredText('Link label'),
          icon: requiredText('Link icon'),
          url: z.url({ error: 'Link URL must be a valid URL' }),
        })
        .strict(),
      { error: 'links must be an array' },
    ),
  })
  .strict()
  .superRefine((project, context) => {
    if (project.endedAt !== null && project.endedAt < project.startedAt) {
      context.addIssue({
        code: 'custom',
        path: ['endedAt'],
        message: 'endedAt cannot be earlier than startedAt',
      });
    }
  });

/**
 * Metadata produced after successful frontmatter validation.
 * @typedef {z.infer<typeof projectMetadataSchema>} ProjectMetadata
 */
