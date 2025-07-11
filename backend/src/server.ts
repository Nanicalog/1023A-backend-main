import Fastify from 'fastify';
import cors from '@fastify/cors';
import ProdutosRoutes from './routes/ProdutosRoutes';
const app = Fastify();

app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

// Registrar rotas
app.register(ProdutosRoutes, { prefix: '/Produtos' });

// Iniciar servidor
const start = async () => {
    try {
        await app.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Servidor rodando em http://localhost:3000');
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
