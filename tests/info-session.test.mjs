import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const html = read('../src/pages/index.astro');
const config = read('../public/site-config.js');
const css = read('../src/styles/glhc003.css');
const behavior = read('../src/scripts/glhc003/info-session.js');

test('info session remains available through the footer link', () => {
  assert.equal((html.match(/data-info-session-trigger/g) || []).length, 1);
  assert.match(html, /data-info-session-trigger href="#info-session-options">Info session options/);
  assert.match(html, /<dialog id="info-session-dialog"[^>]*aria-labelledby="info-session-title"[^>]*aria-describedby="info-session-description"/);
  assert.match(html, /data-info-session-close/);
  assert.match(behavior, /dialog\.showModal\(\)/);
  assert.match(behavior, /dialog\.addEventListener\('close'/);
  assert.match(behavior, /opener\.focus\(\{ preventScroll: true \}\)/);
  assert.match(behavior, /event\.target === dialog/);
});

test('two centrally configured session destinations appear in both modal and no-JS fallback', () => {
  assert.match(config, /lumaUrl: 'https:\/\/luma\.com\/pz0iw2m7'/);
  assert.match(config, /virtualLumaUrl: 'https:\/\/luma\.com\/zrbvt2az'/);
  assert.match(html, /id="info-session-options"/);
  assert.equal((html.match(/data-register\s+href=\{registrationUrl\}/g) || []).length, 2);
  assert.equal((html.match(/data-register-virtual\s+href=\{virtualRegistrationUrl\}/g) || []).length, 2);
  assert.match(html, /Attend in person/);
  assert.match(html, /University of Windsor/);
  assert.match(html, /Attend virtual info session/);
  assert.equal((html.match(/rel="noopener noreferrer"/g) || []).length, 4);
  assert.match(css, /\.has-info-session-dialog #info-session-options\{display:none\}/);
  assert.match(behavior, /if \(dialog && typeof dialog\.showModal === 'function'/);
});

test('header and final CTA open the existing shared submission dialog', () => {
  const submission = read('../src/scripts/glhc003/submission-dialog.js');
  assert.equal((html.match(/data-submission-trigger/g) || []).length, 3);
  assert.equal((html.match(/>Submit An Idea <span aria-hidden="true">↗<\/span><\/a>/g) || []).length, 2);
  assert.match(html, /id="submission-dialog"/);
  assert.match(html, /id="submission-options"/);
  assert.match(submission, /querySelectorAll\('\[data-submission-trigger\]'\)/);
  assert.match(submission, /for \(const trigger of triggers\)/);
  assert.match(submission, /dialog\.showModal\(\)/);
  assert.match(submission, /opener\?\.isConnected/);
  assert.doesNotMatch(html, /Attend the info session/);
});
