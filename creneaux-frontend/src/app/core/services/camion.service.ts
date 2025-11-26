import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Camion } from '../models/camion.model';

@Injectable({
  providedIn: 'root'
})
export class CamionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/camions`;

  /**
   * Récupérer tous les camions
   */
  getAll(): Observable<Camion[]> {
    return this.http.get<Camion[]>(this.apiUrl);
  }

  /**
   * Récupérer un camion par ID
   */
  getById(id: number): Observable<Camion> {
    return this.http.get<Camion>(`${this.apiUrl}/${id}`);
  }

  /**
   * Rechercher des camions par nom de chauffeur
   */
  getByChauffeur(chauffeur: string): Observable<Camion[]> {
    return this.http.get<Camion[]>(`${this.apiUrl}/chauffeur?nom=${chauffeur}`);
  }

  /**
   * Créer un nouveau camion
   */
  create(camion: Partial<Camion>): Observable<Camion> {
    return this.http.post<Camion>(this.apiUrl, camion);
  }

  /**
   * Mettre à jour un camion
   */
  update(id: number, camion: Partial<Camion>): Observable<Camion> {
    return this.http.put<Camion>(`${this.apiUrl}/${id}`, camion);
  }

  /**
   * Supprimer un camion
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
