🧮 Simulador de Custos de Sustentação de Workflows

Simulador full-stack para estimar o custo mensal de sustentação de workflows corporativos.

Projeto criado com foco em backend profissional, testes automatizados e Docker.

"""
Configurações de simulação de custos.

Todos os valores presentes neste arquivo são fictícios e foram criados
apenas para fins educacionais e de demonstração técnica.
"""

## 🧠 Como o cálculo funciona (resumo)

🛠️ Tecnologias

• Python 3.12
• FastAPI
• SQLite
• Docker & Docker Compose
• Pytest
• HTML • CSS • JavaScript



🚀 Como rodar com Docker
Pré-requisito:
Ter o Docker Desktop instalado.

Subir aplicação
• docker compose up --build


A API ficará disponível em:

• Swagger → http://127.0.0.1:8000/docs
• Healthcheck → http://127.0.0.1:8000/health

Parar aplicação
• docker compose down

🧪 Rodando os testes

Dentro da pasta backend/:
• pytest -q


🔌 Endpoints principais:

Criar simulação
POST /workflows/simulate


• Calcula o custo e salva no histórico.

Listar histórico
• GET /workflows/history?limit=20

Deletar simulação
• DELETE /workflows/history/{id}

Healthcheck
GET /health

🏗️ Arquitetura do Projeto:
• frontend → FastAPI → Services → SQLite → Docker


O projeto segue arquitetura em camadas:

• routes → endpoints da API

• services → regra de negócio

• models → schemas e banco

• tests → testes automatizados


💡 Objetivo do projeto

Este projeto foi desenvolvido para demonstrar:

• Construção de APIs REST

• Persistência com banco de dados

• Testes automatizados com Pytest

• Containerização com Docker

• Integração frontend ↔ backend



🔮 Próximos passos

• Dashboard analítico

• Integração com Databricks

• Deploy em cloud
