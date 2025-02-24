import { Routes } from '@angular/router';
import { NewComponent } from './components/new/new.component';
import { ListComponent } from './components/list/list.component';

export const routes: Routes = [
    { path: '', redirectTo: '/new', pathMatch: 'full' }, // Redirección inicial
    { path: 'new', component: NewComponent }, // Ruta para el formulario
    { path: 'list', component: ListComponent }, // Ruta para la lista de perfiles
];
