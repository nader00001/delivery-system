import { Component, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterOutlet } from "@angular/router"
import { HttpClientModule } from "@angular/common/http"
import { NavbarComponent } from "./shared/components/navbar/navbar.component"
import { NotificationService } from "./core/services/notification.service"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
    .main-content {
      min-height: calc(100vh - 60px);
    }
  `,
  ],
})
export class AppComponent implements OnInit {
  private readonly notificationService = inject(NotificationService)

  ngOnInit(): void {
    this.initializeApp()
  }

  private initializeApp(): void {
    const theme = localStorage.getItem("theme")
    if (theme === "dark") {
      document.body.classList.add("dark-theme")
    }

    // Simulé - récupérer l'ID responsable depuis le contexte d'authentification
    const responsableId = 1
    this.notificationService.startPolling(responsableId).subscribe({
      error: (error) => console.error("Erreur polling notifications", error),
    })
  }
}
