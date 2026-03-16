from app.config.pricing_config import (
    COST_FACTORS,
    TICKET_COST,
    FREQ_EXTRA_EXECUTION_FACTOR
)


def compute_executions_per_month(frequency_days: int, daily_execution_count: int) -> int:
    """
    Calcula quantas execuções ocorrem por mês com base na frequência.
    """

    if frequency_days == 30:
        return 1

    if frequency_days == 7:
        return 4

    # Execução diária
    daily = max(1, int(daily_execution_count or 1))
    return daily * 30


def calculate_cost(input_data: dict) -> dict:
    """
    Calcula o custo mensal de sustentação de workflows
    com base nos parâmetros operacionais informados.
    """

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

    # Valor base por camada
    valor_base = COST_FACTORS["layer"].get(layer, 0.0)

    # SLA
    sla_multiplier = COST_FACTORS["sla"].get(sla, 1.0)
    valor_base_com_sla = valor_base * sla_multiplier

    # Plantão
    adicional_plantao = (
        valor_base_com_sla
        * COST_FACTORS["onCall"].get(on_call_type, 0.0)
    )

    # Cobertura operacional
    adicional_cobertura = (
        valor_base_com_sla
        * COST_FACTORS["coverage"].get(coverage, 0.0)
    )

    # Frequência de execução
    execucoes_por_mes = compute_executions_per_month(
        frequency_days,
        daily_execution_count
    )

    freq_multiplier = max(0, execucoes_por_mes - 1) * FREQ_EXTRA_EXECUTION_FACTOR

    adicional_frequencia = valor_base_com_sla * freq_multiplier

    # Complexidade de processo
    adicional_comp_processo = (
        valor_base_com_sla
        * COST_FACTORS["processComplexity"].get(process_complexity, 0.0)
    )

    # Complexidade de validação
    adicional_comp_validacao = (
        valor_base_com_sla
        * COST_FACTORS["validationComplexity"].get(validation_complexity, 0.0)
    )

    # Custo retainer
    custo_retainer = (
        valor_base_com_sla
        + adicional_plantao
        + adicional_cobertura
        + adicional_frequencia
        + adicional_comp_processo
        + adicional_comp_validacao
    )

    # Impacto por falha operacional
    taxa_de_falha = 1 - (assertividade / 100.0)

    adicional_por_assertividade = taxa_de_falha * TICKET_COST

    # Custo total
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