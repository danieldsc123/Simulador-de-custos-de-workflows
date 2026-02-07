from app.services.calculator import CostInput, calculate_cost

data = CostInput(
    layer="produto",
    sla="4h",
    on_call_type="Sem plantão",
    coverage="8 x 5",
    frequency_days=1,
    daily_execution_count=2,
    process_complexity="Média",
    validation_complexity="Baixa",
    workflow_quantity=3,
    assertividade=95,
)

print(calculate_cost(data))
