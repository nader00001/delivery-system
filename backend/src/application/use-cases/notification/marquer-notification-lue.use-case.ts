import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { INotificationRepository } from '../../../core/repository/notification.repository.interface';
import { Notification } from '../../../core/entities/notification.entity';

@Injectable()
export class MarquerNotificationLueUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(notificationId: number): Promise<Notification> {
    const notification = await this.notificationRepository.findById(notificationId);
    if (!notification) {
      throw new NotFoundException(`Notification avec l'ID ${notificationId} introuvable`);
    }

    return await this.notificationRepository.markAsRead(notificationId);
  }
}
