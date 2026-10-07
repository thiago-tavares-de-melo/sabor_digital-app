import React, { createContext, useContext, useState } from 'react';

const CarrinhoContext = createContext(null);

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([]);

  function adicionar(produto) {
    setItens((atual) => {
      const existe = atual.find((i) => i.produto.id === produto.id);
      if (existe) return atual.map((i) => (i.produto.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i));
      return [...atual, { produto, quantidade: 1 }];
    });
  }

  function alterarQuantidade(id, delta) {
    setItens((atual) =>
      atual
        .map((i) => (i.produto.id === id ? { ...i, quantidade: i.quantidade + delta } : i))
        .filter((i) => i.quantidade > 0)
    );
  }

  const limpar = () => setItens([]);
  const total = itens.reduce((s, i) => s + i.produto.preco * i.quantidade, 0);
  const quantidadeTotal = itens.reduce((s, i) => s + i.quantidade, 0);

  return (
    <CarrinhoContext.Provider value={{ itens, adicionar, alterarQuantidade, limpar, total, quantidadeTotal }}>
      {children}
    </CarrinhoContext.Provider>
  );
}

export const useCarrinho = () => useContext(CarrinhoContext);
