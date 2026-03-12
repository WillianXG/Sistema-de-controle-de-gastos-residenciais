import { Link } from "react-router-dom"

export default function Navbar() {

  return (
    <nav className="bg-blue-600 text-white p-4">

      <div className="max-w-6xl mx-auto flex gap-6">

        <Link to="/" className="font-bold">
          Sistema
        </Link>

        <Link to="/pessoas">
          Pessoas
        </Link>

        <Link to="/categorias">
          Categorias
        </Link>

        <Link to="/transacoes">
          Transações
        </Link>

        <Link to="/relatorio">
          Relatório
        </Link>

      </div>

    </nav>
  )
}