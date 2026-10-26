import { useEffect, useRef, useState } from "react";
import { LogOut } from "lucide-react";

type Props = {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    // ログアウト時の処理（認証ライブラリ等に合わせて差し替える）。
    onSignOut: () => void;
};

// 頭文字（アバター画像が無いときのフォールバック）。
function initial(name?: string | null, email?: string | null): string {
    const s = (name || email || "?").trim();
    return s ? s[0].toUpperCase() : "?";
}

// アカウントメニュー。丸いアバターをクリックで
// 名前・メール・ログアウトのメニューを開く（外側クリック / Esc で閉じる）。
export default function UserMenu({ name, email, image, onSignOut }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

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

    const avatar = image ? (
        <img src={image} alt="" referrerPolicy="no-referrer" className="h-9 w-9 rounded-full object-cover" />
    ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-nav-active text-sm font-semibold text-nav-ink">
            {initial(name, email)}
        </span>
    );

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label="アカウント"
                className="flex items-center rounded-full p-0.5 transition-shadow hover:ring-4 hover:ring-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
                {avatar}
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-surface bg-surface shadow-panel ring-1 ring-hairline"
                >
                    <div className="flex items-center gap-3 px-4 py-4">
                        {avatar}
                        <div className="min-w-0">
                            {name && <div className="truncate text-sm font-semibold text-ink">{name}</div>}
                            <div className="truncate text-xs text-muted">{email}</div>
                        </div>
                    </div>
                    <div className="h-px bg-hairline" />
                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                            setOpen(false);
                            onSignOut();
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-ink"
                    >
                        <LogOut className="h-4 w-4" />
                        ログアウト
                    </button>
                </div>
            )}
        </div>
    );
}
