import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminUsuariosService, UsuarioAdmin } from '../../../core/services/admin-usuarios.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Button } from '../../../shared/components/button/button';
import { InputField } from '../../../shared/components/input-field/input-field';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-usuarios-page',
  standalone: true,
  imports: [CommonModule, FormsModule, Button, LoadingSpinner],
  templateUrl: './usuarios-page.html',
  styleUrls: ['./usuarios-page.scss']
})
export class UsuariosPage implements OnInit {
  usuarios: UsuarioAdmin[] = [];
  total = 0;
  skip = 0;
  limit = 10;
  searchQuery = '';
  isLoading = false;

  constructor(
    private adminUsuariosService: AdminUsuariosService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(showSpinner: boolean = true) {
    if (showSpinner) {
      this.isLoading = true;
    }
    this.adminUsuariosService.list(this.skip, this.limit, this.searchQuery).subscribe({
      next: (res) => {
        this.usuarios = res.items;
        this.total = res.total;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.notificationService.showError('Error al cargar usuarios');
        this.cdr.detectChanges();
      }
    });
  }

  onSearch() {
    this.skip = 0;
    this.loadUsuarios(true);
  }

  clearSearch() {
    this.searchQuery = '';
    this.onSearch();
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.limit);
  }

  get currentPage(): number {
    return Math.floor(this.skip / this.limit) + 1;
  }

  nextPage() {
    if (this.skip + this.limit < this.total) {
      this.skip += this.limit;
      this.loadUsuarios();
    }
  }

  prevPage() {
    if (this.skip > 0) {
      this.skip -= this.limit;
      this.loadUsuarios();
    }
  }

  toggleStatus(usuario: UsuarioAdmin) {
    const action = usuario.is_active ? 'suspender' : 'activar';
    if (!confirm(`¿Estás seguro de ${action} a este usuario?`)) {
      return;
    }
    
    // Optimistic UI update could go here, or just wait for server
    this.adminUsuariosService.toggleStatus(usuario.id).subscribe({
      next: (updatedUser) => {
        const index = this.usuarios.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.usuarios[index] = updatedUser;
        }
        this.notificationService.showSuccess(`Usuario ${updatedUser.is_active ? 'activado' : 'suspendido'} correctamente`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        const msg = err.error?.detail || `Error al ${action} el usuario`;
        this.notificationService.showError(msg);
      }
    });
  }
}
