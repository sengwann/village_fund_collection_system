"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deactivateVillageAction } from "../actions/deactivate-village.action";
import { LifecycleSubmitButton } from "./lifecycle-submit-button";

/*
 * Confirmation step for the final "Deactivate" action. Uses the native
 * <dialog> element (focus trap, Escape to close, inert background), the same
 * technique as the mobile menu. The form still posts the same villageId to the
 * same server action. Cancel is auto-focused so Enter does not confirm by
 * accident. All text arrives already translated.
 */
export function DeactivateVillageDialog({
  villageId,
  labels,
}: {
  villageId: string;
  labels: {
    trigger: string;
    title: string;
    body: string;
    confirm: string;
    cancel: string;
  };
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  function openDialog() {
    dialogRef.current?.showModal();
    setOpen(true);
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <>
      <Button
        aria-haspopup="dialog"
        className="w-full border-danger-border text-danger-strong hover:bg-danger-soft active:bg-danger-soft"
        onClick={openDialog}
        type="button"
        variant="outline"
      >
        {labels.trigger}
      </Button>

      <dialog
        aria-labelledby={titleId}
        className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[88dvh] w-full max-w-none overflow-y-auto rounded-t-2xl border bg-card p-0 text-card-foreground shadow-md backdrop:bg-black/50 md:inset-0 md:m-auto md:h-fit md:max-w-md md:rounded-2xl"
        onClick={(event) => {
          // A click on the backdrop lands on the <dialog> element itself.
          if (event.target === event.currentTarget) closeDialog();
        }}
        onClose={() => setOpen(false)}
        ref={dialogRef}
      >
        <form
          action={deactivateVillageAction}
          className="space-y-5 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6"
        >
          <input name="villageId" type="hidden" value={villageId} />

          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger-strong"
            >
              <AlertTriangle className="size-5" />
            </span>
            <div className="min-w-0 space-y-1.5">
              <h2 className="text-base font-semibold leading-snug" id={titleId}>
                {labels.title}
              </h2>
              <p className="text-sm text-muted-foreground [overflow-wrap:anywhere]">
                {labels.body}
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              autoFocus
              onClick={closeDialog}
              type="button"
              variant="outline"
            >
              {labels.cancel}
            </Button>
            <LifecycleSubmitButton variant="destructive">
              {labels.confirm}
            </LifecycleSubmitButton>
          </div>
        </form>
      </dialog>
    </>
  );
}
