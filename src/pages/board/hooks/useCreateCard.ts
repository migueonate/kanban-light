import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCard } from "../api/client";
import { CARDS_QUERY_KEY } from "./constants";
import { CardType, CreateCardType } from "../types";

export function useCreateCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCard,
    onMutate: async (input: CreateCardType) => {
      await queryClient.cancelQueries({ queryKey: [CARDS_QUERY_KEY] });
      const prev =
        queryClient.getQueryData<CardType[]>([CARDS_QUERY_KEY]) ?? [];
      const newData: CardType = {
        id: "tmp-" + Date.now(),
        createdAt: new Date().toISOString(),
        ...input,
      };
      queryClient.setQueryData<CardType[]>(
        [CARDS_QUERY_KEY],
        [newData, ...prev]
      );
      return { prev };
    },
    onError: (_err, _input, ctx) => {
      if (ctx?.prev)
        queryClient.setQueryData<CardType[]>([CARDS_QUERY_KEY], ctx.prev);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: [CARDS_QUERY_KEY] }),
  });
}
