"use client";
import { useMemo } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { Priority } from "../../types";
import { CardItemProps } from "./types";

function CardItem({ card }: CardItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: card.id,
  });

  const priorityClassBadge = useMemo(() => {
    if (card.priority === Priority.HIGH) return "border-red-500 text-red-500";
    if (card.priority === Priority.MEDIUM)
      return "border-amber-500 text-amber-500";
    return "border-emerald-500 text-emerald-500";
  }, [card.priority]);

  return (
    <article
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`rounded-lg border p-3 bg-background cursor-grab active:cursor-grabbing ${
        isDragging ? "shadow-lg" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{card.title}</h3>
        <Badge variant="outline" className={priorityClassBadge}>
          {card.priority}
        </Badge>
      </div>
      {card.description && (
        <p className="text-sm text-muted-foreground mt-1">{card.description}</p>
      )}
    </article>
  );
}

export default CardItem;
