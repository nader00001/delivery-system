import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-button",
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [class]="'btn ' + variant"
      [disabled]="disabled"
      [type]="type">
      {{ label }}
    </button>
  `,
  styles: [
    `
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 1rem;
    }

    .btn-primary {
      background: var(--primary-color);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: var(--secondary-color);
      color: white;
    }

    .btn-outline {
      border: 2px solid var(--primary-color);
      color: var(--primary-color);
      background: transparent;
    }

    .btn-outline:hover:not(:disabled) {
      background: var(--primary-color);
      color: white;
    }

    .btn-danger {
      background: #ef4444;
      color: white;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
  ],
})
export class ButtonComponent {
  @Input() label = "Button"
  @Input() variant: "primary" | "secondary" | "outline" | "danger" = "primary"
  @Input() disabled = false
  @Input() type: "button" | "submit" | "reset" = "button"
}
