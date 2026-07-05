"""Knowledge ingestion pipeline skeleton."""

PIPELINE_STEPS = [
    {"step": "store", "status": "stub", "description": "Store uploaded document"},
    {"step": "ocr", "status": "stub", "description": "OCR text extraction"},
    {"step": "extract", "status": "stub", "description": "Metadata extraction"},
    {"step": "relate", "status": "stub", "description": "Link to equipment/area"},
    {"step": "embed", "status": "stub", "description": "Vector embedding"},
    {"step": "graph", "status": "stub", "description": "Knowledge graph update"},
]


def get_pipeline_status() -> dict:
    return {"version": "0.3.0", "steps": PIPELINE_STEPS, "activeJobs": 0}
