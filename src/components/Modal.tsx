import { X } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { useModalBehavior } from "@/hooks/useModalBehavior";

type Props = {
    onClose: () => void;
    /** スクリーンリーダー向けのダイアログ名。 */
    label?: string;
    children: ReactNode;
};

// モーダルの共通シェル。暗幕（クリックで閉じる）＋右上の閉じる✕。
// 中身は children 側で組み立てる。閉じるのは暗幕そのものを押したときだけで、
// children の中をクリックしても閉じない（利用側で stopPropagation を書く必要はない）。
export default function Modal({ onClose, label = "ダイアログ", children }: Props) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);

    useModalBehavior({ onClose, containerRef: dialogRef, initialFocusRef: closeRef });

    return (
        <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/70 p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="閉じる"
                className="absolute right-4 top-4 z-10 text-on-dark/80 transition-colors hover:text-on-dark"
            >
                <X className="h-6 w-6" />
            </button>
            {children}
        </div>
    );
}
