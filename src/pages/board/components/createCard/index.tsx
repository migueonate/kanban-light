"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCard } from "../../api/schemas";
import { useCreateCard } from "../../hooks/useCreateCard";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
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
import { useState } from "react";
import { ColumnId, CreateCardType, Priority } from "../../types";

function NewCardDialog() {
  const [open, setOpen] = useState(false);
  const { mutateAsync } = useCreateCard();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateCardType>({
    resolver: zodResolver(CreateCard),
    defaultValues: { columnId: ColumnId.BACKLOG, priority: Priority.MEDIUM },
  });

  const currentPriority = watch("priority");

  const onSubmit = (data: CreateCardType) => {
    return toast.promise(
      mutateAsync(data).then(() => {
        reset({
          title: "",
          description: "",
          columnId: ColumnId.BACKLOG,
          priority: Priority.MEDIUM,
        });
        setOpen(false);
      }),
      {
        loading: "Creating...",
        success: "Created card",
        error: "Error creating",
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">New Card</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Card</DialogTitle>
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
              defaultValue={ColumnId.BACKLOG}
              onValueChange={(value) => setValue("columnId", value as ColumnId)}
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

          <div className="grid gap-1">
            <Label>Priority</Label>
            <Select
              value={currentPriority}
              onValueChange={(value) => {
                if (Object.values(Priority).includes(value as Priority)) {
                  setValue("priority", value as Priority, {
                    shouldDirty: true,
                  });
                }
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
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NewCardDialog;
