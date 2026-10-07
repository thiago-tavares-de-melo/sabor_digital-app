import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useTema } from '../context/ThemeContext';
import { useCarrinho } from '../context/CarrinhoContext';
import { criarPedido } from '../services/api';

export default function Carrinho({ navigation }) {
  const { cores } = useTema();
  const { itens, alterarQuantidade, limpar, total } = useCarrinho();
  const [enviando, setEnviando] = useState(false);

  async function finalizar() {
    setEnviando(true);
    try {
      await criarPedido(itens);
      limpar();
      Alert.alert('Pedido enviado!', 'Acompanhe na aba Pedidos.');
      navigation.navigate('Pedidos');
    } catch (e) {
      Alert.alert('Erro ao enviar pedido', e.message);
    } finally {
      setEnviando(false);
    }
  }

  if (itens.length === 0) {
    return (
      <View style={[styles.vazio, { backgroundColor: cores.background }]}>
        <Text style={{ fontSize: 48 }}>🛒</Text>
        <Text style={{ color: cores.textSecondary }}>Seu carrinho esta vazio.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: cores.background }}>
      <FlatList
        data={itens}
        keyExtractor={(i) => String(i.produto.id)}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item }) => (
          <View style={[styles.linha, { backgroundColor: cores.card, borderColor: cores.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: cores.text, fontWeight: '700' }}>{item.produto.nome}</Text>
              <Text style={{ color: cores.primary, fontWeight: '600' }}>R$ {(item.produto.preco * item.quantidade).toFixed(2)}</Text>
            </View>
            <TouchableOpacity onPress={() => alterarQuantidade(item.produto.id, -1)} style={[styles.qtd, { borderColor: cores.border }]}>
              <Text style={{ color: cores.text, fontSize: 18 }}>−</Text>
            </TouchableOpacity>
            <Text style={{ color: cores.text, fontWeight: '700', minWidth: 20, textAlign: 'center' }}>{item.quantidade}</Text>
            <TouchableOpacity onPress={() => alterarQuantidade(item.produto.id, 1)} style={[styles.qtd, { borderColor: cores.border }]}>
              <Text style={{ color: cores.text, fontSize: 18 }}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={[styles.rodape, { backgroundColor: cores.card, borderColor: cores.border }]}>
        <Text style={{ color: cores.text, fontSize: 18, fontWeight: '800' }}>Total: R$ {total.toFixed(2)}</Text>
        <TouchableOpacity
          onPress={finalizar}
          disabled={enviando}
          style={{ backgroundColor: enviando ? cores.border : cores.primary, paddingVertical: 14, borderRadius: 10, alignItems: 'center' }}
        >
          <Text style={{ color: cores.primaryText, fontWeight: '700' }}>{enviando ? 'Enviando...' : 'Finalizar pedido'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  vazio: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, borderWidth: 1 },
  qtd: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  rodape: { padding: 16, gap: 12, borderTopWidth: 1 },
});
