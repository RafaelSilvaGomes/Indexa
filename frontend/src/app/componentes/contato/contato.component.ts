import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Contato } from './contato';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './contato.component.html',
  styleUrl: './contato.component.css',
})
export class ContatoComponent {
  @Input({ required: true }) contato!: Contato;
}
