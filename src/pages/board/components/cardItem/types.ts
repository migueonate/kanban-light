import { CardType } from "../../types";

export type CardItemProps = { card: CardType };

export const Fields = {
  TITLE: "title",
  DESCRIPTION: "description",
  PRIORITY: "priority",
};

export type FieldKey = (typeof Fields)[keyof typeof Fields];
