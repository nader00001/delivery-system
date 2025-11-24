import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { INotificationRepository } from '../../core/repository/notification.repository.interface';
import { Notification } from '../../core/entities/notification.entity';
import { NotificationTypeORM } from '../database/notification.orm.entity';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(
    @InjectRepository(NotificationTypeORM)
    private readonly repository: Repository<NotificationTypeORM>,
  ) {}

  private toDomain(orm: NotificationTypeORM): Notification {
    const notification = new Notification();
    notification.idNotification = orm.idNotification;
    notification.type = orm.type;
    notification.message = orm.message;
    notification.dateEnvoi = orm.dateEnvoi;
    notification.lue = orm.lue;
    notification.catalogue.idCatalogue = orm.idCatalogue;
    notification.responsable.idResponsable = orm.idResponsable;
    return notification;
  }

  private toOrm(domain: Partial<Notification>): Partial<NotificationTypeORM> {
    const orm = new NotificationTypeORM();
    if (domain.idNotification) orm.idNotification = domain.idNotification;
    if (domain.type) orm.type = domain.type;
    if (domain.message) orm.message = domain.message;
    if (domain.dateEnvoi) orm.dateEnvoi = domain.dateEnvoi;
    if (domain.lue !== undefined) orm.lue = domain.lue;
    if (domain.catalogue.idCatalogue) orm.idCatalogue = domain.catalogue.idCatalogue;
    if (domain.responsable.idResponsable) orm.idResponsable = domain.responsable.idResponsable;
    return orm;
  }

  async findAll(): Promise<Notification[]> {
    const notifications = await this.repository.find();
    return notifications.map(this.toDomain);
  }

  async findById(id: number): Promise<Notification | null> {
    const notification = await this.repository.findOne({ where: { idNotification: id } });
    return notification ? this.toDomain(notification) : null;
  }

  async findByResponsableId(responsableId: number): Promise<Notification[]> {
    const notifications = await this.repository.find({ 
      where: { idResponsable: responsableId },
      order: { dateEnvoi: 'DESC' }
    });
    return notifications.map(this.toDomain);
  }

  async findUnreadByResponsableId(responsableId: number): Promise<Notification[]> {
    const notifications = await this.repository.find({ 
      where: { idResponsable: responsableId, lue: false },
      order: { dateEnvoi: 'DESC' }
    });
    return notifications.map(this.toDomain);
  }

  async create(notification: Partial<Notification>): Promise<Notification> {
    const orm = this.repository.create(this.toOrm(notification));
    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }

  async update(id: number, notification: Partial<Notification>): Promise<Notification> {
    await this.repository.update(id, this.toOrm(notification));
    const updated = await this.repository.findOne({ where: { idNotification: id } });
    return this.toDomain(updated);
  }

  async markAsRead(id: number): Promise<Notification> {
    await this.repository.update(id, { lue: true });
    const updated = await this.repository.findOne({ where: { idNotification: id } });
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }
}
