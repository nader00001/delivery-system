import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { ResponsableMagasinService } from '../../../core/services/responsable.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly adminService = inject(AdminService);
  private readonly responsableService = inject(ResponsableMagasinService);
  private readonly authService = inject(AuthService);

  loginForm!: FormGroup;
  userType = signal<'admin' | 'responsable'>('admin');
  submitting = signal<boolean>(false);
  errorMessage = signal<string>('');

  constructor() {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.submitting.set(true);
    this.errorMessage.set('');

    const { email, motDePasse } = this.loginForm.value;

    const loginService = this.userType() === 'admin'
      ? this.adminService.login(email, motDePasse)
      : this.responsableService.login(email, motDePasse);

    loginService.subscribe({
      next: (response: any) => {
        this.submitting.set(false);
        if (response.success) {
          const user = this.userType() === 'admin' ? response.admin : response.responsable;
          this.authService.setUser({
            id: user!.idAdmin || user!.idResponsable,
            nom: user!.nom,
            email: user!.email,
            type: this.userType()
          });
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set('Email ou mot de passe incorrect');
        }
      },
      error: () => {
        this.submitting.set(false);
        this.errorMessage.set('Erreur de connexion. Veuillez réessayer.');
      }
    });
  }
}
