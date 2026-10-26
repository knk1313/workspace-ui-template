import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

// フィルターチップ風のセレクト。ネイティブ <select> の挙動・アクセシビリティは
// 保ったまま、pill 形＋シェブロンで見た目だけ揃える。active 時は淡いブルーの塗り。
// block を付けるとフォーム項目用に全幅（Input と横幅を揃える）になる。
type Props = SelectHTMLAttributes<HTMLSelectElement> & { active?: boolean; block?: boolean };

export default function Select({ active = false, block = false, className = "", children, ...props }: Props) {
    return (
        <div className={`relative ${block ? "flex w-full" : "inline-flex"}`}>
            <select
                className={`h-9 cursor-pointer appearance-none rounded-control border pl-4 pr-9 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 ${
                    block ? "w-full" : ""
                } ${
                    active
                        ? "border-transparent bg-nav-active font-medium text-nav-ink"
                        : "border-control-border text-ink hover:bg-surface-2"
                } ${className}`}
                {...props}
            >
                {children}
            </select>
            <ChevronDown
                className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 ${active ? "text-nav-ink" : "text-muted"}`}
            />
        </div>
    );
}
