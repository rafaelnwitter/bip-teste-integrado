import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class.inactive]="!active">
      <div class="card-header" *ngIf="title">
        <h3>{{ title }}</h3>
        <ng-content select="[slot=badge]"></ng-content>
      </div>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
      <div class="card-footer">
        <ng-content select="[slot=actions]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin: 8px; background: white; }
    .card.inactive { opacity: 0.6; background: #f5f5f5; }
    .card-header { display: flex; justify-content: space-between; align-items: center; }
    .card-footer { display: flex; gap: 8px; margin-top: 12px; justify-content: flex-end; }
  `]
})
export class CardComponent {
  @Input() title = '';
  @Input() active = true;
}
