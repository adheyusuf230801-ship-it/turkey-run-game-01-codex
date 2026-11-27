/**
 * Feather Fugitive: a turkey escapes Thanksgiving dinner and races the farmer
 * through three stages to the Freedom Gate at 1200m.
 * Build locally: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
 * Play locally: node serve.ts, then open http://localhost:8080.
 * Requires Node 22 with TypeScript type stripping enabled by default.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
const screenshots = join(here, 'screenshots');
if (existsSync(screenshots) && readdirSync(screenshots).length > 0) {
  cpSync(screenshots, join(out, 'screenshots'), { recursive: true });
}
writeFileSync(join(out, 'dossier.json'), buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
}));
console.log(`Feather Fugitive hand-in written to ${out}: dossier.json, game/ and screenshots/ copied.`);
