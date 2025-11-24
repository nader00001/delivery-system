import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CatalogueService } from '../../core/services/catalogue.service';
import { ClientService } from '../../core/services/client.service';
import { Client } from '../../core/models/client.model';

@Component({
  selector: 'app-catalogue-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <div class="form-header">
        <h2>{{ isEditMode() ? 'Modifier' : 'Créer' }} un Créneau</h2>
        <button class="btn btn-outline" (click)="goBack()">
          ← Retour
        </button>
      </div>

      <form [formGroup]="catalogueForm" (ngSubmit)="onSubmit()" class="form-content">
        <div class="form-section">
          <h3>Informations du Créneau</h3>

          <div class="form-row">
            <div class="form-group">
              <label>Client *</label>
              <select formControlName="clientId" required>
                <option value="">Sélectionner un client</option>
                @for (client of clients(); track client.idClient) {
                  <option [value]="client.idClient">
                    {{ client.nom }} - {{ client.entreprise }}
                  </option>
                }
              </select>
              @if (catalogueForm.get('clientId')?.touched && catalogueForm.get('clientId')?.errors?.['required']) {
                <div class="form-error">Le client est requis</div>
              }
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Date de Début *</label>
              <input type="datetime-local" formControlName="dateDebut" required>
              @if (catalogueForm.get('dateDebut')?.touched && catalogueForm.get('dateDebut')?.errors?.['required']) {
                <div class="form-error">La date de début est requise</div>
              }
            </div>

            <div class="form-group">
              <label>Date de Fin *</label>
              <input type="datetime-local" formControlName="dateFin" required>
              @if (catalogueForm.get('dateFin')?.touched && catalogueForm.get('dateFin')?.errors?.['required']) {
                <div class="form-error">La date de fin est requise</div>
              }
              @if (catalogueForm.errors?.['dateRange']) {
                <div class="form-error">La date de fin doit être après la date de début</div>
              }
            </div>
          </div>

          @if (isEditMode()) {
            <div class="form-group">
              <label>Statut</label>
              <select formControlName="statut">
                <option value="disponible">Disponible</option>
                <option value="reserve">Réservé</option>
                <option value="valide">Validé</option>
                <option value="refuse">Refusé</option>
              </select>
            </div>
          }
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-outline" (click)="goBack()">
            Annuler
          </button>
          <button type="submit" class="btn btn-primary" [disabled]="catalogueForm.invalid || submitting()">
            @if (submitting()) {
              <span class="spinner-sm"></span>
            }
            {{ isEditMode() ? 'Mettre à jour' : 'Créer' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 2rem;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .form-header h2 {
      margin: 0;
      color: var(--text-color);
    }

    .form-content {
      background: var(--bg-primary);
      padding: 2rem;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }

    .form-section {
      margin-bottom: 2rem;
    }

    .form-section h3 {
      margin-bottom: 1.5rem;
      color: var(--text-color);
      font-size: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid var(--border-color);
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding-top: 2rem;
      border-top: 1px solid var(--border-color);
    }

    .spinner-sm {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column-reverse;
      }

      .form-actions button {
        width: 100%;
      }
    }
  `]
})
export class CatalogueFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly catalogueService = inject(CatalogueService);
  private readonly clientService = inject(ClientService);

  catalogueForm!: FormGroup;
  clients = signal<Client[]>([]);
  isEditMode = signal<boolean>(false);
  submitting = signal<boolean>(false);
  catalogueId?: number;

  ngOnInit(): void {
    this.initForm();
    this.loadClients();
    
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode.set(true);
      this.catalogueId = +id;
      this.loadCatalogue(this.catalogueId);
    }
  }

  initForm(): void {
    this.catalogueForm = this.fb.group({
      clientId: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      statut: ['disponible']
    }, {
      validators: this.dateRangeValidator
    });
  }

  dateRangeValidator(form: FormGroup) {
    const debut = form.get('dateDebut')?.value;
    const fin = form.get('dateFin')?.value;
    
    if (debut && fin && new Date(debut) >= new Date(fin)) {
      return { dateRange: true };
    }
    return null;
  }

  loadClients(): void {
    this.clientService.getAll().subscribe({
      next: (clients) => this.clients.set(clients),
      error: (error) => console.error('Erreur chargement clients', error)
    });
  }

  loadCatalogue(id: number): void {
    this.catalogueService.getById(id).subscribe({
      next: (catalogue) => {
        this.catalogueForm.patchValue({
          clientId: catalogue.clientId,
          dateDebut: this.formatDateTimeLocal(catalogue.dateDebut),
          dateFin: this.formatDateTimeLocal(catalogue.dateFin),
          statut: catalogue.statut
        });
      },
      error: (error) => console.error('Erreur chargement catalogue', error)
    });
  }

  formatDateTimeLocal(date: Date): string {
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  }

  onSubmit(): void {
    if (this.catalogueForm.invalid) return;

    this.submitting.set(true);
    const formValue = this.catalogueForm.value;

    const catalogueData = {
      clientId: +formValue.clientId,
      dateDebut: new Date(formValue.dateDebut),
      dateFin: new Date(formValue.dateFin),
      statut: formValue.statut
    };

    const operation = this.isEditMode()
      ? this.catalogueService.update(this.catalogueId!, catalogueData)
      : this.catalogueService.create(catalogueData);

    operation.subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/catalogues']);
      },
      error: (error) => {
        console.error('Erreur sauvegarde', error);
        this.submitting.set(false);
        alert('Erreur lors de la sauvegarde');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/catalogues']);
  }
}