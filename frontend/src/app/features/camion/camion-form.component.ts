import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CamionService } from '../../core/services/camion.service';

@Component({
  selector: 'app-camion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <div class="form-header">
        <h2>{{ isEditMode() ? 'Modifier' : 'Créer' }} un Camion</h2>
        <button class="btn btn-outline" (click)="goBack()">← Retour</button>
      </div>

      <form [formGroup]="camionForm" (ngSubmit)="onSubmit()" class="form-content">
        <div class="form-section">
          <h3>Informations du Camion</h3>

          <div class="form-group">
            <label>Chauffeur *</label>
            <input type="text" formControlName="chauffeur" placeholder="Nom du chauffeur">
            @if (camionForm.get('chauffeur')?.touched && camionForm.get('chauffeur')?.errors?.['required']) {
              <div class="form-error">Le nom du chauffeur est requis</div>
            }
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Téléphone *</label>
              <input type="tel" formControlName="telChauffeur" placeholder="+216 XX XXX XXX">
              @if (camionForm.get('telChauffeur')?.touched && camionForm.get('telChauffeur')?.errors?.['required']) {
                <div class="form-error">Le téléphone est requis</div>
              }
            </div>

            <div class="form-group">
              <label>Immatriculation</label>
              <input type="text" formControlName="immatriculation" placeholder="123 TU 4567">
            </div>
          </div>

          <div class="form-group">
            <label>Modèle</label>
            <input type="text" formControlName="modele" placeholder="Ex: Mercedes Actros">
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-outline" (click)="goBack()">Annuler</button>
          <button type="submit" class="btn btn-primary" [disabled]="camionForm.invalid || submitting()">
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

    .form-content {
      background: var(--bg-primary);
      padding: 2rem;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }

    .form-section h3 {
      margin-bottom: 1.5rem;
      color: var(--text-color);
      padding-bottom: 0.75rem;
      border-bottom: 2px solid var(--border-color);
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding-top: 2rem;
      border-top: 1px solid var(--border-color);
      margin-top: 2rem;
    }
  `]
})
export class CamionFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly camionService = inject(CamionService);

  camionForm!: FormGroup;
  isEditMode = signal<boolean>(false);
  submitting = signal<boolean>(false);
  camionId?: number;

  ngOnInit(): void {
    this.initForm();
    
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode.set(true);
      this.camionId = +id;
      this.loadCamion(this.camionId);
    }
  }

  initForm(): void {
    this.camionForm = this.fb.group({
      chauffeur: ['', Validators.required],
      telChauffeur: ['', Validators.required],
      immatriculation: [''],
      modele: ['']
    });
  }

  loadCamion(id: number): void {
    this.camionService.getById(id).subscribe({
      next: (camion) => {
        this.camionForm.patchValue(camion);
      }
    });
  }

  onSubmit(): void {
    if (this.camionForm.invalid) return;

    this.submitting.set(true);
    const operation = this.isEditMode()
      ? this.camionService.update(this.camionId!, this.camionForm.value)
      : this.camionService.create(this.camionForm.value);

    operation.subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/camions']);
      },
      error: (error) => {
        console.error('Erreur', error);
        this.submitting.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/camions']);
  }
}