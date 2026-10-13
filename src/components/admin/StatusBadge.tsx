import type { EnquiryStatus } from "@/lib/server/store";

export const STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  read: "Read",
  replied: "Replied",
  archived: "Archived",
};

export function StatusBadge({ status }: { status: EnquiryStatus }) {
  return <span className={`adm-badge is-${status}`}>{STATUS_LABELS[status]}</span>;
}
