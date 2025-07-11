







Banco de dados
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
