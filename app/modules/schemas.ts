/**
 * Zod validation schemas for content frontmatter
 *
 * This module provides robust, type-safe validation schemas using Zod
 * to ensure content files have the correct metadata structure with
 * proper error messages and type inference.
 */

import { z } from 'zod';

/**
 * Common validation schemas that can be reused
 */
const CommonSchemas = {
  /** Non-empty string schema */
  nonEmptyString: z.string().min(1, 'Field cannot be empty').trim(),

  /** Date string schema (ISO format or readable date) */
  dateString: z
    .string()
    .min(1, 'Date cannot be empty')
    .refine(
      (date) => !Number.isNaN(Date.parse(date)),
      'Must be a valid date string',
    ),

  /** Array of non-empty strings */
  stringArray: z
    .array(z.string().min(1, 'Array items cannot be empty'))
    .default([]),

  /** Optional YouTube ID (11 characters alphanumeric) */
  youtubeId: z
    .string()
    .regex(/^[a-zA-Z0-9_-]{11}$/, 'Must be a valid YouTube video ID')
    .optional(),
} as const;

/**
 * Story frontmatter schema
 * Stories represent client case studies and testimonials
 */
export const StoryFrontmatterSchema = z.object({
  /** Client/project name */
  name: CommonSchemas.nonEmptyString,

  /** Publication/project date */
  date: CommonSchemas.dateString,

  /** Main title of the story */
  title: CommonSchemas.nonEmptyString,

  /** Subtitle or tagline */
  subtitle: CommonSchemas.nonEmptyString,

  /** Brief description of the story */
  description: CommonSchemas.nonEmptyString,

  /** Name of the person giving testimonial */
  speaker: CommonSchemas.nonEmptyString,

  /** Role/position of the speaker */
  role: CommonSchemas.nonEmptyString,

  /** Project duration */
  duration: CommonSchemas.nonEmptyString,

  /** Project scopes/areas covered */
  scopes: CommonSchemas.stringArray,

  /** Categorization tags */
  tags: CommonSchemas.stringArray,

  /** Tools and technologies used */
  tools: CommonSchemas.stringArray,

  /** Key quotes from the client */
  quotes: CommonSchemas.stringArray,

  /** Project deliverables */
  deliverables: CommonSchemas.stringArray,

  /** Optional YouTube video ID */
  youtubeId: CommonSchemas.youtubeId,
});

/**
 * Blog post frontmatter schema
 * Blog posts are articles and insights
 */
export const BlogpostFrontmatterSchema = z.object({
  /** Article title */
  title: CommonSchemas.nonEmptyString,

  /** Article description/summary */
  description: CommonSchemas.nonEmptyString,

  /** Optional excerpt (note: original has typo "exerpt") */
  exerpt: CommonSchemas.nonEmptyString.optional(),

  /** Author name */
  author: CommonSchemas.nonEmptyString,

  /** Featured image URL or path */
  image: CommonSchemas.nonEmptyString,

  /** Publication date */
  date: CommonSchemas.dateString,

  /** Article tags for categorization */
  tags: CommonSchemas.stringArray,

  /** Estimated reading time */
  read: CommonSchemas.nonEmptyString,

  /** Optional YouTube video ID for video content */
  youtubeId: CommonSchemas.youtubeId,
});

/**
 * Page frontmatter schema
 * Pages are static content like legal pages, about, etc.
 */
export const PageFrontmatterSchema = z.object({
  /** Page title */
  title: CommonSchemas.nonEmptyString,

  /** Page description for SEO */
  description: CommonSchemas.nonEmptyString,
});

/**
 * Offer frontmatter schema
 * Job offers and career opportunities
 */
export const OfferFrontmatterSchema = z.object({
  /** Job title */
  title: CommonSchemas.nonEmptyString,

  /** Job description/summary */
  description: CommonSchemas.nonEmptyString,

  /** Contract type (CDI, CDD, Freelance, etc.) */
  contractType: CommonSchemas.nonEmptyString,

  /** Job location */
  location: CommonSchemas.nonEmptyString,

  /** Required experience level (Junior, Mid-level, Senior, etc.) */
  experience: CommonSchemas.nonEmptyString,

  /** Required education level (Bac+3, Bac+5, etc.) */
  education: CommonSchemas.nonEmptyString,

  /** Optional department */
  department: CommonSchemas.nonEmptyString.optional(),

  /** Optional salary range */
  salary: CommonSchemas.nonEmptyString.optional(),

  /** Job tags for categorization */
  tags: CommonSchemas.stringArray,

  /** Publication date */
  date: CommonSchemas.dateString,
});

