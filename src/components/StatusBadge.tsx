const STATUS_STYLES = {
    draft: {
        label: "下書き",
        className: "bg-status-neutral-surface text-status-neutral-ink",
    },
    pending: {
        label: "レビュー待ち",
        className: "bg-status-warning-surface text-status-warning-ink",
    },
    processing: {
        label: "処理中",
        className: "bg-status-info-surface text-status-info-ink",
    },
    done: {
        label: "公開済み",
        className: "bg-status-success-surface text-status-success-ink",
    },
    failed: {
        label: "エラー",
        className: "bg-status-danger-surface text-status-danger-ink",
    },
} as const;

export type Status = keyof typeof STATUS_STYLES;

export const STATUS_LABELS: Record<Status, string> = Object.fromEntries(
    Object.entries(STATUS_STYLES).map(([k, v]) => [k, v.label]),
) as Record<Status, string>;

// 状態を意味色で示すバッジ。label を渡すと既定の文言を上書きできる。
export default function StatusBadge({ status, label }: { status: Status; label?: string }) {
    const s = STATUS_STYLES[status];
    return (
        <span className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${s.className}`}>
            {label ?? s.label}
        </span>
    );
}
