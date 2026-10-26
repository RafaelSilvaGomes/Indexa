import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contato, DadosContato } from '../componentes/contato/contato';

@Injectable({ providedIn: 'root' })
export class ContatoService {
  private readonly url = 'http://localhost:3000/contatos';

  constructor(private http: HttpClient) {}

  obterContatos(): Observable<Contato[]> { return this.http.get<Contato[]>(this.url); }
  buscar(id: number): Observable<Contato> { return this.http.get<Contato>(`${this.url}/${id}`); }
  salvarContato(dados: DadosContato): Observable<Contato> { return this.http.post<Contato>(this.url, dados); }
  atualizar(id: number, dados: DadosContato): Observable<Contato> { return this.http.put<Contato>(`${this.url}/${id}`, dados); }
  excluir(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
