import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification } from '../../../core/models/notification.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-container">
      <div class="page-header">
        <div>
          <h2>Notifications</h2>
          <p class="subtitle">Centre de notifications</p>
        </div>
        <button
          class="btn btn-outline"
          (click)="markAllAsRead()"
          [disabled]="unreadNotifications().length === 0">
          Tout marquer comme lu
        </button>
      </div>

      <div class="notifications-tabs">
        <button
          class="tab"
          [class.active]="activeTab() === 'all'"
          (click)="activeTab.set('all')">
          Toutes ({{ allNotifications().length }})
        </button>
        <button
          class="tab"
          [class.active]="activeTab() === 'unread'"
          (click)="activeTab.set('unread')">
          Non lues ({{ unreadNotifications().length }})
        </button>
      </div>

      <div class="notifications-list">
        @if (displayedNotifications().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">🔔</div>
            <h3>Aucune notification</h3>
            <p>Vous êtes à jour !</p>
          </div>
        }

        @for (notif of displayedNotifications(); track notif.idNotification) {
          <div
            class="notification-item"
            [class.unread]="!notif.lue"
            [class]="'type-' + notif.type"
            (click)="markAsRead(notif)">

            <div class="notif-icon">
              {{ getNotificationIcon(notif.type) }}
            </div>

            <div class="notif-content">
              <div class="notif-header">
                <span class="notif-type">{{ getNotificationTypeLabel(notif.type) }}</span>
                <span class="notif-time">{{ formatDate(notif.dateEnvoi) }}</span>
              </div>
              <p class="notif-message">{{ notif.message }}</p>
            </div>

            @if (!notif.lue) {
              <div class="unread-indicator"></div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      padding: 2rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .notifications-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      background: var(--bg-primary);
      padding: 0.5rem;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }

    .tab {
      flex: 1;
      padding: 0.75rem 1.5rem;
      border: none;
      background: transparent;
      color: var(--text-secondary);
      font-weight: 600;
      cursor: pointer;
      border-radius: var(--radius-md);
      transition: var(--transition);
    }

    .tab.active {
      background: var(--primary-color);
      color: white;
    }

    .notifications-list {
      background: var(--bg-primary);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }

    .notification-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-color);
      cursor: pointer;
      transition: var(--transition);
      position: relative;
    }

    .notification-item:hover {
      background: var(--bg-secondary);
    }

    .notification-item:last-child {
      border-bottom: none;
    }

    .notification-item.unread {
      background: rgba(59, 130, 246, 0.05);
    }

    .notif-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .type-validation .notif-icon {
      background: rgba(16, 185, 129, 0.1);
    }

    .type-refus .notif-icon {
      background: rgba(239, 68, 68, 0.1);
    }

    .type-info .notif-icon {
      background: rgba(59, 130, 246, 0.1);
    }

    .type-alerte .notif-icon {
      background: rgba(245, 158, 11, 0.1);
    }

    .notif-content {
      flex: 1;
    }

    .notif-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .notif-type {
      font-weight: 700;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .type-validation .notif-type {
      color: var(--success-color);
    }

    .type-refus .notif-type {
      color: var(--danger-color);
    }

    .type-info .notif-type {
      color: var(--info-color);
    }

    .type-alerte .notif-type {
      color: var(--warning-color);
    }

    .notif-time {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .notif-message {
      margin: 0;
      color: var(--text-color);
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .unread-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--primary-color);
      position: absolute;
      right: 1.5rem;
      top: 50%;
      transform: translateY(-50%);
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.3;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .notification-item {
        flex-direction: column;
        align-items: flex-start;
      }

      .unread-indicator {
        top: 1.5rem;
        right: 1rem;
      }
    }
  `]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private readonly notificationService = inject(NotificationService);

  allNotifications = signal<Notification[]>([]);
  unreadNotifications = signal<Notification[]>([]);
  activeTab = signal<'all' | 'unread'>('all');
  private pollingSubscription?: Subscription;

  ngOnInit(): void {
    this.loadNotifications();
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
  }

  loadNotifications(): void {
    const responsableId = 1; // TODO: Get from context

    this.notificationService.getByResponsableId(responsableId).subscribe({
      next: (data) => this.allNotifications.set(data)
    });

    this.notificationService.getUnreadByResponsableId(responsableId).subscribe({
      next: (data) => this.unreadNotifications.set(data)
    });
  }

  startPolling(): void {
    const responsableId = 1;
    this.pollingSubscription = this.notificationService
      .startPolling(responsableId)
      .subscribe({
        next: (data) => {
          this.unreadNotifications.set(data);
          this.loadNotifications();
        }
      });
  }

  displayedNotifications(): Notification[] {
    return this.activeTab() === 'all'
      ? this.allNotifications()
      : this.unreadNotifications();
  }

  markAsRead(notif: Notification): void {
    if (notif.lue) return;

    this.notificationService.markAsRead(notif.idNotification).subscribe({
      next: () => this.loadNotifications()
    });
  }

  markAllAsRead(): void {
    const responsableId = 1;
    this.notificationService.markAllAsRead(responsableId).subscribe({
      next: () => this.loadNotifications()
    });
  }

  getNotificationIcon(type: string): string {
    const icons: Record<string, string> = {
      validation: '✅',
      refus: '❌',
      info: 'ℹ️',
      alerte: '⚠️'
    };
    return icons[type] || '📢';
  }

  getNotificationTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      validation: 'Validation',
      refus: 'Refus',
      info: 'Information',
      alerte: 'Alerte'
    };
    return labels[type] || type;
  }

  formatDate(date: Date): string {
    const now = new Date();
    const notifDate = new Date(date);
    const diff = now.getTime() - notifDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return notifDate.toLocaleDateString('fr-FR');
  }
}
