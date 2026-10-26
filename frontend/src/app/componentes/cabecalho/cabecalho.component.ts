import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cabecalho',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cabecalho.component.html',
  styleUrl: './cabecalho.component.css',
})
export class CabecalhoComponent {
  @Input() telaInicial = false;
  @Input() bannerSrc = '';
  @Input() titulo = '';
  @Input() voltar = '/lista-contatos';
}
