import { useState } from 'react';

export default function FormularioCadastro() {
  // estados para cada campo
  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('');

  async function trataForm(e: React.FormEvent) {
    e.preventDefault();

    const objProdutos = {
      id,
      nome,
      preco,
      categoria,
    };

    try {
      const resposta = await fetch("http://localhost:8000/Produtos", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(objProdutos),
      });

      if (resposta.status === 200) {
        alert("Produto cadastrado com sucesso!");
      } else if (resposta.status === 400) {
        const dados = await resposta.json();
        alert(`Erro do lado do backend:\n${dados.mensagem}`);
      } else if (resposta.status === 404) {
        alert("Erro não identificado. :(");
      } else {
        alert(`Erro inesperado: status ${resposta.status}`);
      }
    } catch (erro) {
      alert("Erro na requisição FETCH.\nVocê ligou o backend com npm run dev?");
    }
  }

  return (
    <form onSubmit={trataForm}>
      <label htmlFor="id">Id</label>
      <input
        type="text"
        id="id"
        name="id"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      <label htmlFor="nome">Nome</label>
      <input
        type="text"
        id="nome"
        name="nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <label htmlFor="preco">Preço</label>
      <input
        type="text"
        id="preco"
        name="preco"
        value={preco}
        onChange={(e) => setPreco(e.target.value)}
      />

      <label htmlFor="categoria">Categoria</label>
      <input
        type="text"
        id="categoria"
        name="categoria"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
      />

      <input type="submit" value="Cadastrar" />
    </form>
  );
}
