import { ContainerComponent } from '../../componentes/container/container.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContatoService } from '../../services/contato.service';

@Component({
  selector: 'app-formulario-contato', standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ContainerComponent],
  templateUrl: './formulario-contato.component.html',
  styleUrl: './formulario-contato.component.css'
})
export class FormularioContatoComponent implements OnInit {
  id: number | null = null;
  imagem = '';
  erro = '';
  salvando = false;
  formulario = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
    telefone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    aniversario: [''], redes: [''], observacoes: ['']
  });

  constructor(
    private fb: FormBuilder, private contatosService: ContatoService,
    private rota: ActivatedRoute, private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.rota.snapshot.paramMap.get('id'));
    if (!id) return;
    this.id = id;
    this.contatosService.buscar(id).subscribe({
      next: contato => { this.formulario.patchValue(contato); this.imagem = contato.imagem || ''; },
      error: () => this.erro = 'Contato não encontrado.'
    });
  }

  get titulo(): string { return this.id ? 'Editar contato' : 'Adicionar contato'; }
  get voltar(): string { return this.id ? `/contatos/${this.id}` : '/lista-contatos'; }

  selecionarImagem(evento: Event): void {
    const arquivo = (evento.target as HTMLInputElement).files?.[0];
    if (!arquivo) return;
    if (!arquivo.type.startsWith('image/') || arquivo.size > 1_000_000) {
      this.erro = 'Escolha uma imagem de até 1 MB.';
      return;
    }
    const leitor = new FileReader();
    leitor.onload = () => { this.imagem = String(leitor.result || ''); this.erro = ''; };
    leitor.readAsDataURL(arquivo);
  }

  salvar(): void {
    if (this.formulario.invalid) { this.formulario.markAllAsTouched(); return; }
    this.salvando = true;
    this.erro = '';
    const dados = { ...this.formulario.getRawValue(), imagem: this.imagem };
    const requisicao = this.id
      ? this.contatosService.atualizar(this.id, dados)
      : this.contatosService.salvarContato(dados);
    requisicao.subscribe({
      next: contato => this.router.navigate(['/contatos', contato.id]),
      error: erro => { this.erro = erro.error?.erro || 'Não foi possível salvar o contato.'; this.salvando = false; }
    });
  }
}
