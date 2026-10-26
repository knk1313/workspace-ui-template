import { Copy, Eye, Pencil, Trash2 } from "lucide-react";
import OverflowMenu from "@/components/OverflowMenu";
import type { SampleDocument } from "@/data/sample";
import type { DocumentActions } from "./useDocumentsPage";

// 1 行ぶんの「…」メニュー。表とモバイルのカードで共有する。
export default function DocumentRowMenu({ doc, actions }: { doc: SampleDocument; actions: DocumentActions }) {
    return (
        <OverflowMenu
            items={[
                { label: "プレビュー", icon: <Eye className="h-4 w-4" />, onClick: () => actions.preview(doc) },
                { label: "編集", icon: <Pencil className="h-4 w-4" />, onClick: () => actions.edit(doc) },
                { label: "複製", icon: <Copy className="h-4 w-4" />, onClick: () => actions.duplicate(doc) },
                { label: "削除", icon: <Trash2 className="h-4 w-4" />, onClick: () => actions.remove([doc.id]), danger: true },
            ]}
        />
    );
}
