import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// ============================================================
// INTERFACES
// ============================================================

export interface TallerMonitoreo {
  id: number;
  nombre: string;
  telefono?: string;
  email?: string;
  direccion?: string;
}

export interface TecnicoMonitoreo {
  id_empleado: number;
  nombre: string;
}

export interface VehiculoMonitoreo {
  id: number;
  matricula: string;
  marca: string;
  modelo: string;
}

export interface DiagnosticoMonitoreo {
  id: number;
  descripcion?: string;
  nivel_confianza: number;
}

export interface HistorialEstadoMonitoreo {
  estado: string;
  estado_descripcion: string;
  fecha: string; // ISO datetime
  tiempo_desde_anterior?: number; // segundos
}

export interface UbicacionTecnicoMonitoreo {
  latitud: number;
  longitud: number;
  timestamp: string; // ISO datetime
  distancia_km?: number;
  eta_minutos?: number;
  metodo_eta?: string;
}

export interface ServicioMonitoreoResponse {
  id: number;
  fecha: string;
  estado: string;
  estado_descripcion: string;
  taller: TallerMonitoreo;
  tecnicos: TecnicoMonitoreo[];
  vehiculos: VehiculoMonitoreo[];
  diagnostico?: DiagnosticoMonitoreo;
  ubicacion_cliente_lat?: number;
  ubicacion_cliente_lon?: number;
  ubicacion_tecnico?: UbicacionTecnicoMonitoreo;
  historial: HistorialEstadoMonitoreo[];
}

export interface ServicioListaClienteResponse {
  id: number;
  fecha: string;
  estado: string;
  estado_descripcion: string;
  taller_nombre: string;
  diagnostico_descripcion?: string;
}

// ============================================================
// SERVICE
// ============================================================

@Injectable({ providedIn: 'root' })
export class MonitoreoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * [CLIENTE] Lista todos los servicios del cliente (activos e históricos).
   */
  listarMisServicios(): Observable<ServicioListaClienteResponse[]> {
    return this.http.get<ServicioListaClienteResponse[]>(
      `${this.apiUrl}/monitoreo/mis-servicios`
    );
  }

  /**
   * [CLIENTE] Obtiene el estado completo de un servicio para monitoreo.
   * Incluye taller, técnicos, vehículos, diagnóstico, ubicación del técnico e historial.
   */
  obtenerMonitoreoServicio(servicioId: number): Observable<ServicioMonitoreoResponse> {
    return this.http.get<ServicioMonitoreoResponse>(
      `${this.apiUrl}/monitoreo/servicio/${servicioId}`
    );
  }

  /**
   * [CLIENTE] Obtiene la última ubicación GPS del técnico con ETA.
   * Endpoint ligero, ideal para polling frecuente desde el mapa.
   */
  obtenerUbicacionTecnico(servicioId: number): Observable<UbicacionTecnicoMonitoreo> {
    return this.http.get<UbicacionTecnicoMonitoreo>(
      `${this.apiUrl}/monitoreo/servicio/${servicioId}/ubicacion-tecnico`
    );
  }

  /**
   * [CLIENTE] Obtiene el historial completo de cambios de estado del servicio.
   */
  obtenerTimeline(servicioId: number): Observable<HistorialEstadoMonitoreo[]> {
    return this.http.get<HistorialEstadoMonitoreo[]>(
      `${this.apiUrl}/monitoreo/servicio/${servicioId}/timeline`
    );
  }
}
