// src/pages/Categorias.tsx
import { useEffect, useState } from "react";
import { api } from "../api/api";
import type { Categoria } from "../types/Categoria";
import type { AxiosError } from "axios";

// mapa para exibir a finalidade
const finalidadeMap: Record<number, string> = {
  1: "Receita",
  2: "Despesa",
  3: "Ambas",
};

export default function Categorias() {
  const [descricao, setDescricao] = useState("");
  const [finalidade, setFinalidade] = useState<1 | 2 | 3>(2);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"erro" | "sucesso" | "">("");
  const [enviando, setEnviando] = useState(false);

  function isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError !== undefined;
  }

  // carregar categorias
  async function carregarCategorias() {
    try {
      const res = await api.get<Categoria[]>("/Categorias");
      setCategorias(res.data);
    } catch {
      setMensagem("Erro ao carregar categorias");
      setTipoMensagem("erro");
    }
  }

  useEffect(() => {
    carregarCategorias();
  }, []);

  // criar categoria
  async function criarCategoria() {
    setMensagem("");
    setTipoMensagem("");
    setEnviando(true);

    if (!descricao.trim()) {
      setMensagem("Descrição é obrigatória");
      setTipoMensagem("erro");
      setEnviando(false);
      return;
    }

    try {
      await api.post("/Categorias", { descricao, finalidade });
      setMensagem("Categoria criada com sucesso!");
      setTipoMensagem("sucesso");
      setDescricao("");
      setFinalidade(2);
      await carregarCategorias();
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        setMensagem(
          error.response?.status === 400
            ? error.response.data?.toString() || "Erro ao criar categoria"
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

  // deletar categoria
  async function deletarCategoria(id: number) {
    if (!window.confirm("Tem certeza que deseja deletar esta categoria?")) return;

    try {
      await api.delete(`/Categorias/${id}`);
      setMensagem("Categoria deletada com sucesso!");
      setTipoMensagem("sucesso");
      await carregarCategorias();
    } catch {
      setMensagem("Erro ao deletar categoria");
      setTipoMensagem("erro");
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Categorias</h2>

      <div className="bg-white shadow-md rounded p-4 mb-6 space-y-3">
        {mensagem && (
          <div
            className={`p-2 rounded text-white font-semibold ${
              tipoMensagem === "erro" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {mensagem}
          </div>
        )}

        <input
          className="border p-2 rounded w-full"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <select
          className="border p-2 rounded w-full"
          value={finalidade}
          onChange={(e) => setFinalidade(Number(e.target.value) as 1 | 2 | 3)}
        >
          <option value={1}>Receita</option>
          <option value={2}>Despesa</option>
          <option value={3}>Ambas</option>
        </select>

        <button
          className={`w-full px-4 py-2 rounded text-white font-semibold ${
            enviando ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={criarCategoria}
          disabled={enviando}
        >
          {enviando ? "Enviando..." : "Criar Categoria"}
        </button>
      </div>

      {/* lista de categorias no estilo de cards */}
      <div className="space-y-2">
        {categorias.map((c) => (
          <div
            key={c.id}
            className="border rounded p-3 shadow-sm flex justify-between items-center"
          >
            <span className="font-medium">{c.descricao}</span>
            <span className="text-gray-500">{finalidadeMap[c.finalidade]}</span>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
              onClick={() => deletarCategoria(c.id)}
            >
              Deletar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}