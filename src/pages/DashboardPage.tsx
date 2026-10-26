import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, CheckSquare, FileText, HardDrive, Users, type LucideIcon } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Checkbox from "@/components/Checkbox";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { SAMPLE_ACTIVITY, SAMPLE_STATS, SAMPLE_TASKS, SAMPLE_WEEKLY_ACTIVITY } from "@/data/sample";
import { useDisplaySettings } from "@/context/DisplaySettings";

const STAT_ICONS: Record<(typeof SAMPLE_STATS)[number]["key"], LucideIcon> = {
    documents: FileText,
    members: Users,
    tasks: CheckSquare,
    storage: HardDrive,
};

export default function DashboardPage() {
    const navigate = useNavigate();
    const { formatDateTime } = useDisplaySettings();
    const [tasks, setTasks] = useState(SAMPLE_TASKS);
    const max = Math.max(...SAMPLE_WEEKLY_ACTIVITY.map((d) => d.count));
    const total = SAMPLE_WEEKLY_ACTIVITY.reduce((sum, d) => sum + d.count, 0);

    return (
        <>
            <PageHeader
                title="ダッシュボード"
                description="ワークスペースの概要（表示はすべてサンプルデータです）"
                actions={
                    <Button variant="tonal" size="sm" onClick={() => navigate("/documents")}>
                        ドキュメントを開く
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                }
            />

            <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                {SAMPLE_STATS.map((s) => (
                    <StatCard key={s.key} label={s.label} value={s.value} hint={s.hint} icon={STAT_ICONS[s.key]} />
                ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Card className="p-5 lg:col-span-2">
                    <div className="flex items-baseline justify-between gap-4">
                        <h2 className="text-base font-medium text-ink">直近 7 日の更新</h2>
                        <p className="text-sm text-muted tabular-nums">合計 {total} 件</p>
                    </div>
                    <div className="mt-6 flex h-48 items-end gap-3" role="img" aria-label={`直近7日の更新件数。合計${total}件`}>
                        {SAMPLE_WEEKLY_ACTIVITY.map((d) => (
                            <div key={d.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                                <span className="text-xs text-muted tabular-nums">{d.count}</span>
                                <div
                                    className="w-full max-w-10 rounded-t-md bg-brand/80 transition-colors hover:bg-brand"
                                    style={{ height: `${(d.count / max) * 100}%` }}
                                />
                                <span className="text-xs text-faint">{d.day}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-5">
                    <h2 className="text-base font-medium text-ink">はじめにやること</h2>
                    <ul className="mt-4 flex flex-col gap-3">
                        {tasks.map((t) => (
                            <li key={t.id} className="flex items-center gap-3">
                                <Checkbox
                                    checked={t.done}
                                    label={t.label}
                                    onChange={() =>
                                        setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))
                                    }
                                />
                                <span className={`text-sm ${t.done ? "text-faint line-through" : "text-ink"}`}>{t.label}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>

            <Card className="mt-4 p-5">
                <h2 className="text-base font-medium text-ink">最近のアクティビティ</h2>
                <ul className="mt-2 divide-y divide-hairline">
                    {SAMPLE_ACTIVITY.map((a) => (
                        <li key={a.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
                            <p className="text-sm text-ink">
                                <span className="font-medium">{a.who}</span>
                                <span className="text-muted"> が{a.action}</span>
                            </p>
                            <time dateTime={a.at} className="text-xs text-faint tabular-nums">
                                {formatDateTime(a.at)}
                            </time>
                        </li>
                    ))}
                </ul>
            </Card>
        </>
    );
}
