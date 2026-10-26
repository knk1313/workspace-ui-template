import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import IconButton from "./IconButton";
import { useModalBehavior } from "@/hooks/useModalBehavior";

// スライドアウト付きのクローズを子（フォーム等の「キャンセル/保存」ボタン）に渡す。
// これを使うと ✕ と同じアニメーションで閉じられる。
const SideDrawerCloseContext = createContext<() => void>(() => {});
export function useSideDrawerClose(): () => void {
    return useContext(SideDrawerCloseContext);
}

type Props = {
    title: ReactNode;
    onClose: () => void;
    children: ReactNode;
    /** パネル幅（Tailwind の max-w-*）。 */
    widthClass?: string;
    /** スクリーンリーダー向けのダイアログ名。 */
    label?: string;
    /** スクロール領域の下に固定表示する帯（一括操作の確定ボタンなど）。 */
    footer?: ReactNode;
};

// 右からスライドインする共通サイドドロワー。✕ / キャンセル / Esc で閉じる（スライドアウト後にアンマウント）。
// 暗幕クリックでは閉じない——入力途中に枠外を押して内容が消える事故があったため、
// 閉じる操作は明示的なものだけにする。
export default function SideDrawer({
    title,
    onClose,
    children,
    widthClass = "max-w-md",
    label = "ダイアログ",
    footer,
}: Props) {
    // マウント後に表示状態へ切り替えてスライドイン。閉じるときは逆再生してからアンマウント。
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const id = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(id);
    }, []);

    function handleClose() {
        setVisible(false);
        setTimeout(onClose, 300);
    }

    const panelRef = useRef<HTMLDivElement>(null);
    // Esc もスライドアウト付きで閉じる。
    useModalBehavior({ onClose: handleClose, containerRef: panelRef });

    return (
        <div
            className={`fixed inset-0 z-50 flex justify-end bg-scrim/40 transition-opacity duration-300 ${
                visible ? "opacity-100" : "opacity-0"
            }`}
            role="dialog"
            aria-modal="true"
            aria-label={label}
        >
            <div
                ref={panelRef}
                className={`flex h-full w-full flex-col rounded-l-surface bg-surface shadow-panel transition-transform duration-300 ${widthClass} ${
                    visible ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
                    <h2 className="text-sm font-semibold text-ink">{title}</h2>
                    <IconButton size="sm" onClick={handleClose} aria-label="閉じる">
                        <X className="h-5 w-5" />
                    </IconButton>
                </div>
                {/* 子の閉じる操作（キャンセル/保存後）も ✕ と同じアニメーションで閉じられるように。 */}
                <SideDrawerCloseContext.Provider value={handleClose}>
                    <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
                    {/* フッターはスクロール領域の外に置く（sticky だと下端の余白から中身が覗くため）。 */}
                    {footer && <div className="border-t border-hairline px-4 py-3">{footer}</div>}
                </SideDrawerCloseContext.Provider>
            </div>
        </div>
    );
}
