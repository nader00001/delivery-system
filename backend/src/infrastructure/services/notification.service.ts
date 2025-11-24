import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { INotificationRepository } from '../../core/repository/notification.repository.interface';
import { Notification } from '../../core/entities/notification.entity';
import { ResponsableMagasin } from 'src/core/entities/responsable-magasin.entity';
import { CatalogueCreneaux } from 'src/core/entities/catalogue_creneaux.entity';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async findAll(): Promise<Notification[]> {
    return await this.notificationRepository.findAll();
  }

  async findById(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundException(`Notification avec l'ID ${id} introuvable`);
    }
    return notification;
  }

  async findByResponsableId(responsableId: number): Promise<Notification[]> {
    return await this.notificationRepository.findByResponsableId(responsableId);
  }

  async findUnreadByResponsableId(responsableId: number): Promise<Notification[]> {
    return await this.notificationRepository.findUnreadByResponsableId(responsableId);
  }

  async create(notificationData: Partial<Notification>): Promise<Notification> {
    return await this.notificationRepository.create(notificationData);
  }

  async envoyerNotification(
    responsable: ResponsableMagasin,
    type: string,
    message: string,
    catalogue?: CatalogueCreneaux,
  ): Promise<Notification> {
    return await this.notificationRepository.create({
      responsable,
      type,
      message,
      catalogue,
      lue: false,
    });
  }

  async update(id: number, notificationData: Partial<Notification>): Promise<Notification> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundException(`Notification avec l'ID ${id} introuvable`);
    }
    return await this.notificationRepository.update(id, notificationData);
  }

  async markAsRead(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundException(`Notification avec l'ID ${id} introuvable`);
    }
    return await this.notificationRepository.markAsRead(id);
  }

  async markAllAsReadForResponsable(responsableId: number): Promise<void> {
    const notifications = await this.notificationRepository.findUnreadByResponsableId(responsableId);
    for (const notif of notifications) {
      await this.notificationRepository.markAsRead(notif.idNotification);
    }
  }

  async delete(id: number): Promise<boolean> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundException(`Notification avec l'ID ${id} introuvable`);
    }
    return await this.notificationRepository.delete(id);
  }
}
