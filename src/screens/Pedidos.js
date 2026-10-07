import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTema } from '../context/ThemeContext';
import { listarPedidos, atualizarStatusPedido, excluirPedido, STATUS } from '../services/api';
import { Carregando, Erro } from '../components/Estados';

export default function Pedidos() {
  const { cores } = useTema();
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setPedidos(await listarPedidos());
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));

  async function avancar(p) {
    const prox = STATUS[STATUS.indexOf(p.status) + 1];
    if (!prox) return;
    try {
      await atualizarStatusPedido(p.id, prox);
      setPedidos((l) => l.map((x) => (x.id === p.id ? { ...x, status: prox } : x)));
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  }

  function excluir(p) {
    Alert.alert('Excluir pedido', `Excluir o pedido #${p.id}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await excluirPedido(p.id);
            setPedidos((l) => l.filter((x) => x.id !== p.id));
          } catch (e) {
            Alert.alert('Erro', e.message);
          }
        },
      },
    ]);
  }

  if (carregando && pedidos.length === 0) return <Carregando cores={cores} texto="Carregando pedidos..." />;
  if (erro) return <Erro cores={cores} erro={erro} onRetry={carregar} />;

  return (
    <FlatList
      style={{ backgroundColor: cores.background }}
      data={pedidos}
      keyExtractor={(p) => String(p.id)}
      refreshing={carregando}
      onRefresh={carregar}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      ListEmptyComponent={<Text style={{ color: cores.textSecondary, textAlign: 'center', marginTop: 48 }}>Nenhum pedido ainda.</Text>}
      renderItem={({ item: p }) => {
        const prox = STATUS[STATUS.indexOf(p.status) + 1];
        return (
          <View style={[styles.card, { backgroundColor: cores.card, borderColor: cores.border }]}>
            <View style={styles.topo}>
              <Text style={{ color: cores.text, fontWeight: '800', fontSize: 16 }}>Pedido #{p.id}</Text>
              <Text style={{ color: cores.primary, fontWeight: '700', textTransform: 'capitalize' }}>{p.status}</Text>
            </View>
            {p.total != null && <Text style={{ color: cores.textSecondary }}>Total: R$ {Number(p.total).toFixed(2)}</Text>}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {prox && (
                <TouchableOpacity onPress={() => avancar(p)} style={[styles.btn, { backgroundColor: cores.primary }]}>
                  <Text style={{ color: cores.primaryText, fontWeight: '600' }}>Marcar: {prox}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => excluir(p)} style={[styles.btn, { borderWidth: 1.5, borderColor: cores.error }]}>
                <Text style={{ color: cores.error, fontWeight: '600' }}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, borderWidth: 1, padding: 14, gap: 8 },
  topo: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
});
