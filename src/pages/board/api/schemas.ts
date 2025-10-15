import { z } from "zod";
import { ColumnId, Priority } from "../types";

export const Card = z.object({
  id: z.string(),
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  columnId: z.enum(Object.values(ColumnId)),
  createdAt: z.string(),
  priority: z.enum(Object.values(Priority)),
});

export const CreateCard = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  columnId: z.enum(Object.values(ColumnId)),
  priority: z.enum(Object.values(Priority)),
});
