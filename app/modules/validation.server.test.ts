/**
 * Tests for Zod-powered validation functions
 */
import { describe, expect, it } from 'vitest';
import { ContentValidationError } from './errors';
import {
  SafeValidators,
  validateBlogpostFrontMatter,
  validatePageFrontMatter,
  validateStoryFrontMatter,
} from './validation.server';

describe('Zod-Powered Validation Functions', () => {
  describe('validateStoryFrontMatter', () => {
    const validStoryData = {
      name: 'Test Client',
      date: '2024-01-15',
      title: 'Amazing Project Success',
      subtitle: 'How we transformed their business',
      description: 'A comprehensive case study of digital transformation',
      speaker: 'John Doe',
      role: 'CEO',
      duration: '3 months',
      scopes: ['Digital Transformation'],
      tools: ['hubspot'],
      quotes: ['Great work!'],
      deliverables: ['Web App'],
    };

    it('should return true for valid story frontmatter', () => {
      expect(validateStoryFrontMatter(validStoryData)).toBe(true);
    });

    it('should throw ContentValidationError for invalid data', () => {
      const invalidData = { ...validStoryData, title: '' };

      expect(() => validateStoryFrontMatter(invalidData)).toThrow(
        ContentValidationError,
      );
    });

    it('should throw error with detailed validation issues', () => {
      const invalidData = { title: 'Only title' };

      try {
        validateStoryFrontMatter(invalidData);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(ContentValidationError);
        const validationError = error as ContentValidationError;
        expect(validationError.contentType).toBe('story');
        expect(validationError.validationIssues.length).toBeGreaterThan(1);
        expect(validationError.message).toContain('Invalid story frontmatter');
      }
    });

    it('should provide context in error', () => {
      const invalidData = {};

      try {
        validateStoryFrontMatter(invalidData);
        expect.fail('Should have thrown an error');
      } catch (error) {
        const validationError = error as ContentValidationError;
        expect(validationError.context).toBeDefined();
        expect(validationError.context?.attributes).toBe(invalidData);
        expect(validationError.context?.zodError).toBeDefined();
      }
    });

    it('should validate required string fields', () => {
      const requiredFields = [
        'name',
        'date',
        'title',
        'subtitle',
        'description',
        'speaker',
        'role',
        'duration',
      ];

      for (const field of requiredFields) {
        const invalidData = { ...validStoryData };
        delete (invalidData as any)[field];

        expect(() => validateStoryFrontMatter(invalidData)).toThrow(
          ContentValidationError,
        );
      }
    });

    it('should validate array fields default to empty arrays', () => {
      const dataWithoutArrays = {
        name: 'Test Client',
        date: '2024-01-15',
        title: 'Amazing Project Success',
        subtitle: 'How we transformed their business',
        description: 'A comprehensive case study',
        speaker: 'John Doe',
        role: 'CEO',
        duration: '3 months',
        // Arrays will default to empty
      };

      expect(validateStoryFrontMatter(dataWithoutArrays)).toBe(true);
    });
  });

  describe('validateBlogpostFrontMatter', () => {
    const validBlogData = {
      title: 'How to Build Better APIs',
      description: 'A comprehensive guide to API design',
      exerpt: 'A short summary',
      author: 'Jane Smith',
      image: '/images/api-guide.jpg',
      date: '2024-02-20',
      tags: ['api', 'development'],
      read: '10 min',
    };

    it('should return true for valid blog post frontmatter', () => {
      expect(validateBlogpostFrontMatter(validBlogData)).toBe(true);
    });

    it('should throw ContentValidationError for invalid data', () => {
      const invalidData = { ...validBlogData, title: '' }; // Empty title

      expect(() => validateBlogpostFrontMatter(invalidData)).toThrow(
        ContentValidationError,
      );
    });

    it('should validate optional exerpt field', () => {
      const dataWithExcerpt = { ...validBlogData, exerpt: 'Short excerpt' };
      expect(validateBlogpostFrontMatter(dataWithExcerpt)).toBe(true);

      const dataWithoutExcerpt = { ...validBlogData };
      delete (dataWithoutExcerpt as any).exerpt;
      expect(validateBlogpostFrontMatter(dataWithoutExcerpt)).toBe(true);
    });

    it('should validate read time field', () => {
      const validReadTimes = [
        '5 min',
        '10 minutes',
        '1 minute read',
        'quick read',
      ];

      for (const read of validReadTimes) {
        const data = { ...validBlogData, read };
        expect(validateBlogpostFrontMatter(data)).toBe(true);
      }

      // Only empty strings should fail
      const dataWithEmptyRead = { ...validBlogData, read: '' };
      expect(() => validateBlogpostFrontMatter(dataWithEmptyRead)).toThrow(
        ContentValidationError,
      );
    });

    it('should provide specific error messages', () => {
      const invalidData = { ...validBlogData, date: 'not a date' };

      try {
        validateBlogpostFrontMatter(invalidData);
        expect.fail('Should have thrown an error');
      } catch (error) {
        const validationError = error as ContentValidationError;
        expect(validationError.validationIssues[0]).toContain(
          'Must be a valid date string',
        );
      }
    });
  });

  describe('validatePageFrontMatter', () => {
    const validPageData = {
      title: 'Privacy Policy',
      description: 'Our comprehensive privacy policy',
    };

    it('should return true for valid page frontmatter', () => {
      expect(validatePageFrontMatter(validPageData)).toBe(true);
    });

    it('should throw ContentValidationError for missing required fields', () => {
      const invalidData = { title: 'Only title' };

      expect(() => validatePageFrontMatter(invalidData)).toThrow(
        ContentValidationError,
      );
    });

    it('should allow extra fields in non-strict mode', () => {
      const dataWithMetadata = {
        ...validPageData,
        metadata: { lastUpdated: '2024-01-01', version: '1.0' },
      };

      expect(validatePageFrontMatter(dataWithMetadata)).toBe(true);
    });

    it('should allow extra unknown fields in non-strict mode', () => {
      const dataWithExtraField = {
        ...validPageData,
        extraField: 'allowed',
      };

      expect(validatePageFrontMatter(dataWithExtraField)).toBe(true);
    });
  });

  describe('SafeValidators', () => {
    describe('SafeValidators.story', () => {
      it('should return success result for valid data', () => {
        const validData = {
          name: 'Test',
          date: '2024-01-01',
          title: 'Test Story',
          subtitle: 'Test Subtitle',
          description: 'Test Description',
          speaker: 'John Doe',
          role: 'CEO',
          duration: '30 min',
          scopes: [],
          tools: [],
          quotes: [],
          deliverables: [],
        };

        const result = SafeValidators.story(validData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toMatchObject(validData);
        }
      });

      it('should return error result for invalid data without throwing', () => {
        const invalidData = { title: 'Only title' };

        const result = SafeValidators.story(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBeDefined();
          expect(result.issues.length).toBeGreaterThan(0);
        }
      });

      it('should include context in error messages', () => {
        const invalidData = { name: '' };

        const result = SafeValidators.story(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.issues[0]).toContain('[Story]');
        }
      });
    });

    describe('SafeValidators.blogpost', () => {
      it('should return success result for valid data', () => {
        const validData = {
          title: 'Test Post',
          description: 'Test Description',
          author: 'Author',
          image: '/test.jpg',
          date: '2024-01-01',
          tags: [],
          read: '5 min',
        };

        const result = SafeValidators.blogpost(validData);
        expect(result.success).toBe(true);
      });

      it('should return error result for invalid data', () => {
        const invalidData = { title: 'Only title' };

        const result = SafeValidators.blogpost(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.issues.length).toBeGreaterThan(0);
        }
      });
    });

    describe('SafeValidators.page', () => {
      it('should return success result for valid data', () => {
        const validData = {
          title: 'Test Page',
          description: 'Test Description',
        };

        const result = SafeValidators.page(validData);
        expect(result.success).toBe(true);
      });

      it('should return error result for invalid data', () => {
        const invalidData = { title: '' };

        const result = SafeValidators.page(invalidData);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Error Messages and Context', () => {
    it('should provide detailed error information with field paths', () => {
      const invalidData = {
        name: '', // Empty string
        date: 'invalid date', // Invalid date
        // Missing other required fields
      };

      try {
        validateStoryFrontMatter(invalidData);
        expect.fail('Should have thrown an error');
      } catch (error) {
        const validationError = error as ContentValidationError;

        // Should have multiple validation issues
        expect(validationError.validationIssues.length).toBeGreaterThan(2);

        // Should include field paths in issues
        const nameIssue = validationError.validationIssues.find((issue) =>
          issue.includes('name:'),
        );
        expect(nameIssue).toBeDefined();
        expect(nameIssue).toContain('cannot be empty');

        const dateIssue = validationError.validationIssues.find((issue) =>
          issue.includes('date:'),
        );
        expect(dateIssue).toBeDefined();
        expect(dateIssue).toContain('Must be a valid date string');
      }
    });

    it('should include original data and Zod error in context', () => {
      const invalidData = { title: 'incomplete' };

      try {
        validateBlogpostFrontMatter(invalidData);
        expect.fail('Should have thrown an error');
      } catch (error) {
        const validationError = error as ContentValidationError;

        expect(validationError.context?.attributes).toBe(invalidData);
        expect(validationError.context?.zodError).toBeDefined();
        expect(
          (validationError.context?.zodError as any)?.issues,
        ).toBeDefined();
      }
    });

    it('should format error messages consistently', () => {
      const invalidData = {};

      try {
        validatePageFrontMatter(invalidData);
        expect.fail('Should have thrown an error');
      } catch (error) {
        const validationError = error as ContentValidationError;

        // Should contain the base message and issues
        expect(validationError.message).toContain('Invalid page frontmatter');
        expect(validationError.message).toContain('Issues:');

        // Should have proper error code and status
        expect(validationError.code).toBe('CONTENT_VALIDATION_ERROR');
        expect(validationError.status).toBe(422);
        expect(validationError.contentType).toBe('page');
      }
    });
  });
});
