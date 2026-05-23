"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  archiveManifestation,
  deleteManifestation,
  type ManifestationLifecycleState,
} from "@/app/actions/manifestation-lifecycle";
import { CloseManifestationControl } from "@/app/components/CloseManifestationControl";
import {
  hasOtherHolders,
  isManifestationArchivable,
  isManifestationDeletable,
  isManifestationEditable,
  isManifestationClosable,
} from "@/lib/manifestations/lifecycle";
import {
  MANIFEST_ARCHIVE_CONFIRM,
  MANIFEST_ARCHIVE_CTA,
  MANIFEST_ARCHIVE_PENDING,
  MANIFEST_DELETE_BLOCKED,
  MANIFEST_DELETE_CONFIRM,
  MANIFEST_DELETE_CTA,
  MANIFEST_DELETE_PENDING,
  MANIFEST_EDIT_LINK,
  MANIFEST_MANAGE_HEADING,
  MANIFEST_REMOVE_HEADING,
} from "@/lib/manifestations/intention-copy";
import type { ManifestationStatus } from "@/lib/types/manifestation";

const initialState: ManifestationLifecycleState = {};

type CreatorManifestationActionsProps = {
  manifestationId: string;
  status: ManifestationStatus;
  joinCount: number;
  endsAt?: string;
  showEditLink?: boolean;
  showClose?: boolean;
  closeVariant?: "detail" | "compact";
};

export function CreatorManifestationActions({
  manifestationId,
  status,
  joinCount,
  endsAt,
  showEditLink = false,
  showClose = false,
  closeVariant = "compact",
}: CreatorManifestationActionsProps) {
  const router = useRouter();
  const [archiveState, archiveAction, archivePending] = useActionState(
    archiveManifestation,
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteManifestation,
    initialState,
  );
  const [showArchive, setShowArchive] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const manifestation = { status, join_count: joinCount };
  const canEdit =
    showEditLink && isManifestationEditable(manifestation);
  const canClose =
    showClose && endsAt && isManifestationClosable(manifestation);
  const canArchive = isManifestationArchivable(manifestation);
  const canDelete = isManifestationDeletable(manifestation);
  const deleteBlocked = hasOtherHolders(joinCount) && status !== "deleted";
  const showRemoveSection =
    canArchive || canDelete || deleteBlocked;

  useEffect(() => {
    if (archiveState?.success) {
      setShowArchive(false);
      router.refresh();
    }
  }, [archiveState?.success, router]);

  if (!canEdit && !canClose && !showRemoveSection) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 border-t border-stone-100 pt-3 dark:border-stone-700/80">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
        {MANIFEST_MANAGE_HEADING}
      </p>

      {canEdit ? (
        <Link
          href={`/manifestations/${manifestationId}/edit`}
          className="w-fit text-sm font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-300"
        >
          {MANIFEST_EDIT_LINK}
        </Link>
      ) : null}

      {canClose ? (
        <CloseManifestationControl
          manifestationId={manifestationId}
          endsAt={endsAt}
          variant={closeVariant}
        />
      ) : null}

      {showRemoveSection ? (
        <div className="flex flex-col gap-3 border-t border-stone-100 pt-3 dark:border-stone-700/80">
          <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
            {MANIFEST_REMOVE_HEADING}
          </p>

          {archiveState?.error ? (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100"
            >
              {archiveState.error}
            </p>
          ) : null}

          {archiveState?.success ? (
            <p className="text-xs text-emerald-800 dark:text-emerald-200">
              {archiveState.success}
            </p>
          ) : null}

          {deleteState?.error ? (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100"
            >
              {deleteState.error}
            </p>
          ) : null}

          {canArchive && !archiveState?.success ? (
            showArchive ? (
              <form action={archiveAction} className="flex flex-col gap-2">
                <input type="hidden" name="manifestation_id" value={manifestationId} />
                <label className="flex cursor-pointer items-start gap-2 text-xs text-stone-700 dark:text-stone-200">
                  <input
                    type="checkbox"
                    name="affirm_archive"
                    value="on"
                    required
                    disabled={archivePending}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-stone-300 text-violet-600 focus:ring-violet-500 dark:border-stone-600"
                  />
                  <span>{MANIFEST_ARCHIVE_CONFIRM}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={archivePending}
                    onClick={() => setShowArchive(false)}
                    className="text-xs font-medium text-stone-500 underline-offset-2 hover:underline dark:text-stone-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={archivePending}
                    className="inline-flex h-9 items-center justify-center rounded-full border border-stone-300 bg-white px-4 text-xs font-medium text-stone-700 shadow-sm transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
                  >
                    {archivePending ? MANIFEST_ARCHIVE_PENDING : MANIFEST_ARCHIVE_CTA}
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowArchive(true)}
                className="w-fit text-sm font-medium text-stone-600 underline-offset-2 hover:text-stone-900 hover:underline dark:text-stone-400 dark:hover:text-stone-200"
              >
                {MANIFEST_ARCHIVE_CTA}
              </button>
            )
          ) : null}

          {canDelete ? (
            showDelete ? (
              <form action={deleteAction} className="flex flex-col gap-2">
                <input type="hidden" name="manifestation_id" value={manifestationId} />
                <label className="flex cursor-pointer items-start gap-2 text-xs text-stone-700 dark:text-stone-200">
                  <input
                    type="checkbox"
                    name="affirm_delete"
                    value="on"
                    required
                    disabled={deletePending}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-stone-300 text-violet-600 focus:ring-violet-500 dark:border-stone-600"
                  />
                  <span>{MANIFEST_DELETE_CONFIRM}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={deletePending}
                    onClick={() => setShowDelete(false)}
                    className="text-xs font-medium text-stone-500 underline-offset-2 hover:underline dark:text-stone-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={deletePending}
                    className="inline-flex h-9 items-center justify-center rounded-full border border-red-200 bg-red-50 px-4 text-xs font-medium text-red-900 shadow-sm transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100 dark:hover:bg-red-950/60"
                  >
                    {deletePending ? MANIFEST_DELETE_PENDING : MANIFEST_DELETE_CTA}
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowDelete(true)}
                className="w-fit text-sm font-medium text-red-800 underline-offset-2 hover:underline dark:text-red-300"
              >
                {MANIFEST_DELETE_CTA}
              </button>
            )
          ) : deleteBlocked ? (
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                disabled
                aria-describedby={`delete-blocked-${manifestationId}`}
                className="w-fit cursor-not-allowed text-sm font-medium text-stone-400 dark:text-stone-500"
              >
                {MANIFEST_DELETE_CTA}
              </button>
              <p
                id={`delete-blocked-${manifestationId}`}
                className="text-xs leading-relaxed text-stone-500 dark:text-stone-400"
              >
                {MANIFEST_DELETE_BLOCKED}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
