document.addEventListener('DOMContentLoaded', () => {
  const COST_FACTORS = {
    layer: { plataforma: 60.0, produto: 85.0, ModelosAA: 100.0 },
    sla: { '8h': 1.0, '6h': 1.5, '4h': 2.5, '2h': 6.0 },
    onCall: { 'Com plantão': 1.0, 'Sem plantão': 0.0 },
    processComplexity: { 'Baixa': 0.0, 'Média': 0.25, 'Alta': 0.6 },
    validationComplexity: { 'Sem validação': 0.0, 'Baixa': 0.25, 'Média': 0.5, 'Alta': 1.0 },
    coverage: { '8 x 5': 0.0, '5 x 12': 1.2 },
  };

  const TICKET_COST = 143.00;

  // Ajuste simples e transparente:
  // - Mensal = baseline (1)
  // - Semanal = ~4 exec/mês
  // - Diária = dailyExecutionCount * 30 exec/mês
  // O adicional de frequência é proporcional ao "excesso" de execuções vs baseline.
  const FREQ_EXTRA_EXECUTION_FACTOR = 0.02; // 2% por execução extra (ajustável)

  function computeExecutionsPerMonth(frequency, dailyExecutionCount) {
    if (frequency === 30) return 1; // mensal
    if (frequency === 7) return 4;  // semanal (~4)
    // diária
    const daily = Math.max(1, dailyExecutionCount || 1);
    return daily * 30;
  }

  function calculateProcessCost(input) {
    const valorBase = COST_FACTORS.layer[input.layer] || 0;
    const slaMultiplier = COST_FACTORS.sla[input.sla] || 1.0;
    const valorBaseComSLA = valorBase * slaMultiplier;

    const adicionalPlantao = valorBaseComSLA * (COST_FACTORS.onCall[input.onCallType] || 0);
    const adicionalCobertura = valorBaseComSLA * (COST_FACTORS.coverage[input.coverage] || 0);

    const executionsPerMonth = computeExecutionsPerMonth(input.frequency, input.dailyExecutionCount);
    const freqMultiplier = Math.max(0, executionsPerMonth - 1) * FREQ_EXTRA_EXECUTION_FACTOR;
    const adicionalFrequencia = valorBaseComSLA * freqMultiplier;

    const adicionalCompProcesso = valorBaseComSLA * (COST_FACTORS.processComplexity[input.processComplexity] || 0);
    const adicionalCompValidacao = valorBaseComSLA * (COST_FACTORS.validationComplexity[input.validationComplexity] || 0);

    const custoRetainer =
      valorBaseComSLA +
      adicionalPlantao +
      adicionalCobertura +
      adicionalFrequencia +
      adicionalCompProcesso +
      adicionalCompValidacao;

    const taxaDeFalha = 1 - (input.assertividade / 100.0);
    const adicionalPorAssertividade = taxaDeFalha * TICKET_COST;

    const custoTotal = (custoRetainer + adicionalPorAssertividade) * input.workflowQuantity;

    return {
      valorBase,
      valorBaseComSLA,
      adicionalPlantao,
      adicionalCobertura,
      adicionalFrequencia,
      adicionalCompProcesso,
      adicionalCompValidacao,
      adicionalPorAssertividade,
      custoTotal,
      executionsPerMonth,
    };
  }

  const addProcessBtn = document.getElementById('addProcessBtn');
  const processListBody = document.getElementById('processListBody');
  const exportBtn = document.getElementById('exportBtn');

  const frequencySelector = document.getElementById('executionFrequency');
  const dailyExecutionBlock = document.getElementById('dailyExecutionCountBlock');
  const dailyExecutionInput = document.getElementById('dailyExecutionCount');

  function toggleDailyExecutionVisibility() {
    if (frequencySelector.value === '1') {
      dailyExecutionBlock.style.display = '';
    } else {
      dailyExecutionBlock.style.display = 'none';
      dailyExecutionInput.value = '1';
    }
  }

  frequencySelector.addEventListener('change', toggleDailyExecutionVisibility);
  toggleDailyExecutionVisibility();

  function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  function formatMoney(value) {
    if (Number.isNaN(value)) return 'Erro no Cálculo';
    return 'R$ ' + value.toFixed(2).replace('.', ',');
  }

  function checkTableButtons() {
    exportBtn.disabled = processListBody.querySelectorAll('tr').length === 0;
  }

  addProcessBtn.addEventListener('click', () => {
    const processName = document.getElementById('processName').value.trim();
    const workflowQuantity = parseInt(document.getElementById('workflowQuantity').value, 10);
    const processLayer = document.getElementById('processLayer').value;
    const executionFrequency = parseInt(document.getElementById('executionFrequency').value, 10);

    const dailyExecutionCount = parseInt(document.getElementById('dailyExecutionCount').value, 10) || 1;

    const processComplexity = document.getElementById('processComplexity').value;
    const validationComplexity = document.getElementById('validationComplexity').value;
    const slaLevel = document.getElementById('slaLevel').value;
    const onCallType = document.getElementById('onCallType').value;
    const coverage = document.getElementById('coverage').value;
    const assertividade = parseFloat(document.getElementById('assertividadeInput').value);

    if (!processName) { alert('Por favor, preencha o nome do processo.'); return; }
    if (!workflowQuantity || workflowQuantity < 1) { alert('Quantidade de workflows deve ser no mínimo 1.'); return; }
    if (executionFrequency === 1 && (!dailyExecutionCount || dailyExecutionCount < 1)) {
      alert('Quantidade de execuções diárias deve ser no mínimo 1.');
      return;
    }
    if (Number.isNaN(assertividade) || assertividade < 1 || assertividade > 100) {
      alert('A taxa de assertividade deve ser um valor entre 1 e 100.');
      return;
    }

    const costInput = {
      layer: processLayer,
      sla: slaLevel,
      onCallType,
      frequency: executionFrequency,
      dailyExecutionCount: executionFrequency === 1 ? dailyExecutionCount : 1,
      processComplexity,
      validationComplexity,
      workflowQuantity,
      coverage,
      assertividade
    };

    const costs = calculateProcessCost(costInput);
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${escapeHtml(processName)}</td>
      <td>${workflowQuantity}</td>
      <td>${escapeHtml(processLayer)}</td>
      <td>${formatMoney(costs.valorBase)}</td>
      <td>${escapeHtml(slaLevel)}</td>
      <td>${formatMoney(costs.valorBaseComSLA)}</td>
      <td>${formatMoney(costs.adicionalPlantao)}</td>
      <td>${formatMoney(costs.adicionalCobertura)}</td>
      <td>${formatMoney(costs.adicionalFrequencia)}</td>
      <td>${formatMoney(costs.adicionalCompProcesso)}</td>
      <td>${formatMoney(costs.adicionalCompValidacao)}</td>
      <td>${formatMoney(costs.adicionalPorAssertividade)}</td>
      <td>${formatMoney(costs.custoTotal)}</td>
      <td>${assertividade.toFixed(0)}%</td>
      <td><button class="delete-btn" aria-label="Excluir processo">Excluir</button></td>
    `;

    tr.querySelector('.delete-btn').addEventListener('click', () => {
      tr.remove();
      checkTableButtons();
    });

    processListBody.appendChild(tr);

    document.getElementById('processName').value = '';
    document.getElementById('workflowQuantity').value = '1';
    checkTableButtons();
  });

  exportBtn.addEventListener('click', () => {
    const rows = [];
    rows.push([
      'Nome do Processo', 'Qtd de Workflows', 'Tipo', 'Valor Base', 'SLA',
      'Valor Base c/ SLA', 'Ad. Plantão', 'Ad. Cobertura', 'Ad. Frequência',
      'Ad. Comp. Processo', 'Ad. Comp. Validação', 'Adicional por Assertividade',
      'Custo Mensal Total', 'Taxa de Assertividade'
    ]);

    processListBody.querySelectorAll('tr').forEach(tr => {
      const cols = tr.querySelectorAll('td');
      const rowData = [];
      for (let i = 0; i < cols.length - 1; i++) {
        let text = cols[i].textContent.trim();
        if (text.startsWith('R$')) {
          text = text.replace('R$', '').trim().replace(/\./g, '').replace(',', '.');
        }
        rowData.push(`"${text.replace(/"/g, '""')}"`);
      }
      rows.push(rowData);
    });

    let csvContent = "";
    rows.forEach(rowArray => {
      csvContent += rowArray.join(';') + "\r\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    const timestamp = new Date().toISOString().slice(0,10);
    link.download = `simulador_custo_${timestamp}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });

  checkTableButtons();
});
