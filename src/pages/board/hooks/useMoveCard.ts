import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCardColumn } from "../api/client";
import { CardType, ColumnId } from "../types";
import { CARDS_QUERY_KEY } from "./constants";

export function useMoveCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, columnId }: { id: string; columnId: ColumnId }) =>
      updateCardColumn(id, columnId),

    onMutate: async ({ id, columnId }) => {
      await queryClient.cancelQueries({ queryKey: [CARDS_QUERY_KEY] });
      const prev =
        queryClient.getQueryData<CardType[]>([CARDS_QUERY_KEY]) ?? [];

      // mueve la tarjeta en cache
      const next = prev.map((c) => (c.id === id ? { ...c, columnId } : c));
      queryClient.setQueryData<CardType[]>([CARDS_QUERY_KEY], next);

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData([CARDS_QUERY_KEY], ctx.prev);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [CARDS_QUERY_KEY] });
    },
  });
}
