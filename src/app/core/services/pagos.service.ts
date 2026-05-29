import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// ============================================================
// INTERFACES
// ============================================================

export interface GenerarCobroRequest {
  monto_total: number;
}

export interface FacturaResponse {
  id: number;
  id_servicio: number;
  monto_total: number;
  comision: number;
  liquido_taller: number;
  estado_pago: string; // 'pendiente' | 'pagado' | 'fallido'
  metodo_pago?: string; // 'stripe' | 'efectivo'
  url_qr?: string; // URL del link de pago Stripe
  fecha_emision: string; // ISO datetime
  fecha_pago?: string; // ISO datetime
}

// ============================================================
// SERVICE
// ============================================================

@Injectable({ providedIn: 'root' })
export class PagosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * [TÉCNICO] Genera una factura y un link de pago de Stripe para un servicio.
   * El servicio debe estar 'en_atencion'.
   */
  generarCobro(servicioId: number, montoTotal: number): Observable<FacturaResponse> {
    return this.http.post<FacturaResponse>(
      `${this.apiUrl}/pagos/servicio/${servicioId}/generar`,
      { monto_total: montoTotal }
    );
  }

  /**
   * [TÉCNICO] Marca el servicio como pagado en efectivo.
   * Calcula comisiones y finaliza el servicio automáticamente.
   */
  marcarPagoEfectivo(servicioId: number, montoTotal: number): Observable<FacturaResponse> {
    return this.http.post<FacturaResponse>(
      `${this.apiUrl}/pagos/servicio/${servicioId}/pago-efectivo`,
      { monto_total: montoTotal }
    );
  }

  /**
   * [CLIENTE/TALLER] Consulta la factura y el link de pago de un servicio.
   */
  consultarFactura(servicioId: number): Observable<FacturaResponse> {
    return this.http.get<FacturaResponse>(
      `${this.apiUrl}/pagos/servicio/${servicioId}`
    );
  }
}
