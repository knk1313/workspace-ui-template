import { FileText } from "lucide-react";
import Card from "@/components/Card";
import Checkbox from "@/components/Checkbox";
import StatusBadge from "@/components/StatusBadge";
import { DOCUMENT_TYPE_LABELS, type SampleDocument } from "@/data/sample";
import { useDisplaySettings } from "@/context/DisplaySettings";
import DocumentRowMenu from "./DocumentRowMenu";
import type { DocumentActions, DocumentSelection } from "./useDocumentsPage";

type Props = { docs: SampleDocument[]; selection: DocumentSelection; actions: DocumentActions };

// md 未満の表示。1 件を 1 枚のカードにし、属性を縦に並べる。
export default function DocumentMobileList({ docs, selection, actions }: Props) {
    const { formatDateTime } = useDisplaySettings();
    return (
        <ul className="flex flex-col gap-3 md:hidden">
            {docs.map((d) => {
                const selected = selection.isSelected(d.id);
                return (
                    <li key={d.id}>
                        <Card className={`p-4 transition-colors ${selected ? "border-brand/30! bg-nav-active/40!" : ""}`}>
                            <div className="flex items-center gap-3">
                                <Checkbox checked={selected} onChange={() => selection.toggle(d.id)} label={`${d.title} を選択`} />
                                <button
                                    type="button"
                                    onClick={() => actions.preview(d)}
                                    className="flex min-w-0 flex-1 items-center gap-2 text-left font-medium text-ink hover:text-brand"
                                >
                                    <FileText className="h-4 w-4 shrink-0 text-muted" />
                                    <span className="truncate">{d.title}</span>
                                </button>
                                <div className="-mr-2">
                                    <DocumentRowMenu doc={d} actions={actions} />
                                </div>
                            </div>
                            <dl className="mt-3 grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-2 pl-8 text-sm">
                                <dt className="text-muted">種類</dt>
                                <dd className="text-ink">{DOCUMENT_TYPE_LABELS[d.type]}</dd>
                                <dt className="text-muted">作成者</dt>
                                <dd className="truncate text-muted">{d.owner}</dd>
                                <dt className="text-muted">更新</dt>
                                <dd className="text-muted tabular-nums">{formatDateTime(d.updatedAt)}</dd>
                                <dt className="text-muted">状態</dt>
                                <dd>
                                    <StatusBadge status={d.status} />
                                </dd>
                            </dl>
                        </Card>
                    </li>
                );
            })}
        </ul>
    );
}
