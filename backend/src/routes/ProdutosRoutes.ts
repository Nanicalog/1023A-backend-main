import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../models/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface Produto {
    id?: number;
    nome: string;
    preco: number;
    categoria_id?: number | null;
}

interface ProdutoCadastroBody {
    nome: string;
    preco: number;
    categoria: string; // Ex: "Feminino" ou "Masculino"
}

// Interface para o produto como ele é no banco de dados

export default async function produtosRoutes(fastify: FastifyInstance) {
    // Cadastrar produto
    fastify.post('/', async (request: FastifyRequest<{ Body: ProdutoCadastroBody }>, reply: FastifyReply) => {

        // 1. Pega os dados que o formulário React envia
        const { nome, preco, categoria } = request.body;

        // 2. Valida os dados recebidos
        if (!nome || preco == null || !categoria) {
            return reply.status(400).send({ erro: 'Campos obrigatórios: nome, preco e categoria' });
        }

        // 3. Converte o NOME da categoria para o ID do banco
        //    (Importante: "Feminino" no frontend, "Femino" no banco)
        let categoria_id: number | null = null;
        if (categoria.toLowerCase() === 'feminino') {
            categoria_id = 1; // ID de 'Femino' no seu banco
        } else if (categoria.toLowerCase() === 'masculino') {
            categoria_id = 2; // ID de 'Masculino' no seu banco
        }

        if (categoria_id === null) {
            return reply.status(400).send({ erro: `Categoria inválida: ${categoria}` });
        }

        const connection = await db.getConnection();
        try {
            // 4. Monta a query SQL SEM a coluna 'estoque'
            const [result] = await connection.query<ResultSetHeader>(
                `INSERT INTO produtos (nome, preco, categoria_id) VALUES (?, ?, ?)`,
                [nome, preco, categoria_id]
            );

            // Busca o produto recém-criado para retornar ao frontend
            const [rows] = await connection.query<RowDataPacket[]>(
                'SELECT * FROM produtos WHERE id = ?',
                [result.insertId]
            );

            return reply.status(201).send(rows[0]);

        } catch (err) {
            // Loga o erro real no console do servidor para depuração
            console.error('Erro ao cadastrar produto:', err);
            return reply.status(500).send({ erro: 'Erro interno do servidor ao cadastrar produto.' + err });
        } finally {
            connection.release();
        }
    });

    // Listar produtos com filtros
    fastify.get('/', async (request: FastifyRequest<{ Querystring: { categoria_id?: string; nome?: string } }>, reply: FastifyReply) => {
        const { categoria_id, nome } = request.query;
        let sql = 'SELECT * FROM produtos WHERE 1=1';
        const params: any[] = [];

        if (categoria_id) {
            sql += ' AND categoria_id = ?';
            params.push(categoria_id);
        }

        if (nome) {
            sql += ' AND nome LIKE ?';
            params.push(`%${nome}%`);
        }

        const connection = await db.getConnection();
        try {
            const [rows] = await connection.query<RowDataPacket[]>(sql, params);
            return reply.send(rows);
        } catch (err) {
            console.log(err);
            return reply.status(500).send({ erro: 'Erro ao buscar produtos' });
        } finally {
            connection.release();
        }
    });

    // Buscar produto por ID
    fastify.get('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        const id = Number(request.params.id);
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.query<RowDataPacket[]>(
                'SELECT * FROM produtos WHERE id = ?',
                [id]
            );
            if (rows.length === 0) {
                return reply.status(404).send({ erro: 'Produto não encontrado' });
            }
            return reply.send(rows[0]);
        } catch (err) {
            console.log(err);
            return reply.status(500).send({ erro: 'Erro ao buscar produto' });
        } finally {
            connection.release();
        }
    });

    // Atualizar produto
    fastify.put('/:id', async (request: FastifyRequest<{ Params: { id: string }, Body: Produto }>, reply: FastifyReply) => {
        const id = Number(request.params.id);
        const { nome, preco, categoria_id } = request.body;

        if (!nome || preco == null) {
            return reply.status(400).send({ erro: 'Campos obrigatórios: nome, preco, ' });
        }

        const connection = await db.getConnection();
        try {
            const [result] = await connection.query<ResultSetHeader>(
                `UPDATE produtos SET nome = ?, preco = ?, categoria_id = ? WHERE id = ?`,
                [nome, preco, , categoria_id || null, id]
            );

            if (result.affectedRows === 0) {
                return reply.status(404).send({ erro: 'Produto não encontrado' });
            }

            const [rows] = await connection.query<RowDataPacket[]>(
                'SELECT * FROM produtos WHERE id = ?',
                [id]
            );

            return reply.send(rows[0]);
        } catch (err) {
            console.log(err);
            return reply.status(500).send({ erro: 'Erro ao atualizar produto' });
        } finally {
            connection.release();
        }
    });

    // Deletar produto
    fastify.delete('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        const id = Number(request.params.id);
        const connection = await db.getConnection();
        try {
            const [result] = await connection.query<ResultSetHeader>(
                'DELETE FROM produtos WHERE id = ?',
                [id]
            );
            if (result.affectedRows === 0) {
                return reply.status(404).send({ erro: 'Produto não encontrado' });
            }
            return reply.status(204).send();
        } catch (err) {
            console.log(err);
            return reply.status(500).send({ erro: 'Erro ao deletar produto' });
        } finally {
            connection.release();
        }
    });
}
