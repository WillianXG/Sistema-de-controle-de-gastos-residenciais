import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"

import Pessoas from "./pages/Pessoas"
import Categorias from "./pages/Categorias"
import Transacoes from "./pages/Transacoes"
import Relatorio from "./pages/Relatorio"
import Home from "./pages/Home"

function App() {

  return (

    <BrowserRouter>

      <Navbar/>

      <div className="max-w-6xl mx-auto p-6">

        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/pessoas" element={<Pessoas/>} />
          <Route path="/categorias" element={<Categorias/>} />
          <Route path="/transacoes" element={<Transacoes/>} />
          <Route path="/relatorio" element={<Relatorio/>} />

        </Routes>

      </div>

    </BrowserRouter>

  )
}

export default App