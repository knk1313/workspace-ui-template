import type { MouseEvent } from "react";
import { Check } from "lucide-react";

type Props = {
    checked: boolean;
    /** クリックイベントを渡す（Link 内などで preventDefault したいケースに対応）。 */
    onChange: (e: MouseEvent<HTMLButtonElement>) => void;
    /** アクセシビリティ名。未指定なら選択状態から自動生成。 */
    label?: string;
    size?: "sm" | "md";
    /** overlay=画像サムネの上に重ねる用（未選択は半透明・ホバーで出る）。親に group が必要。 */
    variant?: "default" | "overlay";
    className?: string;
};

// 一括選択などで使う四角いチェックトグル（見た目統一のためのプリミティブ）。
// ネイティブ input ではなくトグルボタンとして描画する。
export default function Checkbox({
    checked,
    onChange,
    label,
    size = "sm",
    variant = "default",
    className = "",
}: Props) {
    const box = size === "md" ? "h-6 w-6" : "h-5 w-5";
    const icon = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
    // 白背景の上（default）と画像の上（overlay）で、未選択時の見え方だけ変える。
    const state = checked
        ? "border-brand bg-brand text-on-brand opacity-100"
        : variant === "overlay"
          ? "border-on-dark/80 bg-scrim/30 text-transparent opacity-0 group-hover:opacity-100"
          : "border-control-border text-transparent hover:border-muted";
    return (
        <button
            type="button"
            onClick={(e) => onChange(e)}
            aria-label={label ?? (checked ? "選択を解除" : "選択")}
            aria-pressed={checked}
            className={`flex ${box} shrink-0 items-center justify-center rounded-md border transition ${state} ${className}`}
        >
            <Check className={icon} />
        </button>
    );
}
