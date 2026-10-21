import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const html = read('../src/pages/index.astro');

test('homepage contains the five chapter recruitment story in reading order', () => {
  const ids = ['invitation', 'surface', 'crossing', 'science', 'challenge', 'how-it-works', 'registration'];
  let previous = -1;
  for (const id of ids) {
    const position = html.indexOf(`id="${id}"`);
    assert.ok(position > previous, `${id} must follow the preceding chapter`);
    previous = position;
  }
  for (const phrase of ['$500', 'winning team', 'No experience', 'public', 'data-register'])
    assert.ok(html.includes(phrase), `Missing ${phrase}`);
  assert.equal((html.match(/class="science-panel"/g) || []).length, 2);
  assert.ok(!html.includes('glider-cutout'));
});

test('registration is centrally configured to the organizer supplied secure destination', () => {
  const config = read('../public/site-config.js');
  assert.match(config, /lumaUrl: 'https:\/\/luma.com\/pz0iw2m7'/);
  assert.match(html, /site-config\.js/);
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noopener noreferrer"/);
});
