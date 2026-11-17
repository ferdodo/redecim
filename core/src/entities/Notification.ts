export interface Notification {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
}
