🤍ྀིPluméria🎀༘⋆
Pluméria é um sistema de gerenciamento de vendas de perfumes.

ꕤ Funcionalidades Implementadas
Foi utilizado React no frontend, e a navegação entre as páginas é feita com a biblioteca react-router-dom.

Navegação entre páginas com React Router DOM.


Header.tsx: cabeçalho com navegação.
Principal.tsx: página para visualização dos produtos.

Backend em Fastify (index.ts)
API RESTful com endpoints para consulta. Conexão com MySQL para armazenamento dos dados. Tratamento de erros detalhados para auxiliar no desenvolvimento.

🎀 Como Executar o Projeto

BACKEND
# Instalar dependências
npm install fastify @fastify/cors mysql2

# Se estiver usando TypeScript
npm install -D typescript tsx @types/node
#npm run dev

FRONTEND
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev

Conexão Banco de dados

createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'loja'
});

Código Banco de dados
Create DATABASE loja;
USE loja;

-- Cria a tabela de categorias
CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL
);

-- Insere as categorias
INSERT INTO categorias (nome) VALUES
('Femino'),
('Masculino');

-- Cria a tabela de produtos com chave estrangeira para categoria
CREATE TABLE produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  categoria_id INT NOT NULL,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Insere os produtos usando o id correto das categorias
-- Supondo que 'Femino' tem id 1 e 'Masculino' tem id 2
INSERT INTO produtos (nome, preco, categoria_id) VALUES
('Sweet Tooth', 400.50, 1),
('Ultra Male', 300.00, 2),
('Mon Paris', 800.00, 1),
('Thank U Next', 300.00, 1),
('Miss Dior', 800.00, 1),
('Scandal', 400.00, 2),
('La Beau', 800.00, 2),
('Sauvage', 400.00, 2),
('Toilette', 400.00, 2);

-- Consulta com INNER JOIN para exibir nome da categoria
SELECT 
  p.id,
  p.nome,
  p.preco,
  c.nome AS categoria
FROM produtos p
INNER JOIN categorias c ON p.categoria_id = c.id;



