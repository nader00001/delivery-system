import { Injectable, inject } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { environment } from "../../../environments/environment"
import type { Client } from "../models/client.model"

@Injectable({
  providedIn: "root",
})
export class ClientService {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = `${environment.apiUrl}/clients`

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl)
  }

  getById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`)
  }

  getByAdminId(adminId: number): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/admin/${adminId}`)
  }

  create(client: Partial<Client>): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client)
  }

  update(id: number, client: Partial<Client>): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client)
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}
