from pydantic import BaseModel
from enum import Enum

class EventType(str, Enum):
    IN = "IN"
    OUT = "OUT"

class FingerprintEvent(BaseModel):
    employee_wid: str    # Workday Worker ID
    timestamp: str       # ISO-8601 datetime, e.g. "2025-06-16T08:15:00Z"
    event_type: EventType