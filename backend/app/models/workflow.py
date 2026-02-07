from pydantic import BaseModel, Field
from typing import Literal


class WorkflowSimulationRequest(BaseModel):
    layer: Literal["plataforma", "produto", "ModelosAA"]
    sla: Literal["8h", "6h", "4h", "2h"]
    on_call_type: Literal["Com plantão", "Sem plantão"]
    coverage: Literal["8 x 5", "5 x 12"]

    frequency_days: Literal[1, 7, 30]
    daily_execution_count: int = Field(default=1, ge=1)

    process_complexity: Literal["Baixa", "Média", "Alta"]
    validation_complexity: Literal["Sem validação", "Baixa", "Média", "Alta"]

    workflow_quantity: int = Field(ge=1)
    assertividade: float = Field(ge=1, le=100)
