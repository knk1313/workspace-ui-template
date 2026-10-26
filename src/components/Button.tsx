import type { ButtonHTMLAttributes, Ref } from "react";

// アプリ共通のボタン。角丸は control(12px) に統一。
// filled(=primary) / outlined(=secondary) / tonal / text / danger（枠線・破壊操作の副次） /
// danger-filled（塗り・破壊操作の確定）。危険色はトークン(danger*)に集約。
type Variant = "primary" | "secondary" | "tonal" | "text" | "danger" | "danger-filled";
type Size = "md" | "sm";

// shrink-0 / whitespace-nowrap: 横並びの中でボタンが潰れてラベルが折り返す（「作 成」）のを防ぐ。
const BASE =
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50";

const SIZES: Record<Size, string> = {
    md: "h-10 px-5 text-sm",
    sm: "h-9 px-4 text-[13px]",
};

const VARIANTS: Record<Variant, string> = {
    primary: "bg-brand text-on-brand shadow-control hover:bg-brand-hover",
    secondary: "border border-hairline text-ink hover:bg-surface-2",
    tonal: "bg-nav-active text-nav-ink hover:brightness-95",
    text: "text-brand hover:bg-surface-2",
    danger: "border border-hairline text-ink hover:border-danger-border hover:bg-danger-surface hover:text-danger",
    "danger-filled": "bg-danger text-on-brand shadow-control hover:bg-danger-hover",
};

// React 19 では ref は通常の prop として関数コンポーネントに渡せる（forwardRef 不要）。
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; ref?: Ref<HTMLButtonElement> };

export default function Button({ variant = "primary", size = "md", className = "", type = "button", ...props }: Props) {
    return <button type={type} className={`${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${className}`} {...props} />;
}
