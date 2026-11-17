import type { Notification, NotificationRepository } from 'core';

export function createInMemoryNotificationRepository(): NotificationRepository {
  let notifications: Notification[] = [];

  return {
    getNotifications(): Notification[] {
      return notifications;
    },
    addNotification(notification: Notification): void {
      notifications = [...notifications, notification];
    },
    removeNotification(id: string): void {
      notifications = notifications.filter((notification) => notification.id !== id);
    },
  };
}
