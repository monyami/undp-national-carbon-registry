import { IsEnum, IsNumber, IsString, IsArray, IsOptional } from "class-validator";
import { ActionType } from "../enum/action.type.enum";
import { ActionStatus } from "../enum/action.status.enum";
import { ActionSector } from "../enum/action.sector.enum";
import { ActionInstrument } from "../enum/action.instrument.enum";
import { ActionNationalAnchor } from "../enum/action.anchor.enum";

export class CreateActionDto {
  @IsEnum(ActionType)
  type: ActionType;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  objectives: string;

  @IsArray()
  @IsEnum(ActionInstrument, { each: true })
  @IsOptional()
  instrumentTypes?: ActionInstrument[];

  @IsEnum(ActionStatus)
  @IsOptional()
  status?: ActionStatus;

  @IsEnum(ActionSector)
  sectorAffected: ActionSector;

  @IsNumber()
  startYear: number;

  @IsArray()
  @IsEnum(ActionNationalAnchor, { each: true })
  @IsOptional()
  nationalAnchors?: ActionNationalAnchor[];

  @IsArray()
  @IsOptional()
  documents?: any[];

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsNumber()
  @IsOptional()
  createdBy?: number;
}
