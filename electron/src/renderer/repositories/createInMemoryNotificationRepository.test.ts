import { expect, test } from 'tooling-suite';
import { createInMemoryNotificationRepository } from './createInMemoryNotificationRepository';

test('adds and removes notifications by id', () => {
  const repository = createInMemoryNotificationRepository();

  repository.addNotification({ id: 'a', type: 'error', message: 'Path not found' });
  repository.addNotification({ id: 'b', type: 'info', message: 'Done' });
  repository.removeNotification('a');

  expect(repository.getNotifications()).toEqual([{ id: 'b', type: 'info', message: 'Done' }]);
});
