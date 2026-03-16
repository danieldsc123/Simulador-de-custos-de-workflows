"""
Configurações fictícias usadas apenas para simulação.
Os valores não representam modelos de nenhuma empresa.
"""

COST_FACTORS = {
    "layer": {
        "plataforma": 50.0,
        "produto": 70.0,
        "ModelosAA": 90.0,
    },

    "sla": {
        "8h": 1.0,
        "6h": 1.3,
        "4h": 1.6,
        "2h": 2.0,
    },

    "onCall": {
        "Com plantão": 0.5,
        "Sem plantão": 0.0,
    },

    "processComplexity": {
        "Baixa": 0.0,
        "Média": 0.2,
        "Alta": 0.4,
    },

    "validationComplexity": {
        "Sem validação": 0.0,
        "Baixa": 0.2,
        "Média": 0.4,
        "Alta": 0.7,
    },

    "coverage": {
        "8 x 5": 0.0,
        "5 x 12": 0.8,
    },
}

TICKET_COST = 100.0

FREQ_EXTRA_EXECUTION_FACTOR = 0.015