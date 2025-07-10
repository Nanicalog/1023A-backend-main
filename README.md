Create DATABASE loja;
USE loja;

-- Cria a tabela de categorias
CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL
);

-- Insere as categorias
INSERT INTO categorias (nome) VALUES
('Perfume'),
('Body Splash');

-- Cria a tabela de produtos com chave estrangeira para categoria
CREATE TABLE produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  categoria_id INT NOT NULL,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Insere os produtos usando o id correto das categorias
-- Supondo que 'Perfume' tem id 1 e 'Body Splash' tem id 2
INSERT INTO produtos (nome, preco, categoria_id) VALUES
('Sweet Tooth', 400.50, 1),
('Ultra Male', 300.00, 1),
('Mon Paris', 800.00, 2),
('Thank U Next', 300.00, 2),
('Miss Dior', 800.00, 1),
('Scandal', 400.00, 2),
('La Beau', 400.00, 1),
('Sauvage', 400.00, 1),
('Toilette', 400.00, 2);







-- Consulta com INNER JOIN para exibir nome da categoria
SELECT 
  p.id,
  p.nome,
  p.preco,
  c.nome AS categoria
FROM produtos p
INNER JOIN categorias c ON p.categoria_id = c.id;
