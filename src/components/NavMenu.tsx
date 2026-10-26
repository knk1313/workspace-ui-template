import { NavLink } from "react-router";
import { appConfig } from "@/app.config";

type Props = {
    /** アイコンだけの細い表示（デスクトップのサイドバーを畳んだとき）。 */
    collapsed?: boolean;
    /** 項目を選んだときの処理（モバイルのドロワーを閉じるなど）。 */
    onNavigate?: () => void;
};

// app.config.ts の navigation を描画する。Sidebar と MobileNav で共有する。
export default function NavMenu({ collapsed = false, onNavigate }: Props) {
    return (
        <nav className="flex flex-col gap-5 px-3 py-2">
            {appConfig.navigation.map((section) => (
                <div key={section.title}>
                    {!collapsed && section.title && (
                        <p className="mb-1 whitespace-nowrap px-4 text-[11px] font-medium tracking-wide text-faint">
                            {section.title}
                        </p>
                    )}
                    <div className="flex flex-col gap-0.5">
                        {section.items.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.href}
                                    to={item.href}
                                    end
                                    onClick={onNavigate}
                                    title={collapsed ? item.label : undefined}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 whitespace-nowrap rounded-full py-2.5 text-sm transition-colors ${
                                            collapsed ? "justify-center px-3" : "pl-4 pr-3"
                                        } ${
                                            isActive
                                                ? "bg-nav-active font-medium text-nav-ink"
                                                : "text-muted hover:bg-surface-2 hover:text-ink"
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon className="h-5 w-5 shrink-0" strokeWidth={isActive ? 2.2 : 1.9} />
                                            {!collapsed && item.label}
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>
                </div>
            ))}
        </nav>
    );
}
