# Simulador de Custo de Sustentação (Workflows)

Aplicação web (HTML/CSS/JS) para **simular o custo mensal de sustentação de workflows**, considerando:
- tipo/camada (Produto, Plataforma, Modelos AA)
- SLA desejado
- complexidade do processo e da validação
- necessidade de plantão e cobertura
- frequência de execução
- taxa de assertividade (impacto por falhas / tickets)
- quantidade de workflows

> Última atualização dos fatores de custo: **07 de agosto de 2025**.

---

## ✅ Funcionalidades

- Adicionar workflows com parâmetros de simulação
- Calcular automaticamente:
  - Valor base
  - Valor base com SLA
  - Adicionais (plantão, cobertura, frequência, complexidade, validação)
  - Adicional por assertividade (falhas)
  - Custo mensal total (multiplicado pela quantidade de workflows)
- Listar workflows em tabela
- Remover linhas individualmente
- Exportar resultados em **CSV**

---

## 🧠 Como o cálculo funciona (resumo)

### 1) Retainer (custo base + adicionais)
- `valorBase` (depende do tipo/camada)
- `valorBaseComSLA = valorBase * multiplicadorSLA`
- Adicionais calculados em cima de `valorBaseComSLA`:
  - Plantão
  - Cobertura
  - Frequência
  - Complexidade do processo
  - Complexidade da validação

### 2) Adicional por assertividade (falhas)
- `taxaFalha = 1 - (assertividade / 100)`
- `adicionalAssertividade = taxaFalha * custoTicket`
- No código: `custoTicket = R$ 143,00`

### 3) Custo total mensal
- `custoTotal = (retainer + adicionalAssertividade) * quantidadeWorkflows`

---

## ▶️ Como rodar

1. Baixe/clone o repositório
2. Abra o arquivo `index.html` no navegador

---

## 📤 Exportação CSV

O botão **“Exportar Google Planilhas (.csv)”** gera um arquivo `.csv` separado por `;`, pronto para importar no Google Sheets/Excel.

---

## 🛠️ Tecnologias

- HTML
- CSS
- JavaScript (Vanilla)