/**
 * Inferred TypeScript types from Zod schemas
 * These replace the manually defined types
 */
export type StoryFrontmatter = z.infer<typeof StoryFrontmatterSchema>;
export type BlogpostFrontmatter = z.infer<typeof BlogpostFrontmatterSchema>;
export type PageFrontmatter = z.infer<typeof PageFrontmatterSchema>;
export type OfferFrontmatter = z.infer<typeof OfferFrontmatterSchema>;

/**
 * Union type for all frontmatter types
 */
export type AnyFrontmatter =
  | StoryFrontmatter
  | BlogpostFrontmatter
  | PageFrontmatter
  | OfferFrontmatter;

/**
 * Validation result type
 */
export type ValidationResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: z.ZodError;
      issues: string[];
    };

/**
 * Check for unknown fields and log warnings for cleanup purposes
 */
function checkForUnknownFields<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context?: string,
): void {
  if (!data || typeof data !== 'object') {
    return;
  }

  // Try parsing with strict mode to detect unknown fields
  const strictSchema = schema instanceof z.ZodObject ? schema.strict() : schema;
  const strictResult = strictSchema.safeParse(data);

  if (!strictResult.success) {
    const unknownKeyIssues = strictResult.error.issues.filter(
      (issue) => issue.code === 'unrecognized_keys',
    );

    if (unknownKeyIssues.length > 0) {
      for (const issue of unknownKeyIssues) {
        if (issue.code === 'unrecognized_keys') {
          const contextStr = context ? `[${context}] ` : '';
          const keys = issue.keys.join(', ');
          console.warn(
            `${contextStr}Unknown fields detected (consider cleanup): ${keys}`,
          );
        }
      }
    }
  }
}

/**
 * Generic validation function that returns detailed error information
 */
export function validateWithSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context?: string,
): ValidationResult<T> {
  // Check for unknown fields and log warnings
  checkForUnknownFields(schema, data, context);

  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  const issues = result.error.issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
    const contextStr = context ? `[${context}] ` : '';
    return `${contextStr}${path}: ${issue.message}`;
  });

  return {
    success: false,
    error: result.error,
    issues,
  };
}

/**
 * Specific validation functions for each content type
 */
export const Validators = {
  /**
   * Validate story frontmatter with detailed error reporting
   */
  story: (
    data: unknown,
    context?: string,
  ): ValidationResult<StoryFrontmatter> =>
    validateWithSchema(StoryFrontmatterSchema, data, context),

  /**
   * Validate blog post frontmatter with detailed error reporting
   */
  blogpost: (
    data: unknown,
    context?: string,
  ): ValidationResult<BlogpostFrontmatter> =>
    validateWithSchema(BlogpostFrontmatterSchema, data, context),

  /**
   * Validate page frontmatter with detailed error reporting
   */
  page: (data: unknown, context?: string): ValidationResult<PageFrontmatter> =>
    validateWithSchema(PageFrontmatterSchema, data, context),

  /**
   * Validate offer frontmatter with detailed error reporting
   */
  offer: (
    data: unknown,
    context?: string,
  ): ValidationResult<OfferFrontmatter> =>
    validateWithSchema(OfferFrontmatterSchema, data, context),
} as const;

/**
 * Type guard functions for backward compatibility
 * These are now powered by Zod but maintain the same interface
 */
export function isValidStoryFrontmatter(
  data: unknown,
): data is StoryFrontmatter {
  return StoryFrontmatterSchema.safeParse(data).success;
}

export function isValidBlogpostFrontmatter(
  data: unknown,
): data is BlogpostFrontmatter {
  return BlogpostFrontmatterSchema.safeParse(data).success;
}

export function isValidPageFrontmatter(data: unknown): data is PageFrontmatter {
  return PageFrontmatterSchema.safeParse(data).success;
}

export function isValidOfferFrontmatter(
  data: unknown,
): data is OfferFrontmatter {
  return OfferFrontmatterSchema.safeParse(data).success;
}

/**
 * Schema registry for dynamic validation
 */
export const SchemaRegistry = {
  story: StoryFrontmatterSchema,
  blogpost: BlogpostFrontmatterSchema,
  page: PageFrontmatterSchema,
  offer: OfferFrontmatterSchema,
} as const;

/**
 * Content type discriminator
 */
export type ContentType = keyof typeof SchemaRegistry;

/**
 * Get schema by content type
 */
export function getSchemaForContentType(type: ContentType) {
  return SchemaRegistry[type];
}
