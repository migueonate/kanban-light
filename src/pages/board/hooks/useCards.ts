import { useQuery } from "@tanstack/react-query";
import { listCards } from "../api/client";
import { CARDS_QUERY_KEY } from "./constants";
import { CardType } from "../types";

export function useCards() {
  return useQuery<CardType[]>({
    queryKey: [CARDS_QUERY_KEY],
    queryFn: listCards,
    initialData: [],
  });
}
