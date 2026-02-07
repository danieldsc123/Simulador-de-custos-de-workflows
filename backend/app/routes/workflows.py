from fastapi import APIRouter, HTTPException
from app.models.workflow import WorkflowSimulationRequest
from app.services.calculator import calculate_cost
from app.database.db import insert_simulation, get_history, delete_simulation

router = APIRouter(prefix="/workflows", tags=["Workflows"])


@router.get("/ping")
def ping():
    return {"pong": True}


@router.post("/simulate")
def simulate(payload: WorkflowSimulationRequest):
    input_data = payload.model_dump()
    result = calculate_cost(input_data)

    saved = insert_simulation(input_data=input_data, result_data=result)
    return saved


@router.get("/history")
def history(limit: int = 20):
    return get_history(limit=limit)


@router.delete("/{sim_id}")
def delete(sim_id: int):
    ok = delete_simulation(sim_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Simulação não encontrada.")
    return {"deleted": True, "id": sim_id}
