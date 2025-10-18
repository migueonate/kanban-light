"use client";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import { CreateCard } from "@/pages/board/api/schemas";
import { CreateCardType, ColumnId, Priority } from "@/pages/board/types";
import { useCreateCard, useUpdateCard } from "@/pages/board/services";
import { CardDialogProps, ModeCard } from "./types";

export default function CardDialog({
  mode = ModeCard.CREATE,
  onOpenChange,
  open,
  card,
}: CardDialogProps) {
  const isEdit = mode === ModeCard.EDIT;
  const { mutateAsync: createCard } = useCreateCard();
  const { mutateAsync: updateCard } = useUpdateCard();

  const defaultValues = useMemo<CreateCardType>(() => {
    if (isEdit && card) {
      return {
        title: card.title,
        description: card.description ?? "",
        columnId: card.columnId,
        priority: card.priority,
      };
    }

    return {
      title: "",
      description: "",
      columnId: ColumnId.BACKLOG,
      priority: Priority.MEDIUM,
    };
  }, [isEdit, card]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateCardType>({
    resolver: zodResolver(CreateCard),
    defaultValues,
  });

  useEffect(() => {
    if (open) reset(defaultValues);
  }, [open, defaultValues, reset]);

  const currentPriority = watch("priority");
  const currentColumnId = watch("columnId");

  const onSubmit = (data: CreateCardType) => {
    if (!isEdit) {
      return toast.promise(
        createCard(data).then(() => {
          reset(defaultValues);
          onOpenChange(false);
        }),
        {
          loading: "Creating...",
          success: "Created card",
          error: "Error creating",
        }
      );
    }

    return toast.promise(
      updateCard({
        id: card?.id ?? "",
        data: {
          title: data.title,
          description: data.description,
          columnId: data.columnId,
          priority: data.priority,
        },
      }).then(() => {
        onOpenChange(false);
      }),
      { loading: "Saving...", success: "Saved", error: "Error saving" }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Ej: task name"
              {...register("title")}
            />
            {errors.title && (
              <span className="text-sm text-destructive">
                {errors.title.message}
              </span>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Details..."
              {...register("description")}
            />
          </div>

          <div className="grid gap-2">
            <Label>Column</Label>
            <Select
              value={currentColumnId}
              onValueChange={(value) =>
                setValue("columnId", value as ColumnId, { shouldDirty: true })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ColumnId.BACKLOG}>Backlog</SelectItem>
                <SelectItem value={ColumnId.IN_PROGRESS}>
                  In progress
                </SelectItem>
                <SelectItem value={ColumnId.DONE}>Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Priority</Label>
            <Select
              value={currentPriority}
              onValueChange={(value) => {
                setValue("priority", value as Priority, { shouldDirty: true });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Priority.LOW}>Low</SelectItem>
                <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
                <SelectItem value={Priority.HIGH}>High</SelectItem>
              </SelectContent>
            </Select>
            {errors.priority && (
              <p className="text-sm text-destructive">
                {errors.priority.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{isEdit ? "Save" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
