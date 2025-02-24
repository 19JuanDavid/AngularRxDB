import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable, of, catchError, map } from 'rxjs';
import { DbService } from '../../services/db.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

interface Perfil {
  id: string;
  nombre: string;
  correo: string;
  edad: number;
  altura: number;
  peso: number;
  timestamp: string;
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  public message$!: Observable<Perfil[]>;
  public editarPerfilForm!: FormGroup;
  public perfilSeleccionado: Perfil | null = null;
  public editandoPerfil: boolean = false;  // Bandera para controlar la vista del formulario

  dbsvc = inject(DbService);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.loadMessages();
  }

  // Método para cargar los perfiles
  private async loadMessages() {
    try {
      const db = await this.dbsvc.getDb();
      if (db) {
        this.message$ = db.message.find().$.pipe(
          map((docs: any) => docs.map((doc: any) => doc.toJSON())),
          catchError((error) => {
            console.error('Error al obtener los mensajes', error);
            return of([]);
          })
        );
      } else {
        console.error('Base de datos no inicializada');
        this.message$ = of([]);
      }
    } catch (error) {
      console.error('Error al acceder a la base de datos', error);
      this.message$ = of([]);
    }
  }

  // Método para editar perfil
  editarPerfil(perfil: Perfil) {
    this.perfilSeleccionado = perfil;
    this.editandoPerfil = true;
    this.editarPerfilForm = this.fb.group({
      nombre: [perfil.nombre],
      correo: [perfil.correo],
      edad: [perfil.edad],
      altura: [perfil.altura],
      peso: [perfil.peso],
    });
  }

  // Método para cancelar la edición
  cancelarEdicion() {
    this.perfilSeleccionado = null;
    this.editandoPerfil = false;
  }

  // Método para guardar los cambios
  async guardarCambios() {
    if (this.editarPerfilForm.invalid) {
      console.error('Formulario inválido');
      return;
    }

    const { nombre, correo, edad, altura, peso } = this.editarPerfilForm.value;
    const db = await this.dbsvc.getDb();
    if (db && this.perfilSeleccionado) {
      try {
        await db.message.upsert({
          ...this.perfilSeleccionado,
          nombre,
          correo,
          edad,
          altura,
          peso,
          timestamp: new Date().toISOString(),
        });

        // Reiniciar el perfil seleccionado y el formulario
        this.perfilSeleccionado = null;
        this.editandoPerfil = false;
        this.editarPerfilForm.reset();
        this.loadMessages(); // Recargar los perfiles después de la edición
      } catch (error) {
        console.error('Error al actualizar el perfil', error);
      }
    }
  }

  // Método para eliminar perfil
  async eliminarPerfil(perfil: Perfil) {
    const db = await this.dbsvc.getDb();
    if (db && perfil.id) {
      try {
        const doc = await db.message.findOne({ selector: { id: perfil.id } }).exec();
        if (doc) {
          await doc.remove();
          console.log(`Perfil con ID ${perfil.id} eliminado`);
        } else {
          console.error('Documento no encontrado');
        }
        this.loadMessages();  // Recargar los perfiles después de la eliminación
      } catch (error) {
        console.error('Error al eliminar el perfil', error);
      }
    } else {
      console.error('Base de datos no inicializada o ID del perfil no encontrado');
    }
  }
}
