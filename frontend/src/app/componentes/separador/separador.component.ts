import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-separador', standalone: true,
  templateUrl: './separador.component.html', styleUrl: './separador.component.css'
})
export class SeparadorComponent {
  @Input({ required: true }) letra = '';
}
