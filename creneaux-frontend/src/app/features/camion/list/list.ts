import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Camion } from '../../../core/models/camion.model';
import { CamionService } from '../../../core/services/camion.service';

@Component({
  selector: 'app-camion-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list.html',
  styleUrls: ['./list.scss'],
})
export class CamionListComponent implements OnInit {
  private readonly camionService = inject(CamionService);

  camions = signal<Camion[]>([]);
  filteredCamions = signal<Camion[]>([]);
  searchTerm = '';

  ngOnInit(): void {
    this.loadCamions();
  }

  get filtered() {
    return this.filteredCamions();
  }

  loadCamions(): void {
    this.camionService.getAll().subscribe({
      next: (data) => {
        this.camions.set(data);
        this.filteredCamions.set(data);
      },
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    const filtered = this.camions().filter(
      (c) =>
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
      },
    });
  }
}
