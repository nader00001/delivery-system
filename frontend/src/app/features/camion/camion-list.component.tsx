import { Component, type OnInit, inject, signal } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { CamionService } from "../../core/services/camion.service"
import type { Camion } from "../../core/models/camion.model"

@Component({
  selector: "app-camion-list",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="camion-container">
      <div class="page-header">
        <div>
          <h2>Gestion des Camions</h2>
          <p class="subtitle">Gérez votre flotte de camions</p>
        </div>
        <button class="btn btn-primary" [routerLink]="['create']">
          Ajouter Camion
        </button>
      </div>

      @if (loading()) {
        <div class="loading-state">
          <p>Chargement...</p>
        </div>
      }

      <div class="grid-container">
        @for (camion of camions(); track camion.idCamion) {
          <div class="card">
            <div class="card-header">
              <h3>{{ camion.chauffeur }}</h3>
            </div>
            <div class="card-body">
              <div class="info-item">
                <span class="label">Immatriculation:</span>
                <span>{{ camion.immatriculation || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Modèle:</span>
                <span>{{ camion.modele || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Téléphone:</span>
                <span>{{ camion.telChauffeur }}</span>
              </div>
            </div>
            <div class="card-footer">
              <button class="btn-sm" [routerLink]="['edit', camion.idCamion]">
                Modifier
              </button>
              <button class="btn-sm btn-danger" (click)="deleteCamion(camion.idCamion)">
                Supprimer
              </button>
            </div>
          </div>
        }
      </div>

      @if (camions().length === 0 && !loading()) {
        <div class="empty-state">
          <p>Aucun camion enregistré</p>
        </div>
      }
    </div>
  `,
  styles: [
    `
    .camion-container {
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

    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .card {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .card-header {
      padding: 1rem;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }

    .card-header h3 {
      margin: 0;
      color: var(--text-color);
    }

    .card-body {
      padding: 1rem;
      flex: 1;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      font-size: 0.875rem;
    }

    .label {
      font-weight: 600;
      color: var(--text-secondary);
    }

    .card-footer {
      padding: 1rem;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 0.5rem;
    }

    .btn-sm {
      flex: 1;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.25rem;
      background: var(--primary-color);
      color: white;
      font-size: 0.875rem;
      cursor: pointer;
    }

    .btn-danger {
      background: #ef4444;
    }

    .loading-state, .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      color: var(--text-secondary);
    }

    @media (max-width: 768px) {
      .grid-container {
        grid-template-columns: 1fr;
      }
    }
  `,
  ],
})
export class CamionListComponent implements OnInit {
  private readonly camionService = inject(CamionService)

  camions = signal<Camion[]>([])
  loading = signal<boolean>(false)

  ngOnInit(): void {
    this.loadCamions()
  }

  loadCamions(): void {
    this.loading.set(true)
    this.camionService.getAll().subscribe({
      next: (camions) => {
        this.camions.set(camions)
        this.loading.set(false)
      },
      error: (error) => {
        console.error("Erreur chargement camions", error)
        this.loading.set(false)
      },
    })
  }

  deleteCamion(id: number): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce camion?")) {
      this.camionService.delete(id).subscribe({
        next: () => this.loadCamions(),
        error: (error) => console.error("Erreur suppression", error),
      })
    }
  }
}
