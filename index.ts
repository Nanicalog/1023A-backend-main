import mysql from 'mysql2/promise';
import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';

const app = fastify();
app.register(cors, {
  origin: '*', // Permite requisições de qualquer origem (em desenvolvimento, use domínios específicos em produção)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permite os métodos necessários
});

async function criarConexao() {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "Caladan",
    port: 3306
  });
}

app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
  reply.status(200).send({ mensagem: "API Caladan - Backend" });
});

app.get('/produtos', async (request: FastifyRequest, reply: FastifyReply) => {
  const { categoria } = request.query as any;
  let conn;
  try {
    conn = await criarConexao();

    let sql = `
      SELECT p.id, p.nome, p.preco, c.nome AS categoria
      FROM produtos p
      INNER JOIN categorias c ON p.categoria_id = c.id
    `;
    const params: any[] = [];

    if (categoria) {
      sql += " WHERE c.nome = ?";
      params.push(categoria);
    }

    const [rows] = await conn.query(sql, params);
    reply.status(200).send(rows);
  } catch (erro: any) {
    tratarErro(erro, reply);
  } finally {
    if (conn) await conn.end();
  }
});


app.post('/produtos', async (request: FastifyRequest, reply: FastifyReply) => {
  const { nome, preco, categoria } = request.body as any;
  let conn;

  if (!nome || preco == null || !categoria) {
    return reply.status(400).send({ mensagem: "Campos obrigatórios: nome, preco, categoria" });
  }

  try {
    conn = await criarConexao();

    const [result] = await conn.query(
      `INSERT INTO produtos (nome, preco, categoria_id)
       VALUES (?, ?, (SELECT id FROM categorias WHERE nome = ?))`,
      [nome, preco, categoria]
    );

    reply.status(201).send({ id: (result as any).insertId, nome, preco, categoria });
  } catch (erro: any) {
    tratarErro(erro, reply);
  } finally {
    if (conn) await conn.end();
  }
});


app.put('/produtos/:id', async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as any;
  const { nome, preco, categoria } = request.body as any;
  let conn;

  if (!nome && preco == null && !categoria) {
    return reply.status(400).send({ mensagem: "Informe pelo menos um campo para atualizar" });
  }

  try {
    conn = await criarConexao();

    const campos: string[] = [];
    const valores: any[] = [];

    if (nome) {
      campos.push("nome = ?");
      valores.push(nome);
    }
    if (preco != null) {
      campos.push("preco = ?");
      valores.push(preco);
    }
    if (categoria) {
      campos.push("categoria_id = (SELECT id FROM categorias WHERE nome = ?)");
      valores.push(categoria);
    }

    valores.push(id);
    const sql = UPDATE produtos SET ${campos.join(", ")} WHERE id = ?;
    await conn.query(sql, valores);

    reply.status(200).send({ mensagem: "Produto atualizado com sucesso" });
  } catch (erro: any) {
    tratarErro(erro, reply);
  } finally {
    if (conn) await conn.end();
  }
});


app.delete('/produtos/:id', async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as any;
  let conn;

  try {
    conn = await criarConexao();
    await conn.query("DELETE FROM produtos WHERE id = ?", [id]);
    reply.status(200).send({ mensagem: "Produto removido com sucesso" });
  } catch (erro: any) {
    tratarErro(erro, reply);
  } finally {
    if (conn) await conn.end();
  }
});


app.get('/relatorio', async (request: FastifyRequest, reply: FastifyReply) => {
  let conn;
  try {
    conn = await criarConexao();
    const [rows] = await conn.query(
      `SELECT p.id, p.nome, p.preco, c.nome AS categoria
       FROM produtos p
       INNER JOIN categorias c ON p.categoria_id = c.id`
    );

    reply.status(200).send(rows);
  } catch (erro: any) {
    tratarErro(erro, reply);
  } finally {
    if (conn) await conn.end();
  }
});


function tratarErro(erro: any, reply: FastifyReply) {
  if (erro.code === "ECONNREFUSED") {
    reply.status(500).send({ mensagem: "ERRO: conexão recusada (ligue o banco de dados!)" });
  } else if (erro.code === "ER_BAD_DB_ERROR") {
    reply.status(500).send({ mensagem: "ERRO: banco de dados não encontrado" });
  } else if (erro.code === "ER_ACCESS_DENIED_ERROR") {
    reply.status(500).send({ mensagem: "ERRO: usuário/senha inválidos" });
  } else if (erro.code === "ER_DUP_ENTRY") {
    reply.status(400).send({ mensagem: "ERRO: entrada duplicada (ID já existe)" });
  } else if (erro.code === "ER_NO_SUCH_TABLE") {
    reply.status(500).send({ mensagem: "ERRO: tabela não existe" });
  } else {
    console.error(erro);
    reply.status(500).send({ mensagem: "ERRO desconhecido", detalhe: erro.message });
  }
}


app.listen({ port: 8000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(Servidor rodando em ${address});
});