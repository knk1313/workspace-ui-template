// アプリ全体の設定。テンプレートを自分のアプリにするときは、まずこのファイルを書き換える。
// index.html の <title> と description も、ビルド時にここの値で置き換える（vite.config.ts）。
// 画面の URL は navigation だけで定義する。各 URL の画面は src/routes.tsx で対応付ける。
import { FileText, Layers, LayoutDashboard, Settings, type LucideIcon } from "lucide-react";

export type NavItem = { readonly label: string; readonly href: string; readonly icon: LucideIcon };
export type NavSection = { readonly title: string; readonly items: readonly NavItem[] };

const navigation = [
    {
        title: "ナビゲーション",
        items: [{ label: "ダッシュボード", href: "/", icon: LayoutDashboard }],
    },
    {
        title: "ワークスペース",
        items: [{ label: "ドキュメント", href: "/documents", icon: FileText }],
    },
    {
        title: "管理",
        items: [{ label: "設定", href: "/settings", icon: Settings }],
    },
] as const satisfies readonly NavSection[];

/** navigation に定義した URL。src/routes.tsx はこのすべてに画面を割り当てる。 */
export type NavPath = (typeof navigation)[number]["items"][number]["href"];

export const appConfig = {
    /** ヘッダーとブラウザタイトルに表示するアプリ名。 */
    name: "Sample Workspace",
    /** index.html の meta description。 */
    description: "Vite + React + Tailwind CSS で作った管理画面のテンプレート",
    /** ヘッダーのアプリ名の左に置くアイコン。 */
    logo: Layers as LucideIcon,
    /** サイドバーのナビゲーション。項目を足したら src/routes.tsx に画面を足す。 */
    navigation,
    /** 日付表示の既定値。利用者は設定画面で変更できる。 */
    display: {
        locale: "ja-JP",
        timeZone: "Asia/Tokyo",
    },
};
