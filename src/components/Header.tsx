import { Link } from "react-router";
import { Menu } from "lucide-react";
import IconButton from "./IconButton";
import UserMenu from "./UserMenu";
import { useToast } from "./Toast";
import { appConfig } from "@/app.config";
import { CURRENT_USER } from "@/data/sample";

type Props = {
    /** モバイルでメニューボタンを押したとき（md 以上では表示しない）。 */
    onMenuClick: () => void;
    menuOpen: boolean;
};

export default function Header({ onMenuClick, menuOpen }: Props) {
    const { toast } = useToast();
    const Logo = appConfig.logo;

    return (
        // ヘッダーは地(canvas)に溶け込ませ、境界線を持たせない。
        <header className="w-full bg-canvas">
            <div className="flex h-16 items-center gap-2 pl-2 pr-4 md:gap-3 md:pl-7">
                <IconButton
                    onClick={onMenuClick}
                    aria-label="メニューを開く"
                    aria-expanded={menuOpen}
                    aria-controls="mobile-nav"
                    className="md:hidden"
                >
                    <Menu className="h-5 w-5" />
                </IconButton>
                <Link to="/" aria-label="ホーム" className="flex min-w-0 items-center gap-2 text-lg font-medium tracking-wide text-ink">
                    <Logo className="h-6 w-6 shrink-0 text-brand" />
                    <span className="truncate">{appConfig.name}</span>
                </Link>
                <div className="ml-auto">
                    <UserMenu
                        name={CURRENT_USER.name}
                        email={CURRENT_USER.email}
                        onSignOut={() => toast("サンプルのためログアウトは無効です")}
                    />
                </div>
            </div>
        </header>
    );
}
