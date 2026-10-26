import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import NavMenu from "./NavMenu";

// デスクトップ（md 以上）の常時表示サイドバー。狭い画面では MobileNav に切り替える。
export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={`hidden shrink-0 flex-col overflow-hidden bg-canvas transition-all md:flex ${collapsed ? "w-[68px]" : "w-60"}`}
        >
            <NavMenu collapsed={collapsed} />
            <button
                type="button"
                onClick={() => setCollapsed((c) => !c)}
                aria-label={collapsed ? "サイドバーを開く" : "サイドバーを閉じる"}
                className="mt-auto flex justify-end p-4 text-faint transition-colors hover:text-ink"
            >
                {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </button>
        </aside>
    );
}
