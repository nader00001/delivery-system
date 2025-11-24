import { Injectable, inject } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { environment } from "../../../environments/environment"
import type { Admin } from "../models/admin.model"

@Injectable({
  providedIn: "root",
})
export class AdminService {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = `${environment.apiUrl}/admins`

  getAll(): Observable<Admin[]> {
    return this.http.get<Admin[]>(this.apiUrl)
  }

  getById(id: number): Observable<Admin> {
    return this.http.get<Admin>(`${this.apiUrl}/${id}`)
  }

  create(admin: Partial<Admin>): Observable<Admin> {
    return this.http.post<Admin>(this.apiUrl, admin)
  }

  update(id: number, admin: Partial<Admin>): Observable<Admin> {
    return this.http.put<Admin>(`${this.apiUrl}/${id}`, admin)
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  login(email: string, motDePasse: string): Observable<{ success: boolean; admin?: Admin }> {
    return this.http.post<{ success: boolean; admin?: Admin }>(`${this.apiUrl}/login`, {
      email,
      motDePasse,
    })
  }
}
