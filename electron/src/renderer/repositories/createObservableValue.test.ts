import { expect, test } from 'tooling-suite';
import { createObservableValue } from './createObservableValue';

test('notifies a new observer immediately with the current value', () => {
  const value = createObservableValue(1);
  const received: number[] = [];

  value.observe((current) => received.push(current));

  expect(received).toEqual([1]);
});

test('notifies every observer on change', () => {
  const value = createObservableValue(1);
  const first: number[] = [];
  const second: number[] = [];
  value.observe((current) => first.push(current));
  value.observe((current) => second.push(current));

  value.set(2);

  expect(value.get()).toBe(2);
  expect(first).toEqual([1, 2]);
  expect(second).toEqual([1, 2]);
});
