# Indexa

Agenda de contatos com frontend Angular 17 e API REST em Node.js/Express. Os dados ficam em um banco SQLite local.

## Requisitos

- Node.js 22.13 ou superior (o backend usa o módulo SQLite incluído no Node.js).
- Para acessar pelo celular, computador e celular precisam estar na mesma rede Wi-Fi.

## Instalação e inicialização

Instale as dependências uma vez:

```text
npm install
cd frontend
npm install
cd ..
cd backend
npm install
cd ..
```

Inicie os serviços no computador:

```text
npm start
```

O terminal mostrará o endereço local da aplicação. No celular, abra o endereço de rede exibido pelo Angular, usando a porta `4200` (por exemplo, `http://192.168.0.10:4200`). Mantenha o computador e o terminal ligados enquanto estiver usando o sistema. Se o Windows perguntar, permita o Node.js na rede privada.

## Sincronização entre aparelhos

Todos os aparelhos acessam a mesma API executada no computador. A lista e o perfil consultam o servidor a cada 3 segundos; assim, cadastros, edições e exclusões aparecem nos outros aparelhos automaticamente enquanto a página estiver aberta.

## Backend e banco de dados

- `backend/server.js`: API REST Express, validação e operações SQL.
- `backend/indexa.sqlite`: banco SQLite persistente criado automaticamente na primeira inicialização.
- `frontend/src/app/services/contato.service.ts`: chamadas HTTP para a API.
- `start.js`: inicia o backend e o servidor de desenvolvimento Angular, acessíveis pela rede local.

Rotas disponíveis:

- `GET /contatos`: lista contatos.
- `GET /contatos/:id`: consulta um contato.
- `POST /contatos`: cadastra.
- `PUT /contatos/:id`: atualiza.
- `DELETE /contatos/:id`: exclui.

Faça cópia de segurança de `backend/indexa.sqlite` para guardar ou transferir os dados. Esse banco fica no computador que está executando o backend e não é enviado ao Git. Instalações antigas que ainda tenham dados em `backend/db.json` precisam migrá-los antes de usar esta versão; o servidor atual não importa mais o JSON automaticamente.

## Estrutura das funcionalidades

- Cadastro e edição: `frontend/src/app/paginas/formulario-contato/formulario-contato.component.ts`.
- Lista e exclusão: `frontend/src/app/paginas/lista-contatos/lista-contatos.component.ts`.
- Perfil e exclusão: `frontend/src/app/paginas/perfil-contato/perfil-contato.component.ts`.
- Rotas e validação da API: `backend/server.js`.
