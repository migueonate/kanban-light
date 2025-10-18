import { CardType, ColumnId, Priority } from "@/pages/board/types";
import { http, HttpResponse, delay } from "msw";
import { v4 as uuid } from "uuid";

// Ejemplo de estado en memoria:
let cards = [
  {
    id: uuid(),
    title: "Configurar proyecto",
    description: "Proyecto React + Next",
    columnId: ColumnId.BACKLOG,
    createdAt: new Date().toISOString(),
    priority: Priority.HIGH,
  },
  {
    id: uuid(),
    title: "Diseñar UI",
    description: "Boceto + tokens",
    columnId: ColumnId.IN_PROGRESS,
    createdAt: new Date().toISOString(),
    priority: Priority.MEDIUM,
  },
  {
    id: uuid(),
    title: "Docs README",
    description: "Instrucciones de setup",
    columnId: ColumnId.DONE,
    createdAt: new Date().toISOString(),
    priority: Priority.LOW,
  },
];

export const handlers = [
  http.get("/api/cards", async () => {
    await delay(200);
    return HttpResponse.json(cards);
  }),

  http.post("/api/cards", async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as {
      title: string;
      description?: string;
      columnId: ColumnId;
      priority: Priority;
    };
    const newCard = {
      id: uuid(),
      createdAt: new Date().toISOString(),
      description: body.description || "",
      ...body,
    };
    cards = [newCard, ...cards];
    return HttpResponse.json(newCard, { status: 201 });
  }),

  http.patch("/api/cards/:id", async ({ params, request }) => {
    await delay(150);
    const { id } = params as { id: string };
    const body = (await request.json()) as Partial<CardType>;

    const idx = cards.findIndex((c) => c.id === id);
    if (idx === -1) return new HttpResponse("Not found", { status: 404 });

    const omitUndefined = <T extends object>(obj: T) =>
      Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== undefined)
      ) as Partial<T>;

    const updated: CardType = {
      ...cards[idx],
      ...omitUndefined(body),
    };

    cards[idx] = updated;

    return HttpResponse.json(updated);
  }),

  http.delete("/api/cards/:id", async ({ params }) => {
    await delay(120);
    const { id } = params as { id: string };
    const before = cards.length;
    cards = cards.filter((c) => c.id !== id);
    if (cards.length === before)
      return new HttpResponse("Not found", { status: 404 });
    return HttpResponse.json({ ok: true });
  }),
];
