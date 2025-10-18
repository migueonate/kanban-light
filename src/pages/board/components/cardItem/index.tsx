"use client";
import { useMemo, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { Priority } from "../../types";
import { CardItemProps } from "./types";
import { useDeleteCard } from "../../services";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CardDialog from "../createCard/components/formModal";
import { ModeCard } from "../createCard/components/formModal/types";

function CardItem({ card }: CardItemProps) {
  const deleteMutation = useDeleteCard();

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: card.id,
  });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = () => {
    deleteMutation.mutate(card.id, {
      onSuccess: () => setDeleteOpen(false),
    });
  };

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
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={priorityClassBadge}>
            {card.priority}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                ⋮
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {card.description && (
        <p className="text-sm text-muted-foreground mt-1">{card.description}</p>
      )}

      <CardDialog
        mode={ModeCard.EDIT}
        open={editOpen}
        onOpenChange={setEditOpen}
        card={card}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will be deleted.{" "}
              <b>{card.title}</b>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </article>
  );
}

export default CardItem;
