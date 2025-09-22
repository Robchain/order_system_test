import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <!-- Navbar principal -->
    <mat-toolbar color="primary" class="app-toolbar">
      <mat-icon class="toolbar-icon">agriculture</mat-icon>
      <span class="app-title">{{ title }}</span>
      <span class="spacer"></span>
      <button mat-button routerLink="/pedidos" class="nav-button">
        <mat-icon>list</mat-icon>
        Pedidos
      </button>
    </mat-toolbar>

    <!-- Contenido principal -->
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <p>&copy; 2024 AFECOR - Sistema de gestión de pedidos agroquímicos</p>
    </footer>
  `,
  styles: [`
    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);

      .toolbar-icon {
        margin-right: 10px;
      }

      .app-title {
        font-weight: 600;
        font-size: 1.2rem;
      }

      .spacer {
        flex: 1 1 auto;
      }

      .nav-button {
        margin-left: 10px;
        
        mat-icon {
          margin-right: 5px;
        }
      }
    }

    .main-content {
      min-height: calc(100vh - 120px);
      background-color: #f5f5f5;
    }

    .app-footer {
      background-color: #37474f;
      color: white;
      text-align: center;
      padding: 20px;
      margin-top: auto;
      
      p {
        margin: 0;
        font-size: 0.9rem;
      }
    }
  `]
})
export class AppComponent {
  title = 'AFECOR - Sistema de Pedidos';
}