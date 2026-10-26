import { useState, type FormEvent } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import RequiredMark from "@/components/RequiredMark";
import Select from "@/components/Select";
import Textarea from "@/components/Textarea";
import { useSideDrawerClose } from "@/components/SideDrawer";
import type { DocumentType } from "@/data/sample";
import { TYPE_OPTIONS } from "./options";
import type { NewDocument } from "./useDocumentsPage";

// SideDrawer 内の作成フォーム。送信・キャンセルとも useSideDrawerClose でスライドアウトして閉じる。
export default function CreateDocumentForm({ onSubmit }: { onSubmit: (doc: NewDocument) => void }) {
    const close = useSideDrawerClose();
    const [title, setTitle] = useState("");
    const [type, setType] = useState<DocumentType>("note");
    const [memo, setMemo] = useState("");

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit({ title: title.trim(), type, memo: memo.trim() || undefined });
        close();
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
                <label htmlFor="doc-title" className="mb-1.5 block text-sm font-medium text-ink">
                    タイトル
                    <RequiredMark />
                </label>
                <Input id="doc-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例: プロジェクトメモ" required />
            </div>
            <div>
                <label htmlFor="doc-type" className="mb-1.5 block text-sm font-medium text-ink">
                    種類
                </label>
                <Select id="doc-type" block value={type} onChange={(e) => setType(e.target.value as DocumentType)}>
                    {TYPE_OPTIONS.map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </Select>
            </div>
            <div>
                <label htmlFor="doc-memo" className="mb-1.5 block text-sm font-medium text-ink">
                    メモ
                </label>
                <Textarea id="doc-memo" rows={4} value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="任意。プレビューに表示されます" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button variant="text" onClick={close}>
                    キャンセル
                </Button>
                <Button type="submit" disabled={!title.trim()}>
                    作成
                </Button>
            </div>
        </form>
    );
}
