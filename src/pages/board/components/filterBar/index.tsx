"use client";
import { useFiltersStore } from "@/shared/store/filters/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Priority } from "../../types";

function FiltersBar() {
  const { search, setSearch, priority, setPriority, reset } = useFiltersStore();

  return (
    <div className="flex flex-wrap gap-6">
      <div className="grid gap-1">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Name or Description"
          className="w-[240px] sm:w-[300px]"
        />
      </div>

      <div className="grid gap-1">
        <Label>Priority</Label>
        <Select
          value={priority}
          onValueChange={(value) => {
            if (Object.values(Priority).includes(value as Priority)) {
              setPriority(value as Priority);
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Priority.ALL}>All</SelectItem>
            <SelectItem value={Priority.LOW}>Low</SelectItem>
            <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
            <SelectItem value={Priority.HIGH}>High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5">
        <Button variant="outline" onClick={reset}>
          Reset filters
        </Button>
      </div>
    </div>
  );
}

export default FiltersBar;
