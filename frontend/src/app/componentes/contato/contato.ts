export interface Contato {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  aniversario: string;
  redes: string;
  observacoes: string;
  imagem: string;
}

export type DadosContato = Omit<Contato, 'id'>;
