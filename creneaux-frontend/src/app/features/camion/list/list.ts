import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CamionService } from '../../../core/services/camion.service';
import { Camion } from '../../../core/models/camion.model';

@Component({
  selector: 'app-camion-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="camion-container">
      <div class="page-header">
        <div>
          <h2>Gestion des Camions</h2>
          <p class="subtitle">Gérez votre flotte de véhicules</p>
        </div>
        <button class="btn btn-primary" [routerLink]="['create']">
          <i class="icon-plus"></i> Nouveau Camion
        </button>
      </div>

      <div class="filters-section">
        <input
          type="text"
          placeholder="Rechercher par chauffeur, immatriculation..."
          [(ngModel)]="searchTerm"
          (input)="onSearch()">
      </div>

      <div class="grid grid-cols-3">
        @for (camion of filteredCamions(); track camion.idCamion) {
          <div class="camion-card">
            <div class="card-icon">🚛</div>

            <div class="card-content">
              <h3>{{ camion.chauffeur }}</h3>

              <div class="info-list">
                <div class="info-item">
                  <span class="label">Immatriculation</span>
                  <span class="value">{{ camion.immatriculation || 'N/A' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Modèle</span>
                  <span class="value">{{ camion.modele || 'N/A' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Téléphone</span>
                  <span class="value">{{ camion.telChauffeur }}</span>
                </div>
              </div>
            </div>

            <div class="card-actions">
              <button class="btn btn-sm btn-outline" [routerLink]="['edit', camion.idCamion]">
                Modifier
              </button>
              <button class="btn btn-sm btn-danger" (click)="deleteCamion(camion)">
                Supprimer
              </button>
            </div>
          </div>
        } @empty {
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-icon">🚚</div>
            <h3>Aucun camion enregistré</h3>
            <p>Ajoutez votre premier camion pour commencer</p>
            <button class="btn btn-primary" [routerLink]="['create']">
              Ajouter un camion
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .camion-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .filters-section {
      background: var(--bg-primary);
      padding: 1.5rem;
      border-radius: var(--radius-lg);
      margin-bottom: 2rem;
      box-shadow: var(--shadow-sm);
    }

    .filters-section input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
    }

    .camion-card {
      background: var(--bg-primary);
      padding: 2rem;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      transition: var(--transition);
      text-align: center;
    }

    .camion-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }

    .card-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .card-content h3 {
      margin-bottom: 1.5rem;
      color: var(--text-color);
    }

    .info-list {
      text-align: left;
      margin-bottom: 1.5rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem;
      border-bottom: 1px solid var(--border-color);
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .info-item .label {
      font-weight: 600;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .info-item .value {
      color: var(--text-color);
      font-size: 0.875rem;
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;
    }

    .card-actions button {
      flex: 1;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--bg-primary);
      border-radius: var(--radius-lg);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
  `]
})
export class CamionListComponent implements OnInit {
  private readonly camionService = inject(CamionService);

  camions = signal<Camion[]>([]);
  filteredCamions = signal<Camion[]>([]);
  searchTerm = '';

  ngOnInit(): void {
    this.loadCamions();
  }

  loadCamions(): void {
    this.camionService.getAll().subscribe({
      next: (data) => {
        this.camions.set(data);
        this.filteredCamions.set(data);
      }
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    const filtered = this.camions().filter(c =>
      c.chauffeur.toLowerCase().includes(term) ||
      c.immatriculation?.toLowerCase().includes(term) ||
      c.telChauffeur.includes(term)
    );
    this.filteredCamions.set(filtered);
  }

  deleteCamion(camion: Camion): void {
    if (!confirm(`Supprimer le camion de ${camion.chauffeur} ?`)) return;

    this.camionService.delete(camion.idCamion).subscribe({
      next: () => {
        this.loadCamions();
        alert('Camion supprimé');
      }
    });
  }
}
