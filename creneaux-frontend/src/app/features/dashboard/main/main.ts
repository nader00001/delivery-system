import { Component, inject, OnInit, signal } from '@angular/core';
import { CatalogueService } from '../../../core/services/catalogue.service';
import { TrajectoireService } from '../../../core/services/trajectoire.service';
import { NotificationService } from '../../../core/services/notification.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


interface DashboardStats {
  totalCatalogues: number;
  cataloguesDisponibles: number;
  cataloguesValides: number;
  trajectoiresActives: number;
  notificationsNonLues: number;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements OnInit{
  private readonly catalogueService = inject(CatalogueService);
  private readonly trajectoireService = inject(TrajectoireService);
  private readonly notificationService = inject(NotificationService);

  stats = signal<DashboardStats>({
    totalCatalogues: 0,
    cataloguesDisponibles: 0,
    cataloguesValides: 0,
    trajectoiresActives: 0,
    notificationsNonLues: 0
  });

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.catalogueService.getAll().subscribe(catalogues => {
      const valides = catalogues.filter(c => c.statut === 'valide').length;
      const disponibles = catalogues.filter(c => c.statut === 'disponible').length;

      this.trajectoireService.getAll().subscribe(trajectoires => {
        const actives = trajectoires.filter(t => !t.dateArrivee).length;

        this.notificationService.getUnreadByResponsableId(1).subscribe(notifs => {
          this.stats.set({
            totalCatalogues: catalogues.length,
            cataloguesDisponibles: disponibles,
            cataloguesValides: valides,
            trajectoiresActives: actives,
            notificationsNonLues: notifs.length
          });
        });
      });
    });
  }
}
