import { Injectable, inject, signal } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { type Observable, interval } from "rxjs"
import { switchMap, tap } from "rxjs/operators"
import { environment } from "../../../environments/environment"
import type { Notification } from "../models/notification.model"

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = `${environment.apiUrl}/notifications`

  unreadCount = signal<number>(0)

  getByResponsableId(responsableId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/responsable/${responsableId}`)
  }

  getUnreadByResponsableId(responsableId: number): Observable<Notification[]> {
    return this.http
      .get<Notification[]>(`${this.apiUrl}/responsable/${responsableId}/non-lues`)
      .pipe(tap((notifications) => this.unreadCount.set(notifications.length)))
  }

  create(notification: Partial<Notification>): Observable<Notification> {
    return this.http.post<Notification>(this.apiUrl, notification)
  }

  markAsRead(id: number): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}/${id}/marquer-lue`, {})
  }

  markAllAsRead(responsableId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/responsable/${responsableId}/marquer-toutes-lues`, {})
  }

  startPolling(responsableId: number): Observable<Notification[]> {
    return interval(30000).pipe(switchMap(() => this.getUnreadByResponsableId(responsableId)))
  }
}
