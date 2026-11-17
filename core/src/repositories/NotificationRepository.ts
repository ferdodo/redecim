import type { Notification } from '../entities/Notification';

export interface NotificationRepository {
  getNotifications(): Notification[];
  addNotification(notification: Notification): void;
  removeNotification(id: string): void;
}
