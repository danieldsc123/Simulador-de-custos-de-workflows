from sqlalchemy import Column, Integer, Float, String, DateTime, JSON
from datetime import datetime
from app.database.db import Base


class WorkflowSimulation(Base):
    __tablename__ = "workflow_simulations"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    layer = Column(String)
    sla = Column(String)
    on_call_type = Column(String)
    coverage = Column(String)
    frequency_days = Column(Integer)
    daily_execution_count = Column(Integer)
    process_complexity = Column(String)
    validation_complexity = Column(String)
    workflow_quantity = Column(Integer)
    assertividade = Column(Float)

    custo_total = Column(Float)
    payload = Column(JSON)
