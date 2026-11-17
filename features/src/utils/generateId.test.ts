import { test, expect } from 'tooling-suite';
import { generateId } from './generateId';

test('generateId produces unique IDs', () => {
  const id1 = generateId();
  const id2 = generateId();

  expect(id1).not.toBe(id2);
});

test('generateId produces non-empty strings', () => {
  const id = generateId();

  expect(typeof id).toBe('string');
  expect(id.length).toBeGreaterThan(0);
});

test('generateId contains hyphen', () => {
  const id = generateId();

  expect(id).toContain('-');
});
