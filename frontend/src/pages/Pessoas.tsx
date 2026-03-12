import { useEffect, useState } from "react";
import { api } from "../api/api";
import type { Pessoa } from "../types/Pessoa";

export default function Pessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState(0);

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"erro" | "sucesso" | "">("");
  const [enviando, setEnviando] = useState(false);

  async function criarPessoa() {
    setMensagem("");
    setTipoMensagem("");
    setEnviando(true);

    if (!nome.trim()) {
      setMensagem("Nome é obrigatório");
      setTipoMensagem("erro");
      setEnviando(false);
      return;
    }

    try {
      await api.post("/Pessoas", { nome, idade });

      setMensagem("Pessoa criada com sucesso!");
      setTipoMensagem("sucesso");

      setNome("");
      setIdade(0);

      const res = await api.get<Pessoa[]>("/Pessoas");
      setPessoas(res.data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMensagem("Ocorreu um erro ao criar pessoa");
      setTipoMensagem("erro");
    } finally {
      setEnviando(false);
    }
  }

  async function carregarPessoas() {
    try {
      const res = await api.get<Pessoa[]>("/Pessoas");
      setPessoas(res.data);
    } catch {
      setMensagem("Erro ao carregar pessoas");
      setTipoMensagem("erro");
    }
  }

  useEffect(() => {
    carregarPessoas();
  }, []);

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Pessoas</h2>

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
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          className="border p-2 rounded w-full"
          placeholder="Idade"
          type="number"
          value={idade}
          onChange={(e) => setIdade(Number(e.target.value))}
        />

        <button
          className={`w-full px-4 py-2 rounded text-white font-semibold ${
            enviando ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={criarPessoa}
          disabled={enviando}
        >
          {enviando ? "Enviando..." : "Criar Pessoa"}
        </button>
      </div>

      <div className="space-y-2">
        {pessoas.map((p) => (
          <div
            key={p.id}
            className="border rounded p-3 shadow-sm flex justify-between items-center"
          >
            <span className="font-medium">{p.nome}</span>
            <span className="text-gray-500">{p.idade} anos</span>
          </div>
        ))}
      </div>
    </div>
  );
}