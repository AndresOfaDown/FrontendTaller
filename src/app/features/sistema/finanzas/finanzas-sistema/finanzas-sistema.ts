import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagosService, FinanzasSistemaResponse } from '../../../../core/services/pagos.service';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-finanzas-sistema',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinner
  ],
  templateUrl: './finanzas-sistema.html',
  styleUrls: ['./finanzas-sistema.scss']
})
export class FinanzasSistemaComponent implements OnInit {
  finanzas: FinanzasSistemaResponse | null = null;
  loading = false;
  error = '';
  activeTab: 'rendimiento' | 'transacciones' = 'rendimiento';

  constructor(private pagosService: PagosService) {}

  ngOnInit(): void {
    this.cargarFinanzas();
  }

  cargarFinanzas(): void {
    this.loading = true;
    this.error = '';
    
    this.pagosService.getFinanzasSistema().subscribe({
      next: (data) => {
        this.finanzas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar finanzas globales', err);
        this.error = 'No se pudo cargar la información de finanzas globales.';
        this.loading = false;
      }
    });
  }

  changeTab(tab: 'rendimiento' | 'transacciones') {
    this.activeTab = tab;
  }
}
