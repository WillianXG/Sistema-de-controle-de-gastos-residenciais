import { useEffect, useState } from "react";
import { api } from "../api/api";
import type { Categoria } from "../types/Categoria";
import type { AxiosError } from "axios";

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

      carregarCategorias(); 
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        if (error.response?.status === 400) {
          setMensagem(error.response.data?.toString() || "Erro ao criar categoria");
          setTipoMensagem("erro");
        } else {
          setMensagem("Ocorreu um erro inesperado");
          setTipoMensagem("erro");
        }
      } else {
        setMensagem("Ocorreu um erro inesperado");
        setTipoMensagem("erro");
      }
    } finally {
      setEnviando(false);
    }
  }

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

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Categorias</h2>

      <div className="bg-white shadow-md rounded p-4 space-y-3">
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

        <h3 className="text-lg font-semibold mt-4">Lista de Categorias</h3>
        <ul className="border rounded p-2 max-h-64 overflow-y-auto space-y-1">
          {categorias.map((c) => (
            <li key={c.id} className="p-2 border-b last:border-b-0 flex justify-between">
              <span>{c.descricao}</span>
              <span className="text-sm text-gray-600">{finalidadeMap[c.finalidade]}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}