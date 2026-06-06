import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
  isLoading = false;
  error: string | null = null;
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  selectedPlan = 'pro';
  
  suscribirse(planId: string): void {
    if (!this.authService.getToken()) {
      alert("Debes registrarte o iniciar sesión antes de suscribirte.");
      window.location.href = '/registro-taller';
      return;
    }

    this.router.navigate(['/procesando-pago'], { queryParams: { plan: planId } });
  }
}
