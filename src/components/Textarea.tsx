import type { TextareaHTMLAttributes } from "react";

// アプリ共通の複数行入力。Input と同じトークン（rounded-control / border-control-border / px-4）に揃える。
// 高さは rows、伸縮方向は className（既定 resize-y）で調整する。
const BASE =
    "w-full resize-y rounded-control border border-control-border px-4 py-2 text-sm text-ink transition-colors placeholder:text-faint focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Textarea({ className = "", ...props }: Props) {
    return <textarea className={`${BASE} ${className}`} {...props} />;
}
