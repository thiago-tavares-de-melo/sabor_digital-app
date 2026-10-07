import { Platform } from 'react-native';

// Emulador Android: 10.0.2.2 = localhost da maquina. Celular fisico: troque pelo IP do PC (ex: http://192.168.0.10:3000).
export const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export const STATUS = ['pendente', 'preparo', 'pronto', 'entregue'];

async function req(path, options = {}) {
  let res;
  try {
    res = await fetch(BASE_URL + path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('Nao foi possivel conectar a API. Ela esta rodando?');
  }
  let body = null;
  try { body = await res.json(); } catch {}
  if (!res.ok) throw new Error(body?.erro || body?.error || body?.message || `Erro ${res.status}`);
  return body;
}

// A API pode devolver um array direto ou embrulhado em { data } / { produtos } etc.
const lista = (r, chave) => (Array.isArray(r) ? r : r?.[chave] ?? r?.data ?? []);

function imagemUrl(img) {
  if (!img) return null;
  if (/^https?:/.test(img)) return img;
  if (img.startsWith('/')) return BASE_URL + img;
  return `${BASE_URL}/public/uploads/produtos/${img}`;
}

function normalizarProduto(p) {
  return { ...p, preco: Number(p.preco) || 0, imagemUrl: imagemUrl(p.imagem) };
}

export async function buscarProdutos() {
  return lista(await req('/produtos'), 'produtos').map(normalizarProduto);
}

export async function buscarProdutoPorId(id) {
  const r = await req(`/produtos/${id}`);
  return normalizarProduto(r?.produto ?? r?.data ?? r);
}

export async function listarCardapios() {
  return lista(await req('/cardapios'), 'cardapios');
}

export async function listarPedidos() {
  return lista(await req('/pedidos'), 'pedidos');
}

// ATENCAO: o formato do corpo do POST /pedidos nao esta no README.
// Confira no Swagger (http://localhost:3000/api-docs) e ajuste aqui se necessario.
export async function criarPedido(itens) {
  return req('/pedidos', {
    method: 'POST',
    body: JSON.stringify({
      itens: itens.map((i) => ({
        produto_id: i.produto.id,
        quantidade: i.quantidade,
        preco_unitario: i.produto.preco,
      })),
    }),
  });
}

export async function atualizarStatusPedido(id, status) {
  return req(`/pedidos/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
}

export async function excluirPedido(id) {
  return req(`/pedidos/${id}`, { method: 'DELETE' });
}
