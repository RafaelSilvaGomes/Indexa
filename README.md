# Indexa

O frontend foi feito em Angular 17.

## Executar no VS Code

Abra a pasta no VSCode e rode npm start no terminal.

- Aplicação: http://localhost:4200
- API: http://localhost:3000/contatos

Deixe o terminal aberto. Para parar, pressione Ctrl+C.

Em outro computador, instale as dependências uma vez em cada pasta:

cd frontend
npm install
cd ..\backend
npm install
cd ..
npm start

## Como o backend funciona

O arquivo backend/server.js define as rotas:

- GET /contatos: lista todos os contatos.
- GET /contatos/:id: busca um contato.
- POST /contatos: cadastra um contato.
- PUT /contatos/:id: atualiza um contato.
- DELETE /contatos/:id: exclui um contato.

As funções lerContatos e salvarContatos usam backend/db.json como armazenamento. A função validarContato confere nome, telefone e e-mail antes de salvar. O frontend chama essas rotas em frontend/src/app/services/contato.service.ts.

Para modificar o backend, edite backend/server.js. Para alterar os dados iniciais, edite backend/db.json. Para testar a compilação do Angular, rode npm run build na pasta principal.

## Demonstração rápida

1. Abra a lista e pesquise agata para encontrar Ágata sem digitar o acento.
2. Cadastre um contato com nome, telefone e e-mail.
3. Abra o perfil, edite o nome e recarregue a página.
4. Mostre que o dado ficou salvo em backend/db.json.
5. Exclua o contato de teste.
