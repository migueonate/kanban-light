import { CardType } from "../../../../types";

export enum ModeCard {
  CREATE = "create",
  EDIT = "edit",
}

export type CardDialogProps = {
  mode?: ModeCard;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card?: CardType;
};
