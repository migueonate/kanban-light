"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CardDialog from "./components/formModal";

export default function CreateCardDialog() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        New Task
      </Button>
      <CardDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
