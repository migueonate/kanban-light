import { apiFetch } from "@/shared/utils/fetcher";
import { CardType, ColumnId, CreateCardType } from "../types";

export const listCards = () => apiFetch<CardType[]>("/api/cards");

export const createCard = (input: CreateCardType) =>
  apiFetch<CardType>("/api/cards", {
    method: "POST",
    body: JSON.stringify(input),
  });

export const updateCardColumn = (id: string, columnId: ColumnId) =>
  apiFetch<CardType>(`/api/cards/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ columnId }),
  });

export const updateCardFields = (id: string, data: Partial<CardType>) =>
  apiFetch<CardType>(`/api/cards/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteCard = (id: string) =>
  apiFetch<{ ok: true }>(`/api/cards/${id}`, { method: "DELETE" });
