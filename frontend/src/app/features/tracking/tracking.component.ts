import { Component, type OnInit, signal } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-tracking",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tracking-container">
      <div class="tracking-header">
        <h2>Suivi des Camions en Temps Réel</h2>
        <div class="tracking-controls">
          <button class="btn btn-primary" (click)="refreshMap()">
            Actualiser
          </button>
          <label class="auto-refresh">
            <input type="checkbox" [(ngModel)]="autoRefresh" (change)="toggleAutoRefresh()">
            Actualisation automatique
          </label>
        </div>
      </div>

      <div class="tracking-content">
        <div class="map-container">
          <div id="map" class="map">
            <p>Carte intégrée avec Leaflet (à connecter avec API backend)</p>
          </div>
        </div>

        <div class="trajectoires-list">
          <h3>Liste des Trajectoires</h3>
          
          @if (loading()) {
            <div class="loading">Chargement...</div>
          }

          @if (!loading() && trajectoires().length === 0) {
            <div class="empty-state">
              <p>Aucune trajectoire active</p>
            </div>
          }

          @for (traj of trajectoires(); track traj.idTrajectoire) {
            <div class="trajectoire-card">
              <div class="card-header">
                <h4>{{ traj.camion?.chauffeur || 'N/A' }}</h4>
                <span class="status" [class.arrived]="traj.dateArrivee">
                  {{ traj.dateArrivee ? 'Arrivé' : 'En route' }}
                </span>
              </div>
              <div class="card-body">
                <div class="info-row">
                  <span>Immatriculation: {{ traj.camion?.immatriculation || 'N/A' }}</span>
                </div>
                <div class="info-row">
                  <span>Téléphone: {{ traj.camion?.telChauffeur }}</span>
                </div>
                <div class="info-row">
                  <span>Position: {{ traj.latitudeActuelle.toFixed(4) }}, {{ traj.longitudeActuelle.toFixed(4) }}</span>
                </div>
                @if (traj.observations) {
                  <div class="observations">
                    <span>Observations: {{ traj.observations }}</span>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .tracking-container {
      height: calc(100vh - 80px);
      display: flex;
      flex-direction: column;
    }

    .tracking-header {
      padding: 1.5rem 2rem;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .tracking-header h2 {
      margin: 0;
      color: var(--text-color);
    }

    .tracking-controls {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .auto-refresh {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .tracking-content {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 0;
      overflow: hidden;
    }

    .map-container {
      position: relative;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #e5e7eb;
    }

    .map {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
    }

    .trajectoires-list {
      background: white;
      overflow-y: auto;
      padding: 1rem;
    }

    .trajectoires-list h3 {
      margin: 0 0 1rem;
      color: var(--text-color);
    }

    .trajectoire-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .card-header h4 {
      margin: 0;
      font-size: 1rem;
      color: var(--text-color);
    }

    .status {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      background: #f59e0b;
      color: white;
    }

    .status.arrived {
      background: #10b981;
    }

    .info-row {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 0.5rem;
    }

    .observations {
      margin-top: 0.75rem;
      padding: 0.5rem;
      background: #f3f4f6;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #999;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: #999;
    }

    @media (max-width: 1024px) {
      .tracking-content {
        grid-template-columns: 1fr;
        grid-template-rows: 60% 40%;
      }

      .map-container {
        border-right: none;
        border-bottom: 1px solid #e5e7eb;
      }
    }
  `,
  ],
})
export class TrackingComponent implements OnInit {
  trajectoires = signal<any[]>([])
  loading = signal<boolean>(false)
  autoRefresh = false

  ngOnInit(): void {
    this.loadTrajectoires()
  }

  loadTrajectoires(): void {
    this.loading.set(true)
    setTimeout(() => {
      this.trajectoires.set([])
      this.loading.set(false)
    }, 500)
  }

  refreshMap(): void {
    this.loadTrajectoires()
  }

  toggleAutoRefresh(): void {
    if (this.autoRefresh) {
      setInterval(() => this.loadTrajectoires(), 30000)
    }
  }
}
