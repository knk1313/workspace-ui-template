import Card from "@/components/Card";
import Modal from "@/components/Modal";
import StatusBadge from "@/components/StatusBadge";
import { DOCUMENT_TYPE_LABELS, type SampleDocument } from "@/data/sample";
import { useDisplaySettings } from "@/context/DisplaySettings";

// 1 件のプレビュー。メモがあれば本文欄に表示する。
export default function DocumentPreview({ doc, onClose }: { doc: SampleDocument; onClose: () => void }) {
    const { formatDateTime } = useDisplaySettings();
    return (
        <Modal label={doc.title} onClose={onClose}>
            <Card className="w-full max-w-lg p-6 shadow-panel">
                <div className="flex items-start justify-between gap-4">
                    <h2 className="text-lg font-medium text-ink">{doc.title}</h2>
                    <StatusBadge status={doc.status} />
                </div>
                <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                    <dt className="text-muted">種類</dt>
                    <dd className="text-ink">{DOCUMENT_TYPE_LABELS[doc.type]}</dd>
                    <dt className="text-muted">作成者</dt>
                    <dd className="text-ink">{doc.owner}</dd>
                    <dt className="text-muted">更新日時</dt>
                    <dd className="text-ink tabular-nums">{formatDateTime(doc.updatedAt)}</dd>
                </dl>
                <p className="mt-4 whitespace-pre-wrap rounded-control bg-surface-2 p-4 text-sm leading-relaxed text-muted">
                    {doc.memo ?? "ここにドキュメントの本文が入ります。このテンプレートではサンプルの説明文のみを表示しています。"}
                </p>
            </Card>
        </Modal>
    );
}
