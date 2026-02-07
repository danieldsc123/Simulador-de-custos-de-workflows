console.log("APP JS CARREGOU");

const API_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
  console.log("INIT rodou ✅");

  const btn = document.getElementById("addProcessBtn");
  const tbody = document.getElementById("processListBody");
  const exportBtn = document.getElementById("exportBtn");

  if (!btn || !tbody) {
    console.error("ERRO: IDs do HTML não encontrados (addProcessBtn/processListBody).");
    return;
  }

  // ---------------- API ----------------
  async function apiGetHistory(limit = 50) {
    const url = new URL(`${API_URL}/workflows/history`);
    url.searchParams.set("limit", String(limit));

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Erro history (${res.status})`);
    return res.json();
  }

  async function apiSimulate(payload) {
    const res = await fetch(`${API_URL}/workflows/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.detail?.[0]?.msg || `Erro simulate (${res.status})`);
    }
    return res.json();
  }

  async function apiDelete(id) {
    const res = await fetch(`${API_URL}/workflows/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.detail || `Erro delete (${res.status})`);
    }
    return res.json();
  }

  // ---------------- Utils ----------------
  function formatMoney(value) {
    const num = Number(value);
    if (Number.isNaN(num)) return "-";
    return "R$ " + num.toFixed(2).replace(".", ",");
  }

  function escapeHtml(text) {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return String(text ?? "").replace(/[&<>"']/g, (m) => map[m]);
  }

  function setExportEnabled() {
    if (!exportBtn) return;
    exportBtn.disabled = tbody.querySelectorAll("tr").length === 0;
  }

  // ---------------- Render ----------------
  /**
   * simulation esperado do backend:
   * { id, created_at, input: {...}, result: {...} }
   */
  function addRow(simulation) {
    const input = simulation.input || {};
    const result = simulation.result || {};

    // Nome do processo: se vier vazio, usa "—"
    const processName = escapeHtml(
      (document.getElementById("processName")?.value || input.process_name || "—").trim()
    );

    const tr = document.createElement("tr");
    tr.dataset.id = String(simulation.id);

    tr.innerHTML = `
      <td>${processName}</td>
      <td>${escapeHtml(input.workflow_quantity)}</td>
      <td>${escapeHtml(input.layer)}</td>
      <td>${formatMoney(result.valor_base)}</td>
      <td>${escapeHtml(input.sla)}</td>
      <td>${formatMoney(result.valor_base_com_sla)}</td>
      <td>${formatMoney(result.adicional_plantao)}</td>
      <td>${formatMoney(result.adicional_cobertura)}</td>
      <td>${formatMoney(result.adicional_frequencia)}</td>
      <td>${formatMoney(result.adicional_comp_processo)}</td>
      <td>${formatMoney(result.adicional_comp_validacao)}</td>
      <td>${formatMoney(result.adicional_por_assertividade)}</td>
      <td>${formatMoney(result.custo_total)}</td>
      <td>${escapeHtml(input.assertividade)}%</td>
      <td><button class="delete-btn" type="button" data-id="${escapeHtml(simulation.id)}">Excluir</button></td>
    `;

    tbody.appendChild(tr);
    setExportEnabled();
  }

  function clearForm() {
    const idsToReset = [
      ["processName", ""],
      ["workflowQuantity", "1"],
      ["dailyExecutionCount", "1"],
      ["assertividadeInput", "95"],
    ];
    idsToReset.forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.value = value;
    });
  }

  // ---------------- Eventos ----------------

  // 1) SIMULAR
  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const processName = (document.getElementById("processName")?.value || "").trim();

    const payload = {
      layer: document.getElementById("processLayer").value,
      sla: document.getElementById("slaLevel").value,
      on_call_type: document.getElementById("onCallType").value,
      coverage: document.getElementById("coverage").value,
      frequency_days: parseInt(document.getElementById("executionFrequency").value, 10),
      daily_execution_count: parseInt(document.getElementById("dailyExecutionCount").value, 10) || 1,
      process_complexity: document.getElementById("processComplexity").value,
      validation_complexity: document.getElementById("validationComplexity").value,
      workflow_quantity: parseInt(document.getElementById("workflowQuantity").value, 10),
      assertividade: parseFloat(document.getElementById("assertividadeInput").value),
    };

    // opcional: salvar nome no input (o backend ignora se não existir)
    if (processName) payload.process_name = processName;

    try {
      btn.disabled = true;
      btn.textContent = "Calculando...";

      console.log("Payload enviado:", payload);

      const simulation = await apiSimulate(payload);

      console.log("Resposta API:", simulation);

      addRow(simulation);
      clearForm();

    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao calcular.");
    } finally {
      btn.disabled = false;
      btn.textContent = "Adicionar e Calcular Workflow";
    }
  });

  // 2) EXCLUIR (delegação)
  tbody.addEventListener("click", async (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    if (!target.classList.contains("delete-btn")) return;

    const id = target.getAttribute("data-id");
    const tr = target.closest("tr");

    if (!id || !tr) return;

    const ok = confirm(`Deseja excluir a simulação #${id}?`);
    if (!ok) return;

    try {
      await apiDelete(id);
      tr.remove();
      setExportEnabled();
      console.log(`Simulação ${id} deletada ✅`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao excluir.");
    }
  });

  // 3) EXPORT CSV
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const rows = [];

      // cabeçalho
      rows.push([
        "Nome do Processo", "Qtd Workflows", "Tipo", "Valor Base", "SLA",
        "Valor Base c/ SLA", "Ad. Plantão", "Ad. Cobertura", "Ad. Frequência",
        "Ad. Comp. Processo", "Ad. Comp. Validação", "Ad. Assertividade",
        "Custo Mensal Total", "Assertividade"
      ]);

      tbody.querySelectorAll("tr").forEach((tr) => {
        const cols = tr.querySelectorAll("td");
        const row = [];
        for (let i = 0; i < cols.length - 1; i++) {
          let text = cols[i].textContent.trim();

          // converter moeda "R$ 1.234,56" -> "1234.56"
          if (text.startsWith("R$")) {
            text = text.replace("R$", "").trim().replace(/\./g, "").replace(",", ".");
          }
          row.push(`"${text.replace(/"/g, '""')}"`);
        }
        rows.push(row);
      });

      const csv = rows.map((r) => r.join(";")).join("\r\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `simulador_custo_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }

  // ---------------- Boot: carregar histórico ----------------
  (async () => {
    try {
      console.log("Carregando histórico...");
      const history = await apiGetHistory(50);

      // limpa e re-renderiza
      tbody.innerHTML = "";
      history.reverse().forEach(addRow); // mais antigo em cima (opcional)

      setExportEnabled();
      console.log("Histórico carregado ✅", history);
    } catch (err) {
      console.warn("Não consegui carregar histórico:", err.message);
      setExportEnabled();
    }
  })();
});
