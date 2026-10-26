export type DateDisplay = { locale: string; timeZone: string };

// Intl.DateTimeFormat の生成は重いので、ロケールとタイムゾーンの組ごとに使い回す。
const formatters = new Map<string, Intl.DateTimeFormat>();

// ISO 8601 文字列を、指定したロケール・タイムゾーンの日時で表示する（例: ja-JP なら「2026/10/24 18:30」）。
// 画面からは useDisplaySettings().formatDateTime を使う。
export function formatDateTime(iso: string, { locale, timeZone }: DateDisplay): string {
    const key = `${locale}|${timeZone}`;
    let formatter = formatters.get(key);
    if (!formatter) {
        formatter = new Intl.DateTimeFormat(locale, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            timeZone,
        });
        formatters.set(key, formatter);
    }
    return formatter.format(new Date(iso));
}
