import { Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TallerServiciosService, SolicitudServicioList } from '../../../core/services/taller-servicios.service';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-solicitudes-taller-page',
  standalone: true,
  imports: [CommonModule, LoadingSpinner],
  templateUrl: './solicitudes-taller-page.html',
  styleUrls: ['./solicitudes-taller-page.scss']
})
export class SolicitudesTallerPage implements OnChanges, OnInit {
  @Input() tallerId!: number;

  solicitudes: SolicitudServicioList[] = [];
  isLoading = false;

  constructor(
    private tallerServiciosService: TallerServiciosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.tallerId) {
      this.cargarSolicitudes();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tallerId'] && this.tallerId && !changes['tallerId'].isFirstChange()) {
      this.cargarSolicitudes();
    }
  }

  cargarSolicitudes() {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    this.tallerServiciosService.listarSolicitudesRecientes(this.tallerId).subscribe({
      next: (data: any) => {
        this.solicitudes = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar solicitudes recientes', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  aceptarSolicitud(solicitudId: number) {
    alert('Para aceptar la solicitud, primero debes asignar técnicos y vehículos. Esta función está en desarrollo.');
    // TODO: Implementar modal para seleccionar técnicos y vehículos antes de aceptar
    // this.tallerServiciosService.aceptarSolicitud(solicitudId, this.tallerId, data).subscribe(...)
  }

  rechazarSolicitud(solicitudId: number) {
    if (confirm('¿Estás seguro de rechazar esta solicitud?')) {
      this.tallerServiciosService.rechazarSolicitud(solicitudId, this.tallerId).subscribe({
        next: () => {
          alert('Solicitud rechazada');
          this.cargarSolicitudes(); // Recargar la lista
        },
        error: (err: any) => {
          console.error(err);
          alert('Error al rechazar la solicitud');
        }
      });
    }
  }
}
