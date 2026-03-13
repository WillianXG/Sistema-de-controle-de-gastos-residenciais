// src/pages/Home.tsx
import { useEffect, useState } from "react";
import { api } from "../api/api";
import type { Pessoa } from "../types/Pessoa";
import type { Categoria } from "../types/Categoria";
import type { Transacao } from "../types/Transacao";

export default function Home() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    async function carregarDados() {
      try {
        const [pRes, cRes, tRes] = await Promise.all([
          api.get<Pessoa[]>("/Pessoas"),
          api.get<Categoria[]>("/Categorias"),
          api.get<Transacao[]>("/Transacoes"),
        ]);
        setPessoas(pRes.data);
        setCategorias(cRes.data);
        setTransacoes(tRes.data);
      } catch {
        setMensagem("Erro ao carregar dados");
      }
    }

    carregarDados();
  }, []);

  const totalReceitas = transacoes
    .filter((t) => t.tipo === 1)
    .reduce((sum, t) => sum + t.valor, 0);

  const totalDespesas = transacoes
    .filter((t) => t.tipo === 2)
    .reduce((sum, t) => sum + t.valor, 0);

  const saldo = totalReceitas - totalDespesas;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard - Sistema de Gastos</h1>

      {mensagem && (
        <div className="p-2 bg-red-500 text-white font-semibold rounded">
          {mensagem}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow-md rounded p-4 flex flex-col justify-between">
          <span className="text-gray-500">Pessoas cadastradas</span>
          <span className="text-2xl font-bold">{pessoas.length}</span>
        </div>

        <div className="bg-white shadow-md rounded p-4 flex flex-col justify-between">
          <span className="text-gray-500">Categorias cadastradas</span>
          <span className="text-2xl font-bold">{categorias.length}</span>
        </div>

        <div className="bg-white shadow-md rounded p-4 flex flex-col justify-between">
          <span className="text-gray-500">Transações cadastradas</span>
          <span className="text-2xl font-bold">{transacoes.length}</span>
        </div>

        <div className="bg-white shadow-md rounded p-4 flex flex-col justify-between">
          <span className="text-gray-500">Saldo Total</span>
          <span className="text-2xl font-bold">
            R$ {saldo.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <a
          href="/Pessoas"
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded shadow text-center font-semibold"
        >
          Gerenciar Pessoas
        </a>
        <a
          href="/Categorias"
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded shadow text-center font-semibold"
        >
          Gerenciar Categorias
        </a>
        <a
          href="/Transacoes"
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded shadow text-center font-semibold"
        >
          Gerenciar Transações
        </a>
      </div>
    </div>
  );
}