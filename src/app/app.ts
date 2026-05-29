import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationToast } from './shared/components/notification-toast/notification-toast';
import { PushService } from './core/services/push.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationToast],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('FRONTEND');

  constructor(
    private pushService: PushService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Escuchar mensajes si estamos logueados o en general
    this.pushService.listenForMessages();
    
    // Si ya estamos autenticados al cargar la app, podemos pedir permisos
    if (this.authService.isAuthenticated()) {
      this.pushService.requestPermissionAndToken();
    }
  }
}