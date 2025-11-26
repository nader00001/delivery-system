import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { NotificationService } from "../../core/services/notification.service"

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <h1>Gestion Créneaux</h1>
      </div>

      <div class="navbar-menu">
        <a routerLink="/dashboard" routerLinkActive="active">Tableau de bord</a>
        <a routerLink="/catalogues" routerLinkActive="active">Créneaux</a>
        <a routerLink="/tracking" routerLinkActive="active">Suivi</a>
        <a routerLink="/clients" routerLinkActive="active">Clients</a>
        <a routerLink="/notifications" routerLinkActive="active" class="notification-link">
          Notifications
          @if (notificationService.unreadCount() > 0) {
            <span class="badge">{{ notificationService.unreadCount() }}</span>
          }
        </a>
      </div>

      <div class="navbar-actions">
        <button class="btn-icon" (click)="toggleTheme()" title="Changer le thème">
          <i class="icon-theme">☀️</i>
        </button>
        <button class="btn-icon" (click)="logout()" title="Déconnexion">
          <i class="icon-logout">🚪</i>
        </button>
      </div>
    </nav>
  `,
  styles: [
    `
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      background: var(--navbar-bg);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .navbar-brand h1 {
      margin: 0;
      font-size: 1.5rem;
      color: var(--primary-color);
    }

    .navbar-menu {
      display: flex;
      gap: 2rem;
    }

    .navbar-menu a {
      text-decoration: none;
      color: var(--text-color);
      font-weight: 500;
      transition: color 0.3s;
      position: relative;
    }

    .navbar-menu a:hover,
    .navbar-menu a.active {
      color: var(--primary-color);
    }

    .notification-link {
      position: relative;
    }

    .badge {
      position: absolute;
      top: -8px;
      right: -12px;
      background: #ef4444;
      color: white;
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 0.75rem;
      font-weight: bold;
    }

    .navbar-actions {
      display: flex;
      gap: 1rem;
    }

    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      transition: background 0.3s;
      font-size: 1.25rem;
    }

    .btn-icon:hover {
      background: rgba(0,0,0,0.05);
    }

    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        gap: 1rem;
      }

      .navbar-menu {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `,
  ],
})
export class NavbarComponent {
  notificationService = inject(NotificationService)

  toggleTheme(): void {
    document.body.classList.toggle("dark-theme")
    localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light")
  }

  logout(): void {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    window.location.href = "/login"
  }
}
