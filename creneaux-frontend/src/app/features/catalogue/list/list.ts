import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CatalogueService } from '../../../core/services/catalogue.service';
import { CatalogueCreneaux } from '../../../core/models/catalogue.model';

@Component({
  selector: 'app-catalogue-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="catalogue-container">
      <div class="page-header">
        <div>
          <h2>Gestion des Créneaux</h2>
          <p class="subtitle">Gérez vos créneaux horaires de livraison</p>
        </div>
        <button class="btn btn-primary" [routerLink]="['create']">
          <i class="icon-plus"></i> Nouveau Créneau
        </button>
      </div>

      <div class="filters-section">
        <div class="filter-group">
          <label>Statut</label>
          <select [(ngModel)]="selectedStatut" (change)="filterByStatut()">
            <option value="">Tous</option>
            <option value="disponible">Disponible</option>
            <option value="reserve">Réservé</option>
            <option value="valide">Validé</option>
            <option value="refuse">Refusé</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Recherche</label>
          <input
            type="text"
            placeholder="Rechercher..."
            [(ngModel)]="searchTerm"
            (input)="onSearch()">
        </div>
      </div>

      @if (loading()) {
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Chargement des créneaux...</p>
        </div>
      }

      @if (!loading() && filteredCatalogues().length === 0) {
        <div class="empty-state">
          <div class="empty-icon">📅</div>
          <h3>Aucun créneau trouvé</h3>
          <p>Créez votre premier créneau pour commencer</p>
          <button class="btn btn-primary" [routerLink]="['create']">
            Créer un créneau
          </button>
        </div>
      }

      <div class="grid grid-cols-3">
        @for (catalogue of filteredCatalogues(); track catalogue.idCatalogue) {
          <div class="catalogue-card fade-in">
            <div class="card-status" [class]="'status-' + catalogue.statut">
              {{ getStatutLabel(catalogue.statut) }}
            </div>

            <div class="card-content">
              <div class="date-section">
                <div class="date-item">
                  <label>Début</label>
                  <div class="date-value">
                    {{ catalogue.dateDebut | date:'dd/MM/yyyy HH:mm' }}
                  </div>
                </div>
                <div class="date-divider">→</div>
                <div class="date-item">
                  <label>Fin</label>
                  <div class="date-value">
                    {{ catalogue.dateFin | date:'dd/MM/yyyy HH:mm' }}
                  </div>
                </div>
              </div>

              @if (catalogue.client) {
                <div class="client-info">
                  <i class="icon-user"></i>
                  <div>
                    <strong>{{ catalogue.client.nom }}</strong>
                    <span>{{ catalogue.client.entreprise }}</span>
                  </div>
                </div>
              }

              <div class="card-actions">
                <button class="btn btn-sm btn-outline" [routerLink]="[catalogue.idCatalogue]">
                  Détails
                </button>

                @if (catalogue.statut === 'disponible' || catalogue.statut === 'reserve') {
                  <button class="btn btn-sm btn-success" (click)="validerCatalogue(catalogue)">
                    Valider
                  </button>
                  <button class="btn btn-sm btn-danger" (click)="refuserCatalogue(catalogue)">
                    Refuser
                  </button>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .catalogue-container {
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

    .page-header h2 {
      margin: 0;
      font-size: 2rem;
      color: var(--text-color);
    }

    .subtitle {
      color: var(--text-secondary);
      margin-top: 0.5rem;
    }

    .filters-section {
      background: var(--bg-primary);
      padding: 1.5rem;
      border-radius: var(--radius-lg);
      margin-bottom: 2rem;
      display: flex;
      gap: 1.5rem;
      box-shadow: var(--shadow-sm);
    }

    .filter-group {
      flex: 1;
    }

    .filter-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--text-color);
    }

    .filter-group input,
    .filter-group select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      background: var(--bg-primary);
      color: var(--text-color);
      font-size: 0.875rem;
    }

    .loading-spinner {
      text-align: center;
      padding: 4rem 2rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid var(--border-color);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      margin: 0 auto 1rem;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--bg-primary);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      margin-bottom: 0.5rem;
      color: var(--text-color);
    }

    .empty-state p {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }

    .catalogue-card {
      background: var(--bg-primary);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      transition: var(--transition);
      position: relative;
    }

    .catalogue-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }

    .card-status {
      padding: 0.5rem 1rem;
      text-align: center;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-disponible {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }

    .status-reserve {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
    }

    .status-valide {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
    }

    .status-refuse {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
    }

    .card-content {
      padding: 1.5rem;
    }

    .date-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
    }

    .date-item {
      flex: 1;
    }

    .date-item label {
      display: block;
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin-bottom: 0.25rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .date-value {
      font-weight: 600;
      color: var(--text-color);
      font-size: 0.875rem;
    }

    .date-divider {
      color: var(--primary-color);
      font-size: 1.5rem;
      font-weight: bold;
    }

    .client-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
      margin-bottom: 1.5rem;
    }

    .client-info i {
      font-size: 1.5rem;
      color: var(--primary-color);
    }

    .client-info strong {
      display: block;
      color: var(--text-color);
      font-size: 0.875rem;
    }

    .client-info span {
      display: block;
      color: var(--text-secondary);
      font-size: 0.75rem;
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;
    }

    .card-actions button {
      flex: 1;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .filters-section {
        flex-direction: column;
      }

      .card-actions {
        flex-direction: column;
      }
    }
  `]
})
export class CatalogueListComponent implements OnInit {
  private readonly catalogueService = inject(CatalogueService);

  catalogues = signal<CatalogueCreneaux[]>([]);
  filteredCatalogues = signal<CatalogueCreneaux[]>([]);
  loading = signal<boolean>(false);
  selectedStatut = '';
  searchTerm = '';

  ngOnInit(): void {
    this.loadCatalogues();
  }

  loadCatalogues(): void {
    this.loading.set(true);
    this.catalogueService.getAll().subscribe({
      next: (data) => {
        this.catalogues.set(data);
        this.filteredCatalogues.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erreur chargement', error);
        this.loading.set(false);
      }
    });
  }

  filterByStatut(): void {
    if (!this.selectedStatut) {
      this.filteredCatalogues.set(this.catalogues());
    } else {
      this.catalogueService.getByStatut(this.selectedStatut).subscribe({
        next: (data) => this.filteredCatalogues.set(data)
      });
    }
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    const filtered = this.catalogues().filter(c =>
      c.client?.nom.toLowerCase().includes(term) ||
      c.client?.entreprise?.toLowerCase().includes(term)
    );
    this.filteredCatalogues.set(filtered);
  }

  getStatutLabel(statut: string): string {
    const labels: Record<string, string> = {
      disponible: 'Disponible',
      reserve: 'Réservé',
      valide: 'Validé',
      refuse: 'Refusé'
    };
    return labels[statut] || statut;
  }

  validerCatalogue(catalogue: CatalogueCreneaux): void {
    const responsableId = 1; // TODO: Récupérer du contexte
    this.catalogueService.valider(catalogue.idCatalogue, responsableId).subscribe({
      next: () => {
        this.loadCatalogues();
        alert('Créneau validé avec succès');
      },
      error: (error) => {
        console.error('Erreur validation', error);
        alert('Erreur lors de la validation');
      }
    });
  }

  refuserCatalogue(catalogue: CatalogueCreneaux): void {
    const raison = prompt('Raison du refus:');
    if (!raison) return;

    const responsableId = 1; // TODO: Récupérer du contexte
    this.catalogueService.refuser(catalogue.idCatalogue, responsableId, raison).subscribe({
      next: () => {
        this.loadCatalogues();
        alert('Créneau refusé');
      },
      error: (error) => {
        console.error('Erreur refus', error);
        alert('Erreur lors du refus');
      }
    });
  }
}
