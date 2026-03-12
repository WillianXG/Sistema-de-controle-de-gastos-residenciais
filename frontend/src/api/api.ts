import axios from "axios";

// Conexao com a API, para realizar as requisições HTTP
export const api = axios.create({
  baseURL: "http://localhost:5028/api"
});