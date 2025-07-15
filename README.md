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

RELATÓRIO
Banco de dados


O relacionamento entre categoria e produtos é do tipo 1:N (um para muitos).

Isso significa que uma categoria pode estar associada a vários produtos, mas cada produto pertence a apenas uma categoria.

Essa ligação é feita por meio da chave estrangeira categoria_id, presente na tabela produtos, que se conecta à chave primária id da tabela

Código sql:

CREATE DATABASE loja;
USE loja;

--  tabela de categorias primeiro
CREATE TABLE categoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL
);

-- tabela de produtos com chave estrangeira para categoria
CREATE TABLE produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  categoria_id INT NOT NULL,
  FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);

-- Insere as categorias feminino e masculino
INSERT INTO categoria (nome) VALUES
('Feminino'),
('Masculino');

-- Insere os produtos usando o id  das categorias
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
INNER JOIN categoria c ON p.categoria_id = c.id;





Comandos sql utilizados no banco de dados 
SELECT 
  p.id,
  p.nome,
  p.preco,
  c.nome AS categoria
FROM produtos p
INNER JOIN categoria c ON p.categoria_id = c.id;

Essa consulta SQL tem como objetivo listar os produtos cadastrados no banco de dados junto com o nome da categoria a que cada um pertence.
SELECT: define quais colunas serão exibidas no resultado.

p.id, p.nome, p.preco: são os campos da tabela produtos (apelidada de p) que trazem o ID, nome e preço do produto.

c.nome AS categoria: exibe o nome da categoria (vindo da tabela categoria, apelidada como c) e o renomeia como categoria no resultado final para tornar mais claro.

A junção entre as tabelas é feita com:

INNER JOIN categoria c ON p.categoria_id = c.id



SQL no backend

app.get('/relatorio')

Utilizado para exibir os dados no navegador, por exemplo localhost:3001/relatorio.



INSERT INTO produtos (nome, preco, categoria_id)
VALUES (?, ?, (SELECT id FROM categorias WHERE nome = ?));


Esse comando é usado para atualizar os dados de um produto com base no  ID.
O backend monta esse SQL de forma dinâmica, permitindo que sejam atualizados apenas os campos enviados na requisição (nome, preço e/ou categoria).
Caso o campo categoria seja alterado, ele também é tratado por uma subconsulta:

Dentro da rota /produtos, o backend também permite realizar uma busca filtrada por nome de categoria. Isso é feito com o seguinte trecho:

if (categoria) {
  sql += " WHERE c.nome = ?";
  params.push(categoria);
}

Se o parâmetro categoria for informado na URL (como em localhost:3001/produtos?

categoria Feminino), o SQL é modificado para trazer apenas os produtos daquela categoria. Esse filtro torna a aplicação mais dinâmica e funcional.




