"use client";
import { useDroppable } from "@dnd-kit/core";
import { ColumnProps } from "./types";

function Column({ id, children }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`space-y-2 min-h-[120px] p-0.5 rounded-md transition ${
        isOver ? "bg-muted" : ""
      }`}
    >
      {children}
    </div>
  );
}

export default Column;
