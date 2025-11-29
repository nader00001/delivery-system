import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './form.html',
  styleUrls: ['./form.scss'],
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
      adminId: [1] // TODO: dynamique
    });
  }

  loadClient(id: number): void {
    this.clientService.getById(id).subscribe({
      next: (client) => this.clientForm.patchValue(client),
      error: (err) => console.error('Erreur de chargement client', err)
    });
  }

  onSubmit(): void {
    if (this.clientForm.invalid) return;

    this.submitting.set(true);

    const request = this.isEditMode()
      ? this.clientService.update(this.clientId!, this.clientForm.value)
      : this.clientService.create(this.clientForm.value);

    request.subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/clients']);
      },
      error: () => {
        this.submitting.set(false);
        alert('Erreur lors de la sauvegarde');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/clients']);
  }
}
