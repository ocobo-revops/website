#!/usr/bin/env node

/**
 * Upload tool registry icons to Vercel Blob under `content/tools/`.
 *
 * Source: app/public/logos/<slug>.<ext> (PNG today, SVG when available).
 * Destination: ${ASSETS_BASE_URL}/tools/<slug>.<ext>.
 *
 * Run from website repo root:
 *   node --env-file=.env scripts/upload-tool-icons.js
 */

import { readFile, readdir, stat } from 'fs/promises';
import { dirname, extname, join } from 'path';
import { fileURLToPath } from 'url';

import { put } from '@vercel/blob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sourceDir = join(__dirname, '../public/logos');

const TOOL_SLUGS = new Set([
  'aircall',
  'bigquery',
  'gsheet',
  'hubspot',
  'hyperline',
  'lemlist',
  'modjo',
  'notion',
  'odoo',
  'outreach',
  'planhat',
  'qobra',
  'salesforce',
  'tableau',
  'vitally',
  'zendesk',
]);

const CONTENT_TYPE = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('BLOB_READ_WRITE_TOKEN missing — load .env first.');
    process.exit(1);
  }

  const entries = await readdir(sourceDir);
  const uploaded = [];
  const skipped = [];

  for (const entry of entries) {
    const ext = extname(entry).toLowerCase();
    const slug = entry.slice(0, -ext.length);
    const contentType = CONTENT_TYPE[ext];

    if (!contentType) {
      skipped.push({ entry, reason: 'unsupported extension' });
      continue;
    }
    if (!TOOL_SLUGS.has(slug)) {
      skipped.push({ entry, reason: 'not in tool registry' });
      continue;
    }

    const fullPath = join(sourceDir, entry);
    const stats = await stat(fullPath);
    const buffer = await readFile(fullPath);
    const blobPath = `content/tools/${slug}${ext}`;

    const blob = await put(blobPath, buffer, {
      access: 'public',
      contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    uploaded.push({ slug, ext, size: stats.size, url: blob.url });
    console.log(`✅ ${slug}${ext} → ${blob.url}`);
  }

  console.log(`\nUploaded ${uploaded.length}, skipped ${skipped.length}.`);
  if (skipped.length > 0) {
    for (const s of skipped) console.log(`  · ${s.entry} (${s.reason})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
