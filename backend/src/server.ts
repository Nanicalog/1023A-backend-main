// Importa o Fastify e o plugin de CORS
import Fastify from 'fastify';
import cors from '@fastify/cors';

// Importa as rotas de produtos
import ProdutosRoutes from './routes/ProdutosRoutes';

// Cria o servidor Fastify
const app = Fastify();

// Configura o CORS para permitir requisições de qualquer origem
app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE',],
});

// Registra as rotas de produtos com o prefixo /Produtos
app.register(ProdutosRoutes, { prefix: '/Produtos' });

// Função para iniciar o servidor
const start = async () => {
    try {
        // Inicia o servidor na porta 3000
        await app.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Servidor rodando em http://localhost:3000');
    } catch (err) {
        // Em caso de erro, mostra no console e encerra
        app.log.error(err);
        process.exit(1);
        
    }
};

// Chama a função para iniciar o servidor
start();







