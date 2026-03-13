import { useEffect, useState } from "react";
import { api } from "../api/api";
import type { Pessoa } from "../types/Pessoa";
import type { Categoria } from "../types/Categoria";
import type { AxiosError } from "axios";

export default function Transacoes() {
  // campos do formulário
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState(0);
  const [tipo, setTipo] = useState<1 | 2>(1);

  // dados para selects
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [pessoaId, setPessoaId] = useState(0);
  const [categoriaId, setCategoriaId] = useState(0);

  // estado de mensagens e envio
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"erro" | "sucesso" | "">("");
  const [enviando, setEnviando] = useState(false);

  // checagem de erro axios
  function isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError !== undefined;
  }

  // filtra categorias de acordo com o tipo da transação
  const categoriasFiltradas = categorias.filter((c) => {
    if (tipo === 1) return c.finalidade === 1 || c.finalidade === 3;
    if (tipo === 2) return c.finalidade === 2 || c.finalidade === 3;
    return true;
  });

  // criar nova transação
  async function criar() {
    setMensagem("");
    setTipoMensagem("");
    setEnviando(true);

    if (!descricao.trim()) {
      setMensagem("Descrição é obrigatória");
      setTipoMensagem("erro");
      setEnviando(false);
      return;
    }

    if (valor <= 0) {
      setMensagem("Valor deve ser positivo");
      setTipoMensagem("erro");
      setEnviando(false);
      return;
    }

    const pessoaSelecionada = pessoas.find((p) => p.id === pessoaId);
    if (!pessoaSelecionada) {
      setMensagem("Selecione uma pessoa válida");
      setTipoMensagem("erro");
      setEnviando(false);
      return;
    }

    if (tipo === 1 && pessoaSelecionada.idade < 18) {
      setMensagem("Menores de idade só podem registrar despesas");
      setTipoMensagem("erro");
      setEnviando(false);
      return;
    }

    if (!categoriaId) {
      setMensagem("Selecione uma categoria");
      setTipoMensagem("erro");
      setEnviando(false);
      return;
    }

    try {
      await api.post("/Transacoes", {
        descricao,
        valor,
        tipo,
        pessoaId,
        categoriaId,
      });

      setMensagem("Transação criada com sucesso!");
      setTipoMensagem("sucesso");

      // reset campos
      setDescricao("");
      setValor(0);
      setTipo(1);
      setPessoaId(0);
      setCategoriaId(0);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        setMensagem(
          error.response?.status === 400
            ? error.response.data?.toString() || "Erro ao criar transação"
            : "Ocorreu um erro inesperado"
        );
      } else {
        setMensagem("Ocorreu um erro inesperado");
      }
      setTipoMensagem("erro");
    } finally {
      setEnviando(false);
    }
  }

  // carregar pessoas e categorias
  useEffect(() => {
    async function carregarDados() {
      try {
        const p = await api.get<Pessoa[]>("/Pessoas");
        const c = await api.get<Categoria[]>("/Categorias");
        setPessoas(p.data);
        setCategorias(c.data);
      } catch {
        setMensagem("Erro ao carregar pessoas ou categorias");
        setTipoMensagem("erro");
      }
    }
    carregarDados();
  }, []);

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Transações</h2>

      <div className="bg-white shadow-md rounded p-4 space-y-3">
        {/* mensagem de status */}
        {mensagem && (
          <div
            className={`p-2 rounded text-white font-semibold ${
              tipoMensagem === "erro" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {mensagem}
          </div>
        )}

        {/* formulário */}
        <input
          className="border p-2 rounded w-full"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full"
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(Number(e.target.value))}
        />
        <select
          className="border p-2 rounded w-full"
          value={tipo}
          onChange={(e) => {
            setTipo(Number(e.target.value) as 1 | 2);
            setCategoriaId(0); // reset categoria ao mudar tipo
          }}
        >
          <option value={1}>Receita</option>
          <option value={2}>Despesa</option>
        </select>
        <select
          className="border p-2 rounded w-full"
          value={pessoaId}
          onChange={(e) => setPessoaId(Number(e.target.value))}
        >
          <option value={0}>Selecione Pessoa</option>
          {pessoas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome} ({p.idade} anos)
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded w-full"
          value={categoriaId}
          onChange={(e) => setCategoriaId(Number(e.target.value))}
        >
          <option value={0}>Selecione Categoria</option>
          {categoriasFiltradas.map((c) => (
            <option key={c.id} value={c.id}>
              {c.descricao} ({c.finalidade === 1 ? "Receita" : c.finalidade === 2 ? "Despesa" : "Ambas"})
            </option>
          ))}
        </select>

        <button
          className={`w-full px-4 py-2 rounded text-white font-semibold ${
            enviando ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={criar}
          disabled={enviando}
        >
          {enviando ? "Enviando..." : "Criar Transação"}
        </button>
      </div>
    </div>
  );
}