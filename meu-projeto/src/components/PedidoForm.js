import React, { useState } from 'react';
import { saveAs } from 'file-saver';

const PedidoForm = () => {
  const [contadorPedido, setContadorPedido] = useState(1);
  const [pedido, setPedido] = useState({
    numeroPedido: contadorPedido,
    produtos: [],
    valorTotalPedido: 0
  });
  const [totalUnidades, setTotalUnidades] = useState(0);
  const [pedidosSalvos, setPedidosSalvos] = useState([]);

  const produtosPreDefinidos = [
    { id: 1, nome: 'Camisa', preco: 100 },
    { id: 2, nome: 'Calça', preco: 200 },
    { id: 3, nome: 'Jaqueta', preco: 300 }
  ];

  const handleProdutoChange = (e, produtoId) => {
    let quantidade = parseInt(e.target.value);
    if (quantidade < 0) quantidade = 0;
    if (quantidade > 3) quantidade = 3;

    const produtoSelecionado = pedido.produtos.find(p => p.id === produtoId);
    if (produtoSelecionado) {
      const totalAtualizado = totalUnidades - produtoSelecionado.quantidade + quantidade;
      if (totalAtualizado > 3) {
        alert('A soma das quantidades de produtos não pode ultrapassar 3 unidades.');
        return;
      }
      setTotalUnidades(totalAtualizado);
      produtoSelecionado.quantidade = quantidade;
    } else {
      const produto = produtosPreDefinidos.find(p => p.id === produtoId);
      produto.quantidade = quantidade;
      const totalAtualizado = totalUnidades + quantidade;
      if (totalAtualizado > 3) {
        alert('A soma das quantidades de produtos não pode ultrapassar 3 unidades.');
        return;
      }
      setTotalUnidades(totalAtualizado);
      setPedido(prevPedido => ({ ...prevPedido, produtos: [...prevPedido.produtos, produto] }));
    }

    const valorTotalPedido = pedido.produtos.reduce((total, p) => total + (p.preco * p.quantidade), 0);
    setPedido(prevPedido => ({ ...prevPedido, valorTotalPedido }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (pedido.produtos.length === 0) {
      alert('Adicione pelo menos um produto antes de criar o pedido.');
      return;
    }

    if (totalUnidades > 3) {
      alert('A soma das quantidades de produtos não pode ultrapassar 3 unidades.');
      return;
    }

    sessionStorage.setItem(`pedido_${pedido.numeroPedido}`, JSON.stringify(pedido));
    
    setPedidosSalvos(prevPedidos => [...prevPedidos, pedido]);

    setPedido({
      numeroPedido: contadorPedido + 1,
      produtos: [],
      valorTotalPedido: 0
    });
    setContadorPedido(contadorPedido + 1);
    setTotalUnidades(0);
  };

  const exportToCSV = () => {
    const csvData = pedidosSalvos.map(pedido => `${pedido.numeroPedido},${pedido.valorTotalPedido}`).join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'pedidos.csv');
  };

  return (
    <div className="container">
      <h2>Criar Pedido</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="numeroPedido">Número do Pedido:</label>
          <input id="numeroPedido" type="text" value={pedido.numeroPedido} readOnly />
        </div>
        <div className="form-group">
          <label>Produtos:</label>
          {produtosPreDefinidos.map(produto => (
            <div key={produto.id} className="produto">
              <input
                type="number"
                value={pedido.produtos.find(p => p.id === produto.id)?.quantidade || 0}
                onChange={(e) => handleProdutoChange(e, produto.id)}
                min={0}
                max={3}
              />
              <span>{produto.nome} - R$ {produto.preco}</span>
            </div>
          ))}
        </div>
        <div className="form-group">
          <label>Valor Total do Pedido:</label>
          <input type="number" value={pedido.valorTotalPedido} readOnly />
        </div>
        <button type="submit" disabled={totalUnidades === 0}>Criar Pedido</button>
      </form>
      <h2>Pedidos Salvos</h2>
      <ul>
        {pedidosSalvos.map((pedido, index) => (
          <li key={index}>
            Número do Pedido: {pedido.numeroPedido}, Valor Total: R$ {pedido.valorTotalPedido}
          </li>
        ))}
      </ul>
      <div className="form-group">
        <button onClick={exportToCSV} disabled={pedidosSalvos.length === 0}>
          Exportar para CSV
        </button>
      </div>
    </div>
  );
};

export default PedidoForm;
