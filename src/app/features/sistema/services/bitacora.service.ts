import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

export interface BitacoraAcceso {
  id: number;
  id_usuario?: number;
  email_intentado?: string;
  ip_address?: string;
  user_agent?: string;
  accion: string;
  exito: boolean;
  fecha_hora: string;
}

export interface BitacoraListResponse {
  items: BitacoraAcceso[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class BitacoraService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listBitacora(skip: number = 0, limit: number = 20, search?: string): Observable<BitacoraListResponse> {
    let params = new HttpParams()
      .set('skip', skip.toString())
      .set('limit', limit.toString());
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<BitacoraListResponse>(`${this.apiUrl}/admin/sistema/bitacora`, { params });
  }
}
