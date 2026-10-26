import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contato, DadosContato } from '../componentes/contato/contato';

type ContatoParaSalvar = DadosContato & { id?: number };

@Injectable({ providedIn: 'root' })
export class ContatoService {
  private readonly API = 'http://localhost:3000/contatos';

  constructor(private http: HttpClient) {}

  obterContatos(): Observable<Contato[]> {
    return this.http.get<Contato[]>(this.API);
  }

  salvarContato(contato: DadosContato): Observable<Contato> {
    return this.http.post<Contato>(this.API, contato);
  }

  buscarPorId(id: number): Observable<Contato> {
    return this.http.get<Contato>(`${this.API}/${id}`);
  }

  excluirContato(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  editarContato(
    contato: ContatoParaSalvar & { id: number },
  ): Observable<Contato> {
    return this.http.put<Contato>(`${this.API}/${contato.id}`, contato);
  }

  editarOuSalvarContato(contato: ContatoParaSalvar): Observable<Contato> {
    if (contato.id) {
      return this.editarContato({ ...contato, id: contato.id });
    }
    return this.salvarContato(contato);
  }
}
