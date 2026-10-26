import type { LucideIcon } from "lucide-react";
import Card from "./Card";

type Props = {
    label: string;
    value: string;
    /** 値の下に添える補足（前週比など）。 */
    hint?: string;
    icon: LucideIcon;
};

// ダッシュボードの数値タイル。Card の上に ラベル / 値 / 補足 を並べる。
export default function StatCard({ label, value, hint, icon: Icon }: Props) {
    return (
        <Card className="flex items-start justify-between gap-4 p-4 sm:p-5">
            <div className="min-w-0">
                <p className="text-sm text-muted">{label}</p>
                <p className="mt-2 text-2xl font-normal leading-none sm:text-[28px] text-ink tabular-nums">{value}</p>
                {hint && <p className="mt-2 text-xs text-faint">{hint}</p>}
            </div>
            <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-nav-active text-nav-ink sm:flex">
                <Icon className="h-5 w-5" />
            </span>
        </Card>
    );
}
