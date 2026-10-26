import { FileText } from "lucide-react";
import Card from "@/components/Card";
import Checkbox from "@/components/Checkbox";
import StatusBadge from "@/components/StatusBadge";
import { DOCUMENT_TYPE_LABELS, type SampleDocument } from "@/data/sample";
import { useDisplaySettings } from "@/context/DisplaySettings";
import DocumentRowMenu from "./DocumentRowMenu";
import type { DocumentActions, DocumentSelection } from "./useDocumentsPage";

type Props = { docs: SampleDocument[]; selection: DocumentSelection; actions: DocumentActions };

// md 以上の表示。狭いときは表の中だけで横スクロールする。
export default function DocumentTable({ docs, selection, actions }: Props) {
    const { formatDateTime } = useDisplaySettings();
    return (
        <Card className="hidden overflow-hidden md:block">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="whitespace-nowrap border-b border-hairline text-xs text-muted">
                        <tr>
                            <th className="w-12 py-3 pl-4">
                                <Checkbox
                                    checked={selection.allVisibleSelected}
                                    onChange={selection.toggleAllVisible}
                                    label={selection.allVisibleSelected ? "すべての選択を解除" : "すべて選択"}
                                />
                            </th>
                            <th className="py-3 pr-4 font-medium">タイトル</th>
                            <th className="py-3 pr-4 font-medium">種類</th>
                            <th className="py-3 pr-4 font-medium">状態</th>
                            <th className="py-3 pr-4 font-medium">作成者</th>
                            <th className="py-3 pr-4 font-medium">更新日時</th>
                            <th className="w-12 py-3 pr-4" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline">
                        {docs.map((d) => {
                            const selected = selection.isSelected(d.id);
                            return (
                                <tr key={d.id} className={`transition-colors ${selected ? "bg-nav-active/40" : "hover:bg-surface-2/60"}`}>
                                    <td className="py-3 pl-4">
                                        <Checkbox checked={selected} onChange={() => selection.toggle(d.id)} label={`${d.title} を選択`} />
                                    </td>
                                    <td className="py-3 pr-4">
                                        <button
                                            type="button"
                                            onClick={() => actions.preview(d)}
                                            className="flex min-w-48 items-center gap-2.5 text-left font-medium text-ink hover:text-brand"
                                        >
                                            <FileText className="h-4 w-4 shrink-0 text-faint" />
                                            {d.title}
                                        </button>
                                    </td>
                                    <td className="whitespace-nowrap py-3 pr-4 text-muted">{DOCUMENT_TYPE_LABELS[d.type]}</td>
                                    <td className="py-3 pr-4">
                                        <StatusBadge status={d.status} />
                                    </td>
                                    <td className="whitespace-nowrap py-3 pr-4 text-muted">{d.owner}</td>
                                    <td className="whitespace-nowrap py-3 pr-4 text-muted tabular-nums">{formatDateTime(d.updatedAt)}</td>
                                    <td className="py-3 pr-4">
                                        <DocumentRowMenu doc={d} actions={actions} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
