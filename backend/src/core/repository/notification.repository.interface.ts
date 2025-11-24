import { Notification } from "../entities/notification.entity";

export interface INotificationRepository {
  findAll(): Promise<Notification[]>;
  findById(id: number): Promise<Notification | null>;
  findByResponsableId(responsableId: number): Promise<Notification[]>;
  findUnreadByResponsableId(responsableId: number): Promise<Notification[]>;
  create(notification: Partial<Notification>): Promise<Notification>;
  update(id: number, notification: Partial<Notification>): Promise<Notification>;
  markAsRead(id: number): Promise<Notification>;
  delete(id: number): Promise<boolean>;
}