import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DbService } from '../../services/db.service';
import { CommonModule } from '@angular/common';
import { RxDocumentBase } from 'rxdb';
import { Router } from '@angular/router';  // Importamos Router

@Component({
  selector: 'app-new',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css'],
})
export class NewComponent implements OnInit {
  messageForm!: FormGroup;
  dbSvc = inject(DbService);
  router = inject(Router);  // Inyectamos el servicio Router

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
  }

  // Método para manejar el envío del formulario
  async onSubmit() {
    const { nombre, correo, edad, altura, peso } = this.messageForm.value;

    // Validación de campos vacíos
    if (!nombre || !correo || !edad || !altura || !peso) {
      alert('Formulario incompleto');
      return;  // Salir si el formulario no está completo
    }

    const data = {
      id: new Date().toISOString(),  // Generar un id único para el mensaje
      nombre,  // Guardar el contenido
      correo,
      edad,
      altura,
      peso,
      timestamp: new Date().toISOString(),  // Establecer un timestamp
    } as unknown as RxDocumentBase<{}, {}>;

    try {
      const db = await this.dbSvc.getDb();
      if (db) {
        // Insertar el mensaje en la colección 'message'
        await db.message.insert(data);
        this.messageForm.reset();  // Limpiar el formulario después de guardar
        this.router.navigate(['/list']);  // Redirigir a la vista de perfiles
      } else {
        console.error('Base de datos no inicializada');
      }
    } catch (error) {
      alert('Error al guardar el mensaje');
      console.error(error);
    }
  }

  // Método privado para crear el formulario reactivo
  private createForm() {
    this.messageForm = this.fb.group({
      nombre: [''],
      correo: [''],
      edad: [''],
      altura: [''],
      peso: [''],
    });
  }
}
