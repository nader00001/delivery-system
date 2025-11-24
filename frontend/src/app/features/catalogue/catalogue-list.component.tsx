import { Component, type OnInit, inject, signal } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { CatalogueService } from "../../core/services/catalogue.service"
import type { CatalogueCreneaux } from "../../core/models/catalogue.model"

@Component({
  selector: "app-catalogue-list",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="catalogue-container">
      <div class="page-header">
        <div>
          <h2>Gestion des Créneaux</h2>
          <p class="subtitle">Gérez vos créneaux de livraison</p>
        </div>
        <button class="btn btn-primary" [routerLink]="['create']">
          Nouveau Créneau
        </button>
      </div>

      <div class="filters-section">
        <div class="filter-group">
          <select [(ngModel)]="selectedStatus" (change)="onFilterChange()">
            <option value="">Tous les statuts</option>
            <option value="disponible">Disponible</option>
            <option value="reserve">Réservé</option>
            <option value="valide">Validé</option>
            <option value="refuse">Refusé</option>
          </select>
        </div>
      </div>

      @if (loading()) {
        <div class="loading-state">
          <p>Chargement...</p>
        </div>
      }

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Date Début</th>
              <th>Date Fin</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (cat of filteredCatalogues(); track cat.idCatalogue) {
              <tr>
                <td>{{ cat.client?.nom || '-' }}</td>
                <td>{{ cat.dateDebut | date: 'dd/MM/yyyy HH:mm' }}</td>
                <td>{{ cat.dateFin | date: 'dd/MM/yyyy HH:mm' }}</td>
                <td>
                  <span class="status" [class]="'status-' + cat.statut">
                    {{ cat.statut }}
                  </span>
                </td>
                <td class="actions-cell">
                  <button class="btn-sm" [routerLink]="['edit', cat.idCatalogue]">
                    Modifier
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>

        @if (filteredCatalogues().length === 0 && !loading()) {
          <div class="empty-state">
            <p>Aucun créneau trouvé</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
    .catalogue-container {
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
      display: flex;
      gap: 1rem;
    }

    .filter-group select {
      padding: 0.75rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.25rem;
      font-size: 1rem;
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

    .status {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .status-disponible {
      background: #d1fae5;
      color: #065f46;
    }

    .status-reserve {
      background: #fef3c7;
      color: #92400e;
    }

    .status-valide {
      background: #dcfce7;
      color: #166534;
    }

    .status-refuse {
      background: #fee2e2;
      color: #991b1b;
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
    }

    .loading-state, .empty-state {
      text-align: center;
      padding: 2rem;
      color: var(--text-secondary);
    }
  `,
  ],
})
export class CatalogueListComponent implements OnInit {
  private readonly catalogueService = inject(CatalogueService)

  catalogues = signal<CatalogueCreneaux[]>([])
  filteredCatalogues = signal<CatalogueCreneaux[]>([])
  loading = signal<boolean>(false)
  selectedStatus = ""

  ngOnInit(): void {
    this.loadCatalogues()
  }

  loadCatalogues(): void {
    this.loading.set(true)
    this.catalogueService.getAll().subscribe({
      next: (catalogues) => {
        this.catalogues.set(catalogues)
        this.filteredCatalogues.set(catalogues)
        this.loading.set(false)
      },
      error: (error) => {
        console.error("Erreur chargement catalogues", error)
        this.loading.set(false)
      },
    })
  }

  onFilterChange(): void {
    if (this.selectedStatus) {
      this.filteredCatalogues.set(this.catalogues().filter((c) => c.statut === this.selectedStatus))
    } else {
      this.filteredCatalogues.set(this.catalogues())
    }
  }
}
