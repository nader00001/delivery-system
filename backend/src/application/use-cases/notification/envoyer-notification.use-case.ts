import { Injectable, Inject } from '@nestjs/common';
import { INotificationRepository } from '../../../core/repository/notification.repository.interface';
import { Notification } from '../../../core/entities/notification.entity';
import { EnvoyerNotificationDto } from '../../dto/notification/envoyer-notification.dto';

@Injectable()
export class EnvoyerNotificationUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(dto: EnvoyerNotificationDto): Promise<Notification> {
    return await this.notificationRepository.create({
      type: dto.type,
      message: dto.message,
      responsable: dto.responsableId,
      catalogue: dto.catalogueId,
      lue: false,
      dateEnvoi: new Date(),
    });
  }
}
