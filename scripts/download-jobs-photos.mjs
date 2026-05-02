#!/usr/bin/env node
/**
 * Download job-related photos from Notion CDN to public/images/jobs/
 * Run: node scripts/download-jobs-photos.mjs
 */
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '../public/images/jobs');

const PHOTOS = [
  {
    name: 'seminaire.jpeg',
    url: 'https://ocobo.notion.site/image/attachment%3Ab4f348eb-d762-4550-8208-621603236432%3AOcobo-seminaire.jpeg?table=block&id=2be3e6cb-c845-807a-8e5a-cb84e2d72329&spaceId=4e81b96a-f81b-4af5-bdaa-63b1b40bfa58&width=620&userId=&cache=v2',
  },
  {
    name: 'bureau-1.jpeg',
    url: 'https://ocobo.notion.site/image/attachment%3Adb312e67-298e-4876-8626-903ffc82f480%3AIMG_1081.jpeg?table=block&id=20f3e6cb-c845-8016-ad4f-f1c4f9745781&spaceId=4e81b96a-f81b-4af5-bdaa-63b1b40bfa58&width=550&userId=&cache=v2',
  },
  {
    name: 'bureau-2.jpeg',
    url: 'https://ocobo.notion.site/image/attachment%3Ae0e520b7-e1cb-4501-a4a0-c0c66670428a%3AIMG_1083.jpeg?table=block&id=20f3e6cb-c845-8038-afa1-e52f285de4da&spaceId=4e81b96a-f81b-4af5-bdaa-63b1b40bfa58&width=550&userId=&cache=v2',
  },
  {
    name: 'bureau-3.jpeg',
    url: 'https://ocobo.notion.site/image/attachment%3A29c60272-e6f6-4203-a581-88165d1c1fdd%3AIMG_1082.jpeg?table=block&id=20f3e6cb-c845-80e6-bbb7-e838ca5e27b5&spaceId=4e81b96a-f81b-4af5-bdaa-63b1b40bfa58&width=550&userId=&cache=v2',
  },
  {
    name: 'cafet.jpeg',
    url: 'https://ocobo.notion.site/image/attachment%3A0bb6704d-50ac-4296-9131-cd6e64b98c54%3ACafet.jpeg?table=block&id=20f3e6cb-c845-80b0-8b34-eb0125928d76&spaceId=4e81b96a-f81b-4af5-bdaa-63b1b40bfa58&width=550&userId=&cache=v2',
  },
  {
    name: 'rooftop.jpeg',
    url: 'https://ocobo.notion.site/image/attachment%3A4434f27a-8380-47d2-b912-63560172de73%3Arooftop.jpeg?table=block&id=20f3e6cb-c845-8083-9ab0-dfbbda80b43a&spaceId=4e81b96a-f81b-4af5-bdaa-63b1b40bfa58&width=550&userId=&cache=v2',
  },
];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const photo of PHOTOS) {
    process.stdout.write(`Downloading ${photo.name}... `);
    const res = await fetch(photo.url);
    if (!res.ok) throw new Error(`Failed to fetch ${photo.url}: ${res.status}`);
    const buffer = await res.arrayBuffer();
    await writeFile(join(OUT_DIR, photo.name), Buffer.from(buffer));
    console.log(`✓ (${Math.round(buffer.byteLength / 1024)} KB)`);
  }

  console.log(`\nDone — photos written to public/images/jobs/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
