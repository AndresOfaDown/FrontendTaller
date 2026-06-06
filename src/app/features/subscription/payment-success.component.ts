import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #f8f9fa;">
      <div style="background: white; padding: 3rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center; max-width: 500px;">
        <i class="fas fa-check-circle" style="font-size: 5rem; color: #28a745; margin-bottom: 1.5rem;"></i>
        <h2 style="color: #333; margin-bottom: 1rem;">¡Pago Exitoso!</h2>
        <p style="color: #666; font-size: 1.1rem; margin-bottom: 2rem;">
          Tu suscripción ha sido procesada correctamente. Hemos creado tu espacio de taller y ahora tienes acceso completo a las funciones de administrador.
        </p>
        <button 
          (click)="irAlDashboard()"
          style="background-color: #932D30; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 1.1rem; cursor: pointer; font-weight: bold; width: 100%;">
          Ir a mi Panel de Taller
        </button>
      </div>
    </div>
  `
})
export class PaymentSuccessComponent implements OnInit {
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Aquí podríamos validar el session_id si fuera necesario
  }

  irAlDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
