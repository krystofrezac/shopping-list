import { ReactNode } from "react";
import { Dialog, DialogActions, DialogBody, DialogTitle } from "./Dialog";
import { Button, ButtonVariant } from "./Button";

export type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description: ReactNode;
  confirmText: string;
  confirmVariant?: ButtonVariant;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const ConfirmDialog = ({
  isOpen,
  title,
  description,
  confirmText,
  confirmVariant = "error",
  isLoading,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) => (
  <Dialog isOpen={isOpen}>
    <DialogTitle>{title}</DialogTitle>
    <DialogBody>
      <p>{description}</p>
    </DialogBody>
    <DialogActions>
      <Button isLoading={isLoading} onClick={onCancel}>
        Cancel
      </Button>
      <Button
        variant={confirmVariant}
        isLoading={isLoading}
        onClick={onConfirm}
      >
        {confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);
