import { test, expect } from 'tooling-suite';
import { getErrorMessage } from './getErrorMessage';
import { FileSystemError } from 'core';

test('getErrorMessage returns PATH_NOT_FOUND message', () => {
  const message = getErrorMessage(FileSystemError.PATH_NOT_FOUND);
  expect(message).toBe('Path not found');
});

test('getErrorMessage returns PERMISSION_DENIED message', () => {
  const message = getErrorMessage(FileSystemError.PERMISSION_DENIED);
  expect(message).toBe('Permission denied');
});

test('getErrorMessage returns NOT_A_DIRECTORY message', () => {
  const message = getErrorMessage(FileSystemError.NOT_A_DIRECTORY);
  expect(message).toBe('Path is not a directory');
});

test('getErrorMessage returns INVALID_PATH message', () => {
  const message = getErrorMessage(FileSystemError.INVALID_PATH);
  expect(message).toBe('Invalid path');
});

test('getErrorMessage returns IO_ERROR message', () => {
  const message = getErrorMessage(FileSystemError.IO_ERROR);
  expect(message).toBe('File access error');
});
