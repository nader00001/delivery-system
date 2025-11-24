import { Injectable, inject } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { environment } from "../../../environments/environment"
import type { ResponsableMagasin } from "../models/responsable.model"

@Injectable({
  providedIn: "root",
})
export class ResponsableService {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = `${environment.apiUrl}/responsables`

  getAll(): Observable<ResponsableMagasin[]> {
    return this.http.get<ResponsableMagasin[]>(this.apiUrl)
  }

  getById(id: number): Observable<ResponsableMagasin> {
    return this.http.get<ResponsableMagasin>(`${this.apiUrl}/${id}`)
  }

  create(responsable: Partial<ResponsableMagasin>): Observable<ResponsableMagasin> {
    return this.http.post<ResponsableMagasin>(this.apiUrl, responsable)
  }

  update(id: number, responsable: Partial<ResponsableMagasin>): Observable<ResponsableMagasin> {
    return this.http.put<ResponsableMagasin>(`${this.apiUrl}/${id}`, responsable)
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  login(email: string, motDePasse: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, {
      email,
      motDePasse,
    })
  }
}
