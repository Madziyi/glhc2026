import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const html = readFileSync(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
const controller = readFileSync(new URL('../public/main.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../public/styles.css', import.meta.url), 'utf8');
test('includes core recruitment information and a Luma CTA', () => {
  for (const phrase of ['Make waves', '$500', 'No experience needed', 'public spaces', 'data-registration', 'Skip the intro'])
    assert.ok(html.includes(phrase), `Missing ${phrase}`);
});
test('animation supports reduced motion, reverse scrolling, and accessible shortcuts', () => {
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(html, /class="skip-link"/);
  assert.match(controller, /requestAnimationFrame/);
  assert.match(controller, /window\.addEventListener\('scroll'/);
});
test('does not point registration at an invented Luma page', () => {
  const config = readFileSync(new URL('../public/site-config.js', import.meta.url), 'utf8');
  assert.match(config, /lumaUrl: ''/);
  assert.match(controller, /https:/);
});
