import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContainerComponent } from '../../componentes/container/container.component';
import { CabecalhoComponent } from '../../componentes/cabecalho/cabecalho.component';
import { SeparadorComponent } from '../../componentes/separador/separador.component';
import { ContatoComponent } from '../../componentes/contato/contato.component';
import { Contato } from '../../componentes/contato/contato';
import { ContatoService } from '../../services/contato.service';

@Component({
  selector: 'app-lista-contatos', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ContainerComponent, CabecalhoComponent, SeparadorComponent, ContatoComponent],
  templateUrl: './lista-contatos.component.html',
  styleUrl: './lista-contatos.component.css'
})
export class ListaContatosComponent implements OnInit {
  contatos: Contato[] = [];
  filtroPorTexto = '';
  erro = '';
  carregando = true;
  readonly alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  constructor(private contatosService: ContatoService) {}

  ngOnInit(): void { this.carregar(); }
  carregar(): void {
    this.contatosService.obterContatos().subscribe({
      next: contatos => { this.contatos = contatos; this.carregando = false; this.erro = ''; },
      error: () => { this.erro = 'Não foi possível carregar os contatos. Verifique se o backend está ligado.'; this.carregando = false; }
    });
  }
  normalizar(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
  }
  porLetra(letra: string): Contato[] {
    const filtro = this.normalizar(this.filtroPorTexto.trim());
    return this.contatos
      .filter(contato => this.normalizar(contato.nome).startsWith(letra))
      .filter(contato => !filtro || this.normalizar(contato.nome).includes(filtro) || contato.telefone.includes(filtro))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  }
  get totalFiltrado(): number {
    const filtro = this.normalizar(this.filtroPorTexto.trim());
    return this.contatos.filter(contato => !filtro || this.normalizar(contato.nome).includes(filtro) || contato.telefone.includes(filtro)).length;
  }
  excluir(contato: Contato): void {
    if (!confirm(`Excluir ${contato.nome} da agenda?`)) return;
    this.contatosService.excluir(contato.id).subscribe({
      next: () => this.contatos = this.contatos.filter(item => item.id !== contato.id),
      error: () => this.erro = 'Não foi possível excluir o contato.'
    });
  }
}
