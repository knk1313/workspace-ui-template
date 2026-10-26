import { Trash2, X } from "lucide-react";
import IconButton from "@/components/IconButton";

type Props = { count: number; onDelete: () => void; onClear: () => void };

// 選択時の一括操作バー（下部中央のダーク面）。count は「選択中かつ表示中」の件数を渡す。
export default function DocumentSelectionBar({ count, onDelete, onClear }: Props) {
    if (count === 0) return null;
    return (
        <div className="fixed bottom-6 left-1/2 z-40 flex w-max -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-full bg-dark-surface py-2 pl-5 pr-2 text-sm text-on-dark shadow-bar">
            <span className="tabular-nums">{count} 件選択中</span>
            <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-on-dark-danger transition-colors hover:bg-on-dark/10"
            >
                <Trash2 className="h-4 w-4" />
                削除
            </button>
            <IconButton size="sm" onClick={onClear} aria-label="選択を解除" className="text-on-dark/70 hover:bg-on-dark/10 hover:text-on-dark">
                <X className="h-4 w-4" />
            </IconButton>
        </div>
    );
}
