# Sistema de Controle de Gastos Residenciais

Este projeto é um **relatório financeiro** que permite acompanhar receitas, despesas e saldo de pessoas e categorias. Ele foi desenvolvido como teste técnico e demonstra funcionalidades de cadastro e relatórios detalhados.

---

## Tecnologias utilizadas

**Back-end:**
- C# / .NET 6
- Entity Framework Core
- SQL Server ou SQLite (dependendo da configuração)

**Front-end:**
- React
- TypeScript
- Tailwind CSS
- Axios (para chamadas à API)

---

## Estrutura do projeto

- **backend/** → Contém a API em .NET, controllers, models, DTOs e contexto do banco de dados.
- **frontend/** → Contém a aplicação em React/TypeScript, páginas, componentes e chamadas à API.

---

## Instruções de uso

### Backend
1. Abra a pasta `backend` no Visual Studio ou VS Code.
2. Configure a connection string no `appsettings.json`.
3. Execute a aplicação (`F5` ou `dotnet run`).
4. A API estará disponível em `https://localhost:5001` ou `http://localhost:5000`.

### Frontend
1. Abra a pasta `frontend`.
2. Instale as dependências:
   ```bash
   npm install
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev

 O aplicativo será aberto em http://localhost:3000

### Funcionalidades

Cadastro de pessoas e categorias

Registro de transações (receitas e despesas)

Relatórios por pessoa e por categoria

Totais gerais e saldos calculados automaticamente
