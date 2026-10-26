import type { HTMLAttributes } from "react";

// 面（サーフェス）の共通ラッパー。白地＋うすい罫＋surface 角丸。
// interactive を付けるとホバーで淡い影（リンク/クリック可能なカード用）。
type Props = HTMLAttributes<HTMLDivElement> & { interactive?: boolean };

export default function Card({ interactive = false, className = "", ...props }: Props) {
    return (
        <div
            className={`rounded-surface border border-hairline bg-surface ${
                interactive ? "transition-shadow hover:shadow-card" : ""
            } ${className}`}
            {...props}
        />
    );
}
