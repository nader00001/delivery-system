import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponsableMagasin } from '../models/responsable.model';

@Injectable({
  providedIn: 'root'
})
export class ResponsableMagasinService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/responsables`;

  /**
   * Récupérer tous les responsables de magasin
   */
  getAll(): Observable<ResponsableMagasin[]> {
    return this.http.get<ResponsableMagasin[]>(this.apiUrl);
  }

  /**
   * Récupérer uniquement les responsables actifs
   */
  getActifs(): Observable<ResponsableMagasin[]> {
    return this.http.get<ResponsableMagasin[]>(`${this.apiUrl}/actifs`);
  }

  /**
   * Récupérer un responsable par ID
   */
  getById(id: number): Observable<ResponsableMagasin> {
    return this.http.get<ResponsableMagasin>(`${this.apiUrl}/${id}`);
  }

  /**
   * Récupérer un responsable par email
   */
  getByEmail(email: string): Observable<ResponsableMagasin> {
    return this.http.get<ResponsableMagasin>(`${this.apiUrl}/email/${email}`);
  }

  /**
   * Créer un nouveau responsable
   */
  create(responsable: Partial<ResponsableMagasin>): Observable<ResponsableMagasin> {
    return this.http.post<ResponsableMagasin>(this.apiUrl, responsable);
  }

  /**
   * Mettre à jour un responsable
   */
  update(id: number, responsable: Partial<ResponsableMagasin>): Observable<ResponsableMagasin> {
    return this.http.put<ResponsableMagasin>(`${this.apiUrl}/${id}`, responsable);
  }

  /**
   * Activer un compte responsable
   */
  activer(id: number): Observable<ResponsableMagasin> {
    return this.http.put<ResponsableMagasin>(`${this.apiUrl}/${id}/activer`, {});
  }

  /**
   * Désactiver un compte responsable
   */
  desactiver(id: number): Observable<ResponsableMagasin> {
    return this.http.put<ResponsableMagasin>(`${this.apiUrl}/${id}/desactiver`, {});
  }

  /**
   * Supprimer un responsable
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Connexion responsable magasin
   * @returns { success: boolean, responsable?: ResponsableMagasin }
   */
  login(email: string, motDePasse: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, {
      email,
      motDePasse
    });
  }
}
