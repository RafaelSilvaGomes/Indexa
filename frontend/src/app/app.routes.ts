import { Routes } from '@angular/router';
import { ListaContatosComponent } from './paginas/lista-contatos/lista-contatos.component';
import { FormularioContatoComponent } from './paginas/formulario-contato/formulario-contato.component';
import { PerfilContatoComponent } from './paginas/perfil-contato/perfil-contato.component';

export const routes: Routes = [
  { path: '', redirectTo: 'lista-contatos', pathMatch: 'full' },
  { path: 'lista-contatos', component: ListaContatosComponent },
  { path: 'formulario', component: FormularioContatoComponent },
  { path: 'contatos/:id', component: PerfilContatoComponent },
  { path: 'contatos/:id/editar', component: FormularioContatoComponent },
  { path: 'novo', redirectTo: 'formulario' },
  { path: '**', redirectTo: 'lista-contatos' }
];
