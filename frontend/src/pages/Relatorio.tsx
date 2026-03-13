import { useEffect, useState } from "react";
import { api } from "../api/api";

// tipos do relatório por pessoa
type PessoaRelatorio = {
  pessoaId: number;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
};

type RelatorioPessoaResponse = {
  pessoas: PessoaRelatorio[];
  totalReceitas: number;
  totalDespesas: number;
  saldoTotal: number;
};

// tipos do relatório por categoria
type CategoriaRelatorio = {
  categoriaId: number;
  descricao: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
};

type RelatorioCategoriaResponse = {
  categorias: CategoriaRelatorio[];
  totalReceitas: number;
  totalDespesas: number;
  saldoTotal: number;
};

export default function Relatorio() {
  const [dadosPessoas, setDadosPessoas] = useState<RelatorioPessoaResponse>();
  const [dadosCategorias, setDadosCategorias] = useState<RelatorioCategoriaResponse>();

  useEffect(() => {
    async function carregarDados() {
      try {
        const resPessoas = await api.get<RelatorioPessoaResponse>("/Pessoas/totais");
        setDadosPessoas(resPessoas.data);

        const resCategorias = await api.get<RelatorioCategoriaResponse>("/Categorias/totais");
        setDadosCategorias(resCategorias.data);
      } catch {
        setDadosPessoas({
          pessoas: [],
          totalReceitas: 0,
          totalDespesas: 0,
          saldoTotal: 0,
        });
        setDadosCategorias({
          categorias: [],
          totalReceitas: 0,
          totalDespesas: 0,
          saldoTotal: 0,
        });
      }
    }

    carregarDados();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Relatório Financeiro</h2>

      {/* Totais gerais */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <p className="text-gray-600 font-semibold">Total de Receitas</p>
          <p className="text-2xl font-bold text-green-700">
            R$ {(dadosPessoas?.totalReceitas ?? 0) + (dadosCategorias?.totalReceitas ?? 0)}
          </p>
        </div>

        <div className="bg-red-100 p-4 rounded shadow text-center">
          <p className="text-gray-600 font-semibold">Total de Despesas</p>
          <p className="text-2xl font-bold text-red-700">
            R$ {(dadosPessoas?.totalDespesas ?? 0) + (dadosCategorias?.totalDespesas ?? 0)}
          </p>
        </div>

        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <p className="text-gray-600 font-semibold">Saldo Total</p>
          <p className="text-2xl font-bold text-blue-700">
            R$ {(dadosPessoas?.saldoTotal ?? 0) + (dadosCategorias?.saldoTotal ?? 0)}
          </p>
        </div>
      </div>

      {/* Lista por pessoa */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Detalhes por Pessoa</h3>
        <div className="space-y-3">
          {dadosPessoas?.pessoas.map((p) => (
            <div
              key={p.pessoaId}
              className="border rounded p-4 shadow-sm flex justify-between flex-wrap gap-2 items-center"
            >
              <span className="font-semibold">{p.nome}</span>
              <div className="flex gap-4 flex-wrap">
                <span className="text-green-600 font-medium">Receita: R$ {p.totalReceitas}</span>
                <span className="text-red-600 font-medium">Despesa: R$ {p.totalDespesas}</span>
                <span className="text-blue-600 font-semibold">Saldo: R$ {p.saldo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lista por categoria */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Detalhes por Categoria</h3>
        <div className="space-y-3">
          {dadosCategorias?.categorias.map((c) => (
            <div
              key={c.categoriaId}
              className="border rounded p-4 shadow-sm flex justify-between flex-wrap gap-2 items-center"
            >
              <span className="font-semibold">{c.descricao}</span>
              <div className="flex gap-4 flex-wrap">
                <span className="text-green-600 font-medium">Receita: R$ {c.totalReceitas}</span>
                <span className="text-red-600 font-medium">Despesa: R$ {c.totalDespesas}</span>
                <span className="text-blue-600 font-semibold">Saldo: R$ {c.saldo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}