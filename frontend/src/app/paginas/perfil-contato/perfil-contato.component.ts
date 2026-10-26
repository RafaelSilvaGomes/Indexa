import { ContainerComponent } from '../../componentes/container/container.component';
import { CabecalhoComponent } from '../../componentes/cabecalho/cabecalho.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Contato } from '../../componentes/contato/contato';
import { ContatoService } from '../../services/contato.service';

@Component({
  selector: 'app-perfil-contato',
  standalone: true,
  imports: [CommonModule, RouterLink, ContainerComponent, CabecalhoComponent],
  templateUrl: './perfil-contato.component.html',
  styleUrl: './perfil-contato.component.css',
})
export class PerfilContatoComponent implements OnInit {
  contato?: Contato;
  erro = '';
  constructor(
    private rota: ActivatedRoute,
    private router: Router,
    private contatosService: ContatoService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.rota.snapshot.paramMap.get('id'));
    this.contatosService.buscarPorId(id).subscribe({
      next: (contato) => (this.contato = contato),
      error: () => (this.erro = 'Contato não encontrado.'),
    });
  }

  data(iso: string): string {
    if (!iso) return '';
    const [ano, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  excluir(): void {
    if (!this.contato || !confirm(`Excluir ${this.contato.nome} da agenda?`))
      return;
    this.contatosService.excluirContato(this.contato.id).subscribe({
      next: () => this.router.navigate(['/lista-contatos']),
      error: () => (this.erro = 'Não foi possível excluir o contato.'),
    });
  }
}
