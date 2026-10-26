import { useState, type FormEvent, type ReactNode } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Checkbox from "@/components/Checkbox";
import Input from "@/components/Input";
import PageHeader from "@/components/PageHeader";
import Select from "@/components/Select";
import Textarea from "@/components/Textarea";
import { useConfirm } from "@/components/ConfirmDialog";
import { useToast } from "@/components/Toast";
import { appConfig } from "@/app.config";
import { CURRENT_USER } from "@/data/sample";
import { LOCALE_OPTIONS, TIME_ZONE_OPTIONS, useDisplaySettings } from "@/context/DisplaySettings";
import { formatDateTime } from "@/lib/format";

// 設定セクション（左に見出し+説明、右にフォーム）。
function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
    return (
        <Card className="grid grid-cols-1 gap-6 p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <div>
                <h2 className="text-base font-medium text-ink">{title}</h2>
                <p className="mt-1 text-sm text-muted">{description}</p>
            </div>
            <div className="flex flex-col gap-4">{children}</div>
        </Card>
    );
}

// 表示例に使う固定の日時（描画のたびに値が変わらないよう固定する）。
const SAMPLE_DATE = "2026-10-24T09:30:00Z";

const NOTIFICATIONS = [
    { key: "mentions", label: "メンションされたとき" },
    { key: "comments", label: "自分のドキュメントにコメントがついたとき" },
    { key: "weekly", label: "週次のまとめ" },
] as const;

type NotificationKey = (typeof NOTIFICATIONS)[number]["key"];

export default function SettingsPage() {
    const { toast } = useToast();
    const { confirm } = useConfirm();
    const [name, setName] = useState(CURRENT_USER.name);
    const [email, setEmail] = useState(CURRENT_USER.email);
    const [bio, setBio] = useState("");
    const [workspace, setWorkspace] = useState(appConfig.name);
    const display = useDisplaySettings();
    const [locale, setLocale] = useState(display.settings.locale);
    const [timeZone, setTimeZone] = useState(display.settings.timeZone);
    const [notify, setNotify] = useState<Record<NotificationKey, boolean>>({ mentions: true, comments: true, weekly: false });

    function handleSave(e: FormEvent) {
        e.preventDefault();
        // 日付の表示設定だけはアプリ全体に反映する。ほかの項目はサンプルのため保存しない。
        display.setSettings({ locale, timeZone });
        toast("設定を保存しました");
    }

    async function handleReset() {
        const ok = await confirm({
            title: "ワークスペースをリセットしますか？",
            message: "すべてのドキュメントと設定が初期状態に戻ります。この操作は取り消せません。",
            confirmLabel: "リセット",
            danger: true,
        });
        if (ok) toast("サンプルのためリセットは実行されません", "error");
    }

    return (
        <form onSubmit={handleSave} className="flex flex-col gap-4 pb-6">
            <PageHeader
                title="設定"
                breadcrumbs={[{ label: "ホーム", href: "/" }, { label: "設定" }]}
                actions={<Button type="submit">保存</Button>}
            />

            <Section title="プロフィール" description="他のメンバーに表示される情報です。">
                <Input label="表示名" value={name} onChange={(e) => setName(e.target.value)} />
                <Input label="メールアドレス" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="自己紹介（任意）" aria-label="自己紹介" />
            </Section>

            <Section title="ワークスペース" description="名前と日付の表示形式を設定します。日付の形式は保存すると全画面に反映されます。">
                <Input label="ワークスペース名" value={workspace} onChange={(e) => setWorkspace(e.target.value)} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
                        日付の形式
                        <Select block value={locale} onChange={(e) => setLocale(e.target.value)}>
                            {LOCALE_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </Select>
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
                        タイムゾーン
                        <Select block value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
                            {TIME_ZONE_OPTIONS.map((tz) => (
                                <option key={tz} value={tz}>
                                    {tz}
                                </option>
                            ))}
                        </Select>
                    </label>
                </div>
                <p className="text-sm text-muted">
                    表示例: <span className="text-ink tabular-nums">{formatDateTime(SAMPLE_DATE, { locale, timeZone })}</span>
                </p>
            </Section>

            <Section title="通知" description="メール通知を受け取るタイミングを選びます。">
                {NOTIFICATIONS.map((n) => (
                    <div key={n.key} className="flex items-center gap-3">
                        <Checkbox
                            checked={notify[n.key]}
                            label={n.label}
                            onChange={() => setNotify((prev) => ({ ...prev, [n.key]: !prev[n.key] }))}
                        />
                        <span className="text-sm text-ink">{n.label}</span>
                    </div>
                ))}
            </Section>

            <Card className="flex flex-wrap items-center justify-between gap-4 border-danger-border! p-6">
                <div>
                    <h2 className="text-base font-medium text-danger">危険な操作</h2>
                    <p className="mt-1 text-sm text-muted">ワークスペースを初期状態に戻します。</p>
                </div>
                <Button variant="danger" onClick={handleReset}>
                    リセット
                </Button>
            </Card>
        </form>
    );
}
