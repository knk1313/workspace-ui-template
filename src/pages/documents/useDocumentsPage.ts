import { useMemo, useState } from "react";
import type { Status } from "@/components/StatusBadge";
import { useConfirm } from "@/components/ConfirmDialog";
import { useToast } from "@/components/Toast";
import { CURRENT_USER, SAMPLE_DOCUMENTS, type DocumentType, type SampleDocument } from "@/data/sample";

export type NewDocument = Pick<SampleDocument, "title" | "type" | "memo">;

// 行ごとの操作。表とモバイルのカードで同じものを使う。
export type DocumentActions = {
    preview: (doc: SampleDocument) => void;
    edit: (doc: SampleDocument) => void;
    duplicate: (doc: SampleDocument) => void;
    remove: (ids: string[]) => void;
};

export type DocumentSelection = {
    isSelected: (id: string) => boolean;
    toggle: (id: string) => void;
    /** 表示中の行がすべて選択されているか。 */
    allVisibleSelected: boolean;
    toggleAllVisible: () => void;
};

// 画面内で追加するサンプル行の ID・更新日時。
function newMeta(): Pick<SampleDocument, "id" | "updatedAt"> {
    return { id: crypto.randomUUID(), updatedAt: new Date().toISOString() };
}

// ドキュメント画面の状態と操作（検索・絞り込み・選択・作成・複製・削除）。
// 表示（表 / カード）から切り離し、どちらの表示でも同じ振る舞いになるようにする。
export function useDocumentsPage() {
    const { toast } = useToast();
    const { confirm } = useConfirm();
    const [docs, setDocs] = useState<SampleDocument[]>(SAMPLE_DOCUMENTS);
    const [query, setQuery] = useState("");
    const [type, setType] = useState<DocumentType | "">("");
    const [status, setStatus] = useState<Status | "">("");
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [creating, setCreating] = useState(false);
    const [previewing, setPreviewing] = useState<SampleDocument | null>(null);

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        return docs.filter(
            (d) =>
                (!q || d.title.toLowerCase().includes(q) || d.owner.toLowerCase().includes(q)) &&
                (!type || d.type === type) &&
                (!status || d.status === status),
        );
    }, [docs, query, type, status]);

    // 一括操作の対象は「選択中かつ表示中」の行だけにする。
    // 選択後に絞り込んでも、見えていない行が削除対象に含まれないようにするため。
    const selectedVisibleIds = useMemo(() => visible.filter((d) => selected.has(d.id)).map((d) => d.id), [visible, selected]);
    const allVisibleSelected = visible.length > 0 && selectedVisibleIds.length === visible.length;

    function toggle(id: string) {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    function toggleAllVisible() {
        setSelected((prev) => {
            const next = new Set(prev);
            for (const d of visible) {
                if (allVisibleSelected) next.delete(d.id);
                else next.add(d.id);
            }
            return next;
        });
    }

    async function remove(ids: string[]) {
        if (ids.length === 0) return;
        const ok = await confirm({
            title: ids.length === 1 ? "ドキュメントを削除しますか？" : `${ids.length} 件のドキュメントを削除しますか？`,
            message: "この操作は取り消せません（サンプルのため再読み込みで元に戻ります）。",
            confirmLabel: "削除",
            danger: true,
        });
        if (!ok) return;
        setDocs((prev) => prev.filter((d) => !ids.includes(d.id)));
        setSelected((prev) => new Set([...prev].filter((id) => !ids.includes(id))));
        toast(`${ids.length} 件を削除しました`);
    }

    function duplicate(doc: SampleDocument) {
        setDocs((prev) => [
            { ...doc, ...newMeta(), title: `${doc.title}（コピー）`, status: "draft", owner: CURRENT_USER.name },
            ...prev,
        ]);
        toast("複製しました");
    }

    function create(doc: NewDocument) {
        setDocs((prev) => [{ ...doc, ...newMeta(), status: "draft", owner: CURRENT_USER.name }, ...prev]);
        toast("ドキュメントを作成しました");
    }

    function clearFilters() {
        setQuery("");
        setType("");
        setStatus("");
    }

    const actions: DocumentActions = {
        preview: setPreviewing,
        edit: () => toast("サンプルのため編集は無効です"),
        duplicate,
        remove: (ids) => void remove(ids),
    };

    const selection: DocumentSelection = {
        isSelected: (id) => selected.has(id),
        toggle,
        allVisibleSelected,
        toggleAllVisible,
    };

    return {
        visible,
        filters: {
            query,
            setQuery,
            type,
            setType,
            status,
            setStatus,
            clear: clearFilters,
            /** 検索語を含め、何か条件が入っているか（クリアボタンの表示に使う）。 */
            hasAny: query !== "" || type !== "" || status !== "",
            /** 絞り込み中のフィルターの数（検索語は含めない）。 */
            activeCount: (type ? 1 : 0) + (status ? 1 : 0),
        },
        selection,
        selectedVisibleIds,
        clearSelection: () => setSelected(new Set()),
        actions,
        create,
        creating,
        openCreate: () => setCreating(true),
        closeCreate: () => setCreating(false),
        previewing,
        closePreview: () => setPreviewing(null),
    };
}

export type DocumentFilters = ReturnType<typeof useDocumentsPage>["filters"];
