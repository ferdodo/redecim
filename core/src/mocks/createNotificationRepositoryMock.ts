import type { Notification } from '../entities/Notification';
import type { NotificationRepository } from '../repositories/NotificationRepository';

export function createNotificationRepositoryMock(): NotificationRepository {
  let notifications: Notification[] = [];

  return {
    getNotifications(): Notification[] {
      return notifications;
    },
    addNotification(notification: Notification): void {
      notifications.push(notification);
    },
    removeNotification(id: string): void {
      notifications = notifications.filter((n) => n.id !== id);
    },
  };
}
