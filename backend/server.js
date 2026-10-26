// Backend do Indexa: rotas HTTP e dados salvos em db.json.
const express = require("express");
const cors = require("cors");
const fs = require("node:fs");
const path = require("node:path");

const app = express();
const arquivo = path.join(__dirname, "db.json");
const porta = 3000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

function lerContatos() {
  return JSON.parse(fs.readFileSync(arquivo, "utf8")).contatos;
}

function salvarContatos(contatos) {
  fs.writeFileSync(arquivo, JSON.stringify({ contatos }, null, 2) + "\n");
}

function validarContato(dados) {
  const nome = String(dados?.nome || "").trim();
  const telefone = String(dados?.telefone || "").trim();
  const email = String(dados?.email || "").trim();

  if (nome.length < 4 || nome.length > 30) {
    return { erro: "O nome deve ter de 4 a 30 caracteres." };
  }
  if (!telefone) {
    return { erro: "Informe o telefone." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { erro: "Informe um e-mail válido." };
  }

  return {
    nome,
    telefone,
    email,
    aniversario: String(dados.aniversario || ""),
    redes: String(dados.redes || ""),
    observacoes: String(dados.observacoes || ""),
    imagem: String(dados.imagem || ""),
  };
}

app.get("/contatos", (req, res) => {
  res.json(lerContatos());
});

app.get("/contatos/:id", (req, res) => {
  const contato = lerContatos().find(
    (item) => item.id === Number(req.params.id),
  );
  if (!contato)
    return res.status(404).json({ erro: "Contato não encontrado." });
  res.json(contato);
});

app.post("/contatos", (req, res) => {
  const dados = validarContato(req.body);
  if (dados.erro) return res.status(400).json(dados);

  const contatos = lerContatos();
  const id = Math.max(0, ...contatos.map((item) => Number(item.id))) + 1;
  const contato = { id, ...dados };
  contatos.push(contato);
  salvarContatos(contatos);
  res.status(201).json(contato);
});

app.put("/contatos/:id", (req, res) => {
  const dados = validarContato(req.body);
  if (dados.erro) return res.status(400).json(dados);

  const contatos = lerContatos();
  const indice = contatos.findIndex(
    (item) => item.id === Number(req.params.id),
  );
  if (indice === -1)
    return res.status(404).json({ erro: "Contato não encontrado." });

  const contato = { id: contatos[indice].id, ...dados };
  contatos[indice] = contato;
  salvarContatos(contatos);
  res.json(contato);
});

app.delete("/contatos/:id", (req, res) => {
  const contatos = lerContatos();
  const indice = contatos.findIndex(
    (item) => item.id === Number(req.params.id),
  );
  if (indice === -1)
    return res.status(404).json({ erro: "Contato não encontrado." });

  contatos.splice(indice, 1);
  salvarContatos(contatos);
  res.sendStatus(204);
});

app.use((erro, req, res, next) => {
  res.status(400).json({ erro: erro.message || "Erro na requisição." });
});

app.listen(porta, () => {
  console.log("Backend Indexa: http://localhost:" + porta + "/contatos");
});
