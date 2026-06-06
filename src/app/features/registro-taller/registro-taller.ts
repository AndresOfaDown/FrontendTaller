import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-registro-taller',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro-taller.html',
  styleUrls: ['./registro-taller.scss']
})
export class RegistroTallerComponent {
  nombreTaller = '';
  email = '';
  password = '';
  confirmPassword = '';
  
  isLoading = false;
  error: string | null = null;
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(): void {
    if (!this.nombreTaller || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Todos los campos son obligatorios';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }
    if (this.password.length < 8) {
      this.error = 'La contraseña debe tener al menos 8 caracteres';
      return;
    }

    this.isLoading = true;
    this.error = null;

    // Llamar al endpoint directo
    const payload = {
      email: this.email,
      password: this.password,
      username: this.email.split('@')[0],
      taller_name: this.nombreTaller
    };

    this.http.post<any>(`${this.apiUrl}/auth/web/register/direct`, payload).subscribe({
      next: (res) => {
        // Guardar token y nombre de taller
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('taller_name', this.nombreTaller);
        this.isLoading = false;
        // Ir al siguiente paso
        this.router.navigate(['/subscription']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.detail || 'Error al registrar la cuenta';
        console.error(err);
      }
    });
  }
}
