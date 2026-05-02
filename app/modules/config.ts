/**
 * Markdoc configuration for rendering markdown content
 *
 * This file defines how markdown elements are transformed into React components.
 * It includes custom nodes for enhanced content rendering and tags for embedded content.
 */
import type { Config } from '@markdoc/markdoc';

/**
 * Main Markdoc configuration object
 * Maps markdown elements to React components and defines custom tags
 */
export const config: Config = {
  // Define how standard markdown nodes are rendered
  nodes: {
    document: {
      render: 'Container',
      attributes: {
        frontmatter: { type: Object, required: true },
      },
    },
    heading: {
      render: 'Heading',
      attributes: {
        id: { type: String },
        level: { type: Number, required: true, default: 1 },
      },
    },
    paragraph: {
      render: 'Paragraph',
    },
    list: {
      render: 'List',
      attributes: {
        ordered: { type: Boolean, default: false },
      },
    },
    item: {
      render: 'ListItem',
    },
    fence: {
      render: 'CodeBlock',
      attributes: {
        language: { type: String, required: true },
        content: { type: String, required: true },
      },
    },
    link: {
      render: 'Link',
      attributes: {
        href: { type: String, required: true },
        title: { type: String },
      },
    },
    table: {
      render: 'Table',
    },
    th: {
      render: 'TH',
    },
    td: {
      render: 'TD',
      attributes: {
        color: {
          type: String,
          matches: ['green', 'red', 'default'],
          default: 'default',
        },
      },
    },
    blockquote: {
      render: 'Quote',
      attributes: {
        author: { type: String },
        url: { type: String },
      },
    },
  },
  // Define custom tags for embedded content
  tags: {
    tweet: {
      render: 'TweetEmbed',
      attributes: {
        url: { type: String, required: true },
      },
    },
    statement: {
      render: 'Statement',
    },
    callout: {
      render: 'Callout',
      attributes: {
        title: { type: String },
      },
    },
    aushaPlayer: {
      render: 'AushaPlayer',
      attributes: {
        podcastId: {
          type: String,
          required: true,
        },
        showId: {
          type: String,
        },
        title: {
          type: String,
        },
      },
    },
    hubspotForm: {
      render: 'HubspotForm',
      attributes: {
        formId: {
          type: String,
          required: true,
        },
      },
    },
    youtubePlayer: {
      render: 'PlayerYoutube',
      attributes: {
        id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
        },
      },
    },
  },
};
