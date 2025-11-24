import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-card",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class]="'card-' + variant">
      @if (title) {
        <div class="card-header">
          <h3>{{ title }}</h3>
        </div>
      }
      <div class="card-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
    .card {
      background: var(--bg-primary);
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .card-header {
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    .card-header h3 {
      margin: 0;
      font-size: 1.125rem;
      color: var(--text-color);
    }

    .card-body {
      padding: 1rem;
    }

    .card-primary {
      border-left: 4px solid var(--primary-color);
    }

    .card-success {
      border-left: 4px solid #10b981;
    }

    .card-warning {
      border-left: 4px solid #f59e0b;
    }

    .card-danger {
      border-left: 4px solid #ef4444;
    }
  `,
  ],
})
export class CardComponent {
  @Input() title = ""
  @Input() variant: "primary" | "success" | "warning" | "danger" = "primary"
}
