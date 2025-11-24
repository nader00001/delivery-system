import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  HttpCode, 
  HttpStatus,
  ParseIntPipe 
} from '@nestjs/common';
import { CreateNotificationDto } from '../application/dto/notification/create-notification.dto';
import { EnvoyerNotificationDto } from '../application/dto/notification/envoyer-notification.dto';
import { EnvoyerNotificationUseCase } from '../application/use-cases/notification/envoyer-notification.use-case';
import { MarquerNotificationLueUseCase } from '../application/use-cases/notification/marquer-notification-lue.use-case';
import { GetNotificationsNonLuesUseCase } from '../application/use-cases/notification/get-notifications-non-lues.use-case';
import { INotificationRepository } from '../core/repository/notification.repository.interface';
import { Notification } from '../core/entities/notification.entity';
import { Inject } from '@nestjs/common';

@Controller('api/notifications')
export class NotificationController {
  constructor(
    private readonly envoyerNotificationUseCase: EnvoyerNotificationUseCase,
    private readonly marquerNotificationLueUseCase: MarquerNotificationLueUseCase,
    private readonly getNotificationsNonLuesUseCase: GetNotificationsNonLuesUseCase,
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  @Get()
  async findAll(): Promise<Notification[]> {
    return await this.notificationRepository.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Notification> {
    return await this.notificationRepository.findById(id);
  }

  @Get('responsable/:responsableId')
  async findByResponsableId(@Param('responsableId', ParseIntPipe) responsableId: number): Promise<Notification[]> {
    return await this.notificationRepository.findByResponsableId(responsableId);
  }

  @Get('responsable/:responsableId/non-lues')
  async findUnreadByResponsableId(@Param('responsableId', ParseIntPipe) responsableId: number): Promise<Notification[]> {
    return await this.getNotificationsNonLuesUseCase.execute(responsableId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createNotificationDto: CreateNotificationDto): Promise<Notification> {
    return await this.notificationRepository.create(createNotificationDto);
  }

  @Post('envoyer')
  @HttpCode(HttpStatus.CREATED)
  async envoyer(@Body() envoyerNotificationDto: EnvoyerNotificationDto): Promise<Notification> {
    return await this.envoyerNotificationUseCase.execute(envoyerNotificationDto);
  }

  @Put(':id/marquer-lue')
  async markAsRead(@Param('id', ParseIntPipe) id: number): Promise<Notification> {
    return await this.marquerNotificationLueUseCase.execute(id);
  }

  @Put('responsable/:responsableId/marquer-toutes-lues')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAllAsRead(@Param('responsableId', ParseIntPipe) responsableId: number): Promise<void> {
    const notifications = await this.notificationRepository.findUnreadByResponsableId(responsableId);
    for (const notif of notifications) {
      await this.notificationRepository.markAsRead(notif.idNotification);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.notificationRepository.delete(id);
  }
}
