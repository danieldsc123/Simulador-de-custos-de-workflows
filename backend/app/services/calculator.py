from dataclasses import dataclass


COST_FACTORS = {
    "layer": {"plataforma": 60.0, "produto": 85.0, "ModelosAA": 100.0},
    "sla": {"8h": 1.0, "6h": 1.5, "4h": 2.5, "2h": 6.0},
    "onCall": {"Com plantão": 1.0, "Sem plantão": 0.0},
    "processComplexity": {"Baixa": 0.0, "Média": 0.25, "Alta": 0.6},
    "validationComplexity": {"Sem validação": 0.0, "Baixa": 0.25, "Média": 0.5, "Alta": 1.0},
    "coverage": {"8 x 5": 0.0, "5 x 12": 1.2},
}

TICKET_COST = 143.00

# frequencia (mesmo conceito que você estava usando)
FREQ_EXTRA_EXECUTION_FACTOR = 0.02  # 2% por execução extra


def compute_executions_per_month(frequency_days: int, daily_execution_count: int) -> int:
    if frequency_days == 30:
        return 1
    if frequency_days == 7:
        return 4
    # diária
    daily = max(1, int(daily_execution_count or 1))
    return daily * 30


def calculate_cost(input_data: dict) -> dict:
    layer = input_data["layer"]
    sla = input_data["sla"]
    on_call_type = input_data["on_call_type"]
    coverage = input_data["coverage"]
    frequency_days = int(input_data["frequency_days"])
    daily_execution_count = int(input_data.get("daily_execution_count", 1))
    process_complexity = input_data["process_complexity"]
    validation_complexity = input_data["validation_complexity"]
    workflow_quantity = int(input_data["workflow_quantity"])
    assertividade = float(input_data["assertividade"])

    valor_base = COST_FACTORS["layer"].get(layer, 0.0)
    sla_multiplier = COST_FACTORS["sla"].get(sla, 1.0)
    valor_base_com_sla = valor_base * sla_multiplier

    adicional_plantao = valor_base_com_sla * COST_FACTORS["onCall"].get(on_call_type, 0.0)
    adicional_cobertura = valor_base_com_sla * COST_FACTORS["coverage"].get(coverage, 0.0)

    execucoes_por_mes = compute_executions_per_month(frequency_days, daily_execution_count)
    freq_multiplier = max(0, execucoes_por_mes - 1) * FREQ_EXTRA_EXECUTION_FACTOR
    adicional_frequencia = valor_base_com_sla * freq_multiplier

    adicional_comp_processo = valor_base_com_sla * COST_FACTORS["processComplexity"].get(process_complexity, 0.0)
    adicional_comp_validacao = valor_base_com_sla * COST_FACTORS["validationComplexity"].get(validation_complexity, 0.0)

    custo_retainer = (
        valor_base_com_sla
        + adicional_plantao
        + adicional_cobertura
        + adicional_frequencia
        + adicional_comp_processo
        + adicional_comp_validacao
    )

    taxa_de_falha = 1 - (assertividade / 100.0)
    adicional_por_assertividade = taxa_de_falha * TICKET_COST

    custo_total = (custo_retainer + adicional_por_assertividade) * workflow_quantity

    return {
        "valor_base": valor_base,
        "valor_base_com_sla": valor_base_com_sla,
        "adicional_plantao": adicional_plantao,
        "adicional_cobertura": adicional_cobertura,
        "adicional_frequencia": adicional_frequencia,
        "adicional_comp_processo": adicional_comp_processo,
        "adicional_comp_validacao": adicional_comp_validacao,
        "adicional_por_assertividade": adicional_por_assertividade,
        "custo_retainer": custo_retainer,
        "execucoes_por_mes": execucoes_por_mes,
        "custo_total": custo_total,
    }
