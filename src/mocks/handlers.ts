import { ColumnId, Priority } from "@/pages/board/types";
import { http, HttpResponse, delay } from "msw";
import { v4 as uuid } from "uuid";

// Ejemplo de estado en memoria:
let cards = [
  {
    id: "1",
    title: "Configurar proyecto",
    description: "Proyecto React + Next",
    columnId: ColumnId.BACKLOG,
    createdAt: new Date().toISOString(),
    priority: "high",
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
    await delay(300);
    const { id } = params as { id: string };
    const { columnId } = (await request.json()) as { columnId: ColumnId };

    const idx = cards.findIndex((c) => c.id === id);
    if (idx === -1) return new HttpResponse("Not found", { status: 404 });

    cards[idx] = { ...cards[idx], columnId };
    return HttpResponse.json(cards[idx]);
  }),
];
