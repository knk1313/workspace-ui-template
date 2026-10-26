import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";

// Tab で移動できる要素。無効化されたものと tabindex="-1" は除く。
const FOCUSABLE = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
].join(", ");

// 開いているダイアログの積み重ね。キー操作はいちばん上のダイアログだけが受け取る。
const stack: symbol[] = [];

type Options = {
    /** 開いているか。マウント中ずっと開いている部品では省略する。 */
    open?: boolean;
    /** Esc で呼ぶ。 */
    onClose: () => void;
    /** フォーカスを閉じ込める範囲。 */
    containerRef: RefObject<HTMLElement | null>;
    /** 開いた直後にフォーカスする要素。省略時は範囲内の最初の操作要素。 */
    initialFocusRef?: RefObject<HTMLElement | null>;
    /** 開いている間 body のスクロールを止める。 */
    lockScroll?: boolean;
};

// モーダル系 UI（Modal / SideDrawer / MobileNav / ConfirmDialog）の共通の振る舞い。
// 開いた直後のフォーカス、Esc で閉じる、Tab のフォーカストラップ、閉じた後のフォーカス復帰、背景スクロールの停止。
export function useModalBehavior({ open = true, onClose, containerRef, initialFocusRef, lockScroll = true }: Options) {
    // onClose は呼び出し側で毎レンダリング作られることがある。effect の依存に入れると
    // 再実行のたびにフォーカスが初期位置へ戻り、入力できなくなるため ref 経由で参照する。
    const onCloseRef = useRef(onClose);
    useLayoutEffect(() => {
        onCloseRef.current = onClose;
    });

    useEffect(() => {
        if (!open) return;
        const token = Symbol("modal");
        stack.push(token);
        const container = containerRef.current;
        const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;

        (initialFocusRef?.current ?? container?.querySelector<HTMLElement>(FOCUSABLE))?.focus();

        function onKey(e: KeyboardEvent) {
            if (stack[stack.length - 1] !== token) return;
            if (e.key === "Escape") {
                onCloseRef.current();
                return;
            }
            if (e.key !== "Tab" || !container) return;
            // 非表示の要素（display: none など）は Tab の巡回から外す。
            // checkVisibility がない環境（古いブラウザやテスト用の DOM）では表示中とみなす。
            const focusables = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
                (el) => el.checkVisibility?.() ?? true,
            );
            if (focusables.length === 0) {
                e.preventDefault();
                return;
            }
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement;
            const outside = !container.contains(active);
            if (e.shiftKey && (active === first || outside)) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && (active === last || outside)) {
                e.preventDefault();
                first.focus();
            }
        }

        document.addEventListener("keydown", onKey);
        const prevOverflow = document.body.style.overflow;
        if (lockScroll) document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKey);
            stack.splice(stack.indexOf(token), 1);
            if (lockScroll) document.body.style.overflow = prevOverflow;
            // 開く前にフォーカスしていた要素が残っていれば、そこへ戻す。
            if (previouslyFocused?.isConnected) previouslyFocused.focus();
        };
    }, [open, containerRef, initialFocusRef, lockScroll]);
}
