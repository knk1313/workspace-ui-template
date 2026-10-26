import { useRef } from "react";
import { X } from "lucide-react";
import IconButton from "./IconButton";
import NavMenu from "./NavMenu";
import { appConfig } from "@/app.config";
import { useModalBehavior } from "@/hooks/useModalBehavior";

type Props = { open: boolean; onClose: () => void };

// モバイル（md 未満）のナビゲーション。左からスライドインするドロワー。
// 暗幕クリック / ✕ / Esc / 項目の選択で閉じる。閉じている間は inert で操作・読み上げの対象から外す。
export default function MobileNav({ open, onClose }: Props) {
    const closeRef = useRef<HTMLButtonElement>(null);
    const Logo = appConfig.logo;

    const panelRef = useRef<HTMLDivElement>(null);
    useModalBehavior({ open, onClose, containerRef: panelRef, initialFocusRef: closeRef });


    return (
        <div className={`fixed inset-0 z-50 md:hidden ${open ? "" : "pointer-events-none"}`} inert={!open}>
            <div
                className={`absolute inset-0 bg-scrim/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
                aria-hidden
            />
            <div
                ref={panelRef}
                id="mobile-nav"
                role="dialog"
                aria-modal="true"
                aria-label="ナビゲーション"
                className={`absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col rounded-r-surface bg-canvas shadow-panel transition-transform duration-300 ease-expo ${
                    open ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex h-16 items-center gap-2 pl-5 pr-3">
                    <Logo className="h-6 w-6 text-brand" />
                    <span className="truncate text-lg font-medium tracking-wide text-ink">{appConfig.name}</span>
                    <IconButton ref={closeRef} onClick={onClose} aria-label="メニューを閉じる" className="ml-auto">
                        <X className="h-5 w-5" />
                    </IconButton>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">
                    <NavMenu onNavigate={onClose} />
                </div>
            </div>
        </div>
    );
}
