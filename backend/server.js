// API REST do Indexa com armazenamento persistente em SQLite.
const express = require("express");
const cors = require("cors");
const os = require("node:os");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const app = express();
const porta = Number(process.env.PORT || 3000);
const arquivoBanco = path.join(__dirname, "indexa.sqlite");
const db = new DatabaseSync(arquivoBanco);

db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS contatos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL,
    email TEXT NOT NULL,
    aniversario TEXT NOT NULL DEFAULT '',
    redes TEXT NOT NULL DEFAULT '',
    observacoes TEXT NOT NULL DEFAULT '',
    imagem TEXT NOT NULL DEFAULT ''
  );
`);

app.use(cors());
app.use(express.json({ limit: "2mb" }));

const campos = "id, nome, telefone, email, aniversario, redes, observacoes, imagem";
const buscarTodos = db.prepare(`SELECT ${campos} FROM contatos ORDER BY nome COLLATE NOCASE`);
const buscarPorId = db.prepare(`SELECT ${campos} FROM contatos WHERE id = ?`);
const inserirContato = db.prepare(`
  INSERT INTO contatos (nome, telefone, email, aniversario, redes, observacoes, imagem)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
const atualizarContato = db.prepare(`
  UPDATE contatos
  SET nome = ?, telefone = ?, email = ?, aniversario = ?, redes = ?, observacoes = ?, imagem = ?
  WHERE id = ?
`);
const excluirContato = db.prepare("DELETE FROM contatos WHERE id = ?");

function validarContato(dados) {
  const nome = String(dados?.nome || "").trim();
  const telefone = String(dados?.telefone || "").trim();
  const email = String(dados?.email || "").trim();

  if (nome.length < 4 || nome.length > 30) {
    return { erro: "O nome deve ter de 4 a 30 caracteres." };
  }
  if (!telefone) return { erro: "Informe o telefone." };
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

function valores(dados) {
  return [dados.nome, dados.telefone, dados.email, dados.aniversario,
    dados.redes, dados.observacoes, dados.imagem];
}

app.get("/contatos", (req, res) => res.json(buscarTodos.all()));

app.get("/contatos/:id", (req, res) => {
  const contato = buscarPorId.get(Number(req.params.id));
  if (!contato) return res.status(404).json({ erro: "Contato não encontrado." });
  res.json(contato);
});

app.post("/contatos", (req, res) => {
  const dados = validarContato(req.body);
  if (dados.erro) return res.status(400).json(dados);
  const resultado = inserirContato.run(...valores(dados));
  res.status(201).json(buscarPorId.get(Number(resultado.lastInsertRowid)));
});

app.put("/contatos/:id", (req, res) => {
  const dados = validarContato(req.body);
  if (dados.erro) return res.status(400).json(dados);
  const id = Number(req.params.id);
  const resultado = atualizarContato.run(...valores(dados), id);
  if (!resultado.changes) return res.status(404).json({ erro: "Contato não encontrado." });
  res.json(buscarPorId.get(id));
});

app.delete("/contatos/:id", (req, res) => {
  const resultado = excluirContato.run(Number(req.params.id));
  if (!resultado.changes) return res.status(404).json({ erro: "Contato não encontrado." });
  res.sendStatus(204);
});

app.use((erro, req, res, next) => {
  console.error(erro);
  res.status(400).json({ erro: erro.message || "Erro na requisição." });
});

app.listen(porta, "0.0.0.0", () => {
  console.log(`API Indexa: http://localhost:${porta}/contatos`);
  const ips = Object.values(os.networkInterfaces())
    .flat()
    .filter((item) => item && item.family === "IPv4" && !item.internal)
    .map((item) => item.address);
  for (const ip of ips) console.log(`Acesso na rede: http://${ip}:${porta}/contatos`);
});

for (const sinal of ["SIGINT", "SIGTERM"]) {
  process.on(sinal, () => {
    db.close();
    process.exit(0);
  });
}
