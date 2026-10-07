import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';

export function Carregando({ cores, texto = 'Carregando...' }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: cores.background }}>
      <ActivityIndicator size="large" color={cores.primary} />
      <Text style={{ color: cores.textSecondary }}>{texto}</Text>
    </View>
  );
}

export function Erro({ cores, erro, onRetry }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, backgroundColor: cores.background }}>
      <Text style={{ color: cores.error, textAlign: 'center' }}>{erro}</Text>
      <TouchableOpacity onPress={onRetry} style={{ backgroundColor: cores.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}>
        <Text style={{ color: cores.primaryText, fontWeight: '600' }}>Tentar novamente</Text>
      </TouchableOpacity>
    </View>
  );
}
