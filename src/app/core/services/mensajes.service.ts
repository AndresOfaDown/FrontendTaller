import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// ============================================================
// INTERFACES
// ============================================================

export interface MensajeCreate {
  texto: string;
}

export interface MensajeResponse {
  id: number;
  texto: string;
  tiempo: string; // ISO datetime
  leido: boolean;
  id_remitente?: number;
  nombre_remitente?: string;
  es_mio: boolean;
}

export interface ConversacionResponse {
  id_servicio: number;
  total_mensajes: number;
  mensajes_no_leidos: number;
  mensajes: MensajeResponse[];
}

// ============================================================
// SERVICE
// ============================================================

@Injectable({ providedIn: 'root' })
export class MensajesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Envía un mensaje en la conversación de un servicio.
   * Disponible para el cliente y el personal del taller.
   */
  enviarMensaje(servicioId: number, texto: string): Observable<MensajeResponse> {
    return this.http.post<MensajeResponse>(
      `${this.apiUrl}/mensajes/servicio/${servicioId}`,
      { texto }
    );
  }

  /**
   * Lista todos los mensajes de la conversación de un servicio.
   * Marca automáticamente como leídos los mensajes recibidos.
   */
  listarMensajes(servicioId: number): Observable<ConversacionResponse> {
    return this.http.get<ConversacionResponse>(
      `${this.apiUrl}/mensajes/servicio/${servicioId}`
    );
  }

  /**
   * Marca todos los mensajes recibidos como leídos.
   */
  marcarLeidos(servicioId: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/mensajes/servicio/${servicioId}/marcar-leidos`,
      {}
    );
  }

  /**
   * Devuelve el número de mensajes no leídos.
   * Ideal para badges/notificaciones.
   */
  contarNoLeidos(servicioId: number): Observable<{ id_servicio: number; mensajes_no_leidos: number }> {
    return this.http.get<{ id_servicio: number; mensajes_no_leidos: number }>(
      `${this.apiUrl}/mensajes/servicio/${servicioId}/no-leidos`
    );
  }
}
