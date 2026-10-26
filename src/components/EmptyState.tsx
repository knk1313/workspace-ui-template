import type { ReactNode } from "react";

// 一覧が空のときの案内。アイコン・見出し・補足・任意のアクションを中央に置く。
export default function EmptyState({ icon, title, message, action }: { icon: ReactNode; title: string; message?: string; action?: ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <div className="text-faint">{icon}</div>
            <p className="text-sm font-medium text-ink">{title}</p>
            {message && <p className="text-sm text-muted">{message}</p>}
            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}
