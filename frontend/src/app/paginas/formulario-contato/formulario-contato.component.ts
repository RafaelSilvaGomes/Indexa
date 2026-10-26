import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContainerComponent } from '../../componentes/container/container.component';
import { CabecalhoComponent } from '../../componentes/cabecalho/cabecalho.component';
import { MensagemErroComponent } from '../../componentes/mensagem-erro/mensagem-erro.component';
import { ContatoService } from '../../services/contato.service';

@Component({
  selector: 'app-formulario-contato',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ContainerComponent,
    CabecalhoComponent,
    MensagemErroComponent,
  ],
  templateUrl: './formulario-contato.component.html',
  styleUrl: './formulario-contato.component.css',
})
export class FormularioContatoComponent implements OnInit {
  id: number | null = null;
  imagem = '';
  erro = '';
  salvando = false;
  contatoForm = this.fb.nonNullable.group({
    nome: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(30)],
    ],
    telefone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    aniversario: [''],
    redes: [''],
    observacoes: [''],
  });

  constructor(
    private fb: FormBuilder,
    private contatoService: ContatoService,
    private rota: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = Number(this.rota.snapshot.paramMap.get('id'));
    if (!id) return;
    this.id = id;
    this.contatoService.buscarPorId(id).subscribe({
      next: (contato) => {
        this.contatoForm.patchValue(contato);
        this.imagem = contato.imagem || '';
      },
      error: () => (this.erro = 'Contato não encontrado.'),
    });
  }

  get titulo(): string {
    return this.id ? 'Editar contato' : 'Adicionar contato';
  }

  get voltar(): string {
    return this.id ? `/perfil-contato/${this.id}` : '/lista-contatos';
  }

  obterControle(nome: string): FormControl {
    const controle = this.contatoForm.get(nome);
    if (!controle)
      throw new Error('Controle de formulário não encontrado: ' + nome);
    return controle as FormControl;
  }

  selecionarImagem(evento: Event): void {
    const arquivo = (evento.target as HTMLInputElement).files?.[0];
    if (!arquivo) return;
    if (!arquivo.type.startsWith('image/') || arquivo.size > 1_000_000) {
      this.erro = 'Escolha uma imagem de até 1 MB.';
      return;
    }
    const leitor = new FileReader();
    leitor.onload = () => {
      this.imagem = String(leitor.result || '');
      this.erro = '';
    };
    leitor.readAsDataURL(arquivo);
  }

  salvarContato(): void {
    if (this.contatoForm.invalid) {
      this.contatoForm.markAllAsTouched();
      return;
    }
    this.salvando = true;
    this.erro = '';
    const novoContato = {
      ...this.contatoForm.getRawValue(),
      imagem: this.imagem,
    };
    this.contatoService
      .editarOuSalvarContato({
        ...novoContato,
        ...(this.id ? { id: this.id } : {}),
      })
      .subscribe({
        next: () => {
          this.contatoForm.reset();
          this.router.navigateByUrl('/lista-contatos');
        },
        error: (erro) => {
          this.erro = erro.error?.erro || 'Não foi possível salvar o contato.';
          this.salvando = false;
        },
      });
  }

  cancelar(): void {
    this.contatoForm.reset();
    this.router.navigateByUrl(this.voltar);
  }
}
