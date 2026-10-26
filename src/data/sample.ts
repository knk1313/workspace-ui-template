// 画面表示用の架空サンプルデータ。実在の組織・人物・数値とは関係ありません。
// 実データに差し替えるときは、このファイルを API 呼び出し等に置き換える。
import type { Status } from "@/components/StatusBadge";

export const CURRENT_USER = {
    name: "Sample User",
    email: "user@example.com",
};

export type DocumentType = "note" | "spec" | "report" | "guide";

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
    note: "メモ",
    spec: "仕様書",
    report: "レポート",
    guide: "ガイド",
};

export type SampleDocument = {
    id: string;
    title: string;
    type: DocumentType;
    status: Status;
    owner: string;
    /** ISO 8601 */
    updatedAt: string;
    /** 作成時に入力する任意のメモ。 */
    memo?: string;
};

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
    { id: "doc-001", title: "はじめに — ワークスペースの使い方", type: "guide", status: "done", owner: "Alex Kim", updatedAt: "2026-10-24T09:30:00Z" },
    { id: "doc-002", title: "UI コンポーネント一覧", type: "spec", status: "done", owner: "Sample User", updatedAt: "2026-10-23T14:10:00Z" },
    { id: "doc-003", title: "週次ミーティングのメモ（サンプル）", type: "note", status: "draft", owner: "Jamie Lee", updatedAt: "2026-10-22T08:00:00Z" },
    { id: "doc-004", title: "画面遷移の設計メモ", type: "spec", status: "pending", owner: "Sample User", updatedAt: "2026-10-21T16:45:00Z" },
    { id: "doc-005", title: "アクセシビリティ確認リスト", type: "guide", status: "pending", owner: "Morgan Chen", updatedAt: "2026-10-20T11:20:00Z" },
    { id: "doc-006", title: "月次サマリー（ダミーデータ）", type: "report", status: "processing", owner: "Alex Kim", updatedAt: "2026-10-19T10:05:00Z" },
    { id: "doc-007", title: "デザイントークンの命名規則", type: "spec", status: "done", owner: "Jamie Lee", updatedAt: "2026-10-17T13:40:00Z" },
    { id: "doc-008", title: "読み込みに失敗したサンプル", type: "report", status: "failed", owner: "Morgan Chen", updatedAt: "2026-10-15T07:55:00Z" },
    { id: "doc-009", title: "アイデア置き場", type: "note", status: "draft", owner: "Sample User", updatedAt: "2026-10-12T18:30:00Z" },
];

export const SAMPLE_STATS = [
    { key: "documents", label: "ドキュメント", value: "128", hint: "今週 +12" },
    { key: "members", label: "メンバー", value: "8", hint: "招待中 2" },
    { key: "tasks", label: "未完了タスク", value: "23", hint: "期限切れ 3" },
    { key: "storage", label: "ストレージ", value: "4.2 GB", hint: "上限 10 GB" },
] as const;

// 直近 7 日の更新件数（棒グラフ用のダミー値）。
export const SAMPLE_WEEKLY_ACTIVITY = [
    { day: "月", count: 12 },
    { day: "火", count: 18 },
    { day: "水", count: 9 },
    { day: "木", count: 22 },
    { day: "金", count: 16 },
    { day: "土", count: 4 },
    { day: "日", count: 6 },
];

export const SAMPLE_ACTIVITY = [
    { id: "a1", who: "Alex Kim", action: "「はじめに — ワークスペースの使い方」を更新しました", at: "2026-10-24T09:30:00Z" },
    { id: "a2", who: "Sample User", action: "「UI コンポーネント一覧」を公開しました", at: "2026-10-23T14:10:00Z" },
    { id: "a3", who: "Jamie Lee", action: "「週次ミーティングのメモ（サンプル）」を作成しました", at: "2026-10-22T08:00:00Z" },
    { id: "a4", who: "Morgan Chen", action: "「アクセシビリティ確認リスト」にコメントしました", at: "2026-10-20T11:20:00Z" },
];

export const SAMPLE_TASKS = [
    { id: "t1", label: "サンプルデータを実データに差し替える", done: true },
    { id: "t2", label: "アプリ名とロゴを変更する", done: false },
    { id: "t3", label: "@theme のブランドカラーを調整する", done: false },
    { id: "t4", label: "認証ライブラリを UserMenu に接続する", done: false },
];
