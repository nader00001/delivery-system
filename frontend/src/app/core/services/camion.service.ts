import { Injectable, inject } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { environment } from "../../../environments/environment"
import type { Camion } from "../models/camion.model"

@Injectable({
  providedIn: "root",
})
export class CamionService {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = `${environment.apiUrl}/camions`

  getAll(): Observable<Camion[]> {
    return this.http.get<Camion[]>(this.apiUrl)
  }

  getById(id: number): Observable<Camion> {
    return this.http.get<Camion>(`${this.apiUrl}/${id}`)
  }

  create(camion: Partial<Camion>): Observable<Camion> {
    return this.http.post<Camion>(this.apiUrl, camion)
  }

  update(id: number, camion: Partial<Camion>): Observable<Camion> {
    return this.http.put<Camion>(`${this.apiUrl}/${id}`, camion)
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}
