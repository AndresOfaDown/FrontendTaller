import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class PushService {
  private apiUrl = `${environment.apiUrl}/notifications`;
  private messaging: any;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {
    if (environment.firebase && environment.firebase.apiKey !== 'YOUR_API_KEY') {
      try {
        const app = initializeApp(environment.firebase);
        this.messaging = getMessaging(app);
      } catch (e) {
        console.error('Firebase initialization error', e);
      }
    }
  }

  async requestPermissionAndToken() {
    if (!this.messaging) return;

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(this.messaging, {
          // VAPID KEY is optional but recommended if configured in Firebase
        });
        
        if (token) {
          console.log('FCM Token received:', token);
          this.registerTokenWithBackend(token);
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      } else {
        console.log('Notification permission not granted.');
      }
    } catch (err) {
      console.log('An error occurred while retrieving token. ', err);
    }
  }

  listenForMessages() {
    if (!this.messaging) return;
    
    onMessage(this.messaging, (payload) => {
      console.log('Message received. ', payload);
      const title = payload.notification?.title || 'Notificación';
      const body = payload.notification?.body || '';
      
      // Mostrar toast en foreground
      this.notificationService.showSuccess(`${title}: ${body}`);
    });
  }

  private registerTokenWithBackend(token: string) {
    this.http.post(`${this.apiUrl}/register-token`, { token_fcm: token }).subscribe({
      next: (res) => console.log('Token FCM registered on backend', res),
      error: (err) => console.error('Error registering FCM token on backend', err)
    });
  }

  unregisterToken(token: string) {
    return this.http.delete(`${this.apiUrl}/unregister-token`, { body: { token_fcm: token } });
  }
}
