import { Component, type OnInit, inject, signal } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { ClientService } from "../../core/services/client.service"
import type { Client } from "../../core/models/client.model"

@Component({
  selector: "app-client-list",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="client-container">
      <div class="page-header">
        <div>
          <h2>Gestion des Clients</h2>
          <p class="subtitle">Gérez votre base de clients</p>
        </div>
        <button class="btn btn-primary" [routerLink]="['create']">
          Nouveau Client
        </button>
      </div>

      <div class="filters-section">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Rechercher par nom, entreprise, email..." 
            [(ngModel)]="searchTerm"
            (input)="onSearch()">
        </div>
      </div>

      @if (loading()) {
        <div class="loading-state">
          <p>Chargement des clients...</p>
        </div>
      }

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Entreprise</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (client of filteredClients(); track client.idClient) {
              <tr>
                <td>{{ client.nom }}</td>
                <td>{{ client.entreprise || '-' }}</td>
                <td>{{ client.email }}</td>
                <td>{{ client.telephone }}</td>
                <td class="actions-cell">
                  <button class="btn-sm" [routerLink]="['edit', client.idClient]">
                    Modifier
                  </button>
                  <button class="btn-sm btn-danger" (click)="deleteClient(client.idClient)">
                    Supprimer
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>

        @if (filteredClients().length === 0 && !loading()) {
          <div class="empty-state">
            <p>Aucun client trouvé</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
    .client-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .page-header h2 {
      margin: 0;
      color: var(--text-color);
    }

    .subtitle {
      color: var(--text-secondary);
      margin: 0.5rem 0 0;
    }

    .btn-primary {
      background: var(--primary-color);
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.25rem;
      font-weight: 600;
      cursor: pointer;
    }

    .filters-section {
      margin-bottom: 2rem;
    }

    .search-box input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.25rem;
      font-size: 1rem;
    }

    .search-box input:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    .table-container {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background: #f9fafb;
      border-bottom: 2px solid #e5e7eb;
    }

    th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: var(--text-color);
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
      color: var(--text-color);
    }

    tr:last-child td {
      border-bottom: none;
    }

    .actions-cell {
      display: flex;
      gap: 0.5rem;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.25rem;
      background: var(--primary-color);
      color: white;
      font-size: 0.875rem;
      cursor: pointer;
      transition: opacity 0.3s;
    }

    .btn-sm:hover {
      opacity: 0.9;
    }

    .btn-danger {
      background: #ef4444;
    }

    .loading-state {
      text-align: center;
      padding: 2rem;
      color: var(--text-secondary);
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-secondary);
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }

      table {
        font-size: 0.875rem;
      }

      th, td {
        padding: 0.75rem;
      }
    }
  `,
  ],
})
export class ClientListComponent implements OnInit {
  private readonly clientService = inject(ClientService)

  clients = signal<Client[]>([])
  filteredClients = signal<Client[]>([])
  loading = signal<boolean>(false)
  searchTerm = ""

  ngOnInit(): void {
    this.loadClients()
  }

  loadClients(): void {
    this.loading.set(true)
    this.clientService.getAll().subscribe({
      next: (clients) => {
        this.clients.set(clients)
        this.filteredClients.set(clients)
        this.loading.set(false)
      },
      error: (error) => {
        console.error("Erreur chargement clients", error)
        this.loading.set(false)
      },
    })
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase()
    this.filteredClients.set(
      this.clients().filter(
        (c) =>
          c.nom.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term) ||
          (c.entreprise?.toLowerCase().includes(term) ?? false),
      ),
    )
  }

  deleteClient(id: number): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce client?")) {
      this.clientService.delete(id).subscribe({
        next: () => this.loadClients(),
        error: (error) => console.error("Erreur suppression", error),
      })
    }
  }
}
