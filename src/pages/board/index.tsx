"use client";
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  closestCorners,
} from "@dnd-kit/core";
import { useEffect, useMemo, useState } from "react";
import { useCards } from "./hooks/useCards";
import { useMoveCard } from "./hooks/useMoveCard";
import {
  Card as UiCard,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import Column from "./components/column";
import CardItem from "./components/cardItem";
import { useFiltersStore } from "@/shared/store/filters/store";
import { CardType, ColumnId, Priority } from "./types";

const COLUMNS: ReadonlyArray<{ id: ColumnId; title: string }> = [
  { id: ColumnId.BACKLOG, title: "Backlog" },
  { id: ColumnId.IN_PROGRESS, title: "In Progress" },
  { id: ColumnId.DONE, title: "Done" },
];

export default function Board() {
  const { data = [] } = useCards();
  const { mutate: moveCardMutation } = useMoveCard();
  const { search, priority } = useFiltersStore();

  const [byCol, setByCol] = useState<Record<ColumnId, CardType[]>>({
    [ColumnId.BACKLOG]: [],
    [ColumnId.IN_PROGRESS]: [],
    [ColumnId.DONE]: [],
  });

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return data.filter((card) => {
      const matchesName =
        !query ||
        card.title.toLowerCase().includes(query) ||
        card.description?.toLowerCase().includes(query);
      const matchesPriority =
        priority === Priority.ALL ? true : card.priority === priority;
      return matchesName && matchesPriority;
    });
  }, [data, search, priority]);

  useEffect(() => {
    const next: Record<ColumnId, CardType[]> = {
      [ColumnId.BACKLOG]: [],
      [ColumnId.IN_PROGRESS]: [],
      [ColumnId.DONE]: [],
    };

    for (const card of filtered) {
      next[card.columnId as ColumnId].push(card);
    }

    // ordena por fecha (más nuevo arriba)
    (Object.keys(next) as Array<keyof typeof next>).forEach((card) => {
      next[card].sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
    });

    setByCol(next);
  }, [filtered]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const cardId = String(active.id);
    const destCol = over.id as ColumnId;

    // encuentra columna origen
    const srcCol = (Object.keys(byCol) as ColumnId[]).find((col) =>
      byCol[col].some((c) => c.id === cardId)
    );
    if (!srcCol || destCol === srcCol) return;

    // Actualiza state
    setByCol((prev) => {
      const sourceList = prev[srcCol].filter((c) => c.id !== cardId);
      const moved = prev[srcCol].find((c) => c.id === cardId)!;
      const targetList = [{ ...moved, columnId: destCol }, ...prev[destCol]];
      return { ...prev, [srcCol]: sourceList, [destCol]: targetList };
    });

    moveCardMutation({ id: cardId, columnId: destCol });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={onDragEnd}
    >
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <UiCard key={col.id} className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-base">{col.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Column id={col.id}>
                {byCol[col.id].length === 0 ? (
                  <p className="text-sm text-muted-foreground">(vacío)</p>
                ) : (
                  byCol[col.id].map((card) => (
                    <CardItem key={card.id} card={card} />
                  ))
                )}
              </Column>
            </CardContent>
          </UiCard>
        ))}
      </section>
    </DndContext>
  );
}
