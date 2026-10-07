import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function CardProduto({ produto, onPress, onAdicionar, cores }) {
  const indisponivel = produto.disponivel === 0 || produto.disponivel === false;
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cores.card, borderColor: cores.border, opacity: indisponivel ? 0.6 : 1 }]}
      onPress={() => onPress(produto.id)}
      activeOpacity={0.8}
    >
      {produto.imagemUrl ? (
        <Image source={{ uri: produto.imagemUrl }} style={styles.img} />
      ) : (
        <View style={[styles.img, styles.semImg, { backgroundColor: cores.border }]}><Text style={{ fontSize: 32 }}>🍝</Text></View>
      )}
      <View style={styles.info}>
        <Text style={[styles.nome, { color: cores.text }]} numberOfLines={2}>{produto.nome}</Text>
        {!!produto.categoria && <Text style={{ color: cores.textSecondary, fontSize: 12 }}>{produto.categoria}</Text>}
        <Text style={[styles.preco, { color: cores.primary }]}>R$ {produto.preco.toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        style={[styles.add, { backgroundColor: indisponivel ? cores.border : cores.primary }]}
        onPress={() => onAdicionar(produto)}
        disabled={indisponivel}
      >
        <Text style={{ color: cores.primaryText, fontWeight: '800', fontSize: 18 }}>{indisponivel ? '–' : '+'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, overflow: 'hidden', elevation: 2, paddingRight: 12 },
  img: { width: 90, height: 90 },
  semImg: { alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, padding: 12, gap: 3 },
  nome: { fontSize: 15, fontWeight: '700' },
  preco: { fontSize: 15, fontWeight: '700', marginTop: 4 },
  add: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
});
