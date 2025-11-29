import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CamionService } from '../../../core/services/camion.service';

@Component({
  selector: 'app-camion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrls: ['./form.scss']
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
      next: (camion) => this.camionForm.patchValue(camion)
    });
  }

  onSubmit(): void {
    if (this.camionForm.invalid) return;

    this.submitting.set(true);

    const request = this.isEditMode()
      ? this.camionService.update(this.camionId!, this.camionForm.value)
      : this.camionService.create(this.camionForm.value);

    request.subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/camions']);
      },
      error: (err) => {
        console.error(err);
        this.submitting.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/camions']);
  }
}
