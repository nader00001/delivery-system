import { Injectable, inject } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { environment } from "../../../environments/environment"
import type { CatalogueCreneaux } from "../models/catalogue.model"

@Injectable({
  providedIn: "root",
})
export class CatalogueService {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = `${environment.apiUrl}/catalogues`

  getAll(): Observable<CatalogueCreneaux[]> {
    return this.http.get<CatalogueCreneaux[]>(this.apiUrl)
  }

  getById(id: number): Observable<CatalogueCreneaux> {
    return this.http.get<CatalogueCreneaux>(`${this.apiUrl}/${id}`)
  }

  getDisponibles(): Observable<CatalogueCreneaux[]> {
    return this.http.get<CatalogueCreneaux[]>(`${this.apiUrl}/disponibles`)
  }

  getByStatut(statut: string): Observable<CatalogueCreneaux[]> {
    return this.http.get<CatalogueCreneaux[]>(`${this.apiUrl}/statut/${statut}`)
  }

  getByClientId(clientId: number): Observable<CatalogueCreneaux[]> {
    return this.http.get<CatalogueCreneaux[]>(`${this.apiUrl}/client/${clientId}`)
  }

  create(catalogue: Partial<CatalogueCreneaux>): Observable<CatalogueCreneaux> {
    return this.http.post<CatalogueCreneaux>(this.apiUrl, catalogue)
  }

  update(id: number, catalogue: Partial<CatalogueCreneaux>): Observable<CatalogueCreneaux> {
    return this.http.put<CatalogueCreneaux>(`${this.apiUrl}/${id}`, catalogue)
  }

  valider(id: number, responsableId: number): Observable<CatalogueCreneaux> {
    return this.http.put<CatalogueCreneaux>(`${this.apiUrl}/${id}/valider`, { responsableId })
  }

  refuser(id: number, responsableId: number, raison: string): Observable<CatalogueCreneaux> {
    return this.http.put<CatalogueCreneaux>(`${this.apiUrl}/${id}/refuser`, { responsableId, raison })
  }
}
