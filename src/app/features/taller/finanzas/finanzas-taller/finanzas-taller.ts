import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagosService, FinanzasTallerResponse } from '../../../../core/services/pagos.service';
import { ProfileService } from '../../../../core/services/profile.service';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-finanzas-taller',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinner
  ],
  templateUrl: './finanzas-taller.html',
  styleUrls: ['./finanzas-taller.scss']
})
export class FinanzasTallerComponent implements OnInit, OnChanges {
  @Input() tallerId!: number;
  
  finanzas: FinanzasTallerResponse | null = null;
  loading = true;
  error = '';
  
  displayedColumns: string[] = ['id_servicio', 'fecha', 'monto_total', 'comision', 'liquido', 'estado'];

  constructor(
    private pagosService: PagosService
  ) {}

  ngOnInit(): void {
    if (this.tallerId) {
      this.cargarFinanzas();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tallerId'] && !changes['tallerId'].firstChange) {
      this.cargarFinanzas();
    }
  }

  cargarFinanzas() {
    this.loading = true;
    this.error = '';
    
    this.pagosService.getFinanzasTaller(this.tallerId).subscribe({
      next: (data: FinanzasTallerResponse) => {
        this.finanzas = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Error al cargar las finanzas';
        this.loading = false;
      }
    });
  }
}
