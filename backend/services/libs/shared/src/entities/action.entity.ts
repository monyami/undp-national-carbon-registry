import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ActionType } from "../enum/action.type.enum";
import { ActionStatus } from "../enum/action.status.enum";
import { ActionSector } from "../enum/action.sector.enum";
import { ActionInstrument } from "../enum/action.instrument.enum";
import { ActionNationalAnchor } from "../enum/action.anchor.enum";
import { EntitySubject } from "./entity.subject";

@Entity()
export class ActionEntity implements EntitySubject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  refId: string;

  @Column({
    type: "enum",
    enum: ActionType,
    nullable: false,
  })
  type: ActionType;

  @Column()
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "text" })
  objectives: string;

  @Column({
    type: "enum",
    enum: ActionInstrument,
    array: true,
    nullable: true,
    default: [],
  })
  instrumentTypes: ActionInstrument[];

  @Column({
    type: "enum",
    enum: ActionStatus,
    nullable: false,
    default: ActionStatus.Planned,
  })
  status: ActionStatus;

  @Column({
    type: "enum",
    enum: ActionSector,
    nullable: false,
  })
  sectorAffected: ActionSector;

  @Column({ type: "integer" })
  startYear: number;

  @Column({
    type: "enum",
    enum: ActionNationalAnchor,
    array: true,
    nullable: true,
    default: [],
  })
  nationalAnchors: ActionNationalAnchor[];

  @Column({ type: "jsonb", nullable: true, default: [] })
  documents: any[];

  @Column({ nullable: true })
  remarks: string;

  @Column({ type: "bigint" })
  createdTime: number;

  @Column({ type: "bigint" })
  updatedTime: number;

  @Column({ nullable: true })
  createdBy: number;

  @Column({ nullable: true })
  updatedBy: number;

  @Column({ type: "integer", default: 1 })
  version: number;

  @BeforeInsert()
  generateRefId() {
    this.refId = `ACTION-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const timestamp = new Date().getTime();
    this.createdTime = timestamp;
    this.updatedTime = timestamp;
  }

  @BeforeUpdate()
  async timestampAtUpdate() {
    this.updatedTime = new Date().getTime();
    this.version = (this.version || 1) + 1;
  }
}
