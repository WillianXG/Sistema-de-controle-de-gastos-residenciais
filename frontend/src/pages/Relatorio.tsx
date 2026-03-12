import { useEffect, useState } from "react"
import { api } from "../api/api"

type PessoaRelatorio = {
    pessoaId: number
    nome: string
    totalReceitas: number
    totalDespesas: number
    saldo: number
}

type RelatorioResponse = {
    pessoas: PessoaRelatorio[]
    totalReceitas: number
    totalDespesas: number
    saldoTotal: number
}

export default function Relatorio() {

    const [dados, setDados] = useState<RelatorioResponse>()

    useEffect(() => {

        async function carregarDados() {
            const res = await api.get("/Pessoas/totais")
            setDados(res.data)
        }

        carregarDados()

    }, [])

    return (

        <div className="max-w-4xl mx-auto">

            <h2 className="text-2xl font-bold mb-6">
                Relatório Financeiro
            </h2>

            <div className="grid grid-cols-3 gap-4 mb-8">

                <div className="bg-green-100 p-4 rounded shadow text-center">
                    <p className="text-gray-600">Receitas</p>
                    <p className="text-2xl font-bold text-green-700">
                        R$ {dados?.totalReceitas ?? 0}
                    </p>
                </div>

                <div className="bg-red-100 p-4 rounded shadow text-center">
                    <p className="text-gray-600">Despesas</p>
                    <p className="text-2xl font-bold text-red-700">
                        R$ {dados?.totalDespesas ?? 0}
                    </p>
                </div>

                <div className="bg-blue-100 p-4 rounded shadow text-center">
                    <p className="text-gray-600">Saldo Total</p>
                    <p className="text-2xl font-bold text-blue-700">
                        R$ {dados?.saldoTotal ?? 0}
                    </p>
                </div>

            </div>

            <div className="space-y-3">

                {dados?.pessoas?.map((p) => (

                    <div
                        key={p.pessoaId}
                        className="border rounded p-4 shadow-sm flex justify-between"
                    >

                        <span className="font-semibold">
                            {p.nome}
                        </span>

                        <span className="text-green-600">
                            Receita: R$ {p.totalReceitas}
                        </span>

                        <span className="text-red-600">
                            Despesa: R$ {p.totalDespesas}
                        </span>

                        <span className="text-blue-600 font-semibold">
                            Saldo: R$ {p.saldo}
                        </span>

                    </div>

                ))}

            </div>

        </div>

    )
}