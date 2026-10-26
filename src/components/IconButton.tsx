import type { ButtonHTMLAttributes, Ref } from "react";

// アイコンのみのボタン（閉じる✕・削除など）。丸型・ホバーで淡い塗り。
// danger を付けるとホバーで赤系。
type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    size?: "sm" | "md";
    tone?: "default" | "danger";
    ref?: Ref<HTMLButtonElement>;
};

const PAD: Record<"sm" | "md", string> = { sm: "p-1", md: "p-2" };
const TONE: Record<"default" | "danger", string> = {
    default: "text-muted hover:bg-surface-2 hover:text-ink",
    danger: "text-muted hover:bg-danger-surface hover:text-danger",
};

export default function IconButton({ size = "md", tone = "default", className = "", type = "button", ...props }: Props) {
    return (
        <button
            type={type}
            className={`inline-flex items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50 ${PAD[size]} ${TONE[tone]} ${className}`}
            {...props}
        />
    );
}
