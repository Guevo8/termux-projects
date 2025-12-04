from pydantic import BaseModel
from typing import List, Optional, Literal, Dict, Any
from datetime import datetime


class Tier0Foundation(BaseModel):
    canon_statement: Optional[str] = None
    non_canon_rules: Optional[str] = None
    physics_magic_rules: Optional[str] = None
    themes: Optional[str] = None
    tone: Optional[str] = None
    constraints: Optional[str] = None


class Tier1Core(BaseModel):
    logline: Optional[str] = None
    setting_summary: Optional[str] = None
    core_conflict: Optional[str] = None
    signature_elements: Optional[str] = None
    protagonist_factions: Optional[str] = None
    antagonistic_forces: Optional[str] = None


class Tier2Module(BaseModel):
    id: str
    name: str
    category: Optional[str] = None
    summary: Optional[str] = None
    importance: Optional[int] = None


class Tier3Character(BaseModel):
    id: str
    name: str
    role: Optional[str] = None
    race_profile: Optional[str] = None
    goals: Optional[str] = None
    flaws: Optional[str] = None
    relationships: Optional[str] = None


class Tier4Zone(BaseModel):
    id: str
    name: str
    type: Optional[str] = None
    summary: Optional[str] = None
    sensory_notes: Optional[str] = None
    key_conflicts: Optional[str] = None


class Tier5Narrative(BaseModel):
    id: str
    title: str
    kind: Optional[str] = None
    premise: Optional[str] = None
    beats: Optional[str] = None
    outcome: Optional[str] = None


class Tiers(BaseModel):
    T0_foundation: Tier0Foundation
    T1_core: Tier1Core
    T2_modules: List[Tier2Module] = []
    T3_characters: List[Tier3Character] = []
    T4_zones: List[Tier4Zone] = []
    T5_narrative: List[Tier5Narrative] = []


class Project(BaseModel):
    id: str
    name: str
    type: Literal["novel", "game", "ttrpg", "screenplay", "other"] = "other"
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    tags: List[str] = []
    tiers: Tiers
