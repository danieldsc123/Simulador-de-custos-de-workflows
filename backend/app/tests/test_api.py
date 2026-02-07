from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_simulate_workflow():
    payload = {
        "layer": "produto",
        "sla": "4h",
        "on_call_type": "Sem plantão",
        "coverage": "8 x 5",
        "frequency_days": 1,
        "daily_execution_count": 2,
        "process_complexity": "Média",
        "validation_complexity": "Baixa",
        "workflow_quantity": 3,
        "assertividade": 95
    }

    response = client.post("/workflows/simulate", json=payload)

    assert response.status_code == 200

    data = response.json()

    assert "result" in data
    assert "custo_total" in data["result"]
    assert data["result"]["custo_total"] > 0


def test_get_history():
    response = client.get("/workflows/history")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
