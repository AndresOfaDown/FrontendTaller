import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UsuarioAdmin {
  id: number;
  username: string;
  email: string;
  nombre_completo: string;
  ci: string | null;
  roles: string[];
  is_active: boolean;
}

export interface UsuarioAdminListResponse {
  items: UsuarioAdmin[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class AdminUsuariosService {
  private apiUrl = `${environment.apiUrl}/admin/usuarios`;

  constructor(private http: HttpClient) {}

  list(skip: number = 0, limit: number = 10, search?: string): Observable<UsuarioAdminListResponse> {
    let params = new HttpParams()
      .set('skip', skip.toString())
      .set('limit', limit.toString());
      
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<UsuarioAdminListResponse>(this.apiUrl, { params });
  }

  toggleStatus(idUsuario: number): Observable<UsuarioAdmin> {
    return this.http.put<UsuarioAdmin>(`${this.apiUrl}/${idUsuario}/toggle-status`, {});
  }
}
