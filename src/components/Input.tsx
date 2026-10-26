import type { InputHTMLAttributes } from "react";

const BASE =
    "w-full rounded-control border border-control-border px-4 py-2 text-sm text-ink transition-colors placeholder:text-faint focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

type Props = InputHTMLAttributes<HTMLInputElement> & { label?: string };

// アプリ共通のテキスト入力（Drive 風の pill＋フォーカスリング）。
// number の spinner は非表示。寸法・フォーカス表現をここに集約する。
// label を渡すとフローティングラベル（フォーカス/入力ありで上枠へ浮上）になる。
export default function Input({ className = "", label, ...props }: Props) {
    if (!label) {
        return <input className={`${BASE} ${className}`} {...props} />;
    }
    // peer + placeholder-shown でラベルを浮上/戻す。ラベルは装飾なので aria-label で名前付けする。
    return (
        <div className="relative">
            <input className={`peer ${BASE} ${className}`} placeholder=" " aria-label={label} {...props} />
            <span
                aria-hidden
                className="pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-surface px-1 text-xs font-medium text-brand transition-all duration-200 ease-expo peer-placeholder-shown:top-1/2 peer-placeholder-shown:bg-transparent peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-faint peer-focus:top-0 peer-focus:bg-surface peer-focus:text-xs peer-focus:font-medium peer-focus:text-brand"
            >
                {label}
            </span>
        </div>
    );
}
