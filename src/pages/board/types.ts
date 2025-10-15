import z from "zod";
import { Card, CreateCard } from "./api/schemas";

export enum ColumnId {
  BACKLOG = "backlog",
  IN_PROGRESS = "inprogress",
  DONE = "done",
}

export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  ALL = "all",
}

export type ColumnIdType = typeof ColumnId;
export type PriorityType = typeof Priority;

export type CardType = z.infer<typeof Card>;
export type CreateCardType = z.infer<typeof CreateCard>;
