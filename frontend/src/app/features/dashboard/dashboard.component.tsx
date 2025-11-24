import { Component, type OnInit, inject, signal } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { CatalogueService } from "../../core/services/catalogue.service"
import { TrajectoireService } from "../../core/services/trajectoire.service"
import { NotificationService } from "../../core/services/notification.service"
import { CardComponent } from "../../shared/components/card/card.component"

interface DashboardStats {
  totalCatalogues: number
  cataloguesDisponibles: number
  cataloguesValides: number
  trajectoiresActives: number
  notificationsNonLues: number
}

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent],
  template: `
    <div class="dashboard-container">
      <div class="page-header">
        <h1>Tableau de Bord</h1>
        <p class="subtitle">Vue d'ensemble de votre activité</p>
      </div>

      <div class="stats-grid">
        <app-card [title]="'Total Créneaux'" variant="primary">
          <div class="stat-value">{{ stats().totalCatalogues }}</div>
        </app-card>

        <app-card [title]="'Créneaux Validés'" variant="success">
          <div class="stat-value">{{ stats().cataloguesValides }}</div>
        </app-card>

        <app-card [title]="'Camions en Route'" variant="warning">
          <div class="stat-value">{{ stats().trajectoiresActives }}</div>
        </app-card>

        <app-card [title]="'Notifications'" variant="danger">
          <div class="stat-value">{{ stats().notificationsNonLues }}</div>
        </app-card>

        <app-card [title]="'Créneaux Disponibles'" variant="primary">
          <div class="stat-value">{{ stats().cataloguesDisponibles }}</div>
        </app-card>
      </div>

      <div class="quick-actions-section">
        <h2>Actions Rapides</h2>
        <div class="actions-grid">
          <button class="action-card" routerLink="/catalogues/create">
            <div class="action-icon">➕</div>
            <div class="action-title">Nouveau Créneau</div>
            <div class="action-description">Créer un nouveau créneau horaire</div>
          </button>

          <button class="action-card" routerLink="/tracking">
            <div class="action-icon">🗺️</div>
            <div class="action-title">Suivi GPS</div>
            <div class="action-description">Voir les camions sur la carte</div>
          </button>

          <button class="action-card" routerLink="/clients">
            <div class="action-icon">👤</div>
            <div class="action-title">Gestion Clients</div>
            <div class="action-description">Gérer les clients</div>
          </button>

          <button class="action-card" routerLink="/camions">
            <div class="action-icon">🚛</div>
            <div class="action-title">Gestion Camions</div>
            <div class="action-description">Gérer les camions</div>
          </button>
        </div>
      </div>

      <div class="recent-section">
        <h2>Activité Récente</h2>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon success">✓</div>
            <div class="activity-content">
              <div class="activity-title">Créneau validé</div>
              <div class="activity-time">Il y a 5 minutes</div>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-icon warning">🚚</div>
            <div class="activity-content">
              <div class="activity-title">Camion en route</div>
              <div class="activity-time">Il y a 15 minutes</div>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-icon info">📋</div>
            <div class="activity-content">
              <div class="activity-title">Nouveau créneau créé</div>
              <div class="activity-time">Il y a 1 heure</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .dashboard-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      margin: 0;
      font-size: 2rem;
      color: var(--text-color);
    }

    .subtitle {
      color: var(--text-secondary);
      margin-top: 0.5rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--primary-color);
    }

    .quick-actions-section,
    .recent-section {
      margin-bottom: 3rem;
    }

    .quick-actions-section h2,
    .recent-section h2 {
      margin-bottom: 1.5rem;
      color: var(--text-color);
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .action-card {
      background: white;
      padding: 2rem;
      border-radius: 0.5rem;
      border: none;
      text-align: center;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: all 0.3s;
    }

    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .action-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .action-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-color);
      margin-bottom: 0.5rem;
    }

    .action-description {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .activity-list {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }

    .activity-icon.success {
      background: rgba(16, 185, 129, 0.1);
    }

    .activity-icon.warning {
      background: rgba(245, 158, 11, 0.1);
    }

    .activity-icon.info {
      background: rgba(59, 130, 246, 0.1);
    }

    .activity-title {
      font-weight: 600;
      color: var(--text-color);
    }

    .activity-time {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  ],
})
export class DashboardComponent implements OnInit {
  private readonly catalogueService = inject(CatalogueService)
  private readonly trajectoireService = inject(TrajectoireService)
  private readonly notificationService = inject(NotificationService)

  stats = signal<DashboardStats>({
    totalCatalogues: 0,
    cataloguesDisponibles: 0,
    cataloguesValides: 0,
    trajectoiresActives: 0,
    notificationsNonLues: 0,
  })

  ngOnInit(): void {
    this.loadStats()
  }

  loadStats(): void {
    this.catalogueService.getAll().subscribe({
      next: (catalogues) => {
        const valides = catalogues.filter((c) => c.statut === "valide").length
        const disponibles = catalogues.filter((c) => c.statut === "disponible").length

        this.trajectoireService.getAll().subscribe({
          next: (trajectoires) => {
            const actives = trajectoires.filter((t) => !t.dateArrivee).length

            this.notificationService.getUnreadByResponsableId(1).subscribe({
              next: (notifs) => {
                this.stats.set({
                  totalCatalogues: catalogues.length,
                  cataloguesDisponibles: disponibles,
                  cataloguesValides: valides,
                  trajectoiresActives: actives,
                  notificationsNonLues: notifs.length,
                })
              },
            })
          },
        })
      },
    })
  }
}
