import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Trajectoire } from '../models/trajectoire.model';

@Injectable({
  providedIn: 'root'
})
export class TrajectoireService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/trajectoires`;

  getAll(): Observable<Trajectoire[]> {
    return this.http.get<Trajectoire[]>(this.apiUrl);
  }

  getById(id: number): Observable<Trajectoire> {
    return this.http.get<Trajectoire>(`${this.apiUrl}/${id}`);
  }

  getByCatalogueId(catalogueId: number): Observable<Trajectoire[]> {
    return this.http.get<Trajectoire[]>(`${this.apiUrl}/catalogue/${catalogueId}`);
  }

  getByCamionId(camionId: number): Observable<Trajectoire> {
    return this.http.get<Trajectoire>(`${this.apiUrl}/camion/${camionId}`);
  }

  updatePosition(id: number, latitude: number, longitude: number): Observable<Trajectoire> {
    return this.http.put<Trajectoire>(`${this.apiUrl}/${id}/position`, { latitude, longitude });
  }

  confirmerArrivee(id: number, responsableId: number): Observable<Trajectoire> {
    return this.http.put<Trajectoire>(`${this.apiUrl}/${id}/confirmer-arrivee`, { responsableId });
  }
}
