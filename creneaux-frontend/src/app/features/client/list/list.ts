import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models/client.model';

@Component({
  selector: 'app-client-list',
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
          <i class="icon-plus"></i> Nouveau Client
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
          <div class="spinner"></div>
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
              <th>Adresse</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (client of filteredClients(); track client.idClient) {
              <tr>
                <td>
                  <div class="client-name">
                    <div class="avatar">{{ client.nom.charAt(0) }}</div>
                    <strong>{{ client.nom }}</strong>
                  </div>
                </td>
                <td>{{ client.entreprise || '-' }}</td>
                <td>{{ client.email }}</td>
                <td>{{ client.telephone }}</td>
                <td>{{ client.adresse || '-' }}</td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-icon" [routerLink]="[client.idClient]" title="Détails">
                      👁️
                    </button>
                    <button class="btn-icon" [routerLink]="['edit', client.idClient]" title="Modifier">
                      ✏️
                    </button>
                    <button class="btn-icon btn-danger" (click)="deleteClient(client)" title="Supprimer">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="empty-row">
                  Aucun client trouvé
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .client-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .filters-section {
      background: var(--bg-primary);
      padding: 1.5rem;
      border-radius: var(--radius-lg);
      margin-bottom: 2rem;
      box-shadow: var(--shadow-sm);
    }

    .search-box input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
    }

    .client-name {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      padding: 0.5rem;
      border: none;
      background: var(--bg-secondary);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: var(--transition);
    }

    .btn-icon:hover {
      background: var(--border-color);
      transform: scale(1.1);
    }

    .btn-icon.btn-danger:hover {
      background: rgba(239, 68, 68, 0.1);
    }

    .empty-row {
      text-align: center;
      padding: 3rem !important;
      color: var(--text-secondary);
    }

    @media (max-width: 768px) {
      .table-container {
        overflow-x: auto;
      }

      table {
        min-width: 800px;
      }
    }
  `]
})
export class ClientListComponent implements OnInit {
  private readonly clientService = inject(ClientService);

  clients = signal<Client[]>([]);
  filteredClients = signal<Client[]>([]);
  loading = signal<boolean>(false);
  searchTerm = '';

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading.set(true);
    this.clientService.getAll().subscribe({
      next: (data) => {
        this.clients.set(data);
        this.filteredClients.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erreur', error);
        this.loading.set(false);
      }
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    const filtered = this.clients().filter(c =>
      c.nom.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.entreprise?.toLowerCase().includes(term) ||
      c.telephone.includes(term)
    );
    this.filteredClients.set(filtered);
  }

  deleteClient(client: Client): void {
    if (!confirm(`Supprimer ${client.nom} ?`)) return;

    this.clientService.delete(client.idClient).subscribe({
      next: () => {
        this.loadClients();
        alert('Client supprimé');
      },
      error: (error) => {
        console.error('Erreur suppression', error);
        alert('Erreur lors de la suppression');
      }
    });
  }
}
