import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <div class="form-header">
        <h2>{{ isEditMode() ? 'Modifier' : 'Créer' }} un Client</h2>
        <button class="btn btn-outline" (click)="goBack()">← Retour</button>
      </div>

      <form [formGroup]="clientForm" (ngSubmit)="onSubmit()" class="form-content">
        <div class="form-section">
          <h3>Informations Générales</h3>

          <div class="form-group">
            <label>Nom *</label>
            <input type="text" formControlName="nom" placeholder="Nom complet">
            @if (clientForm.get('nom')?.touched && clientForm.get('nom')?.errors?.['required']) {
              <div class="form-error">Le nom est requis</div>
            }
          </div>

          <div class="form-group">
            <label>Entreprise</label>
            <input type="text" formControlName="entreprise" placeholder="Nom de l'entreprise">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Email *</label>
              <input type="email" formControlName="email" placeholder="email@example.com">
              @if (clientForm.get('email')?.touched && clientForm.get('email')?.errors?.['required']) {
                <div class="form-error">L'email est requis</div>
              }
              @if (clientForm.get('email')?.errors?.['email']) {
                <div class="form-error">Email invalide</div>
              }
            </div>

            <div class="form-group">
              <label>Téléphone *</label>
              <input type="tel" formControlName="telephone" placeholder="+216 XX XXX XXX">
              @if (clientForm.get('telephone')?.touched && clientForm.get('telephone')?.errors?.['required']) {
                <div class="form-error">Le téléphone est requis</div>
              }
            </div>
          </div>

          <div class="form-group">
            <label>Adresse</label>
            <textarea formControlName="adresse" rows="3" placeholder="Adresse complète"></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-outline" (click)="goBack()">Annuler</button>
          <button type="submit" class="btn btn-primary" [disabled]="clientForm.invalid || submitting()">
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

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ClientFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly clientService = inject(ClientService);

  clientForm!: FormGroup;
  isEditMode = signal<boolean>(false);
  submitting = signal<boolean>(false);
  clientId?: number;

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode.set(true);
      this.clientId = +id;
      this.loadClient(this.clientId);
    }
  }

  initForm(): void {
    this.clientForm = this.fb.group({
      nom: ['', Validators.required],
      entreprise: [''],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      adresse: [''],
      adminId: [1] // TODO: Récupérer du contexte
    });
  }

  loadClient(id: number): void {
    this.clientService.getById(id).subscribe({
      next: (client) => {
        this.clientForm.patchValue(client);
      },
      error: (error) => console.error('Erreur', error)
    });
  }

  onSubmit(): void {
    if (this.clientForm.invalid) return;

    this.submitting.set(true);
    const operation = this.isEditMode()
      ? this.clientService.update(this.clientId!, this.clientForm.value)
      : this.clientService.create(this.clientForm.value);

    operation.subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/clients']);
      },
      error: (error) => {
        console.error('Erreur', error);
        this.submitting.set(false);
        alert('Erreur lors de la sauvegarde');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/clients']);
  }
}
