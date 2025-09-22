import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="loading-container">
      <mat-spinner diameter="50"></mat-spinner>
      <p>Cargando...</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      gap: 20px;
    }
    
    p {
      color: #666;
      font-size: 1.1rem;
      margin: 0;
    }
  `]
})
export class LoadingComponent {}