import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CardType, ColumnId, CreateCardType } from "../types";
import { CARDS_QUERY_KEY } from "./constants";
import {
  createCard,
  deleteCard,
  listCards,
  updateCardColumn,
  updateCardFields,
} from "../api/client";

export function useCards() {
  return useQuery<CardType[]>({
    queryKey: [CARDS_QUERY_KEY],
    queryFn: listCards,
    initialData: [],
    refetchOnWindowFocus: false,
  });
}

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

export function useDeleteCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCard(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [CARDS_QUERY_KEY] });
      const previous =
        queryClient.getQueryData<CardType[]>([CARDS_QUERY_KEY]) ?? [];

      queryClient.setQueryData<CardType[]>(
        [CARDS_QUERY_KEY],
        previous.filter((c) => c.id !== id)
      );
      return { previous };
    },

    onError: (_error, _vars, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData([CARDS_QUERY_KEY], ctx.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [CARDS_QUERY_KEY] });
    },
  });
}

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

export function useUpdateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CardType> }) =>
      updateCardFields(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [CARDS_QUERY_KEY] });
      const previous =
        queryClient.getQueryData<CardType[]>([CARDS_QUERY_KEY]) ?? [];

      const next = previous.map((card) =>
        card.id === id ? { ...card, ...data } : card
      );

      queryClient.setQueryData<CardType[]>([CARDS_QUERY_KEY], next);
      return { previous };
    },

    onError: (_error, _vars, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData([CARDS_QUERY_KEY], ctx.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [CARDS_QUERY_KEY] });
    },
  });
}
