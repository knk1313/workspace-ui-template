import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderApp } from "@/test/renderApp";
import { STORAGE_KEY } from "./DisplaySettings";

// 「はじめに — ワークスペースの使い方」の更新日時（2026-10-24T09:30:00Z）のセル。
function firstUpdatedAt() {
    const row = within(screen.getByRole("table")).getByText("はじめに — ワークスペースの使い方").closest("tr")!;
    return row.querySelectorAll("td")[5].textContent;
}

describe("日付の表示設定", () => {
    it("設定画面で保存した形式が、再読み込み後も日付表示に使われる", async () => {
        const first = renderApp("/settings");
        await first.user.selectOptions(screen.getByDisplayValue("日本（年/月/日 24時間）"), "en-US");
        await first.user.selectOptions(screen.getByDisplayValue("Asia/Tokyo"), "America/New_York");
        await first.user.click(screen.getByRole("button", { name: "保存" }));
        first.unmount();

        // 再読み込みの代わりに描画し直す（保存先の localStorage はそのまま）。
        renderApp("/documents");
        expect(firstUpdatedAt()).toBe("10/24/2026, 05:30 AM");
    });

    it("保存値が不正なら、項目ごとに既定値へ戻して表示する", () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ locale: "en-US", timeZone: "Mars/Olympus_Mons" }));
        renderApp("/documents");
        // ロケールは有効なので en-US、タイムゾーンは既定の Asia/Tokyo。
        expect(firstUpdatedAt()).toBe("10/24/2026, 06:30 PM");
    });

    it("保存値が JSON として読めなくても、既定値で表示する", () => {
        localStorage.setItem(STORAGE_KEY, "{broken");
        renderApp("/documents");
        expect(firstUpdatedAt()).toBe("2026/10/24 18:30");
    });
});
