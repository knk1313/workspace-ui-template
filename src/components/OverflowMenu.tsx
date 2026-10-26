import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";
import IconButton from "./IconButton";

export type OverflowMenuItem = {
    label: string;
    icon: ReactNode;
    onClick: () => void;
    disabled?: boolean;
    /** 削除・破棄など取り消せない操作。赤系カラー＋他項目との間隔をあける。 */
    danger?: boolean;
};

type Props = { items: OverflowMenuItem[]; disabled?: boolean; ariaLabel?: string };

// 「…」アイコンで開く簡易オーバーフローメニュー（外側クリック / Esc で閉じる）。
// パターンは UserMenu と同じ。danger 項目は他の項目と区切り線で分ける。
export default function OverflowMenu({ items, disabled, ariaLabel = "その他の操作" }: Props) {
    const [open, setOpen] = useState(false);
    // 画面下端に近いトリガーだとメニューが見切れるので、その場合だけ上向きに開く。
    const [dropUp, setDropUp] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!open) return;
        const trigger = ref.current?.getBoundingClientRect();
        const menuHeight = menuRef.current?.offsetHeight ?? 0;
        if (!trigger) return;
        const GAP = 4;
        const overflowsBelow = trigger.bottom + GAP + menuHeight > window.innerHeight;
        const fitsAbove = trigger.top - GAP - menuHeight > 0;
        setDropUp(overflowsBelow && fitsAbove);
    }, [open, items.length]);

    useEffect(() => {
        if (!open) return;
        function onDown(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const normalItems = items.filter((i) => !i.danger);
    const dangerItems = items.filter((i) => i.danger);

    return (
        <div ref={ref} className="relative">
            <IconButton
                disabled={disabled}
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label={ariaLabel}
                title={ariaLabel}
            >
                <MoreHorizontal className="h-4 w-4" />
            </IconButton>

            {open && (
                <div
                    ref={menuRef}
                    role="menu"
                    className={`absolute right-0 z-20 w-44 overflow-hidden rounded-surface bg-surface py-1 shadow-panel ring-1 ring-hairline ${
                        dropUp ? "bottom-full mb-1" : "top-full mt-1"
                    }`}
                >
                    {normalItems.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            role="menuitem"
                            disabled={item.disabled}
                            onClick={() => {
                                setOpen(false);
                                item.onClick();
                            }}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-ink transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                    {normalItems.length > 0 && dangerItems.length > 0 && <div className="my-1 h-px bg-hairline" />}
                    {dangerItems.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            role="menuitem"
                            disabled={item.disabled}
                            onClick={() => {
                                setOpen(false);
                                item.onClick();
                            }}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-danger transition-colors hover:bg-danger-surface disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
