export enum ActionType {
  Mitigation = "Mitigation",
  Adaptation = "Adaptation",
  CrossCutting = "Cross-cutting",
  Transparency = "Transparency",
  Other = "Other",
}

export enum ActionStatus {
  Planned = "Planned",
  Adopted = "Adopted",
  Implemented = "Implemented",
}

export enum ActionSector {
  Energy = "Energy",
  Transport = "Transport",
  IndustryIPPU = "Industry (IPPU)",
  Agriculture = "Agriculture",
  Forestry = "Forestry",
  WaterAndSanitation = "Water and Sanitation",
  LandUse = "Land Use",
  CrossCutting = "Cross-cutting",
  Other = "Other",
}

export enum ActionInstrument {
  Policy = "Policy",
  Regulatory = "Regulatory",
  Economic = "Economic",
  Other = "Other",
}

export enum ActionNationalAnchor {
  NDC = "NDC",
  NAP = "NAP",
  NDP = "NDP",
  Other = "Other",
}

export interface Action {
  id: number;
  refId: string;
  type: ActionType;
  title: string;
  description: string;
  objectives: string;
  instrumentTypes?: ActionInstrument[];
  status: ActionStatus;
  sectorAffected: ActionSector;
  startYear: number;
  nationalAnchors?: ActionNationalAnchor[];
  documents?: any[];
  remarks?: string;
  createdTime: number;
  updatedTime: number;
  createdBy?: number;
  updatedBy?: number;
  version: number;
}

export interface CreateActionRequest {
  type: ActionType;
  title: string;
  description: string;
  objectives: string;
  instrumentTypes?: ActionInstrument[];
  status?: ActionStatus;
  sectorAffected: ActionSector;
  startYear: number;
  nationalAnchors?: ActionNationalAnchor[];
  documents?: any[];
  remarks?: string;
  createdBy?: number;
}

export interface UpdateActionRequest {
  type?: ActionType;
  title?: string;
  description?: string;
  objectives?: string;
  instrumentTypes?: ActionInstrument[];
  status?: ActionStatus;
  sectorAffected?: ActionSector;
  startYear?: number;
  nationalAnchors?: ActionNationalAnchor[];
  documents?: any[];
  remarks?: string;
  updatedBy?: number;
}
