import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContainerComponent } from '../../componentes/container/container.component';
import { CabecalhoComponent } from '../../componentes/cabecalho/cabecalho.component';
import { SeparadorComponent } from '../../componentes/separador/separador.component';
import { ContatoComponent } from '../../componentes/contato/contato.component';
import { Contato } from '../../componentes/contato/contato';
import { ContatoService } from '../../services/contato.service';

@Component({
  selector: 'app-lista-contatos',
  standalone: true,
  imports: [
    SeparadorComponent,
    ContainerComponent,
    CabecalhoComponent,
    FormsModule,
    ContatoComponent,
    RouterLink,
  ],
  templateUrl: './lista-contatos.component.html',
  styleUrl: './lista-contatos.component.css',
})
export class ListaContatosComponent implements OnInit, OnDestroy {
  contatos: Contato[] = [];
  filtroPorTexto = '';
  erro = '';
  carregando = true;
  alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  constructor(private contatoService: ContatoService) {}

  private temporizador?: number;

  ngOnInit(): void {
    this.carregar();
    // Atualiza a lista periodicamente para refletir alterações feitas em outro aparelho.
    this.temporizador = window.setInterval(() => this.sincronizar(), 3000);
  }

  ngOnDestroy(): void {
    if (this.temporizador) window.clearInterval(this.temporizador);
  }

  private sincronizar(): void {
    this.contatoService.obterContatos().subscribe({
      next: contatos => { this.contatos = contatos; this.erro = ''; },
      error: () => this.erro = 'Sem conexão com o servidor. As alterações serão sincronizadas quando a conexão voltar.'
    });
  }
  carregar(): void {
    this.contatoService.obterContatos().subscribe({
      next: (listaContatos) => {
        this.contatos = listaContatos;
        this.carregando = false;
        this.erro = '';
      },
      error: () => {
        this.erro =
          'Não foi possível carregar os contatos. Verifique se o backend está ligado.';
        this.carregando = false;
      },
    });
  }

  filtrarContatosPorLetraInicial(letra: string): Contato[] {
    return this.filtrarContatosPorTexto().filter((contato) =>
      this.removerAcentos(contato.nome)
        .toLowerCase()
        .startsWith(this.removerAcentos(letra).toLowerCase()),
    );
  }

  filtrarContatosPorTexto(): Contato[] {
    if (!this.filtroPorTexto) {
      return this.contatos;
    }
    return this.contatos.filter((contato) =>
      this.removerAcentos(contato.nome)
        .toLowerCase()
        .includes(this.removerAcentos(this.filtroPorTexto).toLowerCase()),
    );
  }

  private removerAcentos(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
