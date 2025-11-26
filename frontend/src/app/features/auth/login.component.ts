import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { ResponsableService } from '../../core/services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">🚚</div>
          <h1>Gestion Créneaux</h1>
          <p>Connectez-vous à votre compte</p>
        </div>

        <div class="login-tabs">
          <button 
            class="tab"
            [class.active]="userType() === 'admin'"
            (click)="userType.set('admin')">
            Administrateur
          </button>
          <button 
            class="tab"
            [class.active]="userType() === 'responsable'"
            (click)="userType.set('responsable')">
            Responsable Magasin
          </button>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          @if (errorMessage()) {
            <div class="alert alert-danger">
              {{ errorMessage() }}
            </div>
          }

          <div class="form-group">
            <label>Email</label>
            <input 
              type="email" 
              formControlName="email" 
              placeholder="votre@email.com"
              autocomplete="email">
            @if (loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['required']) {
              <div class="form-error">L'email est requis</div>
            }
            @if (loginForm.get('email')?.errors?.['email']) {
              <div class="form-error">Email invalide</div>
            }
          </div>

          <div class="form-group">
            <label>Mot de passe</label>
            <input 
              type="password" 
              formControlName="motDePasse" 
              placeholder="••••••••"
              autocomplete="current-password">
            @if (loginForm.get('motDePasse')?.touched && loginForm.get('motDePasse')?.errors?.['required']) {
              <div class="form-error">Le mot de passe est requis</div>
            }
          </div>

          <button 
            type="submit" 
            class="btn btn-primary btn-lg btn-block"
            [disabled]="loginForm.invalid || submitting()">
            @if (submitting()) {
              <span class="spinner-sm"></span>
            }
            Se connecter
          </button>
        </form>

        <div class="login-footer">
          <p>Mot de passe oublié ? <a href="#">Réinitialiser</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .login-card {
      background: var(--bg-primary);
      padding: 3rem;
      border-radius: var(--radius-lg);
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      width: 100%;
      max-width: 450px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .login-header h1 {
      margin: 0 0 0.5rem;
      color: var(--text-color);
    }

    .login-header p {
      color: var(--text-secondary);
      margin: 0;
    }

    .login-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      background: var(--bg-secondary);
      padding: 0.5rem;
      border-radius: var(--radius-md);
    }

    .tab {
      flex: 1;
      padding: 0.75rem;
      border: none;
      background: transparent;
      color: var(--text-secondary);
      font-weight: 600;
      cursor: pointer;
      border-radius: var(--radius-sm);
      transition: var(--transition);
      font-size: 0.875rem;
    }

    .tab.active {
      background: var(--primary-color);
      color: white;
    }

    .login-form {
      margin-bottom: 1.5rem;
    }

    .alert {
      padding: 1rem;
      border-radius: var(--radius-md);
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
    }

    .alert-danger {
      background: rgba(239, 68, 68, 0.1);
      color: var(--danger-color);
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .btn-block {
      width: 100%;
    }

    .login-footer {
      text-align: center;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .login-footer a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 600;
    }

    .login-footer a:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .login-card {
        padding: 2rem;
      }
    }
  `]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly adminService = inject(AdminService);
  private readonly responsableService = inject(ResponsableService);

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
          // Stocker l'utilisateur dans localStorage
          const user = this.userType() === 'admin' ? response.admin : response.responsable;
          localStorage.setItem('user', JSON.stringify({ ...user, type: this.userType() }));
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set('Email ou mot de passe incorrect');
        }
      },
      error: (error: any) => {
        this.submitting.set(false);
        this.errorMessage.set('Erreur de connexion. Veuillez réessayer.');
        console.error('Erreur login', error);
      }
    });
  }
}