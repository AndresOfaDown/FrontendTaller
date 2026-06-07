import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface WsMessage {
  tipo: string;
  [key: string]: any;
}

/**
 * Servicio WebSocket para Angular.
 * Maneja conexiones a los canales del backend en tiempo real.
 * 
 * Canales disponibles:
 * - taller/{id}    → nuevas solicitudes, cotizaciones respondidas
 * - servicio/{id}  → cambios de estado del servicio
 */
@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
  private sockets: Map<string, WebSocket> = new Map();
  private subjects: Map<string, Subject<WsMessage>> = new Map();
  private reconnectTimers: Map<string, any> = new Map();

  /**
   * Construye la URL WebSocket a partir de la URL HTTP del environment.
   */
  private get wsBaseUrl(): string {
    let httpUrl = environment.apiUrl;
    // Convertir http:// → ws:// y https:// → wss://
    let wsUrl = httpUrl
      .replace('http://', 'ws://')
      .replace('https://', 'wss://');
    // Asegurar que termine con /
    if (!wsUrl.endsWith('/')) wsUrl += '/';
    return `${wsUrl}ws/`;
  }

  /**
   * Conecta a un canal WebSocket y devuelve un Observable de mensajes.
   */
  connect(channel: string, token?: string): Observable<WsMessage> {
    // Si ya existe, devolver el observable existente
    if (this.subjects.has(channel)) {
      return this.subjects.get(channel)!.asObservable();
    }

    const subject = new Subject<WsMessage>();
    this.subjects.set(channel, subject);
    this.establishConnection(channel, token);
    return subject.asObservable();
  }

  private establishConnection(channel: string, token?: string): void {
    try {
      const url = `${this.wsBaseUrl}${channel}${token ? `?token=${token}` : ''}`;
      console.log(`🔌 WS conectando a: ${url}`);

      const ws = new WebSocket(url);
      this.sockets.set(channel, ws);

      ws.onopen = () => {
        console.log(`✅ WS conectado al canal [${channel}]`);
      };

      ws.onmessage = (event) => {
        try {
          const data: WsMessage = JSON.parse(event.data);
          console.log(`📩 WS [${channel}]:`, data);
          this.subjects.get(channel)?.next(data);
        } catch (e) {
          console.warn(`⚠️ WS parse error [${channel}]:`, e);
        }
      };

      ws.onerror = (error) => {
        console.error(`❌ WS error [${channel}]:`, error);
      };

      ws.onclose = () => {
        console.log(`🔌 WS cerrado [${channel}]`);
        this.sockets.delete(channel);
        this.scheduleReconnect(channel, token);
      };
    } catch (e) {
      console.error(`❌ WS connection failed [${channel}]:`, e);
      this.scheduleReconnect(channel, token);
    }
  }

  /**
   * Programa reconexión automática después de 5 segundos.
   */
  private scheduleReconnect(channel: string, token?: string): void {
    // Cancelar timer previo
    if (this.reconnectTimers.has(channel)) {
      clearTimeout(this.reconnectTimers.get(channel));
    }

    const timer = setTimeout(() => {
      if (this.subjects.has(channel) && !this.subjects.get(channel)!.closed) {
        console.log(`🔄 WS reconectando a [${channel}]...`);
        this.establishConnection(channel, token);
      }
    }, 5000);

    this.reconnectTimers.set(channel, timer);
  }

  /**
   * Envía un ping para mantener la conexión viva.
   */
  ping(channel: string): void {
    const ws = this.sockets.get(channel);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send('ping');
    }
  }

  /**
   * Desconecta un canal específico.
   */
  disconnect(channel: string): void {
    if (this.reconnectTimers.has(channel)) {
      clearTimeout(this.reconnectTimers.get(channel));
      this.reconnectTimers.delete(channel);
    }

    const ws = this.sockets.get(channel);
    if (ws) {
      ws.close();
      this.sockets.delete(channel);
    }

    const subject = this.subjects.get(channel);
    if (subject) {
      subject.complete();
      this.subjects.delete(channel);
    }

    console.log(`🔌 WS desconectado de [${channel}]`);
  }

  /**
   * Desconecta todos los canales.
   */
  disconnectAll(): void {
    const channels = Array.from(this.sockets.keys());
    channels.forEach(channel => this.disconnect(channel));
  }

  ngOnDestroy(): void {
    this.disconnectAll();
  }
}
