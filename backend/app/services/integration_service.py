"""Integration layer registry — all connectors disabled in v0.3."""

INTEGRATIONS = [
    {"id": "parseh", "name": "Parseh SCADA", "nameFa": "پارسه SCADA", "type": "scada", "enabled": False, "status": "not_connected"},
    {"id": "sap", "name": "SAP ERP", "nameFa": "SAP ERP", "type": "erp", "enabled": False, "status": "not_connected"},
    {"id": "opcua", "name": "OPC-UA Server", "nameFa": "سرور OPC-UA", "type": "opcua", "enabled": False, "status": "not_connected"},
    {"id": "pi", "name": "OSIsoft PI", "nameFa": "OSIsoft PI", "type": "historian", "enabled": False, "status": "not_connected"},
    {"id": "cmms", "name": "CMMS / Maximo", "nameFa": "CMMS / Maximo", "type": "cmms", "enabled": False, "status": "not_connected"},
]


def list_integrations() -> list[dict]:
    return INTEGRATIONS
