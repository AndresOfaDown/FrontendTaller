import { Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TallerServiciosService, SolicitudServicioList, TecnicoDisponible, VehiculoDisponible, SolicitudServicioDetalle } from '../../../core/services/taller-servicios.service';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { Modal } from '../../../shared/components/modal/modal';

@Component({
  selector: 'app-solicitudes-taller-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinner, Modal],
  templateUrl: './solicitudes-taller-page.html',
  styleUrls: ['./solicitudes-taller-page.scss']
})
export class SolicitudesTallerPage implements OnChanges, OnInit {
  @Input() tallerId!: number;

  solicitudes: SolicitudServicioList[] = [];
  isLoading = false;

  // Modal State
  showAceptarModal = false;
  showCotizarModal = false;
  selectedSolicitudId: number | null = null;
  isSubmitting = false;

  cotizacionMonto: number | null = null;
  solicitudDetalle: SolicitudServicioDetalle | null = null;
  isLoadingDetalle = false;

  // Data for Selects
  tecnicosDisponibles: TecnicoDisponible[] = [];
  vehiculosDisponibles: VehiculoDisponible[] = [];

  // Selections
  selectedTecnicoId: number | null = null;
  selectedVehiculoId: number | null = null;

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
        // Ocultar las solicitudes que ya tienen un servicio iniciado
        this.solicitudes = data.filter((s: any) => !s.tiene_servicio);
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
    this.selectedSolicitudId = solicitudId;
    this.selectedTecnicoId = null;
    this.selectedVehiculoId = null;
    
    // Cargar técnicos y vehículos disponibles
    this.tallerServiciosService.listarTecnicosDisponibles(this.tallerId).subscribe({
      next: (tecnicos) => this.tecnicosDisponibles = tecnicos,
      error: (err) => console.error('Error al cargar técnicos', err)
    });

    this.tallerServiciosService.listarVehiculosDisponibles(this.tallerId).subscribe({
      next: (vehiculos) => this.vehiculosDisponibles = vehiculos,
      error: (err) => console.error('Error al cargar vehículos', err)
    });

    this.showAceptarModal = true;
  }

  cerrarModal() {
    this.showAceptarModal = false;
    this.showCotizarModal = false;
    this.selectedSolicitudId = null;
    this.cotizacionMonto = null;
    this.solicitudDetalle = null;
  }

  abrirCotizar(solicitudId: number) {
    this.selectedSolicitudId = solicitudId;
    this.cotizacionMonto = null;
    this.solicitudDetalle = null;
    this.showCotizarModal = true;
    this.isLoadingDetalle = true;
    this.cdr.detectChanges();

    this.tallerServiciosService.obtenerDetalleSolicitud(solicitudId, this.tallerId).subscribe({
      next: (detalle) => {
        this.solicitudDetalle = detalle;
        this.isLoadingDetalle = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar detalle', err);
        this.isLoadingDetalle = false;
        this.cdr.detectChanges();
      }
    });
  }

  confirmarCotizar() {
    if (!this.selectedSolicitudId || !this.cotizacionMonto || this.cotizacionMonto <= 0) {
      alert('Por favor ingresa un monto válido.');
      return;
    }

    this.isSubmitting = true;
    const data = { costo_estimado: this.cotizacionMonto };

    this.tallerServiciosService.cotizarSolicitud(this.selectedSolicitudId, this.tallerId, data).subscribe({
      next: () => {
        alert('Cotización enviada al cliente.');
        this.isSubmitting = false;
        this.cerrarModal();
        this.cargarSolicitudes();
      },
      error: (err: any) => {
        console.error(err);
        alert('Error al enviar la cotización.');
        this.isSubmitting = false;
      }
    });
  }

  confirmarAceptar() {
    if (!this.selectedSolicitudId) return;
    if (!this.selectedTecnicoId) {
      alert('Debes seleccionar al menos un técnico.');
      return;
    }

    this.isSubmitting = true;
    
    const tecnicos_ids = [Number(this.selectedTecnicoId)];
    const vehiculos_ids = this.selectedVehiculoId ? [Number(this.selectedVehiculoId)] : [];

    const data = {
      id_solicitud_servicio: this.selectedSolicitudId,
      tecnicos_ids,
      vehiculos_ids
    };

    this.tallerServiciosService.iniciarServicio(this.selectedSolicitudId, this.tallerId, data).subscribe({
      next: () => {
        alert('Solicitud aceptada exitosamente. El servicio está en curso.');
        this.isSubmitting = false;
        this.cerrarModal();
        this.cargarSolicitudes();
      },
      error: (err: any) => {
        console.error(err);
        alert('Error al aceptar la solicitud. Revisa si hay técnicos o vehículos disponibles.');
        this.isSubmitting = false;
      }
    });
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
