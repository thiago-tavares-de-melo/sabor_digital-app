import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTema } from '../context/ThemeContext';
import { useCarrinho } from '../context/CarrinhoContext';
import { buscarProdutos } from '../services/api';
import CardProduto from '../components/CardProduto';
import { Carregando, Erro } from '../components/Estados';

export default function ListaProdutos({ navigation }) {
  const { cores } = useTema();
  const { adicionar } = useCarrinho();
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [categoria, setCategoria] = useState('Todos');

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setProdutos(await buscarProdutos());
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  if (carregando) return <Carregando cores={cores} texto="Carregando cardapio..." />;
  if (erro) return <Erro cores={cores} erro={erro} onRetry={carregar} />;

  const categorias = ['Todos', ...new Set(produtos.map((p) => p.categoria).filter(Boolean))];
  const filtrados = categoria === 'Todos' ? produtos : produtos.filter((p) => p.categoria === categoria);

  return (
    <View style={{ flex: 1, backgroundColor: cores.background }}>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {categorias.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setCategoria(c)}
              style={[styles.chip, { backgroundColor: c === categoria ? cores.primary : cores.card, borderColor: cores.border }]}
            >
              <Text style={{ color: c === categoria ? cores.primaryText : cores.text, fontWeight: '600' }}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={filtrados}
        keyExtractor={(i) => String(i.id)}
        refreshing={carregando}
        onRefresh={carregar}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <CardProduto
            produto={item}
            cores={cores}
            onAdicionar={adicionar}
            onPress={(id) => navigation.navigate('DetalheProduto', { produtoId: id })}
          />
        )}
        ListEmptyComponent={<Text style={{ color: cores.textSecondary, textAlign: 'center', marginTop: 48 }}>Nenhum produto encontrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chips: { padding: 12, gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  lista: { padding: 16, paddingTop: 4, gap: 12 },
});
