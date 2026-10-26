import { useCallback, useState } from "react";
import { Outlet } from "react-router";
import Header from "./Header";
import MobileNav from "./MobileNav";
import Sidebar from "./Sidebar";
import { ToastProvider } from "./Toast";
import { ConfirmProvider } from "./ConfirmDialog";
import { DisplaySettingsProvider } from "@/context/DisplaySettings";

// アプリ本体のレイアウト（ヘッダー + サイドバー + コンテンツ）。
// md 以上はサイドバーを常時表示し、md 未満ではヘッダーのメニューボタンからドロワーで開く。
export default function AppLayout() {
    const [navOpen, setNavOpen] = useState(false);
    const closeNav = useCallback(() => setNavOpen(false), []);

    return (
        <DisplaySettingsProvider>
            <ToastProvider>
                <ConfirmProvider>
                    {/* ヘッダー・サイドバー・コンテンツを同じ地(canvas)で一体化し、境界線を持たせない。 */}
                    <div className="flex h-full flex-col overflow-hidden bg-canvas">
                        <Header onMenuClick={() => setNavOpen(true)} menuOpen={navOpen} />
                        <div className="flex flex-1 overflow-hidden">
                            <Sidebar />
                            {/* コンテンツは白い面。md 以上では左上だけ丸めて地(canvas)と接する。 */}
                            <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
                                <div className="flex flex-1 flex-col overflow-y-auto bg-surface md:rounded-tl-surface">
                                    <div className="flex w-full flex-1 flex-col px-4 py-6 sm:px-8 sm:py-7">
                                        <Outlet />
                                    </div>
                                </div>
                            </main>
                        </div>
                        <MobileNav open={navOpen} onClose={closeNav} />
                    </div>
                </ConfirmProvider>
            </ToastProvider>
        </DisplaySettingsProvider>
    );
}
