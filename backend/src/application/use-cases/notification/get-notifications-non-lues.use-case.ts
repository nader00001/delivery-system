import { Injectable, Inject } from '@nestjs/common';
import { INotificationRepository } from '../../../core/repository/notification.repository.interface';
import { Notification } from '../../../core/entities/notification.entity';

@Injectable()
export class GetNotificationsNonLuesUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(responsableId: number): Promise<Notification[]> {
    return await this.notificationRepository.findUnreadByResponsableId(responsableId);
  }
}