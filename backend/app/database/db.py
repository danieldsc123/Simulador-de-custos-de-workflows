import sqlite3
import json
from datetime import datetime
from pathlib import Path

DB_PATH = Path(__file__).resolve().parents[2] / "data" / "workflows.db"


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)

    with get_conn() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS simulations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at TEXT NOT NULL,

                layer TEXT,
                sla TEXT,
                workflow_quantity INTEGER,
                assertividade REAL,
                custo_total REAL,

                input_json TEXT NOT NULL,
                result_json TEXT NOT NULL
            );
            """
        )
        conn.commit()


def insert_simulation(input_data: dict, result_data: dict) -> dict:
    created_at = datetime.utcnow().isoformat()

    layer = input_data.get("layer")
    sla = input_data.get("sla")
    workflow_quantity = int(input_data.get("workflow_quantity", 1))
    assertividade = float(input_data.get("assertividade", 0))
    custo_total = float(result_data.get("custo_total", 0))

    with get_conn() as conn:
        cur = conn.execute(
            """
            INSERT INTO simulations (
                created_at, layer, sla, workflow_quantity, assertividade, custo_total, input_json, result_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                created_at,
                layer,
                sla,
                workflow_quantity,
                assertividade,
                custo_total,
                json.dumps(input_data, ensure_ascii=False),
                json.dumps(result_data, ensure_ascii=False),
            ),
        )
        conn.commit()

        new_id = cur.lastrowid

    return {
        "id": new_id,
        "created_at": created_at,
        "input": input_data,
        "result": result_data,
    }


def get_history(limit: int = 20) -> list[dict]:
    limit = max(1, min(int(limit), 200))

    with get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM simulations ORDER BY id DESC LIMIT ?",
            (limit,),
        ).fetchall()

    out = []
    for r in rows:
        out.append(
            {
                "id": r["id"],
                "created_at": r["created_at"],
                "input": json.loads(r["input_json"]),
                "result": json.loads(r["result_json"]),
            }
        )
    return out


def delete_simulation(sim_id: int) -> bool:
    with get_conn() as conn:
        cur = conn.execute("DELETE FROM simulations WHERE id = ?", (int(sim_id),))
        conn.commit()
        return cur.rowcount > 0
