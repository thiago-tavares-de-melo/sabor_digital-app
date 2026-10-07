import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTema } from '../context/ThemeContext';
import { useCarrinho } from '../context/CarrinhoContext';
import { buscarProdutoPorId } from '../services/api';
import { Carregando, Erro } from '../components/Estados';

export default function DetalheProduto({ route }) {
  const { produtoId } = route.params;
  const { cores } = useTema();
  const { adicionar } = useCarrinho();
  const [produto, setProduto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [adicionado, setAdicionado] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setProduto(await buscarProdutoPorId(produtoId));
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [produtoId]);

  useEffect(() => { carregar(); }, [carregar]);

  if (carregando) return <Carregando cores={cores} />;
  if (erro) return <Erro cores={cores} erro={erro} onRetry={carregar} />;
  if (!produto) return null;

  const indisponivel = produto.disponivel === 0 || produto.disponivel === false;

  return (
    <ScrollView style={{ backgroundColor: cores.background }} contentContainerStyle={{ paddingBottom: 40 }}>
      {produto.imagemUrl ? (
        <Image source={{ uri: produto.imagemUrl }} style={styles.img} />
      ) : (
        <View style={[styles.img, { backgroundColor: cores.border, alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={{ fontSize: 64 }}>🍝</Text>
        </View>
      )}
      <View style={{ padding: 20, gap: 8 }}>
        <Text style={[styles.nome, { color: cores.text }]}>{produto.nome}</Text>
        {!!produto.categoria && <Text style={{ color: cores.textSecondary }}>{produto.categoria}</Text>}
        <Text style={[styles.preco, { color: cores.primary }]}>R$ {produto.preco.toFixed(2)}</Text>
        {!!produto.descricao && <Text style={{ color: cores.textSecondary, lineHeight: 22 }}>{produto.descricao}</Text>}
        <TouchableOpacity
          style={[styles.botao, { backgroundColor: indisponivel ? cores.border : cores.primary }]}
          disabled={indisponivel}
          onPress={() => { adicionar(produto); setAdicionado(true); }}
        >
          <Text style={{ color: cores.primaryText, fontWeight: '700', fontSize: 15 }}>
            {indisponivel ? 'Indisponivel' : 'Adicionar ao carrinho'}
          </Text>
        </TouchableOpacity>
        {adicionado && <Text style={{ color: cores.success, textAlign: 'center', fontWeight: '600' }}>Adicionado ao carrinho!</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  img: { width: '100%', height: 280 },
  nome: { fontSize: 22, fontWeight: '800' },
  preco: { fontSize: 20, fontWeight: '700' },
  botao: { marginTop: 20, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
});
