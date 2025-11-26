import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export interface User {
  id: number;
  nom: string;
  email: string;
  type: 'admin' | 'responsable';
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private currentUserSignal = signal<User | null>(null);

  constructor() {
    this.loadUserFromStorage();
  }

  /**
   * Signal pour l'utilisateur connecté (réactif)
   */
  get currentUser() {
    return this.currentUserSignal();
  }

  /**
   * Vérifie si un utilisateur est authentifié
   */
  get isAuthenticated(): boolean {
    return this.currentUserSignal() !== null;
  }

  /**
   * Vérifie si l'utilisateur est un admin
   */
  get isAdmin(): boolean {
    return this.currentUser?.type === 'admin';
  }

  /**
   * Vérifie si l'utilisateur est un responsable
   */
  get isResponsable(): boolean {
    return this.currentUser?.type === 'responsable';
  }

  /**
   * Charger l'utilisateur depuis le localStorage au démarrage
   */
  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSignal.set(user);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur', error);
        this.logout();
      }
    }
  }

  /**
   * Définir l'utilisateur connecté et le persister
   */
  setUser(user: User): void {
    this.currentUserSignal.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Déconnexion : supprime l'utilisateur et redirige vers login
   */
  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  /**
   * Récupérer l'ID de l'utilisateur connecté
   */
  getUserId(): number | null {
    return this.currentUser?.id || null;
  }

  /**
   * Récupérer le type d'utilisateur
   */
  getUserType(): 'admin' | 'responsable' | null {
    return this.currentUser?.type || null;
  }

  /**
   * Récupérer le token d'authentification
   */
  getToken(): string | null {
    return this.currentUser?.token || null;
  }

  /**
   * Mettre à jour le token
   */
  updateToken(token: string): void {
    const user = this.currentUser;
    if (user) {
      const updatedUser = { ...user, token };
      this.setUser(updatedUser);
    }
  }
}
