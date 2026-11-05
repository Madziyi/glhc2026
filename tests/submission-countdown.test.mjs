import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { openingText } from '../src/scripts/glhc003/submission-countdown.mjs';

const config = readFileSync(new URL('../public/site-config.js', import.meta.url), 'utf8');
const iso = config.match(/submissionOpensAt: '([^']+)'/)[1];
const target = Date.parse(iso);

test('submission opening is the confirmed Nov 5 2026 5:30 pm Eastern instant', () => {
  assert.equal(new Date(target).toISOString(), '2026-11-05T22:30:00.000Z');
  assert.equal(new Intl.DateTimeFormat('en-US', {timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit',hour:'numeric',minute:'2-digit'}).format(target), '11/05/2026, 5:30 PM');
});

test('countdown pads minutes/seconds, supports over 24h and never opens early', () => {
  assert.equal(openingText(target,target-(5*3600+39*60+23)*1000), '5:39:23 until submissions open at 5:30 pm ET.');
  assert.equal(openingText(target,target-27*3600*1000), '27:00:00 until submissions open at 5:30 pm ET.');
  assert.equal(openingText(target,target-1), '0:00:01 until submissions open at 5:30 pm ET.');
});

test('clock resumes from current wall time, reaches OPEN and never counts negative', () => {
  assert.match(openingText(target,target-2000), /^0:00:02 /);
  assert.match(openingText(target,target-1000), /^0:00:01 /);
  assert.equal(openingText(target,target), 'Idea Submissions are OPEN.');
  assert.equal(openingText(target,target+86400000), 'Idea Submissions are OPEN.');
});
