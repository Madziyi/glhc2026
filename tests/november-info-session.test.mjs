import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const html = read('../src/pages/index.astro');
const info = read('../src/components/NovemberInfoSession.astro');
const behavior = read('../src/scripts/glhc003/november-event.js');
const css = read('../src/styles/glhc003.css');
const calendar = read('../public/downloads/Great_Lakes_Hackathon_Info_Session_Nov_26_2026.ics');

test('header has an info-session CTA alongside the existing Submit An Idea CTA', () => {
  assert.match(html, /data-event-trigger href="#november-info-session">Attend the Info Session/);
  assert.match(html, /data-submission-trigger href="#submission-options">Submit An Idea/);
  assert.equal((html.match(/<NovemberInfoSession \/>/g) || []).length, 2);
  assert.match(html, /id="november-event-dialog"[^>]*aria-labelledby="november-event-title"/);
  assert.match(html, /id="november-info-session"[^>]*aria-labelledby="event-fallback-title"/);
});

test('event details and map destination are identical in modal and no-JS fallback', () => {
  assert.match(info, /2026-11-26T17:30:00-05:00/);
  assert.match(info, /Thursday, November 26, 2026 · 5:30 PM ET/);
  assert.match(info, /2nd Floor · Next to the Engineering Building/);
  assert.match(info, /2455 Wyandotte Street West, Windsor, ON/);
  assert.match(info, /https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=/);
  assert.match(info, /target="_blank" rel="noopener noreferrer"/);
  assert.match(info, /Open in Google Maps/);
});

test('dialog opens accessibly and restores focus, retaining no-JS access', () => {
  assert.match(behavior, /dialog\.showModal\(\)/);
  assert.match(behavior, /opener = trigger/);
  assert.match(behavior, /opener\.focus\(\{ preventScroll: true \}\)/);
  assert.match(behavior, /event\.target === dialog/);
  assert.match(css, /\.has-event-dialog #november-info-session\{display:none\}/);
  assert.match(css, /\.header-event__date\{display:none\}/);
});

test('add-to-calendar selector offers prefilled Google and imported native calendar formats', () => {
  assert.ok(info.indexOf('event-details__map') < info.indexOf('event-details__calendar'));
  assert.ok(info.includes('Add to Calendar'));
  assert.ok(info.includes('calendar.google.com/calendar/render?action=TEMPLATE'));
  assert.ok(info.includes('20261126T223000Z%2F20261126T233000Z'));
  assert.ok(info.includes('Apple, Outlook &amp; other calendars (.ics)'));
  assert.ok(info.includes('actual end time is not confirmed'));
  assert.ok(calendar.includes('DTSTART:20261126T223000Z'));
  assert.ok(calendar.includes('DTEND:20261126T233000Z'));
  assert.ok(calendar.includes('TRIGGER:-P1D'));
  assert.ok(calendar.includes('TRIGGER:-PT1H'));
  assert.ok(calendar.includes('BEGIN:VEVENT'));
  assert.ok(calendar.includes('END:VCALENDAR'));
});
