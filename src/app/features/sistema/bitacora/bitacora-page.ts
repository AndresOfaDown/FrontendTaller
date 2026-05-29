import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BitacoraService, BitacoraAcceso } from '../services/bitacora.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { Button } from '../../../shared/components/button/button';

@Component({
  selector: 'app-bitacora-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinner, Button],
  templateUrl: './bitacora-page.html',
  styleUrls: ['./bitacora-page.scss']
})
export class BitacoraPage implements OnInit {
  items: BitacoraAcceso[] = [];
  total: number = 0;
  skip: number = 0;
  limit: number = 20;
  search: string = '';
  loading: boolean = true;

  constructor(
    private bitacoraService: BitacoraService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadBitacora();
  }

  loadBitacora() {
    this.loading = true;
    this.bitacoraService.listBitacora(this.skip, this.limit, this.search).subscribe({
      next: (res) => {
        this.items = res.items;
        this.total = res.total;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error en petición HTTP de bitacora:", err);
        this.notificationService.showError('Error al cargar la bitácora');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch() {
    this.skip = 0;
    this.loadBitacora();
  }

  nextPage() {
    if (this.skip + this.limit < this.total) {
      this.skip += this.limit;
      this.loadBitacora();
    }
  }

  prevPage() {
    if (this.skip > 0) {
      this.skip -= this.limit;
      this.loadBitacora();
    }
  }
}
